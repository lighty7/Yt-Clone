const express = require('express')
const app = express();
const port = 3000;

app.get('/',(req,res)=>res.send('hello from Node.js on Ubantu'));
app.listen(port,()  => console.log(`server is running on http://localhost:${port}`));