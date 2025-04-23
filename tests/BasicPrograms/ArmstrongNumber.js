function armStrongNumber() {
  var num = 154;
  var originalNum = num;
  var sum = 0;

  while (num > 0) {
    var rem = num % 10;
    sum = sum + rem * rem * rem;
    num = Math.floor(num / 10);
  }

  if (originalNum == sum) {
    console.log("It is an armstrong number.");
  } else {
    console.log("It is not an armstrong number.");
  }
}

armStrongNumber();
