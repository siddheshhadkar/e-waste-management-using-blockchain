ConApp={
	QuantityAvailable:null,
    frequency:{},

	loadAddress:function() {
        $('.container').hide();
        web3.eth.getCoinbase(function(err, account){
            if(err===null){
                var amInstance;
                App.account = account;
                setTimeout(function(){
                    App.contracts.AddressManager.deployed().then(function(i){
                        amInstance = i;
                        amInstance.checkConsumer(App.account).then(function(exists){
                            if (!exists) {
                                alert("Please log in with a Producer account to access this page");
                            }else{
                                amInstance.getConsumerName(App.account).then(function(accountName){
                                    $('#accountaddress').html("Your account name: " + accountName);
                                    $('.loader').hide();
                                    $('.container').show();
                                    ConApp.render();
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
            return amInstance.getRetailerCount();
        }).then(function (retailerCount) {
            var retailerSelect = $('#retailerSelect');
            retailerSelect.empty();
            var producerOption = "<option value='" + null + "'disabled selected >" +"Select Producer" + "</ option>"
            retailerSelect.append(producerOption);

            for (let i = 0; i < retailerCount; i++) {
                amInstance.retailers(i).then(function (singleProducer) {

                    var name=singleProducer[2];
                    var address=singleProducer[0];
                    var producerOption = "<option value='" + address + "' >" + name + "</ option>"
                    retailerSelect.append(producerOption);
                })
            }
        });

        var pInstance;
        var pid=0;
        App.contracts.Producer.deployed().then(function(instance) {
            pInstance=instance;
            return pInstance.getProductCount();
        }).then(function(pCount) {
            var productList=$('#productList');
            productList.empty();

            for(let i=0;i<pCount;i++){
            	// console.log("product",singleProduct);
                pInstance.ProductList(i).then(function (singleProduct) {
                    // console.log("product",singleProduct);
                    if (App.account==singleProduct[2] && singleProduct[5]==false && singleProduct[6]==false) {
                        console.log(singleProduct,"inside");

                        var id=pid;
                        var name=singleProduct[3];
                        var type=singleProduct[4];

                        console.log(id,name,type);

                        var productTemplate = "<tr><td>" + id + "</td><td>" + name + "</td><td>" + type + "</td></tr>";
                        productList.append(productTemplate);
                    }
                    pid++;
                })
            }
            return pCount;
        }).then(function (pCount) {
            var rid=0;
            var returnList=$('#returnedProductList');
            returnList.empty();

            for(let i=0;i<pCount;i++){
                
                pInstance.ProductList(i).then(function (singleProduct) {
                    console.log("product",singleProduct);
                    if (App.account==singleProduct[2] && singleProduct[5]==true) {
                        var id=rid;
                        var name=singleProduct[3];
                        var type=singleProduct[4];
                        var productTemplate = "<tr><td>" + id + "</td><td>" + name + "</td><td>" + type + "</td></tr>";
                        returnList.append(productTemplate);
                    }
                    rid++;
                })
            }
        });


    },

    updateRetailer:function() {
        var pAddress;
        var pInstance;
        App.contracts.Producer.deployed().then(function(instance) {
            pInstance=instance;
            return pInstance.getProductCount();
        }).then(function (pCount) {
            var rAddress=$('#retailerSelect').val();
            var pType=$('#productType').val();
            var nameSet=new Set();
            ConApp.frequency={};

            var productlistSelect = $('#productlistSelect');
            productlistSelect.empty();

            var producerOption = "<option value='" + null + "'disabled selected >" +"Select an option" + "</ option>"
            productlistSelect.append(producerOption);

            for (let i = 0; i <pCount; i++) {
                pInstance.ProductList(i).then(function(singleProduct) {
                    if(singleProduct[2]=="0x0000000000000000000000000000000000000000" && singleProduct[1]==rAddress && singleProduct[4]==pType){
                        console.log(singleProduct);
                        if(singleProduct[3] in ConApp.frequency){
                            ConApp.frequency[singleProduct[3]]+=1;
                        }else{
                            ConApp.frequency[singleProduct[3]]=1;
                        }
                        nameSet.add(singleProduct[3]);
                        var productlistSelect = $('#productlistSelect');
                        productlistSelect.empty();

                        function printOne(values) {
                            var productOption = "<option value='" + values + "' >" + values + "</ option>";
                            // console.log(values);
                            productlistSelect.append(productOption);
                        }
                        nameSet.forEach(printOne);
                    }
                });
            }
            setTimeout(function(){
                var type=$('#productlistSelect').val();
                // console.log("from loop", ConApp.frequency);
                // console.log("type", type);
                 if (ConApp.frequency[type]==undefined) {
                    ConApp.QuantityAvailable=0;
                    alert("Available Stock: 0");
                 }else{
                    ConApp.QuantityAvailable=ConApp.frequency[type];
                    alert("Available Stock: "+ConApp.frequency[type]);
                 }

            }, 1000);
        })
    },

    updateCount:function () {
        var type=$('#productlistSelect').val();
        if (ConApp.frequency[type]==undefined) {
            alert("Available Stock: 0");
        }else{
            ConApp.QuantityAvailable=ConApp.frequency[type];
            alert("Available Stock: "+ConApp.frequency[type]);
        }
    },

    buyProduct:function () {
        var rAddress=$('#retailerSelect').val();
        var pType=$('#productType').val();
        var productname = $('#productlistSelect').val();
        var quantity = $('#quantity').val();
        var pInstance;

        if (rAddress!=null && pType!=null&& productlistSelect!=null && quantity!="") {
            if(quantity>ConApp.QuantityAvailable || quantity==0){
                alert("Enter Valid Quantity");
            }else{
                // alert("Fine");
                App.contracts.Producer.deployed().then(function (instance) {
                    pInstance=instance;
                    instance.soldToConsumer(rAddress,productname,pType,quantity).then(function (receipt) {
                        return instance.cost();
                    }).then(function (amount) {
                        console.log(amount);
                        web3.eth.sendTransaction({
                            to:rAddress,
                            from:App.account,
                            value:web3.toWei(amount,'ether')
                        },function (error,result) {
                            if (!error) {
                                alert("Transaction successful");
                                ConApp.render();
                            }else{
                                alert("Transaction Failed");
                            }
                        })
                    })
                })

            }
        }else{
            alert("Fill empty fields");
        }
    },

}

$(document).ready(function(){
    $(window).on('load', function(){
        ConApp.loadAddress();
    });
});