//pyramid

let n = 5;
for (let i = 1; i < n; i++) {
  let row = "";
  for (let k = 1; k < n - i; k++) {
    row += " ";
  }

  for (let j = 1; j <= 2 * i - 1; j++) {
    row += "*";
  }
  console.log(row);
}

//left Traiangle pattern

for (let i = 1; i <= n; i++) {
  let row = "";
  for (let j = 1; j <= i; j++) {
    row += "*";
  }
  console.log(row);
}

//left decrease Traingle Pattern

for (let i = n; i >= 1; i--) {
  let row = "";
  for (let j = 1; j <= i; j++) {
    row += "*";
  }
  console.log(row);
}

//right increse triangle

for (let i = 1; i <= n; i++) {
  let row = "";
  for (let k = 1; k <= n - i; k++) {
    row += " ";
  }
  for (let j = 1; j <= i; j++) {
    row += "*";
  }
  console.log(row);
}

//right decrease triangle
for (let i = n; i > 1; i--) {
  let row = "";
  for (let k = 1; k <= n - i; k++) {
    row += " ";
  }

  for (let j = 1; j <= i; j++) {
    row += "*";
  }
  console.log(row);
}
