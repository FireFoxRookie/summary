const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())

app.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname, './index.html'))
})

app.post('/api/info', function(req, res) {
    console.log(req.body, typeof req.body)
    res.json({
        data: req.body
    })
})

app.listen(8080)