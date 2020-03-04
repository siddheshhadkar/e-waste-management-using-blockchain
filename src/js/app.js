App = {
    web3Provider: null,
    contracts: {},
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
        });
        $.getJSON('CollectionCentre.json', function(collectionCentre){
            App.contracts.CollectionCentre = TruffleContract(collectionCentre);
            App.contracts.CollectionCentre.setProvider(App.web3Provider);
        });
        $.getJSON('Consumer.json', function(consumer){
            App.contracts.Consumer = TruffleContract(consumer);
            App.contracts.Consumer.setProvider(App.web3Provider);
        });
        $.getJSON('Producer.json', function(producer){
            App.contracts.Producer = TruffleContract(producer);
            App.contracts.Producer.setProvider(App.web3Provider);
        });
        $.getJSON('Retailer.json', function(retailer){
            App.contracts.Retailer = TruffleContract(retailer);
            App.contracts.Retailer.setProvider(App.web3Provider);
        });
        $.getJSON('RecycleUnit.json', function(recycleUnit){
            App.contracts.RecycleUnit = TruffleContract(recycleUnit);
            App.contracts.RecycleUnit.setProvider(App.web3Provider);
        });
        // return App.render();
        return App.initAddresses();
    },

    initAddresses: function(){
        console.log('reached');
    },

    listenForEvents: function(){
        App.contracts.Election.deployed().then(function(i){
            i.votedEvent({}, {
                fromBlock:0,
                toBlock: 'latest'
            }).watch(function(){
                console.log("Event triggered", event);
                App.render();
            });
        });
    },

    render: function(){
        var electionInstance;
        var loader = $('#loader');
        var content = $('#content');

        loader.show();
        content.hide();

        //Loading account data
        web3.eth.getCoinbase(function(err, account){
            if(err===null){
                App.account = account;
                $('#accountAddress').html("Your account address is: "+App.account);
            }
        });

        //Loading contract data
        App.contracts.Election.deployed().then(function(i){
            electionInstance = i;
            return electionInstance.candidatesCount();
        }).then(function(candidatesCount){
            var candidatesResults = $('#candidatesResults');
            candidatesResults.empty();

            var candidatesSelect = $('#candidatesSelect');
            candidatesSelect.empty();

            for(var i = 1; i<=candidatesCount; i++){
                electionInstance.candidates(i).then(function(candidate){
                    var id = candidate[0].toNumber();
                    var name = candidate[1];
                    var voteCount = candidate[2].toNumber();

                    var candidateTemplate = "<tr><th>"+id+"</th><td>"+name+"</td><td>"+voteCount+"</td></tr>";
                    candidatesResults.append(candidateTemplate);

                    var candidateOption = "<option value='"+id+"'>"+name+"</option>";
                    candidatesSelect.append(candidateOption);
                });
            }
            return electionInstance.voters(App.account);
        }).then(function(hasVoted){
            if(hasVoted){
                $('form').hide();
            }
            loader.hide();
            content.show();
        }).catch(function(err){
            console.warn(err);
        });
    },

    castVote: function(){
        var candidateId = $('#candidatesSelect').val();
        App.contracts.Election.deployed().then(function(i){
            return i.vote(candidateId, {from: App.account});
        }).then(function(result){
            $('#content').hide();
            $('#loader').show();
        }).catch(function(err){
            console.error(err);
        });
    }
};

$(function(){
    $(window).on('load', function(){
        App.init();
    });
})
