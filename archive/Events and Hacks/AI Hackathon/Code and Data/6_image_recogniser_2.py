import numpy as np
import matplotlib.pyplot as plt
from sklearn.externals._pilutil import imread
import os
os.chdir('data/images_part2')

trainimage = []
for i in range(22):
    A = imread(str(i) + '.tif', flatten = True)
    B, c, D = np.linalg.svd(A)
    trainimage.append({'original': A, 'singular': c[:21]})  

testimage = trainimage[21]  

recognisedimage = min(trainimage[:21], key=lambda e: sum((e['singular']-testimage['singular'])**2))

plt.imshow(recognisedimage['original'], interpolation='nearest', cmap=plt.cm.Greys_r)
plt.show()



