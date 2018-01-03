process.env.NODE_ENV = process.env.NODE_ENV || 'development';

let express = require('./config/express_config'),
    mongoose = require('./config/mongoose'),
    passport = require('./config/passport');

monkgoose();
let app = express();
let passport = passport();
app.listen(3000);
module.exports = app;

console.log('Server running at localhost');
