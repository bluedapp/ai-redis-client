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

declare function getRedisPool(config: Config | Redis, key?: string)

export = getRedisPool
