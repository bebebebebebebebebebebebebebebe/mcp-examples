import { Hono } from 'hono'
import usersRoutes from '@/features/users/routes'
import type { AppContext } from '@/api/schemas'

const apiRoot = new Hono<AppContext>();

apiRoot.get('/', (c) => {
  return c.json({
    message: 'Hello, World!',
  })
})

apiRoot.route('/users', usersRoutes)

export default apiRoot;
