RecApp={
    QuantityAvailable:null,
    frequency:{},

    loadAddress:function (argument) {
        $('.container').hide();
        web3.eth.getCoinbase(function(err, account){
            if(err===null){
                var amInstance;
                App.account = account;
                setTimeout(function(){
                    App.contracts.AddressManager.deployed().then(function(i){
                        amInstance = i;
                        amInstance.checkRetailer(App.account).then(function(exists){
                            if (!exists) {
                                alert("Please log in with a Retailer account to access this page");
                            }else{
                                amInstance.getRetailerName(App.account).then(function(accountName){
                                    $('#accountaddress').html("Your account name: " + accountName);
                                    $('.loader').hide();
                                    $('.container').show();
                                    RecApp.render();
                                })
                            }
                        })
                    });
                }, 500);
            }
        });
    },

    render:function (argument) {
        var amInstance;
        var pAddress;
        var pInstance;

        App.contracts.AddressManager.deployed().then(function (instance) {
            amInstance=instance;
            return amInstance.getProducerCount();
        }).then(function (producerCount) {
            var producerSelect = $('#producerSelect');
            producerSelect.empty();
            var producerOption = "<option value='" + null + "'disabled selected >" +"Select Producer" + "</ option>"
            producerSelect.append(producerOption);

            for (let i = 0; i < producerCount; i++) {
                amInstance.producers(i).then(function (singleProducer) {
                    var name=singleProducer[2];
                    var address=singleProducer[0];
                    var producerOption = "<option value='" + address + "' >" + name + "</ option>"
                    producerSelect.append(producerOption);
                })
            }
        })
    },

    buyProduct:function () {
        var pAddress=$('#producerSelect').val();
        var pType=$('#productType').val();
        var productname = $('#productlistSelect').val();
        var quantity = $('#quantity').val();
        RecApp.frequency={};

        if (pAddress!=null && pType!=null&& productlistSelect!=null && quantity!="") {
            if(quantity>RecApp.QuantityAvailable || quantity==0){
                alert("Enter Valid Quantity");
            }else{
                alert("Fine");
                App.contracts.Producer.deployed().then(function (instance) {
                    instance.soldToRetailer(pAddress,productname,pType,quantity).then(function (argument) {
                        return instance.cost();
                    }).then(function (amount) {
                        console.log(amount);
                        var res=App.makeTransaction(pAddress,App.account,amount);
                        if(res=="success"){
                            alert("Transaction Process Completed");
                        }else{
                            alert("Transaction Process Failed");
                        }
                    })
                })
            }
        }else{
            alert("Fill empty fields");
        }
    },

    updateProducer:function() {
        var pAddress;
        var pInstance;
        App.contracts.Producer.deployed().then(function(instance) {
            pInstance=instance;
            return pInstance.getProductCount();
        }).then(function (pCount) {
            var pAddress=$('#producerSelect').val();
            var pType=$('#productType').val();
            var nameSet=new Set();
            RecApp.frequency={};

            var productlistSelect = $('#productlistSelect');
            productlistSelect.empty();

            var producerOption = "<option value='" + null + "'disabled selected >" +"Select an option" + "</ option>"
            productlistSelect.append(producerOption);

            for (let i = 0; i <pCount; i++) {
                pInstance.ProductList(i).then(function(singleProduct) {
                    if(singleProduct[1]=="0x0000000000000000000000000000000000000000" && singleProduct[0]==pAddress && singleProduct[4]==pType){
                        console.log(singleProduct);
                        if(singleProduct[3] in RecApp.frequency){
                            RecApp.frequency[singleProduct[3]]+=1;
                        }else{
                            RecApp.frequency[singleProduct[3]]=1;
                        }
                        nameSet.add(singleProduct[3]);
                        var productlistSelect = $('#productlistSelect');
                        productlistSelect.empty();

                        function printOne(values) {
                            var productOption = "<option value='" + values + "' >" + values + "</ option>";
                            console.log(values);
                            productlistSelect.append(productOption);
                        }
                        nameSet.forEach(printOne);
                    }
                });
            }
            setTimeout(function(){
                var type=$('#productlistSelect').val();
                console.log("from loop", RecApp.frequency);
                console.log("type", type);
                 if (RecApp.frequency[type]==undefined) {
                    RecApp.QuantityAvailable=0;
                    alert("Available Stock: 0");
                 }else{
                    RecApp.QuantityAvailable=RecApp.frequency[type];
                    alert("Available Stock: "+RecApp.frequency[type]);
                 }

            }, 1000);
        })
    },

    updateCount:function () {
        var type=$('#productlistSelect').val();
        if (RecApp.frequency[type]==undefined) {
            alert("Available Stock: 0");
        }else{
            RecApp.QuantityAvailable=RecApp.frequency[type];
            alert("Available Stock: "+RecApp.frequency[type]);
        }
    }
}

$(document).ready(function(){
    $(window).on('load', function(){
        RecApp.loadAddress();
    });
});
