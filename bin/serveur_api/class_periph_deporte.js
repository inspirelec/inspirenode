/**
 * New node file
 */


var class_periph_deporte = function peripherique_deporte(){
	
	var self =this;
	

	/*self.set_etat=function(cmd,val,callback){
		self.box.set_etat(self,cmd,val,callback);
	}*/
	self.get_expr=function(callback){
		
		self =this;
		if (self.box) {
			self.box.get_etat(function(periph,result){
				if (result.last_etat && result.last_etat.expression) {
					callback(result.last_etat.expression);
				} else {
					callback({});
				}
			},self);			
		} else {
			callback({});
		}
	}
	self.chargeById=function(id,callback){
		
		global.req.async.series([
		   /*chargement des data*/
		      function(callbackd){ 
		    	  
		    	  var sql='Select * from peripheriquedeporte where id=\''+id+'\';';
		    	  global.obj.app.db.sqlorder(sql,
					function(rows){
						var data=rows[0];
						for (var p in data){
							var prop=data[p];
							self[p]=prop;
						}
						callbackd();
					});
		      },
		    /*chargement categorie*/
		      function(callbackc){    
		    	  self.categorie=global.obj.app.core.findobj(self.categorie_id,'categories');
		    	  callbackc();
			      },
			/*chargement box*/
		      function(callbackb){    
			      self.box=global.obj.app.core.findobj(self.box_id,'boxs');
		    	  callbackb();
			      },
			/*chargement tags*/
		      function(callbackt){    
			    	  var sql='Select * from tag t where exists (select 1 from peripheriquedeporte_tag l where l.id_tag=t.id and l.id_peripheriquedeporte=\''+id+'\');';
			    	  
			    	  global.obj.app.db.sqlorder(sql,
						function(rows){
			    		  global.req.async.map(rows,function(tag,callbacktt){
			    			  /*var t= new global.req.tag();
			    			  t.chargeById(tag.id,callbacktt);*/
						      var t=global.obj.app.core.findobj(tag.id,'tags');
						      callbacktt(null,t);
			    		  },function(err,tags){
			    			  self.tag=tags;
			    			  callbackt();
			    		  })
						});
			      },
			  /*chargement propriétés deportées*/
		      function(callbacke){    
			      delete(self.box_protocole);
			      if (self.box) {
			    	  self.box.get_etat(function(periph,res){	
			    		  if (res.ecriture_max_value) self.ecriture_max_value=res.ecriture_max_value;
			    		  if (res.ecriture_min_value) self.ecriture_min_value=res.ecriture_min_value;
			    		  if (res.ecriture_type) self.ecriture_type=res.ecriture_type;
			    		  if (res.uuid) self.uuid_deporte=res.uuid;
			    		  if (res.id) self.id_deporte=res.id;
			    		  callbacke();
			    	  	},self)			    	  
			      } else {
			    	  callbacke();
			      }

			   },
		      
        ], function(err) { //This is the final callback
			
            //console.log(JSON.stringify(self));
			//global.obj.app.serveur.emit('peripherique.charge_peripherique',self);
            //global.obj.app.serveur.emit('periph_load',self);
            
			callback(null,self);
        });
	}
}



class_periph_deporte.generationGlobale=function(callback){
	  var sql='Select * from peripheriquedeporte p;';
	  global.obj.app.db.sqlorder(sql,
		function(rows){
		  global.req.async.map(rows,function(periphd,callbacktt){
			  var t= new global.req.periph_deporte();
			  t.chargeById(periphd.id,callbacktt);
		  },function(err,peripheriquesdeportes){
	
			  global.obj.peripheriquesdeportes=peripheriquesdeportes;

			  global.obj.app.serveur.emit('peripheriquedeporte.charge_peripheriquesdeportes');
			  callback();
		  })
		});
	}

class_periph_deporte.charge_peripheriques_deporte=function(callback){
	global.req.periph_deporte.generationGlobale(function(periph_deporte){
		callback();
	});
}
class_periph_deporte.update_etat_periphdeporte=function(callback){
	global.req.async.map(global.obj.peripheriquesdeportes,function(periph,callbackbe){
		
	periph.get_expr(function(result_json){
		global.obj.app.core.set_last_etat(periph,result_json);
		callbackbe();
	});
	
  },function(err){
	  global.obj.app.serveur.emit('periph_deporte.update_etat_periphdeporte');
	  //console.log('fin chargement etat periph de chauffe ');
	  callback();
  });
}


//class_periph_chauffage.prototype= new global.req.events.EventEmitter();

class_periph_deporte.prototype= new global.req.peripherique();
class_periph_deporte.prototype.constructor=class_periph_deporte;

module.exports = class_periph_deporte;