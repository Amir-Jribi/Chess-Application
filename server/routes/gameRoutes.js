const express = require('express');
const gameController = require('../controllers/gameController');

const router = express.Router();

router.post('/',gameController.createGame);
router.get('/',gameController.getGames);
// router.get('/games/:id',gameController.getGame);
router.get('/:id',gameController.getNumberOfGames);
module.exports = router;
