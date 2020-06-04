const express = require('express')
const app = express()

//Explore the Blockchain
app.get('/blockchain', (req,res) => {
    
})

//Create wallet and transaction
app.get('/wallet', (req, res) => {
    
})

app.post('/transaction', (req, res) => {
    
})


app.get('/mine', (req, res) => {
    
})

app.listen('3000', () => {
    console.log('Listening on port 3000')
})



// What are the user functions on the blockchain API. 
// 1. Get particular transaction/Get the entire blockchain
// 2. Get particular block
// 3. Post transaction
// 4. Mine a block to the blockchain