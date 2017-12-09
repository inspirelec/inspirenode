/**
 * New node file
 */

var class_alerte = function alerte(){
	
	var self =this;

	this.chargeByData=function(data,callback){
		for (p in data){
			var prop=data[p];
			self[p]=prop;
		}

		this.chargeById("-1",callback);
	}
	this.chargeById=function(id,callback){

		global.req.async.series([
      		   /*chargement des data*/
      		      function(callbackd){
      		      	    if (id==-1) {
                            callbackd();
						} else {
                            var sql='Select * from alerte where id=\''+id+'\';';
                            global.obj.app.db.sqlorder(sql,
                                function(rows){
                                    var data=rows[0];
                                    for (p in data){
                                        var prop=data[p];
                                        self[p]=prop;
                                    }
                                    callbackd();
                                });
						}
				  },
			      function(callbackc){    

						callbackc();
				      }]
		, function(err) { //This is the final callback
			
            //console.log(JSON.stringify(self));
                if (id==-1) {
                    callback(null,self);
                } else {
                    global.obj.app.serveur.emit('alerte.loaded', self);
                    callback(null, self);
                }
        });
	}
	this.save=function(callback){
		var obj={element:'alerte',action:'save',data:self};

        global.obj.app.core.majdb(obj,
            function(variabls,reponse){
                if (reponse.type=='update'){
                	/*update*/
                    global.obj.app.serveur.emit('alerte.updated',self);
				} else {
                	/*insert*/
                    global.obj.alertes.push(self);
                    global.obj.app.serveur.emit('alerte.added',self);
				}
                if (callback) {
                    callback(self);
				}
            });
	}
	this.savehisto=function(callback){
        var obj={element:'alerte_historique',action:'save',data:{}};
        Object.assign(obj.data,self);
        delete obj.data.id;
        var timestamp=req.moment().format('YYYY-MM-DD HH:mm:ss');
        obj.data.date_acquitement=timestamp;
        obj.data.timestamp_modif=timestamp;

        global.obj.app.core.majdb(obj,
            function(variabls,reponse){
                if (reponse.type=='update'){
                    /*update*/
                    global.obj.app.serveur.emit('alertehisto.updated',self);
                } else {
                    /*insert*/
                    global.obj.alertes.push(self);
                    global.obj.app.serveur.emit('alertehisto.added',self);
                }
                if (callback) {
                    callback(self);
                }
            });
    }
    this.remove=function(callback){
        var obj={element:'alerte',action:'delete',data:self};


        global.obj.app.core.majdb(obj,
            function(variabls,reponse){

                var index = global.obj.alertes.indexOf(self);
                if (index > -1) {
                    global.obj.alertes.splice(index, 1);
                }

                global.obj.app.serveur.emit('alerte.removed',self);

                if (callback) {
                    callback(self);
                }
            });
    }

    this.acquiter=function(callback){
        this.savehisto(function(alerte){
            alerte.remove(function(alerte){
                global.obj.app.serveur.emit('alerte.acquited',alerte);
                if (callback) {
                    callback(alerte);
                }
            });
        })
    }

}





class_alerte.charge_alertes=function(callback){
  	  var sql='Select * from alerte c;';
	  global.obj.app.db.sqlorder(sql,
		function(rows){
		  global.req.async.map(rows,function(alerte,callbacktt){
			  var t= new global.req.alerte();
			  t.chargeById(alerte.id,callbacktt);
		  },function(err,alertes){
			  global.obj.alertes=alertes;
			  global.obj.app.serveur.emit('alertes.charge_alertes');
			  callback();
		  })
		});
	}

class_alerte.create=function(levels,origine,origine_identifiant,etat,libelle,commentaire,callback){
    /*	"colonnes": [
			 {"name" : "id" , "type" : " integer primary key autoincrement"},
			 {"name" : "date_alerte" , "type" : "TEXT"},
			 {"name" : "date_acquitement" , "type" : "TEXT"},
			 {"name" : "timestamp_modif" , "type" : "TEXT"},
			 {"name" : "libelle" , "type" : "TEXT"},
			 {"name" : "commentaire" , "type" : "TEXT"},
			 {"name" : "levels","type":"TEXT",formulaire: "select" , "object" : [{"id":"ERROR","nom":"ERROR"},
															 {"id":"WARNING","nom":"WARNING"},
															 {"id":"INFO","nom":"INFO"},
															 {"id":"DEBUG","nom":"DEBUG"}]},
				{"name" : "etat" , "type" : "TEXT"},
				{"name" : "origine" , "type" : "TEXT"},
				{"name" : "origine_identifiant" , "type" : "TEXT"},
				{"name" : "uuid" , "type" : "TEXT"}		 ]*/
    /*test si exists*/
        var timestamp=req.moment().format('YYYY-MM-DD HH:mm:ss');
        var t= new global.req.alerte();
        t.origine=origine;
        t.levels=levels;
        t.origine_identifiant=origine_identifiant;
        t.etat=etat;
        t.libelle=libelle;
        t.commentaire=commentaire;
        t.date_alerte=timestamp;
        t.timestamp_modif=timestamp;
        t.save(callback);

}
class_alerte.createifnotexist=function(levels,origine,origine_identifiant,etat,secondsbeforerecreate,libelle,commentaire,callback){

         var existe_deja =false;
         for (var a in global.obj.alertes){
         	if (global.obj.alertes[a].origine_identifiant==origine_identifiant &&
                global.obj.alertes[a].origine==origine &&
                global.obj.alertes[a].etat==etat &&
                global.obj.alertes[a].levels==levels) {

         	    if (secondsbeforerecreate>0){
                    var timestampnow=req.moment();
                    var timestampalerte=req.moment(global.obj.alertes[a].date_alerte);
                    timestampalerte.add(secondsbeforerecreate,'s');
                    if (timestampnow.isSameOrBefore(timestampalerte)) {
                        existe_deja=true;
                    }
                } else {
                    existe_deja=true;
                }
			}
		 }
    if (existe_deja==false){
             this.create(levels,origine,origine_identifiant,etat,libelle,commentaire,callback);
    } else {
        if (callback) {
            callback(false);
        }
    }
}

//class_categorie.prototype= new global.req.events.EventEmitter();
module.exports = class_alerte;