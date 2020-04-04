import mysql.connector
import sys
import csv
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
	#iterate to query through all tables
	for table in tables:
		currC = columns[table]
		currC[0] = '#' + currC[0]
		#create the csv to write to the file
		with open(table + '.csv', 'w', newline='') as file:
			writer = csv.writer(file, delimiter=',')
			writer.writerow(currC)
			#execute the query for curr table
			queryT = "SELECT * FROM " + table 
			cursor.execute(queryT)
			#add each row in the query to the csv
			for row in cursor:
				writer.writerow(row)
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