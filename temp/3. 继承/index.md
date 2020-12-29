## 一、原型链继承

### 实现

```javascript
function Parent() {
  this.name = "ParentName";
  this.actions = ["sing", "jump", "rap"];
}

function Child() {}

Child.prototype = new Parent();
Child.prototype.constructor = Child;

const c1 = new Child();
```

### 缺点

1. 父类如果存在引用类型，其中一个实例如果改变了此变量，那么所有的实例都会共享。
2. 无法传参给 Parent

## 二、构造函数继承

### 实现

```javascript
function Parent(name, color) {
  this.name = name;
  this.color = color;
  this.actions = ["sing", "jump", "rap"];
}

function Child() {
  Parent.apply(this, arguments);
  //   this.name = name;
  //   this.color = color;
  //   this.actions = ["sing", "jump", "rap"];
}

const c1 = new Child("c1", "red");
const c2 = new Child("c2", "white");
```

### 缺点

1. 浪费内存

## 三、组合继承

### 实现

```javascript
// 原型链继承 + 构造函数继承
// 1. 引用类型被改变，所有实例共享
// 2. 无法传参
// 3. 多占用了内存空间

function Parent(name, actions) {
  this.name = name;
  this.actions = actions;
}

Parent.prototype.getName = function () {
  console.log(this.name + "调用了getName");
};

function Child() {
  Parent.apply(this, arguments);
}

Child.prototype = new Parent(); // constructor被覆盖
Child.prototype.constructor = Child;

const c1 = new Child("c1", ["eat"]);
const c2 = new Child("c2", ["run"]);

console.log(c1.getName === c2.getName);
```

### 缺点

1. 调用了两次构造函数，生成了多余的属性

## 四、寄生组合式继承

### 实现

```javascript
// 原型链继承 + 构造函数继承
// 1. 引用类型被改变，所有实例共享
// 2. 无法传参
// 3. 多占用了内存空间

function Parent(name, actions) {
  this.name = name;
  this.actions = actions;
}

Parent.prototype.getName = function () {
  console.log(this.name + "调用了getName");
};

function Child() {
  Parent.apply(this, arguments);
}

Child.prototype = Object.create(Parent.prototype);
// let TempFunction = function () {};
// TempFunction.prototype = Parent.prototype;
// Child.prototype = new TempFunction();

Child.prototype.constructor = Child;

const c1 = new Child("c1", ["eat"]);
const c2 = new Child("c2", ["run"]);
```

5. class

```javascript
```
