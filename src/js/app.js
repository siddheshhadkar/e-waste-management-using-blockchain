App = {
    web3Provider: null,
    contracts: {},
    contractAddresses: {},
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
        $.getJSON('AddressManager.json', function(addressManager){
            App.contracts.AddressManager = TruffleContract(addressManager);
            App.contracts.AddressManager.setProvider(App.web3Provider);
            return App.initAddresses('AddressManager');
        });
        $.getJSON('CollectionCentre.json', function(collectionCentre){
            App.contracts.CollectionCentre = TruffleContract(collectionCentre);
            App.contracts.CollectionCentre.setProvider(App.web3Provider);
            return App.initAddresses('CollectionCentre');
        });
        $.getJSON('Consumer.json', function(consumer){
            App.contracts.Consumer = TruffleContract(consumer);
            App.contracts.Consumer.setProvider(App.web3Provider);
            return App.initAddresses('Consumer');
        });
        $.getJSON('Producer.json', function(producer){
            App.contracts.Producer = TruffleContract(producer);
            App.contracts.Producer.setProvider(App.web3Provider);
            return App.initAddresses('Producer');
        });
        $.getJSON('Retailer.json', function(retailer){
            App.contracts.Retailer = TruffleContract(retailer);
            App.contracts.Retailer.setProvider(App.web3Provider);
            return App.initAddresses('Retailer');
        });
        $.getJSON('RecycleUnit.json', function(recycleUnit){
            App.contracts.RecycleUnit = TruffleContract(recycleUnit);
            App.contracts.RecycleUnit.setProvider(App.web3Provider);
            return App.initAddresses('RecycleUnit');
        });
    },

    initAddresses: function(contractName){
        App.contracts[contractName].deployed()
            .then((i) => i.address)
            .then(function(address){
                App.contractAddresses[contractName] = address;
                if (Object.keys(App.contractAddresses).length == 6) {
                    return App.setAddressManagerAddresses();
                }
            });
    },

    setAddressManagerAddresses: function(){
        // console.log(App.contractAddresses);
        for (var contractName in App.contractAddresses) {
            App.contracts.AddressManager.deployed()
                .then(function(i){
                    console.log(contractName, App.contractAddresses[contractName]);
                    // i.setAddress(contractName, App.contractAddresses[contractName]);
                    // console.log(i.getAddress(contractName));
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
