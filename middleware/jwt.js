const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');
const koaJwt = require('koa-jwt');
const yaml = require('yamljs');

const certPath = path.resolve('./certs');
const routesPath = yaml.load('routes.yaml');

const privateKey = fs.readFileSync(`${certPath}/jwtRS256.key`, 'utf-8');
const publicKey = fs.readFileSync(`${certPath}/jwtRS256.key.pub`, 'utf-8');

const issuer = 'Teary';

const options = {
  issuer,

  algorithm: 'RS256',
  expiresIn: '30d',
};

function decode(token) {
  return jwt.decode(token, { complete: true });
}

function sign(payload) {
  options.subject = payload.user.email;

  return jwt.sign(payload, privateKey, options);
}

function verify(token) {
  return jwt.verify(token, publicKey, options);
}

function privateURL() {
  const publicURLPath = [/^(\/v1\/auth\/login\:google)/];
  routesPath.path.forEach(element => {
    // eslint-disable-next-line no-unused-vars
    const [_, url] = element.split(' ');
    const data = routesPath.version_prefix + url;

    publicURLPath.push(data);
  });

  return koaJwt({ secret: publicKey, algorithms: ['RS256'] }).unless({ path: publicURLPath });
}

module.exports = {
  decode,
  sign,
  verify,
  privateURL,
};
