function threeLargestNumbers() {
  const arr = [141, 1, 17, -7, -17, -27, 18, 541, 8, 7, 7];
  let first = -Infinity;
  let second = -Infinity;
  let third = -Infinity;

  for (let i = 0; i < arr.length; i++) {
    let current = arr[i];
    if (current > first) {
      third = second;
      second = first;
      first = arr[i];
    } else if (current > second) {
      third = second;
      second = arr[i];
    } else if (current > third) {
      third = arr[i];
    }
  }
  return [first, second, third];
}

console.log(threeLargestNumbers());
