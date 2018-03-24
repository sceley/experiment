const Router = require('express').Router;
const bodyparser = require('body-parser');

//controllers
const login = require('./controllers/api/log').login;
const logup = require('./controllers/api/log').logup;
const editInfo = require('./controllers/api/user').editInfo;
const showInfo = require('./controllers/api/user').showInfo;
const showUsers = require('./controllers/api/user').showUsers;
const monitorUser = require('./controllers/api/user').monitorUser;
const addExperiment = require('./controllers/api/experiment').addExperiment;
const monitorExperiment = require('./controllers/api/experiment').monitorExperiment;
const monitorExp = require('./controllers/api/experiment').monitorExp;
const showExps = require('./controllers/api/experiment').showExps;
const addReserve = require('./controllers/api/reserve').addReserve;
const showOneReserves = require('./controllers/api/reserve').showOneReserves;
const showReserves = require('./controllers/api/reserve').showReserves;
const monitorReserve = require('./controllers/api/reserve').monitorReserve;
const deleteReserve = require('./controllers/api/reserve').deleteReserve;
const showRestExps = require('./controllers/api/experiment').showRestExps;
const adminLogin = require('./controllers/api/admin').login;
// const monitorUser = require('./controllers/api/admin').monitorUser;
const switchPower = require('./controllers/api/tab').switchPower;
 
//middleware
const user_session = require('./middleware/oauth').user_session;
const admin_session = require('./middleware/oauth').admin_session;

//powerswitch
let router = Router();

//get
router.get('/api/userinfo', user_session, showInfo);
router.get('/api/experiments', monitorExperiment);
router.get('/api/reserves', showReserves);
router.get('/api/onereserves', user_session, showOneReserves);
router.get('/api/admin/monitorexp/:id', monitorExp);
router.get('/api/admin/monitorreserve/:id', admin_session, monitorReserve);
router.get('/api/users', showUsers);
router.get('/api/admin/exps', showExps);

//delete
router.delete('/api/reserve/:id', deleteReserve);
//middleware
router.use(bodyparser.json());
//post
router.post('/api/login', login);
router.post('/api/logup', logup);
router.post('/api/restexps', showRestExps);
router.post('/api/userinfo/edit', user_session, editInfo);
router.post('/api/addreserve', user_session, addReserve);
router.post('/api/admin/login', adminLogin);
router.post('/api/admin/monitoruser', monitorUser);
router.post('/api/admin/addexperiment', admin_session, addExperiment);
router.post('/api/admin/switchpower', admin_session, switchPower);

module.exports = router;