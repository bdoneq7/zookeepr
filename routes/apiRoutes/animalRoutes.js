const router = require('express').Router(); // Router allows you to declare routes in any file as long as you use the proper middleware
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');

// Add Single API Endpoint Route that Listens for Front End GET requests for animals
// get method requires 2 arguments 
// 1st argument is the string that describes the route the client will have to fetch from
// 2nd argument is a callback function that will execute every time that route is
// accessed with a GET request
router.get('/animals', (req, res) => { // req (request)
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results); // json method from res (response) parameter to send animal json api to our client
}); // Navigate to https://powerful-wildwood-91211.herokuapp.com/api/animals to view json in browser


// Mulitple API Endpoint Route Function that Listens for Front End GET requests for specific animal ID
router.get('/animals/:id', (req, res) => { 
    const result = findById(req.params.id, animals); // Single Parameter
    if (result) {
        res.json(result); // send result to client in json format
    } else {
        res.sendStatus(404);
    }
}); // Navigate to https://powerful-wildwood-91211.herokuapp.com/api/animals/1 to view json in browser


// API Endpoint Route that Listens for POST Requests from Client
// Server will require the user to be authenticated to make a POST Request as an access token
// Data must be validated first before POSTing data to server
router.post('/animals', (req, res) => { 
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

module.exports = router;