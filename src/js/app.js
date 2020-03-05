App = {
    web3Provider: null,
    contracts: {},
    contractAddresses: {
        AddressManager: '0x0',
        CollectionCentre: '0x0',
        Consumer: '0x0',
        Retailer: '0x0',
        Producer: '0x0',
        RecycleUnit: '0x0',
    },
    account: '0x0',

    init: function(){
        return App.initWeb3();
    },

    initWeb3: function(){
        if(typeof web3!=='undefined'){
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(App.web3Provider);
        }else{
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        }
        return App.initContract();
    },

    initContract: function(){
        var counter = 0
        for(let contractName in App.contractAddresses){
            $.getJSON(contractName+'.json', function(result){
                counter++;
                App.contracts[contractName] = TruffleContract(result);
                App.contracts[contractName].setProvider(App.web3Provider);
                return App.initAddresses(contractName, counter);
            });
        }
    },

    initAddresses: function(contractName, counter){
        App.contracts[contractName].deployed()
            .then((i) => i.address)
            .then(function(address){
                App.contractAddresses[contractName] = address;
                if (counter == 6) {
                    return App.setAddressManagerAddresses();
                }
            });
    },

    setAddressManagerAddresses:async function(){
        for (let contractName in App.contractAddresses) {   //on;y using let solves the issue here(no need of async/await)
            if (contractName == 'AddressManager') {
                continue;
            }
            await App.contracts.AddressManager.deployed().then(function(i){
                i.setAddress(contractName, App.contractAddresses[contractName]).then(() => {
                    i.getAddress(contractName).then((res) => {
                        console.log(contractName, res);
                    });
                });
            });
        }
    },

    listenForEvents: function(){

    },

    render: function(){
        for (var key in App.contractAddresses) {
            console.log(key, App.contractAddresses[key]);
        }

        web3.eth.getCoinbase(function(err, account){
            if(err===null){
                App.account = account;
                $('#petsRow').html("Your account address is: " + App.account);
            }
        });
    }
};

$(function(){
    $(window).on('load', function(){
        App.init();
    });
})
