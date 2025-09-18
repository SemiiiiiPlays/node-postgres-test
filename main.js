const {Client} = require("pg")
const express = require("express")
const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")));

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "Haveyouevertriedthis1?",
    database: "demopost"
})

client.connect().then(()=>console.log("Connected!"))

app.post('/postData', (req, res)=> {
    const {name, id} = req.body
    const insert_query = "INSERT INTO demotable (name, id) VALUES ($1, $2)"
    client.query(insert_query, [name, id], (err, result)=> {
        if(!err)
        {
            console.log(result)
            res.send("POSTED DATA")
        }
        else
        {
            res.send(err.message)
        }
    })
})

app.post('/postList', async(req, res)=> {
    const dataList = req.body

    try{
        for(const item of dataList)
        {
            const {name, id} = item
            await client.query("INSERT INTO demotable (name, id) VALUES ($1, $2)", [name, id])
        }
        res.send("POSTED DATA")
    }catch(err){
        res.send(err.message)
    }
})

app.get('/fetchData', (req, res)=>{
    const fetch_query = "Select * from demotable"
    client.query(fetch_query, (err, result)=>{
        if(!err){
            res.send(result.rows)
        }else{
            res.send(err.message)
        }
    })
})

app.get('/fetchByID/:id', (req, res)=>{
    const id = req.params.id;
    const fetchID_query = "Select * from demotable where id = $1"

    client.query(fetchID_query, [id], (err, result)=>{
        if(!err){
            res.send(result.rows)
        }else{
            res.send(err.message)
        }
    })
})

app.put('/update/:id', (req, res)=>{
    const id = req.params.id;
    const name = req.body.name;
    const address = req.body.address;
    const update_query = "UPDATE demotable SET name = $1 WHERE id = $2 "
    
    client.query(update_query, [name, id], (err, result)=>{
        if(!err){
            res.send("UPDATED")
        }else{
            res.send(err.message)
        }
    })
})

app.delete('/delete/:id', (req, res)=>{
    const id = req.params.id;
    const delete_query = "Delete from demotable WHERE id = $1"

    client.query(delete_query, [id], (err, result)=>{
        if(!err){
            res.send(result)
        }else{
            res.send(err)
        }
    })
})

app.get('/minmax', (req, res)=>{
    const minmax_query= "SELECT MIN(id) AS min_value, MAX(id) AS max_value FROM demotable"

    client.query(minmax_query, (err, result)=>{
        if(!err){
            console.log(result.rows[0])
            const {min_value, max_value}=result.rows[0]
            res.send({"min": min_value, "max": max_value})
        }else{
            res.send(err)
        }
    })
})

app.listen(3000, ()=>{
    console.log('Server is running...')
})