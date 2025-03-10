const path = require('path');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const express = require('express');
const methodOverride = require('method-override')
const sortMiddleware = require('./app/middlewares/sortMiddleware');

const db = require('./config/db')

// Connect to DB
db.connect()

const app = express();
const port = 3000;

const route = require('./routes');

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware để xử lý dữ liệu form
app.use(express.urlencoded({ extended: true }));

// Middleware để xử lý JSON (không cần thiết cho form HTML nhưng tốt nếu dùng API)
app.use(express.json());

app.use(sortMiddleware)

// HTTP logger
// app.use(morgan("combined"));

// Template engine (handlebars)
app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        helpers: require('./helpers/handlebars')
    }),
);

app.set('view engine', 'hbs');

app.set('views', path.join(__dirname,'resources', 'views'));

app.use(methodOverride('_method'))

app.get('/middleware', 
    //middleware 1
    (req, res, next) => {
        if(['2'].includes(req.query.num)) {
            req.query.tenNum = '20'
                return next()
        } 
        res.json( {messages: "not 2"} );
    }, 
    // middleware 2
    (req, res, next) => {
        res.json( {
            messages: "after 2*10", 
            tenNum: req.query.tenNum
        } );
    })
// Route

route(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
