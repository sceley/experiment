const Router = require('express').Router;
const bodyparser = require('body-parser');

//controllers
const login = require('./controllers/api/log').login;
const logup = require('./controllers/api/log').logup;
const editInfo = require('./controllers/api/user').editInfo;
const showInfo = require('./controllers/api/user').showInfo;
const addExperiment = require('./controllers/api/experiment').addExperiment;

//middleware
const session = require('./middleware/oauth').session;

//powerswitch
const powerSwitch = require('./controllers/api/powerSwitch').powerSwitch;
let router = Router();

router.get('/devices/:id', powerSwitch);
router.get('/api/userinfo', session, showInfo);


router.use(bodyparser.json());
router.post('/api/login', login);
router.post('/api/logup', logup);
router.post('/api/userinfo/edit', session, editInfo);
router.post('/api/addexperiment', addExperiment);

module.exports = router;