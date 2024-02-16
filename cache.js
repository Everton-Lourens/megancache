const memoryCache = require('memory-cache');
const { store } = require('meganshop/extensions/meganCache/redis');

// Adiciona um item ao cache/addToLocalCache
module.exports.addToLocalCache = async function addToLocalCache(key, value, expire = 300) {
    try {
        if (typeof key !== 'string' || (!key && key !== 0) || key === null || key === undefined)
            throw new Error('===> NÃO TEM NADA NA KEY OU NÃO É UMA STRING <===');
        if (store !== null) {
            await store.set(`${key}`, value)
            await store.expire(`${key}`, expire); // expire in 5 minutes
            return true;
        } else {
            await memoryCache.put(key, value, expire * 1000);
        }
    } catch (error) {
        return false;
    }
}

// Recupera um item do cache
module.exports.getFromLocalCache = async function getFromLocalCache(key) {
    try {
        if (typeof key !== 'string' || (!key && key !== 0) || key === null || key === undefined)
            throw new Error('===> NÃO TEM NADA NA KEY OU NÃO É UMA STRING <===');
        if (store !== null) {
            return await store.get(`${key}`) || null;
        } else {
            return await memoryCache.get(key) || null;
        }
    } catch (error) {
        return null;
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