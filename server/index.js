const express = require('express');

const app = express();

const server = app.listen(3000, () => console.log(`Server listening on port 3000`));

app.set('view engine', 'pug');
app.set('views', 'views');
app.use('/assets', express.static(`./assets`));

app.get('/', (req, res) => {
    res.render('index', { name:"Dave" });
})