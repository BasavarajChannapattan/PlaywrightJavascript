function randomString(length: number): string {
  const currentDate = new Date();
  currentDate;
  console.log(currentDate);

  const charcters = "hfsjkdfhsjkdvhusfmsasjkajkfhkjfhkjfaskjdfs";
  let res = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charcters.length);
    res += charcters[randomIndex];
  }

  return res;
}

console.log(randomString(10));

function randomNumber(length: number): number {
  const currentDate = new Date();
  currentDate;
  console.log(currentDate);

  let res = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * 10);
    res += randomIndex;
  }

  return parseInt(res);
}

randomNumber(10);
