const m = require('./module');

console.log(m.name);

setTimeout(() => {
    console.log(m.name);
}, 2000)