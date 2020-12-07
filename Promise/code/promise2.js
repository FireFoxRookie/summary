/**
 * @description: promise 的巩固复写
 * @author: xiawx
 * @createTime: 2020/12/3
 */

 class Promise {
    /**
     * 构造函数
     * @param {function} handler 实例化promise时的回调函数
     * @return {void}
     */
    constructor(handler) {
        // resolve之后执行的函数列表
        this.resolveList = [];
        // rejcted之后执行的函数列表
        this.rejectedList = [];
        // 当前promise的状态信息，有三种状态:
        // pending: 等待状态
        // fulfilled: 完成状态
        // rejected: 拒绝状态
        this.state = 'pending';

        // 实例化promise的时候，首先会执行传入的回调函数handler
        // 回调函数handler，有两个参数resolve和reject
        // 执行resolve时会把promise状态变成fulfilled
        // 执行reject时会把promise状态变成rejected
        // 这里使用bind来绑定this是因为在实际执行onfulfilledHandler或onRejectedHandler时
        // 如果不绑定this，this就指向window了，
        handler(this.onFulfilledHandler.bind(this), this.onRejectedHandler.bind(this));

        // 接收resolve或reject时传入的值
        this.value = null;
    }

    /**
     * 实例化resolve的函数
     * @param {any} value 传入的参数
     * @return {void}
     */
    onFulfilledHandler(value) {
        // 由于resovle是异步的
        // 所以这边用setTimeout来模拟
        setTimeout(() => {
            // 根据规范：如果value为promise实例的话，值执行函数根据value这个promise来定
            if (value instanceof Promise) {
                value(this.onTriggerfulfilledHandler.bind(this), this.onTriggerRejectedHandler.bind(this));
            } else {
                this.onTriggerfulfilledHandler(value);
            }
        })
    }

    /**
     * 执行完成态的回调
     * @param {any} val 外部传入的参数
     * @return {void}
     */
    onTriggerfulfilledHandler(value) {
        // 第一步：循环执行resolveList回调列表
        this.resolveList.forEach((item) => {
            item(value);
        })
        // 第二步：将外部传入的值赋值给value
        this.value = value;
        // 第三步：改变state的状态为fulfilled完成态
        this.state = 'fulfilled';
        // 第四步：重置回调列表
        this.resolveList = [];
    }

    /**
     * 实例化reject的函数
     * @param {any} error 拒绝的原因
     * @return {void}
     */
    onRejectedHandler(error) {
        setTimeout(() => {
            // 根据规范：如果value为promise实例的话，值执行函数根据value这个promise来定
            if (error instanceof Promise) {
                error(this.onTriggerfulfilledHandler.bind(this), this.onTriggerRejectedHandler.bind(this));
            } else {
                this.onTriggerRejectedHandler(error);
            }
        })
    }

    /**
     * 执行拒绝态的回调
     * @param {any} val 外部传入的参数
     * @return {void}
     */
    onTriggerRejectedHandler(err) {
        // 第一步：循环执行rejectList回调列表
        this.rejectList.forEach((item) => {
            item(value);
        })
        // 第二步：将外部传入的值赋值给value
        this.value = err;
        // 第三步：改变state的状态为fulfilled完成态
        this.state = 'rejected';
        // 第四步：重置回调列表
        this.rejectList = [];
    }

    /**** 原型上的方法 ****/

    /**
     * 注册fulfilled和rejected函数
     * @param {function} fulfilledHandler resolve之后执行的函数 
     * @param {function} rejectedHandler reject之后执行的函数
     * @return {promise} 返回一个新的promsie实例
     */
    then(fulfilledHandler, rejectedHandler) {
        // 将value和state解构出来，后面会使用到
        const {value, state} = this;
        // 返回一个新的promise实例
        return new Promise((nextFulfilled, nextRejected) => {

            /**
             * 联系fulfilledHandler和nextFulfilled
             * @param {any} val 执行resolve是传入的函数
             * @return {void}
             */
            function triggerFulfilled(val) {
                // 根据规范，如果fulfilledHandler不为函数的话，则状态直接过度到下一个promise
                if (typeof fulfilledHandler !== 'function') {
                    nextFulfilled(val);
                } else {
                    // 执行fulfilledHandler方法
                    const res = fulfilledHandler(val);
                    // 根据Promsie A+规范
                    // 如果res是promise实例的话，那么返回的promise状态就和res的状态保持一致
                    if (res instanceof Promise) {
                        res(nextFulfilled, nextRejected);
                    } else {
                        nextFulfilled(res);
                    }
                }
            }

            /**
             * 联系下一个promise
             * @param {any} err 拒因
             * @return {void}
             */
            function triggerRejected(err) {
                // 根据规范，如果rejectedHandler不为函数的话，则状态直接过度到下一个promsie
                if (typeof rejectedHandler !== 'function') {
                    nextRejected(err);
                } else {
                    // 执行rejectHandler函数
                    const res = rejectedHandler(err);
                    if (res instanceof Promise) {
                        res(nextFulfilled, nextRejected);
                    } else {
                        nextFulfilled(res);
                    }
                }
            }

            // 判断当前的状态，根据不同的状态执行不同的逻辑
            switch(state) {
                // 等待状态
                case 'pending': 
                    // 将传入函数放入对应的列表中
                    // 这里本应该直接push fulfilledHandler和rejectedHandler
                    // 但是根据promise A+规范：
                    // 返回的promise状态是根据fulfilledHandler和rejectedHandler的参数以及执行结果而定的
                    // 所以不能直接push，需要编写函数把这两者联系起来
                    this.resolveList.push(triggerFulfilled);
                    this.rejectedList.push(triggerRejected);
                    break;
                // 完成态
                case 'fulfilled':
                    triggerFulfilled(value);
                    break;
                // 拒绝态
                case 'rejected':
                    triggerRejected(value);
                    break;
            }
        })
    }

    /**
     * 捕捉错误信息
     * @param {function} errCallback 捕捉到错误之后的回调
     * @return {promise} 返回一个新的promise实例
     */
    catch(errCallback) {
        return this.then(null, errCallback);
    }

    /**** 静态方法 ****/

    /**
     * 将promsie的状态变成完成态
     * @param {any} param 待改变状态的值
     * @return {promise} 返回一个新的promise 
     */
    static resovle(param) {
        if (param instanceof Promise) return param;
        return new Promise(resolve => resolve(param));
    }

    /**
     * 将promsie的状态变成拒绝态
     * @param {any} param 待改变状态的值
     * @return {promise} 返回一个新的promise 
     */
    static reject(param) {
        if (param instanceof Promise) return param;
        return new Promise((resolve, reject) => reject(param));
    }
    
    /**
     * 等待所有promise都完成之后，才变成完成态
     * @param {array} arr 待变化的promise实例
     * @return {promise} promise实例 
     */
    static all(arr) {
        return new Promise((resolve, reject) => {
            // 直接结果值集合
            const vals = [];
            // 计数器
            let count = 0;
            arr.forEach((item, index) => {
                Promise.resolve(item).then((val) => {
                    vals[index] = val;
                    count++;
                    if (count === arr.length) {
                        resolve(vals);
                    }
                }, (err) => {
                    reject(err);
                })
            })
        })
    }

    /**
     * 相对all，只要有一个状态变化了，就变成完成态
     * @param {array} arr 待变化的promise实例
     * @return {promise} promise实例
     */
    static race(arr) {
        return new Promise((resolve, reject) => {
            arr.forEach(item => {
                Promise.resolve(item).then((val) => {
                    resolve(val);
                }, (err) => {
                    reject(err);
                })
            })
        })
    }
 }