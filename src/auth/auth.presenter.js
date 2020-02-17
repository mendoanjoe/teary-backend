const axios = require('axios');
const httpStatus = require('http-status-codes');
const { google } = require('googleapis');

const jwt = require('./../../middleware/jwt');
// const otpModule = require('./../otp');

const authCore = require('./auth.core');
const authValidation = require('./auth.validation');
const userCore = require('./../user/user.core');

function Google(Module = {}) {
  const { attachment, user } = Module;
  const { env, redis } = attachment;

  const config = {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    redirect: env.GOOGLE_REDIRECT_URL,
  };
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ];

  const createConnection = () => {
    return new google.auth.OAuth2(config.clientId, config.clientSecret, config.redirect);
  };

  const retrieveUrl = auth => {
    return auth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes,
    });
  };

  const ret = async ctx => {
    if (ctx.query.code) {
      const { code } = ctx.query;

      const auth = createConnection();
      let data = null;

      try {
        data = await auth.getToken(code);
      } catch (exception) {
        ctx.status = httpStatus.BAD_REQUEST;
        ctx.body = {
          code: httpStatus.BAD_REQUEST,
          message: 'token mismatch',
          ok: false,

          data: {
            ...exception.response.data,
          },
        };
        return;
      }

      const accessToken = data.tokens.access_token;
      let userInfo;

      try {
        const url = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json';
        userInfo = await axios.get(`${url}&access_token=${accessToken}`);
      } catch (exception) {
        ctx.status = httpStatus.BAD_REQUEST;
        ctx.body = {
          code: httpStatus.BAD_REQUEST,
          message: 'invalid access token',
          ok: false,

          data: {
            ...exception.response.data,
          },
        };
        return;
      }

      userInfo = userInfo.data;
      const { email } = userInfo;
      const userdata = await user.core.findUserByEmail(email);

      if (!userdata) {
        ctx.status = httpStatus.NOT_FOUND;
        ctx.body = {
          code: httpStatus.NOT_FOUND,
          message: 'email not registered',
          ok: false,
        };
        return;
      }

      const payload = { user: userdata };
      delete payload.user.password;

      payload.user.google_access_token = data.tokens.access_token;
      payload.user.google_refresh_token = data.tokens.refresh_token;
      payload.user.google_token_expiry_date = new Date(data.tokens.expiry_date);

      const token = jwt.sign(payload);
      const decoded = jwt.decode(token);
      const expiredTime = decoded.payload.exp * 1000;
      const expiredAt = new Date(expiredTime);

      payload.access_token = `Bearer ${token}`;
      redis.set(`userdata/${payload.user.id}`, JSON.stringify(payload));

      ctx.status = httpStatus.OK;
      ctx.body = {
        code: httpStatus.OK,
        message: 'user logged in',
        ok: true,

        data: {
          token: {
            expired_at: expiredAt,
            type: 'Bearer',
            value: token,
          },
          user: payload.user,
        },
      };
    } else {
      const auth = createConnection();
      const url = retrieveUrl(auth);

      ctx.status = httpStatus.CREATED;
      ctx.body = {
        code: httpStatus.CREATED,
        message: 'login url created',
        ok: true,

        data: { url },
      };
    }
  };

  return ret;
}

function Login(Module = {}) {
  const { attachment, auth } = Module;
  const { redis } = attachment;

  const ret = async ctx => {
    const validate = auth.validation.loginSchema.validate(ctx.request.body);

    if (validate.error) {
      ctx.status = httpStatus.BAD_REQUEST;
      ctx.body = {
        code: httpStatus.BAD_REQUEST,
        message: 'validation failed',
        ok: false,

        data: {
          error: validate.error,
        },
      };
      return;
    }

    const { email, password } = ctx.request.body;
    const user = await auth.core.authenticateUser({ email, password });

    if (!user) {
      ctx.status = httpStatus.NOT_FOUND;
      ctx.body = {
        code: httpStatus.NOT_FOUND,
        message: 'user credentials does not match',
        ok: false,
      };
      return;
    }

    const payload = { user: user.dataValues };
    delete payload.user.password;

    const token = jwt.sign(payload);
    const decoded = jwt.decode(token);
    const expiredTime = decoded.payload.exp * 1000;
    const expiredAt = (new Date(expiredTime) - new Date()) / 1000;

    payload.access_token = `Bearer ${token}`;
    redis.set(`userdata/${payload.user.id}`, JSON.stringify(payload));

    ctx.status = httpStatus.OK;
    ctx.body = {
      code: httpStatus.OK,
      message: 'logged in',
      ok: true,

      data: {
        token: {
          expired_in: expiredAt,
          type: 'Bearer',
          value: token,
        },
        user: payload.user,
      },
    };
  };

  return ret;
}

function Logout(Module = {}) {
  const { attachment } = Module;
  const { redis } = attachment;

  const ret = async ctx => {
    const { header } = ctx.request;
    const { authorization } = header;

    try {
      const userdata = jwt.decode(authorization.substr(7));
      const userId = userdata.payload.id;

      redis.del(`userdata/${userId}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }

    ctx.status = httpStatus.OK;
    ctx.body = {
      code: httpStatus.OK,
      message: 'user logged out',
      ok: true,
    };
  };

  return ret;
}

function Register(Module = {}) {
  const { attachment, auth, user } = Module;
  const { redis } = attachment;

  const ret = async ctx => {
    const validate = auth.validation.registerSchema.validate(ctx.request.body);

    if (validate.error) {
      ctx.status = httpStatus.BAD_REQUEST;
      ctx.body = {
        code: httpStatus.BAD_REQUEST,
        message: 'validation failed',
        ok: false,

        data: {
          error: validate.error,
        },
      };
      return;
    }

    const { email } = ctx.request.body;

    if (await user.core.isEmailRegistered(email)) {
      ctx.status = httpStatus.BAD_REQUEST;
      ctx.body = {
        code: httpStatus.BAD_REQUEST,
        message: 'email already registered',
        ok: false,
      };
      return;
    }

    const userdata = await user.core.createUser({
      ...ctx.request.body,
    });

    if (!userdata) {
      ctx.status = httpStatus.INTERNAL_SERVER_ERROR;
      ctx.body = {
        code: httpStatus.INTERNAL_SERVER_ERROR,
        message: 'internal server error',
        ok: false,
      };
      return;
    }

    const payload = { user: user.dataValues };
    delete payload.user.password;

    const token = jwt.sign(payload);
    const decoded = jwt.decode(token);
    const expiredTime = decoded.payload.exp * 1000;
    const expiredAt = (new Date(expiredTime) - new Date()) / 1000;

    payload.access_token = `Bearer ${token}`;
    redis.set(`userdata/${payload.user.id}`, JSON.stringify(payload));

    ctx.status = httpStatus.CREATED;
    ctx.body = {
      code: httpStatus.CREATED,
      message: 'user created',
      ok: true,

      data: {
        token: {
          expired_in: expiredAt,
          type: 'Bearer',
          value: token,
        },
        user: payload.user,
      },
    };
  };

  return ret;
}

function attach(attachment = {}) {
  const Module = {
    attachment,

    auth: {
      core: authCore.attach(attachment),
      validation: authValidation,
    },
    user: { core: userCore.attach(attachment) },
  };

  const functions = [Google, Login, Logout, Register];
  const ret = {};

  functions.forEach(fn => {
    ret[fn.name] = fn(Module);
  });

  return ret;
}

module.exports = {
  attach,
};
