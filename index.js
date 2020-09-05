const redis = require('redis')
const { list } = require('redis-commands')
const { promisify } = require('util')
const { createCache } = require('./utils/interval-cache-store')

function getRedisPool (data, cache) {
  const interval = 1000 * (data.time || 60)
  let target = {}
  let words = data.key

  // use https://github.com/Qihoo360/QConf
  if (checkType(data.option, 'Object')) {
    target = data.option
  }

  if (checkType(data.host, 'String') && cache) {
    target = data
    words = cache
  }

  const pool = createCache(`redis-${words}`, () => {
    const config = checkType(target.getRedisConf, 'Function') ? target.getRedisConf(words) : target
    const redisPool = createRedisClient(config.host)

    setTimeout(() => {
      try {
        redisPool.quit()
      } catch (err) {
        console.error(`Close Redis error → ${words}, ${err}`)
      }
    }, interval * 2)

    return redisPool
  }, interval)

  return pool
}

/**
 * 创建redis客户端连接
 * @param {string} host redis对应的IP
 * @param {number} port 创建链接的端口
 * @return {redisClient}
 */
function createRedisClient (host, port = 6379) {
  const createClien = redis.createClient(port, host)
  const redisClient = build(createClien)

  return redisClient
}

/**
 * 将 Redis 命令转换为 Promise 版本
 * @param {any} target RedisClient
 * @return {any}
 */
function build (target) {
  list.forEach(method => {
    const func = target[method]
    if (typeof func === 'function') {
      target[method] = promisify(func)
      target[method.toUpperCase()] = promisify(func)
    }
  })

  return target
}

function checkType (param, type) {
  return Object.prototype.toString.call(param) === `[object ${type}]`
}

module.exports = getRedisPool
