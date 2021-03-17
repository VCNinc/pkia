const common = require('../common.js');
const {performance} = require('perf_hooks');
const assert = require('assert').strict;
const should = require('chai').should();

suite('Experiment 1: 10 Honest Nodes', () => {
  test('Performance', async () => {
    const configs = await common.init(10, "ex1");
    const results = await common.run(configs);
  });
});
