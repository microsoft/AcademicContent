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

/**
 * 
 */
@WebServlet("/api")
@MultipartConfig
public class Api extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
    private String connectionString = "Connection String for Blob Storage";
    private String visionAPIKey = "Vision API Key";
    private String visionEndpoint = "Vision API Endpoint";
    
    
    public Api() {
        super();
    }

    //This method handles the GET requests for the images. 
    //It produces a JSON object with the metadata and URL's to the thumbnails and full images stored on Azure
    
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		CloudBlobContainer images = getContainer("photos");
		response.setContentType("application/json");  
		PrintWriter out = response.getWriter();

		//looks for a search parameter in the query string.
		String search = request.getParameter("search");

		
		JSONArray azureImages = new JSONArray();
		
		//Gets a list of images from Azure Storage
		for (ListBlobItem photo: images.listBlobs()){
			
			boolean match = false;
			
			JSONObject azureImage = new JSONObject();
			CloudBlob imageBlob = (CloudBlob)photo;
			try {
				imageBlob.downloadAttributes();
			} catch (StorageException e) {
				e.printStackTrace();
			}
			
			//Gets the URL from the blob.
			azureImage.put("url", imageBlob.getUri().toString().replace(".blob.core.windows.net/photos/", ".blob.core.windows.net/thumbnails/"));
			azureImage.put("fullUrl", imageBlob.getUri().toString());
			
			HashMap<String, String> metadata = imageBlob.getMetadata();
			
			
			if (!metadata.isEmpty())
			{
				JSONObject imageMetadata = new JSONObject();
				//Gets the caption from the blob metadata
				if (metadata.containsKey("caption"))
				{
					imageMetadata.put("caption", metadata.get("caption"));
					if (search != null && imageMetadata.getString("caption").toLowerCase().contains(search.toLowerCase())) 
					{
						match = true;
					}
				}
				//Gets the tags from the blob metadata	
				if (metadata.containsKey("tags"))
				{
					JSONArray tags = new JSONArray(metadata.get("tags"));
					imageMetadata.put("tags", tags);
					if (search != null)
					{
						for (Object tag: imageMetadata.getJSONArray("tags"))
						{
							if (((String)tag).toLowerCase().equals(search.toLowerCase())) {match = true; break;}
						}								
					}
				}
						
				azureImage.put("metadata", imageMetadata);	
				
				if (search != null && match)
				{
					azureImages.put(azureImage);				
				}
				else if (search == null)
				{
					azureImages.put(azureImage);	
				}
		
			}
			else if (search == null)
			{
				azureImages.put(azureImage);								
			}
			
		};
		
		//writes the list back as JSON.
		out.print(azureImages.toString());
		out.flush();

	}


	//This method handles the upload
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		//parses teh uploaded content for the uploaded files
	    List<Part> fileParts = request.getParts().stream().filter(part -> "photos".equals(part.getName())).collect(Collectors.toList()); // Retrieves <input type="file" name="file" multiple="true">

	    for (Part filePart : fileParts) {
	        String fileName = Paths.get(getSubmittedFileName(filePart)).getFileName().toString(); 
	        InputStream fileContent = filePart.getInputStream();
	        byte[] imageBuffer = IOUtils.toByteArray(fileContent); //this is the raw byte data for the image.
	                
	        //Create a thumbnail for the uploaded image and convert it to a ByteArrayInputStream to write to Azure storage
	        ByteArrayInputStream inputStream = new ByteArrayInputStream(imageBuffer);
	        BufferedImage img = ImageIO.read(inputStream);
	        BufferedImage thumbnail = scale (img, 200.0 / img.getWidth()); //scale to 200  pixels wide
	        
	        //Write the thumbnail as a PNG to an input stream.
	    	ByteArrayOutputStream bytes = new ByteArrayOutputStream();
	    	ImageOutputStream thumbnailData = ImageIO.createImageOutputStream(bytes);
	        ImageIO.write(thumbnail, "png", thumbnailData);
	        ByteArrayInputStream thumbnailContent = new ByteArrayInputStream(bytes.toByteArray()); 
	        
	        //uploads te original image to Azure Storage.
	        inputStream = new ByteArrayInputStream(imageBuffer);
	        CloudBlob imgBlob = UploadBlob("photos", fileName, inputStream, null);
	        
	        try {

	        	//Sends the image to the Azure Vision API for analysis.
				JSONObject analysis = new JSONObject(analyzeImage(imgBlob.getUri().toString()));

				HashMap<String, String> metadata = new HashMap<String,String>();
		        
				//extracts the analysis data and stores it as metadata on the blob.
		        if (analysis.has("description"))
		        {
			        if (analysis.getJSONObject("description").has("captions") && analysis.getJSONObject("description").getJSONArray("captions").length() != 0)
			        {
			        	metadata.put("caption", analysis.getJSONObject("description").getJSONArray("captions").getJSONObject(0).getString("text"));
			        }
			        else
			        {
			        	metadata.put("caption", "Unknown");
			        }
			        
			        if (analysis.getJSONObject("description").has("tags") && analysis.getJSONObject("description").getJSONArray("tags").length() != 0)
			        {
			        	metadata.put("tags", analysis.getJSONObject("description").getJSONArray("tags").toString());
			        }
			        else
			        {
			        	metadata.put("caption", new JSONArray().toString());
			        }
		        }

		        imgBlob.setMetadata(metadata);
		        imgBlob.uploadMetadata();
		        
		        //uploads the thumbnail to Azure Storage.
		        UploadBlob("thumbnails", fileName, thumbnailContent, metadata);	
		        
			} catch (Exception e) {
				e.printStackTrace();
			}
	        

	    }
	    
		response.getWriter().append("");
	    
	}
	

	//Utility method for storing blobs on Azure.
	private CloudBlockBlob UploadBlob(String containerName, String fileName, InputStream blobData, HashMap<String,String> metadata)
	{
		try 
		{
			CloudBlobContainer container = getContainer(containerName);
			CloudBlockBlob blob = container.getBlockBlobReference(fileName);

			blob.upload(blobData, blobData.available());
			if (metadata != null)
			{
				blob.setMetadata(metadata);
				blob.uploadMetadata();				
			}
			
			return blob;
		}
		catch(Exception e)
		{
			return null;
		}

	}
	
	//Helper method to extract file names
	private static String getSubmittedFileName(Part part) {
	    for (String cd : part.getHeader("content-disposition").split(";")) {
	        if (cd.trim().startsWith("filename")) {
	            String fileName = cd.substring(cd.indexOf('=') + 1).trim().replace("\"", "");
	            return fileName.substring(fileName.lastIndexOf('/') + 1).substring(fileName.lastIndexOf('\\') + 1); // MSIE fix.
	        }
	    }
	    return null;
	}
	
	//Helper method to get Blob containers on Azure
	private CloudBlobContainer getContainer(String containerName){
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
	
	//Helper method to scale an image	
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
	
	//Utility method for handling requests made to Azure Vision API
	//The vision API does not yet have a Java SDK, so requests are performed via the REST API.
	private String analyzeImage(String blobUrl) throws Exception {

		URL obj = new URL(visionEndpoint +  "/analyze?visualFeatures=description");
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();
		con.setRequestMethod("POST");

		//add request header
		con.setRequestProperty("Ocp-Apim-Subscription-Key", visionAPIKey);
		con.setRequestProperty("Content-Type", "application/json");
		
		con.setUseCaches (false);
		con.setDoInput(true);
		con.setDoOutput(true);
		
		//prepares the HTTP POST body.
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

		//reads the response back to a string.
		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		in.close();

	
		return response.toString();

	}

}