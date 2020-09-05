interface Config {
  key?: string
  option: any
  time?: number
}

interface Redis {
  host: string
  port: string
}

declare function aiRedisClient(config: Config | Redis, cache?: string)

export = aiRedisClient
