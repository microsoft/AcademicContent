// // Numbers
// typeof 37 === 'number';
// typeof 3.14 === 'number';
// typeof Math.LN2 === 'number';
// typeof Infinity === 'number';
// typeof NaN === 'number'; // Despite being "Not-A-Number"
// typeof Number(1) === 'number'; // but never use this form!

// // Strings
// typeof "" === 'string';
// typeof "bla" === 'string';
// typeof (typeof 1) === 'string'; // typeof always return a string
// typeof String("abc") === 'string'; // but never use this form!

// // Booleans
// typeof true === 'boolean';
// typeof false === 'boolean';
// typeof Boolean(true) === 'boolean'; // but never use this form!

// // Symbols
// typeof Symbol() === 'symbol'
// typeof Symbol('foo') === 'symbol'
// typeof Symbol.iterator === 'symbol'

// // Undefined
// typeof undefined === 'undefined';
// typeof blabla === 'undefined'; // an undefined variable

// // Objects
// typeof {a:1} === 'object';

// // use Array.isArray or Object.prototype.toString.call
// // to differentiate regular objects from arrays
// typeof [1, 2, 4] === 'object';

// typeof new Date() === 'object';

// // The following is confusing. Don't use!
// typeof new Boolean(true) === 'object';
// typeof new Number(1) === 'object';
// typeof new String("abc") === 'object';

// // Functions
// typeof function(){} === 'function';
// typeof Math.sin === 'function';

console.log("Enter any of the typeof calls of the left hand side here, as the example below shows.");
console.log(typeof Math.sin);
console.log(typeof true);
console.log(typeof "some text here.");
