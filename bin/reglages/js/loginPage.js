/**
 * New node file
 */
function connexionappli(){
	userlogin=$('#un').val();
	userpassword=$('#pw').val();
	
	var auth = make_base_auth(userlogin, userpassword);
	$.ajaxSetup({
    	beforeSend: function(xhr,settings) {
            xhr.setRequestHeader('Authorization', auth);
         }
	});
	getJsonObject(function(err,httpResponse,body){		
		
		if (httpResponse=="error") {
			alert("Login ou mot de passe incorrecte");
		} else {
			$.mobile.changePage( $('#accueilPage'), { transition: 'slide'});	
		}
	},'main?type=get&action=testconnection');
	
}