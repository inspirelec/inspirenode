/**
 * New node file
 */

var class_constante = function constante(){
	
	var self =this;
	
	this.chargeById=function(id,callback){
		
		var sql='Select * from constantes where id=\''+id+'\';';
		global.obj.app.db.sqlorder(sql,
			function(rows){
				var data=rows[0];
				for (var p in data){
					var prop=data[p];
					self[p]=prop;
					if (prop && isNaN(prop)) {
						self[p]=""+prop;
					} else if (prop) {
						self[p]=parseFloat(prop);
					}
				}
				callback(null,self);
			});
	}

	
}

class_constante.charge_constantes=function(callback){
	  var sql='Select * from constantes c;';
	  
	  global.obj.app.db.sqlorder(sql,
		function(rows){
		  global.req.async.map(rows,function(constant,callbacktt){
			  var t= new global.req.constante();
			  t.chargeById(constant.id,callbacktt);
		  },function(err,constantes){
			  global.obj.constantes=constantes;
			  global.obj.app.serveur.emit('constante.charge_constantes');
			  
			  if (callback) callback();
		  })
		});
	}

class_constante.get_etat=function(id,callback){
	var sql='Select * from constantes where code=\''+id+'\';';
	global.obj.app.db.sqlorder(sql,
		function(rows){
			if (rows && rows[0]){
				var constante_type_actuel=rows[0];
				callback(constante_type_actuel.valeur);
			} else {
				callback(null);
			}
		});

}
class_constante.set_etat=function(code,valeur,callback){

    objsave.action="save";
    objsave.element="constantes";
    objsave.data={id:this.id,code:code,valeur:valeur,nom:this.nom};
    //console.log(JSON.stringify(objsave));
    global.obj.app.core.majdb(objsave,callback);

    /*var nom=code;
		global.req.async.series([
		function (callbackd){
			var sql="select * from constantes where code='"+code+"';"
			global.obj.app.db.sqlorder(sql,function(rows){
				if (rows[0] && rows[0].nom) nom=rows[0].nom;
				callbackd()
			});			
			
		},
		function (callbackd){
			var sql="delete from constantes where code='"+code+"';"
			global.obj.app.db.sqltrans(sql,function(){
				callbackd()
			});			
		},
		function(callbacki){
			sql="insert into constantes (code,nom,valeur) values('"+code+"','"+nom+"','"+valeur+"');"
			global.obj.app.db.sqltrans(sql,function(){
				callbacki()
			});			
		}],function(err){
			global.req.constante.charge_constantes(callback);
			
		})*/
		
}
//class_categorie.prototype= new global.req.events.EventEmitter();
module.exports = class_constante;