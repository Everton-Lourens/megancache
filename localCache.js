const CronJob = require('cron').CronJob;

var _cache = new Map();
var _cacheExpire = new Map(); // Mapa para armazenar tempos de expiração


module.exports.addToRedis = async function addToRedis(key, value, expire = 300) {
    if ((!key && key !== 0) || key === null || key === undefined)
        return console.log('===> NÃO TEM NADA NA KEY <===');
    key = JSON.stringify(key) || JSON.stringify({ key });
    value = JSON.stringify(value) || [];
    await _cache.set(`${key}`, value)
    await _cache.expire(`${key}`, expire); // expire in 5 minutes
    return true;
}

module.exports.getFromRedis = async function getFromRedis(key) {
    if ((!key && key !== 0) || key === null || key === undefined)
        return console.log('===> NÃO TEM NADA NA KEY <===');
    key = JSON.stringify(key) || JSON.stringify({ key });
    return await _cache.get(`${key}`) || null;
}


// Adiciona um item ao cache
module.exports.addToLocalCache = async function addToLocalCache(key, value, expire = 300) { // 5 minutes (in seconds)
    await removeFromLocalCache(key);
    // Define o tempo de expiração
    const expireTime = Date.now() + expire * 1000;
    _cacheExpire.set(key, expireTime);
    _cache.set(key, value);
}

// Recupera um item do cache
module.exports.getFromLocalCache = async function getFromLocalCache(key) {
    const expireTime = await _cacheExpire.get(key);

    // Verifica se a chave existe e se não expirou
    if (expireTime && expireTime > Date.now()) {
        return await _cache.get(key) || null;
    } else {
        // Se expirou, remove a chave do cache e do mapa de tempos de expiração
        await removeFromLocalCache(key);
        return null;
    }
}

// Remove um item do cache
async function removeFromLocalCache(key) {
    await _cache.delete(key);
    await _cacheExpire.delete(key);
}

// Limpa o cache inteiro
async function clearLocalCache() {
    await _cache.clear();
}

// Defina uma função para verificar o status dos itens no mapa de cache
function checkCache() {
    _cacheExpire.forEach((value, key) => {
        if (value < Date.now())
            removeFromLocalCache(key);
    });
}

// Defina um cron job para verificar o cache em um loop
const job = new CronJob('* * * * *', checkCache); // Este cron job executará a função checkCache a cada minuto

job.start(); // Inicie o cron job