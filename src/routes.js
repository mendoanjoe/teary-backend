const httpStatus = require('http-status-codes');
const router = require('koa-router')();

const auth = require('./auth');
const user = require('./user');
// const province = require('./province');
// const district = require('./district');
// const subdistrict = require('./subdistrict');
// const village = require('./village');
const role = require('./role');
// const payment = require('./payment');
// const notification = require('./notification');
// const category = require('./category');
// const address = require('./address');
// const banner = require('./banner');
// const bank = require('./bank');
const file = require('./file');
// const product = require('./product');
// const cart = require('./cart');
// const deliveryTime = require('./delivery_times');
// const transaction = require('./transaction');
// const price = require('./price');

function attach(attachment = {}) {
  const authRouter = auth.routes.attach(attachment);
  // const provinceRouter = province.routes.attach(attachment);
  // const districtRouter = district.routes.attach(attachment);
  // const subdistrictRouter = subdistrict.routes.attach(attachment);
  // const villageRouter = village.routes.attach(attachment);
  const roleRouter = role.routes.attach(attachment);
  // const paymentRouter = payment.routes.attach(attachment);
  // const notificationRouter = notification.routes.attach(attachment);
  // const categoryRouter = category.routes.attach(attachment);
  // const addressRouter = address.routes.attach(attachment);
  // const bannerRouter = banner.routes.attach(attachment);
  // const bankRouter = bank.routes.attach(attachment);
  const fileRouter = file.routes.attach(attachment);
  // const productRouter = product.routes.attach(attachment);
  // const cartRouter = cart.routes.attach(attachment);
  // const deliveryTimeRouter = deliveryTime.routes.attach(attachment);
  // const transactionRouter = transaction.routes.attach(attachment);
  // const priceRouter = price.routes.attach(attachment);
  const userRouter = user.routes.attach(attachment);

  router.prefix('/v1');

  router.use(authRouter.routes(), authRouter.allowedMethods());
  router.use(userRouter.routes(), userRouter.allowedMethods());
  // router.use(provinceRouter.routes(), provinceRouter.allowedMethods());
  // router.use(districtRouter.routes(), districtRouter.allowedMethods());
  // router.use(subdistrictRouter.routes(), subdistrictRouter.allowedMethods());
  // router.use(villageRouter.routes(), villageRouter.allowedMethods());
  router.use(roleRouter.routes(), roleRouter.allowedMethods());
  // router.use(paymentRouter.routes(), paymentRouter.allowedMethods());
  // router.use(notificationRouter.routes(), notificationRouter.allowedMethods());
  // router.use(categoryRouter.routes(), categoryRouter.allowedMethods());
  // router.use(addressRouter.routes(), addressRouter.allowedMethods());
  // router.use(bannerRouter.routes(), bannerRouter.allowedMethods());
  // router.use(bankRouter.routes(), bankRouter.allowedMethods());
  router.use(fileRouter.routes(), fileRouter.allowedMethods());
  // router.use(productRouter.routes(), productRouter.allowedMethods());
  // router.use(cartRouter.routes(), cartRouter.allowedMethods());
  // router.use(deliveryTimeRouter.routes(), deliveryTimeRouter.allowedMethods());
  // router.use(transactionRouter.routes(), transactionRouter.allowedMethods());
  // router.use(priceRouter.routes(), priceRouter.allowedMethods());

  router.get('/ping', async ctx => {
    ctx.status = httpStatus.OK;
    ctx.body = {
      code: httpStatus.OK,
      message: 'pong',
      ok: true,
    };
  });

  router.all('*', async ctx => {
    ctx.status = httpStatus.NOT_FOUND;
    ctx.body = {
      code: httpStatus.NOT_FOUND,
      message: 'not found',
      ok: false,
    };
  });

  return router;
}

module.exports = {
  attach,
};
