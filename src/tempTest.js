/*
let list=[1,2,3,4,5,6]
let spl = list.splice(list.indexOf(2),1);
console.log(spl);
console.log(list);
*/


const ObjectCache = require("./ObjectCache");

let objCache = new ObjectCache();
objCache.setMaxLimit(5);
objCache.add(0, "aravinth")
objCache.add(1, "jack")
objCache.add(2, "arun")
objCache.add(3, "ram")
objCache.getValueById(2);
console.log("--------------")
objCache.show();
objCache.add(4, "jam");
console.log("--------------")
objCache.show();
objCache.show();
objCache.add(5, "gggg");
console.log("--------------")
objCache.show();