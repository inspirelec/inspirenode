/**
 * New node file
 */
var consigne_chauffage={id:1,nom:"consigne_chauffage",etat:"OFF",lastrun:null};
var timer=null;
var timercompteur=null;

consigne_chauffage.start=function(){
	if (consigne_chauffage.etat=='OFF') {
		consigne_chauffage.etat='ON';
		logger('INFO',{msg:'demarrage automation',nom:this.nom},'startstop');
		obj.app.serveur.on('periph_chauffage.update_etat_periphchauff',controleChauffage);
		/*Execution toutes les  60 secondes*/
		/*timercompteur=setInterval(function(){
				
		}, 60000);*/		
		timer=setInterval(function(){
			affectcompteur123();	
		}, 60000);
		
	
	}
}


consigne_chauffage.stop=function(){
	if (consigne_chauffage.etat=='ON') {
		consigne_chauffage.etat='OFF';
		logger('INFO',{msg:'extinction automation',nom:this.nom},'startstop');
		obj.app.serveur.removeListener('periph_chauffage.update_etat_periphchauff',controleChauffage);
		clearInterval(timer);
		/*clearInterval(timercompteur);*/
	}
}

function affectcompteur123(){
	var needcontrolechauffage=false;
	for (var c in global.obj.peripheriques_chauffage){
		if (global.obj.peripheriques_chauffage[c] && global.obj.peripheriques_chauffage[c].last_etat){
			if (global.obj.peripheriques_chauffage[c].last_etat.compteur
					&& global.obj.peripheriques_chauffage[c].last_etat.compteur<3) {
				global.obj.peripheriques_chauffage[c].last_etat.compteur=global.obj.peripheriques_chauffage[c].last_etat.compteur+1;
			} else {
				if(!global.obj.peripheriques_chauffage[c].last_etat.compteur) needcontrolechauffage=true;
				global.obj.peripheriques_chauffage[c].last_etat.compteur=1;
				
			}
		}
	}
	if (needcontrolechauffage) controleChauffage();
}

function controleChauffage(){
	var arraychaudiere=[];
	var arraychauffageVariable=[];
	var arraychauffageOnOff=[];
	logger('INFO',{msg:'--Controle etat chauffage/consigne--',nom:this.nom},'automation_'+consigne_chauffage.nom);
	for (var p in global.obj.peripheriques){
		try {
			if (global.obj.peripheriques[p].ecriture_type=="CHAUDIERE"
				&& global.obj.peripheriques[p].categorie.type=="element_de_chauffage")
				arraychaudiere.push(global.obj.peripheriques[p]);
			
			if (global.obj.peripheriques[p].ecriture_type=="VARIABLE"
				&& global.obj.peripheriques[p].categorie.type=="element_de_chauffage")
				arraychauffageVariable.push(global.obj.peripheriques[p]);
			
			if (global.obj.peripheriques[p].ecriture_type=="BINAIRE"
				&& global.obj.peripheriques[p].categorie.type=="element_de_chauffage")
				arraychauffageOnOff.push(global.obj.peripheriques[p]);
		} catch (e) {
			logger('ERROR',{msg:'probleme avec un peripherique',error:e,periph:global.obj.peripheriques[p]},'automation_'+consigne_chauffage.nom);
		}
	}
	var chaudiereNeedON=[];
	for (var c in global.obj.peripheriques_chauffage){
		
		var pc = global.obj.peripheriques_chauffage[c];
		try {
			if (pc.ecriture_type=="TEMPERATURECONSIGNE") {
				if (pc.last_etat && pc.last_etat.expression && pc.last_etat.expression.etat 
						&& pc.last_etat.expression.expr1_val && pc.last_etat.expression.expr1_val!=""){
					if (!global.obj.peripheriques_chauffage[c].last_etat.compteur)
						global.obj.peripheriques_chauffage[c].last_etat.compteur=1;
					if (!isNaN(pc.last_etat.expression.expr1_val) 
							&& !isNaN(pc.last_etat.expression.etat)) {
						var tempactuel=parseFloat(pc.last_etat.expression.expr1_val);
						var consigneactuel=parseFloat(pc.last_etat.expression.etat);
						logger('INFO',{msg:'-traitement consigne',periph_id:pc.id,periph_nom:pc.nom,
							tempactuel:tempactuel,consigneactuel:consigneactuel},'automation_'+consigne_chauffage.nom);
						//console.log(tempactuel + ' <> ' + consigneactuel);
						if(global.obj.peripheriques_chauffage[c]) {
							for (var ch in global.obj.peripheriques_chauffage[c].chaudiere){
								try {
									var chaudiere=global.obj.peripheriques_chauffage[c].chaudiere[ch];
									var limitbasse=0
									if (!isNaN(chaudiere.limitebasse)) limitbasse=parseFloat(chaudiere.limitebasse);
									var limitbasse2=0
									if (!isNaN(chaudiere.limitebasse2))limitbasse2=parseFloat(chaudiere.limitebasse2);
									var limithaute=0
									if (!isNaN(chaudiere.limitehaute)) limithaute=parseFloat(chaudiere.limitehaute);
									
									if (tempactuel<consigneactuel+limitbasse || tempactuel<consigneactuel+limitbasse2){
										chaudiereNeedON.push(chaudiere.id);
										global.obj.peripheriques_chauffage[c].last_etat.needchaudiere_ON=true;
										logger('INFO',{msg:'chaudiere a allumer pour ',chauffage_id:global.obj.peripheriques_chauffage[c].id,chauffage_nom:global.obj.peripheriques_chauffage[c].nom,
											chaudiere_id:chaudiere.id,chaudiere_nom:chaudiere.nom,
											limitbasse:limitbasse,limitbasse2:limitbasse2,limithaute:limithaute},'automation_'+consigne_chauffage.nom);
									} else {
										global.obj.peripheriques_chauffage[c].last_etat.needchaudiere_ON=false;
										logger('INFO',{msg:'chaudiere pas besoin pour ',chauffage_id:global.obj.peripheriques_chauffage[c].id,chauffage_nom:global.obj.peripheriques_chauffage[c].nom,
											chaudiere_id:chaudiere.id,chaudiere_nom:chaudiere.nom,
											limitbasse:limitbasse,limitbasse2:limitbasse2,limithaute:limithaute},'automation_'+consigne_chauffage.nom);
									}								
								} catch (e) {
									logger('ERROR',{msg:'probleme avec une chaudiere',error:e,chaudiere:chaudiere.id},'automation_'+consigne_chauffage.nom);
								}
	
							}
						}
						if (global.obj.peripheriques_chauffage[c]) {
							for (var ch in global.obj.peripheriques_chauffage[c].chauffage){
								//console.log(c);
								//console.log(ch);
								var chauffage=global.obj.peripheriques_chauffage[c].chauffage[ch];
								//console.log(chauffage.ecriture_type)
								try {
									if (chauffage.ecriture_type=="VARIABLE") {
										if (chauffage.last_etat && chauffage.last_etat.expression.expr1_val 
												&& !isNaN(chauffage.last_etat.expression.expr1_val)) {
											var targetlevel=parseFloat(chauffage.last_etat.expression.expr1_val);	
											var consignewithajustement=parseFloat(consigneactuel);
											if (global.obj.peripheriques_chauffage[c].chauffage[ch].ajustement
													&&!isNaN(global.obj.peripheriques_chauffage[c].chauffage[ch].ajustement)){
												consignewithajustement+=parseFloat(global.obj.peripheriques_chauffage[c].chauffage[ch].ajustement);
												
											}
											//console.log(targetlevel+"=="+consignewithajustement+"="+consigneactuel+"+"+global.obj.peripheriques_chauffage[c].chauffage[ch].ajustement);
											if (targetlevel!=consignewithajustement) {
												logger('INFO',{msg:'envoi consigne ajustée chauffage variable',targetlevel:targetlevel,consignewithajustement:consignewithajustement,chauffage_id:chauffage.id,chauffage_nom:chauffage.nom},'automation_'+consigne_chauffage.nom);
												global.obj.peripheriques_chauffage[c].chauffage[ch].set_etat('DIM',consignewithajustement,function(rep_box){
													logger('INFO',{msg:'  reponse envoi consigne ajustée chauffage variable',targetlevel:targetlevel,consignewithajustement:consignewithajustement,rep_box:rep_box,chauffage_id:chauffage.id,chauffage_nom:chauffage.nom},'automation_'+consigne_chauffage.nom);									
												});
											}
										} else {
											logger('ERROR',{msg:'probleme avec un chaffage variable',error:'valeur expr1 non numerique',
												expr1:chauffage.last_etat.expression.expr1_val,etat:chauffage.last_etat.expression.etat,
												periph:chauffage.id},'automation_'+consigne_chauffage.nom);
											logger('ERROR',{msg:'suite probleme essai d extinction chauffage',chauffage_id:chauffage.id,chauffage_nom:chauffage.nom},'automation_'+consigne_chauffage.nom);
											chauffage.set_etat('DIM','5',function(rep_box){
												logger('ERROR',{msg:'  reponse envoi extinction',targetlevel:targetlevel,consignewithajustement:consignewithajustement,rep_box:rep_box,chauffage_id:chauffage.id,chauffage_nom:chauffage.nom},'automation_'+consigne_chauffage.nom);									
											});
										}						
									} else if (chauffage.ecriture_type=="BINAIRE") {
										var limitbasse=0
										if (!isNaN(chauffage.limitebasse) && chauffage.limitebasse!="") {
											limitbasse=parseFloat(chauffage.limitebasse);
										}
										var limitbasse2=0
										if (!isNaN(chauffage.limitebasse2) && chauffage.limitebasse2!=""){
											limitbasse2=parseFloat(chauffage.limitebasse2);
										}
										var limithaute=0
										var test=isNaN(chauffage.limitehaute);
										if (!isNaN(chauffage.limitehaute) && chauffage.limitehaute!="") {
											limithaute=parseFloat(chauffage.limitehaute);
										}
										
										global.obj.peripheriques_chauffage[c].last_etat['need_chauffage_'+chauffage.id]='0/3';
										var needallumechauffage=false;
				
				
										if (tempactuel<consigneactuel+limithaute){
											global.obj.peripheriques_chauffage[c].last_etat['need_chauffage_'+chauffage.id]='1/3';
											if (global.obj.peripheriques_chauffage[c].last_etat.compteur<=1) needallumechauffage=true;
										}
										if (tempactuel<consigneactuel+limitbasse){
											global.obj.peripheriques_chauffage[c].last_etat['need_chauffage_'+chauffage.id]='2/3';
											if (global.obj.peripheriques_chauffage[c].last_etat.compteur<=2) needallumechauffage=true;
										}						
										if (tempactuel<consigneactuel+limitbasse2){
											global.obj.peripheriques_chauffage[c].last_etat['need_chauffage_'+chauffage.id]='3/3';
											if (global.obj.peripheriques_chauffage[c].last_etat.compteur<=3) needallumechauffage=true;
										}						
										global.obj.peripheriques_chauffage[c].last_etat['need_chauffage_'+chauffage.id]=global.obj.peripheriques_chauffage[c].last_etat['need_chauffage_'+chauffage.id]+' '+needallumechauffage;
										//console.log(chauffage);
										if (chauffage.last_etat.expression) {
			
											if (chauffage.last_etat.expression.etat+""==chauffage.ecriture_max_value && needallumechauffage==false) {
												//console.log('inverse = non false');
												logger('INFO',{msg:'extinction chauffage binaire',chauffage_id:chauffage.id,chauffage_nom:chauffage.nom},'automation_'+consigne_chauffage.nom);
												global.obj.peripheriques_chauffage[c].chauffage[ch].set_etat('OFF',chauffage.ecriture_min_value,function(rep_box){
													logger('INFO',{msg:'  reponse extinction chauffage binaire',chauffage_id:chauffage.id,chauffage_nom:chauffage.nom,rep_box:rep_box},'automation_'+consigne_chauffage.nom);
												});
											}
											if (chauffage.last_etat.expression.etat+""==chauffage.ecriture_min_value && needallumechauffage==true) {
												//console.log('inverse = non true');
												logger('INFO',{msg:'allumage chauffage binaire',chauffage_id:chauffage.id,chauffage_nom:chauffage.nom},'automation_'+consigne_chauffage.nom);
												global.obj.peripheriques_chauffage[c].chauffage[ch].set_etat('ON',chauffage.ecriture_max_value,function(rep_box){
													logger('INFO',{msg:'  reponse allumage chauffage binaire',chauffage_id:chauffage.id,chauffage_nom:chauffage.nom,rep_box:rep_box},'automation_'+consigne_chauffage.nom);
												});
											}							
			
				
										}
												
									}
								} catch (e) {
									logger('ERROR',{msg:'probleme avec un chauffage binaire ou variable',error:e,chauffage:chauffage.id},'automation_'+consigne_chauffage.nom);
									logger('ERROR',{msg:'suite probleme essai d extinction chauffage',chauffage_id:chauffage.id,chauffage_nom:chauffage.nom},'automation_'+consigne_chauffage.nom);
									chauffage.set_etat('OFF',chauffage.ecriture_min_value,function(rep_box){
										logger('ERROR',{msg:'  reponse extinction chauffage',chauffage_id:chauffage.id,chauffage_nom:chauffage.nom,rep_box:rep_box},'automation_'+consigne_chauffage.nom);
									});
								}
							}
						}
						if(global.obj.peripheriques_chauffage[c]){
							for (var ch in global.obj.peripheriques_chauffage[c].chaudiere){
								var chaudiere=global.obj.peripheriques_chauffage[c].chaudiere[ch];
								var limitbasse=0
								if (!isNaN(chaudiere.limitbasse)) limitbasse=parseFloat(chaudiere.limitbasse);
								var limitbasse2=0
								if (!isNaN(chaudiere.limitbasse2))limitbasse2=parseFloat(chaudiere.limitbasse2);
								var limithaute=0
								if (!isNaN(chaudiere.limithaute)) limithaute=parseFloat(chaudiere.limithaute);
								
								if (tempactuel+limitbasse<consigneactuel || tempactuel+limitbasse2<consigneactuel){
									chaudiereNeedON.push(chaudiere.id);
									global.obj.peripheriques_chauffage[c].last_etat.needchaudiere_ON=true;
									logger('INFO',{msg:' chaudiere a allumer pour ',chauffage_id:global.obj.peripheriques_chauffage[c].id,chauffage_nom:global.obj.peripheriques_chauffage[c].nom,
											chaudiere_id:chaudiere.id,chaudiere_nom:chaudiere.nom,
											limitbasse:limitbasse,limitbasse2:limitbasse2,limithaute:limithaute},'automation_'+consigne_chauffage.nom);
								} else {
									global.obj.peripheriques_chauffage[c].last_etat.needchaudiere_ON=false;
									logger('INFO',{msg:' chaudiere pas besoin pour ',chauffage_id:global.obj.peripheriques_chauffage[c].id,chauffage_nom:global.obj.peripheriques_chauffage[c].nom,
											chaudiere_id:chaudiere.id,chaudiere_nom:chaudiere.nom,
											limitbasse:limitbasse,limitbasse2:limitbasse2,limithaute:limithaute},'automation_'+consigne_chauffage.nom);
								}
								
							}
						}
	
					} else {
						logger('ERROR',{msg:'probleme avec un peripherique chauffage',error:'valeur non numerique',
							expr1:pc.last_etat.expression.expr1_val,etat:pc.last_etat.expression.etat,
							periph:pc.id},'automation_'+consigne_chauffage.nom);
					}
				} else {
					//console.log('pas de consigne (etat)');
					logger('ERROR',{msg:'probleme avec un peripherique',error:'pas de consigne (etat)',
						lastetat:pc.last_etat,periph:pc.id},'automation_'+consigne_chauffage.nom);
					logger('ERROR',{msg:'essai de recalcul de la consigne'},'automation_'+consigne_chauffage.nom);
					//global.automation.programmation_consigne.appliquepreviousconsigne(pc.id);

				}
			}
		} catch (e) {
			logger('ERROR',{msg:'probleme avec un peripherique',error:e,periph:global.obj.peripheriques[p].id},'automation_'+consigne_chauffage.nom);
		}
	}
	
	for (var ch in arraychaudiere){
		try {	
			var need_allume=false;
			for (var need_ON in  chaudiereNeedON){
				var id_need_ON=chaudiereNeedON[need_ON];
				if (id_need_ON==arraychaudiere[ch].id){
					need_allume=true;
				}
			}
			logger('INFO',{msg:'  chaudiere need_allume ',need_allume:need_allume,chaudiere_id:arraychaudiere[ch].id},'automation_'+consigne_chauffage.nom);
			if (arraychaudiere[ch].last_etat && arraychaudiere[ch].last_etat.expression){
				if (arraychaudiere[ch].last_etat.expression.etat==arraychaudiere[ch].ecriture_max_value && need_allume==false) {
					logger('INFO',{msg:'extinction chaudiere',chaudiere_id:arraychaudiere[ch].id,chaudier_nom:arraychaudiere[ch].nom},'automation_'+consigne_chauffage.nom);
					arraychaudiere[ch].set_etat('OFF',arraychaudiere[ch].ecriture_min_value,function(rep_box){
						logger('INFO',{msg:'  reponse extinction chaudiere',chaudiere_id:arraychaudiere[ch].id,chaudier_nom:arraychaudiere[ch].nom,rep_box:rep_box},'automation_'+consigne_chauffage.nom);
					});			
				}
				if (arraychaudiere[ch].last_etat.expression.etat==arraychaudiere[ch].ecriture_min_value && need_allume==true) {
					logger('INFO',{msg:'allumage chaudiere',chaudiere_id:arraychaudiere[ch].id,chaudier_nom:arraychaudiere[ch].nom},'automation_'+consigne_chauffage.nom);
					arraychaudiere[ch].set_etat('ON',arraychaudiere[ch].ecriture_max_value,function(rep_box){
						logger('INFO',{msg:'  reponse allumage chaudiere',chaudiere_id:arraychaudiere[ch].id,chaudier_nom:arraychaudiere[ch].nom,rep_box:rep_box},'automation_'+consigne_chauffage.nom);
					});
				}
			} else {
				logger('ERROR',{msg:'probleme chaudiere elle n a pas d etat',neddallume:need_allume,chaudiere:arraychaudiere[ch]},'automation_'+consigne_chauffage.nom);
			}
		} catch (e) {
			logger('ERROR',{msg:'probleme chaudiere gestion ONOFF',error:e,neddallume:need_allume,chaudiere:arraychaudiere[ch]},'automation_'+consigne_chauffage.nom);
			logger('ERROR',{msg:'suite probleme essai d extinction chaudiere',chaudiere_id:arraychaudiere[ch].id,chaudiere_nom:arraychaudiere[ch].nom},'automation_'+consigne_chauffage.nom);
			arraychaudiere[ch].set_etat('OFF',arraychaudiere[ch].ecriture_min_value,function(rep_box){
				logger('INFO',{msg:'  reponse extinction chaudiere',rep_box:rep_box},'automation_'+consigne_chauffage.nom);
			});
		}
	}
	global.obj.app.serveur.emit('consigne_chauffage.controleChauffage');
}



module.exports = consigne_chauffage;