## Promise

Promise A+ 规范:

- 拥有then方法的函数或者对象，用来访问当前的值或者拒绝的原因。
- 有三种状态：``pending`` ``fulfilled`` ``rejected``; 且只能从``pending``状态变成``fulfilled``状态或者``rejected``状态，状态之后就不能再次变更了。
- then方法接受两个可选参数：``onFulfilled`` ``onReject``，这两个参数都是函数。
  - onFulfilled 存在且是一个函数: 
    - 当promise执行结束后必须被调用，其第一个参数为promise的value
    - 当promise执行结束前不可以被调用
    - 调用次数不能超过一次
  - onReject 存在且是一个函数时：
    - 当promise拒绝执行后必须被调用，其第一个参数为promise拒因
    - 当promise拒绝执行前不可以被调用
    - 调用次数不能超过一次
- 在执行上下文堆栈中只包含平台代码之前，不得执行``onFulfilled``或``onRejected``: 这个话的意思是``onFullfilled``和``onRejected``是异步调用，因为``onFulfilled``和``onRejected``是通过``then``注册之后才有的，如果是同步执行的话，``onFulfilled``和``onRejected``还没注册就执行显然是不合理的
- ``then``方法必须返回一个``promise``对象：promise2 = promise1.then(onFulfilled, onRejected)
  - 只要``onFulfilled``和``onRejected``有返回值，``promise2``就进入``onFulfilled``
  - 只要``onFulfilled``和``onRejected``抛出错误，``promise2``就进入``onRejected``
  - 如果``onFulfilled``不存在并且``promise1``状态变为已完成，``promise2``必须成功执行，并返回``promise1``相同的值
  - 如果``onRejected``不存在并且``promise1``状态变为已拒绝，``promise2`` 必须执行拒绝回调，并返回相同的拒因

如下这个例子，就反应了上述所有的情况

```js
const promise1 = new Promise((resolve, reject) => {
    reject('promise1');
});
promise1
    .then(null, (val) => {
    	return val;
	})
    .then(null, null)
	.then((val) => {
    	console.log('promise已完成:' + val);
	}, (err) => {
    	console.log('promise已拒绝:' + err);
	})

// 最终的输出结果为：
// promise已完成: promise
```

Promise解决过程:

如下代码所示：

```js
const promise1 = new Promise((resovle) => {
    resolve(x);
})
```

- x为promise，则promise1的状态是根据x的状态来的，x为``pending``则promise1的状态也为``pending``，如果x为``onfulfilled``则promise1的状态也为``onfulfilled``，如果x为``onRejected``则promise1的状态也为``onRejected``
- x是拥有``then``属性的对象或者函数：
  - 首先尝试读取``then``属性值，如果报错，则promise1变为拒绝态，拒因就是报错的原因
  - 如果``then``是函数，那么会将x作为函数this，并传递两个回调函数``onFulfilled``和``onRejected``
    - 如果``onFulfilled``以y值被调用，则promise的状态变为``fulfilled``，且值也为y
    - 如果``onRejected``以y为拒因被调用，则promise的状态变为``rejected``, 且拒因也为y
- x是正常值，则promise则以x作为值执行``onFulfilled``