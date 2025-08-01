import fastify from 'fastify'
import { appRoutes } from './http/routes'
import { ZodError } from 'zod'
import { env } from './env'

export const app = fastify()

app.get('/', async () => {
  return { message: 'Hello World!' }
})

app.register(appRoutes)

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error('Error in NODE_ENV:', error)
  } else {
    // TODO: Log to an external service like Sentry, Datadog, etc.
  }

  return reply.status(500).send({
    message: 'Internal server error',
  })
})
