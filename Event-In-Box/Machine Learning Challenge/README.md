# Machine Learning Challenge

The purpose of the Machine Learning Challenge is to acquaint students with [Azure Machine Learning](https://azure.microsoft.com/en-us/services/machine-learning/) and [Machine Learning Studio](https://studio.azureml.net/), teach them how to build a basic machine-learning model, and put their data-science skills to work improving the model. The "challenge" is to get the model's accuracy to 90% or greater, up from the 62% accuracy it exhibits initially. Students are challenged to make the improvements themselves, but are provided with helpful hints to guide their way.

## Leading an Event

Here is a suggested itinerary if you are leading a Machine Learning Challenge event:

- Begin by using the first 16 slides of the accompanying slide deck (**Machine Learning Challenge.pptx**) to introduce students to machine learning
	 - In the first demo (slide 8), work Exercise 1 of the challenge and invite students to follow along with you
	 - In the second demo (slide 15), work Exercise 2 of the challenge and invite students to follow along with you
- When you reach slide 17 ("Take the challenge!"), turn it over to the students and invite them to open **Machine Learning Challenge.html** and work Exercise 3 on their own. Challenge them to build a better model *without* adding features to the model or changing the 80-20 split of training data and scoring data.
	- Give students an hour or more to work the challenge, and invite them to raise a hand when they improve the model's accuracy. Check out the work that they did and make sure it's "legal" — for example, that they didn't increase accuracy by introducing additional features to the model that positively bias the results.
	- Optionally maintain a leaderboard at the front of the room that shows the highest AUC achieved to this point, and use it to engender friendly competition among the students
- Once the challenge is complete, use slides 18-20 in the slide deck to introduce the concept of operationalizing a model by deploying it as a Web service
	- In the third demo (slide 20), work Exercise 4 of the challenge and invite the audience to watch (but not to follow along)
- Use slides 21-24 to introduce Microsoft Cognitive Services, positioning it as a cool set of APIs that utilize sophisticated machine-learning models built by researchers as Microsoft

Finish up by recognizing the student who achieved the highest AUC, discussing some of the techniques he or she used to do it, and giving out prizes. Make it fun, because learning should always be fun! 