var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cors = require('cors');
var app = express();

const typeDefs = require('./GraphQL/Schema');
const resolvers = require('./GraphQL/Resolvers');

const graphqlHTTP = require('express-graphql');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/graphql', graphqlHTTP({
    schema: typeDefs,
    rootValue: resolvers,
    graphiql: true
}));
app.use('/', indexRouter);
app.use('/users', usersRouter);


module.exports = app;
