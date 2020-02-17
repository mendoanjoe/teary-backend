const HttpStatus = require('http-status-codes');

module.exports = async function ErrorHandler(ctx, next) {
  /**
   * Error Code
   * 200’s: Success codes
   * 400’s: Client error codes indicating that there was a problem with the request.
   * 500’s: Server error codes indicating that the request was accepted, but that an error on the server prevented the fulfillment of the request.
   */
  try {
    await next();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('err :', err);
    let construct = err;
    switch (err.name) {
      /**
       * Error handling for sequelize library
       * @https://github.com/sequelize/sequelize/tree/master/lib/errors
       */
      case 'SequelizeAssociationError':
        construct = new Error(HttpStatus.getStatusText(500));
        construct.code = 500;
        break;
      case 'SequelizeBaseError':
        construct = new Error(HttpStatus.getStatusText(500));
        construct.code = 500;
        break;
      case 'SequelizeBulkRecordError':
        construct = new Error(HttpStatus.getStatusText(500));
        construct.code = 500;
        break;
      case 'SequelizeConnectionError':
        construct = new Error(HttpStatus.getStatusText(500));
        construct.code = 500;
        break;
      case 'SequelizeDatabaseError':
        construct = new Error(HttpStatus.getStatusText(500));
        construct.code = 500;
        break;
      case 'SequelizeEagerLoadingError':
        construct = new Error(HttpStatus.getStatusText(500));
        construct.code = 500;
        break;
      case 'SequelizeEmptyResultError':
        construct = new Error(HttpStatus.getStatusText(500));
        construct.code = 500;
        break;
      case 'SequelizeInstanceError':
        construct = new Error(HttpStatus.getStatusText(500));
        construct.code = 500;
        break;
      case 'SequelizeOptimisticLockError':
        construct = new Error(HttpStatus.getStatusText(500));
        construct.code = 500;
        break;
      case 'SequelizeQueryError':
        construct = new Error(HttpStatus.getStatusText(500));
        construct.code = 500;
        break;
      case 'SequelizeScopeError':
        construct = new Error(HttpStatus.getStatusText(500));
        construct.code = 500;
        break;
      case 'SequelizeValidationError':
        construct = new Error(HttpStatus.getStatusText(500));
        construct.code = 500;
        break;

      case 'SequelizeAccessDeniedError':
        construct = new Error(HttpStatus.getStatusText(500));
        construct.code = 500;
        break;
      case 'SequelizeConnectionAcquireTimeoutError':
        construct = new Error(HttpStatus.getStatusText(500));
        construct.code = 500;
        break;
      case 'SequelizeConnectionRefusedError':
        construct = new Error(HttpStatus.getStatusText(500));
        construct.code = 500;
        break;
      case 'SequelizeConnectionTimedOutError':
        construct = new Error(HttpStatus.getStatusText(500));
        construct.code = 500;
        break;
      case 'SequelizeHostNotFoundError':
        construct = new Error(HttpStatus.getStatusText(500));
        construct.code = 500;
        break;
      case 'SequelizeHostNotReachableError':
        construct = new Error(HttpStatus.getStatusText(500));
        construct.code = 500;
        break;
      case 'SequelizeInvalidConnectionError':
        construct = new Error(HttpStatus.getStatusText(500));
        construct.code = 500;
        break;

      case 'SequelizeExclusionConstraintError':
        construct = new Error(HttpStatus.getStatusText(500));
        construct.code = 500;
        break;
      case 'SequelizeForeignKeyConstraintError':
        construct = new Error(HttpStatus.getStatusText(500));
        construct.code = 500;
        break;
      case 'SequelizeTimeoutError':
        construct = new Error(HttpStatus.getStatusText(500));
        construct.code = 500;
        break;
      case 'SequelizeUnknownConstraintError':
        construct = new Error(HttpStatus.getStatusText(500));
        construct.code = 500;
        break;

      case 'SequelizeUniqueConstraintError':
        construct = new Error(HttpStatus.getStatusText(500));
        construct.code = 500;
        break;
      /**
       * Jwt error handling
       * @https://github.com/koajs/jwt/blob/master/lib/index.js
       */
      case 'Authentication Error':
        construct = new Error(HttpStatus.getStatusText(401));
        construct.code = 401;
        break;
      case 'Token not found':
        construct = new Error(HttpStatus.getStatusText(401));
        construct.code = 401;
        break;
      case 'BadRequestError':
        construct = new Error(HttpStatus.getStatusText(400));
        construct.code = 400;
        break;
      case 'UnauthorizedError':
        construct = new Error(HttpStatus.getStatusText(401));
        construct.code = 401;
        break;
      /**
       * Custom exception for error handling in the app
       */
      case 'ForbiddenError':
        switch (err.message) {
          case 'ForbiddenByRuleInUserRole':
            construct = new Error('forbidden by user role');
            construct.code = 403;
            break;
          default:
            construct = new Error(HttpStatus.getStatusCode(403));
            construct.code = 403;
            break;
        }
        break;
      default:
        switch (err.message) {
          /**
           * Axios error handling
           */
          case 'Request failed with status code 401':
            construct = new Error(HttpStatus.getStatusText(500));
            construct.code = 500;
            break;
          case 'Request failed with status code 422':
            construct = new Error(HttpStatus.getStatusText(500));
            construct.code = 500;
            break;
          case 'Request failed with status code 403':
            construct = new Error(HttpStatus.getStatusText(500));
            construct.code = 500;
            break;
          default:
            switch (err.message.name) {
              /**
               * Joi error handling
               * @https://github.com/hapijs/joi/blob/master/lib/errors.js
               */
              case 'ValidationError':
                construct = new Error(HttpStatus.getStatusText(400));
                construct.code = 400;
                break;
              default:
                construct = err;
                construct.code = 400;
            }
        }
    }

    const handler = {
      code: construct.code,
      message: construct.message.toLowerCase(),
      ok: false,
    };
    ctx.status = handler.code;
    ctx.body = handler;
  }
};
