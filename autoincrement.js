const {Client} = require("pg")
const express = require("express")
const app = express()
app.use(express.json())

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "Haveyouevertriedthis1?",
    database: "autoIncrementTest"
})

client.connect().then(()=>console.log("Connected!"))

app.post('/postauto', (req, res)=>{
    const {name, user_order}=req.body
    const insert_query= "INSERT INTO users (name, user_order) VALUES ($1, $2)"
    client.query(insert_query, [name, user_order], (err, result)=>{
        if (!err){
            res.send("POSTED DATA")
            console.log(result)
        }else{
            res.send(err)
        }
    })
})

app.listen(3000, ()=>{
    console.log('Server is running...')
})