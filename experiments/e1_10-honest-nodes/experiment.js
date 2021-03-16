const common = require('../common.js')

const N = 10;

module.exports = async () => {
  var configs = await common.init(N);
  var nodes = await common.run(configs);
}
