const redis = require('redis')
const { list } = require('redis-commands')
const { promisify } = require('util')
const { checkType, getRandomSubscript } = require('./lib/tool')
const { createCache } = require('./lib/interval-cache-store')

function getRedisPool(data, key) {
  let target = {}
  let cache = data.key

  // https://github.com/Qihoo360/QConf
  if (checkType(data.option, 'Object')) {
    target = data.option
  } else {
    target = data
  }

  if (!cache && key) {
    cache = key
  }

  const config = getRedisConfig(target, cache)
  const interval = 1000 * (data.time || 60)

  const pool = createCache(`redis-${cache}`, () => {
    const redisPool = createRedisClient(config)

    setTimeout(() => {
      try {
        redisPool.quit()
      } catch (err) {
        console.error(`Close Redis error → ${cache}, ${err}`)
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
function createRedisClient(host, port = 6379) {
  const createClien = redis.createClient(port, host)
  const redisClient = build(createClien)

  return redisClient
}

/**
 * 将 Redis 命令转换为 Promise 版本
 * @param {any} target RedisClient
 * @return {any}
 */
function build(target) {
  list.forEach(method => {
    const func = target[method]

    if (typeof func === 'function') {
      target[method] = promisify(func)
      target[method.toUpperCase()] = promisify(func)
    }
  })

  return target
}

function getRedisConfig(data, cache) {
  let target = data
  const pass = checkType(data.getRedisConf, 'Function')

  if (pass) {
    target = data.getRedisConf(cache)
    target.port = Number(target.port) || 6379
  } else {
    const m = target.master[getRandomSubscript(target.master.length)]
    const one = m.split(':')

    target = {
      host: one[0],
      port: Number(target.port) || 6379,
    }
  }

  return target
}

module.exports = getRedisPool
