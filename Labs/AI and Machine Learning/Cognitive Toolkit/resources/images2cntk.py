#This script converts the MNIST Data files into PNG files for each respective image in the file set.

from os import walk
from PIL import Image

imagePath = "input-images"

files = []
for (dirpath, dirnames, filenames) in walk(imagePath):
    files.extend(filenames)
    break


cntkfile = open('Custom-Test-28x28_cntk_text.txt', 'w')
	
for filename in files:
	im = Image.open(imagePath + "/" + filename)
	im_grey = im.convert('LA') # convert to grayscale
	width,height = im.size

	cntkline = "|labels "
	
	fileparts = filename.split("-")
	
	digit = int(fileparts[0])
	
	for i in range(0,10):
		label = "0 "
		if i == digit:
			label = "1 "
			
		cntkline += label
		
	cntkline += "|features"
	
	for i in range(0,height):
		for j in range(0,width):
			digit = 255 - im_grey.getpixel((j,i))[0]
			cntkline += " " + str(digit)
			

	cntkfile.write(cntkline + "\n")


cntkfile.close()
