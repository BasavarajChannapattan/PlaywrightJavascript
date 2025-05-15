let array: Array<number> = [1, 2, 3];
array.pop();
array.length;
array.push(1);
array.length;

let arr: string[] = ["A", "B", "c"];
console.log(arr);

function printLength(id: string | number): void {
  if (typeof id === "string") {
    console.log(`your string value is ${id}`);
  } else {
    console.log(`your num value is ${id}`);
  }
}

printLength(12);
printLength("454321");

const getDobByAge = (age: { year: number; month: number }) => {
  const now = new Date();
  // Will need to remove -1
  return new Date(
    now.getFullYear() - age.year,
    now.getUTCMonth() - age.month - 1
  );
};

console.log(getDobByAge({ year: 24, month: 2 }));
