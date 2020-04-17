var AdminContract = artifacts.require('./AdminContract.sol');

contract("AdminContract", function(accounts){
    it("Number of producers is 3", function(){
        return AdminContract.deployed().then(function(i){
            i.addProducer('0x692a70D2e424a56D2C6C27aA97D1a86395877b3A', "Producer 1");
            i.addProducer('0xE5D942c2df02B1e20C298FB87eF52091484C0e27', "Producer 2");
            i.addProducer('0x75373478aD6165eee9DeBEb64b8c364C4c99bFE1', "Producer 3");
            return i.getProducerCount();
        }).then(function(count){
            assert.equal(count, 3);
        });
    });

    it("Initializes Producer with correct values", function(){
        return AdminContract.deployed().then(function(i){
            return i.producers(1).then(function(p){
                assert.equal(p.addr, '0xE5D942c2df02B1e20C298FB87eF52091484C0e27');
                assert.equal(p.name, 'Producer 3');
                assert.equal(p.ispresent, true);
            });
        });
    });
});
