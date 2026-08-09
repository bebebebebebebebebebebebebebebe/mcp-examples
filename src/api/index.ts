import { Hono } from 'hono'
const apiRoot = new Hono()

apiRoot.get('/', (c) => {
  return c.json({
    message: 'Hello, World!',
  })
})

export default apiRoot;
