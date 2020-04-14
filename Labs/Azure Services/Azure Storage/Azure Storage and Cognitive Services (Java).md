<a name="HOLTitle"></a>
# Azure Storage and Cognitive Services #

Microsoft Azure Storage is a set of services that allows you to store large volumes of data in a cost-effective manner and in a way that makes the data readily and reliably available to services and applications that consume it. Data committed to Azure Storage can be stored in blobs, tables, queues, or files. [Azure blobs](http://azure.microsoft.com/en-us/services/storage/blobs/) are ideal for storing images, videos, and other types of data, and are frequently used to provide input to and capture output from other Azure services such as [Azure Stream Analytics](http://azure.microsoft.com/en-us/services/stream-analytics/). [Azure tables](http://azure.microsoft.com/en-us/services/storage/tables/) provide NoSQL storage for semi-structured data. [Azure queues](http://azure.microsoft.com/en-us/services/storage/queues/) support queued message transfers between applications (or parts of applications) and can be used to make applications more scalable and robust by loosely coupling them together. Finally, [Azure Files](http://azure.microsoft.com/en-us/services/storage/files) use the Server Message Block (SMB) protocol to share files through the cloud and access storage as network drives.

Data stored in Microsoft Azure Storage can be accessed over HTTP or HTTPS using straightforward REST APIs, or it can be accessed using rich client libraries available for many popular languages and platforms, including .NET, Java, Android, Node.js, PHP, Ruby, and Python. The [Azure Portal](https://portal.azure.com) includes features for working with Azure Storage, but richer functionality is available from third-party tools, many of which are free and some of which work cross-platform.

In this lab, you will use Eclipse to write a Java Web site that accepts images uploaded by users and stores the images in Azure blob storage. You will learn how to read and write blobs in Java, and how to use blob metadata to attach additional information to the blobs you create. You will also get first-hand experience using [Microsoft Cognitive Services](https://www.microsoft.com/cognitive-services/), a set of intelligence APIs for building smart applications. Specifically, you'll submit each image uploaded by the user to Cognitive Services' [Computer Vision API](https://www.microsoft.com/cognitive-services/en-us/computer-vision-api) to generate a caption for the image as well as search metadata describing the contents of the image. And you will discover how easy it is to deploy apps to the cloud using Eclipse and the Azure Toolkit for Eclipse.

<a name="Objectives"></a>
### Objectives ###

In this hands-on lab, you will learn how to:

- Create a storage account and storage containers using the Azure Portal
- Create a Web app in Eclipse and deploy it to Azure
- Read and write blobs and attach metadata to them
- Use the Computer Vision API to extract information from images
- Use the cross-platform [Microsoft Azure Storage Explorer](http://storageexplorer.com/) to work with Azure Storage

<a name="Prerequisites"></a>
### Prerequisites ###

The following are required to complete this hands-on lab:

- An active Microsoft Azure subscription. If you don't have one, [sign up for a free trial](http://aka.ms/WATK-FreeTrial).
- [Microsoft Azure Storage Explorer](http://storageexplorer.com/)
- [Java SE Development Kit](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
- [Eclipse](https://www.eclipse.org/downloads/)
- [Azure Toolkit for Eclipse](https://docs.microsoft.com/en-us/azure/azure-toolkit-for-eclipse)

<a name="Resources"></a>
### Resources ###

[Click here](https://a4r.blob.core.windows.net/public/cs-storage-resources.zip) to download a zip file containing the resources used in this lab. Copy the contents of the zip file into a folder on your hard disk.

<a name="Cost"></a>
### Cost ###

![](Images/cost-1.png)

The cost of this lab is **low**. For an overview of cost ratings, refer to [Explanation of Costs](../../Costs.md).

<a name="Exercises"></a>
## Exercises ##

This hands-on lab includes the following exercises:

- [Exercise 1: Create a storage account](#Exercise1)
- [Exercise 2: Run the Microsoft Azure Storage Explorer](#Exercise2)
- [Exercise 3: Get a subscription key for the Computer Vision API](#Exercise3)
- [Exercise 4: Set up Java and Eclipse](#Exercise4)
- [Exercise 5: Create a photo-upload app](#Exercise5)
- [Exercise 6: Test the app locally](#Exercise6)
- [Exercise 7: Deploy the app to Azure](#Exercise7)

<a name="Exercise1"></a>

Estimated time to complete this lab: **60** minutes.

---

<a name="Exercise1"></a>
## Exercise 1: Create a storage account

The [Azure Portal](https://portal.azure.com) allows you to perform basic storage operations such as creating storage accounts, creating containers, uploading and downloading blobs, and managing access keys. In this exercise, you will use the portal to create a storage account. Then you'll create a pair of containers: one to store images uploaded by the user, and another to store image thumbnails generated from the uploaded images.

1. Open the [Azure Portal](https://portal.azure.com) in your browser. If you are asked to log in, do so using your Microsoft account.
 
1. To create a storage account, click **+ Create a resource** in the ribbon on the left. Then click **Storage**, followed by **Storage account**.

    ![Creating a storage account](Images/new-storage-account.png)

    _Creating a storage account_

1. Enter a unique name for the storage account in **Name** field and make sure a green check mark appears next to it. The name is important, because it forms one part of the URL through which blobs created under this account are accessed. Place the storage account in a new resource group named "IntellipixResources," and select the region nearest you. Finish up by clicking the **Review + create** button at the bottom of the blade to create the new storage account.

	> Storage account names can be 3 to 24 characters in length and can only contain numbers and lowercase letters. In addition, the name you enter must be unique within Azure. If someone else has chosen the same name, you'll be notified that the name isn't available with a red exclamation mark in the **Name** field.
   
	![Specifying parameters for a new storage account](Images/create-storage-account.png)

    _Specifying parameters for a new storage account_

1. Click **Resource groups** in the ribbon on the left. Then click the "IntellipixResources" resource group.

    ![Opening the resource group](Images/open-resource-group.png)

    _Opening the resource group_

1. In the blade that opens for the resource group, click the storage account you just created. If the storage account isn't there yet, you can click **Refresh** at the top of the blade until it appears.
 
    ![Opening the new storage account](Images/open-storage-account.png)

    _Opening the new storage account_

1. In the blade for the storage account, click **Blobs** to view a list of containers associated with this account.

    ![Viewing blob containers](Images/view-containers.png)

    _Viewing blob containers_

1. The storage account currently has no containers. Before you can create a blob, you must create a container to store it in. Click **+ Container** to create a new container. Type "photos" (without quotation marks) into the **Name** field and select **Blob** as the **Public access level**. Then click **OK** to create a container named "photos."

	> By default, containers and their contents are private. Selecting **Blob** as the access level makes the blobs in the "photos" container publicly accessible, but doesn't make the container itself public. This is what you want since the images stored in the "photos" container will be linked to from a Web app. 

    ![Creating a "photos" container](Images/create-photos-container.png)

    _Creating a "photos" container_

1. Repeat the previous step to create a container named "thumbnails," once more ensuring that the container's **Public access level** is set to **Blob**.

1. Confirm that both containers appear in the list of containers for this storage account, and that the names are spelled correctly.

    ![The new containers](Images/new-containers.png)

    _The new containers_

1. Close the "Blob service" blade. Click **Access keys** in the menu on the left side of the storage-account blade, and then click the **Copy** button next to **KEY** for **key1**. Paste this access key into your favorite text editor for later use.

    ![Copying the access key](Images/copy-storage-account-access-key.png)

    _Copying the access key_

You have now created a storage account to hold images uploaded to the app you're going to build, and containers to store the images in. Note that you *could* create these containers from within the app. Whether to create them programmatically or create them as part of the provisioning process is a choice that's left up to app developers.

<a name="Exercise2"></a>
## Exercise 2: Run the Microsoft Azure Storage Explorer

The [Microsoft Azure Storage Explorer](http://storageexplorer.com/) is a free tool that provides a graphical interface for working with Azure Storage on PCs running Windows, macOS, and Linux. It provides most of the same functionality as the Azure Portal. It also offers features the portal does not, such as the ability to view blob metadata. In this exercise, you will use the Microsoft Azure Storage Explorer to view the containers you created in Exercise 1.

1. If you haven't installed Storage Explorer or would like to make sure you're running the latest version, go to http://storageexplorer.com/ and download and install it.

1. Start Storage Explorer. If you are asked to log in, do so using your Microsoft account — the same one that you used to log in to the Azure Portal. If you don't see the storage account created in the previous exercise in Storage Explorer's left pane, click the **Manage Accounts** button highlighted below and ensure that your Microsoft account *and* the subscription used to create the storage account have been added to Storage Explorer.

    ![Managing accounts in Storage Explorer](Images/add-account.png)

    _Managing accounts in Storage Explorer_

1. Click the small arrow next to the storage account you created in Exercise 1 to display its contents, and then click the arrow next to **Blob Containers**. Confirm that the containers you created in Exercise 1 appear in the list.

    ![Viewing blob containers](Images/storage-explorer.png)

    _Viewing blob containers_

The containers are currently empty, but that will change once your app is deployed and you start uploading photos. Having Storage Explorer installed will make it easy for you to see what your app writes to blob storage.

<a name="Exercise3"></a>
## Exercise 3: Get a subscription key for the Computer Vision API

[Microsoft Cognitive Services](https://www.microsoft.com/cognitive-services/) is a set of intelligence APIs that you can call from your apps. Among the more than 25 APIs it offers are the [Computer Vision API](https://www.microsoft.com/cognitive-services/en-us/computer-vision-api) for distilling actionable information from images, and the [Text Analytics API](https://www.microsoft.com/cognitive-services/en-us/text-analytics-api) for extracting sentiments and other information from text (for example, Twitter feeds). These APIs make it possible to build smart apps that would have been impossible just a few short years ago. And they're available for you to begin using today.

In this exercise, you will acquire a subscription key allowing you to call the Computer Vision API from your code. You'll use this key in a later exercise to generate captions and search keywords for images uploaded to the Web site.

1. In the Azure Portal, click **+ Create a resource**, followed by **AI + Machine Learning** and **Computer Vision**.

    ![Creating a new Computer Vision API subscription](Images/new-vision-api.png)

    _Creating a new Computer Vision API subscription_

1. Type "vision-api-key" into the **Name** box and select **F0** as the **Pricing tier**. Select the same **Location** that you selected for the storage account in [Exercise 1](#Exercise1). Under **Resource group**, select **Use existing** and select the "IntellipixResources" resource group. Check the **I confirm** box, and then click **Create**.

    ![Subcribing to the Computer Vision API](Images/create-vision-api.png)

    _Subcribing to the Computer Vision API_

1. Return to the blade for the "IntellipixResources" resource group and click the Computer Vision API subscription that you just created.

    ![Opening the Computer Vision API subscription](Images/open-vision-api.png)

    _Opening the Computer Vision API subscription_

1. Copy the URL under **Endpoint** into your favorite text editor so you can easily retrieve it later. Then click **Show access keys**.

    ![Viewing the access keys](Images/copy-vision-endpoint.png)

    _Viewing the access keys_

1. Click the **Copy** button to the right of **KEY 1** to copy the access key to the clipboard. Then paste the key into your favorite text editor so you can retrieve it later.

    ![Copying the access key](Images/copy-vision-key.png)

    _Copying the access key_

The access key that you just copied will be included in each HTTPS request sent to the Computer Vision API so Azure can verify that the caller is authorized. You should protect this access key the same way you protect access keys for storage accounts and other Azure resources.

<a name="Exercise4"></a>
## Exercise 4: Set up Java and Eclipse

[Eclipse](https://eclipse.org/) has long been one of the most popular IDEs for developing Java apps. A rich ecosystem of components and plug-ins has grown up around it, making it a very capable IDE for doing all things Java. [Microsoft's Java group](https://azure.microsoft.com/en-us/develop/java/) has has provided tools for integrating Eclipse with Azure using the [Azure Toolkit for Eclipse](https://docs.microsoft.com/en-us/azure/azure-toolkit-for-eclipse). It comes with the ability to deploy apps to Azure either as Azure Web Apps or in Docker containers, and it contains tools for managing Azure resources such as Azure Storage, Azure Web Apps, Redis Cache, HDInsight, and Azure virtual machines.

In this exercise, you will set up Java, Eclipse, and the Azure Toolkit for Eclipse.

1. If you don't already have the Java Development Kit (JDK) installed, go to http://www.oracle.com/technetwork/java/javase/downloads/index.html and click the **JDK Download** button. 

	![Downloading the JDK](Images/java-download-java.png)

	_Downloading the JDK_

1. Click **Accept License Agreement**, and then click the installer that matches your system. The installers are self-contained and will install and configure everything you need to run and compile Java. Once the installer downloads, run it and follow the prompts to install the JDK.

	![Installing the JDK](Images/java-download-java-2.png)

	_Installing the JDK_

1. If Eclipse is not installed on your system. go to https://www.eclipse.org/downloads/ and click the **Download** button. Then click the **Download** button that appears on the next page to download the Eclipse installer.

	![Downloading Eclipse](Images/java-download-eclipse.png)

	_Downloading Eclipse_

1. When the download completes, launch the installer. When prompted to choose an Eclipse configuration, select **Eclipse IDE for Java EE Developers**. Then click the **Install** button and follow the prompts to install Eclipse.

	![Specifying the Eclipse configuration](Images/java-eclipse-installer.png)

	_Specifying the Eclipse configuration_

1. Launch Eclipse. When prompted to create a workspace, enter "intellipix" as the workspace folder name.

	![Creating a workspace](Images/java-create-workspace.png)

	_Creating a workspace_

1. Select **Eclipse Marketplace** from Eclipse's **Help** menu. Type "azure toolkit" into the **Find** box and click **Go**. Then click the **Install** button under **Azure Toolkit for Eclipse** to install the toolkit. Accept any licenses presented to you and allow Eclipse to restart if needed. 

	![Installing the Azure Toolkit for Eclipse](Images/java-install-azure-toolkit.png)

	_Installing the Azure Toolkit for Eclipse_

1. Select **Preferences** from Eclipse's **Window** menu. Click **Maven** in the preferences list on the left and uncheck the **Do not automatically update dependencies from remote repositories** box. Then click **OK**.

	![Updating Maven settings](Images/java-change-maven-updates.png)

	_Updating Maven settings_

Eclipse is now configured for Azure development. The next step is to use it to begin a new project and create a Web app that can be tested locally and then deployed to Azure.

<a name="Exercise5"></a>
## Exercise 5: Create a photo-upload app

In this exercise, you will create a new Web app in Eclipse and add code to upload images, write them to blob storage, display them in a Web page, generate captions and keywords using the Computer Vision API, and perform keyword searches on uploaded images. The app will be named Intellipix (for "Intelligent Pictures") and will be accessed through your browser. The server-side code will be written in Java and will utilize [Java servlets](https://en.wikipedia.org/wiki/Java_servlet). The client side will be implemented in HTML, CSS, and JavaScript.

1. Use the **File** > **New** > **Dynamic Web Project** command to create a new project. Set **Project name** to "Intellipix," and then click the **New Runtime...** button.  

	![Creating a new project](Images/java-new-project-1.png)

	_Creating a new project_

1. Select **Apache Tomcat v7.0**. Then check the **Create a new local server** box and click **Next**.

	![Selecting a runtime](Images/java-new-project-2.png)

	_Selecting a runtime_

1. Click the **Browse...** button and a select a Tomcat installation directory. (Any writable directory will do.) Then click **Download and Install...** to start the Tomcat install. Accept the license agreement presented to you. When installation is complete, click **Finish** in the "New Server Runtime Environment" dialog, followed by **Finish** in the "New Dynamic Web Project" dialog.

	![Installing Tomcat](Images/java-new-project-3.png)

	_Installing Tomcat_

1. Close the "Welcome" tab in Eclipse to switch to the Java EE view.

1. Right-click (On a Mac, Control-click) the Intellipix project in Project Explorer. Then select **Configure** > **Convert to Maven Project** from the context menu. In the "Create new POM" dialog that ensues, accept the defaults and click **Finish**.

	> Maven is a package manager for Java. This action adds a **pom.xml** file to the project which is used to install dependencies from Maven repositories.

1. Right-click the Intellipix project again, and this time select **Maven** > **Add Dependency**. In the "Add Dependency" dialog, set **Group Id** to "com.microsoft.azure," **Artifact Id** to "azure-storage," and **Version** to "5.1.1." Then click **OK** to add Azure Storage libraries to the project.

	![Adding Azure Storage libraries](Images/java-add-maven-dependency-1.png)

	_Adding Azure Storage libraries_

1. Repeat Step 6, but enter the values shown below into the "Add Dependency" dialog. This adds Java servlet libraries to the project.

	![Adding servlet libraries](Images/java-add-maven-dependency-2.png)

	_Adding servlet libraries_

1. Repeat Step 6, but enter the values shown below into the "Add Dependency" dialog. This adds some common I/O utility libraries to the project.

	![Adding I/O utility libraries](Images/java-add-maven-dependency-3.png)

	_Adding I/O utility libraries_

1. Repeat Step 6 one last time, but enter the values shown below into the "Add Dependency" dialog. This adds JSON libraries to the project. Many of the Azure APIs send and receive data in JSON format.

	![Adding JSON libraries](Images/java-add-maven-dependency-4.png)

	_Adding JSON libraries_

1. Expand the Intellipix project in Project Explorer. Right-click the "src" folder under **Java Resources** and select **New** > **Servlet**.

	![Adding a servlet](Images/java-new-servlet.png)

	_Adding a servlet_

1. In the "Create Servlet" dialog, set **Java package** to "intellipix" and **Class name** to "Api." Then click **Finish**.

	![Creating a servlet](Images/java-create-servlet.png)

	_Creating a servlet_

1. Open **Api.java** in the "intellipix" folder created under the "src" folder, and replace its contents with the code below. Then save the modified file.

	```java
	package intellipix;
	
	import java.awt.Graphics2D;
	import java.awt.GraphicsConfiguration;
	import java.awt.GraphicsDevice;
	import java.awt.GraphicsEnvironment;
	import java.awt.geom.AffineTransform;
	import java.awt.image.BufferedImage;
	import java.io.*;
	import java.net.HttpURLConnection;
	
	import java.net.URL;
	import java.nio.file.Paths;
	import java.util.HashMap;
	import java.util.List;
	import java.util.stream.Collectors;
	
	import javax.imageio.ImageIO;
	import javax.imageio.stream.ImageOutputStream;
	import javax.servlet.ServletException;
	import javax.servlet.annotation.MultipartConfig;
	import javax.servlet.annotation.WebServlet;
	import javax.servlet.http.*;
	
	import org.apache.commons.io.IOUtils;
	import org.json.JSONArray;
	import org.json.JSONObject;
	
	import com.microsoft.azure.storage.*;
	import com.microsoft.azure.storage.blob.*;
	
	@WebServlet("/api")
	@MultipartConfig
	public class Api extends HttpServlet {
	    private static final long serialVersionUID = 1L;
	    private String connectionString = "connection_string";
	    private String visionAPIKey = "vision_api_key";
	    private String visionEndpoint = "vision_api_endpoint";
	    
	    
	    public Api() {
	        super();
	    }
	
	    // This method handles GET requests for images 
	    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	        CloudBlobContainer images = getContainer("photos");
	        response.setContentType("application/json");  
	        PrintWriter out = response.getWriter();
	
	        // look for a search parameter in the query string
	        String search = request.getParameter("search");
	        JSONArray azureImages = new JSONArray();
			
	        // get a list of images from Azure Storage
	        for (ListBlobItem photo: images.listBlobs()) {
	            boolean match = false;
	            JSONObject azureImage = new JSONObject();
	            CloudBlob imageBlob = (CloudBlob)photo;

	            try {
	                imageBlob.downloadAttributes();
	            }
	            catch (StorageException e) {
	                e.printStackTrace();
	            }
				
	            // get the blob URL
	            azureImage.put("url", imageBlob.getUri().toString().replace(".blob.core.windows.net/photos/", ".blob.core.windows.net/thumbnails/"));
	            azureImage.put("fullUrl", imageBlob.getUri().toString());
				
	            HashMap<String, String> metadata = imageBlob.getMetadata();
				
	            if (!metadata.isEmpty()) {
	                JSONObject imageMetadata = new JSONObject();

	                // get the caption from blob metadata
	                if (metadata.containsKey("caption")) {
	                    imageMetadata.put("caption", metadata.get("caption"));
	                    if (search != null && imageMetadata.getString("caption").toLowerCase().contains(search.toLowerCase())) {
	                        match = true;
	                    }
	                }

	                // get tags from blob metadata	
	                if (metadata.containsKey("tags")) {
	                    JSONArray tags = new JSONArray(metadata.get("tags"));
	                    imageMetadata.put("tags", tags);
	                    if (search != null) {
	                        for (Object tag: imageMetadata.getJSONArray("tags")) {
	                            if (((String)tag).toLowerCase().equals(search.toLowerCase())) {match = true; break;}
	                        }								
	                    }
	                }
							
	                azureImage.put("metadata", imageMetadata);	
					
	                if (search != null && match) {
	                    azureImages.put(azureImage);				
	                }
	                else if (search == null) {
	                    azureImages.put(azureImage);	
	                }
	            }
	            else if (search == null) {
	                azureImages.put(azureImage);								
	            }
	        };
			
	        // write the list back as JSON
	        out.print(azureImages.toString());
	        out.flush();
	    }
	
	    // This method handles image uploads
	    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	        // parse uploaded content for uploaded files
	        List<Part> fileParts = request.getParts().stream().filter(part -> "photos".equals(part.getName())).collect(Collectors.toList()); // Retrieves <input type="file" name="file" multiple="true">
	
	        for (Part filePart : fileParts) {
	            String fileName = Paths.get(getSubmittedFileName(filePart)).getFileName().toString(); 
	            InputStream fileContent = filePart.getInputStream();
	            byte[] imageBuffer = IOUtils.toByteArray(fileContent); // raw byte data for the image
		                
	            // create a thumbnail for the uploaded image and convert it into a ByteArrayInputStream
	            ByteArrayInputStream inputStream = new ByteArrayInputStream(imageBuffer);
	            BufferedImage img = ImageIO.read(inputStream);
	            BufferedImage thumbnail = scale (img, 200.0 / img.getWidth()); //scale to 200  pixels wide
		        
	            // write the thumbnail as a PNG to an input stream
	            ByteArrayOutputStream bytes = new ByteArrayOutputStream();
	            ImageOutputStream thumbnailData = ImageIO.createImageOutputStream(bytes);
	            ImageIO.write(thumbnail, "png", thumbnailData);
	            ByteArrayInputStream thumbnailContent = new ByteArrayInputStream(bytes.toByteArray()); 
	
	            // upload the original image to Azure Storage
	            inputStream = new ByteArrayInputStream(imageBuffer);
	            CloudBlob imgBlob = uploadBlob("photos", fileName, inputStream, null);
		        
	            try {
	                // send the image to the Computer Vision API for analysis
	                JSONObject analysis = new JSONObject(analyzeImage(imgBlob.getUri().toString()));
	                HashMap<String, String> metadata = new HashMap<String,String>();
			        
	                // extract analysis data and stores it in blob metadata
	                if (analysis.has("description")) {
	                    if (analysis.getJSONObject("description").has("captions") && analysis.getJSONObject("description").getJSONArray("captions").length() != 0) {
		                    metadata.put("caption", analysis.getJSONObject("description").getJSONArray("captions").getJSONObject(0).getString("text"));
	                    }
	                    else {
	                        metadata.put("caption", "Unknown");
	                    }
	
	                    if (analysis.getJSONObject("description").has("tags") && analysis.getJSONObject("description").getJSONArray("tags").length() != 0) {
	                        metadata.put("tags", analysis.getJSONObject("description").getJSONArray("tags").toString());
	                    }
	                    else {
	                        metadata.put("caption", new JSONArray().toString());
	                    }
	                }
	
	                imgBlob.setMetadata(metadata);
	                imgBlob.uploadMetadata();
			        
	                // upload the thumbnail to Azure Storage
	                uploadBlob("thumbnails", fileName, thumbnailContent, metadata);	
	            }
	            catch (Exception e) {
	                e.printStackTrace();
	            }
	        }
		    
	        response.getWriter().append("");
	    }
	
	    // Utility method for storing blobs on Azure
	    private CloudBlockBlob uploadBlob(String containerName, String fileName, InputStream blobData, HashMap<String,String> metadata) {
	        try  {
	            CloudBlobContainer container = getContainer(containerName);
	            CloudBlockBlob blob = container.getBlockBlobReference(fileName);
	            blob.upload(blobData, blobData.available());

	            if (metadata != null) {
	                blob.setMetadata(metadata);
	                blob.uploadMetadata();				
	            }
	            return blob;
	        }
	        catch(Exception e) {
	            return null;
	        }
	    }
		
	    // Helper method to extract file names
	    private static String getSubmittedFileName(Part part) {
	        for (String cd : part.getHeader("content-disposition").split(";")) {
	            if (cd.trim().startsWith("filename")) {
	                String fileName = cd.substring(cd.indexOf('=') + 1).trim().replace("\"", "");
	                return fileName.substring(fileName.lastIndexOf('/') + 1).substring(fileName.lastIndexOf('\\') + 1); // MSIE fix.
	            }
	        }
	        return null;
	    }
		
	    // Helper method to get blob containers
	    private CloudBlobContainer getContainer(String containerName) {
	        try {
	            CloudStorageAccount account = CloudStorageAccount.parse(connectionString);
	            CloudBlobClient serviceClient = account.createCloudBlobClient();
	            return serviceClient.getContainerReference(containerName);
	        }
	        catch (Exception e) {
	            System.out.print("Exception encountered: ");
	            System.out.println(e.getMessage());
	        }
	        return null;
	    }
		
	    // Helper method to scale an image	
	    private BufferedImage scale(BufferedImage source, double ratio) {
	        int w = (int) (source.getWidth() * ratio);
	        int h = (int) (source.getHeight() * ratio);
	        BufferedImage bi = getCompatibleImage(w, h);
	        Graphics2D g2d = bi.createGraphics();
	        double xScale = (double) w / source.getWidth();
	        double yScale = (double) h / source.getHeight();
	        AffineTransform at = AffineTransform.getScaleInstance(xScale,yScale);
	        g2d.drawRenderedImage(source, at);
	        g2d.dispose();
	        return bi;
	    }
	
	    private BufferedImage getCompatibleImage(int w, int h) 
	    {
	        GraphicsEnvironment ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
	        GraphicsDevice gd = ge.getDefaultScreenDevice();
	        GraphicsConfiguration gc = gd.getDefaultConfiguration();
	        BufferedImage image = gc.createCompatibleImage(w, h);
	        return image;
	    }
		
	    // Utility method for handling requests to the Computer Vision API
	    private String analyzeImage(String blobUrl) throws Exception {
	        URL obj = new URL(visionEndpoint +  "/analyze?visualFeatures=description");
	        HttpURLConnection con = (HttpURLConnection) obj.openConnection();
	        con.setRequestMethod("POST");
	
	        // add request header
	        con.setRequestProperty("Ocp-Apim-Subscription-Key", visionAPIKey);
	        con.setRequestProperty("Content-Type", "application/json");
			
	        con.setUseCaches (false);
	        con.setDoInput(true);
	        con.setDoOutput(true);
			
	        // prepare the HTTP POST body
	        JSONObject url = new JSONObject();
	        url.put("url", blobUrl);
			
	        con.setDoOutput(true);
	        DataOutputStream wr = new DataOutputStream(con.getOutputStream());
	        wr.writeBytes(url.toString());
	        wr.flush();
	        wr.close();
			
	        int responseCode = con.getResponseCode();
	        BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
	        String inputLine;
	        StringBuffer response = new StringBuffer();
	
	        // read the response as a string
	        while ((inputLine = in.readLine()) != null) {
	            response.append(inputLine);
	        }

	        in.close();
	        return response.toString();
	    }
	}
	```

1. On line 36, replace *connection_string* with the connection string that you saved in Exercise 1, Step 10.

1. On line 37, replace *vision_api_key* with the Computer Vision API key that you saved in Exercise 3, Step 5.

1. On line 38, replace *vision_api_endpoint* with the Computer Vision API endpoint that you saved in Exercise 3, Step 4. Add "vision/v1.0" to the end of the URL if it isn't already there.

1. Right-click **WebContent** in Project Explorer and use the **New** > **HTML file** command to add an HTML file named "index.html" to the project.

1. Replace the contents of **index.html** with the statements below. Then save the modified file.

	```html
	<!DOCTYPE html>
	<html>
	<head>
	<meta charset="ISO-8859-1">
	<title>Intellipix</title>
	</head>
	<body onload="searchPics()">
	
	<style>
	body {
	    background-color:#444;
	    color:#FFF;
	    font-family:tahoma;
	}
	
	input {
	    background-color:#555;
	    border:1px solid #666;
	    color:#fff;
	}
	
	#modal{
	    max-height: calc(100% - 100px);
	    position: fixed;
	    top: 50%;
	    left: 50%;
	    transform: translate(-50%, -50%);
	    display:none;
	    background-color:#555;
	    border:1px solid #666;
	    padding:3px;
	    text-align:center;
	}
	
	#modalimage{
	    max-height: calc(100% - 100px);
	    max-width: 100%;
	}
	
	#controls{
	    background-color:#555;
	    border:1px solid #666;
	    padding:5px;
	}
	
	#gallery span {
	    display:inline-block;
	}
	
	#gallery img {
	    border:1px solid #000;
	    padding:5px;
	    background-color:#fff;
	    margin:3px;
	}
	
	#search {
	    width:45%;
	    float:left;
	}
	
	#upload {
	    width:45%;
	    margin-left:45%;
	}
	</style>
	
	<script type="text/javascript">
	function uploadPics() {
	    var form = document.getElementById('uploader');
	    var message = document.getElementById('uploadmessage');
		
	    form.enabled = false;
	    message.innerHTML = 'Uploading and Processing...';
	
	    // get file references from the form and then uploads the files
	    var formData = new FormData();
	    var fileSelect = document.getElementById('file-select');
	    var files = fileSelect.files;
		
	    for (var i = 0; i < files.length; i++) {
	        var file = files[i];
	        formData.append('photos', file, file.name);
	    }		
		
	    // pure AJAX; no jQuery
	    var xhr = new XMLHttpRequest();
	    xhr.open('POST', 'api', true);
	    xhr.onload = function () {
	        if (xhr.status === 200) {
	            message.innerHTML = (files.length) + ' file(s) uploaded.';
	            reset();
	        }
            else {
	            message.innerHTML = 'An error occurred!';
	        }
	        form.reset();
	    };
	    xhr.send(formData);
	}
		
	function searchPics(search) {
	    var xhr = new XMLHttpRequest();
	    var url = "api"
		
	    if (search && search != ""){
	        url += "?search=" + search;
	    }
		
	    xhr.open('GET', url, true);
	    xhr.onload = function () {
	        if (xhr.status === 200) {
	            htmlStr = "";
	            var images = JSON.parse(xhr.responseText);
				
	            // create HTML from JSON data and append it to the DOM
	            for (var i = 0; i < images.length; i++) {
	                var image = images[i];
	                htmlStr += "<span class='imgwrapper'><img onclick='showImage(\"" + image.fullUrl + "\", \"" + image.metadata.caption + "\")' src='" + image.url + "' title='" + image.metadata.caption + "' alt='" + image.metadata.caption + "'></span>"
	            }
				
	            if (htmlStr == "") {
	                htmlStr = "No images found."
	            }
				
	            var gallery = document.getElementById("gallery");
	            gallery.innerHTML = htmlStr;
	        }
            else {
	            gallery.innerHTML = 'An error occurred!';
	        }
	    };
	    xhr.send();
	}
	
	// resets the search form
	function reset(){
	    document.getElementById('searchTerm').value = "";
	    searchPics();
	}
	
	// shows the modal dialog for an image
	function showImage(url, caption){
	    document.getElementById('modalimage').src = url;
	    document.getElementById('modaltext').innerHTML = caption;
	    document.getElementById('modal').style.display = "block";
	}
	
	// closes the modal dialog
	function closeImage(){
	    document.getElementById('modal').style.display = "none";
	}
	</script>
	
	<h1 id="title">Intellipix</h1>
	
	<div id="controls">
	<div id="search">
	<div>Search</div>
	<input type="text" value="" id="searchTerm" placeholder="Enter a search term">
	<input type="button" onclick="searchPics(document.getElementById('searchTerm').value)" value="Search">
	<input type="button" onclick="reset()" value="Reset Search">
	</div>
	
	<div id="upload">
	<form id="uploader" >
	<div id="uploadmessage">Select image to upload:</div>
	<input type="file" name="file-select" id="file-select" multiple>
	<input type="button" value="Upload" onclick="uploadPics()">
	</form>
	</div>
	</div>
	<div id="message"></div>
	
	<div id="gallery">
	</div>
	
	<div id="modal">
	<img src="" id="modalimage">
	<p id="modaltext"></p>
	<input type="button" value="close" onclick="closeImage()">
	</div>
	
	</body>
	</html>
	```

With the app complete, the next step is to run it locally and make sure it works as intended before deploying it to Azure.

<a name="Exercise6"></a>
## Exercise 6: Test the app locally

Eclipse supports many popular servers for running Web sites written in Java, including [Apache Tomcat](http://tomcat.apache.org/). Tomcat provides the hooks needed to run servlets and is also capable of serving up static content such as HTML. Moreover, Azure can use Tomcat to host Java apps. In this exercise, you will run the app in a local Tomcat server in order to test it and familiarize yourself with its features.

1. Use the **Run** > **Debug** command to launch the app in the debugger. In the "Debug As" dialog that opens, select **Run on Server**, and then click **OK**.

	![Launching the app in the debugger](Images/java-debug-as.png)

	_Launching the app in the debugger_

1. In the "Debug on Server" dialog, select **Choose an existing server**, select **Tomcat v7.0 Server at localhost** as the server, and click **Finish**.

1. Wait for the app to appear in your browser, either inside or outside Eclipse. Then click the **Browse...** button, select all of the files in the "photos" folder of the [resources that accompany this lab](https://a4r.blob.core.windows.net/public/cs-storage-resources.zip), and click the **Upload** button to upload them to the Web site.

	> Each image uploaded to the Web site is written to Azure blob storage and then passed to the Computer Vision API, which analyzes the image and returns a caption and a set of tags. Captions and tags are stored in blob metadata.

1. Wait for the upload to complete. Then confirm that the uploaded images appear in the Web page. These are the thumbnails generated from the uploaded images. They are stored as blobs in the "thumbnails" container that you created in Exercise 1. 

	![The uploaded images](Images/java-intellipix-0.png)

	_The uploaded images_

1. Hover the cursor over one of the image thumbnails. Confirm that a tooltip window appears containing a caption for the image. *This is the caption that was generated by the Computer Vision API and stored in blob metadata*.

	![The computer-generated caption](Images/java-intellipix-1.png)

	_The computer-generated caption_

1. Click an image and confirm that an enlarged version appears. This is the full-size image stored in blob storage in the "photos" container that you created in Exercise 1.

	![Enlarging an image](Images/java-intellipix-2.png)

	_Enlarging an image_

1. Type a keyword describing something you see in the images — for example, "river" — into the search box. Search results will vary depending on what you typed and what images you uploaded. But the result should be a filtered list of images — images whose metadata keywords include all or part of the keyword that you typed.

	![Performing a search](Images/java-intellipix-3.png)

	_Performing a search_

1. Do a **View Source** in your browser to view the source for the page. Find the ```<img>``` elements representing the image thumbnails. Observe that the URLs assigned to the images refer **directly to blobs in blob storage**. This is possible because you set the containers' **Access type** to **Blob**, which makes the blobs inside them publicly accessible.

	> What would happen if the containers were private? If you're not sure, try it and see. Temporaily change the "thumbnails" container's **Access type** to **Private** in the Azure Portal. Then refresh the Intellipix page in your browser and see what happens.

1. Return to the Microsoft Azure Storage Explorer (or restart if it you didn't leave it running) and click the "photos" container under the storage account you created in Exercise 1. The number of blobs in the container should equal the number of photos you uploaded. Double-click one of the blobs to download it and see the image stored in the blob.

    ![Contents of the "photos" container](Images/node-photos-container.png)

    _Contents of the "photos" container_

1. Open the "thumbnails" container in Storage Explorer. How many blobs do you see there? Open one of the blobs to see what's inside. These are the thumbnail images generated from the image uploads.

1. Want to see where the metadata generated by the Computer Vision API is being stored? Open the "photos" container again. Right-click any of the blobs in the container and select **Properties**. In the ensuing dialog, you'll see a list of the metadata attached to the blob. Each metadata item is a key-value pair. The computer-generated caption is stored in the item named "caption," while the keywords generated from the image are stored in a JSON string array named "tags."

    ![Blob metadata](Images/node-blob-metadata.png)

    _Blob metadata_

	When you're finished, click **Cancel** to close the Properties dialog.

1. Did you know that the Azure Toolkit for Eclipse contains an Azure Explorer of its own? Use Eclipse's **Windows** > **Show View** > **Other...** command to list all the different views Eclipse supports, and select **Azure Explorer** from the "Azure" folder. When the Azure Explorer opens, find the storage account that you created in Exercise 1 and click any of the containers in it to view the blobs in that container. You can also use the Azure Explorer to manage Azure Web Apps, Docker hosts, virtual machines, and other Azure resources.

    ![Viewing blob storage with the Azure Explorer](Images/java-azure-explorer.png)

    _Viewing blob storage with the Azure Explorer_

You're almost finished, but the final and most important step remains. It is time to deploy the app to the cloud.

<a name="Exercise7"></a>
## Exercise 7: Deploy the app to Azure

The Azure Toolkit for Eclipse has integrated support for deploying Dynamic Web Site projects to Azure as [Azure Web Apps](https://docs.microsoft.com/en-us/azure/app-service-web/app-service-web-overview). In this exercise, you will use the Azure Toolkit to deploy Intellipix to Azure.

1. Right-click the Intellipix project in Project Explorer and select **Azure** > **Publish as Azure Web App** from the context menu. 

1. Make sure **Interactive** is selected as the authentication method, and click **Sign in**. When prompted, sign in with your Microsoft account.

	![Signing in to Azure](Images/java-sign-in.png)

	_Signing in to Azure_

1. Next, select the Azure subscription that you want to use for the Azure Web App, and click **Select**. 

1. In the "Deploy Web App" dialog, click the **Create** button to create a new Azure App Service.

	> Azure App Service is the family of services that Azure Web Apps belong to. Other types of Azure App Services include Azure API Apps and Azure Logic Apps.

1. In the "Create App Service" dialog, select **Create new**. Set **Location** to the same location that you selected for the storage account in Exercise 1. Select **Free_F1** for the **Pricing tier**, but *do not* click the **Create** button just yet.

	![Creating an Azure App Service](Images/java-create-app-service-1.png)

	_Creating an Azure App Service_

1. Click the **Resource group** tab, select **Use existing**, and select the resource group that you created in Exercise 1. Then click the **Create** button. This will place the Azure Web App in the same resource group as the storage account and other resources you created in this lab so they can be managed as a unit.

	![Specifying the resource group](Images/java-create-app-service-2.png)

	_Specifying the resource group_

1. In the "Deploy Web App" dialog, copy the Web site URL to the clipboard. Then check the **Deploy to root** box and click **Deploy**.

	![Deploying the Web app](Images/java-deploy-web-app.png)

	_Deploying the Web app_

1. Wait until Eclipse indicates that the app has been published. Then open a browser and paste the URL that is on the clipboard into the browser's address bar. Confirm that Intellipix appears as before, but this time hosted in Azure.

	![The finished product!](Images/java-intellipix-on-azure.png)

	_The finished product!_

If you make changes to the app and want to push the changes out to the Web, simply deploy it again from Eclipse. Of course, you can still test your changes locally before publishing to the Web.

<a name="Summary"></a>
## Summary

When you're finished using the site, you should delete the resource group containing it. Deleting the resource group deletes all of the resources inside it (including the storage account, the blobs uploaded to it, and the Azure Web App), removes all traces of this lab from your account, and prevents any further charges from being incurred for it. To delete the resource group, simply open the resource-group blade in the portal and click **Delete resource group** at the top of the blade. You will be asked to type the resource group's name to confirm that you want to delete it, because once deleted, a resource group can't be recovered.

There is much more that you could do to develop Intellipix and to leverage Azure even further. For example, you could add support for authenticating users and deleting photos, and rather than force the user to wait for Cognitive Services to process a photo following an upload, you could use [Azure Functions](https://azure.microsoft.com/en-us/services/functions/) to call the Computer Vision API asynchronously each time an image is added to blob storage. You could even use Cognitive Services to detect faces in the photos and analyze the emotions depicted by those faces. With the cloud as your platform, the sky is the limit (pun intended).

----

Copyright 2017 Microsoft Corporation. All rights reserved. Except where otherwise noted, these materials are licensed under the terms of the MIT License. You may use them according to the license as is most appropriate for your project. The terms of this license can be found at https://opensource.org/licenses/MIT.
