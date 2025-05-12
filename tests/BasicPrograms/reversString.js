function reversString(name) {
  let reverse = "";

  for (let i = name.length - 1; i >= 0; i--) {
    reverse += name.charAt(i);
  }
  console.log(reverse);
}

reversString("Basava");
reversString("Basava Sharanappa Kallur");
