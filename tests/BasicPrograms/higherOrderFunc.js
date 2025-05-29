/*A higher-order function in JavaScript is a function that does at least one of the following:
Takes another function as an argument, or
Returns a function as its result.

*/

//Passing as an argument
function greet(name) {
  return `Hello, ${name}!`;
}

function processInput(callback) {
  const name = "Basava";
  console.log(callback(name));
}

processInput(greet);
