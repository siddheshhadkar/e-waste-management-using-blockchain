RecApp={
    QuantityAvailable:null,
    frequency:{},
    returnProductIDs: new Set(),

    loadAddress:function (argument) {
        $('.container').hide();
        web3.eth.getCoinbase(function(err, account){
            if(err===null){
                var acInstance;
                App.account = account;
                setTimeout(function(){
                    App.contracts.AdminContract.deployed().then(function(i){
                        acInstance = i;
                        acInstance.checkRetailer(App.account).then(function(exists){
                            if (!exists) {
                                alert("Please log in with a Retailer account to access this page");
                            }else{
                                acInstance.getRetailerName(App.account).then(function(accountName){
                                    $('.accountaddress').html("Welcome, " + accountName);
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
        var acInstance;
        var pAddress;
        var pInstance;

        App.contracts.AdminContract.deployed().then(function (instance) {
            acInstance=instance;
            return acInstance.getProducerCount();
        }).then(function (producerCount) {
            var producerSelect = $('#producerSelect');
            producerSelect.empty();
            var producerOption = "<option value='" + null + "'disabled selected >" +"Select Producer" + "</ option>"
            producerSelect.append(producerOption);

            for (let i = 0; i < producerCount; i++) {
                acInstance.producers(i).then(function (singleProducer) {
                    var name=singleProducer[2];
                    var address=singleProducer[0];
                    var producerOption = "<option value='" + address + "' >" + name + "</ option>"
                    producerSelect.append(producerOption);
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
                    if (App.account==singleProduct[1] && singleProduct[5]==false && singleProduct[6]==false
                        && singleProduct[2]== "0x0000000000000000000000000000000000000000") {
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
            var flag = false;

            for(let i=0;i<pCount;i++){
                pInstance.ProductList(i).then(function (singleProduct) {
                    if (App.account==singleProduct[1] && singleProduct[5]==true && singleProduct[6]==false) {
                        if (flag == false) {
                            returnList.empty();
                            $('#returnProductsButton').show();
                            flag = true;
                        }
                        var id=rid;
                        RecApp.returnProductIDs.add(id);    //used set to avoid duplication because render is called multiple times
                        var name=singleProduct[3];
                        var type=singleProduct[4];
                        var productTemplate = "<tr><td>" + id + "</td><td>" + name + "</td><td>" + type + "</td></tr>";
                        returnList.append(productTemplate);
                    }
                    rid++;
                });
            }
        });
    },

    buyProduct:function () {
        var pAddress=$('#producerSelect').val();
        var pType=$('#productType').val();
        var productname = $('#productlistSelect').val();
        var quantity = $('#quantity').val();
        var pInstance;

        if (pAddress!=null && pType!=null && productlistSelect!=null && quantity!="") {
            if(quantity>RecApp.QuantityAvailable || quantity==0){
                alert("Enter Valid Quantity");
            }else{
                App.contracts.NodeContract.deployed().then(function (instance) {
                    pInstance=instance;
                    pInstance.getCostForRetailer(pAddress,productname,pType,quantity).then(function (amount) {
                        var proceed=confirm("Total Cost of product(s):"+amount+" ethers\nPress ok to continue");
                        if(proceed) {
                            pInstance.soldToRetailer(pAddress,productname,pType,quantity, {
                                from:App.account,
                                value:web3.toWei(amount, 'ether')
                            }).then(function(receipt){
                                if (receipt!=undefined) {
                                    alert("Transaction successful");
                                    RecApp.render();
                                }
                            });
                        }else{
                            alert("User cancelled transaction");
                        }
                    });
                });
            }
        }else{
            alert("Fill empty fields");
        }
    },

    updateProducer:function() {
        var pAddress;
        var pInstance;
        App.contracts.NodeContract.deployed().then(function(instance) {
            pInstance=instance;
            return pInstance.getProductCount();
        }).then(function (pCount) {
            var pAddress=$('#producerSelect').val();
            var pType=$('#productType').val();
            // var pName=$('#productlistSelect').val();
            var nameSet=new Set();
            RecApp.frequency={};

            var productlistSelect = $('#productlistSelect');
            productlistSelect.empty();

            var producerOption = "<option value='" + null + "'disabled selected >" +"Select an option" + "</ option>"
            productlistSelect.append(producerOption);

            for (let i = 0; i <pCount; i++) {
                pInstance.ProductList(i).then(function(singleProduct) {
                    if(singleProduct[1]=="0x0000000000000000000000000000000000000000" && singleProduct[0]==pAddress && singleProduct[4]==pType){
                        if(singleProduct[3] in RecApp.frequency){
                            RecApp.frequency[singleProduct[3]]+=1;
                        }else{
                            RecApp.frequency[singleProduct[3]]=1;
                        }
                        nameSet.add(singleProduct[3]);
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
               var pName=$('#productlistSelect').val();
                    if (RecApp.frequency[pName]==undefined) {
                        RecApp.QuantityAvailable=0;
                        alert("Available Stock: 0");
                            // TODO: field showinng available stock wherever applicable instead of alert
                    }else{
                        RecApp.QuantityAvailable=RecApp.frequency[pName];
                        alert("Available Stock: "+RecApp.frequency[pName]);
                    }
            }, 1000);
        });
    },

    updateCount:function () {
        var type=$('#productlistSelect').val();
        if (RecApp.frequency[type]==undefined) {
            alert("Available Stock: 0");
            // TODO: field showinng available stock wherever applicable instead of alert
        }else{
            RecApp.QuantityAvailable=RecApp.frequency[type];
            alert("Available Stock: "+RecApp.frequency[type]);
        }
    },

    addReturnProduct:function() {
        var productid=$('#productid').val();
        var percent=$('#percent').val();
        var pInstance;
        if (productid!="") {
            App.contracts.NodeContract.deployed().then(function(instance) {
                pInstance=instance;
                pInstance.getProductCount().then(function (count) {
                    if(count<productid){
                       alert("Enter Valid Product Id");
                    }
                    else{
                        pInstance.ProductList(productid).then(function (singleProduct) {
                            if(App.account==singleProduct[1] && singleProduct[5]==false && singleProduct[6]==false && singleProduct[2]!="0x0000000000000000000000000000000000000000"){
                                var amount=(singleProduct[8]*percent)/100;
                                pInstance.addReturnProductToRetailer(productid, singleProduct[2], percent, {
                                    from: App.account,
                                    value: web3.toWei(amount, 'ether')
                                }).then(function(receipt){
                                    if (receipt!=undefined) {
                                        alert("Transaction successful");
                                        RecApp.render();
                                    }
                                })
                            }else{
                                alert("Enter Valid Product Id");
                            }
                        });
                    }
                });
            });
        }else{
            alert("Fill empty fields");
        }
    },

    returnToProducer: function(){
        App.contracts.NodeContract.deployed().then(function(instance){
            var ncInstance = instance;
            var ids = [];
            RecApp.returnProductIDs.forEach((item) => {
                ids.push(item);
            });
            instance.addReturnProducts(ids).then(function(){
                RecApp.returnProductIDs.clear();
                RecApp.render();
            });
        });
    }
}

$(document).ready(function(){
    $(window).on('load', function(){
        RecApp.loadAddress();
    });
});
