# Data Science 1: Introduction to Python for Data Science
This README contains a recommended schedule, an outline of the content, and tips and tricks for teaching this content. This workshop is meant to be highly interactive. The instructor should lead the class in two two interactive teaching styles:
1. **Interactive Lecturing:** The majority of content for this workshop is in a Notebook. Though you will introduce learners in a PowerPoint, the rest of the workshop will consist of walking them through the Notebooks. During this time, you should employ an interactive lecture style, where you ask students what they think will happen, pause for questions, and add your own anecdotes. 
2. **Think, Pair, Share:** For some of the more complex topics, you will use the "Think, Pair, Share" method. This is where you present the learners with a question and then give them about 45 seconds to think quietly to themselves what might happen. During this time you *must* reinforce the no-talking policy. Then you give students about 1 minute to pair with 1-2 people next to them and discuss what they think the answer is and *why*. Finally, you ask for a few people to share with the class as a whole. During the sharing time, you should reinforce the type of discussion they should be having in their pairing (e.g. why, why not, how could you change the code to yield a different answer, when would this code come in handy, etc). 
The Think, Pair, Share style is called out in the Instructor Notebooks, otherwise you should assume the Interactive Lecturing style. 

Students will also have additional content that is meant for learning on their own and referring back to later. This content is at the bottom of the Notebooks. You will introduce this content, but are not expected to go through it during the workshops. 

## Recommended Schedule
There are four sections in this workshop, but section 1

| Hour | Topic |
| ---- | ----- | 
| 10 - 10:15am | Introduction |
| 10:15 - 11:30am | [Intro to Python](https://datascience1-sguthals.notebooks.azure.com/j/notebooks/Instructor_Notebook-Section_1.ipynb) |
| 11:30 - 11:45am | Break |
| 11:45 - 12:30pm | [NumPy](https://datascience1-sguthals.notebooks.azure.com/j/notebooks/Instructor_Notebook-Section_2.ipynb) | 
| 12:30 - 1:30pm | Lunch | 
| 1:30 - 2:30pm | [Pandas](https://datascience1-sguthals.notebooks.azure.com/j/notebooks/Instructor_Notebook-Section_3.ipynb) | 
| 2:30 - 2:45pm | Break |
| 2:45 - 3:30pm | [Cleaning Data](https://datascience1-sguthals.notebooks.azure.com/j/notebooks/Instructor_Notebook-Section_4.ipynb) | 
| 3:30 - 4pm | [Capstone Introduction](https://datascience1-sguthals.notebooks.azure.com/j/notebooks/Capstone.ipynb) |

## Content Outline
This content is separated into three different sections:
1. Interactive Lecture
2. Think, Pair, Share
3. Independent Learning

### Intro to Python
The [Intro to Python](https://datascience1-sguthals.notebooks.azure.com/j/notebooks/Instructor_Notebook-Section_1.ipynb) section is meant to introduce learners to the basics of the programming language Python. The topics of this notebook include:
- Arithmetic and Numberic Types 
- Variables
- Expressions
- Strings
  - Slicing Strings is similar to how learners will access data in NumPy and Pandas
- Lists
  - Lists are the basis for NumPy and Pandas data structures
- List Object Methods
- Tuples
- Membership Testing
- Dictionaries
- Control Flow
  - If Statements
  - For-Loops
  - While-Loops
  - List Comprehensions
- Importing Modules

### NumPy
The [NumPy](https://datascience1-sguthals.notebooks.azure.com/j/notebooks/Instructor_Notebook-Section_2.ipynb) section will introduce learners to the NumPy library and re-inforce what they learned in the Intro to Python section, but using arrays. The topics of this notebook include:


## Tips and Tricks
Azure Notebooks is still in Preview. This means that there are some times when it will fail. Here are some tips for avoiding learners losing their work:
- Remind learners to ensure their work is being saved. In the Jupyter Notebook there is always one of two messages to the right of the title of the notebook: `(autosaved)` or `(unsaved changes)`. Make sure students are noticing that their work is being saved. You should remind them every 10 minutes or so. 
- Sometimes Notebooks get into a state where the Kernel cannot be started. Sometimes re-starting the kernel will work. But often learners will have to somepletely sign out of Azure Notebooks and then sign back in. 
