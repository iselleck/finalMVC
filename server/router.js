const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    app.get('/getToken', mid.requireSecure, controllers.Account.getToken);
    app.get('/getTasks', mid.requiresLogin, controllers.Task.getTasks);
    app.get('/login', mid.requireSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requireSecure, mid.requiresLogout, controllers.Account.login);
    app.post('/signup', mid.requireSecure, mid.requiresLogout, controllers.Account.signup);
    app.get('/logout', mid.requiresLogin, controllers.Account.logout);
    app.get('/maker', mid.requiresLogin, controllers.Task.makerPage);
    app.post('/maker', mid.requiresLogin, controllers.Task.make);
    app.get('/', mid.requireSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.get('*', mid.requireSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;

