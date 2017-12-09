
$( '#acceuilPage' ).load( function(){
	//alert('load acceuil');
} );
$(document).on("pagecreate","#acceuilPage",function(){ // When entering pagetwo
	//alert('create acceuil');
	refreshacceuil=false;
	
	//displayPeriphInLists('#acceuilPage','#acceuilPeriphList1','#acceuilPeriphList2','#acceuilPeriphList3','#acceuilPeriphManuel','Acceuil',null,'a');
	
	if (timerinterval!=null) {clearInterval(timerinterval);}
	runboucleEtat();
	//ListenNewEtat();
	});

$(document).on("pageshow","#acceuilPage",function(){ // When entering pagetwo
	//alert('show acceuil');
	//navigator.splashscreen.hide();
	/*if (refreshacceuil) {
		$("#acceuilPage").trigger('pagecreate');
		$("#tagListPage").trigger('pagecreate');
	}*/
	
	
	    $("#pub").on('ended', function() {
	    	$("#pub").get(0).play();
	    });

	    $("#pub").on('canplay', function() {
	    	$("#pub").get(0).play();
	    });

		//navigator.splashscreen.hide();

		
		

	
});


