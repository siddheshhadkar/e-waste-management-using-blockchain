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
               
            });
    },


    listenForEvents: function(){

    },

    render: function(){
        
    }
};

$(function(){
    $(window).on('load', function(){
        App.init();
    });
})
