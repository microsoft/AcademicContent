var cats = ["Siamese","Calico","Tabby",""];

function actionCats ( theArray ) {
  for(var i = 0; i < theArray.length; i++) {
    switch (theArray[i]) {
      case "Siamese":
        console.log("A Siamese cat has an active imagination.");
        break;
      case "Calico":
        console.log("Calico's are striking.");
        break;
      case "Tabby":
        console.log("Orangish.");
        break;
      default:
        console.log("No Cat Specified!");
    }
  }
}

console.log("------ ------ ------ ------ ------ ------ ------ ------");
console.log("Calling the switch to print out custom messages.");
actionCats(cats);
console.log("------ ------ ------ ------ ------ ------ ------ ------");
