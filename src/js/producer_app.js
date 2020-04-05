ProApp={
    addProduct:function () {
        var productname = $('#productname').val();
        var weightglass = $('#weightglass').val();
        var weightplastic = $('#weightplastic').val();
        var weightnickel = $('#weightnickel').val();
        var weightaluminium = $('#weightaluminium').val();
        var weightcopper = $('#weightcopper').val();
        var weightmagnesium = $('#weightmagnesium').val();
        var weightlead = $('#weightlead').val();
        var producttype = $('#producttype').val();
        var price = $('#price').val();

        if(productname!="" && weightglass!="" && weightplastic!="" && weightnickel!="" && weightaluminium!="" && weightcopper!="" && weightmagnesium!="" && weightlead!="" && price!=""){
            App.contracts.Producer.deployed().then(function (instance) {
                instance.addProduct(productname, producttype, weightaluminium, weightnickel, weightglass, weightplastic, weightcopper, weightmagnesium, weightlead, price, {from:App.account}).then(function (receipt) {
                    ProApp.render();
                })
                
            });
        }else{
            alert("Fill empty fields");
        }
    },

    loadAddress:function() {
        $('.container').hide();
        web3.eth.getCoinbase(function(err, account){
            if(err===null){
                var amInstance;
                App.account = account;
                setTimeout(function(){
                    App.contracts.AddressManager.deployed().then(function(i){
                        amInstance = i;
                        amInstance.checkProducer(App.account).then(function(exists){
                            if (!exists) {
                                alert("Please log in with a Producer account to access this page");
                            }else{
                                amInstance.getProducerName(App.account).then(function(accountName){
                                    $('#accountaddress').html("Your account name: " + accountName);
                                    $('.loader').hide();
                                    $('.container').show();
                                    ProApp.render();
                                })
                            }
                        })
                    });
                }, 500);
            }
        });
    },

    addReturnProduct:function() {
        var productid=$('#productid').val();
        var pInstance;
        if (productid!="") {
            App.contracts.Producer.deployed().then(function(instance) {
                pInstance=instance;
                pInstance.getProductCount().then(function (count) {
                    if(count<productid){
                        alert("Enter Valid Product Id");
                    }else{
                        pInstance.ProductList(productid).then(function (singleProduct) {
                            if(App.account==singleProduct[0] && singleProduct[5]==true && singleProduct[6]==false){
                                pInstance.addReturnProduct(productid).then(function (receipt) {
                                    console.log("Added to returned");
                                    ProApp.render();
                                })
                            }else{
                                alert("Enter Valid Product Id");
                            }
                        })
                    }
                })
            });
        }else{
            alert("Fill empty fields");
        }
    },

    render:function () {
        var pInstance;
        var pid=0;
        App.contracts.Producer.deployed().then(function(instance) {
            pInstance=instance;
            return pInstance.getProductCount();
        }).then(function(pCount) {
            var productList=$('#productList');
            productList.empty();

            for(let i=0;i<pCount;i++){
                pInstance.ProductList(i).then(function (singleProduct) {
                    if (App.account==singleProduct[0] && singleProduct[5]==false && singleProduct[6]==false
                        && singleProduct[1]== "0x0000000000000000000000000000000000000000") {

                        var id=pid;
                        var name=singleProduct[3];
                        var type=singleProduct[4];
                        var productTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + type + "</td></tr>";
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
                    if (App.account==singleProduct[0] && singleProduct[5]==true && singleProduct[6]==true) {
                        var id=rid;
                        var name=singleProduct[3];
                        var type=singleProduct[4];
                        var productTemplate = "<tr><td>" + id + "</td><td>" + name + "</td><td>" + type + "</td></tr>";
                        returnList.append(productTemplate);
                    }
                    rid++;
                })
            }
        })
    },
}

$(document).ready(function(){
    ProApp.loadAddress();
});
