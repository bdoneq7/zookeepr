// Include Express Module
const express = require('express');
const fs = require('fs');
const path = require('path'); // provides utilities for working with file and directory paths


const PORT = process.env.PORT || 3001;

// Instantiate the Server 
const app = express();  // Later chain on methods to the Express.js Server

// These 2 are required to accept POST data
// parse incoming string or array data
app.use(express.urlencoded({ extended: true })); // takes incoming POST data and converts it to key/value pairings that can be accessed in the req.body object. Extended = may be sub-array data nested, so look deep into data
// parse incoming JSON data
app.use(express.json()); 

const {animals} = require('./data/animals');

// This function will take in req.query as an argument and filter through
// animals accordingly, returning the new filtered array
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // We save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        // Save personalityTraits as a dedicated array
        // If personalityTraits is a string, place it into a new array and save
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // Loop through each trait in the personalityTraits array"
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.
            // Remember, it is initially a copy of the animalsArray,
            // but here we're updating it for each trait in the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait,
            // so at the end we'll have an array of animals that have every one 
            // of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }

    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

// findById Function
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}


// Add Single API Endpoint Route that Listens for Front End GET requests for animals
// get method requires 2 arguments 
// 1st argument is the string that describes the route the client will have to fetch from
// 2nd argument is a callback function that will execute every time that route is
// accessed with a GET request
app.get('/api/animals', (req, res) => { // req (request)
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results); // json method from res (response) parameter to send animal json api to our client
}); // Navigate to https://powerful-wildwood-91211.herokuapp.com/api/animals to view json in browser

// Mulitple API Endpoint Route Function that Listens for Front End GET requests for specific animal ID
app.get('/api/animals/:id', (req, res) => { 
    const result = findById(req.params.id, animals); // Single Parameter
    if (result) {
        res.json(result); // send result to client in json format
    } else {
        res.sendStatus(404);
    }
}); // Navigate to https://powerful-wildwood-91211.herokuapp.com/api/animals/1 to view json in browser

// Function to accept the POST route's req.body value and the array we want to add the data to
function createNewAnimal (body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'), // update json file with POST data
        JSON.stringify({ animals: animalsArray }, null, 2) // convert data to json and format data
        // null means we don't wantto edit any of our existing data
        // 2 indicates creating white space between value to make it readable
    );

    // return finished code to post route for response
    return animal;
}

// API Endpoint Route that Listens for POST Requests from Client
// Server will require the user to be authenticated to make a POST Request as an access token
// Data must be validated first before POSTing data to server
app.post('/api/animals', (req, res) => { 
    // set id based on what the next index of the array will be - id's must be unique
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrect, send 400 error back to client
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.'); // 400 is a user error
    } else {
        // add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);

        // req.body is where our incoming content will be
        res.json(animal); // send data back to client
    }
});


// Validate Data Function
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}


// Chain the Listen Method onto the Server to make Server Listen
app.listen(PORT, () => { // Determine localhost Port 
    console.log(`API server now on port ${PORT}!`);
});