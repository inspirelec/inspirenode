/**
 * New node file
 */
var effraction_controle={id:41,nom:"effraction_controle",etat:"ON",lastrun:null};


effraction_controle.start=function(){
	alarme_controle.etat='ON';
	
}

effraction_controle.stop=function(){
	alarme_controle.etat='ON';
	
}

obj.app.serveur.on('peripherique.last_etat.added',controledetection);
obj.app.serveur.on('peripherique.last_etat.changed',controledetection);


function controledetection(periph,previous_etat,new_etat_expressions){
	/*Alerte effraction:

			détection d'ouverture de porte: périphérique en push
			maintenance: périphérique 
			alerte_effraction: périphérique 
			
			si détection d'ouverture de porte
			si pas maintenance
			activer le périphérique alerte_effraction
			couper les services liés aux 2 emplacements
	 */
	
	
	if (periph && periph.nom && periph.nom.substr(0,10)=='Effraction'){
		/*test si effraction == ON*/
		if (isON_OFF_expr(periph,new_etat_expressions)=='OFF') {
			/*requete pour avoir les id de periph maintenance et alerte_effraction*/
			
			var sql="select distinct" +
					"  ((select p.id from peripherique p inner join peripherique_tag pt on pt.id_peripherique=p.id and pt.id_tag=tag.id" +
					"  where p.nom like 'Alerte%effraction%')) periph_alert_effraction_id," +
					"  ((select p.id from peripherique p inner join peripherique_tag pt on pt.id_peripherique=p.id and pt.id_tag=tag.id" +
					"  where p.nom like 'Effraction%')) periph_effraction_id," +
					"  ((select p.id from peripherique p where p.nom like 'Maintenance%')) periph_maintenance_id," +
					
					"  ((select p.id from peripherique p inner join peripherique_tag pt on pt.id_peripherique=p.id and pt.id_tag=tag.id" +
					"  where p.nom like 'Chauffe%eau%')) periph_chauffeau_id," +
					"  ((select p.id from peripherique p inner join peripherique_tag pt on pt.id_peripherique=p.id and pt.id_tag=tag.id" +
					"  where p.nom like 'Eau%')) periph_eau_id," +
					"  ((select p.id from peripherique p inner join peripherique_tag pt on pt.id_peripherique=p.id and pt.id_tag=tag.id" +
					"  where p.nom like 'Alimentation%lectri%')) periph_elec_id" +
					" from  tag" +
					" where periph_effraction_id='"+periph.id+"'";
			
			 global.obj.app.db.sqlorder(sql,
					 	function(rows){
				            for (var e in rows) {
			                	/*test si maintenance en cours*/
			                	if (isON_OFF(rows[e].periph_maintenance_id)=='ON'){
			                		/*pas de maintenance en cours*/
			                		
			                		/*coupure des services*/
			                		/*service_eau*/
	                				if (isON_OFF(rows[e].periph_eau_id)=='ON'){
	                					var periph_eau=global.obj.app.core.findobj(rows[e].periph_eau_id,'peripheriques');
	                					periph_eau.set_etat('OFF',periph_eau.ecriture_min_value,null,'automation_services');
	                				}
	                				/*service_elec*/
	                				if (isON_OFF(rows[e].periph_elec_id)=='ON'){
	                					var periph_elec=global.obj.app.core.findobj(rows[e].periph_elec_id,'peripheriques');
	                					periph_elec.set_etat('OFF',periph_elec.ecriture_min_value,null,'automation_services');
	                				}
	                				/*service_chauffeeau*/
	                				if (isON_OFF(rows[e].periph_chauffeeau_id)=='ON'){
	                					var periph_chauffeeau=global.obj.app.core.findobj(rows[e].periph_chauffeeau_id,'peripheriques');
	                					periph_chauffeeau.set_etat('OFF',periph_chauffeeau.ecriture_min_value,null,'automation_services');
	                				}
	                				
	                				/*passe alerte effraction a ON*/
	                				if (isON_OFF(rows[e].periph_alert_effraction_id)=='OFF'){
	                					var periph_alert_effraction=global.obj.app.core.findobj(rows[e].periph_alert_effraction_id,'peripheriques');
	                					periph_alert_effraction.set_etat('ON',periph_alert_effraction.ecriture_max_value,null,'automation_services');
	                				}
	                				
			                	}
			                }
			 			}
			 );
		}
		
	}
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
function isON_OFF_expr(periph,new_etat_expressions){
	if (new_etat_expressions  ){
		if (new_etat_expressions.etat==periph.ecriture_max_value){
			return 'ON';
		} else if (new_etat_expressions.etat==periph.ecriture_min_value){
			return 'OFF';
		}
	}
	return null;
}


module.exports = effraction_controle;