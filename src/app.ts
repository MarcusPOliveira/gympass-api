import fastify from 'fastify'
import { appRoutes } from './http/routes'

export const app = fastify()

app.get('/', async () => {
  return { message: 'Hello World!' }
})

app.register(appRoutes)
