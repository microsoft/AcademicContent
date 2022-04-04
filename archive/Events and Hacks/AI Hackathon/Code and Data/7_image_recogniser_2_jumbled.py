plt.imshow(recognisedimage['original'], interpolation='nearest', cmap=plt.cm.Greys_r)

plt.show()

recognisedimage = min(trainimages[:x], key=lambda e: sum((e['singular']-testimage['singular'])**2))

from scipy import misc

trainimages = []

for i in range(x):

    A = misc.imread(str(i) + '.png', flatten=True)

    B, c, D = np.linalg.svd(A, full_matrices=False) 

    trainimages.append({'original': A, 'singular': c[:x]})  

import numpy as np

import matplotlib.pyplot as plt

testimage = trainimages[x]  

import os
os.chdir('data/images_part1')
