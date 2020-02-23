const yaml = require('yamljs');

const jwt = require('./jwt');
const rolesModule = require('./../src/modules/roles');

const routesPath = yaml.load('routes.yaml');

const BEARER_SEPARATOR_LENGTH = 7;
const VERSION_SEPARATOR_LENGTH = 2;

function splitRuleComponent(rule) {
  const splitted = rule.split(' ');
  const ruleMethod = splitted[0];
  const ruleUrl = splitted.length === 1 ? '' : splitted.slice(1).join(' ');

  return { ruleMethod, ruleUrl };
}

function isPublicUrl(ctx) {
  const publicURLPath = {};
  routesPath.path.forEach(element => {
    const [method, url] = element.split(' ');
    const formattedUrl = routesPath.version_prefix + url;

    if (typeof publicURLPath[method] === 'undefined') {
      publicURLPath[method] = [];
    }

    publicURLPath[method].push(formattedUrl);
  });

  const { method, url } = ctx.request;
  if (method === 'GET' && url.match(/^(\/v1\/auth\/login\:google)/)) {
    return true;
  }

  let isPublic = false;
  const possiblePublicUrl = publicURLPath[method] || [];

  for (let i = 0; i < possiblePublicUrl.length && !isPublic; i += 1) {
    const publicUrl = possiblePublicUrl[i];
    const currentUrl = url.substr(0, Math.min(url.length, publicUrl.length));

    isPublic = currentUrl === publicUrl.substr(0, currentUrl.length);
  }

  return isPublic;
}

function attach(attachment = {}) {
  const { redis } = attachment;
  const roleCore = rolesModule.core.attach(attachment);

  const ret = async (ctx, next) => {
    const { url } = ctx.request;
    const isPublic = isPublicUrl(ctx);

    if (!isPublic) {
      const { header, method } = ctx.request;
      const { authorization } = header;

      if (!authorization) {
        await next();
      }

      const jwtCredential = jwt.decode(authorization.substr(BEARER_SEPARATOR_LENGTH));

      if (!jwtCredential) {
        ctx.throw(401, 'CredentialsError');
      }

      const { payload } = jwtCredential;
      const userdata = await redis.getAsync(`userdata/${payload.user.id}`);

      if (userdata) {
        try {
          const roleId = JSON.parse(userdata).user.role_id;

          const key = `role/${roleId}`;
          let rules = await redis.getAsync(key);

          if (!rules) {
            const role = await roleCore.getRoleById(roleId);

            if (role) {
              rules = JSON.stringify(role.rules);
              redis.set(key, rules);
            } else {
              rules = await redis.getAsync('role/default');

              if (!rules) {
                const defaultRole = await roleCore.getDefaultRole();
                rules = defaultRole.dataValues.rules;

                redis.set(key, JSON.stringify(rules));
                redis.set(`role/default`, JSON.stringify(rules));
              }
            }
          }

          rules = JSON.parse(rules);

          let path = url.split('/');
          path = path.length < VERSION_SEPARATOR_LENGTH ? [] : path.slice(VERSION_SEPARATOR_LENGTH);
          path = `/${path.join('/')}`;

          const { disables, enables } = rules;
          let isDisabled = false;
          let isEnabled = false;

          for (let i = 0; i < disables.length; i += 1) {
            const rule = disables[i];

            try {
              const { ruleMethod, ruleUrl } = splitRuleComponent(rule);
              const isMethodMatches = new RegExp(`^(${ruleMethod})`).test(method);
              const isUrlMatches = new RegExp(`^(${ruleUrl})`).test(path);

              isDisabled = isMethodMatches && isUrlMatches;
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error(err);
            }

            if (isDisabled) {
              break;
            }
          }

          for (let i = 0; i < enables.length; i += 1) {
            const rule = enables[i];

            try {
              const { ruleMethod, ruleUrl } = splitRuleComponent(rule);
              const isMethodMatches = new RegExp(`^(${ruleMethod})`).test(method);
              const isUrlMatches = new RegExp(`^(${ruleUrl})`).test(path);

              isEnabled = isMethodMatches && isUrlMatches;
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error(err);
            }

            if (isEnabled) {
              break;
            }
          }

          if (isDisabled || !isEnabled) {
            ctx.throw(403, 'ForbiddenByRuleInUserRole');
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);

          throw err;
        }
      } else {
        ctx.throw(401, 'CredentialsError');
      }
    }

    await next();
  };

  return ret;
}

module.exports = {
  attach,
};
