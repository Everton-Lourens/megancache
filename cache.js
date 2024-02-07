const redis = require('redis');
const { logger } = require('./logger');

/*
const { store } = require('meganshop/extensions/cache'); 
//////////////////////////////////////
await store.set(`pessoas:id:${req.params.id}`, JSON.stringify(result))
await store.expire(`pessoas:id:${req.params.id}`, 300); // expire in 5 minutes
*/

module.exports.store = redis.createClient({ url: process.env.REDIS_URL || 'redis://localhost'});

module.exports.store.on('error', function logError(err){
    logger.error(`cache.js: an error occurred ${err} retrying in sec`);
    setTimeout(() => {
        module.exports.store.connect();
    }, 1000)
})

module.exports.store.on('connect', function(){
    logger.info(`cache.js: cached is connected!`);
});

module.exports.store.connect();