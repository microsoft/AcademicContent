from pylab import *

x = [1,2,3,4,5,6,7,8,9,10,11]   
y = [11,12,25,21,31,40,48,55,54,60,61]   

scatter (x,y)

(m,c)=polyfit(x,y,1) 

print ("Slope(m),", m)

print ("y-intercept (c),", c)

yp=polyval([m,c],x) 

x2 = 12

y2 = m*x2 + c

print ("Predicted value of y in month 12,", y2)

plot(x2, y2, 'ro')

plot(x,yp)

grid (True)

xlabel('x')

ylabel('y')

show()

