/*Closure is the combination of a func bundled together 
with reference to it's sotrrouding

in other words closure gives you access to an outer functions scope from an inner scope
*/

function human(name) {
  function sayHi() {
    console.log(`hi  ${name}`);
  }

  function sayHowdoYouFeel() {
    console.log(`I am fine ${name}`);
  }

  return {
    sayHi,
    sayHowdoYouFeel,
  };
}

const person = human("Basava");
person.sayHi();
person.sayHowdoYouFeel();
