const Router = require('express').Router;
const bodyparser = require('body-parser');

//controllers

//powerswitch
const powerSwitch = require('./controllers/powerSwitch').powerSwitch;

let router = Router();

router.get('/devices/:id', powerSwitch);
router.get('/api', api);
router.get('/', );
router.use(bodyparser.json());

module.exports = router;