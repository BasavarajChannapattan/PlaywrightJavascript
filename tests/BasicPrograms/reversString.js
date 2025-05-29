function reversString(str) {
  let rev = "";

  for (let i = str.length - 1; i >= 0; i--) {
    rev = rev + str.charAt(i);
  }

  return rev;
}

console.log(reversString("Basava"));
