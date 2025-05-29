const myMap = new Map();
myMap.set("name", "Alice");
myMap.set("age", 25);
myMap.set(true, "isActive");
console.log(myMap.get("name")); // Alice
console.log(myMap.get(true)); // isActive

console.log(myMap.has("age")); // true

console.log(myMap.size); // 3

myMap.delete("age");

myMap.forEach((value, key) => {
  console.log(`${key} → ${value}`);
});
