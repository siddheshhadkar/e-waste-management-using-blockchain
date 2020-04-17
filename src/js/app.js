App = {
    web3Provider: null,
    contracts: {},
    contractAddress: {
        AdminContract: '0x0',
        NodeContract: '0x0'
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
        return App.initAccount();
    },

    initAccount: function(){
        web3.eth.getCoinbase(function(err, account){
            if(err===null){
                App.account = account;
                $('#loginAddress').html("Your account address: " + App.account);
                return App.initContract();
            }
        });
    },

    initContract: function(){
        var counter = 0
        for(let contractName in App.contractAddress){
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
                App.contractAddress[contractName] = address;
            });
    },

    //call this when initializing contracts
    listenForEvents: function(){

    },

    makeTransaction:function (receiver,sender,amount) {
        amount=Number(amount);
        // console.log(amount);
        web3.eth.sendTransaction({
            to:receiver,
            from:sender,
            value:web3.toWei(amount,'ether')
        },function (error,result) {
            if (!error) {
                return "success";
            }else{
                console.log(error);
                return "failure";
            }
        });
    }
};

$(function(){
    $(window).on('load', function(){
        App.init();
    });
})
