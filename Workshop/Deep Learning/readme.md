# Deep Learning

This folder contains several series of hands-on labs designed to introduce tools and libraries for building intelligent apps that leverage Artificial Intelligence (AI) and machine learning. Some of the tools and libraries that are covered include:

- The [Microsoft Data Science VM](https://docs.microsoft.com/azure/machine-learning/data-science-virtual-machine/overview)
- The [Microsoft Cognitive Toolkit](https://www.microsoft.com/en-us/research/product/cognitive-toolkit/)
- [Azure Machine Learning Workbench](https://docs.microsoft.com/en-us/azure/machine-learning/preview/quickstart-installation)
- The [Microsoft Machine Learning Library for Apache Spark](https://blogs.technet.microsoft.com/machinelearning/2017/06/07/announcing-microsoft-machine-learning-library-for-apache-spark/) (MMLSpark)
- [Microsoft Power BI](https://powerbi.microsoft.com/en-us/)
- [Scikit-learn](http://scikit-learn.org/stable/)

Each subfolder contains one series of hands-on labs and has a number in the name (200, 300, or 400) that represents the level of technical detail in the series, with 400 being the most advanced. Each series consists of four hands-on labs that build on top of one another and follow this pattern:

- Ingest - Gather data
- Process - Prepare or clean the data for use in machine learning
- Predict - Train and score a machine-learning model
- Visualize - Visualize the output from the model

To work a series of labs, start with the first lab in the series, then proceed to the second, the third, and the fourth, in that order. Depending on the technical level, a series generally requires 1 to 2 hours to work from start to finish.

Lab | Scenario | Technology/Language
--- | -------- | -------------------
[200 - Machine Learning in Python](./200%20-%20Machine%20Learning%20in%20Python) | Create a Data Science Virtual Machine DSVM), import a dataset containing on-time arrival information for a major U.S. airline, and use scikit-learn to build a machine-learning model in a Jupyter notebook that predicts whether flights will arrive on time. | [Data Science Virtual Machine](https://docs.microsoft.com/azure/machine-learning/data-science-virtual-machine/overview)<br>[Scikit-learn](http://scikit-learn.org/stable/)<br>[Jupyter](http://jupyter.org/)<br>Python
[300 - Neural Networks with CNTK](./300%20-%20Neural%20Networks%20with%20CNTK) | Use the [MNIST database](http://yann.lecun.com/exdb/mnist/) to train a neural network built with the Microsoft Cognitive Toolkit and Azure Machine Learning Workbench to recognize handwritten digits. Then deploy the model and write a Node.js app to visualize the output. | [Microsoft Cognitive Toolkit](https://www.microsoft.com/en-us/research/product/cognitive-toolkit/)<br>[Azure Machine Learning Workbench](https://docs.microsoft.com/en-us/azure/machine-learning/preview/quickstart-installation)<br>Python and JavaScript
[400 - Image Classification with MMLSpark](./400%20-%20Image%20Classification%20with%20MMLSpark) | Use Bing Image Search to create a database of famous paintings. Then train a deep neural network (DNN) to recognize the artists of those paintings and write a Node.js app that uses the DNN to examine uploaded images and identify the artists. | [MMLSpark](https://github.com/Azure/mmlspark)<br>[Azure Machine Learning Workbench](https://docs.microsoft.com/en-us/azure/machine-learning/preview/quickstart-installation)<br>[Bing Image Search API](https://azure.microsoft.com/services/cognitive-services/bing-image-search-api/)<br>[Azure SQL Database](https://azure.microsoft.com/services/sql-database/)<br>Python and JavaScript
[400 - Stream Analytics and Machine Learning](./400%20-%20Stream%20Analytics%20and%20Machine%20Learning) | Build an end-to-end system that examines photos taken by simulated cameras in the Arctic and identifies those containing pictures of polar bears. Then use Power BI to build a real-time dashboard showing where polar bears are being spotted. | [Azure Stream Analytics](https://azure.microsoft.com/services/stream-analytics/)<br>[Azure Machine Learning Workbench](https://docs.microsoft.com/azure/machine-learning/preview/quickstart-installation)<br>[Custom Vision Service](https://azure.microsoft.com/services/cognitive-services/custom-vision-service/)<br>[Azure SQL Database](https://azure.microsoft.com/services/sql-database/)<br>[Microsoft Power BI](https://powerbi.microsoft.com/)<br>Python and JavaScript

Data science is the new frontier in software development. Use these labs to expand your knowledge of AI, machine learning, and deep learning with neural networks, and acquire first-hand experience with some of the tools of the trade.