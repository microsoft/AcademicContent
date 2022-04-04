from sklearn import tree
from sklearn.ensemble import RandomForestClassifier
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import seaborn as sns
from sklearn.metrics import accuracy_score
import os
os.chdir("data")
seed = 1234

#get data
forestation= pd.read_csv('forestation.csv')
forestation

y= forestation[['Fire']] # predicting Risk
categoricals =  pd.get_dummies(forestation[['Fuel', 'Slopes', 'Access','SB','Drought']])#get dummies for categoricals

X = pd.concat([categoricals], axis = 1)

clf = RandomForestClassifier(random_state=seed, max_depth = 5) # maximum depth of 3, use seed for repeatability
clf = clf.fit(X, y.values.ravel())# fit a model

y_pred = clf.predict(X)
accuracy = accuracy_score(y, y_pred, normalize=True)

Fuel = 0
Slopes = 0
Access = 0
SB = 0
Drought = 1

print ('Accuracy: ', accuracy)
print(clf.predict([[Fuel,Slopes,Access,SB,Drought]]))

##note - the print function below allows you to see the features as set out in the algorithm
##with pd.option_context('display.max_rows', None, 'display.max_columns', None): print(X)
