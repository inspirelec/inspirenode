/**
 * New node file
 */
var programmation_all_test={id:64,nom:"programmation_all_test",etat:"OFF",lastrun:null};
var infirstappliqueprevious=false;
var calculconsigneencours=false;
var timer=null;


programmation_all_test.start=function(){
	if (programmation_all_test.etat=='OFF') {
		programmation_all_test.etat='ON';
		logger('INFO',{msg:'demarrage automation',nom:this.nom},'startstop');
		//obj.app.serveur.on('consigne_chauffage.controleChauffage',function(){appliquenextconsigne();});
		obj.app.serveur.on('mode.last_etat.added',function(){appliquepreviousconsigne();});	
		obj.app.serveur.on('mode.last_etat.changed',function(){appliquepreviousconsigne();});
		obj.app.serveur.on('programmation_consigne.changed',function(){appliquepreviousconsigne();});
		//appliquepreviousconsigne();
		setTimeout(function(){
			timer=setInterval(function(){
				appliquenextconsigne();
				setTimeout(function(){appliquemodediffere();},20000);
				var datetimeactuel=new Date();
				logger('INFO',{msg:'Controle date ',datetimeactuel:datetimeactuel},'automation_'+programmation_all_test.nom);
				datetimeactuel.setTime( datetimeactuel.getTime() - datetimeactuel.getTimezoneOffset()*60*1000 );
				logger('INFO',{msg:'Controle date + timezone GMT+ n Heures',datetimeactuel:datetimeactuel,decalage:datetimeactuel.getTimezoneOffset()},'automation_'+programmation_all_test.nom);
				
			}, 60000);			
		},12000);
	}
}

programmation_all_test.stop=function(){
	if (programmation_all_test.etat=='ON') {
		programmation_all_test.etat='OFF';
		logger('INFO',{msg:'extinction automation',nom:this.nom},'startstop');
		//obj.app.serveur.removeListener('consigne_chauffage.controleChauffage',function(){appliquenextconsigne();});
		obj.app.serveur.removeListener('mode.last_etat.added',function(){appliquepreviousconsigne();});
		obj.app.serveur.removeListener('mode.last_etat.changed',function(){appliquepreviousconsigne();});
		obj.app.serveur.removeListener('programmation_consigne.changed',function(){appliquepreviousconsigne();});	
		clearInterval(timer);
	}
}



function deletemodediffere(){
	var sql = 'delete from modeactivationdiff';
	global.obj.app.db.sqltrans(sql,function(){});
}


function appliquemodediffere(){
	var sql='Select * from modeactivationdiff;';
	
	global.obj.app.db.sqlorder(sql,
		function(rows){
			if (rows && rows[0] && rows[0].mode) {
				var diff={mode:rows[0].mode,heure:rows[0].heure,	date:rows[0].date};
				var annee=parseInt(req.moment().format('YYYY'));
				var mois=parseInt(req.moment().format('MM'));
				var jour=parseInt(req.moment().format('DD'));
				var heure=parseInt(req.moment().format('HH'));
				var minutes=parseInt(req.moment().format('mm'));
				/*date=2016-01-08&heure=6h00*/
				var datearray=parseInt(diff.date.split('-'));
				var timearray=parseInt(diff.heure.split('h'));
				
				if ((datearray[0]<annee ) ||
						(datearray[0]<=annee && datearray[1]<mois ) ||
						(datearray[0]<=annee && datearray[1]<=mois && datearray[2]<jour ) ||
						(datearray[0]<=annee && datearray[1]<=mois && datearray[2]<=jour &&	timearray[0]<heure) ||
						 (datearray[0]<=annee && datearray[1]<=mois && datearray[2]<=jour &&	timearray[0]<=heure && timearray[1]<=minutes)
						){
					global.req.mode.set_etat(diff.mode,function(){
						
					})
				}
			}
	});

}


function appliquenextconsigne(){
	appliqueconsigne();
}
function appliquepreviousconsigne(){
	appliqueconsigne(true);
}
function appliqueconsigne(forceprevious){
	//if (calculconsigneencours) return;
	if (programmation_all_test.etat=='OFF') return;
	//calculconsigneencours=true;
		global.req.mode.get_etat(function(err,mode){
			var mode_actuel=0;
			if (mode) mode_actuel=mode.id;
			logger('INFO',{msg:'-----recherche mode fait appliquepreviousconsigne',mode_actuel:mode_actuel},'automation_'+programmation_all_test.nom);
			
			for (var categ_item in global.obj.categories){
				if (global.obj.categories[categ_item].programmable=='O'){
					get_typejouractuel(global.obj.categories[categ_item],mode_actuel,
							function(rep,categorie){
						
								
								var peripheriques_chauffage=[];
								for (var c in global.obj.peripheriques_chauffage){
									if (global.obj.peripheriques_chauffage[c].ecriture_type!='TEMPERATURE' &&
											global.obj.peripheriques_chauffage[c].ecriture_type!='SANS' &&
											global.obj.peripheriques_chauffage[c].categorie.id==categorie.id){
										peripheriques_chauffage.push(global.obj.peripheriques_chauffage[c]);
									}
								}
								for (var c in global.obj.peripheriquesdeportes){
									if (global.obj.peripheriquesdeportes[c].ecriture_type!='TEMPERATURE' &&
											global.obj.peripheriquesdeportes[c].ecriture_type!='SANS' &&
											global.obj.peripheriquesdeportes[c].categorie.id==categorie.id){
										peripheriques_chauffage.push(global.obj.peripheriquesdeportes[c]);
									}
								}
								for (var c in global.obj.peripheriques){
									if (global.obj.peripheriques[c].ecriture_type!='TEMPERATURE' &&
											global.obj.peripheriques[c].categorie &&
											global.obj.peripheriques[c].categorie.id==categorie.id){
										peripheriques_chauffage.push(global.obj.peripheriques[c]);
									}
								}
								
								for (var t in rep){
									
									if (rep[t].previous || rep[t].next) {
										for (var c in peripheriques_chauffage) {
											if (t==peripheriques_chauffage[c].id /*&&
														peripheriques_chauffage[c].ecriture_type=='TEMPERATURECONSIGNE'*/){
												var consigneaappliquer=null;
												var periode_minutes=3;
												logger('INFO',{tag:t,type:'previous',dans:rep[t].previous.ecart_minutes,valeur:rep[t].previous.valeur},'automation_'+programmation_all_test.nom);
												logger('INFO',{tag:t,type:'next',dans:rep[t].next.ecart_minutes,valeur:rep[t].next.valeur},'automation_'+programmation_all_test.nom);
												if (rep[t].previous && forceprevious) {
													consigneaappliquer=rep[t].previous;
													logger('INFO',{msg:'consigne a appliquer car force consigne precedente',forceprevious:forceprevious,val:consigneaappliquer.valeur ,tag: ' tag ' +t},'automation_'+programmation_all_test.nom);
												}
												if (rep[t].previous && rep[t].previous.ecart_minutes<=periode_minutes) {
													consigneaappliquer=rep[t].previous;
													logger('INFO',{msg:'consigne a appliquer car difference time entre previous consigne ok',ecart_min:rep[t].previous.ecart_minutes,val:consigneaappliquer.valeur ,tag: ' tag ' +t},'automation_'+programmation_all_test.nom);
													
												}  if (rep[t].previous && (!peripheriques_chauffage[c].last_etat ||
																		!peripheriques_chauffage[c].last_etat.expression /*||
																		!peripheriques_chauffage[c].last_etat.expression.etat*/)){
													consigneaappliquer=rep[t].previous;
													logger('WARNING',{msg:'consigne a appliquer car pas d etat pour ce periph de chauffe',val:consigneaappliquer.valeur ,id: ' id ' +t,etat:peripheriques_chauffage[c].last_etat+', '+peripheriques_chauffage[c].last_etat.expression+', '+peripheriques_chauffage[c].last_etat.expression.etat },'automation_'+programmation_all_test.nom);
													
												} if (rep[t].next && rep[t].next.ecart_minutes<=periode_minutes) {
													consigneaappliquer=rep[t].next;
													logger('INFO',{msg:'consigne a appliquer car difference time entre next consigne ok',ecart_min:rep[t].next.ecart_minutes,val:consigneaappliquer.valeur ,tag: ' tag ' +t},'automation_'+programmation_all_test.nom);
													
												}
												if (consigneaappliquer){	
													logger('INFO',{nom:programmation_all_test.nom,idp:programmation_all_test.id
														,msg:'--Application nouvelle consigne--'
															,res:'---> Consigne passe à '+consigneaappliquer.valeur + ' tag ' +t
													},'automation_'+programmation_all_test.nom);
													logger('INFO',{nom:programmation_all_test.nom,idp:programmation_all_test.id
														,msg:'--Application nouvelle consigne--'
															,res:'---> Consigne passe à '+consigneaappliquer.valeur + ' tag ' +t
													},'automation_'+programmation_all_test.nom+'_lite');		
													var valeur=consigneaappliquer.valeur;
													var cmd='DIM';
													if (valeur=='ON') {
														valeur=peripheriques_chauffage[c].ecriture_max_value;
														cmd='ON'
													} else if (valeur=='OFF') {
                                                        valeur=peripheriques_chauffage[c].ecriture_min_value;
                                                        cmd='OFF'
                                                    } else if (valeur=='UP') {
                                                        valeur=peripheriques_chauffage[c].ecriture_max_value;
                                                        cmd='UP'
                                                    } else if (valeur=='DOWN') {
                                                        valeur=peripheriques_chauffage[c].ecriture_min_value;
                                                        cmd='DOWN'
                                                    }
													
														peripheriques_chauffage[c].set_etat(cmd,valeur,
															function (c,val_previous,mode_nom){
																return function(rep){
																	if (!peripheriques_chauffage[c].last_etat.histo_consigne){
																		peripheriques_chauffage[c].last_etat.histo_consigne=[];
																	}
																	peripheriques_chauffage[c].last_etat.histo_consigne.push({date_heure:global.req.moment().format('DD/MM/YY HH:mm:ss.SSSS'),consigne:val_previous,id:c,mode:mode_nom,funct:"appliquepreviousconsigne"});
																	if (peripheriques_chauffage[c].last_etat.histo_consigne.length>15) {
																		peripheriques_chauffage[c].last_etat.histo_consigne.shift();
																	}
																};
															}(c,valeur,mode.nom),'automation_programmation');									
													
		
												}
											}
										}
									}
		
								}
					
								global.obj.app.serveur.emit('programmation_consigne.appliquepreviousconsigne');
								infirstappliqueprevious=true;
								//calculconsigneencours=false;
					});
				};
			}
		});
}


function get_typejouractuel(categorie,mode_id,callback){
	
	var sql="select j.typejour from joursconsigne j" +
			"  where date(date_debut)<=date('now')" +
			"    and date(date_fin)>=date('now')" +
			"  order by typejour asc limit 1";
	
	global.obj.app.db.sqlorder(sql,
	function (rows) {
		if (rows && rows[0]){
			if(rows[0].typejour=='FE'){
				get_vacanceferie_consigne('FE',categorie,mode_id,callback);
				
			} else if (rows[0].typejour=='VA') {
				get_vacanceferie_consigne('VA',categorie,mode_id,callback);
				
			} else {
				/*type de jour inconnu = programmtion standard des jours de semaine*/
				get_nextprevious_consigne(categorie,mode_id,callback);
			}
		} else {
			/* pas d enregistrement = traitement programmtion standard des jours de semaine*/
			get_nextprevious_consigne(categorie,mode_id,callback);
			
		}
	});
	
}

function get_vacanceferie_consigne(type_jour,categorie,mode_id,callback){
	var sql="select * from ("+
	" SELECT id tag,dateactuel,'now' source,  strftime('%w',dateactuel)+0 jour_num,"+
	"		case when strftime('%w',dateactuel)+0=1 then 'Lu'  " +
	"when strftime('%w',dateactuel)+0=2 then 'Ma'   " +
	"when strftime('%w',dateactuel)+0=3 then 'Me'   " +
	"when strftime('%w',dateactuel)+0=4 then 'Je'  " +
	"when strftime('%w',dateactuel)+0=5 then 'Ve'   " +
	"when strftime('%w',dateactuel)+0=6 then 'Sa'  " +
	"when strftime('%w',dateactuel)+0=0 then 'Di'  end id_jours,"+
	"	       strftime('%H',dateactuel)+0 heur_num,strftime('%M',dateactuel)+0 minu_num,'' valeur,'' categorie,null peripherique,'' heure"+
	" from tag, (select datetime('now',/*'-3 day','-21 hours',*/'localtime') dateactuel)"+
	" union"+
	" SELECT tag.id tag,dateactuel,'now' source,  strftime('%w',dateactuel)+0 jour_num,"+
	"		case when strftime('%w',dateactuel)+0=1 then 'Lu'  " +
	"when strftime('%w',dateactuel)+0=2 then 'Ma'   " +
	"when strftime('%w',dateactuel)+0=3 then 'Me'   " +
	"when strftime('%w',dateactuel)+0=4 then 'Je'  " +
	"when strftime('%w',dateactuel)+0=5 then 'Ve'   " +
	"when strftime('%w',dateactuel)+0=6 then 'Sa'  " +
	"when strftime('%w',dateactuel)+0=0 then 'Di'  end id_jours,"+
	"	       strftime('%H',dateactuel)+0 heur_num,strftime('%M',dateactuel)+0 minu_num,'' valeur,'' categorie,p.id peripherique,'' heure"+
	" from tag, peripherique_tag pt,peripherique p,categorie c, (select datetime('now',/*'-3 day','-21 hours',*/'localtime') dateactuel)"+
	" where tag.id=pt.id_tag and p.id=pt.id_peripherique and c.id=p.categorie_id and c.programmable='O'"+
	"  and c.id='"+categorie.id+"'"+
	" union"+
	" select tag,''|| id_consigne_temp source,''dateactuel," +
	"         0+decal jour_num," +
	"         id_jours," +
	"         case when substr(heure,3,1)='h' then substr(heure,1,2)+0 else substr(heure,1,1)+0 end," +
	"         case when substr(heure,3,1)='h' then substr(heure,4,2)+0 else substr(heure,3,2)+0 end," +
	"         c.valeur,c.categorie,c.peripherique,c.heure" +
	" from consigne_temp_jours j" +
	"  inner join consigne_temp c on c.id=j.id_consigne_temp" +
	"  cross join (select -1 decal union select 0 decal union select 1 decal union select 2 decal union" +
	"              select 3 decal union select 4 decal union select 5 decal union select 6 decal union select 7 decal )	" +
	" where mode='"+mode_id+"' and (categorie isnull or categorie='"+categorie.id+"')" +
	"  and id_jours ='"+type_jour+"'"+ /*VA ou FE*/
	" )			"+
	" order by tag+0,peripherique+0, jour_num,heur_num+0,minu_num+0";
	
	get_consigne(sql,categorie,mode_id,callback)
}


function get_nextprevious_consigne(categorie,mode_id,callback){

	var sql="select * from ("+
			" SELECT id tag,dateactuel,'now' source,  strftime('%w',dateactuel)+0 jour_num,"+
			"		case when strftime('%w',dateactuel)+0=1 then 'Lu'  " +
			"when strftime('%w',dateactuel)+0=2 then 'Ma'   " +
			"when strftime('%w',dateactuel)+0=3 then 'Me'   " +
			"when strftime('%w',dateactuel)+0=4 then 'Je'  " +
			"when strftime('%w',dateactuel)+0=5 then 'Ve'   " +
			"when strftime('%w',dateactuel)+0=6 then 'Sa'  " +
			"when strftime('%w',dateactuel)+0=0 then 'Di'  end id_jours,"+
			"	       strftime('%H',dateactuel)+0 heur_num,strftime('%M',dateactuel)+0 minu_num,'' valeur,'' categorie,null peripherique,'' heure"+
			" from tag, (select datetime('now',/*'-3 day','-21 hours',*/'localtime') dateactuel)"+
			" union"+
			" SELECT tag.id tag,dateactuel,'now' source,  strftime('%w',dateactuel)+0 jour_num,"+
			"		case when strftime('%w',dateactuel)+0=1 then 'Lu'  " +
			"when strftime('%w',dateactuel)+0=2 then 'Ma'   " +
			"when strftime('%w',dateactuel)+0=3 then 'Me'   " +
			"when strftime('%w',dateactuel)+0=4 then 'Je'  " +
			"when strftime('%w',dateactuel)+0=5 then 'Ve'   " +
			"when strftime('%w',dateactuel)+0=6 then 'Sa'  " +
			"when strftime('%w',dateactuel)+0=0 then 'Di'  end id_jours,"+
			"	       strftime('%H',dateactuel)+0 heur_num,strftime('%M',dateactuel)+0 minu_num,'' valeur,'' categorie,p.id peripherique,'' heure"+
			" from tag, peripherique_tag pt,peripherique p,categorie c, (select datetime('now',/*'-3 day','-21 hours',*/'localtime') dateactuel)"+
			" where tag.id=pt.id_tag and p.id=pt.id_peripherique and c.id=p.categorie_id and c.programmable='O'"+
			"  and c.id='"+categorie.id+"'"+
			" union"+
			" select tag,''|| id_consigne_temp source,''dateactuel,"+
			"		case when id_jours='Lu' then 1+decal " +
			"when id_jours='Ma' then 2+decal " +
			"when id_jours='Me' then 3+decal " +
			"when id_jours='Je' then 4+decal " +
			"when id_jours='Ve' then 5+decal " +
			"when id_jours='Sa' then 6+decal " +
			"when id_jours='Di' then 0+decal end jour_num,"+
			"		id_jours,case when substr(heure,3,1)='h' then substr(heure,1,2)+0 else substr(heure,1,1)+0 end,case when substr(heure,3,1)='h' then substr(heure,4,2)+0 else substr(heure,3,2)+0 end,	c.valeur,c.categorie,c.peripherique,c.heure"+
			" from consigne_temp_jours j inner join consigne_temp c on c.id=j.id_consigne_temp	cross join (select -7 decal union select 0 decal union select 7 decal)"+
			" where mode='"+mode_id+"' and (categorie isnull or categorie='"+categorie.id+"')"+
			" )			"+
			" order by tag+0,peripherique+0, jour_num,heur_num+0,minu_num+0";
	//console.log(sql);
	get_consigne(sql,categorie,mode_id,callback);
}

function get_consigne(sql,categorie,mode_id,callback){
	global.obj.app.db.sqlorder(sql,
		function (mode_id,categorie,callback) {
			return function(r){
				var rows=r;
				var consigne_tag={mode_id:mode_id};
				if (rows) {
					logger('INFO',{nom:programmation_all_test.nom,idp:programmation_all_test.id
						,msg:'--Requete lignes previous et next consigne--',mode:mode_id,categorie:categorie.id,res:rows},'automation_'+programmation_all_test.nom);
					for (var l in rows ){
						var lig=l*1;
						/*if (rows[lig].source=='now' && lig<rows.length-1 && lig>0){
							console.log(lig,mode_id,categorie.id,rows[lig].dateactuel,rows[lig].heure,'--lig',lig,'tag',rows[lig].tag,'periph',rows[lig].peripherique)
							console.log(lig,mode_id,categorie.id,rows[lig-1].dateactuel,rows[lig-1].heure,'lig-1',lig-1,'tag',rows[lig-1].tag,'periph',rows[lig-1].peripherique)
							console.log(lig,mode_id,categorie.id,rows[lig+1].dateactuel,rows[lig+1].heure,'lig+1',lig+1,'tag',rows[lig+1].tag,'periph',rows[lig+1].peripherique)
						}*/
						if (rows[lig].source=='now'
							
							&& lig>0 && rows[lig-1].tag==rows[lig].tag && rows[lig-1].peripherique==rows[lig].peripherique
							&& lig<rows.length-1 && rows[lig+1].tag==rows[lig].tag && rows[lig+1].peripherique==rows[lig].peripherique){

							var idcons;
							if (rows[lig].peripherique){
								idcons=rows[lig].peripherique;
							} else {
								idcons='tag_'+rows[lig].tag;
							}
							logger('INFO',{nom:programmation_all_test.nom,idp:programmation_all_test.id
								,msg:'-------debut_tag-',lig:lig,tag:idcons},'automation_'+programmation_all_test.nom);
							
							consigne_tag[idcons]={tag_id:rows[lig].tag};
							consigne_tag[idcons].previous=rows[lig-1];
							consigne_tag[idcons].next=rows[lig+1];
							consigne_tag[idcons].now=rows[lig];
							
							var previousdepuis=(rows[lig].jour_num-rows[lig-1].jour_num)*24*60;
							previousdepuis+=(rows[lig].heur_num-rows[lig-1].heur_num)*60;
							previousdepuis+=(rows[lig].minu_num-rows[lig-1].minu_num);
							consigne_tag[idcons].previous.ecart_minutes=previousdepuis;
							
							var nextdans=(rows[lig+1].jour_num-rows[lig].jour_num)*24*60;
							nextdans+=(rows[lig+1].heur_num-rows[lig].heur_num)*60;
							nextdans+=(rows[lig+1].minu_num-rows[lig].minu_num);
							consigne_tag[idcons].next.ecart_minutes=nextdans;	
							logger('INFO',{nom:programmation_all_test.nom,idp:programmation_all_test.id
								,msg:'-------fin_tag-',lig:lig,tag:idcons,res:consigne_tag[idcons]},'automation_'+programmation_all_test.nom);

						}						
					}
				}
				logger('INFO',{nom:programmation_all_test.nom,idp:programmation_all_test.id
					,msg:'--Calcul previous et next consigne--',res:consigne_tag},'automation_'+programmation_all_test.nom);
				for (var t in consigne_tag){
					recurciseAffect_child(consigne_tag[t].tag_id,consigne_tag);
				}
				
				callback(consigne_tag,categorie);
			}
		}(mode_id,categorie,callback));	
	
}

function recurciseAffect_child(tagid,arraysevent){

		var tag=global.obj.app.core.findobj(tagid,'tags');
		if (tag){
			var tag_childrens=tag.get_child();
			
			for (var c in tag_childrens) {
				if (arraysevent['tag_'+tag_childrens[c].id] &&
						!arraysevent['tag_'+tagid].previous.peripherique){
					/*déjà une prog*/
				} else {
					var newele={};
					newele.tag_id=tag_childrens[c].id;
					newele.previous=arraysevent['tag_'+tagid].previous;
					newele.next=arraysevent['tag_'+tagid].next;
					newele.now=arraysevent['tag_'+tagid].now;
					arraysevent['tag_'+tag_childrens[c].id]=newele;
					recurciseAffect_child(tag_childrens[c].id,arraysevent);
				}
			}
		}

		
	
}

module.exports = programmation_all_test;