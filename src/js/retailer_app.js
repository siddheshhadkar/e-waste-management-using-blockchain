RecApp={
    loadAddress:function (argument) {
        web3.eth.getCoinbase(function(err, account){
            if(err===null){
                App.account = account;
                $('#accountaddress').html("Your account address: " + App.account);
                $('.mainbox').hide();
                setTimeout(function(){
                $('.mainbox').show();
                RecApp.render();
            }, 1000);
            }
        });

    },
    render:function (argument) {
        var amInstance;

        App.contracts.AddressManager.deployed().then()(function (instance) {
            amInstance=instance;
            return amInstance.getProducerCount();
        }).then(function (producerCount) {
            var producerSelect = $('#producerSelect');
            producerSelect.empty();

            producerCount=producerCount.s;
            for (var i = 0; i < producerCount; i++) {
                amInstance.Producers(i).then(function (argument) {
                    var name=Producers[2];
                    var address=Producers[0];
                    var producerOption = "<option value='" + address + "' >" + name + "</ option>"
                    producerSelect.append(producerOption);
                })
            }
        });
    },
        
}

 
$(document).ready(function(){
    $(window).on('load', function(){
        RecApp.loadAddress();
    });
});