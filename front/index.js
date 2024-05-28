const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;

app.use(express.static('views'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/")));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));