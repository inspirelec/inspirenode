/**
 * New node file
 */

var parserxml2json = new global.req.xml2js.Parser();


var ipx800 = function(adresseip) {
	this.adresseip=adresseip;
	
	
	this.set_etat=function(periph,cmd,val,callbackfunc){
		var self=this;
		var ident=periph.box_identifiant;
		logger('INFO',{nom:self.nom,id:self.id,msg:"mise a jour etat cmd:"+cmd+", val:"+val},'box_virtuel');
		
		switch (cmd) {
		case 'ON':
			if (val!=periph.ecriture_max_value && val!=periph.ecriture_min_value) val=periph.ecriture_max_value;
			break;
		case 'OFF':
			if (val!=periph.ecriture_max_value && val!=periph.ecriture_min_value) val=periph.ecriture_min_value;
			break;

		case 'UP':
			if (val!=periph.ecriture_max_value && val!=periph.ecriture_min_value) val=periph.ecriture_max_value;
			break;
		case 'DOWN':
			if (val!=periph.ecriture_max_value && val!=periph.ecriture_min_value) val=periph.ecriture_min_value;
			break;
		default:
			break;
		}
		var sql =['delete from box_virtuel_etat where id_box='+self.id+' and id_peripherique=\''+periph.id+'\';',
		          "insert into box_virtuel_etat (id_box,id_peripherique,value,last_command) values ("+self.id+",'"+periph.id+"','"+val+"','"+cmd+"');"];
		logger('INFO',{nom:self.nom,id:self.id,msg:" --maj database:",sqls:sql},'box_virtuel');
		if (!val || val==null || typeof val =='undefined'){
			logger('ERROR',{nom:self.nom,id:self.id,msg:" --aucune valeur de passée:",valeur:val,cmd:cmd,sqls:sql},'box_virtuel');
		}
		if (self.last_etat && self.last_etat[periph.box_identifiant]) {
			self.last_etat[periph.box_identifiant].value=val;
			self.last_etat[periph.box_identifiant].last_command=cmd;
		}
		/*if (periph.last_etat && periph.last_etat.expression) {
			periph.last_etat.expression.etat=val;			
		}*/
		global.obj.app.db.sqltrans(sql,function(){
			
			if (callbackfunc) callbackfunc();
		},null,'virtuel');


		
		
	}
	
	this.get_etatbox=function(callbackfunc){
		var sql='Select * from box_virtuel_etat where id_box='+this.id+';';
		var self=this;
		//console.log(sql);
		global.obj.app.db.sqlorder(sql,
			function(rows){
				var rowsbis=rows;
				var res={};
				//console.log('il y a '+rows.length+' lignes');
				for (var ir in rows) {
				
					//console.log(ir);
					var e={value:rows[ir].value,last_command:rows[ir].last_command};
					res['id_'+rows[ir].id_peripherique]=e;
					
				}
				//if (rows.length<22)
				//	console.log(ir);
				logger('INFO',{nom:self.nom,id:self.id,msg:"get etat box virtuelle:",result:res},'box_virtuel');
				
				//if (rows.length<11) console.log('box_id:'+self.id,'nbrows:'+rows.length,'nbrowsbis:'+rowsbis.length,res,rows);
				
				callbackfunc(res);
			},null,'virtuel');
	}
	
	
	this.get_etat=function(callbackfunc,obj_peripherique,etatbox){
		var self=this;
		if (!etatbox && !self.last_etat) {			
			etatbox=this.get_etatbox(function(etatboxres){
				self.filtre_etat(callbackfunc,obj_peripherique,etatboxres);
			});
		} else if (!etatbox){
			self.filtre_etat(callbackfunc,obj_peripherique,self.last_etat);
		} else {
			self.filtre_etat(callbackfunc,obj_peripherique,etatbox);
		}
	}
	
	this.filtre_etat=function(callbackfunc,periph,etatbox){
		var res=etatbox;
		if (etatbox[periph.box_identifiant]) {
			res=etatbox[periph.box_identifiant];
			
		}
		if (!res) res= {};
		res.constantes=etatbox.constantes;
		callbackfunc(periph,res);
	}
}

module.exports = ipx800;