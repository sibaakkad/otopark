//Install express server
const express = require('express');
const path = require('path');

const app = express();


app.use(express.static('./dist/otopark'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: './dist/otopark'}),

);

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
console.log("it is working now ");