function factorials(num) {
  let fact = 1;
  for (let i = 1; i <= num; i++) {
    fact *= i;
  }
  console.log(fact);
}
factorials(5);
