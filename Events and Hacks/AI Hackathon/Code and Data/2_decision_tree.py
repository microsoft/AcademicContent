from sklearn import tree
from sklearn.tree import export_graphviz
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import pandas as pd
import graphviz
import os
os.chdir("data")

seed = 1234
power_investment = pd.read_csv('powergen.csv')
y= power_investment[['Profitable']] 
X =  pd.get_dummies(power_investment[['Sector', 'Hemisphere', 'Value']])

clf = tree.DecisionTreeClassifier(max_depth=4, random_state=seed)
clf = clf.fit(X, y)

# Disable graphviz for non Windows environments
export_graphviz(clf, out_file='tree.dot', 
                        feature_names=X.columns,  
                        class_names=['Yes', 'No'],
                        filled=True)

# Convert to png and show image
#from subprocess import call
#call(['dot', '-Tpng', 'tree.dot', '-o', 'tree.png', '-Gdpi=600'])

#Show plot
image = mpimg.imread('tree.png')
plt.imshow(image)
plt.show()






