var cats = ["Siamese","Calico","Tabby"];
var chosenCat = "Tabby";
var counterCustom = 0;

function doWhileCats ( theArray, find, counter ) {
  var message = "";

  do {
    message += "Looking for a " + find + " and found a " + theArray[counter] + ".";
    if(counter > 0) {
      message += "\n";
    }
    if(find === theArray[counter]) {
      message += "This is where code would execute based on the comparison being true!";
    }
    counter++;
  }
  while (counter < theArray.length);

  console.log(message);
}

function whileCats ( theArray, find, counter ) {
  var message = "";

  while (counter < theArray.length) {
    message += "Looking for a " + find + " and found a " + theArray[counter] + ".";
    if(counter > 0) {
      message += "\n";
    }
    if(find === theArray[counter]) {
      message += "This is where code would execute based on the comparison being true!";
    }
    counter++;
  };
  
  console.log(message);
}

console.log("------ ------ ------ ------ ------ ------ ------ ------");
console.log("Calling the do while to print out custom messages.");
doWhileCats(cats, chosenCat, counterCustom);
console.log("------ ------ ------ ------ ------ ------ ------ ------");

console.log("Calling the while loop to print out custom messages.");
whileCats(cats, chosenCat, counterCustom);
console.log("------ ------ ------ ------ ------ ------ ------ ------");