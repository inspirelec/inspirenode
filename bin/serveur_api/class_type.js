/**
 * New node file
 */

var class_type = function type(){
	
	var self =this;
	
	this.chargeById=function(id,callback){
		
		var sql='Select * from type where id=\''+id+'\';';
		global.obj.app.db.sqlorder(sql,
			function(rows){
				var data=rows[0];
				for (var p in data){
					var prop=data[p];
					self[p]=prop;
				}
				callback(null,self);
			});
	}


}

class_type.charge_types=function(callback){
  	  var sql='Select * from type c;';
	  global.obj.app.db.sqlorder(sql,
		function(rows){
		  global.req.async.map(rows,function(type,callbacktt){
			  var t= new global.req.type();
			  t.chargeById(type.id,callbacktt);
		  },function(err,types){
			  
			  global.obj.types=types;
			  global.obj.app.serveur.emit('types.charge_types');
			  callback();
		  })
		});
	}

class_type.update_etat=function(callback,origine,user){
	class_type.get_etat(function(err,typeactuel){
		
		global.obj.app.core.set_last_etat(class_type,{etat:typeactuel},origine,user);
		if (callback) callback(typeactuel);
	});
}
class_type.get_etat=function(callback){
	var sql='Select * from constantes where code=\'type_actuel\';';
	global.obj.app.db.sqlorder(sql,
		function(rows){
			if (rows && rows[0]){
				var constante_type_actuel=rows[0];
				var type_actuel=global.obj.app.core.findobj(constante_type_actuel.valeur,'types');
				callback(null,type_actuel);
			} else {
				var first_type=global.obj.types[0];
				if (first_type) {
					var sql="insert into constantes (code,nom,valeur) values('type_actuel','Type (Auto/manuel) actuel','"+first_type.id+"');"
					global.obj.app.db.sqltrans(sql);
				}

				callback(null,first_type);
			}
		});
	//callback(null,null);

}

class_type.set_etat=function(id,callback,origine,user){
	var type_demande=global.obj.app.core.findobj(id,'types');
	if (type_demande) {
		var sql="delete from constantes where code='type_actuel';"
		global.obj.app.db.sqltrans(sql);
		sql="insert into constantes (code,nom,valeur) values('type_actuel','Type (Auto/manuel) actuel','"+type_demande.id+"');"
		global.obj.app.db.sqltrans(sql,function(){
			class_type.update_etat(callback,origine,user);	
		});	
		
	}
}
class_type.name='type';
module.exports = class_type;