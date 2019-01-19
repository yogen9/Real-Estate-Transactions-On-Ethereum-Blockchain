const routes = require('next-routes')();

routes
    .add('/properties/register', '/properties/register')
    .add('/properties/:address', '/properties/show')
    .add('/user/:address', '/user/index')
    .add('/user/:address/transferRequest/:tokenId', '/user/transferRequest');

module.exports = routes;