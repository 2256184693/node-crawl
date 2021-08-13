/**
 * dev server
 */

const path = require('path')

const Koa = require('koa')

const manhua = require('./routers/manhua')

const { getLogger } = require('./utils/log')

const serve = require('koa-static')

const logger = getLogger('[APP]')

const app = new Koa()

// logger
app.use(async (ctx, next) => {
    await next()
    const rt = ctx.response.get('X-Response-Time');
    logger.info(`${ctx.method} ${ctx.url} - ${rt}`)
})

// x-response-time
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(manhua.routes())

app.use(serve(path.resolve(__dirname, '../dist')))
  
// response
// app.use(async ctx => {
//     ctx.body = 'Hello World123';
// });

app.listen(3000)