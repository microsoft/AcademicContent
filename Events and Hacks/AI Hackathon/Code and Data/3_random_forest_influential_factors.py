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

forestation= pd.read_csv('forestation_1.csv')
forestation

y= forestation[['Fire']] # predicting fire
categoricals =  pd.get_dummies(forestation[['Fuel', 'Slopes', 'Access','SB','Drought']])

X = pd.concat([categoricals], axis = 1)

clf = RandomForestClassifier(random_state=seed)
clf = clf.fit(X, y.values.ravel())

y_pred = clf.predict(X)

def plot_feature_importance(importance,names,model_type):

    feature_importance = np.array(importance)
    feature_names = np.array(names)

    data={'feature_names':feature_names,'feature_importance':feature_importance}
    fi_df = pd.DataFrame(data)

    fi_df.sort_values(by=['feature_importance'], ascending=False,inplace=True)

    plt.figure(figsize=(10,8))
    sns.barplot(x=fi_df['feature_importance'], y=fi_df['feature_names'])
    plt.title(model_type + 'FEATURE IMPORTANCE')
    plt.xlabel('FEATURE IMPORTANCE')
    plt.ylabel('FEATURE NAMES')

plot_feature_importance(clf.feature_importances_,X.columns,'RANDOM FOREST ')
plt.show()
