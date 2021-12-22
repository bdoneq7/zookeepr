// Include Express Module
const express = require('express');

const PORT = process.env.PORT || 3001;
// Instantiate the Server 
const app = express();  // Later chain on methods to the Express.js Server

// The require() statements will read the index.js files in each of the directories indicated
// This mechanism works the same way as directory navigation does in a website
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

// These 2 are required to accept POST data
// parse incoming string or array data
app.use(express.urlencoded({ extended: true })); // takes incoming POST data and converts it to key/value pairings that can be accessed in the req.body object. Extended = may be sub-array data nested, so look deep into data

// parse incoming JSON data
app.use(express.json()); 

// Middleware that instructs the server to make static files available in the public folder
app.use(express.static('public')); // public folder is where files are stored

// Use apiRoutes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// Chain the Listen Method onto the Server to make Server Listen
app.listen(PORT, () => { // Determine localhost Port 
    console.log(`API server now on port ${PORT}!`);
});