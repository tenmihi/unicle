const cr = require('crypto');

export function md5 (src) {
  const md5hash = cr.createHash('md5');
  md5hash.update(src, 'binary');
  return md5hash.digest('hex');
};
