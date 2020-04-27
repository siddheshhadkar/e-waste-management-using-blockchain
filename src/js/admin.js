adminApp={
    idList:[],
	loadAddress:function () {
        web3.eth.getCoinbase(function(err, account){
            if(err===null){
                var acInstance;
                App.account = account;
                setTimeout(function(){
                    App.contracts.AdminContract.deployed().then(function(i){
                        acInstance = i;
                        return acInstance.owner();
                    }).then(function (adminAddress) {
                    	if(adminAddress==App.account){
                    		$('.adminaddress').html("Account Address: " + adminAddress);
                            adminApp.render();
                    	}else{
                            $('.container').hide();
                    		alert("You are not admin");
                    	}
                    })
                }, 500);
            }
        });
    },
    render:function () {

        $('#chart').hide();
        $('.list-content').hide();
        $('.form-div2').hide();
        var acInstance;
        var pAddress;

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
    },
    displayData:function () {



        var producerSelect = $('#producerSelect').val();

        if (producerSelect!=null) {

            adminApp.idList=[];
            var pInstance;
            reusedPercentages=[0];
            $('#chart').show();
            $('.list-content').show();
            $('.form-div2').show();

            var pid=0;
            var count=0;
            var sumValue=0;

            App.contracts.NodeContract.deployed().then(function (instance) {
                pInstance=instance;
                pInstance.getProductCount().then(function (productCount) {
                var productList=$('#productList');
                productList.empty();

                for (var i = 0; i < productCount; i++) {
                    pInstance.ProductList(i).then(function (singleProduct) {

                        //for table
                        if (singleProduct[5]==true && singleProduct[6]==true && singleProduct[10]==false
                            && singleProduct[0]==producerSelect && singleProduct[7]!=0) {

                            var id=pid;
                            var name=singleProduct[3];
                            var type=singleProduct[4];
                            var rPercentage=singleProduct[7];

                            count++;
                            sumValue=sumValue+parseInt(rPercentage);
                            adminApp.idList.push(id);

                            var productTemplate = "<tr><td>" + id + "</td><td>" + name + "</td><td>" + type + "</td><td>" + rPercentage + "</td></tr>";
                            productList.append(productTemplate);
                        }

                        //for graph
                        if (singleProduct[5]==true && singleProduct[6]==true &&
                            singleProduct[0]==producerSelect && singleProduct[7]!=0) {

                            var rPercentage=singleProduct[7];
                            reusedPercentages.push(parseInt(rPercentage));
                        }

                        pid++;
                    });
                }

                setTimeout(function () {
                    var productTemplate = "<tr><td>"  + "</td><td>" + "Average Percentage" + "</td><td>" + "</td><td>" + (sumValue/count) + "</td></tr>";
                    productList.append(productTemplate);
                },200);

                })
            })

            console.log("r percent",reusedPercentages);

            setTimeout(function () {
                //for graph
                var layout={
                    title:'Graph',
                    xaxis:{title:'Products',zeroline:true},
                    yaxis:{title:'Reused Percentage'}
                }


                Plotly.newPlot('chart',
                            [{
                                y:reusedPercentages,
                                type:'line'
                            }],
                            layout);
            },500);
        }else{
            alert("Select a producer");
        }
    },

    assessment:function () {
        var producerSelect = $('#producerSelect').val();
        var performanceType = $('#performanceType').val();
        var amount = $('#amount').val();

        if (performanceType=="Incentive") {
            App.contracts.NodeContract.deployed().then(function (instance) {
                instance.sendIncentives(adminApp.idList,producerSelect,{
                    from:App.account,
                    value:web3.toWei(amount,'ether')
                }).then(function (receipt) {
                    if (receipt!=undefined) {
                        alert("Transaction successful");
                        adminApp.render();
                    }
                })
            })
        }else{
            App.contracts.AdminContract.deployed().then(function (instance) {
                instance.addPenalizeAmount(amount,producerSelect).then(function (receipt) {
                    if (receipt!=undefined) {
                        App.contracts.NodeContract.deployed().then(function (instance) {
                            instance.penalizeProducer(adminApp.idList,producerSelect).then(function (receipt) {
                                if (receipt!=undefined) {
                                    alert("Transaction successful");
                                    adminApp.render();
                                }
                            })
                        })
                    }
                })
            })

        }
    }


}

$(document).ready(function(){
    $(window).on('load', function(){
        adminApp.loadAddress();
    });
});
