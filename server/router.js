const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    app.get('/login', mid.requireSecure, mid.requireLogout, controllers.Account.loginPage);
    app.post('/login', mid.requireSecure, mid.requireLogout, controllers.Account.login);
    app.get('/signup', mid.requireSecure, mid.requireLogout, controllers.Account.signupPage);
    app.post('/signup', mid.requireSecure, mid.requireLogout, controllers.Account.signup);
    app.get('/logout', mid.requireLogin, controllers.Account.logout);
    app.get('/maker', mid.requireLogin, controllers.Domo.makerPage);
    app.post('/maker', mid.requireLogin, controllers.Domo.make);
    app.get('/', mid.requireSecure, mid.requireLogout, controllers.Account.loginPage);
};

module.exports = router;

