
var reseau = function(adresseip) {
	this.adresseip=adresseip;
	
	this.set_etat=function(periph,cmd,val,callbackfunc){
		var self=this;
		var ident=periph.box_identifiant;
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
		callbackfunc({});
		
		
	}
	function array_to_obj(array){
		var res={};
		for (var l in array){
			if (array[l].trim()!=""){
			   res['l_'+l]=array[l];
			}
		}
		return res;
	}
	this.get_etatbox=function(callbackfuncetat){
		var exec = spawn=global.req.child_process.exec;
		global.req.async.waterfall([
                function(callback1){
                	var infos={platform:process.platform};
            		exec('node -v', function(error, stdout, stderr) {
            			if (stderr) {
            				infos.node_v=array_to_obj(stderr.split('\n'));
            				callback1(null,infos);
            			} else if (stdout) {
            				infos.node_v=array_to_obj(stdout.split('\n'));
            				callback1(null,infos);
            			}
            		    if (error !== null) {
            		    	callback1(null,infos);
            		    }
            		});
                },function(infos,callback1){
                	if (process.platform=='linux'){
                		exec('df -h /home/', function(error, stdout, stderr) {
                			if (stderr) {
                				infos.espace_disk=array_to_obj(stderr.split('\n'));
                				callback1(null,infos);
                			} else if (stdout) {
                				infos.espace_disk=array_to_obj(stdout.split('\n'));
                				callback1(null,infos);
                			}
                		    if (error !== null) {
                		    	callback1(null,infos);
                		    }
                		});
                	} else {
                		callback1(null,infos);
                	}

                },function(infos,callback1){
                	if (process.platform=='linux'){
                		exec('free -m', function(error, stdout, stderr) {
                			if (stderr) {
                				infos.memoire=array_to_obj(stderr.split('\n'));
                				callback1(null,infos);
                			} else if (stdout) {
                				infos.memoire=array_to_obj(stdout.split('\n'));
                				callback1(null,infos);
                			}
                		    if (error !== null) {
                		    	callback1(null,infos);
                		    }
                		});
                	} else {
                		callback1(null,infos);
                	}

                },function(infos,callback1){
                	if (process.platform=='linux'){
                		exec('date', function(error, stdout, stderr) {
                			if (stderr) {
                				infos.date=array_to_obj(stderr.split('\n'));
                				callback1(null,infos);
                			} else if (stdout) {
                				infos.date=array_to_obj(stdout.split('\n'));
                				callback1(null,infos);
                			}
                		    if (error !== null) {
                		    	callback1(null,infos);
                		    }
                		});
                	} else {
                		callback1(null,infos);
                	}

                },function(infos,callback1){
                	if (process.platform=='linux'){
                		exec('echo $PATH', function(error, stdout, stderr) {
                			if (stderr) {
                				infos.path=array_to_obj(stderr.split(':'));
                				callback1(null,infos);
                			} else if (stdout) {
                				infos.path=array_to_obj(stdout.split(':'));
                				callback1(null,infos);
                			}
                		    if (error !== null) {
                		    	callback1(null,infos);
                		    }
                		});
                	} else {
                		callback1(null,infos);
                	}

                }]
		,function(err,infos){
			callbackfuncetat(infos);
        });
		
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
		/*if (etatbox[periph.inspireathome_box_id]){
			res=etatbox[periph.inspireathome_box_id];
			if (etatbox[periph.inspireathome_box_id].last_etat){*/
				var prefixe_identifiant="",prefixe_type="",prefixe_protocole="";

				/*res=etatbox[periph.inspireathome_box_id].last_etat;*/
				if (res[prefixe_identifiant+periph.box_identifiant]) {
					res=res[prefixe_identifiant+periph.box_identifiant];
					if (res[prefixe_type+periph.box_type]){
						res=res[prefixe_type+periph.box_type];
						if (res[prefixe_protocole+periph.box_protocole]){
							res=res[prefixe_protocole+periph.box_protocole];
						}
					}
				}					
			/*}
		
		}*/

		if (!res) res= {};
		res.constantes=etatbox.constantes;
		callbackfunc(periph,res);
	}
}

module.exports = reseau;