# Microsoft Storage Demos

Demo for Azure Storage


# Technical Prerequisites:

To get Microsoft Azure Account (Student Starter Account)
see https://catalog.imagine.microsoft.com/en-us/Catalog/Product/99 

#Step by Step Guides
See presentation Storage Demos
- Create Azure Account
- Create Azure Storage Account
- Use Azure Storage Explorer 
- Use Azure Blob Storage
- Use Azure Table

# Demos 

TeessideTestApp

- Parse the connection string and return a reference to the storage account     
- Create a CloudBlobClient to interact with your containers and blobs
- Read and write to blobs
- Create a Container if it does not exist
- Retrieve a reference to a container
- Create the container if it doesn't already exist.
- Set Permissions on the Container
- Upload a Blob
- Retrieve reference to a blob.
- Create or overwrite the "myblob" blob with contents from a local file.
- List Items in Container
- Delete a blob

TeessideTableDemo

- Parse the connection string and return a reference to the storage account.
- Create the table client.
- Retrieve a reference to the table.
- Create the table if it doesn't exist.
- Create a new customer entity.
- Create the TableOperation object that inserts the customer entity.
- Execute the insert operation.
- Create the batch operation.
- Create a customer entity and add it to the table.
- Create another customer entity and add it to the table.
- Add both customer entities to the batch insert operation.
- Execute the batch operation.
- Query the partition
- Construct the query operation for all customer entities where PartitionKey="Smith".
- Print the fields for each customer.
- Update an object
- Create a retrieve operation that takes a customer entity.
- Execute the operation.
- Assign the result to a CustomerEntity object.
- Change the phone number.
- Create the Replace TableOperation.
- Execute the operation.

#Azure Connection  
Remember to add your azure setting to app.config files in both Demos
add key="StorageConnectionString" value="DefaultEndpointsProtocol=https;AccountName=<account_name>;AccountKey=<account_key>
  
# Resources
-   The Container Channel: https://channel9.msdn.com/
-   Azure Documentation https://docs.microsoft.com/en-us/azure/ 

