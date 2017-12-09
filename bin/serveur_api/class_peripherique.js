/**
 * New node file
 */


var class_peripherique = function peripherique(){
	
	var self =this;
	
	self.get_etatbox=function(callback){
		self =this;
		self.box.get_etatbox(callback);
	}
	self.get_etat=function(callback){
		self =this;

		if (self.box) {
			self.box.get_etat(function(periph,result){
				 /*if (periph.box.model!='virtuel'){
				 	console.log(periph.box);
				 }*/
					var res=result;
					if (!res) res={};
					var constantes={};
					for (var c in global.obj.constantes){
						var co=global.obj.constantes[c];
						constantes[co.code]=co.valeur;
					}
                    res.constantes=constantes;
					var lastetat={};
					for (var c in global.obj.peripheriques){
						var co=global.obj.peripheriques[c];
						if (co.last_etat && co.last_etat.expression) {
                            lastetat['id_'+co.id]={};
                            Object.assign(lastetat['id_'+co.id],co.last_etat.expression);
						} else {
                            lastetat['id_'+co.id]={};
						}
                        lastetat['id_'+co.id].nom=co.nom;
						if (co.box) {
                            Object.assign(lastetat['id_'+co.id],{box:co.box.nom,nom:co.nom});
						}

					}
					res.etatactuel=lastetat;
					var etatavant={};
					for (var c in global.obj.peripheriques){
						var co=global.obj.peripheriques[c];
						if (co.etatavant && co.etatavant.expression) {
							etatavant['id_'+co.id]={};
							Object.assign(etatavant['id_'+co.id],co.etatavant.expression);
						} else {
							etatavant['id_'+co.id]={};
						}
						etatavant['id_'+co.id].nom=co.nom;
						if (co.box) {
							Object.assign(etatavant['id_'+co.id],{box:co.box.nom,nom:co.nom});
						}
					}
					res.etatavant=etatavant;
					callback(periph,res);
				},self);			
		} else {
			callback(self,{});
		}

	}
	
	self.set_etat=function(cmd,val,callback,originesetetat,user){
		self =this;
		/*console.log(self.uuid +" =>"+cmd+" ="+val);
		if (self.last_etat && self.last_etat.expression){
			console.log(self.uuid +" : "+self.last_etat.expression.etat);
		}*/
		
		logger('DEBUG',{msg:'Set_last_etat peripherique.js',nom:obj.nom,id:obj.id,originesetetat:originesetetat,new_etat:new_etat+ ' , ' + self.last_etat.expression},'changement_etat');

		function setON(id,callback){
			//console.log('ON '+id);
			if (!callback) callback=function(){};
			var periph=global.obj.app.core.findobj(id,'peripheriques');
			global.obj.app.core.findobj(id,'peripheriques').set_etat('ON',periph.ecriture_max_value,callback,originesetetat,user);
		}
		function setOFF(id,callback){
			//console.log('OFF '+id);
			if (!callback) callback=function(){};
			var periph=global.obj.app.core.findobj(id,'peripheriques');
			global.obj.app.core.findobj(id,'peripheriques').set_etat('OFF',periph.ecriture_min_value,callback,originesetetat,user);
		}
		function setUP(id,callback){
			//console.log('UP '+id);
			if (!callback) callback=function(){};
			var periph=global.obj.app.core.findobj(id,'peripheriques');
			global.obj.app.core.findobj(id,'peripheriques').set_etat('UP',periph.ecriture_max_value,callback,originesetetat,user);
		}
		function setDOWN(id,callback){
			//console.log('DOWN '+id);
			if (!callback) callback=function(){};
			var periph=global.obj.app.core.findobj(id,'peripheriques');
			global.obj.app.core.findobj(id,'peripheriques').set_etat('DOWN',periph.ecriture_min_value,callback,originesetetat,user);
		}
		function setDIM(id,val,callback){
			//console.log('DIM '+val + ' '+id);
			if (!callback) callback=function(){};
			global.obj.app.core.findobj(id,'peripheriques').set_etat('DIM',val,callback,originesetetat,user);
		}
		function setAutomationON(id){
			var automat=global.obj.app.core.findobj(id,'automation');
			if (automat) automat.start();
		}
		function setAutomationOFF(id){
			var automat=global.obj.app.core.findobj(id,'automation');
			automat.stop();
		}
		var valm=val;
		if (cmd=='ON' || cmd=='UP') {if(self.ecriture_max_value) valm=self.ecriture_max_value; else valm=1;}
		if (cmd=='OFF' || cmd=='DOWN' || cmd=='STOP') {if(self.ecriture_min_value) valm=self.ecriture_min_value; else valm=0;}		
		

		
		var new_etat={};
		if (self.last_etat && self.last_etat.expression)
			new_etat=JSON.parse(JSON.stringify(self.last_etat.expression));
		
		new_etat.etat=valm;
		
		self.set_etat_box(self,cmd,valm,new_etat,originesetetat,user,callback);
				
		
		if (cmd=='ON' && self.ecriture_etat_ON && self.ecriture_etat_ON+""!=""){
			eval(self.ecriture_etat_ON);
		}
		if ((cmd=='OFF' || cmd=='STOP') && self.ecriture_etat_OFF && self.ecriture_etat_OFF+""!=""){
			eval(self.ecriture_etat_OFF);
		}
		if (cmd=='DIM' && self.ecriture_etat_DIM && self.ecriture_etat_DIM+""!=""){
			eval(self.ecriture_etat_DIM);
		}
		if (cmd=='UP' && self.ecriture_etat_UP && self.ecriture_etat_UP+""!=""){
			eval(self.ecriture_etat_UP);
		}
		if (cmd=='DOWN' && self.ecriture_etat_DOWN && self.ecriture_etat_DOWN+""!=""){
			eval(self.ecriture_etat_DOWN);
		}

	}
	
	self.set_etat_box=function(self,cmd,valm,new_etat,originesetetat,user,callback){
		self.box.set_etat(self,cmd,valm,function(majetat){
			if (majetat==false) {
				
			} else {
				global.obj.app.core.set_last_etat(self,new_etat,originesetetat,user);
			}
			if (callback) callback();
		});
	}
	
	self.get_expr=function(callback){
		self =this;

		self.get_etat(function(p,result){
			//console.error(p.id,result);
			result.expr=function(expr){
				var round=function(number,nbdec){
					var p=Math.pow(10,nbdec);
					return Math.round(number*p)/p;
				}
				var to_date= function (timestamp){
					var datetime=new Date();
					datetime.setTime( timestamp - datetime.getTimezoneOffset()*60*1000 );
					return datetime;
				}
				var to_datefr= function (timestamp){
					var datetime=to_date(timestamp);
					var yyyy = datetime.getUTCFullYear();
					var mm = datetime.getUTCMonth()+1;
					var dd = datetime.getUTCDate();
					var hh = datetime.getUTCHours();
					var mi = datetime.getUTCMinutes();
					var ss = datetime.getUTCSeconds();
					return dd+'/'+mm+' '+hh+':'+mi;
				}
				var moyenne=function(array_obj,propertie){
					var sum_val=0;
					var nb_val=0;
					for (var s in array_obj){
						var v=array_obj[s]['expression'][propertie];
						if (!isNaN(v)){
							sum_val+=v;
							nb_val++;
						}
					}
					if (nb_val>0) {
						return sum_val/ nb_val;
					} else {
						return null;
					}
					
				}				
				var res={};
				try {
					if (expr) {
						var exprs=expr.split('$').join("this.");
						res.result=eval(exprs);
					}
				} catch (e) {
					res.error=expr +" ==> "+e.type + " : "+ e.message;
				}
				if (res.result+""=="" && expr && expr!="") {res.result=""};
				return res;};
			if (result.erreur=="manque_etat_enfant") {
				callback(null);
			} else {
				res={};
                var properties=[{name:"expr7_val",champexpr:'lecture_expr7'},
                    			{name:"expr7_unit",champexpr:'lecture_expr7_unit'},
								{name:"expr6_val",champexpr:'lecture_expr6'},
								{name:"expr6_unit",champexpr:'lecture_expr6_unit'},
								{name:"expr5_val",champexpr:'lecture_expr5'},
								{name:"expr5_unit",champexpr:'lecture_expr5_unit'},
								{name:"expr4_val",champexpr:'lecture_expr4'},
								{name:"expr4_unit",champexpr:'lecture_expr4_unit'},
								{name:"expr3_val",champexpr:'lecture_expr3'},
								{name:"expr3_unit",champexpr:'lecture_expr3_unit'},
								{name:"expr2_val",champexpr:'lecture_expr2'},
								{name:"expr2_unit",champexpr:'lecture_expr2_unit'},
								{name:"expr1_val",champexpr:'lecture_expr1'},
								{name:"expr1_unit",champexpr:'lecture_expr1_unit'},
								{name:"etat",champexpr:'lecture_etat_expr'},
								{name:"etat_unit",champexpr:'lecture_compl_hist'},
								{name:"etat2",champexpr:'etat2'}
                ];

                for (var p in properties){
                	var calculexpr=result.expr(self[properties[p].champexpr]);
                	if(isRealValue(calculexpr.error) || !isRealValue(calculexpr.result)){
                		if (result.etatactuel && isRealValue(result.etatactuel[properties[p].name])) {
                            res[properties[p].name]=result.etatactuel[properties[p].name];
                        }
                        res[properties[p].name+'_ERROR']=calculexpr.error;
					} else {
                        res[properties[p].name]=calculexpr.result;
					}

				}
				callback(res);
			}


		});
	}
	self.chargeByData=function(data,callback){
		for (var p in data){
			var prop=data[p];
			self[p]=prop;
		}
		this.chargeById("-1",callback);
	}
	self.chargeById=function(id,callback){
		
		global.req.async.series([
		   /*chargement des data*/
		      function(callbackd){ 
		    	  
		    	  var sql='Select * from peripherique where id=\''+id+'\';';
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
			/*chargement graph*/
		      function(callbackg){    
		    	  self.lecture_etat_graph=global.obj.app.core.findobj(self.lecture_etat_graph,'graphs');
		    	  self.lecture_expr1_graph=global.obj.app.core.findobj(self.lecture_expr1_graph,'graphs');
		    	  self.lecture_expr2_graph=global.obj.app.core.findobj(self.lecture_expr2_graph,'graphs');
		    	  self.lecture_expr3_graph=global.obj.app.core.findobj(self.lecture_expr3_graph,'graphs');
		    	  self.lecture_expr4_graph=global.obj.app.core.findobj(self.lecture_expr4_graph,'graphs');
		    	  self.lecture_expr5_graph=global.obj.app.core.findobj(self.lecture_expr5_graph,'graphs');
		    	  self.lecture_expr6_graph=global.obj.app.core.findobj(self.lecture_expr6_graph,'graphs');
		    	  self.lecture_expr7_graph=global.obj.app.core.findobj(self.lecture_expr7_graph,'graphs');
		    	  callbackg();
			      },
			/*chargement tags*/
		      function(callbackt){    
			    	  var sql='Select * from tag t where exists (select 1 from peripherique_tag l where l.id_tag=t.id and l.id_peripherique=\''+id+'\');';
			    	  
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
		      
        ], function(err) { //This is the final callback
			
            //console.log(JSON.stringify(self));
			//global.obj.app.serveur.emit('peripherique.charge_peripherique',self);
            //global.obj.app.serveur.emit('periph_load',self);
            callback(null,self);
        });
	}
	
}

class_peripherique.charge_peripheriques=function(callback){
	  var sql='Select * from peripherique p;';
	  global.obj.app.db.sqlorder(sql,
		function(rows){
		  global.req.async.map(rows,function(periph,callbacktt){
			  var t= new global.req.peripherique();
			  t.chargeById(periph.id,callbacktt);
		  },function(err,peripheriques){
	
			  global.obj.peripheriques=peripheriques;
			  global.obj.app.serveur.emit('peripherique.charge_peripheriques');
			  callback();
		  })
		});
	}


class_peripherique.update_etat_periph_of_box=function(box,callback,originesetetat){
    //console.trace('class_peripherique.update_etat_periph_of_box','box',box.id,originesetetat);
	global.req.async.map(global.obj.peripheriques,function(periph,callbackbe){
		if (periph.box_id==box.id){
			periph.get_expr(function(result_json){

				global.obj.app.core.set_last_etat(periph,res,originesetetat);
				//console.log('-----'+periph.nom);
				callbackbe();
			});
		} else {
			callbackbe();
		}
	  },function(err){
		  global.obj.app.serveur.emit('peripherique.update_etat_periph_of_box',box);
		  //console.log('fin chargement etat periph de box '+ box.nom);
		  callback();

	  });
}

class_peripherique.update_etat_periph=function(periph,callbackbe,originesetetat){
	periph.get_expr(function(result_json){
		
		global.obj.app.core.set_last_etat(periph,res,originesetetat);
		//console.log('-----'+periph.nom+'=='+JSON.stringify(res));
		if (callbackbe)	callbackbe(result_json);
	});
}

//class_peripherique.prototype= new global.req.events.EventEmitter();
//class_peripherique.prototype.constructor=class_peripherique;


module.exports = class_peripherique;