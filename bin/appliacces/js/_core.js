/**
 * New node file
 */
var typeconnexion="local";
var userlogin="";
var userpassword="";
var refreshacceuil=true;
var lasthash="";
var timerinterval;
var lastetat={};
var lastmd5_etat="0";
var etatbusy=false;
var config={};
var version='acces.1.1.1';
var traductionactive=true;
var httprequestTimeoutms=4000
var idactuel='';
var configbytag={};
var peripheriques={};
var modes={};
var modeactuel=null;
var typeactuel=null;
var programmations={};
var categories={};
var tagsenfants={};
var tags = {};
var leveltag=0;
var users={};
var alarmes={};
var alarmesprogrammation={};
var nexthash="",lasthash="";
var historiquepage=[];



function getPage(namePage){
	$.mobile.changePage( $('#'+namePage),{transition:"slide"});
	var numberOfEntries = window.history.length;
	if (document.location.hash=='#loginPage'){
		history.replaceState(null, namePage, '#'+namePage);
	}
}
function getPageBack(){
	//alert('getBack');
	if (history.length>1 && navigator && navigator.app) {
		//alert('navigator.app.backHistory()');
	    navigator.app.backHistory();
	    
	} else if (window.history && typeof window.history.back() == 'function') {
		//alert('window.history.back()');
		window.history.back();
	} else {
		var previous = '#' + config.firstpage;
		if (historiquepage.length>1) {
			previous='#' +historiquepage[1];
			//alert('previous not take firstpage '+previous);
		}
		//alert('previous get '+previous);
		$.mobile.changePage(previous, {
		    transition: 'slide',
		    reverse: true
		});
	}
}


$( window ).hashchange(function() {
    nexthash = location.hash;
    //alert(lasthash + " => " +nexthash);
    if (nexthash=="loginPage" && (lasthash=="#startPage" || lasthash=="")){
    	if (isitdevice())
  	      if (navigator && navigator.app) {
  	          navigator.app.exitApp();
  	       }
  	       else {
  	          if (navigator && navigator.device) {
  	             navigator.device.exitApp();
  	          }
  	       }
    }
});


function connexionappli(){
	userlogin=$('#un').val();
	userpassword=$('#pw').val();
	usersavepw=$('#savepw').is(':checked');
	//alert(usersavepw);
	if (typeof device != "undefined"){
		if (usersavepw==1 || usersavepw=='1') {
				setInfoMemo('lastlogin',userlogin);
				setInfoMemo('lastpassword',userpassword);			
		} else {
				setInfoMemo('lastlogin',userlogin);
				setInfoMemo('lastpassword','');	
		}

	  setInfoMemo('savepw',usersavepw);
	}
	
	initconnexiontype(chargeAcceuil);
}

function chargeAcceuil(){
	//$('#loginPage').load('#acceuilPage');
	
	auth = make_base_auth(userlogin, userpassword);
	//alert( "user "+userlogin+" passwd "+userpassword + " =" +auth);
	$.ajaxSetup({
    	beforeSend: function(xhr,settings) {
    	   // alert('setup '+settings.url);
             xhr.setRequestHeader('Authorization', auth);
         }
	});
	getConfig(function (data){
		if (data.icon_application) {
			console.log('config',JSON.stringify(data))
			configapplication(data);
			//alert('chargeaccueil hash='+ config.firstpage);
			//$.mobile.changePage( $(config.firstpage),{transition:"slide"});
			getPage(config.firstpage);
			//configapplication(data);
			//document.location.hash = config.firstpage;
			//document.location.hash = config.firstpage;//"acceuilPage";
			//$.mobile.changePage( $('#acceuilPage'), { transition: 'slide'});		
		} else {
			$('#btnconnection').html("Erreur identification")
		}

	});
	
}


function configapplication(configdata){
	config=configdata;
	appliquetitreperso();
	
	if (config.menuonallpage==true){
		listename='.accueilmenulist'+config.menubuttoncountshow;
		index=1;
		for ( var menuname in config.menubutton) {
			menuproperty=config.menubutton[menuname];
			if (menuproperty.visible) {
				button=$(listename).find('#button'+index);
				button.attr('href',menuproperty.href);
				button.html(menuproperty.name);
				index+=1;
			}  
		}
		$(listename).show();		
	} else {
		listename='#accueilmenulist'+config.menubuttoncountshow;
		index=1;
		for ( var menuname in config.menubutton) {
			menuproperty=config.menubutton[menuname];
			if (menuproperty.visible) {
				button=$('#'+config.firstpage).find(listename).find('#button'+index);
				button.attr('href',menuproperty.href);
				button.html(menuproperty.name);
				index+=1;
			}  
		}
		$('#'+config.firstpage).find(listename).show();		
	}

	if (config.with_graphique_on_tag_page==true){
		diplayHighchartAccueil("#acceuilPage");
	}
}



$(document).on("pageshow",function(event){
	showpage=event.target.id;
	if (historiquepage.length>1 && historiquepage[1]==showpage){
		historiquepage.shift(); /*retour a la page precedente*/
	} else {
		historiquepage.unshift(showpage); /*insert la nouvelle page*/
	}
	//alert(JSON.stringify(historiquepage));
	/*try {
		if (isitdevice() /*&& device && device.platform=='iOS')	{
		*/	//$('[data-rel="back"]').attr('href','#'+config.firstpage);
		$('[data-rel="back"]').attr('onclick','getPageBack();return false;');
		//alert('setonclick on btn back');
		/*}
	} catch (e) {
		// TODO: handle exception
	}*/
	appliquetitreperso();
	$(document).trigger('resize');	
	$( '[data-role="page"]' ).i18n();
});

function appliquetitreperso(){
	icon="";
	if (config.icon_application) {
		icon='<img id="icon" style="vertical-align:bottom;" src="'+imagesURL+config.icon_application.path+'" height="'+config.icon_application.height+'" width="'+config.icon_application.width+'"/>';
	}
	if (config.icon_application || config.titre_application) {
		if ($('#'+showpage).find('#icon').attr('src')!=imagesURL+config.icon_application.path){
			$('#'+showpage).find('#titre').html(icon+" "+config.titre_application.name);
			$('#'+showpage).find('#titre').css('font-size',config.titre_application.size+'px')
						
		}

	}
	$(document).trigger('resize');	
}