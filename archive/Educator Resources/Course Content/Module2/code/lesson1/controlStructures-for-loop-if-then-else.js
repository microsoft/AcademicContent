var cats = ["Siamese","Calico","Tabby"];
var chosenCat = "Siamese";
var falseCat = "Invisible";

function forLooping ( theArray ) {
  for(var i = 0; i < theArray.length; i++) {
    console.log(theArray[i]);
  }
}

function theIf ( theArray, item ) {
  for(var i = 0; i < theArray.length; i++) {
  	if(item === theArray[i]) {
  	  console.log("I found the " + theArray[i] + "!");
  	}
  }
}

function ifElse ( theArray, item ) {
  for(var i = 0; i < theArray.length; i++) {
  	if(item === theArray[i]) {
  	  console.log("I found the " + theArray[i] + "!");
  	} else if (item !== theArray[i]) {
  	  console.log("No great cat found, yet!");
  	}
  }
}

console.log("------ ------ ------ ------ ------ ------ ------ ------");
console.log("Calling the for loop control structure.");
forLooping(cats);
console.log("------ ------ ------ ------ ------ ------ ------ ------");

console.log("Calling and finding a specific type of cat.");
theIf(cats, chosenCat);
console.log("------ ------ ------ ------ ------ ------ ------ ------");

console.log("Calling and finding no specific cat returns a different message.");
ifElse(cats, falseCat);
console.log("------ ------ ------ ------ ------ ------ ------ ------");
