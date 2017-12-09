/**
 * New node file
 */
var aire_voyage_services={id:42,nom:"aire_voyage_services",etat:"OFF",lastrun:null};
var timer=null;
//activer/desactiver mode test (n'envoie aucune mise à jour)
var test=false;



aire_voyage_services.start=function(){
    if (aire_voyage_services.etat=='OFF') {
        aire_voyage_services.etat='ON';
        logger('INFO',{msg:'demarrage automation',nom:this.nom},'startstop');
        /*obj.app.serveur.on('core_charge_all',run_update_etat);
        obj.app.serveur.on('box.update_etat_box',actions_on_event1);
        obj.app.serveur.on('box.update_etat_boxs',actions_on_event2);
        
        /*Execution toutes les  30 secondes*/
        timer=setInterval(function(){
            calcul_services();
            }, 300000);
        
        
    }
}

aire_voyage_services.stop=function(){
    if (aire_voyage_services.etat=='ON') {
        aire_voyage_services.etat='OFF';
        logger('INFO',{msg:'extinction automation',nom:this.nom},'startstop');
        /*obj.app.serveur.removeListener('core_charge_all',actions_on_event1);
        obj.app.serveur.removeListener('box.update_etat_box',actions_on_event1);
        obj.app.serveur.removeListener('box.update_etat_boxs',actions_on_event2);*/
        clearInterval(timer);
    }

}


function calcul_services(){
	aire_voyage_services.lastrun=req.moment().format('DD/MM/YY HH:mm:ss');
	var sql="select tag.nom,tag.id emplacement_id,s.titulaire_id," +
			"            date_debut,date_fin," +
			"            service_eau,service_elec,service_chauffeeau," +
			"			 ta.seuil_alerte,seuil_coupure," +
			"             sum(case when t.code in ('EC','RC') then  case when e.signe='-' then -1 else 1 end * e.montant else 0 end) reste_caution," +
			"		     sum(case when e.calcul_solde ='O' then  case when e.signe='-' then -1 else 1 end * e.montant else 0 end) reste_solde," +
			"			 max((select p.id from peripherique p inner join peripherique_tag pt on pt.id_peripherique=p.id and pt.id_tag=tag.id" +
			"			  where p.nom like 'Alerte%Conso%')) periph_alert_conso_id," +
			"			 max((select p.id from peripherique p inner join peripherique_tag pt on pt.id_peripherique=p.id and pt.id_tag=tag.id" +
			"			  where p.nom like 'Alerte%effraction%')) periph_alert_effraction_id," +
			"			 max((select p.id from peripherique p inner join peripherique_tag pt on pt.id_peripherique=p.id and pt.id_tag=tag.id" +
			"			  where p.nom like 'Effraction%')) periph_effraction_id," +
			"			 max((select p.id from peripherique p inner join peripherique_tag pt on pt.id_peripherique=p.id and pt.id_tag=tag.id" +
			"			  where p.nom like 'Chauffe%')) periph_chauffeeau_id," +
			"			 max((select p.id from peripherique p inner join peripherique_tag pt on pt.id_peripherique=p.id and pt.id_tag=tag.id" +
			"			  where p.nom like 'Eau%')) periph_eau_id," +
			"			 max((select p.id from peripherique p inner join peripherique_tag pt on pt.id_peripherique=p.id and pt.id_tag=tag.id" +
			"			  where p.nom like 'Alimentation%')) periph_elec_id," +
			"			 max((select p.id from peripherique p inner join peripherique_tag pt on pt.id_peripherique=p.id and pt.id_tag=tag.id" +
			"			  where p.nom like '%lumineux%')) periph_avert_lumineu_id," +
			"			 max((select p.id from peripherique p where p.nom like 'Maintenance%')) periph_maintenance_id" +
			" from  tag left outer join sejour s  on tag.id=s.emplacement_id and  (s.clos is null or s.clos !='1')" +
			"                 left outer join tarif ta on ta.id=s.type_tarif " +
			"				  left outer join compte_ecriture e on e.titulaire_id=s.titulaire_id" +
			"				  left outer join type_operation t  on t.id=e.type_operation" +
			" where tag.nom like 'Empl%'" +
			" group by tag.nom,s.emplacement_id,s.titulaire_id,date_debut,date_fin,ta.seuil_alerte,seuil_coupure;";
	 global.obj.app.db.sqlorder(sql,
	            function(rows){
	                if (rows) {
						logger('DEBUG',{msg:'requete: '+sql,reponse:rows,mode_test:test },'automation_'+aire_voyage_services.nom);
						if (global.obj.app.core.findobj('test','constantes')) {
							test=global.obj.app.core.findobj('test','constantes').valeur;
						}

	                	for (var l in rows){
		                	/* Activation des services:
								alerte_effraction: périphérique 
								alerte_conso : périphérique
								
								si caution 
									si service eau et pas alerte_conso et pas alerte_effraction
									activation eau
									si service elec et pas alerte_conso et pas alerte_effraction
									activation elec
									si service chauffe-eau et pas alerte_conso et pas alerte_effraction
									activation chauffe-eau
									si pas alerte_conso et pas alerte_effraction
									éteindre avertisseur
		                	 */
	                		
	                		/*test somme caution >0*/
							logger('INFO',{msg:'Emplacement: '+rows[l].emplacement_id,nom:this.nom,mode_test:test },'automation_'+aire_voyage_services.nom);
							logger('INFO',{msg:'Caution: '+rows[l].reste_caution,nom:this.nom,mode_test:test },'automation_'+aire_voyage_services.nom);
	                		if (rows[l].reste_caution>0){
	                			/*caution ok*/
	                			/*test pas alerte_conso et pas alerte_effraction*/
								logger('INFO',{msg:'alerte conso '+rows[l].periph_alert_conso_id+', etat: '+isON_OFF(rows[l].periph_alert_conso_id),nom:this.nom,mode_test:test },'automation_'+aire_voyage_services.nom);
								logger('INFO',{msg:'alerte effraction '+rows[l].periph_alert_effraction_id+', etat: '+isON_OFF(rows[l].periph_alert_effraction_id),nom:this.nom,mode_test:test },'automation_'+aire_voyage_services.nom);
	                			if (isON_OFF(rows[l].periph_alert_conso_id)=='OFF' &&
	                				isON_OFF(rows[l].periph_alert_effraction_id)=='OFF'	){
	                				
	                				/*service_eau*/
									logger('INFO',{msg:'Périph eau: '+rows[l].periph_eau_id,nom:this.nom,mode_test:test },'automation_'+aire_voyage_services.nom);
	                				if (rows[l].service_eau=='1' && isON_OFF(rows[l].periph_eau_id)=='OFF'){
	                					var periph_eau=global.obj.app.core.findobj(rows[l].periph_eau_id,'peripheriques');
										if ( test == 'false'){
											periph_eau.set_etat('ON',periph_eau.ecriture_max_value,null,'automation_services');
										}
										logger('INFO',{msg:'Set etat ON: '+periph_eau.id,nom:periph_eau.nom,mode_test:test },'automation_'+aire_voyage_services.nom);
	                				}
	                				/*service_elec*/
									logger('INFO',{msg:'Périph élec: '+rows[l].periph_elec_id,nom:this.nom,mode_test:test },'automation_'+aire_voyage_services.nom);
	                				if (rows[l].service_elec=='1' && isON_OFF(rows[l].periph_elec_id)=='OFF'){
	                					var periph_elec=global.obj.app.core.findobj(rows[l].periph_elec_id,'peripheriques');
	                					if ( test == 'false'){
											periph_elec.set_etat('ON',periph_elec.ecriture_max_value,null,'automation_services');
										}
										logger('INFO',{msg:'Set etat ON: '+periph_elec.id,nom:periph_elec.nom,mode_test:test},'automation_'+aire_voyage_services.nom);
	                				}
	                				/*service_chauffeeau*/
									logger('INFO',{msg:'Périph élec: '+rows[l].periph_chauffeeau_id,nom:this.nom,mode_test:test },'automation_'+aire_voyage_services.nom);
	                				if (rows[l].service_chauffeeau=='1' && isON_OFF(rows[l].periph_chauffeeau_id)=='OFF'){
	                					var periph_chauffeeau=global.obj.app.core.findobj(rows[l].periph_chauffeeau_id,'peripheriques');
	                					if ( test == 'false'){
											periph_chauffeeau.set_etat('ON',periph_chauffeeau.ecriture_max_value,null,'automation_services');
										}
										logger('INFO',{msg:'Set etat ON: '+periph_chauffeeau.id,nom:periph_chauffeeau.nom,mode_test:test},'automation_'+aire_voyage_services.nom);
	                				}
	                				
	                				/*si avertisseur is ON l'éteindre*/
									logger('INFO',{msg:'Périph avertisseur: '+rows[l].periph_avert_lumineu_id,nom:this.nom,mode_test:test },'automation_'+aire_voyage_services.nom);
	                				if (isON_OFF(rows[l].periph_avert_lumineu_id)=='ON'){
	                					var periph_avert_lum=global.obj.app.core.findobj(rows[l].periph_avert_lumineu_id,'peripheriques');
	                					if ( test == 'false'){
											periph_avert_lum.set_etat('OFF',periph_avert_lum.ecriture_min_value,null,'automation_services');
										}
										logger('INFO',{msg:'Set etat ON: '+periph_avert_lum.id,nom:periph_avert_lum.nom,mode_test:test},'automation_'+aire_voyage_services.nom);
	                				}
	                			}
								/*Alerte conso:

	                			alerte_conso: périphérique 

	                			si solde entre seuil coupure et seuil alerte
	                			activer le périphérique alerte_conso
	                			activer le périphérique avertisseur lumineux
	                			si solde < seuil coupure 
	                			activer le périphérique alerte_conso
	                			couper les services liés
	                			si solde >seuil  alerte
	                			désactiver le périphérique alerte_conso*/
	                		
	                		/*test solde < alerte*/
							logger('INFO',{msg:'Solde: '+rows[l].reste_solde,nom:this.nom,mode_test:test },'automation_'+aire_voyage_services.nom);
	                		if (rows[l].reste_solde<=rows[l].seuil_alerte	){
	                			
	                			/*solde < alerte*/
	                		    /*si avertisseur is OFF l'allumer*/
								logger('INFO',{msg:'Périph lumineux: '+rows[l].periph_avert_lumineu_id,nom:this.nom,mode_test:test },'automation_'+aire_voyage_services.nom);
                				if (isON_OFF(rows[l].periph_avert_lumineu_id)=='OFF'){
                					var periph_avert_lum=global.obj.app.core.findobj(rows[l].periph_avert_lumineu_id,'peripheriques');
                					if ( test == 'false'){
											periph_avert_lum.set_etat('ON',periph_avert_lum.ecriture_max_value,null,'automation_services');
										}
										logger('INFO',{msg:'Set etat ON: '+periph_avert_lum.id,nom:periph_avert_lum.nom,mode_test:test},'automation_'+aire_voyage_services.nom);
                				}
	                		    /*si alerte conso is OFF l'allumer*/
								logger('INFO',{msg:'Périph conso: '+rows[l].periph_alert_conso_id,nom:this.nom,mode_test:test },'automation_'+aire_voyage_services.nom);
                				if (isON_OFF(rows[l].periph_alert_conso_id)=='OFF'){
                					var periph_alert_conso=global.obj.app.core.findobj(rows[l].periph_alert_conso_id,'peripheriques');
                					if ( test == 'false'){
											periph_alert_conso.set_etat('ON',periph_alert_conso.ecriture_max_value,null,'automation_services');
										}
										logger('INFO',{msg:'Set etat ON: '+periph_alert_conso.id,nom:periph_alert_conso.nom,mode_test:test},'automation_'+aire_voyage_services.nom);
                				}
                				
                				/*test solde < coupure*/
                				if (rows[l].reste_solde<=rows[l].seuil_coupure ){
                					/*solde < coupure*/
                					/*service_eau*/
	                				if (isON_OFF(rows[l].periph_eau_id)=='ON'){
	                					var periph_eau=global.obj.app.core.findobj(rows[l].periph_eau_id,'peripheriques');
	                					if ( test == 'false'){
											periph_eau.set_etat('OFF',periph_eau.ecriture_min_value,null,'automation_services');
										}
										logger('INFO',{msg:'Set etat OFF: '+periph_eau.id,nom:periph_eau.nom,mode_test:test},'automation_'+aire_voyage_services.nom);
	                				}
	                				/*service_elec*/
	                				if (isON_OFF(rows[l].periph_elec_id)=='ON'){
	                					var periph_elec=global.obj.app.core.findobj(rows[l].periph_elec_id,'peripheriques');
	                					if ( test == 'false'){
											periph_elec.set_etat('OFF',periph_elec.ecriture_min_value,null,'automation_services');
										}
										logger('INFO',{msg:'Set etat OFF: '+periph_elec.id,nom:periph_elec.nom,mode_test:test},'automation_'+aire_voyage_services.nom);
	                				}
	                				/*service_chauffeeau*/
	                				if (isON_OFF(rows[l].periph_chauffeeau_id)=='ON'){
	                					var periph_chauffeeau=global.obj.app.core.findobj(rows[l].periph_chauffeeau_id,'peripheriques');
	                					if ( test == 'false'){
											periph_chauffeeau.set_etat('OFF',periph_chauffeeau.ecriture_min_value,null,'automation_services');
										}
										logger('INFO',{msg:'Set etat OFF: '+periph_chauffeeau.id,nom:periph_chauffeeau.nom,mode_test:test},'automation_'+aire_voyage_services.nom);
	                				}
                				}

	                		} else if (rows[l].reste_solde>rows[l].seuil_alerte){
	                		    /*si alerte conso is ON l'éteindre*/
                				if (isON_OFF(rows[l].periph_alert_conso_id)=='ON'){
                					var periph_alert_conso=global.obj.app.core.findobj(rows[l].periph_alert_conso_id,'peripheriques');
                					if ( test == 'false'){
											periph_alert_conso.set_etat('OFF',periph_alert_conso.ecriture_min_value,null,'automation_services');
										}
										logger('INFO',{msg:'Set etat OFF: '+periph_alert_conso.id,nom:periph_alert_conso.nom,mode_test:test},'automation_'+aire_voyage_services.nom);
											
                				}
	                			
	                		}
	                		}else{
								/*Pas de caution donc emplacement innoccupé donc coupure des services/
                					/*service_eau*/
	                				if (isON_OFF(rows[l].periph_eau_id)=='ON'){
	                					var periph_eau=global.obj.app.core.findobj(rows[l].periph_eau_id,'peripheriques');
	                					if ( test == 'false'){
											periph_eau.set_etat('OFF',periph_eau.ecriture_min_value,null,'automation_services');
										}
										logger('INFO',{msg:'non occupé Set etat OFF: '+periph_eau.id,nom:periph_eau.nom,mode_test:test},'automation_'+aire_voyage_services.nom);
	                				}
	                				/*service_elec*/
	                				if (isON_OFF(rows[l].periph_elec_id)=='ON'){
	                					var periph_elec=global.obj.app.core.findobj(rows[l].periph_elec_id,'peripheriques');
	                					if ( test == 'false'){
											periph_elec.set_etat('OFF',periph_elec.ecriture_min_value,null,'automation_services');
										}
										logger('INFO',{msg:'non occupé Set etat OFF: '+periph_elec.id,nom:periph_elec.nom,mode_test:test},'automation_'+aire_voyage_services.nom);
	                				}
	                				/*service_chauffeeau*/
	                				if (isON_OFF(rows[l].periph_chauffeeau_id)=='ON'){
	                					var periph_chauffeeau=global.obj.app.core.findobj(rows[l].periph_chauffeeau_id,'peripheriques');
	                					if ( test == 'false'){
											periph_chauffeeau.set_etat('OFF',periph_chauffeeau.ecriture_min_value,null,'automation_services');
										}										
										logger('INFO',{msg:'non occupé Set etat OFF: '+periph_chauffeeau.id,nom:periph_chauffeeau.nom,mode_test:test},'automation_'+aire_voyage_services.nom);
	                				}
									/*Alerte conso*/
	                				if (isON_OFF(rows[l].periph_alert_conso_id)=='ON'){
                					var periph_alert_conso=global.obj.app.core.findobj(rows[l].periph_alert_conso_id,'peripheriques');
                					if ( test == 'false'){
											periph_alert_conso.set_etat('OFF',periph_alert_conso.ecriture_min_value,null,'automation_services');
										}
										logger('INFO',{msg:'Set etat OFF: '+periph_alert_conso.id,nom:periph_alert_conso.nom,mode_test:test},'automation_'+aire_voyage_services.nom);
											
									}	
							
	                		
	                		
							}
							logger('INFO',{msg:'Fin emplacement: '+rows[l].emplacement_id,nom:this.nom,mode_test:test },'automation_'+aire_voyage_services.nom);	                		
	                	}
	                }
	 			}
	 );
	
}
function isON_OFF(periph_id){
	var periph=global.obj.app.core.findobj(periph_id,'peripheriques');
	if (periph && periph.last_etat && periph.last_etat.expression  ){
		if (periph.last_etat.expression.etat==periph.ecriture_max_value){
			return 'ON';
		} else if (periph.last_etat.expression.etat==periph.ecriture_min_value){
			return 'OFF';
		}
	}
	return null;
}

module.exports = aire_voyage_services;