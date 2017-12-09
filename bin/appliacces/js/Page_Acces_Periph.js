var tag_clicked_indus=null;

$(document).on("pagecreate","#Acces_Periph_Page",function(){ // When entering pagetwo
	runboucleEtat();
	
	});
$(document).on("pageshow","#Acces_Periph_Page",function(){ // When entering pagetwo
	displayPeriphInLists('#Acces_Periph_Page','#AccesPeriphList1','#AccesPeriphList2','#AccesPeriphList3','#AccesPeriphManuel',null,tag_clicked_indus,'a');
	
	});

function chargeIndusPeriphPage(element,tag_uuid) {
	   
	    tag_clicked_indus=tag_uuid;
	   
	    $.mobile.changePage( $("#Acces_Periph_Page"), { transition: "slide"});
	    document.location.hash = "#Acces_Periph_Page";
};