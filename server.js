const { App } = require('./src');
const path = require('path');

const app = new App();

app.version(path.resolve(__dirname, 'package.json'));

app.listen(8080);