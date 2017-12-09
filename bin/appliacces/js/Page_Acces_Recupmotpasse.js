
$(document).on("pageshow","#Acces_Recupmotpasse_Page",function(){ // When entering pagetwo

});


function userpasswordoublie(){
	$.mobile.changePage( $('#Acces_Recupmotpasse_Page'),{transition:"slide"});
}

function senddemanderecup(){
	var inputsele=$("#Acces_Recupmotpasse_Page").find(" input");
	var info={};
	for (var i=0;i<inputsele.length;i++){
		if ($(inputsele[i])[0].id=='email' ){
			info[$(inputsele[i])[0].id]=$(inputsele[i]).val();
		}
	}
    initconnexiontype(function(){
	    getJsonObject(function(data){
	    	$.mobile.changePage( $('#loginPage'),{transition:"slide"});
		},"/index.php?action=recupmotpasse&v="+version,info);	
    })
}

