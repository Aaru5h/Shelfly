const express = require('express')

const app = express()

const port = 5000

app.use(express.json())

app.get('/',(req,res)=>{
    res.send('Server Is On Now')
})

app.listen(port,(err)=>{
    if(!err){
        console.log(`Server running on port ${port}`)
    }
})