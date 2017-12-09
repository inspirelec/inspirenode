/**
 * New node file
 */
var type_element_encours="";
var id_element_encours="";
var reponse_action_encours="";

$(document).on("pageshow","#accueilPage",function(){ // When entering pagetwo
	
//});
//$(document).on("pagecreate","#accueilPage",function(){ // When entering pagetwo
	

	getJsonObject(function(err,httpResponse,body){
		$("#accueilPage").find("#containerG li").remove();
		$("#accueilPage").find("#containerD li").remove();
		
		var objs=(body.responseJSON);
		var buttons = objs;
		var coteGauche=true;
		for (var i = 0; i < buttons.length; i++) {
			var button = buttons[i];
			var list;
			if (coteGauche) {
				coteGauche=false;
				list =$("#accueilPage").find("#containerD");
			} else {
				coteGauche=true;
				list =$("#accueilPage").find("#containerG");
			}
			functionOnclick='onclick="chargeList(this,\''+button.action+'\');return false;"';
			list.append('<li data-icon="false"><a href="#" id="'+button.id+'" '+functionOnclick+'>' +
					'<p style="text-align:center"><img src="'+button.image+'" align="middle" height="40" width="40"/></p>' +
					'<h4 align="center">'+button.titre+'</h4></li>');
		}
	
		
		$("#accueilPage").find("#containerD").listview('refresh');
		$("#accueilPage").find("#containerG").listview('refresh');
		$("#accueilPage").trigger('create');
		
		/*$("#accueilPage").find("#containerD, #containerG" ).sortable({
	        connectWith: ".connectedSortable"
	      })*/
	      
		},'main?type=get&action=getaccueilmenu');
});



function chargeList(element,action){
	//$('#loginPage').load('#acceuilPage');
	type_element_encours=action;
	$.mobile.changePage( $('#listPage'), { transition: 'slide'});
}