function sortedArray() {
  let arr1 = [12, 3, 45, 67, 8, 9];
  let arr2 = [4, 5, 6, 4, 54, 2, 3];

  // Sort both arrays first
  ascendingOrder(arr1);
  ascendingOrder(arr2);

  // Then merge and print the merged sorted array
  console.log(mergedArray(arr1, arr2));
}

function ascendingOrder(arr) {
  let n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
}

function mergedArray(arr1, arr2) {
  let i = 0,
    j = 0,
    k = 0;
  let merged = new Array(arr1.length + arr2.length);

  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] < arr2[j]) {
      merged[k++] = arr1[i++];
    } else {
      merged[k++] = arr2[j++];
    }
  }

  while (i < arr1.length) {
    merged[k++] = arr1[i++];
  }

  while (j < arr2.length) {
    merged[k++] = arr2[j++];
  }

  return merged;
}

sortedArray();

function doSomething() {}
