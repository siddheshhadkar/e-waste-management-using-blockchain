var AddressManager = artifacts.require("./AddressManager.sol");
var CollectionCentre = artifacts.require("./CollectionCentre.sol");
var Consumer = artifacts.require("./Consumer.sol");
var Producer = artifacts.require("./Producer.sol");
var RecycleUnit = artifacts.require("./RecycleUnit.sol");
var Retailer = artifacts.require("./Retailer.sol");

module.exports = function(deployer) {
    address = AddressManager.address;

    deployer.deploy(CollectionCentre, address);
    deployer.deploy(Consumer, address);
    deployer.deploy(Producer, address);
    deployer.deploy(RecycleUnit, address);
    deployer.deploy(Retailer, address);
};
