/**
 * @description: generator相关知识点
 * @author: xiawx
 * @createTime 2020/12/3
 */
function dynHandler(name, cb) {
    setTimeout(() => {
        cb && cb(name)
    })
}

 function myPromise(name) {
     return new Promise((resolve, reject) => {
         dynHandler(name, (name) => {
             resolve(name);
         })
     })
 }


function* myGenerator() {
    console.log('开始执行generator');
    const value1 = yield myPromise('buy cai');
    const value2 = yield myPromise('buy mi' + value1);
    const value3 = yield myPromise('buy tiaoliao' + value2);
}

function dgHandler(handler) {
    return Promise.resolve().then(function resolveHandler(val) {
        const next = handler.next(val);
        if (next.done) {
            return val;
        }
        return Promise.resolve(next.value).then(resolveHandler);
    })
}

dgHandler(myGenerator());