const common = require('../common.js');
const {performance} = require('perf_hooks');

const N = 10;

module.exports = async () => {
  console.log('Experiment 1: N=10, Check Correctness');
  const start = performance.now();
  const configs = await common.init(N, "ex1");
  const results = await common.run(configs);
  const end = performance.now();
  console.log('Experiment 1: Finished', (end - start) / 1000);
}
