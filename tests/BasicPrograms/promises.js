const promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, "King");
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, "King");
});

Promise.all([promise1, promise2])
  .then((x) => console.log("success"))
  .catch((err) => console.error("error", err));

function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = { id: 1, name: "John Doe" };
      resolve(data);
    }, 1000);
  });
}
fetchData()
  .then((data) => {
    console.log("Data received:", data);
  })
  .catch((err) => {
    console.log("Data Not Found! ", err);
  });

/*
  CallBack -  func Based
  Promise -   Object Based
  Async/Await - Syntax Based
  */
