const { App } = require('./src');
const path = require('path');

const app = new App();
const models = require('./src/db/models');

app.version(path.resolve(__dirname, 'package.json'));

app.get('/', (req, res) => {
    res.send('Teste: ' + process.env.TESTE);
});

app.listen(8080);