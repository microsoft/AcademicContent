import csv
import sys
from math import sin, cos, sqrt, atan2, radians
import datetime
import time

from azure.storage.blob import AppendBlobService

# Configure account name with the Azure Storage Account Name and the account Key from Storage Explorer
append_blob_service = AppendBlobService(
	account_name='storage_account_name', 
	account_key='storage_account_key')



# Reads the start and stop index passed in through SLURM
start = int(sys.argv[1])
stop = int(sys.argv[2])

#Creates the blob for this batch.
append_blob_service.create_blob('distances', str(start) + "-" + str(stop) + '.csv')


#Logs the start time
append_blob_service.append_blob_from_text('distances', 'log.txt', "Starting " + str(start) + "-" + str(stop) + ":" + datetime.datetime.fromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S') + "\n")
	



LatLongDict = {}
# radius of earth in miles
R = 3959.0

# Reads the airport data in to a list for easy access.
with open('airports-world.csv') as csvfile:
	reader = csv.DictReader(csvfile)
	for row in reader:
		LatLongDict[row['LocationID']] = [row['Latitude'], row['Longitude']]
		
		
#Creates the column names for the distance table
fieldnames = "id"
for code1 in LatLongDict:
    fieldnames+= "," + code1
	
fieldnames += "\n"
append_blob_service.append_blob_from_text('distances', str(start) + "-" + str(stop) + '.csv', fieldnames)


rowIdx = 0
count = 0
batchCount = 0;

rows = ""

#This function appends to rows to the Append Blob in Azures Storage.
def appendBlob(rowStr):
	while True:
		try:
			append_blob_service.append_blob_from_text('distances', str(start) + "-" + str(stop) + '.csv', rowStr)
			break
		except:
			print("error posting rows-- trying again")
	
for code1 in LatLongDict:

	if(rowIdx >= start and rowIdx <= stop):
	
		lat1 = radians(float(LatLongDict[code1][0]))
		lon1 = radians(float(LatLongDict[code1][1]))

		rows += code1
		
		#outputs progress.
		if count % 10 == 0:
			print(str(start) + "-" + str(stop) + ": Processing " + str(count) + " of " + str(stop - start) + " airports.")

		count += 1

		# Selects the destination airport, then calculates the distance between it 
		# and the origin using the distance over sphere based on the latitude and longitude.
		for code2 in LatLongDict:

			#calculates the distances between two airports over the surface of the earth.
			lat2 = radians(float(LatLongDict[code2][0]))
			lon2 = radians(float(LatLongDict[code2][1]))
			dlon = lon2 - lon1
			dlat = lat2 - lat1
			a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
			c = 2 * atan2(sqrt(a), sqrt(1 - a))
			distance = R * c

			rows += "," + str(round(distance, 2))

			
		rows+="\n"

		#Appends 100 rows at a time to the storage blob.
		
		if count % 100 == 0:
			appendBlob(rows)
			rows=""
		
	rowIdx += 1
	
#Appends any final rows if not already appended.
if count % 100 != 0:
	appendBlob(rows)
	
	
#Logs the finish time
append_blob_service.append_blob_from_text('distances', 'log.txt', "Finishing " + str(start) + "-" + str(stop) + ":" + datetime.datetime.fromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S') + "\n")
