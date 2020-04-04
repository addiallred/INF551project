import mysql.connector
import sys
import requests
import datetime
from decimal import Decimal
import json
import csv


#connect to fire base and write the data into the firebase
def firebaseDB(finalRes, databaseN):
	#get firebase url and do resquest dumping the data to a json object
	fireURL = 'https://project551-5d799.firebaseio.com/' + databaseN + '/.json'
	results = requests.put(fireURL, data=json.dumps(finalRes))
#connect and reead from db
def connectDB(databaseN):
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
		for row in cursor:
			tableData[row[0]] = []
			for i in range(len(row)):
				if i != 0:
					if type(row[i]) is Decimal:
						tableData[row[0]].append(float(row[i]))
					elif isinstance(row[i], datetime.date):
						tableData[row[0]].append(row[i].__str__())
					else:
						tableData[row[0]].append(row[i])
		finalRes[table] = tableData
	firebaseDB(finalRes, databaseN)
		#add each row in the query to the csv
	#close cursor and connection
	cursor.close()
	cnx.close()
#main
def main():
	assert len(sys.argv) >= 2, "Provide Database Please"
	connectDB(sys.argv[1])
#starting the main call
if __name__ == "__main__":
	main()