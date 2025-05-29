// function duplicateCharcters(str) {
//   let freq = new Array(26).fill(0);

//   for (let ch of str) {
//     if (ch >= "a" && ch <= "z") {
//       freq[ch.charCodeAt(0) - "a".charCodeAt(0)]++;
//     }
//   }

//   for (let i = 0; i < freq.length; i++) {
//     if (freq[i] > 1) {
//       console.log(String.fromCharCode(i + "a".charCodeAt(0)) + " = " + freq[i]);
//     }
//   }
// }

// duplicateCharcters("basavarajb");

function charCount(str) {
  const charCount = new Map();

  for (const char of str) {
    charCount.set(char, (charCount.get(char) || 0) + 1);
  }

  for (const [char, count] of charCount) {
    if (count > 1) {
      console.log(` ${char}: ${count}`);
    }
  }
}

charCount("Basavaraj");
