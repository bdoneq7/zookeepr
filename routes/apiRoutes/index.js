// Using apiRoutes/index.js as a central hub for all routing functions we may want to 
// add to the application as it evolves

const router = require('express').Router(); // Router allows you to declare routes in any file as long as you use the proper middleware
const animalRoutes = require('../apiRoutes/animalRoutes');

router.use(animalRoutes);
router.use(require('./zookeeperRoutes'));

module.exports = router;