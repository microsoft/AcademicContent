// Three standard variable functions.
var sayHelloInEnglish = function() {
  return "Hello"
}

var sayHelloInTatar = function() {
  return "Isänme"
}

var sayHelloInSwedish = function() {
  return "Hej"
}

console.log("Tatar " +
  sayHelloInTatar() +
  " & Swedish " +
  sayHelloInSwedish() +
  " & English " +
  sayHelloInEnglish())
