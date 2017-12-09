/**
 * New node file
 */

var class_mode = function mode(){
	
	var self =this;
	
	this.chargeById=function(id,callback){
		
		var sql='Select * from mode where id=\''+id+'\';';
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

class_mode.charge_modes=function(callback){
  	  var sql='Select * from mode c;';
	  global.obj.app.db.sqlorder(sql,
		function(rows){
		  global.req.async.map(rows,function(mode,callbacktt){
			  var t= new global.req.mode();
			  t.chargeById(mode.id,callbacktt);
		  },function(err,modes){
			  
			  global.obj.modes=modes;
			  global.obj.app.serveur.emit('modes.charge_modes');
			  callback();
		  })
		});
	}

class_mode.update_etat=function(callback,origine,user){

	class_mode.get_etat(function(err,modeactuel){
		//console.log('mode actuel',modeactuel);
		
		global.obj.app.core.set_last_etat(class_mode,{etat:modeactuel},origine,user);
		//deletemodediffere();
		if (callback) callback(modeactuel);
	});
}
class_mode.get_etat=function(callback){
	var sql='Select * from constantes where code=\'mode_actuel\';';
	global.obj.app.db.sqlorder(sql,
		function(rows){
			if (rows && rows[0]){
				var constante_mode_actuel=rows[0];
				var mode_actuel=global.obj.app.core.findobj(constante_mode_actuel.valeur,'modes');
				callback(null,mode_actuel);
			} else {
				var first_mode=global.obj.modes[0];
				if (first_mode) {
					var sql="insert into constantes (code,nom,valeur) values('mode_actuel','Mode de chauffage actuel','"+first_mode.id+"');"
					global.obj.app.db.sqltrans(sql);
				}

				callback(null,first_mode);
			}
		});
	//callback(null,null);

}
class_mode.set_etat=function(id,callback,origine,user){
	var mode_demande=global.obj.app.core.findobj(id,'modes');
    var mode_constante=global.obj.app.core.findobj('mode_actuel','constantes');

    var objsave={};
    var self=this;
    objsave.action="save";
    objsave.element="constantes";
    objsave.data={id:mode_constante.id,code:mode_constante.code,valeur:mode_demande.id,nom:mode_constante.nom};
    //console.log(JSON.stringify(objsave));

    global.obj.app.core.majdb(objsave,
        function(){
            class_mode.update_etat(callback,origine,user);
        });

	/*if (mode_demande) {
		var sql="delete from constantes where code='mode_actuel';"
		global.obj.app.db.sqltrans(sql);
		sql="insert into constantes (code,nom,valeur) values('mode_actuel','Mode de chauffage actuel','"+mode_demande.id+"');"
		global.obj.app.db.sqltrans(sql,function(){
			class_mode.update_etat(callback,origine,user);
		});	
		
	}*/
}
class_mode.name='mode';
module.exports = class_mode;