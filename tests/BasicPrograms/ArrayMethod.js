//Return a new array with the square root of all element values:

const person = [
  { firstName: "Basava", lastName: "Reynolds" },
  { firstName: "Raj", lastName: "g" },
];

person.map(getFullName);

function getFullName(item) {
  return [item.firstName, item.lastName].join(" ");
}

const numbers = [4, 9, 16, 25];
const newArr = numbers.map(myFunction);
console.log(newArr);
function myFunction(num) {
  return num * 10;
}

//The filter() method creates a new array filled with elements that pass a test provided by a function.
//The filter() method does not change the original array.

const ages = [23, 24, 27, 18, 15];
res = ages.filter(checkAdult);
function checkAdult(age) {
  return age >= 18;
}

// The join() method returns an array as a string.
// The join() method does not change the original array.

const fruits = ["Banana", "Orange", "Apple", "Mango"];
text = fruits.join();

const fruits1 = ["Banana", "Orange", "Apple", "Mango"];

// Create an Iterable
const list = fruits1.keys();
console.log(list);

//The reduce() method executes a reducer function for array element.
//The reduce() method returns a single value: the function's accumulated result.

const numbers1 = [14, 45, 6, 45];
numbers1.reduce(myfunc);

function myfunc(total, num) {
  return total - num;
}
