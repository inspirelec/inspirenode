/**
 * New node file
 */

var parserxml2json = new global.req.xml2js.Parser();


var domoticz = function(adresseip) {
	this.adresseip=adresseip;
		 
	this.set_etat=function(periph,cmd,val,callbackfunc){
		var self=this;
		var rep={};
		rep.cmd=cmd;
		rep.val=val;
		var valeur=val;
		var switchcmd='';
		//rep.body="mise a jour d'�tat en construction"
		var inverse=false;
		if (periph.ecriture_max_value<periph.ecriture_min_value) {
			if (cmd=='ON') switchcmd='Off';
			if (cmd=='OFF') switchcmd='On';
			if (cmd=='UP') switchcmd='On';
			if (cmd=='DOWN') switchcmd='Off';	
			inverse=true;
			
		} else {
			if (cmd=='ON') switchcmd='On';
			if (cmd=='OFF') switchcmd='Off';
			if (cmd=='UP') switchcmd='Off';
			if (cmd=='DOWN') switchcmd='On';			
		}
		try {
			valeur=1/parseInt(val)*16;
		} catch (e) {
		}
		if (cmd=='STOP') switchcmd='Stop';
		if (cmd=='DIM') switchcmd='Set%20Level&level='+valeur;	
		
		//ajout fm 22/11/15 : 'admin:admin@'+ pour identification
		 var urlsend='/json.htm?type=command&param=switchlight&idx='+periph.box_identifiant.substr(4,99)+'&switchcmd='+switchcmd;
		logger('INFO',{nom:self.nom,id:self.id,msg:"Ordre envoyé a la box ",lien:self.ip+urlsend},'box_domoticz');
		  var periphsend=periph;
			global.req.comm.perso_get(/*'admin:admin@'+*/periph.box.ip,urlsend,8080,function(err,httpResponse,body){
				if (err) {
					logger('ERROR',{nom:self.nom,id:self.id,msg:err},'box_domoticz');
				}
				if (!body){
					logger('ERROR',{nom:self.nom,id:self.id,msg:'reponse vide'},'box_domoticz');
				}
				try {
					rep.body=JSON.parse(body);
					//periph.last_etat.etat=val;
				} catch (e) {
					rep={};
					logger('ERROR',{nombox:self.nom,idbox:self.id,periph_id:periphsend.id,periph_nom:periphsend.nom,
						msg:'Impossible de parser la réponse json',requete:urlsend,repbody:body},'box_domoticz');
				}
				
				callbackfunc(rep);
			},periph.box.user_auth,periph.box.password_auth);
		/*/json.htm?type=command&param=switchlight&idx=99&switchcmd=On
		/json.htm?type=command&param=switchlight&idx=99&switchcmd=Off
		/json.htm?type=command&param=switchlight&idx=99&switchcmd=Set%20Level&level=6
		/json.htm?type=command&param=switchlight&idx=99&switchcmd=Stop*/
		
		//callbackfunc(rep);
		
    }
	
	this.get_etatbox=function(callbackfunc){
		var self=this;
		//ajout fm 22/11/15 : 'admin:admin@'+ pour identification
		
		logger('INFO',{nom:self.nom,id:self.id,msg:"Ordre envoyé a la box ",lien:self.ip+':8080/json.htm?type=devices&filter=all&used=true&order=Name'},'box_domoticz');
		global.req.comm.perso_get(/*'admin:admin@'+*/this.ip,'/json.htm?type=devices&filter=all&used=true&order=Name',8080,function(err,httpResponse,body){
			var res={};
			try {
				if (body) {
					var result=JSON.parse(body);
					if (result) {
						for (d in result.result) {
							var ligne = result.result[d];
							res['idx_'+ligne.idx]=ligne;
						}			
					}
						
				}
			} catch (e) {
				logger('ERROR',{nom:self.nom,id:self.id,msg:'Probleme dans le contenu Json qui n est pas celui attendu',body:body},'box_domoticz');
			}
			
			
			callbackfunc(res);
		},this.user_auth,this.password_auth) 
	}
	
	
	
	this.get_etat=function(callbackfunc,periph,etatbox){
		var self=this;
		if (!etatbox && !self.last_etat) {			
			etatbox=this.get_etatbox(function(etatboxres){
				self.filtre_etat(callbackfunc,periph,etatboxres);
			});
		} else if (!etatbox){
			self.filtre_etat(callbackfunc,periph,self.last_etat);
		} else {
			self.filtre_etat(callbackfunc,periph,etatbox);
		}
	}
	
	this.filtre_etat=function(callbackfunc,periph,etatbox){
		var res=etatbox;
		if (etatbox[periph.box_identifiant] && periph.box_identifiant){
			res=etatbox[periph.box_identifiant];
		}
		if (res[periph.box_type] && periph.box_type){
			res=res[periph.box_type];
		}
		if (res[periph.box_protocole] && periph.box_identifiant){
			res=res[periph.box_protocole];
		}
		if (!res) res= {};
		res.constantes=etatbox.constantes;
		callbackfunc(periph,res);
		
	}
}

module.exports = domoticz;