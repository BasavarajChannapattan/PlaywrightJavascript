var array = [1, 2, 3];
array.pop();
array.length;
array.push(1);
array.length;
var arr = ["A", "B", "c"];
console.log(arr);
function printLength(id) {
    if (typeof id === "string") {
        console.log("your string value is ".concat(id));
    }
    else {
        console.log("your num value is ".concat(id));
    }
}
printLength(12);
printLength("454321");
var getDobByAge = function (age) {
    var now = new Date();
    // Will need to remove -1
    return new Date(now.getFullYear() - age.year, now.getUTCMonth() - age.month - 1);
};
getDobByAge({ year: 24, month: 2 });
