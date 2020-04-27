ConApp={
	QuantityAvailable:null,
    frequency:{},

	loadAddress:function() {
        $('.container').hide();
        web3.eth.getCoinbase(function(err, account){
            if(err===null){
                var acInstance;
                App.account = account;
                setTimeout(function(){
                    App.contracts.AdminContract.deployed().then(function(i){
                        acInstance = i;
                        acInstance.checkConsumer(App.account).then(function(exists){
                            if (!exists) {
                                alert("Please log in with a Consumer account to access this page");
                            }else{
                                acInstance.getConsumerName(App.account).then(function(accountName){
                                    $('.accountaddress').html("Welcome, " + accountName);
                                    $('.loader').hide();
                                    $('.container').show();
                                    ConApp.render();
                                });
                            }
                        });
                    });
                }, 500);
            }
        });
    },

    render:function (argument) {
        var acInstance;
        var pAddress;
        var pInstance;

        App.contracts.AdminContract.deployed().then(function (instance) {
            acInstance=instance;
            return acInstance.getRetailerCount();
        }).then(function (retailerCount) {
            var retailerSelect = $('#retailerSelect');
            retailerSelect.empty();
            var producerOption = "<option value='" + null + "'disabled selected >" +"Select Retailer" + "</ option>"
            retailerSelect.append(producerOption);

            for (let i = 0; i < retailerCount; i++) {
                acInstance.retailers(i).then(function (singleProducer) {
                    var name=singleProducer[2];
                    var address=singleProducer[0];
                    var producerOption = "<option value='" + address + "' >" + name + "</ option>"
                    retailerSelect.append(producerOption);
                });
            }
        });

        var pInstance;
        var pid=0;
        App.contracts.NodeContract.deployed().then(function(instance) {
            pInstance=instance;
            return pInstance.getProductCount();
        }).then(function(pCount) {
            var productList=$('#productList');
            productList.empty();

            for(let i=0;i<pCount;i++){
                pInstance.ProductList(i).then(function (singleProduct) {
                    if (App.account==singleProduct[2] && singleProduct[5]==false && singleProduct[6]==false) {
                        var id=pid;
                        var name=singleProduct[3];
                        var type=singleProduct[4];
                        var productTemplate = "<tr><td>" + id + "</td><td>" + name + "</td><td>" + type + "</td></tr>";
                        productList.append(productTemplate);
                    }
                    pid++;
                });
            }
            return pCount;
        }).then(function (pCount) {
            var rid=0;
            var returnList=$('#returnedProductList');
            returnList.empty();

            for(let i=0;i<pCount;i++){
                pInstance.ProductList(i).then(function (singleProduct) {
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
        App.contracts.NodeContract.deployed().then(function(instance) {
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
                            productlistSelect.append(productOption);
                        }
                        nameSet.forEach(printOne);
                    }
                });
            }
            setTimeout(function(){
                var type=$('#productlistSelect').val();
                 if (ConApp.frequency[type]==undefined) {
                    ConApp.QuantityAvailable=0;
                    alert("Available Stock: 0");
                 }else{
                    ConApp.QuantityAvailable=ConApp.frequency[type];
                    alert("Available Stock: "+ConApp.frequency[type]);
                 }

            }, 500);
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
                App.contracts.NodeContract.deployed().then(function (instance) {
                    pInstance=instance;
                    instance.getCostForConsumer(rAddress,productname,pType,quantity).then(function (amount) {
                        var proceed=confirm("Total Cost of product(s):"+amount+" ethers\nPress ok to continue");
                        if(proceed){
							pInstance.soldToConsumer(rAddress,productname,pType,quantity, {
								from: App.account,
								value: web3.toWei(amount, 'ether')
							}).then(function(receipt){
								if(receipt!=undefined){
									alert("Transaction successful");
									ConApp.render();
								}
							});
                        }
                    });
                });
            }
        }else{
            alert("Fill empty fields");
        }
    }
}

$(document).ready(function(){
    $(window).on('load', function(){
        ConApp.loadAddress();
    });
});
