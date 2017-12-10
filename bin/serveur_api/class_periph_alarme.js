/**
 * New node file
 */


var class_periph_alarme = function peripherique_alarme(){
	
	var self =this;
	
	
	this.get_etat=function(callback){
		try {
			self.box.get_etat(function(periph,res){		
				res.constantes={};
				for (var c in global.obj.constantes){
					var co=global.obj.constantes[c];
					res.constantes[co.nom]=co.valeur;
				}
				res.alarme={};
				for (var s in periph.alarme){
					res.alarme['id_'+periph.alarme[s].id]=periph.alarme[s].last_etat;
				}
				res.declencheur={};
				for (var s in periph.declencheur){
					res.declencheur['id_'+periph.declencheur[s].id]=self.declencheur[s].last_etat;
				}
				res.sirene={};
				for (var s in periph.sirene){
					res.sirene['id_'+periph.sirene[s].id]=periph.sirene[s].last_etat;
				}
				
				callback(periph,res);
				
			},self);			
		} catch (e) {
			callback(self,{});
		}


	}
	/*self.set_etat=function(cmd,val,callback){
		self.box.set_etat(self,cmd,val,callback);
		if (cmd=='ON' || cmd=='UP') {if(self.ecriture_max) val=self.ecriture_max; else val=1;}
		if (cmd=='OFF' || cmd=='DOWN') {if(self.ecriture_min) val=self.ecriture_min; else val=0;}
		if (cmd=='DIM' ) 
		self.last_etat.expression.etat=val;
		global.obj.core.set_last_etat(this,self.last_etat.expression);
	}*/
}



class_periph_alarme.generationGlobale=function(callback){
	var tag_id_alarme={};
	var tag_id_declencheur={};
	var tag_id_sirene={};
	
	/*recherche des peripheriques con�ern�s par l'alarme*/
	for (var p in global.obj.peripheriques){
		var pe=global.obj.peripheriques[p];
		if (pe.categorie && pe.categorie.type=='alarme') {
			for (var ta in pe.tag){
				var tag =pe.tag[ta];
				if (!tag_id_alarme['al_tag_'+pe.tag[ta].id]) tag_id_alarme['al_tag_'+pe.tag[ta].id]=[];
				tag_id_alarme['al_tag_'+pe.tag[ta].id].push(pe.id);					
			}

		} else if (pe.categorie && pe.categorie.type=='declencheur_alarme') {
			for (var ta in pe.tag){
				var tag =pe.tag[ta];
				if (!tag_id_declencheur['al_tag_'+pe.tag[ta].id]) tag_id_declencheur['al_tag_'+pe.tag[ta].id]=[];
				tag_id_declencheur['al_tag_'+pe.tag[ta].id].push(pe.id);
			}
		} else if (pe.categorie && pe.categorie.type=='sirene_alarme') {
			for (var ta in pe.tag){
				var tag =pe.tag[ta];
				if (!tag_id_sirene['al_tag_'+pe.tag[ta].id]) tag_id_sirene['al_tag_'+pe.tag[ta].id]=[];
				tag_id_sirene['al_tag_'+pe.tag[ta].id].push(pe.id);
			}
		} 
	}
	
	/*Association dans un m�me objet par tag con�ern�*/
	var tags_alarme={};
	for (var t in tag_id_alarme){
		if (!tags_alarme[t]) tags_alarme[t]=new global.req.periph_alarme();
		if (!tags_alarme[t].alarme) tags_alarme[t].alarme=[];
		if (!tags_alarme[t].tag) tags_alarme[t].tag_info=[];
		for (var p in tag_id_alarme[t]) {
			tags_alarme[t].alarme.push(global.obj.app.core.findobj(tag_id_alarme[t][p],'peripheriques'));
			for (var tp in global.obj.app.core.findobj(tag_id_alarme[t][p],'peripheriques').tag) {
				var ttt = global.obj.app.core.findobj(tag_id_alarme[t][p],'peripheriques').tag[tp];
				if (t=='al_tag_'+ttt.id) tags_alarme[t].tag_info['al_tag_'+ttt.id]=(global.obj.app.core.findobj(tag_id_alarme[t][p],'peripheriques').tag[tp]);
			}
		}
	}
	for (var t in tag_id_declencheur){
		if (!tags_alarme[t]) tags_alarme[t]=new global.req.periph_alarme();
		if (!tags_alarme[t].declencheur) tags_alarme[t].declencheur=[];
		if (!tags_alarme[t].tag) tags_alarme[t].tag_info=[];
		for (var p in tag_id_declencheur[t]) {
			tags_alarme[t].declencheur.push(global.obj.app.core.findobj(tag_id_declencheur[t][p],'peripheriques'));
			for (var tp in global.obj.app.core.findobj(tag_id_declencheur[t][p],'peripheriques').tag) {
				var ttt = global.obj.app.core.findobj(tag_id_declencheur[t][p],'peripheriques').tag[tp];
				if (t=='al_tag_'+ttt.id) tags_alarme[t].tag_info['al_tag_'+ttt.id]=(global.obj.app.core.findobj(tag_id_declencheur[t][p],'peripheriques').tag[tp]);
			}		
		}
	}
	for (var t in tag_id_sirene){
		if (!tags_alarme[t]) tags_alarme[t]=new global.req.periph_alarme();
		if (!tags_alarme[t].sirene) tags_alarme[t].sirene=[];
		if (!tags_alarme[t].tag) tags_alarme[t].tag_info=[];
		for (var p in tag_id_sirene[t]) {
			tags_alarme[t].sirene.push(global.obj.app.core.findobj(tag_id_sirene[t][p],'peripheriques'));
			for (var tp in global.obj.app.core.findobj(tag_id_sirene[t][p],'peripheriques').tag) {
				var ttt = global.obj.app.core.findobj(tag_id_sirene[t][p],'peripheriques').tag[tp];
				if (t=='al_tag_'+ttt.id) tags_alarme[t].tag_info['al_tag_'+ttt.id]=(global.obj.app.core.findobj(tag_id_sirene[t][p],'peripheriques').tag[tp]);
			}		
		}
	}

	
	/*Recherche des tag ou l'afficher en descendant dans les 1ere pieces visible*/ 
	for (var tc in tags_alarme) {
		for (var ti in tags_alarme[tc].tag_info) {
			var enfants_visible=[];
			var tag=tags_alarme[tc].tag_info[ti];
			tags_alarme[tc].tag_info[ti].findchild_visible(enfants_visible);
			tags_alarme[tc].tag=enfants_visible;
			
		}
	}
	
	/*definitions des infos de type peripherique*/
	for (var tc in tags_alarme) {

		/*associe les propriétés du periphérique alarme a l'alarme*/
		for (var s in tags_alarme[tc].alarme){
			tags_alarme[tc].nom=tags_alarme[tc].alarme[s].nom;
			tags_alarme[tc].id=tags_alarme[tc].alarme[s].id;
			tags_alarme[tc].uuid=tags_alarme[tc].alarme[s].uuid;

			tags_alarme[tc].box_identifiant=tags_alarme[tc].alarme[s].box_identifiant;
            tags_alarme[tc].box_type=tags_alarme[tc].alarme[s].box_type;

            tags_alarme[tc].ecriture_max_value=tags_alarme[tc].alarme[s].ecriture_max_value;
            tags_alarme[tc].ecriture_min_value=tags_alarme[tc].alarme[s].ecriture_min_value;

			tags_alarme[tc].box_protocole=tags_alarme[tc].alarme[s].box_protocole;
			tags_alarme[tc].box=tags_alarme[tc].alarme[s].box;
			tags_alarme[tc].box_id=tags_alarme[tc].alarme[s].box_id;
			tags_alarme[tc].categorie=tags_alarme[tc].alarme[s].categorie;
			tags_alarme[tc].categorie_id=tags_alarme[tc].alarme[s].categorie_id;
			tags_alarme[tc].lecture_etat_expr=tags_alarme[tc].alarme[s].lecture_etat_expr;
			tags_alarme[tc].visibilite='visible';
		}
		for (var ti in tags_alarme[tc].tag_info) {
			//tags_alarme[tc].id="al_tag_"+tags_alarme[tc].tag_info[ti].id;
			//tags_alarme[tc].uuid="al_tag_"+tags_alarme[tc].tag_info[ti].id;
			var idal="al_tag_"+tags_alarme[tc].tag_info[ti].id
			tags_alarme[tc].id=idal;
			tags_alarme[tc].uuid=idal;
			//tags_alarme[tc].box_identifiant='id_'+idal
			
		}

		/*for (v in global.obj.boxs){
			if (global.obj.boxs[v].model=='virtuel') {
				tags_alarme[tc].box=global.obj.boxs[v];
				tags_alarme[tc].box_id=global.obj.boxs[v].id;
			}
		}*/
		
	}
	
	callback(tags_alarme);
	
}
class_periph_alarme.charge_peripheriques_alarme=function(callback){
	
	global.req.periph_alarme.generationGlobale(function(periph_alarme){
		global.obj.peripheriques_alarme=periph_alarme;
		callback();
	});
}
class_periph_alarme.update_etat_periphalarme=function(callback){
	global.req.async.map(global.obj.peripheriques_alarme,function(periph,callbackbe){
		
		periph.get_expr(function(result_json){
			global.obj.app.core.set_last_etat(periph,res);
			//console.log('-----'+periph.nom);
			callbackbe();
		});
	
  },function(err){
	  //console.log('fin chargement etat periph alarme ');
	  global.obj.app.serveur.emit('periph_alarme.update_etat_periphalarme');
	  callback();
  });
}

//class_periph_chauffage.prototype= new global.req.events.EventEmitter();

class_periph_alarme.prototype= new global.req.peripherique();
class_periph_alarme.prototype.constructor=class_periph_alarme;
module.exports = class_periph_alarme;