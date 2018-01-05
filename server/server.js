const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser')
const morgan = require('morgan');
const moment = require('moment');

var env = process.env.NODE_ENV || 'development';

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var mainRoutes = require('./routes/mainRoutes');

var app = express();
var server = http.createServer(app);

// app.use(express.static(publicPath));

app.set('views', path.join(__dirname, '/../views'));
// view engine setup
app.set('view engine', 'ejs');
// app.use(compression());
app.use(morgan('dev'));
app.use('/intern/css', express.static(path.join(__dirname, '..', 'public', 'css')));
app.use('/intern/js', express.static(path.join(__dirname, '..', 'public', 'js')));
app.use('/bootstrap/css', express.static(path.join(__dirname, '..', 'public', 'libs', 'bootstrap', 'css')));
app.use('/bootstrap/js', express.static(path.join(__dirname, '..', 'public', 'libs', 'bootstrap', 'js')));
app.use('/bootstrap/fonts', express.static(path.join(__dirname, '..', 'public', 'libs', 'bootstrap', 'fonts')));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true}));

//debug purposes
app.use((req, res, next) => {
    // console.log("req:", req);
    // console.log("req body:", req.body);
    next();
});

app.use('/', mainRoutes);

// deactivate in development
// Handle 404
if (env !== 'development') {
    app.use(function(req, res) {
        res.status(404).render('500', {
            title: "ERROR",
            page: "error"
        })
    });
    // Handle 500
    app.use(function(error, req, res, next) {
        res.status(500).render('500', {
            title: "ERROR",
            page: "error"
        })
    });
}

server.listen(port, () => {
    console.log(`Server up at ${port}`);
});
