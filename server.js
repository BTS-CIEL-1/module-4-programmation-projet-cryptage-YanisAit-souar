const express = require('express')
const path = require('path');
const app = express()



app.use(express.static('.'));
app.use(express.json())


// Définir la route http://127.0.0.1:3001/ pour index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });


  // Définir la route http://127.0.0.1:3001/todo pour indexTodo.html
app.get('/todo', (req, res) => {
  res.sendFile(path.join(__dirname, 'indexTodo.html'));
});


app.listen(3001)