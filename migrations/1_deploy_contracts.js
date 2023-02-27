const ddos = artifacts.require("./ddos.sol");

module.exports = function (deployer) {
  deployer.deploy(ddos);
};
