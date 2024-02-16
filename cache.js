const memoryCache = require('memory-cache');
const { store } = require('meganshop/extensions/meganCache/redis');


module.exports.addToRedis = async function addToRedis(key, value, expire = 300) {
    if (typeof key !== 'string' || (!key && key !== 0) || key === null || key === undefined)
        throw new Error('===> NÃO TEM NADA NA KEY OU NÃO É UMA STRING <===');

}

module.exports.getFromRedis = async function getFromRedis(key) {
    if (typeof key !== 'string' || (!key && key !== 0) || key === null || key === undefined)
        throw new Error('===> NÃO TEM NADA NA KEY OU NÃO É UMA STRING <===');
    return await _cacheRedis.get(`${key}`) || null;
}


// Adiciona um item ao cache/addToLocalCache
module.exports.addToLocalCache = async function addToLocalCache(key, value, expire = 300) {
    if (typeof key !== 'string' || (!key && key !== 0) || key === null || key === undefined)
        throw new Error('===> NÃO TEM NADA NA KEY OU NÃO É UMA STRING <===');
    if (store !== null) {
        console.log('ADD REDIS')
        await _cacheRedis.set(`${key}`, value)
        await _cacheRedis.expire(`${key}`, expire); // expire in 5 minutes
        console.log('ADD REDIS')
        return true;
    } else {
        console.log('ADD LOCALCACHE')
        await memoryCache.put(key, value, expire * 1000);
        console.log('ADD LOCALCACHE')
    }
}

// Recupera um item do cache
module.exports.getFromLocalCache = async function getFromLocalCache(key) {
    if (typeof key !== 'string' || (!key && key !== 0) || key === null || key === undefined)
        throw new Error('===> NÃO TEM NADA NA KEY OU NÃO É UMA STRING <===');
    if (store !== null) {
        console.log('GET REDIS')
        console.log('GET REDIS')
        return await _cacheRedis.get(`${key}`) || null;
    } else {
        console.log('GET LOCALCACHE')
        console.log('GET LOCALCACHE')
        return await memoryCache.get(key);
    }
}


/*
// Remove um item do cache
async function removeFromLocalCache(key) {
    if (typeof key !== 'string' || (!key && key !== 0) || key === null || key === undefined)
        throw new Error('===> NÃO TEM NADA NA KEY OU NÃO É UMA STRING <===');
    memoryCache.del(key);
}

// Limpa o cache inteiro
async function clearLocalCache() {
    memoryCache.clear();
}

*/