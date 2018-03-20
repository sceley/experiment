const Router = require('express').Router;
const bodyparser = require('body-parser');

//controllers
const login = require('./controllers/api/log').login;
const logup = require('./controllers/api/log').logup;
const editInfo = require('./controllers/api/user').editInfo;
const showInfo = require('./controllers/api/user').showInfo;
const addExperiment = require('./controllers/api/experiment').addExperiment;
const showExperiment = require('./controllers/api/experiment').showExperiment;
const addReserve = require('./controllers/api/reserve').addReserve;
const showOneReserves = require('./controllers/api/reserve').showOneReserves;
const adminLogin = require('./controllers/api/admin').login;
const monitorExp = require('./controllers/api/admin').monitorExp;
const monitorUser = require('./controllers/api/admin').monitorUser;
 
//middleware
const session = require('./middleware/oauth').session;
const admin_session = require('./middleware/oauth').admin_session;

//powerswitch
const powerSwitch = require('./controllers/api/powerSwitch').powerSwitch;
let router = Router();

router.get('/devices/:id', powerSwitch);
router.get('/api/userinfo', session, showInfo);
router.get('/api/experiments', showExperiment);
// router.get('/api/reserves', show);
router.get('/api/onereserves', session, showOneReserves);
router.get('/api/admin/monitorexp', monitorExp);
router.get('/api/admin/monitoruser', monitorUser);
// router.get('/api/admin/mo');

router.use(bodyparser.json());
router.post('/api/login', login);
router.post('/api/logup', logup);
router.post('/api/userinfo/edit', session, editInfo);
router.post('/api/addreserve', session, addReserve);
router.post('/api/admin/login', adminLogin);
router.post('/api/addexperiment', admin_session, addExperiment);

module.exports = router;