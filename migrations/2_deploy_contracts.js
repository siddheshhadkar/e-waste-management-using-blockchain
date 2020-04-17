var AdminContract = artifacts.require("./AdminContract.sol");
var NodeContract = artifacts.require("./NodeContract.sol");

module.exports = async function(deployer) {
    await deployer.deploy(AdminContract);
    await deployer.deploy(NodeContract);
};
