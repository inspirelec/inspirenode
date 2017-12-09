/**
 * New node file
 */
$(document).on("pageshow","#reponsePage",function(){ // When entering pagetwo
	
	$("#reponsePage").find("#content").html('<pre>'+reponse_action_encours+'</pre>');
	$("#reponsePage").trigger('create');

});
