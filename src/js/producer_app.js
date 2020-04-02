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

        if(productname!="" && weightglass!="" && weightplastic!="" && weightnickel!=""
                && weightaluminium!="" && weightcopper!="" && weightmagnesium!="" && weightlead!="" && price!=""){


            App.contracts.Producer.deployed().then(function (instance) {
                    console.log(App.account);

                    instance.addProduct(productname,producttype,weightaluminium,weightnickel,
                    weightglass,weightplastic
                    ,weightcopper,weightmagnesium,weightlead,price,{from:App.account});
                    // alert("Product Added");
                    // console.log("Product Added");

            });

        }else{
            alert("Fill empty fields");
        }

    },

    loadAddress:function (argument) {
        web3.eth.getCoinbase(function(err, account){
            if(err===null){
                App.account = account;
                $('#accountaddress').html("Your account address: " + App.account);
                $('.mainbox').hide();
                    setTimeout(function(){
                    $('.mainbox').show();
                    ProApp.render();
                }, 1000);
            }
        });

    },
    addReturnProduct:function () {
        var productid=$('#productid').val();
        var pInstance;
        if (productid!="") {

            App.contracts.Producer.deployed().then(function (instance) {
                pInstance=instance;
                pInstance.ProductList(productid).then(function (singleProduct) {
                    if(App.account==singleProduct[0] && singleProduct[5]==true && singleProduct[6]==false){
                        pInstance.addReturnProduct(productid);
                        console.log("Added to returned")
                    }else{
                        alert("Enter Valid Product Id");
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
        App.contracts.Producer.deployed().then(function (instance) {
            pInstance=instance;
            return pInstance.getProductCount();
        }).then(function (pCount) {
            var productList=$('#productList');
            productList.empty();

            console.log(pCount);
            // pCount=pCount.s;
            // console.log(pCount);

            for(var i=0;i<pCount;i++){
                pInstance.ProductList(i).then(function (singleProduct) {
                    if (App.account==singleProduct[0] && singleProduct[5]==false && singleProduct[6]==false
                        && singleProduct[1]== "0x0000000000000000000000000000000000000000") {
                        var id=pid;
                        // console.log(singleProduct);
                        var name=singleProduct[3];
                        var type=singleProduct[4];

                        console.log(id,name,type);

                        var productTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + type + "</td></tr>";
                        productList.append(productTemplate);
                        console.log(pCount);
                    }

                    pid++;

                })
            }
            return pCount;
        }).then(function (pCount) {
            var rid=0;
            var returnList=$('#returnedProductList');
            returnList.empty();

            for(var i=0;i<pCount;i++){
                pInstance.ProductList(i).then(function (singleProduct) {
                    if (App.account==singleProduct[0] && singleProduct[5]==true && singleProduct[6]==true) {
                        var id=pid;
                        var name=singleProduct[3];
                        var type=singleProduct[4];

                        // console.log(id,name,type);

                        var productTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + type + "</td></tr>";
                        productList.append(productTemplate);
                    }
                    rid++;
                })
            }
        })
    },
}


$(document).ready(function(){
    $(window).on('load', function(){
        ProApp.loadAddress();
    });
});
