

$(document).on("pagecreate","#Acces_Resa_Page",function(){ // When entering pagetwo
	setuserselect('',function(){
		refreshSallesCombo();
		refreshInfoUser(null,function(infos){
			console.log(JSON.stringify(infos));
			usertype=infos.type;
			comboclient();
		});		
	});
	init();
	
});
$( window ).resize(updateButtonCalendar);



function updateButtonCalendar(){
	 var largeur=$( window ).width();
     if (largeur<400){
    	 $('#calendar').fullCalendar( 'changeView','agendaDay' )
    	 $('.fc-prev-button').html('<');
    	 $('.fc-next-button').html('>');
    	 $('.fc-today-button').html('O');
    	 $('.fc-agendaWeek-button').hide();
    	 $('.fc-agendatwoDay-button').hide();
    	 $('.fc-agendaDay-button').css('J');
    	 $('#label_salles').hide();
     } else if (largeur<940){
    	 $('#calendar').fullCalendar( 'changeView', 'agendatwoDay' )
    	 $('.fc-prev-button').html('<');
    	 $('.fc-next-button').html('>');
    	 $('.fc-today-button').html('O');
    	 $('.fc-agendaWeek-button').hide();
    	 $('.fc-agendatwoDay-button').show();
    	 $('.fc-agendatwoDay-button').html('2J');
    	 $('.fc-agendaDay-button').html('J');
    	 $('#label_salles').hide();
     } else {
    	 $('#calendar').fullCalendar( 'changeView', 'agendaWeek' );
    	 $('.fc-agendatwoDay-button').show();
    	 $('.fc-agendaWeek-button').show();
    	 $('.fc-prev-button').html('Précédent');
    	 $('.fc-next-button').html('Suivant');
    	 $('.fc-today-button').html("Aujourd'hui");
    	 $('.fc-agendatwoDay-button').html('Semaine');
    	 $('.fc-agendatwoDay-button').html('2 Jours');
    	 $('.fc-agendaDay-button').html('Jour');
    	 $('#label_salles').show();
     }
}

$(document).on("pageshow","#Acces_Resa_Page",function(){ // When entering pagetwo
	if (usertype=='ADMINISTRATEUR') {
		$("#Acces_Resa_Page").find(".adminprofil").show();
	} else if (usertype=='CLIENT' || usertype=='SERVICE') {
		$("#Acces_Resa_Page").find(".adminprofil").hide();
	} else if (!usertype){
			refreshInfoUser(null,function(infos){
				usertype=infos.type;
				if (usertype=='ADMINISTRATEUR') {
					$("#Acces_Resa_Page").find(".adminprofil").show();
				} else if (usertype=='CLIENT'  || usertype=='SERVICE') {
					$("#Acces_Resa_Page").find(".adminprofil").hide();
				}
			});	
	}
	renderCalendar();
	refreshInfoEvent();
	refreshInfoUser(null,function(infos){
		//usertype=infos.type;
		if (infos.afficheaide=="1") {
			$(" .afficheaide").prop('checked',true);
		} else {
			$(" .afficheaide").prop('checked',false);
		}
		
		if (infos.afficheaide!=true){
			setTimeout(function(){
				$("#didact").fadeIn(1000);
				$(window).trigger('resize');
				
			},500)			
		}

	});		
	setTimeout(updateButtonCalendar,1000);
	setTimeout(updateButtonCalendar,4000);
	init();
	$(" .afficheaide").on('change',function() {
	    getJsonObject(updatePanier,'/index.php?action=setAfficheAide&v='+version,{afficheaide:this.checked});
	    $(" .afficheaide").prop('checked', this.checked);
	});
});
$(window).on('resize', function(){
	if (document.location.hash=='#Acces_Resa_Page'){
		placeAideInfo();
	}

});


function placeAideInfo(){

	//$("#didact").show();
	combosalletop=$("#Acces_Resa_Page").find("#Salle").position().top;
	combosalleleft=$("#Acces_Resa_Page").find("#Salle").position().left;
	combosallewidth=$("#Acces_Resa_Page").find("#Salle").width();
	combosalleheight=$("#Acces_Resa_Page").find("#Salle").height();


	calendartop=$("#Acces_Resa_Page").find("#calendar").position().top;
	calendarleft=$("#Acces_Resa_Page").find("#calendar").position().left;
	calendarwidth=$("#Acces_Resa_Page").find("#calendar").width();
	calendarheight=$("#Acces_Resa_Page").find("#calendar").height();
	
	pagewidth=$("#Acces_Resa_Page").width();
	pageheight=$("#Acces_Resa_Page").height();
	
	$("#didact").find('#aide1').offset(
			{ 	top: combosalletop+78, 
				left: combosalleleft+combosallewidth/2-50});
	
	$("#didact").find('#aide2').offset(
			{ 	left: calendarleft+calendarwidth/2-100, 
				top:calendartop-10});
	
	$("#didact").find('#aide3').offset(
			{ 	top: calendartop+calendarheight/3, 
				left: calendarleft+calendarwidth/4});
	
	//$("#didact").find('#aide4').animate({left: "200px", top: "100px"});
	$("#didact").find('#aide4').offset(
			{ 	top: calendartop+calendarheight/1.5, 
				left: calendarleft+10});
}

var currentLangCode = 'fr';
var usertype;
var userselect;
var clientcharge;

function touchHandler(event) {
	// alert(event.type);
    var touch = event.changedTouches[0];
   

    var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent({
        touchstart: "mousedown",
        touchmove: "mousemove",
        touchend: "mouseup"
    }[event.type], true, true, window, 1,
        touch.screenX, touch.screenY,
        touch.clientX, touch.clientY, false,
        false, false, false, 0, null);

    touch.target.dispatchEvent(simulatedEvent);
    var limitleft=$('#calendar').position().left;
    var limittop=$('#calendar').position().top;
    if ($.mobile.activePage.attr('id')=='Acces_Resa_Page' && touch.screenX>limitleft+60 && touch.screenY>limittop && event.type=='touchmove'){
    	event.preventDefault();
    }    
    
    /*alert(JSON.stringify(event));
    if ($(touch.target).is("input") || $(touch.target).is("textarea")) {
        event.stopPropagation();
    } else {
        event.preventDefault();
    }*/
}

function changeTypeResa(type){
	/*type =resa_mensuelle , resa_hebdo ,resa_horaire*/
	switch (type) {
	case 'resa_mensuelle':
    	$('#calendar').fadeOut(50);
    	$('#div_resa_semaine').fadeOut(50);
    	var url='/index.php?action=getMoisDispo&v='+version;
    	getJsonObject(function(data){
    		
    		var htmlselect="";
    		for (var s in data){
    			var mois=data[s];
    			if (mois.reste>0){
    				htmlselect+='<option start="'+mois.start+'" end="'+mois.end+'" value="'+mois.descriptif+'">'+mois.descriptif+ ' -- '+mois.title+'</option>';
    			}
    		}
    		
    		$("#Acces_Resa_Page").find("#select_mois").html(htmlselect);
    		$("#Acces_Resa_Page").find("#select_mois").selectmenu("refresh", true);
    		$('#div_resa_mois').fadeIn();
    	},url);
    	$("#Acces_Resa_Page").find("#resa_type").val('resa_mensuelle');
		$("#Acces_Resa_Page").find("#resa_type").selectmenu('refresh');
		
		break;
	case 'resa_hebdo':
		$('#calendar').fadeOut(50);
    	$('#div_resa_mois').fadeOut(50);
    	var url='/index.php?action=getSemaineDispo&v='+version;
    	getJsonObject(function(data){
    		
    		var htmlselect="";
    		for (var s in data){
    			var semaine=data[s];
    			if (semaine.reste>0){
    				htmlselect+='<option start="'+semaine.start+'" end="'+semaine.end+'" value="'+semaine.descriptif+'">'+semaine.descriptif+ ' -- '+semaine.title+'</option>';
    			}
    		}
    		
    		$("#Acces_Resa_Page").find("#select_semaine").html(htmlselect);
    		$("#Acces_Resa_Page").find("#select_semaine").selectmenu("refresh", true);
    		$('#div_resa_semaine').fadeIn();
    	},url);
		
    	$("#Acces_Resa_Page").find("#resa_type").val('resa_hebdo');
		$("#Acces_Resa_Page").find("#resa_type").selectmenu('refresh');
		break;
	case 'resa_horaire':
		$('#div_resa_mois').fadeOut(50);
    	$('#div_resa_semaine').fadeOut(50);
    	$('#calendar').fullCalendar( 'refetchEvents' );
    	$('#calendar').fadeIn();
    	$("#Acces_Resa_Page").find("#resa_type").val('resa_horaire');
		$("#Acces_Resa_Page").find("#resa_type").selectmenu('refresh');
    	break;
	default:
		break;
	
	}
	
}

function init() {
//	alert('init')
	//$('#calendar').bind('touchstart touchmove touchend touchcancel',touchHandler);
	
	/*$(document).on("touchstart","#calendar",touchHandler);
	$(document).on("touchmove","#calendar",touchHandler);
	$(document).on("touchend","#calendar",touchHandler);
	$(document).on("touchcancel","#calendar",touchHandler);*/
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);
    $("#Acces_Resa_Page").find("#resa_type").bind( "change", function(event, ui) {
    	var test=this;
        if ($(this).val()=='resa_mensuelle' ) {
        	
        	var salle=getSalle();
        	if (salle && salle.type=='all'){
        		$('#Salle-button').css('box-shadow','0 0 2px 2px red');
        		$('#Salle-button')[0].focus();
        		$("#Acces_Resa_Page").find("#resa_type").val('resa_horaire');
        		$("#Acces_Resa_Page").find("#resa_type").selectmenu('refresh');

        	} else {
        		
        		changeTypeResa('resa_mensuelle');
        	}
        } else if ($(this).val()=='resa_hebdo' ) {
        	var salle=getSalle();
        	if (salle && salle.type=='all'){
        		$('#Salle-button').css('box-shadow','0 0 2px 2px red');
        		$('#Salle-button')[0].focus();
        		$("#Acces_Resa_Page").find("#resa_type").val('resa_horaire');
        		$("#Acces_Resa_Page").find("#resa_type").selectmenu('refresh');

        	} else {
        		
        		changeTypeResa('resa_hebdo');
        	}
        } else {
        	changeTypeResa('resa_horaire');
        	
        }    
    });
  /*  $("#Acces_Resa_Page").find("input[name='resa_type']").bind( "change", function(event, ui) {
    	var test=this;
        if ($(this).attr("id")=='resa_mensuelle' && $("#Acces_Resa_Page").find("#resa_mensuelle:checked").val() == 'Mois') {
        	
        	var salle=getSalle();
        	if (salle && salle.type=='all'){
        		$('#Salle-button').css('box-shadow','0 0 2px 2px red');
        		$('#Salle-button')[0].focus();
        	} else {
        		
        		changeTypeResa('resa_mensuelle');
        	}
        } else if ($(this).attr("id")=='resa_hebdo' &&  $("#Acces_Resa_Page").find("#resa_hebdo:checked").val() == 'Semaine') {
        	var salle=getSalle();
        	if (salle && salle.type=='all'){
        		$('#Salle-button').css('box-shadow','0 0 2px 2px red');
        		$('#Salle-button')[0].focus();
        	} else {
        		
        		changeTypeResa('resa_hebdo');
        	}
        } else {
        	changeTypeResa('resa_horaire');
        	
        }        	
    });*/
}



function getpaiement(callback){
	var url='/index.php?action=getpaiement&v='+version;
	getJsonObject(function(data){
		refreshall();
		if (data.link) {
			window.location.href = data.link;
			//window.open('/appliacces/main.html','_blank'/*,'height=700, width=900, toolbar=no, menubar=no,scrollbars=no, resizable=yes, location=no, directories=no, status=no'*/);
		}
	},url)
	
}

function add_resasemaine(){
	
	var salle=getSalle();
	if (salle && salle.type=='all'){
		$('#Salle-button').css('box-shadow','0 0 2px 2px red');
		$('#Salle-button')[0].focus();
	} else {
		$('#Salle-button').css('box-shadow','none');
		var eventData;
		if (salle && salle.type!='all' && $("#select_semaine option:selected" ).val()) {
			eventData = {
				title: $("#select_semaine option:selected" ).val(),
				start: $("#select_semaine option:selected" ).attr('start'),
				end: $("#select_semaine option:selected" ).attr('end'),
				editable:false,
				salle:salle,
				clientid:clientcharge,
				//color: '#aaff55',
				uuid:generateUUID()/*,
				constraint: 'availableForMeeting'*/
			};
			addEvent(eventData,function(){changeTypeResa('resa_horaire');$('#calendar').fullCalendar( 'gotoDate', eventData.start );});
		}
	}

		
}
function add_resamois(){
	var salle=getSalle();
	if (salle && salle.type=='all'){
		$('#Salle-button').css('box-shadow','0 0 2px 2px red');
		$('#Salle-button')[0].focus();
	} else {
		$('#Salle-button').css('box-shadow','none');
		var eventData;
		if (salle && salle.type!='all' && $("#select_mois option:selected" ).val()) {
			eventData = {
				title: $("#select_mois option:selected" ).val(),
				start: $("#select_mois option:selected" ).attr('start'),
				end: $("#select_mois option:selected" ).attr('end'),
				editable:false,
				salle:salle,
				clientid:clientcharge,
				//color: '#aaff55',
				uuid:generateUUID()/*,
				constraint: 'availableForMeeting'*/
			};
			addEvent(eventData,function(){changeTypeResa('resa_horaire');$('#calendar').fullCalendar( 'gotoDate', eventData.start );});
		}
	}
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

function comboclient(){
	console.log('combos',usertype);
	if (usertype!='CLIENT'  && usertype!='SERVICE') {
		  salleChange(function(){});
		  setuserselect('',function(){});
		  //$( "#Salle" ).selectmenu();
		  $( ".user" ).autocomplete({
		      source: function( request, response ) {
		    	  if (request.term.length==0) {
		    		  userselect='';
			          setuserselect(userselect,refreshall);
		    	  } 
		    	  if (request.term.length>=1) {
			          $.ajax({
			            url: "/index.php?action=listuserresa&v="+version,
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
		        minLength: 0,
		        select: function( event, ui ) {
		        	userselect=ui.item.id;
		        	setuserselect(userselect,function(){
		        		refreshall({usersel:ui.item});
		        	});
		        	
		        }/*,
		        open: function() {
		          $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
		        },
		        close: function() {
		          $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
		        }*/
		  });
		  $( ".topuser" ).show();
	}

}

function setuserselect(userselect,callback){
	var url='/index.php?action=setuserselect&clientid='+userselect+'&v='+version;
	getJsonObject(callback,url);
}
function refreshSallesCombo(){
	var url='/index.php?action=listsalle&v='+version;
	getJsonObject(function(data){
		var nbsalle=0;
		var optselected=' selected="selected" '
		
		var htmlselect="";
		//$( "#topsalle" ).html("");
		
		for(var s in data){
			//nbsalle++;
			var empl=data[s];
			if (empl.childs){
				htmlselect+='<option  style="font-weight: bolder;" taguuid="'+empl.uuid+'" tagtype="'+empl.type+'" value="'+empl.id+'">'+empl.nom+'</option>';
				for (var c in empl.childs){
					htmlselect+='<option style="font-weight: normal;display: block;white-space: pre;" taguuid="'+empl.childs[c].uuid+'" tagtype="'+empl.childs[c].type+'" value="'+empl.childs[c].id+'"'+optselected+'>'+empl.childs[c].nom+'</option>';
					nbsalle++;
					optselected="";
				}
			} else {
				htmlselect+='<option tyle="font-weight: normal;display: block;white-space: pre;" taguuid="'+empl.uuid+'" tagtype="'+empl.type+'" value="'+empl.id+'"'+optselected+'>'+empl.nom+'</option>';
				nbsalle++;
				optselected="";
			}
		}
		if (nbsalle>=2){
			$( "#Salle" ).html(htmlselect);
			$( "#Salle" ).selectmenu("refresh", true);
			$( "#topsalle" ).show();
			
			$( "#Salle" ).unbind( "change", combosalleChange );
			$( "#Salle" ).bind( "change", combosalleChange );
			combosalleChange();
		}
	},url);
}
function combosalleChange(){
	salleChange(refreshall);
	changeTypeResa('resa_horaire');
}
function salleChange(callback){
	var s=getSalle();
	$('#Salle-button').css('box-shadow','none');
	//alert('salle '+s.nom);
	var url='/index.php?action=setsalleselect&salle='+s.id+'&v='+version;
	getJsonObject(callback,url);
}

function getSalle(){
	var salle={};
	salle.id=$("#Salle option:selected" ).val();
	salle.nom=$("#Salle option:selected" ).text();
	salle.type=$("#Salle option:selected" ).attr('tagtype');
	salle.uuid=$("#Salle option:selected" ).attr('taguuid');
	return salle;
}

function refreshall( data){
	renderCalendar();
	refreshInfoEvent();
	refreshInfoUser();
	var usel="";
	if (data && data.usersel){
		usel=data.usersel.value;
	}
	$( ".user" ).val(usel);
	refreshInfoProfil();
	
	//refreshSallesCombo();
	$('#calendar').fullCalendar( 'refetchEvents' );
}

function eventsendable(event){
	var events={};
	events.start=event.start;
	events.end=event.end;
	events.title=event.title;
	events._id=event._id;
	events.uuid=event.uuid;
	events.salle=event.salle;
	return events;
	
}
function refreshInfoEvent(event){
	//alert('change');
	var url='/index.php?action=infoEvent&v='+version;
	getJsonObject(updatePanier,url);
	//var te=moment.duration(event.end.diff(event.start));
}
function refreshInfoUser(event,callback){
	//alert('change');
	var clientid=0;
	if (event && event.clientid) {
		clientid=event.clientid;
	}
	var url='/index.php?action=infoUser&clientid='+clientid+'&v='+version;
	getJsonObject(function(data){
		updateInfosUser(data);
		if (callback) callback(data);}
	,url);
	
	//var te=moment.duration(event.end.diff(event.start));
}
function addEvent(event,callback){
	//alert('change');
	getJsonObject(function(data){updatePanier(data);if (callback) {callback();}},'/index.php?action=addEvent&v='+version+'&uuid='+event.uuid,eventsendable(event));
	//var te=moment.duration(event.end.diff(event.start));
}
function updateEvent(eventchange){
	//alert('change');
	getJsonObject(function(data){updatePanier(data);},'/index.php?action=updateEvent&v='+version+'&uuid='+eventchange.uuid,eventsendable(eventchange));
	var te=moment.duration(eventchange.end.diff(eventchange.start));
}
function deleteEvent(eventid){
	
	var event=$('#calendar').fullCalendar( 'clientEvents' ,eventid ) ;
	if (event && event[0]) event=event[0];
	getJsonObject(function(data){updatePanier(data);},'/index.php?action=deleteEvent&v='+version+'&uuid='+event.uuid,eventsendable(event));
	//alert('Voulez vous vraiment supprimer cette resa : '+event.title);
	$('#calendar').fullCalendar( 'removeEvents' , eventid );
}
function ajoutDeleteButton(event,element){
	if (event.rendering!='background' && event.uuid && (event.editable || event.deletable)) {
		var html='<div class="ui_persoeventbutton">'+
			'<a href="#" '+
			'onclick="deleteEvent(\''+event._id+'\');return false;"'+
			'style="background-color:transparent" class="ui_persoeventbut_href ui_btniconseul ui-btn-left ui-btn ui-btn-icon-left ui-icon-delete ui-btn-icon-notext" >'+
			'Button</a></div>';
		element.append(html);	
	}
}
function ajoutInfo(event,element){
	if (event.rendering!='background' && event.uuid && (event.nom || event.prenom)) {
		var html='<div style="color:beige;font-weight:normal">'+event.nom+' '+event.prenom+'</div>';
		element.append(html);	
	}
	if (event.rendering!='background'  && event.etat) {
		var etats={COMMANDE:'En commande',PAIEMENT:'Att. valid. paiement',ACTIF:'Actif',CLOS:'Clos'};
		var html='<div style="color:beige;font-weight:normal">'+etats[event.etat]+'</div>';
		element.append(html);	
	}
	if (event.rendering=='background'  && event.title) {
		
		var html='<div style="color:white;font-weight:bold">'+event.title+'</div>';
		element.append(html);	
	}
}

function updatePanier(data){
	if (data && data.reservations && data.reservations.encommande) {
		var html=data.reservations.encommande.nombre + " réservation(s) ";
		/*if (data.reservations.encommande.invalidpastdate>0){
			html+='<b style="color:red;">Dont '+data.reservations.encommande.invalidpastdate+' sur des dates passées</b></br>'
		}*/
		html+=" pour "+data.reservations.encommande.temps_total+"h</br>"+
		" sur "+ data.reservations.encommande.salles.length+ " salle(s)";
		if (data.reservations.encommande.temps_abonnement>0) {
			html+="</br> dont "+data.reservations.encommande.temps_abonnement+"h inclus dans l'abonnement</br>";
		}
		
		html+="</br> Montant du panier : "+data.reservations.encommande.montant+" "+data.reservations.encommande.devise;
		//"</br> prix unitaire moyen "+data.reservations.encommande.prixU+" "+data.reservations.encommande.devise+"/H";
		
		$('#panier-info').html(html);		
	} else {
		$('#panier-info').html("Panier vide");
	}

}
function updateInfosUser(data){
	clientcharge=data.id;
	var html=data.nom +" " +data.prenom+"</br>"+
	//"login : " + data.user+"</br>"+
	"email : " + data.email+"</br></br>"+
	"Code d'accès : #" + data.codeacces+"*</br>";
	if (data.badge_numero && data.badge_numero!="") {
		html+="</br>Badge : " + data.badge_numero+"</br>";
		html+=" expiration : " + data.badge_abonnement_date_fin+"</br>";
	}
	
	$('#infosuser').html(html);
}
function checkOverlapPossible(stillEvent, movingEvent) {
	var salle=getSalle();
	if (salle && salle.type=='all'){
		$('#Salle-button').css('box-shadow','0 0 2px 2px red');
		$('#Salle-button')[0].focus();
	} else {
		$('#Salle-button').css('box-shadow','none');
	}
	
	/*si client diff et creneau salle ouverte alors OK*/
	if (stillEvent.clientid && movingEvent.clientid && 
			(stillEvent.clientid != movingEvent.clientid ||
					(stillEvent.salle && movingEvent.salle && stillEvent.salle.id!=movingEvent.salle.id)) &&
					/*stillEvent.rendering != 'background'*/stillEvent.reste>0) {
		return true;
	/*si */
	} else if (!stillEvent.clientid && movingEvent.clientid && /*stillEvent.rendering != 'background'*/stillEvent.reste>0) {
		return true;
	}
	/*si meme client et meme salle alors non KO*/
	if (stillEvent.clientid && movingEvent.clientid && 
			stillEvent.clientid == movingEvent.clientid &&
			stillEvent.salle && movingEvent.salle &&
			stillEvent.salle.id == movingEvent.salle.id){
		return false;
	}
	if (usertype!='CLIENT' && usertype!='SERVICE') {return true;}
	return false;
	//stillEvent.rendering != 'background';
    //return !stillEvent.allDay && movingEvent.allDay;
}

function renderCalendar() {
	var url='/index.php?action=getparamscalendar&v='+version;
	var calendarobj={
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'agendaWeek,agendatwoDay,agendaDay'
			},
			defaultDate: new Date(),//'2016-03-17',
			minTime :'07:00:00',
			maxTime :'20:00:00',
			selectable: true,
			height: 'auto',
			selectHelper: true,
			//selectConstraint : 'availableForMeeting',
			defaultView: 'agendaWeek',
			//defaultView: 'timelineYear',
			
			lang: 'fr',//$.i18n().locale,//currentLangCode,
			buttonIcons: false, // show the prev/next text
			weekNumbers: true,
			editable: true,
			views: {
		        agendatwoDay: {
		            type: 'agenda',
		            duration: { days: 2 },
		            buttonText: '2 Jours'
		        }
		    },
			eventOverlap: function(stillEvent, movingEvent) {
				return checkOverlapPossible(stillEvent, movingEvent);

		    },
			selectOverlap: function(event) {
				var stillEvent=event;
				
					var salle=getSalle();
					var title = salle.nom;
				var movingEvent={title:title,editable:true,
						salle:salle,
						clientid:clientcharge};	
				return checkOverlapPossible(stillEvent, movingEvent);
			},
			select: function(start, end) {
				var salle=getSalle();
				if (salle && salle.type=='all'){
					$('#Salle-button').css('box-shadow','0 0 2px 2px red');
					$('#Salle-button')[0].focus();
				} else {
					$('#Salle-button').css('box-shadow','none');
				
				}
				var title = salle.nom;
				var eventData;
				if (title && salle && salle.type!='all') {
					eventData = {
						title: title,
						start: start,
						end: end,
						editable:true,
						salle:salle,
						clientid:clientcharge,
						//color: '#aaff55',
						uuid:generateUUID()/*,
						constraint: 'availableForMeeting'*/
					};
					addEvent(eventData);
					$('#calendar').fullCalendar('renderEvent', eventData, false); // stick? = true
				}
				$('#calendar').fullCalendar('unselect');
			},
			eventLimit: true, // allow "more" link when too many events
			
		    eventDrop: function(event, delta, revertFunc) {
		    	updateEvent(event);
		    },
		    eventClick: function(event, jsEvent, view) {
		    	refreshInfoUser(event);
		    },
		    eventResize: function(event, delta, revertFunc, jsEvent, ui, view) {
		    	updateEvent(event);
		    },
		    eventRender: function(event, element) {
		    	ajoutInfo(event, element);
		    	ajoutDeleteButton(event, element);
		    	//$(element).draggable();
		        /*$(element).addTouch();*/
		        
		    },
			 eventSources: [
			                {
			                    url: serviceURL+'/index.php?action=businessHoursplanning&v='+version,

			                },
			                {
			                    url: serviceURL+'/index.php?action=eventplanning&v='+version,

			                },
			                {
			                    url: serviceURL+'/index.php?action=avaibleplanning&v='+version,

			                }
			            ]
		};
	
	getJsonObject(function(paramscalendar){
		for (var p in paramscalendar){
			calendarobj[p]=paramscalendar[p];
		}
		
		$('#calendar').fullCalendar(calendarobj);
		
	},url);
	
}
