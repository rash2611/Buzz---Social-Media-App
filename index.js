const express = require('express');

const app = express();

const port = 8800;
const cookieParser = require('cookie-parser');

const expressLayouts = require('express-ejs-layouts');
const db = require('./configs/mongoose');

//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./configs/passport-local-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
//const bodyParser = require('body-parser');
const flash = require('connect-flash');
const customMware = require('./configs/middleware');

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
 //   indentedSyntax: false,
    outputStyle: 'extended',
    prefix: '/css'

}));

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static('./assets'));

app.use(expressLayouts);
// app.use(bodyParser.json());
// app.use(express.json());
//extract styles and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//set up the view engine
app.set('view engine', 'ejs');
app.set('views','./views');

//mongo store is used to store the session cookie in the db
app.use(session({
    name: 'buzz',
    //TODO change the secret before deployment in production mode
    secret: 'something',
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge: (1000*60*100)
    },
    store: MongoStore.create(
        { 
            mongoUrl: 'mongodb://127.0.0.1/buzz_development',
         //   mongooseConnection: db,
            autoRemove: 'disabled'
        },
        function(err)
        {
            console.log(err || 'connect-mongodb setup ok');
        }
        
    )

}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);
//use express router
app.use('/',require('./routes'));

app.listen(port,function(err)
{
    if(err)
    {
        console.log(`Error in running the server : ${err}`);
    }
    console.log(`Server is running on port : ${port}`);
});