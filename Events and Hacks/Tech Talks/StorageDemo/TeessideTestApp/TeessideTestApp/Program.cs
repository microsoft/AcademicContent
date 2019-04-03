using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure; // Namespace for CloudConfigurationManager
using Microsoft.WindowsAzure.Storage; // Namespace for CloudStorageAccount
using Microsoft.WindowsAzure.Storage.Blob; // Namespace for Blob storage types


namespace TeessideTestApp
{
    class Program
    {
        static void Main(string[] args)
        {
            // Parse the connection string and return a reference to the storage account.
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(CloudConfigurationManager.GetSetting("StorageConnectionString"));

            //Create a CloudBlobClient to interact with your containers and blobs
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
            Console.WriteLine("Created Cloud Blob Client to operate with Blob Storage");
            Console.ReadLine();
            
            //Now ready to read and write to blobs

            //Create a Container if it does not exist
            // Retrieve a reference to a container.
            CloudBlobContainer container = blobClient.GetContainerReference("data");
            // Create the container if it doesn't already exist.
            container.CreateIfNotExists();

            Console.WriteLine("Container Name: " + container.Name);
            Console.ReadLine();

            //Set Permissions on the Container
            container.SetPermissions(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });


            //Upload a Blob
            // Retrieve reference to a blob.
            CloudBlockBlob blockBlob = container.GetBlockBlobReference("windows10_ninjacat");

            // Create or overwrite the "myblob" blob with contents from a local file.
            using (var fileStream = System.IO.File.OpenRead(@"..\..\ninjacat.png"))
            {
                blockBlob.UploadFromStream(fileStream);
            }



            //List Items in Container
            foreach (IListBlobItem item in container.ListBlobs(null, false))
            {
                if (item.GetType() == typeof(CloudBlockBlob))
                {
                    CloudBlockBlob blob = (CloudBlockBlob)item;

                    Console.WriteLine("Block blob of length {0}: {1}", blob.Properties.Length, blob.Uri);

                }
                else if (item.GetType() == typeof(CloudPageBlob))
                {
                    CloudPageBlob pageBlob = (CloudPageBlob)item;

                    Console.WriteLine("Page blob of length {0}: {1}", pageBlob.Properties.Length, pageBlob.Uri);

                }
                else if (item.GetType() == typeof(CloudBlobDirectory))
                {
                    CloudBlobDirectory directory = (CloudBlobDirectory)item;

                    Console.WriteLine("Directory: {0}", directory.Uri);
                }
            }
            Console.ReadLine();


            //Delete a blob
            blockBlob.Delete();
            Console.WriteLine("Deleted NinjaCat Picture");
            Console.ReadLine();
        }
    }
}
