const Router = require('express').Router;
const bodyparser = require('body-parser');

//controllers
const login = require('./controllers/api/user').login;
const logup = require('./controllers/api/user').logup;
const editInfo = require('./controllers/api/user').editInfo;
const showInfo = require('./controllers/api/user').showInfo;
const showUsers = require('./controllers/api/user').showUsers;
const monitorUser = require('./controllers/api/user').monitorUser;
const addExperiment = require('./controllers/api/experiment').addExperiment;
const monitorExp = require('./controllers/api/experiment').monitorExp;
const showRestExps = require('./controllers/api/experiment').showRestExps;
const expsCount = require('./controllers/api/experiment').expsCount;
const showExps = require('./controllers/api/experiment').showExps;
const editExp = require('./controllers/api/experiment').editExp;
const addReserve = require('./controllers/api/reserve').addReserve;
const showOneReserves = require('./controllers/api/reserve').showOneReserves;
const showReserves = require('./controllers/api/reserve').showReserves;
const monitorReserve = require('./controllers/api/reserve').monitorReserve;
const deleteReserve = require('./controllers/api/reserve').deleteReserve;
const adminLogin = require('./controllers/api/admin').login;
const notify = require('./controllers/api/notification').notify;
const notifications = require('./controllers/api/notification').notifications;
const deleteNotification = require('./controllers/api/notification').deleteNotification;
const switchPower = require('./controllers/api/tab').switchPower;
 
//middleware
const user_session = require('./middleware/oauth').user_session;
const admin_session = require('./middleware/oauth').admin_session;
const oauthUser = require('./middleware/oauth').oauthUser;

//powerswitch
let router = Router();

//get
router.get('/api/expscount', expsCount);
router.get('/api/notifications', notifications);
router.get('/api/user/onereserves', user_session, showOneReserves);
router.get('/api/user/info', user_session, showInfo);
router.get('/api/admin/users', admin_session, showUsers);
router.get('/api/admin/monitorexp/:id', admin_session, monitorExp);
router.get('/api/admin/reserves', admin_session, showReserves);
router.get('/api/admin/exps', admin_session, showExps);

//delete
router.delete('/api/user/reserve/:id', deleteReserve);
router.delete('/api/admin/notification/:id', admin_session, deleteNotification);
//middleware
router.use(bodyparser.json());
//post
router.post('/api/restexps', showRestExps);
router.post('/api/user/login', login);
router.post('/api/user/logup', logup);
router.post('/api/user/info/edit', user_session, editInfo);
router.post('/api/user/addreserve', user_session, oauthUser, addReserve);
router.post('/api/admin/login', adminLogin);
router.post('/api/admin/monitorreserve', admin_session, monitorReserve);
router.post('/api/admin/monitoruser', admin_session, monitorUser);
router.post('/api/admin/addexperiment', admin_session, addExperiment);
router.post('/api/admin/switchpower', admin_session, switchPower);
router.post('/api/admin/notify', admin_session, notify);
router.post('/api/admin/exp/edit', admin_session, editExp);

module.exports = router;