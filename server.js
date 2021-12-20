// Include Express Module
const express = require('express');

const PORT = process.env.PORT || 3001;

// Instantiate the Server 
const app = express();  // Later chain on methods to the Express.js Server

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


// Add Single Route that the Front End can request data from
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
}); // Navigate to https://powerful-wildwood-91211.herokuapp.com/api/animals in the browser to view

// Mulitple Route Function
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals); // Single Parameter
    if (result) {
        res.json(result); // send result to client in json format
    } else {
        res.sendStatus(404);
    }
});

// Chain the Listen Method onto the Server to make Server Listen
app.listen(PORT, () => { // Determine localhost Port 
    console.log(`API server now on port ${PORT}!`);
});