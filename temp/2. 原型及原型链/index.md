## 一、我们为什么要在原型上添加属性或者方法？

在构造函数内通过 this 添加方法的话，每生成一个对象，都会重新开辟一块内存空间。

Player.prototype.xxx = xxxxx;
Player.prototype.xxx = xxxxx;
Player.prototype.xxx = xxxxx;
Player.prototype.xxx = xxxxx;

Player.prototype = {
eat: function(){},
run: xxxxxx
};

## 二、怎么找到一个构造函数的原型对象？

```javascript
function Player() {
  this.color = "red";
}

Player.prototype.start = function () {
  console.log(111111);
};

const p1 = new Player();
const p2 = new Player();

console.log(p1.__proto__);
console.log(Object.getPrototypeOf(p1));

console.log(Player.prototype);
```

## 三、new 关键字做了什么？

1. 一个继承自 Player 的新对象 p1 被创建了。
2. p1.**proto** = Player.prototype，p1 的**proto**指向 Player 的原型对象
3. 将 this 指向新创建的对象 p1
4. 返回这个新对象 p1
   4.1 未显式 return, 返回新对象 p1
   4.2 显式 return this, 返回新对象 p1
   4.3 显示 return 基本类型, 返回新对象 p1

   4.4 显示 return 对象类型（比如一个空对象）, 返回一个空对象。

## 四、原型链到底是什么？

p1**proto** === Player.prototype
