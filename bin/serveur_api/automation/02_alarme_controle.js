/**
 * New node file
 */
var alarme_controle={id:2,nom:"alarme_controle",etat:"ON",lastrun:null};


alarme_controle.start=function(){
	alarme_controle.etat='ON';
	
}

alarme_controle.stop=function(){
	alarme_controle.etat='ON';
	
}

obj.app.serveur.on('peripherique.last_etat.added',controledetection);
obj.app.serveur.on('peripherique.last_etat.changed',controledetection);
obj.app.serveur.on('peripherique_alarme.last_etat.added',changementetatalarme);
obj.app.serveur.on('peripherique_alarme.last_etat.changed',changementetatalarme);



function controledetection(periph,previous_etat,new_etat_expressions){
	var frequenceAlarmAlert=300000;
	try {
		if (global.obj.app.core.findobj('alarme_time_entre_alerte_ms','constantes')) {
			frequenceAlarmAlert=global.obj.app.core.findobj('alarme_time_entre_alerte_ms','constantes').valeur
		} else {
			global.req.constante.set_etat('alarme_time_entre_alerte_ms',frequenceAlarmAlert);
		}		
	} catch (e) {
	}

	
	for ( var idalarm in global.obj.peripheriques_alarme) {
		for ( var iddecl in global.obj.peripheriques_alarme[idalarm].declencheur) {
			if (periph.uuid==global.obj.peripheriques_alarme[idalarm].declencheur[iddecl].uuid){
				//console.log('un mouvement est detecté');
				logger('INFO',{msg:'un detecteur a changer d état',periph_nom:periph.nom,periph_id:periph.id,new_etat:new_etat_expressions},'automation_alarme');
				var alarme_active=false;
				var alerte_waiting_finish=false;
				var timeactuel=new Date().getTime();
				
				for (var idalarme in global.obj.peripheriques_alarme[idalarm].alarme){
					if (global.obj.peripheriques_alarme[idalarm].alarme[idalarme].last_etat &&
							global.obj.peripheriques_alarme[idalarm].alarme[idalarme].last_etat.expression &&
							global.obj.peripheriques_alarme[idalarm].alarme[idalarme].last_etat.expression.etat==global.obj.peripheriques_alarme[idalarm].alarme[idalarme].ecriture_max_value) {
						alarme_active=true;
						
						if ((global.obj.peripheriques_alarme[idalarm].alarme[idalarme].last_etat.dernierealerte &&
								global.obj.peripheriques_alarme[idalarm].alarme[idalarme].last_etat.dernierealerte+frequenceAlarmAlert<timeactuel) ||
								!global.obj.peripheriques_alarme[idalarm].alarme[idalarme].last_etat.dernierealerte){
							if (global.obj.peripheriques_alarme[idalarm].alarme[idalarme].last_etat.dernierealerte) {
								alerte_waiting_finish=true;
							}							
							logger('INFO',{msg:'** compare dernier envoi alerte **',lastalerte:global.obj.peripheriques_alarme[idalarm].alarme[idalarme].last_etat.dernierealerte,timeactuel:timeactuel,frequenceAlarmAlert:frequenceAlarmAlert,alarm_id:global.obj.peripheriques_alarme[idalarm].id,alarm_nom:global.obj.peripheriques_alarme[idalarm].nom},'automation_alarme');
							if (new_etat_expressions.etat!=periph.ecriture_min_value) {
								global.obj.peripheriques_alarme[idalarm].alarme[idalarme].last_etat.dernierealerte=timeactuel;
								logger('INFO',{msg:'** affecte le timer attente alerte **',frequenceAlarmAlert:frequenceAlarmAlert,alarm_id:global.obj.peripheriques_alarme[idalarm].id,alarm_nom:global.obj.peripheriques_alarme[idalarm].nom},'automation_alarme');
								
							}
						} else if (global.obj.peripheriques_alarme[idalarm].alarme[idalarme].last_etat.dernierealerte ){
							var temps_waiting_reste_ms=global.obj.peripheriques_alarme[idalarm].alarme[idalarme].last_etat.dernierealerte+frequenceAlarmAlert-timeactuel
							logger('INFO',{msg:'** attente avant prochaine alerte possible **',alarm_id:global.obj.peripheriques_alarme[idalarm].id,alarm_nom:global.obj.peripheriques_alarme[idalarm].nom,temps_waiting_reste_ms:temps_waiting_reste_ms,frequenceAlarmAlert:frequenceAlarmAlert},'automation_alarme');

						}
					}
				}
				if (alarme_active) {
					logger('INFO',{msg:'L alarme est active',alarme_nom:global.obj.peripheriques_alarme[idalarm].nom,alarme_id:global.obj.peripheriques_alarme[idalarm].id},'automation_alarme');
					if (new_etat_expressions.etat!=periph.ecriture_min_value) {
						if (alerte_waiting_finish) {
							on_instrusion(global.obj.peripheriques_alarme[idalarm],periph,previous_etat,new_etat_expressions);
						}
					}				
				}

			}			
		}
	}
}

function changementetatalarme(periph,previous_etat,new_etat_expressions){
	if (new_etat_expressions.etat<=0) {
		stop_sirene(periph);
		logger('INFO',{msg:'L alarme vient d etre desactivée',alarm_nom:periph.nom,alarm_id:periph.id},'automation_alarme');
	} else {
		logger('INFO',{msg:'L alarme vient d etre activée',alarm_nom:periph.nom,alarm_id:periph.id},'automation_alarme');
		var timeactuel=new Date().getTime();
		logger('INFO',{msg:'suite activation affecte le timer attente alerte **',alarm_id:periph.id,alarm_nom:periph.nom},'automation_alarme');						
		
		for (var idalarme in periph.alarme){
			if (periph.alarme[idalarme].last_etat &&
					periph.alarme[idalarme].last_etat.expression ) {
					periph.alarme[idalarme].last_etat.dernierealerte=timeactuel;
			}
		}
	}
}
function active_sirene(periph_alarm){
	var timeSireneOn=300000;
	try {
		if (global.obj.app.core.findobj('alarme_time_sirene_ON_ms','constantes')) {
			timeSireneOn=global.obj.app.core.findobj('alarme_time_sirene_ON_ms','constantes').valeur
		} else {
			global.req.constante.set_etat('alarme_time_sirene_ON_ms',timeSireneOn);
		}		
	} catch (e) {
	}
	for ( var idsiren in periph_alarm.sirene) {
		periph_alarm.sirene[idsiren].set_etat('ON',periph_alarm.ecriture_max_value,null,'automation_alarme');
		logger('INFO',{msg:'allumage sirene',sirene_nom:periph_alarm.sirene[idsiren].nom,sirene_id:periph_alarm.sirene[idsiren].id},'automation_alarme');
		
	}	
	logger('INFO',{msg:'timer de '+timeSireneOn+'ms avant d eteindre la sirene'},'automation_alarme');
			
	setTimeout(function(){
		var sireneforOFF=periph_alarm;
		stop_sirene(sireneforOFF);
	},timeSireneOn);
}
function stop_sirene(periph_alarm){
	for ( var idsiren in periph_alarm.sirene) {
		periph_alarm.sirene[idsiren].set_etat('OFF',periph_alarm.ecriture_min_value,null,'automation_alarme');
		logger('INFO',{msg:'extinction sirene',sirene_nom:periph_alarm.sirene[idsiren].nom,sirene_id:periph_alarm.sirene[idsiren].id},'automation_alarme');

	}	
}

function on_instrusion(periph_alarm,periph_detect,previous_etat,new_etat_expressions) {
	var texte ="** Alarme detection **\n";
	logger('INFO',{msg:'** Alarme detection **',alarme_nom:periph_alarm.nom,alarme_id:periph_alarm.id},'automation_alarme');
	
	texte += periph_detect.nom +' ';
	if (previous_etat && previous_etat.expression) {
		texte += previous_etat.expression.etat+' => '+ new_etat_expressions.etat+'\n';
	}
	texte += periph_alarm.nom + ' ' ;
	if (periph_alarm.tag && periph_alarm.tag[0]){
		texte += periph_alarm.tag[0].nom ;
	}
	var sql="select distinct phone from utilisateurs where phone is not null and alarme_phone='true';";
	global.obj.app.db.sqlorder(sql,function(rows){
		var txt=texte;
		for (var int = 0; int < rows.length; int++) {
			var smssender=new global.req.comm_with_sms(rows[int].phone,txt);
			//console.log('envoi sms sur le '+rows[int].phone);
			logger('INFO',{msg:'envoi sms sur le '+rows[int].phone ,alarme_nom:periph_alarm.nom,alarme_id:periph_alarm.id},'automation_alarme');
			
			smssender.sendsmsbyhttp(function(err,body){
				logger('INFO',{msg:'retour envoi sms',body:body },'automation_alarme');
				
			});									
		}
	});
	var sql="select distinct mail from utilisateurs where mail is not null and alarme_mail='true';";
	global.obj.app.db.sqlorder(sql,function(rows){
		var txt=texte;
		for (var int = 0; int < rows.length; int++) {
			var smssender=new global.req.comm_with_mail(rows[int].mail,txt,global.obj.app.core.findobj('idapplication','constantes').valeur + '@inspirelec.com','** Alarme detection **');
			//console.log('envoi sms sur le '+rows[int].phone);
			logger('INFO',{msg:'envoi mail sur  '+rows[int].mail ,alarme_nom:periph_alarm.nom,alarme_id:periph_alarm.id},'automation_alarme');
			
			smssender.sendmailbyhttp(function(err,body){
				logger('INFO',{msg:'retour envoi mail',body:body },'automation_alarme');	
			});									
		}
	});
	active_sirene(periph_alarm);
}


module.exports = alarme_controle;