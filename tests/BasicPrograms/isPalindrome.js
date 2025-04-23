function isPalindrome(num) {
  let originalNum = num;
  let reversedNum = 0;
  while (num > 0) {
    let rem = num % 10;
    reversedNum = reversedNum * 10 + rem;
    num = Math.floor(num / 10);
  }
  if (originalNum == reversedNum) {
    console.log("It is a palindrome number.");
  } else {
    console.log("It is not a palindrome number.");
  }
}

isPalindrome(121);

function isStringPalindrome(str) {
  let revrese = "";

  for (let i = str.length - 1; i >= 0; i--) {
    revrese += str.charAt(i);
  }

  if (str == revrese) {
    console.log("It is a palindrome string.");
  } else {
    console.log("It is not a palindrome string.");
  }
}

isStringPalindrome("madam");

function isStringPalindrome2(str) {
  let left = 0;
  let right = str.length - 1;
  while (left < right) {
    if (str.charAt(left) != str.charAt(right)) {
      console.log("It is not a palindrome string.");
      return;
    }
    left++;
    right--;
  }
  console.log("It is a palindrome string.:" + str);
}

isStringPalindrome2("madam");
