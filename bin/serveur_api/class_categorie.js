/**
 * New node file
 */

var class_categorie = function categorie(){

	var self =this;

	this.chargeById=function(id,callback){

		var sql='Select * from categorie where id=\''+id+'\';';
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

};

class_categorie.charge_categories=function(callback){
  	  var sql='Select * from categorie c;';
	  global.obj.app.db.sqlorder(sql,
		function(rows){
		  global.req.async.map(rows,function(categ,callbacktt){
			  var t= new global.req.categorie();
			  t.chargeById(categ.id,callbacktt);
		  },function(err,categories){
		  	try {
			  var consigne_temperature_exists=false;
			  var categorie_exemple={};
			  for (var cat in categories){
				  //console.log('exist',categories[cat].type);
				  if (categories[cat].type=='consigne_temperature'){
					  consigne_temperature_exists=true;
					  //console.log('exist',categories[cat].type);
				  }
				  if (categories[cat].type=='sonde_de_temperature'){
					  categorie_exemple=categories[cat];
					  //console.log('exemple',categories[cat].type);
				  }
			  }
			  //console.log('categorie Consigne temp. deja cr�ee',consigne_temperature_exists);
			  
			  if (!consigne_temperature_exists){
			  	//console.log('creation auto categorie Consigne temp');
				  var objsave={};
					objsave.action="save";
					objsave.element="categorie";
					objsave.data=categorie_exemple;
					objsave.data.nom='Consigne temp.'
					objsave.data.id=null;
					objsave.data.uuid=null;
					objsave.data.type='consigne_temperature';
					objsave.data.programmable='O';
				  obj.app.core.majdb(objsave,function(variabls,reponse){
					  var sql="update consigne_temp set categorie='"+reponse.element.id+"' where categorie is null;";
						global.obj.app.db.sqltrans(sql,function(){
							//console.log('-');
						});
						//console.log('fin cr�ation auto categorie Consigne temp.',JSON.stringify(reponse));
				  });
			  }
			  } catch(e){
			  }
			  global.obj.categories=categories;
			  //console.log('categories',global.obj.categories);
			  global.obj.app.serveur.emit('categorie.charge_categories');
			  callback();
		  })
		});
	}
//class_categorie.prototype= new global.req.events.EventEmitter();
module.exports = class_categorie;