/**
 * New node file
 */


var class_periph_chauffage = function peripherique_chauffage(){
	
	var self =this;
	
	
	self.get_etat=function(callback){
		
		self.box.get_etat(function(periph,res){		
			
			res.constantes={};
			for (var c in global.obj.constantes){
				var co=global.obj.constantes[c];
				res.constantes[co.nom]=co.valeur;
			}
			
			var manque_etat_enfant=false;
			res.sondes_autres={};
			for (var s in self.sondes_autres){
				if(!self.sondes_autres[s].last_etat) manque_etat_enfant=true;
				res.sondes_autres['id_'+self.sondes_autres[s].id]=self.sondes_autres[s].last_etat;
			}
			res.chauffage={};
			for (var s in self.chauffage){
				if(!self.chauffage[s].last_etat) manque_etat_enfant=true;
				res.chauffage['id_'+self.chauffage[s].id]=self.chauffage[s].last_etat;
			}
			res.sondes_temp={};
			for (var s in self.sondes_temp){
				if(!self.sondes_temp[s].last_etat) manque_etat_enfant=true;
				res.sondes_temp['id_'+self.sondes_temp[s].id]=self.sondes_temp[s].last_etat;
			}
			res.chaudiere={};
			for (var s in self.chaudiere){
				if(!self.chaudiere[s].last_etat) manque_etat_enfant=true;
				res.chaudiere['id_'+self.chaudiere[s].id]=self.chaudiere[s].last_etat;
			}
			if (manque_etat_enfant) res.erreur="manque_etat_enfant";
			callback(periph,res);
			
		},self);

	}
	/*self.set_etat=function(cmd,val,callback){
		self.box.set_etat(self,cmd,val,callback);
	}*/
}



class_periph_chauffage.generationGlobale=function(callback){
	var tag_id_chaudiere={};
	var tag_id_chauffage={};
	var tag_id_sondes_temp={};
	var tag_id_sondes_autres={};
	
	/*recherche des peripheriques con�ern�s par le chauffage*/
	for (var p in global.obj.peripheriques){
		var pe=global.obj.peripheriques[p];
		if (pe.categorie && pe.categorie.type=='element_de_chauffage') {
			if (pe.ecriture_type=='CHAUDIERE'){
				for (var ta in pe.tag){
					var tag =pe.tag[ta];
					if (!tag_id_chaudiere['tag_'+pe.tag[ta].id]) tag_id_chaudiere['tag_'+pe.tag[ta].id]=[];
					tag_id_chaudiere['tag_'+pe.tag[ta].id].push(pe.id);
				}
			} else if (pe.ecriture_type=='BINAIRE' 
				|| pe.ecriture_type=='BINVAR'
				|| pe.ecriture_type=='VARIABLE'){
				for (var ta in pe.tag){
					var tag =pe.tag[ta];
					if (!tag_id_chauffage['tag_'+pe.tag[ta].id]) tag_id_chauffage['tag_'+pe.tag[ta].id]=[];
					tag_id_chauffage['tag_'+pe.tag[ta].id].push(pe.id);					
				}
			}
			global.obj.peripheriques[p].visibilite="non visible";
			if (pe.ecriture_type=='BINAIRE' || pe.ecriture_type=='CHAUDIERE'){
				pe.visibleifmanuel='O'
			}
		} else if (pe.categorie && pe.categorie.type=='sonde_de_temperature') {
			for (var ta in pe.tag){
				var tag =pe.tag[ta];
				if (!tag_id_sondes_temp['tag_'+pe.tag[ta].id]) tag_id_sondes_temp['tag_'+pe.tag[ta].id]=[];
				tag_id_sondes_temp['tag_'+pe.tag[ta].id].push(pe.id);
			}
			global.obj.peripheriques[p].visibilite="non visible";
		} else if (pe.categorie && pe.categorie.type=='sonde_autre') {
			for (var ta in pe.tag){
				var tag =pe.tag[ta];
				if (!tag_id_sondes_autres['tag_'+pe.tag[ta].id]) tag_id_sondes_autres['tag_'+pe.tag[ta].id]=[];
				tag_id_sondes_autres['tag_'+pe.tag[ta].id].push(pe.id);
			}
			global.obj.peripheriques[p].visibilite="non visible";
		} 
	}
	
	/*Association dans un m�me objet par tag con�ern�*/
	var tags_consigne={};
	for (var t in tag_id_chaudiere){
		if (!tags_consigne[t]) tags_consigne[t]=new global.req.periph_chauffage();
		if (!tags_consigne[t].chaudiere) tags_consigne[t].chaudiere=[];
		if (!tags_consigne[t].tag) tags_consigne[t].tag_info=[];
		for (var p in tag_id_chaudiere[t]) {
			tags_consigne[t].chaudiere.push(global.obj.app.core.findobj(tag_id_chaudiere[t][p],'peripheriques'));
			for (var tp in global.obj.app.core.findobj(tag_id_chaudiere[t][p],'peripheriques').tag) {
				var ttt = global.obj.app.core.findobj(tag_id_chaudiere[t][p],'peripheriques').tag[tp];
				if (t=='tag_'+ttt.id) tags_consigne[t].tag_info['tag_'+ttt.id]=(global.obj.app.core.findobj(tag_id_chaudiere[t][p],'peripheriques').tag[tp]);
			}
		}
	}
	for (var t in tag_id_chauffage){
		if (!tags_consigne[t]) tags_consigne[t]=new global.req.periph_chauffage();
		if (!tags_consigne[t].chauffage) tags_consigne[t].chauffage=[];
		if (!tags_consigne[t].tag) tags_consigne[t].tag_info=[];
		for (var p in tag_id_chauffage[t]) {
			tags_consigne[t].chauffage.push(global.obj.app.core.findobj(tag_id_chauffage[t][p],'peripheriques'));
			for (var tp in global.obj.app.core.findobj(tag_id_chauffage[t][p],'peripheriques').tag) {
				var ttt = global.obj.app.core.findobj(tag_id_chauffage[t][p],'peripheriques').tag[tp];
				if (t=='tag_'+ttt.id) tags_consigne[t].tag_info['tag_'+ttt.id]=(global.obj.app.core.findobj(tag_id_chauffage[t][p],'peripheriques').tag[tp]);
			}		
		}
	}
	for (var t in tag_id_sondes_temp){
		if (!tags_consigne[t]) tags_consigne[t]=new global.req.periph_chauffage();
		if (!tags_consigne[t].sondes_temp) tags_consigne[t].sondes_temp=[];
		if (!tags_consigne[t].tag) tags_consigne[t].tag_info=[];
		for (var p in tag_id_sondes_temp[t]) {
			tags_consigne[t].sondes_temp.push(global.obj.app.core.findobj(tag_id_sondes_temp[t][p],'peripheriques'));
			for (var tp in global.obj.app.core.findobj(tag_id_sondes_temp[t][p],'peripheriques').tag) {
				var ttt = global.obj.app.core.findobj(tag_id_sondes_temp[t][p],'peripheriques').tag[tp];
				if (t=='tag_'+ttt.id) tags_consigne[t].tag_info['tag_'+ttt.id]=(global.obj.app.core.findobj(tag_id_sondes_temp[t][p],'peripheriques').tag[tp]);
			}		
		}
	}
	for (var t in tag_id_sondes_autres){
		if (!tags_consigne[t]) tags_consigne[t]=new global.req.periph_chauffage();
		if (!tags_consigne[t].sondes_autres) tags_consigne[t].sondes_autres=[];
		if (!tags_consigne[t].tag) tags_consigne[t].tag_info=[];
		for (var p in tag_id_sondes_autres[t]) {
			tags_consigne[t].sondes_autres.push(global.obj.app.core.findobj(tag_id_sondes_autres[t][p],'peripheriques'));
			for (var tp in global.obj.app.core.findobj(tag_id_sondes_autres[t][p],'peripheriques').tag) {
				var ttt = global.obj.app.core.findobj(tag_id_sondes_autres[t][p],'peripheriques').tag[tp];
				if (t=='tag_'+ttt.id) tags_consigne[t].tag_info['tag_'+ttt.id]=(global.obj.app.core.findobj(tag_id_sondes_autres[t][p],'peripheriques').tag[tp]);
			}
		}
	}
	
	/*Recherche des tag ou l'afficher en descendant dans les 1ere pieces visible*/ 
	for (var tc in tags_consigne) {
		for (var ti in tags_consigne[tc].tag_info) {
			var enfants_visible=[];
			var tag=tags_consigne[tc].tag_info[ti];
			tags_consigne[tc].tag_info[ti].findchild_visible(enfants_visible);
			tags_consigne[tc].tag=enfants_visible;
			
		}
	}
	
	/*definitions des infos de type peripherique*/
	for (var tc in tags_consigne) {
		for (var ti in tags_consigne[tc].tag_info) {
			tags_consigne[tc].nom=tags_consigne[tc].tag_info[ti].nom;
			tags_consigne[tc].id="tag_"+tags_consigne[tc].tag_info[ti].id;
			tags_consigne[tc].uuid="tag_"+tags_consigne[tc].tag_info[ti].id;
			tags_consigne[tc].box_identifiant="id_tag_"+tags_consigne[tc].tag_info[ti].id;
			tags_consigne[tc].visibilite='visible';
			tags_consigne[tc].ecriture_max_value=-99;
			tags_consigne[tc].ecriture_min_value=99;
			tags_consigne[tc].lecture_etat_expr="$value";
			tags_consigne[tc].lecture_expr1="round(moyenne($sondes_temp,'etat'),1)";
			tags_consigne[tc].lecture_expr1_unit='" °C"';
			
			for (var s in tags_consigne[tc].sondes_temp){
				if (tags_consigne[tc].sondes_temp[s].ecriture_max_value &&
						tags_consigne[tc].sondes_temp[s].ecriture_max_value>tags_consigne[tc].ecriture_max_value){
					tags_consigne[tc].ecriture_max_value=tags_consigne[tc].sondes_temp[s].ecriture_max_value;
				}
				if (tags_consigne[tc].sondes_temp[s].ecriture_min_value &&
						tags_consigne[tc].sondes_temp[s].ecriture_min_value<tags_consigne[tc].ecriture_min_value){
					tags_consigne[tc].ecriture_min_value=tags_consigne[tc].sondes_temp[s].ecriture_min_value;
				}
			}
			for (var s in tags_consigne[tc].chauffage){
				if(tags_consigne[tc].chauffage[s]['lecture_etat_graph']){
					tags_consigne[tc]['lecture_etat_graph']=tags_consigne[tc].chauffage[s]['lecture_etat_graph'];
				}
			}
			if (tags_consigne[tc].ecriture_max_value==-99){
				tags_consigne[tc].ecriture_max_value=35;
			}
			if (tags_consigne[tc].ecriture_min_value==99){
				tags_consigne[tc].ecriture_min_value=5;
			}
			
			for (var s in tags_consigne[tc].chaudiere){
				tags_consigne[tc].etat2='$chaudiere.id_'+tags_consigne[tc].chaudiere[s].id+'.expression.etat'
			}
			for (var s in tags_consigne[tc].sondes_temp){
				if (tags_consigne[tc].sondes_temp[s]['lecture_expr1_graph']) {
					tags_consigne[tc]['lecture_expr1_graph']=tags_consigne[tc].sondes_temp[s]['lecture_expr1_graph'];
				}
				
			}
			
			var index_info=2;
			for (var s in tags_consigne[tc].sondes_autres){
				tags_consigne[tc]['lecture_expr'+index_info]='$sondes_autres.id_'+tags_consigne[tc].sondes_autres[s].id+'.expression.expr1_val';
				tags_consigne[tc]['lecture_expr'+index_info+'_graph']=tags_consigne[tc].sondes_autres[s]['lecture_expr1_graph'];
				tags_consigne[tc]['lecture_expr'+index_info+'_unit']='$sondes_autres.id_'+tags_consigne[tc].sondes_autres[s].id+'.expression.expr1_unit'
				
				index_info++;
			}
			//tags_consigne[tc].lecture_expr2="$sonde_autres_info1";
			//tags_consigne[tc].lecture_expr3="$sonde_autres_info2";
			for (var v in global.obj.boxs){
				if (global.obj.boxs[v].model=='virtuel') {
					tags_consigne[tc].box=global.obj.boxs[v];
					tags_consigne[tc].box_id=global.obj.boxs[v].id;
				}
			}
			
			if (tags_consigne[tc].chauffage || tags_consigne[tc].chaudiere){
				tags_consigne[tc].ecriture_type='TEMPERATURECONSIGNE';
			} else {
				tags_consigne[tc].ecriture_type='TEMPERATURE';
				tags_consigne[tc].lecture_etat_expr="0";
			}
			
			  for (var cat in global.obj.categories){
				  //console.log('exist',categories[cat].type);
				  if (global.obj.categories[cat].type=='consigne_temperature'){
					  tags_consigne[tc].categorie=global.obj.categories[cat];
					  tags_consigne[tc].categorie_id=global.obj.categories[cat].id;
				  }
			  }

			  
		}
	}
	
	callback(tags_consigne);
	
}

class_periph_chauffage.charge_peripheriques_chauffage=function(callback){
	global.req.periph_chauffage.generationGlobale(function(periph_chauff){
		global.obj.peripheriques_chauffage=periph_chauff;
		callback();
	});
}
class_periph_chauffage.update_etat_periphchauff=function(callback){
	//console.trace('-------run update etat periphchauff');
	global.req.async.map(global.obj.peripheriques_chauffage,function(periph,callbackbe){
		
		periph.get_expr(function(result_json){
			
			global.obj.app.core.set_last_etat(periph,result_json);
			//console.error('-----'+periph.nom);
			if(periph.ecriture_type=='TEMPERATURECONSIGNE' && (!periph.last_etat ||
					!periph.last_etat.expression ||
					!periph.last_etat.expression.etat )) {
				logger('ERROR',{nom:periph.nom,id:periph.id,msg:"Get expression periph chauffage sans etat !!:"/*,result:result_json,periph:periph*/},'get_expression_periph_chauffe');
				
			}
			
			callbackbe();
		});
	
  },function(err){
	  global.obj.app.serveur.emit('periph_chauffage.update_etat_periphchauff');
	  //console.log('fin chargement etat periph de chauffe ');
	  callback();
  });
}


//class_periph_chauffage.prototype= new global.req.events.EventEmitter();

class_periph_chauffage.prototype= new global.req.peripherique();
class_periph_chauffage.prototype.constructor=class_periph_chauffage;

module.exports = class_periph_chauffage;