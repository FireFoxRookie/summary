module.exports = function(babel) {
    let count = 0;
    return {
        visitor: {
            CallExpression(path) {
                count++;
                console.log('count:', count);
                console.log(path.node);
            }
        }
    }
}