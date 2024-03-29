const express = require('express');
const logger = require('morgan');
const env = require('./configs/environment');
const app = express();

const port = 8800;
const cookieParser = require('cookie-parser');

const expressLayouts = require('express-ejs-layouts');
const db = require('./configs/mongoose');

//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./configs/passport-local-strategy');
const passportJWT = require('./configs/passport-jwt-strategy');
const passportGoogle = require('./configs/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
//const bodyParser = require('body-parser');
const flash = require('connect-flash');
const customMware = require('./configs/middleware');

//setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./configs/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');
const path = require('path');

if(env.name == 'development')
{
    app.use(sassMiddleware({
        src: path.join(__dirname,process.env.BUZZ_ASSET_PATH,'scss'),
        dest: path.join(__dirname,process.env.BUZZ_ASSET_PATH,'css'),
        debug: true,
     //   indentedSyntax: false,
        outputStyle: 'compressed',
        prefix: '/css'
    
    }));
}


app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static(process.env.BUZZ_ASSET_PATH));
//make the uploads path available to the browser
app.use('/uploads',express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options));

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
    secret: process.env.BUZZ_SESSION_COOKIE_KEY,
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