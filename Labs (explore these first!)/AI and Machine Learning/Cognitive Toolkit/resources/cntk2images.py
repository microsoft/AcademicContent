
#

from os import walk
from PIL import Image
import numpy as np

inputFile = ''

with open(inputFile) as f:
    images = f.readlines()

images = [line.strip() for line in images]

w, h = 28, 28

imgcnt = 0;


for imageline in images:

	dataparts = imageline.split(" |features ")
	imagedatastr = dataparts[1].split(" ")

	
	imagedata = np.zeros((h, w), dtype=np.uint8)

	rowIdx = 0;
	colIdx = 0;
	
	for i in imagedatastr:

		imagedata[colIdx, rowIdx] = 255 - int(i)
		
		rowIdx += 1
		
		if rowIdx % h == 0:
			rowIdx = 0
			colIdx += 1
		
	imgcnt += 1
	
	im = Image.fromarray(imagedata, 'L')
	im.save(str(imgcnt) + ".png")
	
	