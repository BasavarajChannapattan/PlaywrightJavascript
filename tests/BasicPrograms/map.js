const fruits = new Map();
fruits.set("apple", 1.5);
fruits.set("banana", 2.5);
fruits.set("orange", 3.5);
fruits.set("papaya", 1.5);

//retrives
fruits.get("banana");

//check if item exist
fruits.has("grapes");
fruits.size;

//delete item
fruits.delete("banana");

//get size of the map
fruits.size;
