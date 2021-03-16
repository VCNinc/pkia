const trs = require('trs-js')
const node = require('../node.js')

module.exports.run = (configs) => {
  var promises = [];

  configs.forEach((config) => {
    promises.push(node(config));
  });

  return Promise.all(promises);
}

module.exports.init = (N) => {
  var configs = [];
  var pki = [];

  for (let i = 0; i < N; i++) {
    let port = 20000 + i;
    let kp = trs.gen_keypair();
    let pk = trs.public_to_ascii(kp.public);
    let sk = trs.private_to_ascii(kp.private);
    configs.push({
      N: N,
      id: 'NODE' + i,
      port: port,
      key: {
        public: pk,
        private: sk
      }
    });
    pki.push({
      endpoint: 'http://localhost:' + port,
      key: pk
    });
  }

  for (let i = 0; i < N; i++) {
    configs[i].pki = pki;
  }

  return configs;
}
