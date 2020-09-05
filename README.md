# ai-redis-client

[![npm version][npm-image]][npm-url]

A redis tools for nodejs and want to look for a girlfriend...

## Installation

``` js
$ npm i ai-redis-client
```

## Usage

``` js
const redisClient = key => {
  if (!(key in datum)) {
    throw new Error(`Can not find the key: [${key}]`)
  }

  // use https://www.npmjs.com/package/@blued-core/qconf
  return createRedisClient({ key, option: qconf })

  // or

  return createRedisClient({ host: '10.10.0.20', port: '6379' }, key)
}

async function getTest () {
  const userRedis = redisClient('userRedis')()

  const data = await userRedis.hgetall('u:113').catch(err => {
    console.error(err, { tips: 'test -> hgetall error' })
  })

  console.log({ notice: data })

  return data
}
```

## Options

```js
// options
interface Config {
  key?: string
  option: any
  time?: number
}

interface Redis {
  host: string
  port: string
}
```

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)

[npm-image]: https://img.shields.io/npm/v/ai-redis-client.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ai-redis-client
