function duplicateWords() {
  /*
    Method duplicateWords:
    1. Define a sentence
    2. Convert it to lowercase
    3. Split into words by space
    4. Count word occurrences using a Map
    5. Print words that appear more than once
    */

  const sentence = "Basa is going to park basa going to play cricket";
  const lowerSentence = sentence.toLowerCase();
  const words = lowerSentence.split(" ");

  const wordCount = new Map();
  for (const word of words) {
    if (wordCount.has(word)) {
      wordCount.set(word, wordCount.get(word) + 1);
    } else {
      wordCount.set(word, 1);
    }
  }

  for (const word of wordCount.keys()) {
    if (wordCount.get(word) > 1) {
      console.log(`${word} : ${wordCount.get(word)}`);
    }
  }
}

// Run the function
duplicateWords();

function duplicateWords1() {
  const name = "google";
  const wordCount = new Map();
  for (const n of name) {
    if (wordCount.has(n)) {
      wordCount.set(n, wordCount.get(n) + 1);
    } else {
      wordCount.set(n, 1);
    }
  }

  for (const word of wordCount.keys()) {
    console.log(`${word} : ${wordCount.get(word)}`);
  }
}

duplicateWords1();
