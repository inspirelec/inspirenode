   function chargeProgPage(tag,tag_id,tag_nom) {
	   
	   progtagclicked_id=tag_id;
	   progtagclicked_nom=tag_nom;
	   
	   if (tags[tag_id] && tags[tag_id].typeprog== "Reservation") {
		   $.mobile.changePage( $("#progpage2"), { transition: "slide"});
			   
	   } else {
		   $.mobile.changePage( $("#progpage"), { transition: "slide"});
	   }
	   
	   
	   
	   //$("#periphpage").trigger('pagecreate');

   };
   
   var refreshproglist=true;
   var programmantionchanged=false;
   var urlgetcateg='index.php?action=getcategories'
   var urlgetprogrammation='index.php?action=getprogrammation'
   var urlgetprogrammationalarme='index.php?action=getalarmeprog&mode='
	function chargeProgCategListPage(mode,mode_id,mode_nom) {

	   progmodeclicked_id=mode_id
	   progmodeclicked_nom=mode_nom;
	   refreshproglist=true;
	   
	   $.getJSON(serviceURL + urlgetcateg, chargecategories);
	   //$("#periphpage").trigger('pagecreate');

   };
   function chargecategories(categs){
		categories=categs;
		$.mobile.changePage( $("#proglistcategpage"), { transition: "slide"});

	}
   function chargeProgListPage(element,categ_id,categ_nom,mode_id,mode_nom) {
	   progcategclicked_id=categ_id;
	   progcategclicked_nom=categ_nom;
	   progmodeclicked_id=mode_id;
	   progmodeclicked_nom=mode_nom;
	   refreshproglist=true;
	   if (categ_id=='sonde_de_temperature') {
		  $.getJSON(serviceURL + urlgetprogrammation, chargeprogrammation);  
	   } else if (categ_id=='alarme'){
		   $.getJSON(serviceURL + urlgetprogrammationalarme+mode_id, chargealarme);  
	   }
	  
	   //$("#periphpage").trigger('pagecreate');

   };
   function chargeprogrammation(progs){
		programmations=progs;
		$.mobile.changePage( $("#proglistpage"), { transition: "slide"});

	}
   
   function chargealarme(alarmesprog){
	  // alarmes=progs;
	   alarmesprogrammation=alarmesprog;
	   $.mobile.changePage( $("#progpagealarme"), { transition: "slide"});
		//$.mobile.changePage( $("#proglistpage"), { transition: "slide"});

	}
   
   function addprog(){
	   jours={};
	   if ($('#checkLu').is(":checked")) jours.Lu=1; else jours.Lu=0;
	   if ($('#checkMa').is(":checked")) jours.Ma=1; else jours.Ma=0;
	   if ($('#checkMe').is(":checked")) jours.Me=1; else jours.Me=0;
	   if ($('#checkJe').is(":checked")) jours.Je=1; else jours.Je=0;
	   if ($('#checkVe').is(":checked")) jours.Ve=1; else jours.Ve=0;
	   if ($('#checkSa').is(":checked")) jours.Sa=1; else jours.Sa=0;
	   if ($('#checkDi').is(":checked")) jours.Di=1; else jours.Di=0;
	   
	  /* $.each(jours, function(index, jour) {
		   if (jour==true) alert(index);
	   });*/
	   //alert("� "+$('#progtimer').val());
	   //alert("pour "+$('#progvaleur').val());	
	   
	   p={};
	   p['heure']=$('#progtimer').val();
	   p['valeur']=$('#progvaleur').val();
	   p['jours']=jours;
	   
	   if (programmations['mode_'+progmodeclicked_id]==null) programmations['mode_'+progmodeclicked_id]={};
	   if (programmations['mode_'+progmodeclicked_id]['tag_'+progtagclicked_id]==null) programmations['mode_'+progmodeclicked_id]['tag_'+progtagclicked_id]={};
	   programmations['mode_'+progmodeclicked_id]['tag_'+progtagclicked_id][new Date().getTime()]=p;
	   programmantionchanged=true;
	   refreshlistprogrammation();
   }
   function addprog2(){
	   //jours={};
	   
	  /* $.each(jours, function(index, jour) {
		   if (jour==true) alert(index);
	   });*/
	   //alert("� "+$('#progtimer').val());
	   //alert("pour "+$('#progvaleur').val());	
	   
	   p={};
	   p['jours']=$('#progdate_start').val();
	   p['heures']=$('#progtimer_start').val();
	   p['joure']=$('#progdate_stop').val();
	   p['heuree']=$('#progtimer_stop').val();
	   p['valeur']=$('#progvaleur2').val();

	   
	   if (programmations['mode_'+progmodeclicked_id]==null) programmations['mode_'+progmodeclicked_id]={};
	   if (programmations['mode_'+progmodeclicked_id]['tag_'+progtagclicked_id]==null) programmations['mode_'+progmodeclicked_id]['tag_'+progtagclicked_id]={};
	   programmations['mode_'+progmodeclicked_id]['tag_'+progtagclicked_id][new Date().getTime()]=p;
	   programmantionchanged=true;
	   refreshlistprogrammation2();
   }
   function refreshlistprogrammation(){
		$('#programmationlist li').remove();
		$('#programmationlist').append('<li data-role="list-divider">Programmation</li>');
		if (programmations['mode_'+progmodeclicked_id]!=null && programmations['mode_'+progmodeclicked_id]['tag_'+progtagclicked_id]!=null){
			   for (indexp in programmations['mode_'+progmodeclicked_id]['tag_'+progtagclicked_id]){
				   p=programmations['mode_'+progmodeclicked_id]['tag_'+progtagclicked_id][indexp];
				   j=" ";
				   for (indexj in p['jours']){
					   jour=p['jours'][indexj]
					   if (jour==1) j+=' ' + indexj;
				   }

				   texte =  p['heure'] + ' -> ' +   p['valeur'] + ' ('+j+' )';
				   $('#programmationlist').append('<li><a href="#" >'+texte+'</a><a href="#" onclick="deleteprog('+indexp+');return false" data-rel="popup" data-position-to="window" data-transition="pop">delete</a></li>');				   
			   }
		}
		
	    $('#programmationlist').append('<li><a href="#" onclick="addprog();return false;">Ajouter</a></li>');
	    $('#programmationlist').listview('refresh');
	    
   }
   function refreshlistprogrammation2(){
		$('#programmationlist2 li').remove();
		$('#programmationlist2').append('<li data-role="list-divider">Programmation</li>');
		if (programmations['mode_'+progmodeclicked_id]!=null && programmations['mode_'+progmodeclicked_id]['tag_'+progtagclicked_id]!=null){
			   for (indexp in programmations['mode_'+progmodeclicked_id]['tag_'+progtagclicked_id]){
				   p=programmations['mode_'+progmodeclicked_id]['tag_'+progtagclicked_id][indexp];
				
				   texte =  p['jours'] + ' ' + p['heures'] + ' -> ' + p['joure'] + ' ' + p['heuree'] + '==' + p['valeur'] ;
				   $('#programmationlist2').append('<li><a href="#" >'+texte+'</a><a href="#" onclick="deleteprog2('+indexp+');return false" data-rel="popup" data-position-to="window" data-transition="pop">delete</a></li>');				   
			   }
		}
		
	    $('#programmationlist2').append('<li><a href="#" onclick="addprog2();return false;">Ajouter</a></li>');
	    $('#programmationlist2').listview('refresh');
	    
  }
   
   function refreshlistalarme(){
	   $("#progpagealarme").find('#alarmepopuplist li').remove();
	   htmlli='<li>';
	   	for (idalarme in alarmes){
	   		alarme=alarmes[idalarme];
	   		checktext=""
	   		if (alarmesprogrammation[idalarme]) {
	   			checktext=' checked=true ';
	   		}
	   		htmlli+='<input type="checkbox" '+checktext+'name="'+idalarme+'" id="'+idalarme+'" /><label for="'+idalarme+'" >'+alarme.nom+'</label>';
	   	}
	   	htmlli+='</li>'
   		$("#progpagealarme").find("#alarmepopuplist").append(htmlli);
   	   	$('[type="checkbox"]').checkboxradio();
	   	$("#progpagealarme").find("#alarmepopuplist").listview('refresh');
	    
  }
   function setprogalarme(){
	   ele=$("#progpagealarme");
	   test=ele.find('#alarmepopuplist li').children();
	   objset={};
	   objset['alarms']={};
	   for (var i=0;i<test.length;i=i+1){
		   dival=test[i];
	   	   uuid=$(dival).children()[1].id;
	   	   checked=$(dival).children()[1].checked;
	   	   objset['alarms'][uuid]=checked;
	   }
	   objset['mode']=progmodeclicked_id;
	   pincode=ele.find('#setpincode').val();
	   ele.find('#setpincode').val("");
   		
	   objset['pin']=calcMD5(pincode);
	   confirmPinCode( objset['pin'],function(){
		   sendAlarmeProgrammation(objset);
		   },'confirmPin','errorc');
	   
   }
   function sendAlarmeProgrammation(obj){
	   
  		data=JSON.stringify(obj);
  		var uuid=calcMD5('alarm');
		var linkOFF="index.php?action=setalarmeprog&uuid="+uuid;
		getJsonObject(function(response) {
			//alert('retour du server');
		},serviceURL + linkOFF, obj );
		//sendaction( linkOFF );
		$.mobile.back();
  }
   function deleteprog(id){
	   programmantionchanged=true;
	   delete programmations['mode_'+progmodeclicked_id]['tag_'+progtagclicked_id][id];
	   refreshlistprogrammation();
   }
   function deleteprog2(id){
	   programmantionchanged=true;
	   delete programmations['mode_'+progmodeclicked_id]['tag_'+progtagclicked_id][id];
	   refreshlistprogrammation2();
   }