function largeAndSmallNum() {
  const arr = [41, 54, 5, 7, 6, 23];
  let largest = arr[0];
  let smallest = arr[0];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < smallest) {
      smallest = arr[i];
    }
    if (arr[i] > largest) {
      largest = arr[i];
    }
  }

  let sum = largest + smallest;
  console.log("Largest number is " + largest);
  console.log("Smallest number is " + smallest);
  console.log("Sum number is " + sum);
}

largeAndSmallNum();
