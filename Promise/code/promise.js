/**
 * @description: 模拟promise的实现
 * @author: xiawx
 * @createTime: 2020/12/1
 */

class Custompromise {
    /**
     * 构造函数
     * @param {function} handler 实例化promise的回调函数
     * @return {void}
     */
    constructor(handler) {
        // resolve的函数集合
        this.resolveList = [];
        // reject的函数集合
        this.rejectList = [];
        // 当前promise的状态
        this.state = 'pending';
        // 当实例化时，会首先执行handler函数
        handler(this.resolveHandler.bind(this), this.rejectHandler.bind(this));
    }

    /**
     * resolve函数
     * @param {any} value 传递进来的参数 
     * @return {void} 
     */
    resolveHandler(value) {
        // 根据规范，resolve是异步执行的
        // 所以这里使用setTimeout代替
        setTimeout(() => {
            // 如果当前的状态不是等待状态，直接返回，不执行
            if (this.state !== 'pending') return;
            // 判断value.then是否是函数
            // 如果是函数，则promise的状态是由then确定的
            if (value !== undefined && typeof value.then === 'function') {
                value.then(value => {
                    this.state = 'fulfilled';
                    this.value = value;
                    this.triggerFulfilled(value);
                }, err => {
                    this.state = 'rejected';
                    this.value = err;
                    this.triggerRejected(err);
                })
            } else {
                this.state = 'fulfilled';
                this.value = value;
                this.triggerFulfilled(value);
            }
        }, 0)
    }

    /**
     * reject函数
     * @param {any} err 传递进来的错误信息 
     * @return {void} 
     */
    rejectHandler(err) {
        // 根据规范，reject是异步执行的
        // 所以这里使用setTimeout代替
        setTimeout(() => {
            // 如果当前的状态不是等待状态，直接返回，不执行
            if (this.state !== 'pending') return;
            // 判断value.then是否是函数
            // 如果是函数，则promise的状态是由then确定的
            if (err !== undefined && typeof err.then === 'function') {
                err.then(value => {
                    this.state = 'fulfilled';
                    this.value = value;
                    this.triggerFulfilled(value);
                }, error => {
                    this.state = 'rejected';
                    this.value = error
                    this.triggerRejected(error);
                })
            } else {
                this.state = 'rejected';
                this.value = err;
                this.triggerRejected(err);
            }
        }, 0)
    }

    /**
     * 循环执行resolve函数
     * @param {*} value 传递的参数值
     * @return {void}
     */
    triggerFulfilled(value) {
        this.resolveList.forEach(item => {
            item(value);
        })
        this.resolveList = [];
    }

    /**
     * 循环执行reject函数
     * @param {*} err 传递的参数值
     * @return {void}
     */
    triggerRejected(err) {
        this.rejectList.forEach(item => {
            item(err);
        });
        this.rejectList = [];
    }

    /**
     * then方法
     * @param {function} resolveHandler resolve的回调
     * @param {function} rejectHandler reject的回调
     * @return {promise} 返回一个新的promise实例
     */
    then(resolveHandler, rejectHandler) {
        return new Custonpromise((nextResolve, nextReject) => {
            function resolveNextHandler(value) {
                if (typeof resolveHandler !== 'function') {
                    nextResolve(value);
                } else {
                    const result = resolveHandler(value);
                    if (result !== undefined && typeof result.then === 'function') {
                        result.then(nextResolve, nextReject);
                    } else {
                        nextResolve(result);
                    }
                }
            }
            function rejectNextHandler(error) {
                if (typeof rejectHandler !== 'function') {
                    nextReject(error);
                } else {
                    const result = rejectHandler(error);
                    if (result !== undefined && typeof result.then === 'function') {
                        result.then(nextResolve, nextReject);
                    } else {
                        nextResolve(result);
                    }
                }
            }
            switch(this.state) {
                case 'pending':
                    this.resolveList.push(resolveNextHandler);
                    this.rejectList.push(rejectNextHandler);
                    break;
                case 'fulfilled':
                    resolveNextHandler(this.value);
                    break;
                case 'rejected':
                    rejectNextHandler(this.value);
                    break;
            }
        })
    }

    /**
     * catch方法
     * @param {function} callback 捕捉到错误的回调
     * @return {promise} 返回一个新的promise实例
     */
    catch(callback) {
        return this.then(null, callback);
    }

    /***** promise的静态方法 *****/
    
    /**
     * resolve方法
     * @param {any} param 需要转化状态的参数
     * @return {promise} 返回转换状态之后的promise实例
     */
    static resolve(param) {
        if (param instanceof Custompromise) return param;
        return new Custompromise(resolve => {
            resolve(param);
        });
    }

    /**
     * all方法，将所有的方法都转换成resolve状态
     * @param {array} arr 待转换的列表
     * @return {promise} 返回转换之后的promise实例
     */
    static all(arr) {
        return new Custompromise((resolve, reject) => {
            let count = 0;
            const valList = [];
            arr.forEach((item, index) => {
                Custompromise.resolve(item).then((val) => {
                    valList[index] = val;
                    count++;
                    if (count === arr.length) {
                        resolve(valList);
                    }
                }).catch(err => {
                    reject(err);
                })
            })
        })
    }

    /**
     * race方法，最先状态改变的resovle
     * @param {array} arr 待转换的列表
     * @return {promise} 返回转换之后的promise实例
     */
    static race(arr) {
        return new Custompromise((resolve, reject) => {
            arr.forEach(item => {
                Custompromise.resolve(item).then(val => {
                    resolve(val);
                }).cathc(err => {
                    reject(err);
                })
            })
        })
    }
}

new Promise((resolve, reject) => {

}).then(resolveHandler => {
    
}, rejectHandler)