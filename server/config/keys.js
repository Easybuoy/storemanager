import keysprod from './keys_prod';
import keysdev from './keys_dev';

if (process.env.NODE_ENV === 'production') {
  module.exports = keysprod;
} else {
  module.exports = keysdev;
}
