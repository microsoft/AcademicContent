# Building Neural Networks with TensorFlow and Microsoft's Data Science Virtual Machine #

Data scientists use a variety of tools to ply their trade. One of the challenges they face is building an environment with the right software installed and configuring all the pieces to work in harmony. Microsoft's [Data Science Virtual Machine](https://docs.microsoft.com/azure/machine-learning/data-science-virtual-machine/overview) (DSVM) is a customized virtual-machine image hosted in Azure that is built specifically for data-science workloads. It comes with a number of popular open-source tools preinstalled, and it runs on Windows Server as well as Linux. The Linux edition is available in both Ubuntu and CentOS versions

With a DSVM providing the environment, you can get up and running quickly with popular tools such as [Jupyter](http://jupyter.org/), [R Studio](https://www.rstudio.com/), the [Microsoft Cognitive Toolkit](https://www.microsoft.com/cognitive-toolkit/), and many others. You can also build neural networks with [TensorFlow](https://www.tensorflow.org/), the open-source machine-learning framework originated by Google that is rapidly growing in popularity.

In this lab, you will create a Linux Data Science Virtual Machine in Azure, connect to it via remote desktop, use TensorFlow to build a [deep neural network](https://en.wikipedia.org/wiki/Artificial_neural_network) that performs [image classification](https://medium.com/@tifa2up/image-classification-using-deep-neural-networks-a-beginner-friendly-approach-using-tensorflow-94b0a090ccd4), and train the network to recognize images that contain hot dogs. Then you will write a Python app that examines the images you provide to it and tells you whether they contain hot dogs — your own variation of the [NotHotDog app](https://www.youtube.com/watch?v=ACmydtFDTGs) made famous on the TV show [Silicon Valley](https://www.hbo.com/silicon-valley).

![tk](Images/hot-dog-app.png)

<a name="Objectives"></a>
### Objectives ###

In this hands-on lab, you will learn how to:

- Create a Linux Data Science Virtual Machine in Azure
- Connect to the DSVM via remote desktop
- Train a TensorFlow model to recognize images containing hot dogs
- Use the model in a Python app

<a name="Prerequisites"></a>
### Prerequisites ###

The following are required to complete this hands-on lab:

- An active Microsoft Azure subscription. If you don't have one, [sign up for a free trial](http://aka.ms/WATK-FreeTrial).
- An [Xfce](https://xfce.org/) remote-desktop client such as [X2Go](https://wiki.x2go.org/doku.php/download:start)

<a name="Cost"></a>
### Cost ###

![](Images/cost-2.png)

The cost of this lab series is **moderate**. For an overview of cost ratings, refer to [Explanation of Costs](../../../Costs.md).

<a name="Exercises"></a>
## Exercises ##

This hands-on lab includes the following exercises:

- [Exercise 1: Create an Ubuntu Data Science VM](#Exercise1)
- [Exercise 2: Connect to the Data Science VM](#Exercise2)
- [Exercise 3: Train a TensorFlow model](#Exercise3)
- [Exercise 4: Create a NotHotDog app](#Exercise4)
- [Exercise 5: Delete the Data Science VM](#Exercise4)

Estimated time to complete this lab: **45** minutes.

<a name="Exercise1"></a>
## Exercise 1: Create an Ubuntu Data Science VM ##

The Ubuntu Data Science Virtual Machine for Linux is a virtual-machine image that simplifies getting started with data science. Multiple tools are already built, installed, and configured in order to get you up and running quickly. The NVIDIA GPU driver, [NVIDIA CUDA](https://developer.nvidia.com/cuda-downloads), and [NVIDIA CUDA Deep Neural Network](https://developer.nvidia.com/cudnn) (cuDNN) library are also included, as are [Jupyter](http://jupyter.org/), several sample Jupyter notebooks, and [TensorFlow](https://www.tensorflow.org/). All pre-installed frameworks are GPU-enabled but will work on CPUs as well.  In this exercise, you will create an instance of the Data Science Virtual Machine for Linux on Azure.

1. Open the [Azure Portal](https://portal.azure.com) in your browser. If asked to log in, do so using your Microsoft account.

1. Click **+ Create a resource** in the menu on the left side of the portal, and then type "data science" (without quotation marks) into the search box. Select **Data Science Virtual Machine for Linux (Ubuntu)** from the results list.

    ![Finding the Ubuntu Data Science VM](Images/new-data-science-vm.png)

    _Finding the Ubuntu Data Science VM_

1. Take a moment to review the list of tools included in the VM. Then click **Create** at the bottom of the blade.

1. Fill in the "Basics" blade as shown below. Provide a password that's at least 12 characters long containing a mix of uppercase letters, lowercase letters, numbers and special characters. *Be sure to remember the user name and password that you enter, because you will need them later in the lab.* 

    ![Entering basic information about the VM](Images/create-data-science-vm-1.png)

    _Entering basic settings_

1. In the "Choose a size" blade, show all size options available by clicking **View All**. Then scroll down and select **DS1_V2 Standard**, which provides a low-cost way to experiment with Data Science VMs. Then click the **Select** button at the bottom.

    ![Choosing a VM size](Images/create-data-science-vm-2.png)

    _Choosing a VM size_

1. In the "Settings" blade, click **OK** at the bottom. 

1. In the "Create" blade, take a moment to review the options you selected for the VM, and click **Create** to start the VM creation process.

    ![Creating the VM](Images/create-data-science-vm-3.png)

    _Creating the VM_

1. Click **Resource groups** in the menu on the left side of the portal. Then click the "data-science-rg" resource group.

    ![Opening the resource group](Images/open-resource-group.png)

    _Opening the resource group_

1. Wait until "Deploying" changes to "Succeeded" indicating that DSVM and supporting Azure resources have been created. Deployment typically takes 5 minutes or less. Periodically click **Refresh** at the top of the blade to refresh the deployment status. 

    ![Monitoring the deployment status](Images/deployment-succeeded.png)

    _Monitoring the deployment_

Once the deployment has completed, proceed to the next exercise.

<a name="Exercise2"></a>
## Exercise 2: Connect to the Data Science VM ##

In this exercise, you will connect remotely to the Ubuntu desktop in the VM that you created in the previous exercise. To do so, you need a client that supports [Xfce](https://xfce.org/), which is a lightweight desktop environment for Linux.

1. If you don't already have an Xfce client installed, download the [X2Go client](https://wiki.x2go.org/doku.php/download:start) and install it before continuing with this exercise. X2Go is a free and open-source Xfce solution that works on a variety of operating systems, including Windows and OS X. The instructions in this exercise assume you are using X2Go, but you may use any client that supports Xfce.

1. Return to the "data-science-rg" resource group in the Azure portal. Click the "data-science-vm" resource to open it in the portal.

    ![Opening the Data Science VM](Images/open-data-science-vm.png)

    _Opening the Data Science VM_

1. Hover over the IP address shown for the VM and click the **Copy** button that appears to copy the IP address to the clipboard.

    ![Copying the VM's IP address](Images/copy-ip-address.png)

    _Copying the VM's IP address_

1. Start the X2Go client and connect to the Data Science VM using the IP address on the clipboard and the user name you specified in the previous exercise. Connect via port **22** (the standard port used for SSH connections), and specify **XFCE** as the session type. Click the **OK** button to confirm your preferences.

    ![Connecting with X2Go](Images/new-session-1.png)

    _Connecting with X2Go_

1. In the "New session" panel on the right, select the resolution that you wish to use for the remote desktop. Then click **New session** at the top of the panel.

    ![Starting a new session](Images/new-session-2.png)

    _Starting a new session_

1. Enter the password you specified in [Exercise 1](#Exercise1), and then click the **OK** button. If asked if you trust the host key, answer **Yes**. Also ignore any error messages stating that "SSH daemon could not be started."

    ![Logging into the VM](Images/new-session-3.png)

    _Logging into the VM_

1. Wait for the remote desktop to appear and confirm that it resembles the one below.

    > If the text and icons on the desktop are too large, terminate the session. Click the icon in the lower-right corner of the "New Session" panel and select **Session preferences...** from the ensuing menu. Go to the "Input/Output" tab in the "New session" dialog and adjust the display DPI. Start with 96 and adjust as needed to get the look you want.

    ![Connected!](Images/ubuntu-desktop.png)

    _Connected!_

Now that you are connected, take a moment to explore the shortcuts on the desktop. These are shortcuts to the numerous data-science tools preinstalled in the VM, which include [Jupyter](http://jupyter.org/), [R Studio](https://www.rstudio.com/), and the [Microsoft Azure Storage Explorer](https://azure.microsoft.com/en-us/features/storage-explorer/), among others.

<a name="Exercise3"></a>
## Exercise 3: Train a TensorFlow model ##

In this exercise, you will train an image-classification model built with [TensorFlow](https://www.tensorflow.org/) to recognize images that contain hot dogs. Rather than create the model from scratch, which would require vast amounts of computing power and thousands — perhaps tens of thousands — of images, you will leverage a preexisting model, a practice known as [transfer learning](https://en.wikipedia.org/wiki/Transfer_learning).

The model you will use is a member of the [MobileNets](https://research.googleblog.com/2017/06/mobilenets-open-source-models-for.html) family, which is a collection of computer-vision models built with TensorFlow that are optimized for mobile devices. They are small, low-latency, and power-efficient, which makes them ideal for smartphones and tablets. They work on desktop devices, too, but are slightly less accurate than conventional TensorFlow models. More importantly, they generally deliver acceptable accuracy when trained with as few as several dozen images.

Training a MobileNet model to recognize hot-dog images is essentially a matter of adding a layer to a neural network whose existing layers are trained to perform image classification. The extra layer is what enables the modified network to recognize hot dogs. Building that layer, however, requires hundreds of lines of complex Python code. Rather than write that code yourself, you will use a training script written by Google and published in a public GitHub repository. The same script could be used to train the model to recognize cat images or perform other image-classification tasks. Only the images and the labels that accompany them need to change.

1. Click the Terminal icon at the bottom of the screen to open a terminal window.

    ![Launching a terminal window](Images/launch-terminal.png)

    _Launching a terminal window_

1. Execute the following command in the terminal window to navigate to the "notebooks" folder:

    ```bash
    cd notebooks
    ```

1. Now use the following command to clone the model from GitHub:

    ```bash
    git clone https://github.com/googlecodelabs/tensorflow-for-poets-2
    ```

1. Once cloning is complete, navigate to the folder containing the cloned model:

    ```bash
    cd tensorflow-for-poets-2
    ```

1. Now use the following command to download the images that will be used to train the model:

    ```bash
    wget https://topcs.blob.core.windows.net/public/tensorflow-resources.zip -O temp.zip; unzip temp.zip -d tf_files; rm temp.zip
    ```

1. Click the File Manager icon at the bottom of the screen to open a File Manager window.

    ![Launching File Manager](Images/launch-file-manager.png)

    _Launching File Manager_

1. In File Manager, navigate to the "notebooks/tensorflow-for-poets-2/tf_files" folder. Confirm that the folder contains a pair of subdirectories named "hot_dog" and "not_hot_dog." The former contains several hundred images containing hot dogs, while the latter contains an equal number of images that do **not** contain hot dogs. Browse the images in the "hot_dog" folder to get a feel for what they look like. Check out the images in the "not_hot_dog" folder as well.

    > In order to train a neural network to determine whether an image contains a hot dog, you have to train it with images that contain hot dogs as well as images that do not.

    ![Images in the "hot_dog" folder](Images/hot-dog-images.png)

    *Images in the "hot_dog" folder*

    Also confirm that the folder contains a text file named **retrained_labels_hotdog.txt**. This file identifies the subdirectories containing the training images. It is used by the Python script that trains the model to recognize hot-dog images.

1. Open a *new* terminal window and navigate to the "notebooks/tensorflow-for-poets-2" folder — the same one that is open in the first terminal window. Then use the following command to launch [TensorBoard](https://www.tensorflow.org/programmers_guide/summaries_and_tensorboard), which is a set of tools used to visualize TensorFlow models and gain insight into the transfer-learning process: 

     ```bash
     tensorboard --logdir tf_files/training_summaries
     ```

     > This command will fail if there is already an instance of TensorBoard running. If you see an error complaining that port 6006 is already in use, use a ```pkill -f "tensorboard"``` command to kill it. Then execute the ```tensorboard``` command again.

1. Switch back to the original terminal window and execute the following commands to start the transfer-learning process — that is, to train the model with the images you downloaded earlier. **Tip**: You can copy these commands to the clipboard, and then use **Shift+Ins** to paste them into the terminal window.

      ```bash
      IMAGE_SIZE=224;
      ARCHITECTURE="mobilenet_0.50_${IMAGE_SIZE}";
      python scripts/retrain.py \
      --bottleneck_dir=tf_files/bottlenecks \
      --how_many_training_steps=500 \
      --model_dir=tf_files/models/ \
      --summaries_dir=tf_files/training_summaries/"${ARCHITECTURE}" \
      --output_graph=tf_files/retrained_graph_hotdog.pb \
      --output_labels=tf_files/retrained_labels_hotdog.txt \
      --architecture="${ARCHITECTURE}" \
      --image_dir=tf_files \
      --testing_percentage=15 \
      --validation_percentage=15
      ```

    TODO: Provide an explanation of the parameters passed to the Python script.

1. Wait for training to complete; it should take less than 5 minutes. Then check the output to determine the accuracy of the model. Your result may vary slightly from the one below because the training process involves a small amount of random estimation.

      ![Gauging the accuracy](Images/running-transfer-learning.png)

      _Gauging the accuracy_

1. Click the browser icon at the bottom of the desktop to open the browser installed in the Data Science VM. Then navigate to http://0.0.0.0:6006 to connect to Tensorboard.

    ![Launching Firefox](Images/launch-firefox.png)

    _Launching Firefox_

1. Inspect the graph labeled "accuracy_1." The blue line depicts the accuracy achieved over time as the 500 training steps are executed. Confirm that the end of the blue line coincides with the accuracy recorded in the previous step.

	![The TensorBoard Scalars display](Images/tensorboard-scalars.png)

	_The TensorBoard Scalars display_

1. Switch back to File Manager and navigate to the "notebooks/tensorflow-for-poets-2/tf_files" folder. Confirm that it contains a file named **retrained_graph_hotdog.pb**. *This file was created during the training process and contains the trained TensorFlow model*. You will use it in the next exercise to invoke the model from the NotHotDog app.

The script that you executed in Step 9 specified 500 training steps, which strikes a balance between accuracy and the time required for training. If you would like, try training the model again with a higher ```how_many_training_steps``` value such as 1000 or 2000. A higher step count generally results in higher accuracy, but at the expense of increased training time.

<a name="Exercise4"></a>
## Exercise 4: Create a NotHotDog app ##

In this exercise, you will use [Visual Studio Code](https://code.visualstudio.com/), Microsoft's free, cross-platform source-code editor which is preinstalled in the Data Science VM, to write a NotHotDog app in Python. The app will use [Tkinter](https://wiki.python.org/moin/TkInter), which is a popular GUI framework for Python, to implement its user interface, and it will allow you to select images from your local file system. Then it will pass those images to the model you trained in the previous exercise and tell you whether they contain a hot dog.

1. Click **Applications** in the upper-left corner of the desktop and select **Accessories > Visual Studio Code** to start Visual Studio Code. Use Visual Studio Code's **File > Open Folder...** command to open the "notebooks/tensorflow-for-poets-2/tf_files" folder containing the **retrained_graph_hotdog.pb** file created when you trained the model.

1. Create a new file named **classify.py** in the current folder. If Visual Studio Code offers to install the Python extension, click **Install** to install it. Use **Shift+Ins** to paste in the following Python code, and then save the file:

    ```python
	import tkinter as tk
	from tkinter import messagebox, filedialog, font
	from PIL import ImageTk, Image
	import subprocess
	
	def select_image_click(img_label):
	    try:
	        file = filedialog.askopenfilename()
	
	        img = Image.open(file)
	        img = img.resize((300, 300))
	        selected_img = ImageTk.PhotoImage(img)
	
	        img_label.configure(image=selected_img, width=240)
	
	        output = subprocess.check_output(["python",
	            "../scripts/label_image.py",
	            "--graph=retrained_graph_hotdog.pb",
	            "--image={0}".format(file),
	            "--labels=retrained_labels_hotdog.txt"])
	
	        highest = str(output).split("\\n")[3].split(" ")
	
	        if len(highest) == 3:
	            score = float(highest[2])
	            is_hotdog = True
	        else:
	            score = float(highest[3])
	            is_hotdog = False
	
	        if score > 0.95:
	            if is_hotdog:
	                messagebox.showinfo("Result", "That's a hot dog!")
	            else:
	                messagebox.showinfo("Result", "That's not a hot dog.")
	        else:
	            messagebox.showinfo("Result", "Unknown")
	
	    except FileNotFoundError as e:
	        messagebox.showerror("File not found", "File {0} was not found.".format(e.filename))
	
	def run():
	    window = tk.Tk()
	
	    window.title("Hotdog or Not Hotdog")
	    window.geometry('400x600')
	
	    text_font = font.Font(size=18, family="Helvetica Neue")
	    welcome_text = tk.Label(window, text="Hot Dog or Not Hot Dog", font=text_font)
	    welcome_text.pack()
	
	    instructions_text = tk.Label(window, text="\n\nUse a neural network built with Tensorflow\n"
	        "to identify photos containing hot dogs")
	    instructions_text.pack(fill=tk.X)
	
	    select_btn = tk.Button(window, text="Select", bg="#0063B1", fg="white", width=5, height=1)
	    select_btn.pack(pady=30)
	
	    image_label = tk.Label(window)
	    image_label.pack()
	
	    select_btn.configure(command=lambda: select_image_click(image_label))
	    window.mainloop()
	
	if __name__ == "__main__":
	    run()
    ```

    They key code here is the call to ```subprocess.check_output```, which invokes the trained model by executing a Python script named **label_image.py** found in the "scripts" folder, passing in the image that the user selected.

1. Use your favorite search engine to find a few food images — some containing hot dogs, and some not. Download these images and store them in the location of your choice in the VM's file system.

1. Use Visual Studio Code's **View > Integrated Terminal** command to open an integrated terminal. Then execute the following command in the integrated terminal to run the app:

     ```bash
     python classify.py
     ```

1. Click the **Select** button and pick one of the hot-dog images you downloaded in Step 3. Wait for a message box to appear, indicating whether the image contains a hot dog. Did the model get it correct?

    ![Selecting an image](Images/select-image.png)

    _Selecting an image_

1. Repeat the previous step using one of the images that doesn't contain a hot dog. Was the model right this time?

Continue feeding food images into the app until you're satisfied that it can identify images containing hot dogs. Don't expect it to be right 100% of the time, but do expect it to be right *most* of the time.

<a name="Exercise5"></a>
## Exercise 5: Delete the Data Science VM ##

In this exercise, you will delete the resource group created in [Exercise 1](#Exercise1) when you created the Data Science VM. Deleting the resource group deletes everything in it and prevents any further charges from being incurred for it. Resource groups that are deleted can't be recovered, so be certain you're finished using it before deleting it. However, it is **important not to leave this resource group deployed any longer than necessary** because a Data Science VM is moderately expensive.

1. Return to the blade for the resource group you created in Exercise 1. Then click the **Delete resource group** button at the top of the blade.

    ![Deleting the resource group](Images/delete-resource-group.png)

    _Deleting the resource group_

1. For safety, you are required to type in the resource group's name. (Once deleted, a resource group cannot be recovered.) Type the name of the resource group. Then click the **Delete** button to remove all traces of this lab from your Azure subscription.

After a few minutes, the resource group and all of its resources will be deleted. Billing stops when you click **Delete**, so you're not charged for the time required to delete the resources. Similarly, billing doesn't start until the resources are fully and successfully deployed.

<a name="Summary"></a>
## Summary ##

The steps in this lab may be generalized to perform other types of image-classification tasks. For example, you could train the same TensorFlow model to recognize cat images or identify defective parts parts produced on an assembly line. Image classification is one of the most prevalent uses of machine learning today, and its usefulness will only increase over time. Now that you have a basis to work from, try creating some image-classification models of oyur own. You never know what might come of it!

---

Copyright 2018 Microsoft Corporation. All rights reserved. Except where otherwise noted, these materials are licensed under the terms of the MIT License. You may use them according to the license as is most appropriate for your project. The terms of this license can be found at https://opensource.org/licenses/MIT.
