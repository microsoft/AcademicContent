#!/usr/bin/env python3
# K-means clustering on the USDA NNDB dataset

# Import pandas and read the csv file
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

# Get number of clusters from user
k = int(input("Input number of clusters "))
dataset = input("Enter file path to USDA-nndb-combined.csv (without quotes around file path) ")

# Load and prepare the data
df = pd.read_csv(dataset, encoding='latin_1')

# Separate description from numeric features
desc_df = df.iloc[:, [0, 1, 2]+[i for i in range(50, 54)]]
desc_df.set_index('NDB_No', inplace=True)
nutr_df = df.iloc[:, :-5]
nutr_df = nutr_df.drop(['FoodGroup', 'Shrt_Desc'], axis=1)
nutr_df.set_index('NDB_No', inplace=True)

# Drop correlations
# Note alternate DataFrame.drop() call below if necessary for students
nutr_df.drop(['Folate_DFE_(Âµg)', 'Vit_A_RAE', 'Vit_D_IU'], inplace=True, axis=1)
#nutr_df.drop(['Folate_DFE_(µg)', 'Vit_A_RAE', 'Vit_D_IU'], inplace=True, axis=1)
nutr_df = nutr_df.dropna()

# Center the data
X = StandardScaler().fit_transform(nutr_df)

# Fit the k-means model
kmeansmodel = KMeans(n_clusters=k, random_state=13)
kmeansmodel.fit(X)
nutr_df['Cluster'] = kmeansmodel.labels_

# Calculate distances for data points to centroids and add to df
merged_df = nutr_df.join(desc_df)
distances = kmeansmodel.fit_transform(X)
merged_df['Distance'] = np.min(distances, axis=1)

# Print food groups closest to respective cluster centroids
for i in range(k):
    print()
    print("Cluster %d" % i)
    print(merged_df.loc[nutr_df['Cluster'] == i].sort_values(by='Distance')['FoodGroup'][:500].value_counts())
