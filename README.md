# ai-redis-client

[![npm version][npm-image]][npm-url]

A redis client tools for nodejs and want to look for a girlfriend...

## Installation

``` js
$ npm i ai-redis-client
```

## Usage

``` js
const redisClient = key => {
  // https://www.npmjs.com/package/@blued-core/qconf
  return createRedisClient({ key, option: qconf })()

  // or
  return createRedisClient({ master: ['127.0.0.1:6379'] }, key)()
}

async function getTest () {
  const userRedis = redisClient('user')

  const res = await userRedis.hgetall('u:113').catch(err => {
    console.error(err, { tips: 'test -> hgetall error' })
  })

  console.log(res)

  return res
}
```

## Options

```js
// options
interface Config {
  key?: string
  time?: number
  option: any
}

interface Redis {
  master: Array<string>
  password?: string
  db?: number
}
```

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)

[npm-image]: https://img.shields.io/npm/v/ai-redis-client.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ai-redis-client
