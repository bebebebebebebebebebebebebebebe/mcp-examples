import { Hono } from 'hono'
import type { BaseLogger } from '@hono/structured-logger'
import { renderer } from './client/renderer'
import { createStructuredLoggerMiddleware } from './config/logger';
import { requestId } from "hono/request-id";
import apiRoot from "./api/index";

type AppContext = {
  Variables: {
    logger: BaseLogger;
    requestId: string;
  };
}

const app = new Hono<AppContext>()

app.use(requestId())
app.use('*', createStructuredLoggerMiddleware())
app.use(renderer)
app.route('/api', apiRoot)

app.get('/', (c) => {
  return c.render(<h1>Hello!</h1>)
})

export default app
