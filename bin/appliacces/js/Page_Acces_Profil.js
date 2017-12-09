
$(document).on("pageshow","#Acces_Profil_Page",function(){ // When entering pagetwo
	combocpville();
	
	if (usertype!='CREATION' && usertype!='CREATIONADMIN'){
		refreshInfoProfil();	
	}
	if (usertype=='ADMINISTRATEUR') {
		$("#Acces_Profil_Page").find(".adminprofil").show();
		$("#Acces_Profil_Page").find(".adminprofilreadonly").find(' INPUT').prop('disabled', false);
	} else if (usertype=='CLIENT' || usertype=='SERVICE') {
		$("#Acces_Profil_Page").find(".adminprofil").hide();
		$("#Acces_Profil_Page").find(".adminprofilreadonly").find(' INPUT').prop('disabled', true);
	} else if (usertype=='CREATIONADMIN') {		
		$("#Acces_Profil_Page").find(".adminprofil").show();
		$("#Acces_Profil_Page").find(".adminprofilreadonly").find(' INPUT').prop('disabled', false);
	} else {
		$("#Acces_Profil_Page").find(".adminprofil").hide();
		$("#Acces_Profil_Page").find(".adminprofilreadonly").hide();
	}
});

function getRandomIntInclusive(min, max) {
	return Math.floor(Math.random() * (max - min +1)) + min;
}
function getnewcodeacces(){
	return getRandomIntInclusive(10000,99999);
}

function creationcompteuseradmin(){
	usertype='CREATIONADMIN';
	$.mobile.changePage( $('#Acces_Profil_Page'),{transition:"slide"});
	updateinfosprofil({id:"",uuid:"",nom:"",prenom:"",ville:"",adresse1:"",adresse2:"",
		             siret:"",societe:"",telephone:"",telephone_portable:"",email:"",password:"",
		             codeacces:getnewcodeacces(),badge_numero:"",badge_abonnement_date_fin:"",type:"CLIENT"})
}

function creationcompteuser(){
	usertype='CREATION';
	$.mobile.changePage( $('#Acces_Profil_Page'),{transition:"slide"});
	updateinfosprofil({id:"",uuid:"",nom:"",prenom:"",ville:"",adresse1:"",adresse2:"",
        siret:"",societe:"",telephone:"",telephone_portable:"",email:"",password:""})
}

function sendprofil(){
	var inputsele=$("#Acces_Profil_Page").find(" input");
	var infosprofil={};
	var profilvalid=true;
	var focusset;
	var infoctrlpk={};
	for (var i=0;i<inputsele.length;i++){
		if ($(inputsele[i])[0].id=='email' || $(inputsele[i])[0].id=='siret' || $(inputsele[i])[0].id=='id'){
			infoctrlpk[$(inputsele[i])[0].id]=$(inputsele[i]).val();
		}
		if ($(inputsele[i])[0].checkValidity() ){
			$(inputsele[i]).css('box-shadow','none');
			if ($(inputsele[i])[0].id && $(inputsele[i])[0].id!=""){
				infosprofil[$(inputsele[i])[0].id]=$(inputsele[i]).val();
			}
			
		}else {
			$(inputsele[i]).css('box-shadow','0 0 1px 1px red');
			profilvalid=false;
			if (!focusset) {
				focusset=true;
				$(inputsele[i])[0].focus();
			}
		}
	}
	var pwd1=$("#Acces_Profil_Page").find("#password")[0];
	var pwd2=$("#Acces_Profil_Page").find("#passwordconfirm")[0];
	infosprofil['type']=$("#Acces_Profil_Page").find("#type").val();
	
    if(pwd1.value != "" && pwd1.value == pwd2.value) {
        if(pwd1.value.length < 6) {
        	profilvalid=alertpassword("Le mot de passe doit contenir 6 caractères minimum!",pwd1,pwd2,false,profilvalid);
        }
        re = /[0-9]/;
        if(!re.test(pwd1.value)) {
        	profilvalid=alertpassword("Le mot de passe doit contenir des chiffres (0-9)!",pwd1,pwd2,false,profilvalid);
        }
        re = /[a-z]/;
        if(!re.test(pwd1.value)) {
        	profilvalid=alertpassword("Le mot de passe doit contenir des minuscules (a-z)!",pwd1,pwd2,false,profilvalid);
        }
        re = /[A-Z]/;
        if(!re.test(pwd1.value)) {
        	profilvalid=alertpassword("Le mot de passe doit contenir des majuscules (A-Z)!",pwd1,pwd2,false,profilvalid);
        }
      } else {
    	  profilvalid=alertpassword("Veuillez entrer un mot de passe et le confirmer!",pwd1,pwd2,false,profilvalid);
      }
    initconnexiontype(function(){
	    getJsonObject(function(data){
	    	if (data.email!='OK' && profilvalid){
	    		alert(data.email);
				profilvalid=false;
				$("#Acces_Profil_Page").find("#email").css('box-shadow','0 0 1px 1px red');
	    	}
	    	if (data.siret!='OK' && profilvalid){
	    		alert(data.siret);
	    		$("#Acces_Profil_Page").find("#siret").css('box-shadow','0 0 1px 1px red');
				profilvalid=false;
	    	}
	    	
	    	if (profilvalid){
	    		var url='/index.php?action=';
	    		
	    		if (usertype=='CREATION' || usertype=='CREATIONADMIN'){
	    			url+='createuser&v='+version;
	    		} else {
	    			url+='setinfouser&uuid='+infosprofil.uuid+'&id='+infosprofil.id+'&v='+version;
	    		}
	    		
	    		
	    			getJsonObject(function(data){
	    				if (data && data.msg=="Mise à jour réalisée"){
	    					if (usertype!='CREATIONADMIN' && usertype!='CREATION' && (!userselect || userselect=='' ) ){
	    						userpassword=infosprofil.password;
	    					}
	    					$.mobile.changePage( $('#Acces_Resa_Page'),{transition:"slide",reverse:true});
	    				} else if (data && data.res=='CREER'){
	    					$.mobile.changePage( $('#Acces_validcreationuser_Page'),{transition:"slide"});
	    				}
	    			},url,infosprofil);			
	    		
	    	}
		},"/index.php?action=controleinfouser&v="+version,infoctrlpk);	
    })
}
function alertpassword(message,ele1,ele2,validbool,profilvalid){
	if (!validbool){
		$(ele1).css('box-shadow','0 0 1px 1px red');
		$(ele2).css('box-shadow','0 0 1px 1px red');
		if (profilvalid) alert(message);
		$(ele1)[0].focus();
	} else {
		$(ele1).css('box-shadow','none');
		$(ele2).css('box-shadow','none');
	}
	return validbool;
}
function updateinfosprofil(data){
	
	for (var d in data){
		try {
			$("#Acces_Profil_Page").find("#"+d).val(data[d]);
			if (d=='password') {
				$("#Acces_Profil_Page").find("#"+d+"confirm").val(data[d]);
			}
			if ($("#Acces_Profil_Page").find("#"+d)[0] && 
					$("#Acces_Profil_Page").find("#"+d)[0].tagName=='SELECT'){
				$('select').selectmenu("refresh",true);
			}
		} catch(err){
			console.log('updateinfosprofil_error',JSON.stringify(data),JSON.stringify(err));
		}
		
	}
}

function refreshInfoProfil(callback){
	var url='/index.php?action=infoProfil&v='+version;
	getJsonObject(function(data){
		updateinfosprofil(data);
		if (callback) callback(data);}
	,url);
	
}
function combocpville(){
	  $( "#ville" ).autocomplete({
	      source: function( request, response ) {
	    	  if (request.term.length>=1) {
		          $.ajax({
		            url: "/index.php?action=listcpville&v="+version,
		            dataType: "json",
		            data: {
		              q: request.term
		            },
		            success: function( data ) {
		              response( data );
		            }
		          });		    		  
	    	  }

	        },
	        minLength: 1,
	        select: function( event, ui ) {
	        	//userselect=ui.item.id;
	        	//setuserselect(userselect,refreshall);
	        }
	  });

}
