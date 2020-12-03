function func() {}
setTimeout(function() {
    func()
    setTimeout(func, 500)
}, 500)