
   function changeEtat(element,val,iconMin,iconMax,iconMiddle,fromserver) {
	   
	   //$(element).find("#uuid").html($(element).attr('id'));
	   ele=$(element).attr('id')+"";
	   uuid=ele.substring(1, 99);/*eneleve la lettre de prefixe*/
	   //alert(uuid+ " bin " +val);
	   //alert(' element='+uuid );
	   pp=peripheriques[uuid];
	   //alert(imagesURL+iconMax);
       if (val==0 || (!fromserver && ($(element).find("#icon").attr('src') == imagesURL+iconMax || $(element).find("#icon").attr('src') == imagesURL+iconMiddle))) 
       {
    	   if (fromserver) {
    		//   $(element).find("#icon").attr('src',serviceURL+iconMin);
    		//   alert(val +" fromserver");
    	
    		   $(element).find("#icon").attr('src',imagesURL+iconMin);
    		//   alert(val +" frompress");
    	   		$(element).find("#slider").val('0');
    	   		$(element).find("#slider").slider('refresh');
    	   }
    	   if (pp!=null) {
	    	   var linkOFF="index.php?action=setetat&valeur="+pp.ecriture_min_value+"&cmd=OFF&uuid="+uuid;
	    	   
	    	   if (!fromserver) {
	    		   sendaction( linkOFF );
	    		  
	    	   }    		   
    	   }

    	   //$(element).find("#etat").html('eteint');
    	   
       }
       else if (val>0 || (!fromserver && ($(element).find("#icon").attr('src') == imagesURL+iconMin)))
       {   
    	   //alert(' etat='+val + '   '+$(element).find("#icon").attr('src'));
    	   if (fromserver) {
    		   $(element).find("#icon").attr('src',imagesURL+iconMax);
	    	   $(element).find("#slider").val('100');
	    	   $(element).find("#slider").slider('refresh');
	    	   //$("#slider"+periph.uuid).slider('refresh'); 
    	   }
    	   if (pp!=null) {
    		   var linkON="index.php?action=setetat&valeur="+pp.ecriture_max_value+"&cmd=ON&uuid="+uuid;
    		   if (!fromserver) sendaction( linkON );
    	   }
    	   //$(element).find("#etat").html('allum�');
       }

   };
   
   function chargeCameraPage(ip){
	   cameraURL=serviceURL+'command_externe/cam/getcam.php?ip='+ip
	   
	   $.mobile.changePage( $('#camerapage'), { transition: 'slide'});
   }
   
   function affiche_error(errorbox,texte){
	   
	   	    $("#"+errorbox).find("#errorlist li").remove();
	    	htmlli='<li>';
	    	htmlli+='<label>'+texte+'</label>';
	    	
	    	htmlli+='</li>'
	    	$("#"+errorbox).find("#errorlist").append(htmlli);
	    	
	    	$( "#"+errorbox ).popup( "open" ,{ shadow: false ,positionTo : "window"} );

	    	$("#"+errorbox).find("#errorlist").listview('refresh');
   }
   function changerCodePin(prefixe){
	   $( '#'+prefixe+'popupMenu' ).popup( 'close');
	   setTimeout(function(){
		   			$( "#"+'CodePinpopupMenu'+prefixe ).popup( "open" ,{ shadow: false ,positionTo : "window"} );
			},200);
	  
   }
   
   function updatecodepin(element,errorbox){
	   $( '#'+element ).popup( 'close');
	   setTimeout(
	     function(){
		   pincode=calcMD5($( '#'+element ).find('#pincodeactuel').val());
		   pinnew1=calcMD5($( '#'+element ).find('#pincodenew1').val());
		   pinnew2=calcMD5($( '#'+element ).find('#pincodenew2').val());
		   if ($( '#'+element ).find('#pincodenew1').val()=="" || $( '#'+element ).find('#pincodenew2').val()=="" ){
			   affiche_error(errorbox,'Veuillez saisir 2 fois le nouveau mot de passe');
		   } else if (pinnew1!= pinnew2 ){
			   affiche_error(errorbox,'Les 2 saisies doivent etre identique');
		   } else {
			   
			   confirmPinCode(pincode,function(){
				    obj={};
				    obj['uuid']=calcMD5('alarm');
				    obj['pin']=pincode;
				    obj['pina']=pinnew1;
				   
			   		data=JSON.stringify(obj);
					var linkOFF="index.php?action=setalarmecode&valeur="+data;
					setTimeout(sendaction( linkOFF ),10);
			   },'confirmPin',errorbox);			   
		   }

		},200);
   }
   function changeAlarme(element,val,iconMin,iconMax,iconMiddle,fromserver) {
	   //$(element).find("#uuid").html($(element).attr('id'));
	   ele=$(element).attr('id')+"";
	   uuid=null;
	   pp=null;
	   if (element.substring(0, 6)=='alarme') {
		   afficheBoxchangealarme(element,alarmes);
	   } else {
		   uuid=ele.substring(1, 99);/*eneleve la lettre de prefixe*/
		   pp=peripheriques[uuid];		   
	   }

	   
	    if (!fromserver) {

	    } else {
	    	//$(element).find("#etat").html(val);
	    	updateEtatAlarm(element,val,iconMin,iconMax,iconMiddle,fromserver,null,null);
	    }
   };
   
   function afficheBoxchangealarme(element,alarms){
	   	    $("#alarmepopupMenua").find("#alarmepopuplist li").remove();
	    	$("#alarmepopupMenub").find("#alarmepopuplist li").remove();
	    	htmlli='<li>';
	    	for (idalarme in alarms){
	    		alarme=alarmes[idalarme];
	    		checktext=""
	    		if (alarms[idalarme]['etat']!='0') {
	    			checktext=' checked=true ';
	    		}
	    		htmlli+='<input type="checkbox" '+checktext+'name="'+idalarme+'" id="'+idalarme+'" /><label for="'+idalarme+'" >'+alarme.nom+'</label>';
	    	}
	    	htmlli+='</li>'
	    	$("#"+element).find("#alarmepopuplist").append(htmlli);
	    	
	    	//$( "#alarmepopupMenua" ).popup( "open" ,{ shadow: false ,positionTo : "window"} );
	    	$( "#"+element ).popup( "open" ,{ shadow: false ,positionTo : "window"} );
	    	$('[type="checkbox"]').checkboxradio();
	    	$("#"+element).find("#alarmepopuplist").listview('refresh');
	    	//$( "#alarmepopupMenua" ).find("#setpincode").numeric();
	    	
   }
   
   function validactionalarme(element,errorbox){
	   ele=$('#'+element);
	   test=ele.find('#alarmepopuplist li').children();
	   objset={};
	   objset['alarms']={};
	   for (var i=0;i<test.length;i=i+1){
		   dival=test[i];
	   	   uuid=$(dival).children()[1].id;
	   	   checked=$(dival).children()[1].checked;
	   	   objset['alarms'][uuid]=checked;
	   }
	   pincode=ele.find('#setpincode').val();
   	   $('#'+element).find('#setpincode').val("");
   		
	   objset['pin']=calcMD5(pincode);
	   confirmPinCode( objset['pin'],function(){
		   sendAlarmeValidation(objset);
		   },'confirmPin',errorbox);

   }
   
   function confirmPinCode(pinMD5,callbackfunction,action,errorbox){
	   //pincode=prompt("Code PIN","0000");
	   //var pinMD5=calcMD5(pincode+'_'+uuid);
	   var uuid=calcMD5('alarm');
	   var urljsonaction='index.php?action='+action+'&uuid='+uuid+'&pin='+pinMD5; 
	   
	   $.getJSON(serviceURL + urljsonaction,function(data){
		   if (data.res=='OK') {
			   callbackfunction();
		   } else {
			   affiche_error(errorbox,'Code PIN');
		   }
	   });
   }
   
   function sendAlarmeValidation(obj){
   		var uuid=calcMD5('alarm');
		var linkOFF="index.php?action=setalarme&uuid="+uuid;
		getJsonObject(function(response) {
			//alert('retour du server');
		},serviceURL + linkOFF, obj );
   }
   
   function updateEtatAlarm(element,val,iconMin,iconMax,iconMiddle,fromserver,pp,pincode) {

	       /*if (val==0 || (!fromserver && ($(element).find("#icon").attr('src') == serviceURL+iconMax))) 
	       {*/
		   nbinfo =0;
	   		ele=$(element).attr('id');
	   		if (typeof ele !='undefined'){
		   		uuid=ele.substring(1, 99);
		    	alarmes[uuid]['etat']=val;
		    	$(element).find("#etat").html(val);	   	
		    	
		    	
		 	   
			   ligneinfos=$(element).parent().find("h6")
			   for (var i=0;i<ligneinfos.length ;i++){
				   info=$(ligneinfos[i]);
				   uuid=info.attr('id').substring(1,99);
				   if (alarmes[uuid]['etat']==1){
					   nbinfo++;
				   }
				   /*
				   if (typeof info.style != "undefined" && typeof info.id != "undefined"){
					   disp=info.style['display'];
					   if(disp==""){
						   nbinfo++;
					   }			   
				   }*/

			   }
	   		}
	   		if (nbinfo>0){
	   			$(element).parent().parent().find("#icon").attr('src',imagesURL+iconMax);
	   		} else {
	   			$(element).parent().parent().find("#icon").attr('src',imagesURL+iconMin);
	   		}
	    	/*   if (pp!=null) {
		    	   var linkOFF="index.php?action=setetat&valeur="+pp.ecriture_min_value+"&cmd=OFF&uuid="+pp.uuid+"&pin="+pincode;
		    	   if (!fromserver) {
		    		   sendaction( linkOFF );
		    	   }    		   
	    	   }
	       }
	       else 
	       {   
	    	   $(element).find("#etat").html(val);
	    	   if (pp!=null) {
	    		   var linkON="index.php?action=setetat&valeur="+pp.ecriture_max_value+"&cmd=ON&uuid="+pp.uuid+"&pin="+pincode;
	    		   if (!fromserver) sendaction( linkON );
	    	   }
	       }	*/	   
   }
   
   
   function changeEtatVariable(element,sVal,iconMin,iconMax,iconMiddle,fromserver) {
	   //alert(element.attr('id') + ' = ' + val);
	   //$(element).find("#uuid").html($(element).attr('id'));
	   ele=$(element).attr('id')+"";
	   uuid=ele.substring(1, 99);/*eneleve la lettre de prefixe*/
	   pp=peripheriques[uuid];
	   //alert(uuid+ " var " +sVal);
	   valbasse=9;
	   valhaute=91;
	   valmax=99;
	   valmin=0;	
	   if (pp) {
		   valbasse=(pp.ecriture_min_value*1+(pp.ecriture_max_value/10));
		   valhaute=(pp.ecriture_max_value*1-(pp.ecriture_max_value/10));
		   valmax=pp.ecriture_max_value*1;
		   valmin=pp.ecriture_min_value*1;		   
	   }
       var linkOFF="index.php?action=setetat&valeur="+sVal+"&cmd=DIM&uuid="+uuid;
       if (!fromserver) sendaction( linkOFF );
	   if(sVal > valbasse && sVal < valhaute) {
		   if (fromserver) $(element).find("#icon").attr('src',imagesURL+iconMiddle);

	   }
	   if(sVal <= valbasse) {
		   if (fromserver) $(element).find("#icon").attr('src',imagesURL+iconMin);
    	   //var linkOFF="index.php?action=setetat&valeur="+sVal+"&cmd=OFF&uuid="+uuid;
    	   //if (!fromserver) sendaction( linkOFF );
	    }
	   if(sVal >= valhaute) {
		   if (fromserver) $(element).find("#icon").attr('src',imagesURL+iconMax);
    	   //var linkON="index.php?action=setetat&valeur="+sVal+"&cmd=ON&uuid="+uuid;
    	   //if (!fromserver) sendaction( linkON );
	   }
	   if (fromserver==true){
		   $(element).find("#slider").val(sVal);
		   $(element).find("#slider").slider('refresh');
	   }

   };
   
   function changeInfoExpr(element,etat,mode,fromserver) {
	   
	   //$(element).find("#uuid").html($(element).attr('id'));
	   if (etat!=null && etat['expression']!=null){
		   if (etat['expression']['etat']!=null) {
			   $(element).find("#etat").html(etat['expression']['etat']);
		   }
		   if (etat['expression']['expr1']!=null) {
			   $(element).find("#expr1").html(etat['expression']['expr1']);
		   }
		   if (etat['expression']['expr1_unit']!=null) {
			   $(element).find("#expr1_unit").html(etat['expression']['expr1_unit']);
		   }
		   if (etat['expression']['expr2']!=null) {
			   $(element).find("#expr2").html(etat['expression']['expr2']);
		   }
		   if (etat['expression']['expr3']!=null) {
			   $(element).find("#expr3").html(etat['expression']['expr3']);
		   }
		   if (mode!=null) {
			   $(element).find("#mode").html(mode);
		   }
		   
	   }

   };
   function changeInfos(element,etat) {
	   var nbinfo=0;
	   var lignetexte="";
	   if (etat['expression'] && etat['expression']['etat'] && typeof(etat['expression']['etat'])=="Object"){
		   for(var propertyName in etat['expression']['etat']) {
			   if (lignetexte!="") lignetexte+="</br>";
			   lignetexte+=etat['expression']['etat'][propertyName];
			   nbinfo++;
			}
	   }
	   if (nbinfo==0) {
		   $(element).parent().parent().hide();
	   } else {
		   $(element).parent().parent().show();
	   }
   };
   function changeInfoBatterie(element,etat) {
	   
	   //$(element).find("#uuid").html($(element).attr('id'));
	   if (etat!=null && etat['expression']!=null){
		   if (etat['expression']['etat']!=null) {
			   //if (etat['expression']['etat']+0<60) {
				   $(element).show();
				   $(element).find("#etat").html(etat['expression']['etat']);				   
			   //} else {
				   
			   //}
		   } else {
			   $(element).hide();
		   }
	   }
	   test=$(element).parent().find("h6");
	   nbinfo =0;
	   ligneinfos=$(element).parent().find("h6")
	   for (idinfo in ligneinfos){
		   info=ligneinfos[idinfo];
		   
		   if (typeof info.style != "undefined" && typeof info.id != "undefined"){
			   disp=info.style['display'];
			   if(disp==""){
				   nbinfo++;
			   }			   
		   }

	   }
	   if (nbinfo==0) {
		   $(element).parent().parent().hide();
	   } else {
		   $(element).parent().parent().show();
	   }
	   p=1;
	   
   };
   function changeEtatVolet(element,etat,fromserver) {
	   
	   //$(element).find("#uuid").html($(element).attr('id'));
	   ele=$(element).attr('id')+"";
	   uuid=ele.substring(1, 99);/*eneleve la lettre de prefixe*/
	   //alert(' element='+uuid );
	   pp=peripheriques[uuid];
	   if (pp!=null) {
		   if (etat['expression']!= null) {
			   eta=etat['expression']['etat'];
		   } else {
			   eta=null;
		   }
		   
	       if (etat=='UP' || eta*1>=pp.ecriture_max_value*0.9) 
	       {
	    	   eta=pp.ecriture_max_value;
	    	   var linkOFF="index.php?action=setetat&valeur="+eta+"&cmd=UP&uuid="+uuid;
	    	   
	    	   if (!fromserver) sendaction( linkOFF );
	    	   if (fromserver) $(element).find("#icon").attr('src',imagesURL+pp.categorie.iconMax);
	    	   if (fromserver==true){
	    		   $(element).find("#slider").val(eta);
	    		   $(element).find("#slider").slider('refresh');
	    	   }
	    	   //$(element).find("#etat").html('eteint');
	    	   
	       }
	       else if (etat=='STOP' || (eta*1<pp.ecriture_max_value*0.9 && eta*1>pp.ecriture_min_value+pp.ecriture_max_value*0.1) )
	       {
	    	   if (eta==null) eta=(pp.ecriture_min_value+pp.ecriture_max_value)/2;
	    	   var linkOFF="index.php?action=setetat&valeur="+eta+"&cmd=STOP&uuid="+uuid;
	    	   
	    	   if (!fromserver) sendaction( linkOFF );
	    	   if (fromserver) $(element).find("#icon").attr('src',imagesURL+pp.categorie.iconMidle);
	    	   if (fromserver==true){
	    		   $(element).find("#slider").val(eta);
	    		   $(element).find("#slider").slider('refresh');
	    	   }
	    	   //$(element).find("#etat").html('eteint');
	    	   
	       }
	       else if (etat=='DOWN'  || eta*1<=pp.ecriture_min_value+pp.ecriture_max_value*0.1) 
	       {
	    	   eta=pp.ecriture_min_value;
	    	   var linkOFF="index.php?action=setetat&valeur="+eta+"&cmd=DOWN&uuid="+uuid;
	    	   
	    	   if (!fromserver) sendaction( linkOFF );
	    	   if (fromserver) $(element).find("#icon").attr('src',imagesURL+pp.categorie.iconMin);
	    	   if (fromserver==true){
	    		   $(element).find("#slider").val(eta);
	    		   $(element).find("#slider").slider('refresh');
	    	   }
	    	   //$(element).find("#etat").html('eteint');
	    	   
	       } else {
	    	   //var linkOFF="index.php?action=setetat&valeur="+val+"&cmd=DIM&uuid="+uuid;
	    	   
	    	   //if (!fromserver) sendaction( linkOFF );
	       }		   
	   }

   };
   
  
  var timeraction={};
  
  function waitAndSendAction(uuid,urlaction,time){
  	if (timeraction[uuid]!=null ) {
  		clearTimeout(timeraction[uuid]);
  	}
    timeraction[uuid]=setTimeout(function () {
     	sendaction( urlaction ); 
     	timeraction[uuid]=null;}
     ,time)
   	
  }
   
   
   function changeEtatConsigne(element,val,fromserver) {
	   
	   //$(element).find("#uuid").html($(element).attr('id'));
	   ele=$(element).attr('id')+"";
	   uuid=ele.substring(1, 99);/*eneleve la lettre de prefixe*/
	   //alert(' element='+uuid );

		   if (typeactuel=='Manuel') {
			   changeEtatType();
		   }  
	       if (val=='up' ) 
	       {
	    	   var valeur=parseFloat($(element).find("#etat").html());
	    	   valeur+=0.5;
	    	   var linkOFF="index.php?action=setetat&valeur="+valeur+"&cmd=DIM&uuid="+uuid;
	    	   
	    	   if (!fromserver) waitAndSendAction(uuid,linkOFF,2000);//sendaction( linkOFF );
	    	   $(element).find("#etat").html(valeur); 
	       }
	       else if (val=='down' ) 
	       {
	    	   var valeur=parseFloat($(element).find("#etat").html());
	    	   valeur-=0.5;
	    	   var linkOFF="index.php?action=setetat&valeur="+valeur+"&cmd=DIM&uuid="+uuid;
	    	   
	    	   if (!fromserver) waitAndSendAction(uuid,linkOFF,2000);//sendaction( linkOFF );
	    	   /*if (fromserver)*/ 
	    	   $(element).find("#etat").html(valeur); 
	    	   
	       } 		   
	   

       
   };
   function changeEtatMode(mod){
	   var linkOFF="index.php?action=setetat&mode="+encodeURI(mod);
	   if (typeactuel=='Manuel') {
		   changeEtatType();
	   }  
	   
	   sendaction( linkOFF );
	   
	   controleifalarmchange(mod);
   }   
   function controleifalarmchange(mod){
	   var uuid=calcMD5('alarm');
	   var urljsonaction='index.php?action=confirmpinifchangemode&mode='+mod; 
	   
	   $.getJSON(serviceURL + urljsonaction,function(data){
		   if (data.nbdiff>0) {
				for(var modename in modes) {
					m=modes[modename];
					indexp=modename;
					texte =  m['nom'] ;	
					if (mod==texte){
						afficheBoxchangealarme('alarmepopupMenua',data[indexp]);
					}
				}
			   //affiche_error("errora",'Box de validation code PIN car changement alarme');
			   
		   } else {
			   //affiche_error("errora",'Pas de changement d alarme');
		   }
	   });
   }
   
   function changeEtatType(){
	   var linkOFF="index.php?action=setetat&type=";
	   if (typeactuel=='Manuel') {
		   linkOFF+=encodeURI('Auto');
	   } else {
		   linkOFF+=encodeURI('Manuel');
	   }
	   
	   sendaction( linkOFF );
   }   

   function changeEtatModeDifferecomeback(mod,prefixeid){
	   var linkOFF="index.php?action=setetat&mode="+encodeURI(mod);
	   sendaction( linkOFF );
	   differemodeid=modeactuel;
	   if (typeactuel=='Manuel') {
		   changeEtatType();
	   }  
	   setTimeout(function(){
		   $( "#differemodepopupMenu"+prefixeid  ).find("#titre").html('Passer en '+modes[differemodeid].nom);
		   $( "#differemodepopupMenu"+prefixeid ).popup( "open" ,{ shadow: false ,positionTo : "window"} );
	   },100);
   }
   function affichersuracceuil(periph_uuid,bool){
	   var linkOFF="index.php?action=setacceuil&uuid="+periph_uuid+"&bool="+bool;
	   sendaction( linkOFF ,function(){
		   delete peripheriques[periph_uuid];
		   delete configbytag['Acceuil'];
		   refreshacceuil=true;
		   if (bool==0) {
			   $("#acceuilPage").trigger('pagecreate');   
		   }		   
	   });

	  
	   //alert('Cette modification sera prise en compte au prochain chargement de l\'application')
	   
   }
   
   function changeInfoTemp(element,etat,mode,fromserver,type) {
	   ele=$(element).attr('id')+"";
	   uuid=ele.substring(1, 99);/*eneleve la lettre de prefixe*/
	   //$(element).find("#uuid").html($(element).attr('id'));
	   if (fromserver && uuid!= null && timeraction[uuid]!=null) {
		   /*reception de consigne alors qu'on a cliquez sur + ou - depuis*/
	   } else {
		   if (etat!=null && etat['expression']!=null){
			   
			   var consignepriseencompte=true;
			   var chaudiereenroute=false;
				$.each(etat['expression'], function(indexexpr, expr) {
					if (indexexpr.substring(0,11)=='etatactuelv'){
						if (etat['expression']['etat']!=expr) consignepriseencompte=false;
					}
					if (indexexpr.substring(0,11)=='etatactuelc'){
						if (expr=='1') chaudiereenroute=true;
					}
				});
				 
				 
				/*if (consignepriseencompte==false) {
					$(element).find("#etat").css('color','rgb(0, 0, 255)');
				} else */
				if (etat['expression']['etat2']=='O') {
					$(element).find("#etat").css('color','rgb(255, 17, 17)');
				} else {
					/*$(element).find("#etat").css('color','rgb(255, 255,255)');*/
				}
				if (chaudiereenroute==true) {
					$(element).find("#etat").css('text-decoration','underline');
				}  else {
					$(element).find("#etat").css('text-decoration','none');
				}			
			   if (etat['expression']['etat']!=null) {
				   //$(element).find("#etat").fadeOut('fast');
				   $(element).find("#etat").html(etat['expression']['etat']);
				   if (typeactuel=='Manuel') {
					   $(element).find("#etat").css('text-decoration','line-through');
				   } 
				   $(element).find("#etat").fadeIn('fast');
				   
			
			   }
			   if (etat['expression']['expr1']!=null) {
				   $(element).find("#expr1").html(etat['expression']['expr1']);
			   }
			   if (etat['expression']['expr1_unit']!=null) {
				   $(element).find("#expr1_unit").html(etat['expression']['expr1_unit']);
			   }
			   if (etat['expression']['expr2']!=null) {
				   $(element).find("#expr2").html(etat['expression']['expr2']);
			   }
			   if (etat['expression']['expr3']!=null) {
				   $(element).find("#expr3").html(etat['expression']['expr3']);
			   }
			   if (mode!=null) {
				   $(element).find("#mode").html(mode);
				   if (type=='Manuel') {
					  $(element).find("#mode").css('text-decoration','line-through'); 
				   }  else {
					   $(element).find("#mode").css('text-decoration','none');
				   }
			   }
			   if (type!=null) {
				   if (type=='Manuel') {
					 $(element).find("#auto_manueltext").html('Auto\/<u>Manuel</u>');  
					 $("#acceuilPeriphManuel li").show();
					 $("#PeriphManuel li").show();
				   } else {
					 $(element).find("#auto_manueltext").html('<u>Auto</u>\/Manuel');
					 $("#acceuilPeriphManuel li").hide();
					 $("#PeriphManuel li").hide();
				   }   
			   }
	
			  
		   }
	   }
   };
   
   function changeEtatPlayer(element,val,fromserver) {
	   
	   //$(element).find("#uuid").html($(element).attr('id'));
	   ele=$(element).attr('id')+"";
	   uuid=ele.substring(1, 99);/*eneleve la lettre de prefixe*/
       
	   if (val=='UP' ) 
       {
    	   var linkOFF="index.php?action=setetat&valeur=100&cmd=UP&uuid="+uuid;
    	   
    	   if (!fromserver) sendaction( linkOFF );
    	   //$(element).find("#etat").html('eteint');
    	   
       }
       else if (val=='ONOFF' || val=='PLAYING' || val=='STOPPED' ) 
       {
    	  if ((!fromserver && $(element).find("#iconplay").attr('src') == imagesURL+'images/play.png') || val=='PLAYING'){
    	   var linkOFF="index.php?action=setetat&valeur=1&cmd=ON&uuid="+uuid;
    	   $(element).find("#iconplay").attr('src',imagesURL+'images/stop.png');
    	   if (!fromserver) sendaction( linkOFF );
    	   sendspeedrefresh=true;
    	   //$(element).find("#etat").html('eteint');    		  
    	  } else if ((!fromserver && $(element).find("#iconplay").attr('src') == imagesURL+'images/stop.png') || val=='STOPPED'){
       	   var linkOFF="index.php?action=setetat&valeur=0&cmd=OFF&uuid="+uuid;
    	   $(element).find("#iconplay").attr('src',imagesURL+'images/play.png');
    	   if (!fromserver) sendaction( linkOFF );
    	   sendspeedrefresh=false;
    	   //$(element).find("#etat").html('eteint');    	   		  
    	  }

    	   
       }
       else if (val=='DOWN' ) 
       {
    	  
    	   var linkOFF="index.php?action=setetat&valeur=0&cmd=DOWN&uuid="+uuid;
    	   
    	   if (!fromserver) sendaction( linkOFF );
    	   //$(element).find("#etat").html('eteint');
    	   
       } else {
    	   var linkOFF="index.php?action=setetat&valeur="+val+"&cmd=DIM&uuid="+uuid;
    	   
    	   if (!fromserver) sendaction( linkOFF );
       }

   };
   

   function popupalarme(prefixedid,periphuuid){
		$("#"+prefixedid+"popuplist li").remove();
		$("#"+prefixedid+"popuplist").append('<li data-role="divider" >Menu</li>');
		$("#"+prefixedid+"popuplist").append('<li data-icon="false"><a  href="#" onclick="changerCodePin(\''+prefixedid+'\');$( \'#'+prefixedid+'popupMenu\' ).popup( \'close\');">Changer le code PIN</a></li>');
		
		$( "#"+prefixedid+"popupMenu" ).popup( "close");
		$("#"+prefixedid+"popuplist").listview('refresh');
		$( "#"+prefixedid+"popupMenu" ).popup( "open" ,{ shadow: false ,positionTo : "window"} );
  }
   function popupmenuacceuil(prefixedid,periphuuid){
		$("#"+prefixedid+"popuplist li").remove();
		$("#"+prefixedid+"popuplist").append('<li data-role="divider" >Menu</li>');
		$("#"+prefixedid+"popuplist").append('<li data-icon="false"><a href="#" onclick="$( \'#'+prefixedid+'popupMenu\' ).popup( \'close\');affichersuracceuil(\''+periphuuid+'\',1);">Ajouter sur l\'accueil</a></li>');
		$("#"+prefixedid+"popuplist").append('<li data-icon="false"><a href="#" onclick="$( \'#'+prefixedid+'popupMenu\' ).popup( \'close\');affichersuracceuil(\''+periphuuid+'\',0);">Enlever de l\'accueil</a></li>');
		
		$( "#"+prefixedid+"popupMenu" ).popup( "close");
		$("#"+prefixedid+"popuplist").listview('refresh');
		$( "#"+prefixedid+"popupMenu" ).popup( "open" ,{ shadow: false ,positionTo : "window"} );
   }
   function popupmenumode(prefixedid){
		$("#"+prefixedid+"popuplist li").remove();
		
		$("#"+prefixedid+"popuplist").append('<li data-role="divider" >Modes</li>');
		$.each(modes, function(index, mode) {
			$("#"+prefixedid+"popuplist").append('<li><a href="#" onclick="$( \'#'+prefixedid+'popupMenu\' ).popup( \'close\');changeEtatMode(\''+mode.nom+'\');">'+mode.nom+'</a><a href="#" onclick="$( \'#'+prefixedid+'popupMenu\' ).popup( \'close\');changeEtatModeDifferecomeback(\''+mode.nom+'\',\''+prefixedid+'\');">'+mode.nom+'</a></li>');
		});		
		$( "#"+prefixedid+"popupMenu" ).popup( "close");
		$("#"+prefixedid+"popuplist").listview('refresh');
		$( "#"+prefixedid+"popupMenu" ).popup( "open" ,{ shadow: false ,positionTo : "window"} );
	
  }
   
   function sendaction(url,callback){
	   //alert(url);
	   //$("#debug").html("envoi "+url);
	   setTimeout(
			   function (){
				   $.get( serviceURL+url+'&v='+version,null,
						   function (){ 
						   	i=0;
						   	if(callback) callback();
						   	//$("#debug").html("termine "+url);
						   } );
			   }
	   ,0);
   }