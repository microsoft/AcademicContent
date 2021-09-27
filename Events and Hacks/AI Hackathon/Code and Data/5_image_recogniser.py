import scipy
import numpy as np
import matplotlib.pyplot as plt
from sklearn.externals._pilutil import imread
import os
os.chdir('data/images_part1')

trainimage = []
for i in range(11):
    A = imread(str(i) + '.png', flatten = True)
    B, c, D = np.linalg.svd(A)
    trainimage.append({'original': A, 'singular': c[:10]})  

testimage = trainimage[10]  

recognisedimage = min(trainimage[:10], key=lambda e: sum((e['singular']-testimage['singular'])**2))

plt.imshow(recognisedimage['original'], interpolation='nearest', cmap=plt.cm.Greys_r)
plt.show()



