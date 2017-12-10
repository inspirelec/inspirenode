/**
 * Historisation dans les tables historique_heure, historique_jour, historique_mois, historique_an
 */ 
 
var historise_etat_fixe={id:98,nom:"historise_etat_fixe",etat:"OFF",lastrun:null};
var timer=null;
historise_etat_fixe.fileattenteetat=[];
historise_etat_fixe.fileattentedata=[];
historise_etat_fixe.busy=false;

historise_etat_fixe.start=function(){
	if (historise_etat_fixe.etat=='OFF' ) {
		historise_etat_fixe.etat='ON';
		logger('INFO',{msg:'demarrage automation',nom:this.nom},'startstop');
		/*Execution toutes les  60 secondes*/
		timer=setInterval(function(){
				historise_etat_fixe.lastrun = req.moment().format('YYYY-MM-DD HH:mm:ss');
				Histo();
			}, 60000);
	}
}

historise_etat_fixe.stop=function(){
	if (historise_etat_fixe.etat=='ON') {
		historise_etat_fixe.etat='OFF';
		logger('INFO',{msg:'extinction automation',nom:this.nom},'startstop');
		clearInterval(timer);
	}

}

function Histo(){
	var timestamp=req.moment().format('YYYY-MM-DD HH')+':00:00';
	var histo_heure=(req.moment().format('mm'));
	var histo_jour=(req.moment().format('HH:mm'));
	var histo_mois=(req.moment().format('DD HH:mm'));
	var histo_an=(req.moment().format('MM-DD HH:mm'));													
	var date_pour_suppr = req.moment().weekday(-21).format('YYYY-MM-DD')+' 00:00:00'
	var fin_mois = new Date(req.moment().toDate().getYear(),req.moment().toDate().getMonth()+1,0);
	var jour_fin_mois = fin_mois.getDate();
	
	var date_heure = req.moment().format('YYYY-MM-DD HH');
	var date_jour = req.moment().format('YYYY-MM-DD');
	var date_mois = req.moment().format('YYYY-MM');
	var date_an = req.moment().format('YYYY');
	
	var minute=(req.moment().format('mm'));
	var heure=(req.moment().format('HH'));
	var jour=(req.moment().format('DD'));
	var mois=(req.moment().format('MM'));
	var annee=(req.moment().format('YYYY'));
			
	var okinsert=false;
	logger('DEBUG',{msg:'Histo heure : '+timestamp},'automation_'+historise_etat_fixe.nom);
	logger('DEBUG',{msg:'Histo test heure : '+histo_heure},'automation_'+historise_etat_fixe.nom);
	logger('DEBUG',{msg:'Histo test jour : '+histo_jour},'automation_'+historise_etat_fixe.nom);
	logger('DEBUG',{msg:'Histo test mois : '+histo_mois},'automation_'+historise_etat_fixe.nom);
	logger('DEBUG',{msg:'Histo test an : '+histo_an},'automation_'+historise_etat_fixe.nom);
	logger('DEBUG','Jour fin de mois: '+jour_fin_mois,'automation_'+historise_etat_fixe.nom);
	logger('DEBUG','Purge date vers historique_sav: '+date_pour_suppr,'automation_'+historise_etat_fixe.nom);
	
	if (histo_heure=='59' || histo_heure=='30' || histo_heure=='15' || histo_heure=='45'){		
		
		logger('DEBUG',{msg:'D�but calcul histo heure'},'automation_'+historise_etat_fixe.nom);
		//Calcul des min max et moy pour chaque expression des p�riph�rique de l'heure en cours
		//retourne une seule ligne par p�riph�rique
		var date_sql = date_heure;
		var sql="select  h.uuid, max(expr1*1) expr1_max, min(expr1*1) expr1_min, round(avg(expr1*1),2) expr1_moy "
								+", max(expr2*1) expr2_max, min(expr2*1) expr2_min, round(avg(expr2*1),2) expr2_moy "
								+", max(expr3*1) expr3_max, min(expr3*1) expr3_min, round(avg(expr3*1),2) expr3_moy "
								+", max(expr4*1) expr4_max, min(expr4*1) expr4_min, round(avg(expr4*1),2) expr4_moy "
								+", max(expr5*1) expr5_max, min(expr5*1) expr5_min, round(avg(expr5*1),2) expr5_moy "
								+", max(expr6*1) expr6_max, min(expr6*1) expr6_min, round(avg(expr6*1),2) expr6_moy "
								+", max(expr7*1) expr7_max, min(expr7*1) expr7_min, round(avg(expr7*1),2) expr7_moy "
								+", max(etat*1) etat_max, min(etat*1) etat_min, round(avg(etat*1),2) etat_moy "
								+"from historique h where "
								+" strftime('%Y-%m-%d %H',h.timestamp) = '"+date_sql+"' "
								+"group by h.uuid";
		global.obj.app.db.sqlorder(sql,
	            function(rows){
	                if (rows) {
						logger('DEBUG',{msg:'requete: '+sql,reponse:rows },'automation_'+historise_etat_fixe.nom);
						
						var orderdelete_jour="delete from historique_heure where strftime('%Y-%m-%d %H',timestamp)>=? ";
						var datadelete_jour=[date_sql];
						historise_etat_fixe.fileattenteetat.push(orderdelete_jour);
						historise_etat_fixe.fileattentedata.push(datadelete_jour);
						
	                	for (var l in rows){
							
							//histo heure							
							var periph=obj.app.core.findobj(rows[l].uuid,'peripheriques');
							if(!periph) periph=obj.app.core.findobj(rows[l].uuid,'peripheriques_chauffage');
							
							if (periph && periph.last_etat && periph.last_etat.expression) {
								var uuid=periph.uuid;
								var ordersql_heure= 'insert into historique_heure (';			
								var colonnessql_heure="timestamp, uuid, etat, expr1, expr2, expr3, expr4, expr5, expr6, expr7 "
									+", etat_unit, expr1_unit , expr2_unit, expr3_unit ,expr4_unit , expr5_unit, expr6_unit, expr7_unit "
									+", expr1_max, expr1_min, expr1_moy "
									+", expr2_max, expr2_min, expr2_moy "
									+", expr3_max, expr3_min, expr3_moy "
									+", expr4_max, expr4_min, expr4_moy "
									+", expr5_max, expr5_min, expr5_moy "
									+", expr6_max, expr6_min, expr6_moy "
									+", expr7_max, expr7_min, expr7_moy "
									+", etat_max, etat_min, etat_moy ";
								var datasql_heure="?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?";
								datasql_heure+=",?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?";
								datasql_heure+=",?,?";	
								
								var dataarray_heure=[date_sql+":00:00",uuid,
										    periph.last_etat.expression.etat,periph.last_etat.expression.expr1,
										    periph.last_etat.expression.expr2,periph.last_etat.expression.expr3,
										    periph.last_etat.expression.expr4,periph.last_etat.expression.expr5,
										    periph.last_etat.expression.expr6,periph.last_etat.expression.expr7,
									        periph.last_etat.expression.etat_unit,periph.last_etat.expression.expr1_unit,
									        periph.last_etat.expression.expr2_unit,periph.last_etat.expression.expr3_unit,
									        periph.last_etat.expression.expr4_unit,periph.last_etat.expression.expr5_unit,
									        periph.last_etat.expression.expr6_unit,periph.last_etat.expression.expr7_unit,
									        rows[l].expr1_max,rows[l].expr1_min,rows[l].expr1_moy,
											rows[l].expr2_max,rows[l].expr2_min,rows[l].expr2_moy,
											rows[l].expr3_max,rows[l].expr3_min,rows[l].expr3_moy,
											rows[l].expr4_max,rows[l].expr4_min,rows[l].expr4_moy,
											rows[l].expr5_max,rows[l].expr5_min,rows[l].expr5_moy,
											rows[l].expr6_max,rows[l].expr6_min,rows[l].expr6_moy,
											rows[l].expr7_max,rows[l].expr7_min,rows[l].expr7_moy,	
											rows[l].etat_max,rows[l].etat_min,rows[l].etat_moy];										
									
								ordersql_heure+=colonnessql_heure+") values ("+datasql_heure+");";		

								historise_etat_fixe.fileattenteetat.push(ordersql_heure);	
								historise_etat_fixe.fileattentedata.push(dataarray_heure);
							}
						}
						global.obj.app.db.sqltrans(historise_etat_fixe.fileattenteetat,function(nborder){
							historise_etat_fixe.fileattenteetat.splice(0,nborder);
							historise_etat_fixe.fileattentedata.splice(0,nborder);
							logger('INFO','historisation de '+nborder+' p�riph�riques dans historique_heure','automation_'+historise_etat_fixe.nom);
							historise_etat_fixe.fileattenteetat=[];
							historise_etat_fixe.fileattentedata+[];
							logger('DEBUG',{msg:'Fin calcul histo heure'},'automation_'+historise_etat_fixe.nom);
							if (/*histo_jour=='23:59'*/1==1){
								logger('DEBUG',{msg:'D�but calcul histo jour'},'automation_'+historise_etat_fixe.nom);
////-------------------
								//Calcul des min max et moy pour chaque expression des p�riph�rique du jour en cours
								//retourne une seule ligne par p�riph�rique
								var date_sql = date_jour;
								var sql="select h.uuid, max(expr1_max*1) expr1_max, min(expr1_min*1) expr1_min, round(avg(expr1_moy*1),2) expr1_moy "
														+", max(expr2_max*1) expr2_max, min(expr2_min*1) expr2_min, round(avg(expr2_moy*1),2) expr2_moy "
														+", max(expr3_max*1) expr3_max, min(expr3_min*1) expr3_min, round(avg(expr3_moy*1),2) expr3_moy "
														+", max(expr4_max*1) expr4_max, min(expr4_min*1) expr4_min, round(avg(expr4_moy*1),2) expr4_moy "
														+", max(expr5_max*1) expr5_max, min(expr5_min*1) expr5_min, round(avg(expr5_moy*1),2) expr5_moy "
														+", max(expr6_max*1) expr6_max, min(expr6_min*1) expr6_min, round(avg(expr6_moy*1),2) expr6_moy "
														+", max(expr7_max*1) expr7_max, min(expr7_min*1) expr7_min, round(avg(expr7_moy*1),2) expr7_moy "
														+", max(etat_max*1) etat_max, min(etat_min*1) etat_min, round(avg(etat_moy*1),2) etat_moy "
														+"from  historique_heure h where "
														+" strftime('%Y-%m-%d',h.timestamp) = '"+date_sql+"'  "
														+"group by h.uuid";
								global.obj.app.db.sqlorder(sql,
										function(rows){
									        logger('DEBUG',{msg:'requete: '+sql,reponse:rows },'automation_'+historise_etat_fixe.nom);
											if (rows) {
												
												
												var orderdelete_jour="delete from historique_jour where strftime('%Y-%m-%d',timestamp)>=? ";
												var datadelete_jour=[date_sql];
												historise_etat_fixe.fileattenteetat.push(orderdelete_jour);
												historise_etat_fixe.fileattentedata.push(datadelete_jour);
												
												/*var orderdelete_jour="delete from historique_jour where strftime('%Y-%m-%d',timestamp)>='"+date_sql+"' ";
												historise_etat_fixe.fileattenteetat.push(orderdelete_jour);*/
												
												var orderdelete_temp="delete from historique where strftime('%Y-%m-%d',timestamp)>? ";
												var datadelete_temp=[date_sql];
												historise_etat_fixe.fileattenteetat.push(orderdelete_temp);
												historise_etat_fixe.fileattentedata.push(datadelete_temp);
												
												/*var orderdelete_temp="delete from historique where strftime('%Y-%m-%d',timestamp)>'"+date_sql+"' ";
												historise_etat_fixe.fileattenteetat.push(orderdelete_temp);*/
												
												for (var l in rows){
													
													//histo jour							
													var periph=obj.app.core.findobj(rows[l].uuid,'peripheriques');
													if(!periph) periph=obj.app.core.findobj(rows[l].uuid,'peripheriques_chauffage');
													
													if (periph && periph.last_etat && periph.last_etat.expression){
														var uuid=periph.uuid;
														

														
														var ordersql_jour= 'insert into historique_jour (';			
														var colonnessql_jour="timestamp, uuid, etat, expr1, expr2, expr3, expr4, expr5, expr6, expr7 "
															+", etat_unit, expr1_unit , expr2_unit, expr3_unit ,expr4_unit , expr5_unit, expr6_unit, expr7_unit "
															+", expr1_max, expr1_min, expr1_moy "
															+", expr2_max, expr2_min, expr2_moy "
															+", expr3_max, expr3_min, expr3_moy "
															+", expr4_max, expr4_min, expr4_moy "
															+", expr5_max, expr5_min, expr5_moy "
															+", expr6_max, expr6_min, expr6_moy "
															+", expr7_max, expr7_min, expr7_moy "
															+", etat_max, etat_min, etat_moy ";
														var datasql_jour="?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?";
														datasql_jour+=",?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?";
														datasql_jour+=",?,?";	
														
														var dataarray_jour=[date_sql+" 01:00:00",uuid,
																    periph.last_etat.expression.etat,periph.last_etat.expression.expr1,
																    periph.last_etat.expression.expr2,periph.last_etat.expression.expr3,
																    periph.last_etat.expression.expr4,periph.last_etat.expression.expr5,
																    periph.last_etat.expression.expr6,periph.last_etat.expression.expr7,
															        periph.last_etat.expression.etat_unit,periph.last_etat.expression.expr1_unit,
															        periph.last_etat.expression.expr2_unit,periph.last_etat.expression.expr3_unit,
															        periph.last_etat.expression.expr4_unit,periph.last_etat.expression.expr5_unit,
															        periph.last_etat.expression.expr6_unit,periph.last_etat.expression.expr7_unit,
															        rows[l].expr1_max,rows[l].expr1_min,rows[l].expr1_moy,
																	rows[l].expr2_max,rows[l].expr2_min,rows[l].expr2_moy,
																	rows[l].expr3_max,rows[l].expr3_min,rows[l].expr3_moy,
																	rows[l].expr4_max,rows[l].expr4_min,rows[l].expr4_moy,
																	rows[l].expr5_max,rows[l].expr5_min,rows[l].expr5_moy,
																	rows[l].expr6_max,rows[l].expr6_min,rows[l].expr6_moy,
																	rows[l].expr7_max,rows[l].expr7_min,rows[l].expr7_moy,	
																	rows[l].etat_max,rows[l].etat_min,rows[l].etat_moy];
														ordersql_jour+=colonnessql_jour+") values ("+datasql_jour+");";		

														historise_etat_fixe.fileattenteetat.push(ordersql_jour);
														historise_etat_fixe.fileattentedata.push(dataarray_jour);
													}
	
												}
												global.obj.app.db.sqltrans(historise_etat_fixe.fileattenteetat,function(nborder){
													historise_etat_fixe.fileattenteetat.splice(0,nborder);
													historise_etat_fixe.fileattentedata.splice(0,nborder);
													logger('INFO','historisation de '+nborder+' p�riph�riques dans historique_jour','automation_'+historise_etat_fixe.nom);
													logger('DEBUG',{msg:'Fin calcul histo jour'},'automation_'+historise_etat_fixe.nom);
																										
													historise_etat_fixe.fileattenteetat=[];
													historise_etat_fixe.fileattentedata=[];
													//if (histo_mois== jour_fin_mois+' 23:59'){
														logger('DEBUG',{msg:'D�but calcul histo mois'},'automation_'+historise_etat_fixe.nom);
////-------------------	
														//Calcul des min max et moy pour chaque expression des p�riph�rique du mois en cours
														//retourne une seule ligne par p�riph�rique
														var date_sql = date_mois;
														var sql="select  h.uuid, max(expr1_max*1) expr1_max, min(expr1_min*1) expr1_min, round(avg(expr1_moy*1),2) expr1_moy "
																				+", max(expr2_max*1) expr2_max, min(expr2_min*1) expr2_min, round(avg(expr2_moy*1),2) expr2_moy "
																				+", max(expr3_max*1) expr3_max, min(expr3_min*1) expr3_min, round(avg(expr3_moy*1),2) expr3_moy "
																				+", max(expr4_max*1) expr4_max, min(expr4_min*1) expr4_min, round(avg(expr4_moy*1),2) expr4_moy "
																				+", max(expr5_max*1) expr5_max, min(expr5_min*1) expr5_min, round(avg(expr5_moy*1),2) expr5_moy "
																				+", max(expr6_max*1) expr6_max, min(expr6_min*1) expr6_min, round(avg(expr6_moy*1),2) expr6_moy "
																				+", max(expr7_max*1) expr7_max, min(expr7_min*1) expr7_min, round(avg(expr7_moy*1),2) expr7_moy "
																				+", max(etat_max*1) etat_max, min(etat_min*1) etat_min, round(avg(etat_moy*1),2) etat_moy "
																				+"from  historique_jour h where "
																				+" strftime('%Y-%m',h.timestamp) = '"+date_sql+"'  "
																				+"group by h.uuid";
														global.obj.app.db.sqlorder(sql,
																function(rows){
																	
																	logger('DEBUG',{msg:'requete: '+sql,reponse:rows },'automation_'+historise_etat_fixe.nom);
																	if (rows) {	
																		var orderdelete_mois="delete from historique_mois where strftime('%Y-%m',timestamp)>=? ";
																		var datadelete_mois=[date_sql];
																		historise_etat_fixe.fileattenteetat.push(orderdelete_mois);
																		historise_etat_fixe.fileattentedata.push(datadelete_mois);
																		
																		/*var orderdelete_mois="delete from historique_mois where strftime('%Y-%m',timestamp)>='"+date_sql+"' ";
																		historise_etat_fixe.fileattenteetat.push(orderdelete_mois);*/
																		
																		
																		for (var l in rows){
																			
																			//histo mois							
																			var periph=obj.app.core.findobj(rows[l].uuid,'peripheriques');
																			if(!periph) periph=obj.app.core.findobj(rows[l].uuid,'peripheriques_chauffage');
																			
																			if (periph && periph.last_etat && periph.last_etat.expression){
																				var uuid=periph.uuid;
																				
																				var ordersql_mois= 'insert into historique_mois (';			
																				var colonnessql_mois="timestamp, uuid, etat, expr1, expr2, expr3, expr4, expr5, expr6, expr7 "
																					+", etat_unit, expr1_unit , expr2_unit, expr3_unit ,expr4_unit , expr5_unit, expr6_unit, expr7_unit "
																					+", expr1_max, expr1_min, expr1_moy "
																					+", expr2_max, expr2_min, expr2_moy "
																					+", expr3_max, expr3_min, expr3_moy "
																					+", expr4_max, expr4_min, expr4_moy "
																					+", expr5_max, expr5_min, expr5_moy "
																					+", expr6_max, expr6_min, expr6_moy "
																					+", expr7_max, expr7_min, expr7_moy "
																					+", etat_max, etat_min, etat_moy ";
																				var datasql_mois="?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?";
																				datasql_mois+=",?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?";
																				datasql_mois+=",?,?";	
																				
																				var dataarray_mois=[date_sql+"-01 01:00:00",uuid,
																						    periph.last_etat.expression.etat,periph.last_etat.expression.expr1,
																						    periph.last_etat.expression.expr2,periph.last_etat.expression.expr3,
																						    periph.last_etat.expression.expr4,periph.last_etat.expression.expr5,
																						    periph.last_etat.expression.expr6,periph.last_etat.expression.expr7,
																					        periph.last_etat.expression.etat_unit,periph.last_etat.expression.expr1_unit,
																					        periph.last_etat.expression.expr2_unit,periph.last_etat.expression.expr3_unit,
																					        periph.last_etat.expression.expr4_unit,periph.last_etat.expression.expr5_unit,
																					        periph.last_etat.expression.expr6_unit,periph.last_etat.expression.expr7_unit,
																					        rows[l].expr1_max,rows[l].expr1_min,rows[l].expr1_moy,
																							rows[l].expr2_max,rows[l].expr2_min,rows[l].expr2_moy,
																							rows[l].expr3_max,rows[l].expr3_min,rows[l].expr3_moy,
																							rows[l].expr4_max,rows[l].expr4_min,rows[l].expr4_moy,
																							rows[l].expr5_max,rows[l].expr5_min,rows[l].expr5_moy,
																							rows[l].expr6_max,rows[l].expr6_min,rows[l].expr6_moy,
																							rows[l].expr7_max,rows[l].expr7_min,rows[l].expr7_moy,	
																							rows[l].etat_max,rows[l].etat_min,rows[l].etat_moy];
																				ordersql_mois+=colonnessql_mois+") values ("+datasql_mois+");";		

																				historise_etat_fixe.fileattenteetat.push(ordersql_mois);
																				historise_etat_fixe.fileattentedata.push(dataarray_mois);
																			}

																		}
																		global.obj.app.db.sqltrans(historise_etat_fixe.fileattenteetat,function(nborder){
																			historise_etat_fixe.fileattenteetat.splice(0,nborder);
																			historise_etat_fixe.fileattentedata.splice(0,nborder);
																			logger('INFO','historisation de '+nborder+' p�riph�riques dans historique_mois','automation_'+historise_etat_fixe.nom);
																			
																			logger('DEBUG',{msg:'Fin calcul histo mois'},'automation_'+historise_etat_fixe.nom);
																			historise_etat_fixe.fileattenteetat=[];
																			historise_etat_fixe.fileattentedata=[];
																			//if (histo_an=='12-31 23:59'){
																				logger('DEBUG',{msg:'D�but calcul histo an'},'automation_'+historise_etat_fixe.nom);
////-------------------	
																				//Calcul des min max et moy pour chaque expression des p�riph�rique de l'ann�e en cours
																				//retourne une seule ligne par p�riph�rique
																				var date_sql = date_an;
																				var sql="select  h.uuid, max(expr1_max*1) expr1_max, min(expr1_min*1) expr1_min, round(avg(expr1_moy*1),2) expr1_moy "
																									+", max(expr2_max*1) expr2_max, min(expr2_min*1) expr2_min, round(avg(expr2_moy*1),2) expr2_moy "
																									+", max(expr3_max*1) expr3_max, min(expr3_min*1) expr3_min, round(avg(expr3_moy*1),2) expr3_moy "
																									+", max(expr4_max*1) expr4_max, min(expr4_min*1) expr4_min, round(avg(expr4_moy*1),2) expr4_moy "
																									+", max(expr5_max*1) expr5_max, min(expr5_min*1) expr5_min, round(avg(expr5_moy*1),2) expr5_moy "
																									+", max(expr6_max*1) expr6_max, min(expr6_min*1) expr6_min, round(avg(expr6_moy*1),2) expr6_moy "
																									+", max(expr7_max*1) expr7_max, min(expr7_min*1) expr7_min, round(avg(expr7_moy*1),2) expr7_moy "
																									+", max(etat_max*1) etat_max, min(etat_min*1) etat_min, round(avg(etat_moy*1),2) etat_moy "
																										+"from historique_mois h where "
																										+" strftime('%Y',h.timestamp) = '"+date_sql+"'  "
																										+"group by h.uuid";
																				global.obj.app.db.sqlorder(sql,
																						function(rows){
																							
																							logger('DEBUG',{msg:'requete: '+sql,reponse:rows },'automation_'+historise_etat_fixe.nom);
																							if (rows) {	
																								var orderdelete_an="delete from historique_an where strftime('%Y',timestamp)>=? ";
																								var datadelete_an=[date_sql];
																								historise_etat_fixe.fileattenteetat.push(orderdelete_an);
																								historise_etat_fixe.fileattentedata.push(datadelete_an);
																								/*var orderdelete_an="delete from historique_an where strftime('%Y',timestamp)>='"+date_sql+"' ";
																								historise_etat_fixe.fileattenteetat.push(orderdelete_an);*/
																								
																								for (var l in rows){
																									
																									//histo an							
																									var periph=obj.app.core.findobj(rows[l].uuid,'peripheriques');
																									if(!periph) periph=obj.app.core.findobj(rows[l].uuid,'peripheriques_chauffage');
																									
																									if (periph && periph.last_etat && periph.last_etat.expression){
																										var uuid=rows[l].uuid;
																										
																										var ordersql_an= 'insert into historique_an (';			
																										var colonnessql_an="timestamp, uuid, etat, expr1, expr2, expr3, expr4, expr5, expr6, expr7 "
																											+", etat_unit, expr1_unit , expr2_unit, expr3_unit ,expr4_unit , expr5_unit, expr6_unit, expr7_unit "
																											+", expr1_max, expr1_min, expr1_moy "
																											+", expr2_max, expr2_min, expr2_moy "
																											+", expr3_max, expr3_min, expr3_moy "
																											+", expr4_max, expr4_min, expr4_moy "
																											+", expr5_max, expr5_min, expr5_moy "
																											+", expr6_max, expr6_min, expr6_moy "
																											+", expr7_max, expr7_min, expr7_moy "
																											+", etat_max, etat_min, etat_moy ";
																										var datasql_an="?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?";
																										datasql_an+=",?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?";
																										datasql_an+=",?,?";	
																										
																										var dataarray_an=[date_sql+"-01-01 01:00:00",uuid,
																												    periph.last_etat.expression.etat,periph.last_etat.expression.expr1,
																												    periph.last_etat.expression.expr2,periph.last_etat.expression.expr3,
																												    periph.last_etat.expression.expr4,periph.last_etat.expression.expr5,
																												    periph.last_etat.expression.expr6,periph.last_etat.expression.expr7,
																											        periph.last_etat.expression.etat_unit,periph.last_etat.expression.expr1_unit,
																											        periph.last_etat.expression.expr2_unit,periph.last_etat.expression.expr3_unit,
																											        periph.last_etat.expression.expr4_unit,periph.last_etat.expression.expr5_unit,
																											        periph.last_etat.expression.expr6_unit,periph.last_etat.expression.expr7_unit,
																											        rows[l].expr1_max,rows[l].expr1_min,rows[l].expr1_moy,
																													rows[l].expr2_max,rows[l].expr2_min,rows[l].expr2_moy,
																													rows[l].expr3_max,rows[l].expr3_min,rows[l].expr3_moy,
																													rows[l].expr4_max,rows[l].expr4_min,rows[l].expr4_moy,
																													rows[l].expr5_max,rows[l].expr5_min,rows[l].expr5_moy,
																													rows[l].expr6_max,rows[l].expr6_min,rows[l].expr6_moy,
																													rows[l].expr7_max,rows[l].expr7_min,rows[l].expr7_moy,	
																													rows[l].etat_max,rows[l].etat_min,rows[l].etat_moy];
																										ordersql_an+=colonnessql_an+") values ("+datasql_an+");";		

																										historise_etat_fixe.fileattenteetat.push(ordersql_an);
																										historise_etat_fixe.fileattentedata.push(dataarray_an);
																									}

																								}
																								global.obj.app.db.sqltrans(historise_etat_fixe.fileattenteetat,function(nborder){
																									historise_etat_fixe.fileattenteetat.splice(0,nborder);
																									historise_etat_fixe.fileattentedata.splice(0,nborder);
																									logger('INFO','historisation de '+nborder+' p�riph�riques dans historique_an','automation_'+historise_etat_fixe.nom);
																									
																									logger('DEBUG',{msg:'Fin calcul histo an'},'automation_'+historise_etat_fixe.nom);

																								},historise_etat_fixe.fileattentedata);
																							}
																						});
////-------------------															
																			//}
																		},historise_etat_fixe.fileattentedata);
																	}
																});
////-------------------															
													//}
												},historise_etat_fixe.fileattentedata);
											}
										});
////-------------------					
							}
						},historise_etat_fixe.fileattentedata);
					}
				});
	}
}
/*
 * 
 * pour maj base de données :
 * 
insert into historique_heure (uuid,expr1,expr1_max,expr1_min,expr1_moy
                                     ,expr2,expr2_max,expr2_min,expr2_moy
									 ,expr3,expr3_max,expr3_min,expr3_moy
									 ,expr4,expr4_max,expr4_min,expr4_moy
									 ,expr5,expr5_max,expr5_min,expr5_moy
									 ,expr6,expr6_max,expr6_min,expr6_moy
									 ,expr7,expr7_max,expr7_min,expr7_moy
									 ,etat,etat_max,etat_min,etat_moy
									 ,etat_unit,expr1_unit,expr2_unit,expr3_unit,expr4_unit,expr5_unit,expr6_unit,expr7_unit,
									 timestamp)

select  h.uuid, max(expr1*1), max(expr1*1) expr1_max, min(expr1*1) expr1_min, round(avg(expr1*1),2) expr1_moy 
							, max(expr2*1), max(expr2*1) expr2_max, min(expr2*1) expr2_min, round(avg(expr2*1),2) expr2_moy 
							, max(expr3*1), max(expr3*1) expr3_max, min(expr3*1) expr3_min, round(avg(expr3*1),2) expr3_moy 
							, max(expr4*1), max(expr4*1) expr4_max, min(expr4*1) expr4_min, round(avg(expr4*1),2) expr4_moy 
							, max(expr5*1), max(expr5*1) expr5_max, min(expr5*1) expr5_min, round(avg(expr5*1),2) expr5_moy 
							, max(expr6*1), max(expr6*1) expr6_max, min(expr6*1) expr6_min, round(avg(expr6*1),2) expr6_moy 
							, max(expr7*1), max(expr7*1) expr7_max, min(expr7*1) expr7_min, round(avg(expr7*1),2) expr7_moy 
							, max(etat*1), max(etat*1) etat_max, min(etat*1) etat_min, round(avg(etat*1),2) etat_moy 
							, max(etat_unit), max(expr1_unit) , max(expr2_unit), max(expr3_unit) ,max(expr4_unit) , max(expr5_unit), 
							max(expr6_unit), max(expr7_unit),strftime('%Y-%m-%d %H',h.timestamp)||':00:00'
							from 
							  historique  h  

group by h.uuid,strftime('%Y-%m-%d %H',h.timestamp)||':00:00';




insert into historique_jour (uuid,expr1,expr1_max,expr1_min,expr1_moy
                                     ,expr2,expr2_max,expr2_min,expr2_moy
									 ,expr3,expr3_max,expr3_min,expr3_moy
									 ,expr4,expr4_max,expr4_min,expr4_moy
									 ,expr5,expr5_max,expr5_min,expr5_moy
									 ,expr6,expr6_max,expr6_min,expr6_moy
									 ,expr7,expr7_max,expr7_min,expr7_moy
									 ,etat,etat_max,etat_min,etat_moy
									 ,etat_unit,expr1_unit,expr2_unit,expr3_unit,expr4_unit,expr5_unit,expr6_unit,expr7_unit,
									 timestamp)

select  h.uuid, max(expr1*1), max(expr1*1) expr1_max, min(expr1*1) expr1_min, round(avg(expr1*1),2) expr1_moy 
							, max(expr2*1), max(expr2*1) expr2_max, min(expr2*1) expr2_min, round(avg(expr2*1),2) expr2_moy 
							, max(expr3*1), max(expr3*1) expr3_max, min(expr3*1) expr3_min, round(avg(expr3*1),2) expr3_moy 
							, max(expr4*1), max(expr4*1) expr4_max, min(expr4*1) expr4_min, round(avg(expr4*1),2) expr4_moy 
							, max(expr5*1), max(expr5*1) expr5_max, min(expr5*1) expr5_min, round(avg(expr5*1),2) expr5_moy 
							, max(expr6*1), max(expr6*1) expr6_max, min(expr6*1) expr6_min, round(avg(expr6*1),2) expr6_moy 
							, max(expr7*1), max(expr7*1) expr7_max, min(expr7*1) expr7_min, round(avg(expr7*1),2) expr7_moy 
							, max(etat*1), max(etat*1) etat_max, min(etat*1) etat_min, round(avg(etat*1),2) etat_moy 
							, max(etat_unit), max(expr1_unit) , max(expr2_unit), max(expr3_unit) ,max(expr4_unit) , max(expr5_unit), 
							max(expr6_unit), max(expr7_unit),strftime('%Y-%m-%d',h.timestamp)||' 01:00:00'
							from  historique  h   
group by h.uuid,strftime('%Y-%m-%d',h.timestamp)||' 01:00:00';



insert into historique_mois (uuid,expr1,expr1_max,expr1_min,expr1_moy
                                     ,expr2,expr2_max,expr2_min,expr2_moy
									 ,expr3,expr3_max,expr3_min,expr3_moy
									 ,expr4,expr4_max,expr4_min,expr4_moy
									 ,expr5,expr5_max,expr5_min,expr5_moy
									 ,expr6,expr6_max,expr6_min,expr6_moy
									 ,expr7,expr7_max,expr7_min,expr7_moy
									 ,etat,etat_max,etat_min,etat_moy
									 ,etat_unit,expr1_unit,expr2_unit,expr3_unit,expr4_unit,expr5_unit,expr6_unit,expr7_unit,
									 timestamp)

select  h.uuid, max(expr1*1), max(expr1*1) expr1_max, min(expr1*1) expr1_min, round(avg(expr1*1),2) expr1_moy 
							, max(expr2*1), max(expr2*1) expr2_max, min(expr2*1) expr2_min, round(avg(expr2*1),2) expr2_moy 
							, max(expr3*1), max(expr3*1) expr3_max, min(expr3*1) expr3_min, round(avg(expr3*1),2) expr3_moy 
							, max(expr4*1), max(expr4*1) expr4_max, min(expr4*1) expr4_min, round(avg(expr4*1),2) expr4_moy 
							, max(expr5*1), max(expr5*1) expr5_max, min(expr5*1) expr5_min, round(avg(expr5*1),2) expr5_moy 
							, max(expr6*1), max(expr6*1) expr6_max, min(expr6*1) expr6_min, round(avg(expr6*1),2) expr6_moy 
							, max(expr7*1), max(expr7*1) expr7_max, min(expr7*1) expr7_min, round(avg(expr7*1),2) expr7_moy 
							, max(etat*1), max(etat*1) etat_max, min(etat*1) etat_min, round(avg(etat*1),2) etat_moy 
							, max(etat_unit), max(expr1_unit) , max(expr2_unit), max(expr3_unit) ,max(expr4_unit) , max(expr5_unit), 
							max(expr6_unit), max(expr7_unit),strftime('%Y-%m',h.timestamp)||'-01 01:00:00'
							from  historique  h 
group by h.uuid,strftime('%Y-%m',h.timestamp)||'-01 01:00:00';






insert into historique_an (uuid,expr1,expr1_max,expr1_min,expr1_moy
                                     ,expr2,expr2_max,expr2_min,expr2_moy
									 ,expr3,expr3_max,expr3_min,expr3_moy
									 ,expr4,expr4_max,expr4_min,expr4_moy
									 ,expr5,expr5_max,expr5_min,expr5_moy
									 ,expr6,expr6_max,expr6_min,expr6_moy
									 ,expr7,expr7_max,expr7_min,expr7_moy
									 ,etat,etat_max,etat_min,etat_moy
									 ,etat_unit,expr1_unit,expr2_unit,expr3_unit,expr4_unit,expr5_unit,expr6_unit,expr7_unit,
									 timestamp)

select  h.uuid, max(expr1*1), max(expr1*1) expr1_max, min(expr1*1) expr1_min, round(avg(expr1*1),2) expr1_moy 
							, max(expr2*1), max(expr2*1) expr2_max, min(expr2*1) expr2_min, round(avg(expr2*1),2) expr2_moy 
							, max(expr3*1), max(expr3*1) expr3_max, min(expr3*1) expr3_min, round(avg(expr3*1),2) expr3_moy 
							, max(expr4*1), max(expr4*1) expr4_max, min(expr4*1) expr4_min, round(avg(expr4*1),2) expr4_moy 
							, max(expr5*1), max(expr5*1) expr5_max, min(expr5*1) expr5_min, round(avg(expr5*1),2) expr5_moy 
							, max(expr6*1), max(expr6*1) expr6_max, min(expr6*1) expr6_min, round(avg(expr6*1),2) expr6_moy 
							, max(expr7*1), max(expr7*1) expr7_max, min(expr7*1) expr7_min, round(avg(expr7*1),2) expr7_moy 
							, max(etat*1), max(etat*1) etat_max, min(etat*1) etat_min, round(avg(etat*1),2) etat_moy 
							, max(etat_unit), max(expr1_unit) , max(expr2_unit), max(expr3_unit) ,max(expr4_unit) , max(expr5_unit), 
							max(expr6_unit), max(expr7_unit),strftime('%Y',h.timestamp)||'-01-01 01:00:00'
							from  historique  h  where  h.timestamp>'2017-04-04 15:00:00'
group by h.uuid,strftime('%Y',h.timestamp)||'-01-01 01:00:00';
 * 
 * 
 * 
 * */

module.exports = historise_etat_fixe;