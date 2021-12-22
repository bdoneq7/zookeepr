const path = require('path');
const router = require('express').Router(); // Router allows you to declare routes in any file as long as you use the proper middleware

// Send contents of index file to client browser / is the root route of the server
router.get('/', (req, res) => { // root folder endpoint
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// Send contents of animals html file to client browser
router.get('/animals', (req, res) => { // animals folder endpoint
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
});

// Send contents of zookeepers html file to client browser
router.get('/zookeeper', (req, res) => { // zookeepers folder endpoint
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

// Wildcard Route for routes that don't exist - send index content
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

module.exports = router;
