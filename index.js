const redis = require('redis')
const { list } = require('redis-commands')
const { promisify } = require('util')
const { checkType, getRandomSubscript } = require('./lib/tool')
const { createCache } = require('./lib/interval-cache-store')

function getRedisPool(data, key) {
  const cache = data.key || key
  const interval = 1000 * (data.time || 60)

  const pool = createCache(`redis-${cache}`, () => {
    const config = getRedisConfig(data)
    const redisPool = createRedisClient(config.host, config.port, config.password)

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
function createRedisClient(host, port = 6379, password = "") {
  const option = {}

  if (password != '') {
    option.password = password
  }

  const createClien = redis.createClient(port, host, option)
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

function getRedisConfig(data) {
  let qconf = {}
  let result = {}

  if (checkType(data.option, 'Object')) {
    qconf = data.option
  }

  // https://github.com/Qihoo360/QConf
  // https://www.npmjs.com/package/@blued-core/qconf
  const pass = checkType(qconf.getRedisConf, 'Function')

  if (pass) {
    result = qconf.getRedisConf(data.key)
    result.port = result.port || 6379
  } else {
    const m = data.master[getRandomSubscript(data.master.length)]
    const one = m.split(':')

    result.host = one[0]
    result.port = one[1] || 6379
    result.password = data.password
  }

  return result
}

module.exports = getRedisPool
