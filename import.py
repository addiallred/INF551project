import mysql.connector
import sys
import requests
import datetime
import decimal
import json
import csv
from decimal import Decimal

class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            return float(o)
        if isinstance(o, (datetime.date, datetime.datetime)):
        	return o.__str__()
        return super(DecimalEncoder, self).default(o)
       
    
#connect to fire base and write the data into the firebase
def firebaseDB(finalRes, databaseN, fireURL):
	#get firebase url and do resquest dumping the data to a json object
	fireURL = fireURL + databaseN + '/.json'
	results = requests.put(fireURL, data=json.dumps(finalRes,  cls=DecimalEncoder))
#connect and reead from db
def connectDB(databaseN, url):
	#connect to the database provided
	cnx = mysql.connector.connect(user='inf551', password='inf551', host='127.0.0.1', database=databaseN)
	#createe the cursor to read from the database
	cursor = cnx.cursor()
	#create query for the table names
	queryTables = "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = '" + databaseN + "'"
	#creating cursor for query
	cursor.execute(queryTables)
	tables = []
	columns = {}
	#getting all the table names from the query
	for tablesC in cursor:
		tables.append(tablesC[0])
	for table in tables:
		#query all the column names for each table
		queryColumns = "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = '" + databaseN + "' AND TABLE_NAME = '" + table + "'"
		cursor.execute(queryColumns)
		tempC = []
		typeC = []
		for col in cursor:			
			#append each found column
			tempC.append(col[0])
		#create the column tables
		columns[table] = tempC;
	#dictionary to push to firebase
	finalRes = {}
	#iterate to query through all tables
	for table in tables:
		currC = columns[table]
		queryT = "SELECT * FROM " + table 
		cursor.execute(queryT)
		tableData = {}
		test = {}
		for row in cursor:
			rowData = {}
			row = list(row)
			row.append(table)
			row.append([])
			tableData[row[0]] = []
			for i in range(len(row)-2):
				words = []
				if(isinstance(row[i], str)):
					split = row[i].lower()
					words = split.split(" ")
				elif isinstance(row[i], decimal.Decimal):
        			 word = float(row[i])
				else: 
					words.append(str(row[i]))
				for word in words:
					key = word
					if(isinstance(word, str)):
						key = word.lower()
						key = ''.join(e for e in key if e.isalnum())
					if key: 
						if key in rowData.keys():
							row[-1] = rowData[key]
						if key in tableData.keys():
							if row not in tableData[key]: 
								row[-1].append(i)
								rowData[key] = row[-1]
								final = []
								for d in row:
									final.append(d)
								tableData[key].append(final)
							else:
								if i not in rowData[key]:
									index = tableData[key].index(row)
									row[-1].append(i)
									rowData[key] = row[-1]
						else:
							tableData[key] = []
							row[-1].append(i)
							rowData[key] = row[-1]
							final = []
							for d in row:
								final.append(d)
							tableData[key].append(final)
					row[-1] = []
			
		finalRes[table] = tableData
	foreginKeys = {}
	for table in tables:
		currC = columns[table]
		queryT = "SELECT * FROM " + table 
		cursor.execute(queryT)
		tableData = {}
		for row in cursor:
			row = list(row)
			row.append(table)
			row.append("fk_s")
			if row[0] in tableData:
				tableData[row[0]].append(row)
			else:
				tableData[row[0]] = []
				tableData[row[0]].append(row)
		foreginKeys[table] = tableData
		final = {}
		final["search"] = finalRes
		final["f_keys"] = foreginKeys
	firebaseDB(final, databaseN, url)
		#add each row in the query to the csv
	#close cursor and connection
	cursor.close()
	cnx.close()
#main
def main():
	assert len(sys.argv) >= 2, "Provide Database Please"
	connectDB(sys.argv[1], sys.argv[2])
#starting the main call
if __name__ == "__main__":
	main()