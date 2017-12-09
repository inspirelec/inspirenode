
var camera = function(adresseip) {
	this.adresseip=adresseip;
	
	this.set_etat=function(periph,cmd,val,callbackfunc){
		var selfcam=this;
		var ident=periph.box_identifiant;
		//console.log(cmd,val);
		switch (cmd) {
		case 'ON':
			//gauche
			//http://192.168.1.29:81/decoder_control.cgi?command=4&onestep=4&user=admin&pwd=
			var command=4;
			var onestep=2;
			logger('INFO',{nom:selfcam.nom,id:selfcam.id,msg:"Ordre envoyé a la box ",lien:selfcam.ip+':81/decoder_control.cgi?command='+command+'&onestep='+onestep+''},'box_camera');
			global.req.comm.perso_get(selfcam.ip,'/decoder_control.cgi?command='+command+'&onestep='+onestep+'',81,function(err,httpResponse,body){
				callbackfunc();
			},selfcam.user_auth,selfcam.password_auth);
			break;
		case 'OFF':
			//droite
			//http://192.168.1.29:81/decoder_control.cgi?command=6&onestep=4&user=admin&pwd=
			var command=6;
			var onestep=2;
			logger('INFO',{nom:selfcam.nom,id:selfcam.id,msg:"Ordre envoyé a la box ",lien:selfcam.ip+':81/decoder_control.cgi?command='+command+'&onestep='+onestep+''},'box_camera');
			global.req.comm.perso_get(selfcam.ip,'/decoder_control.cgi?command='+command+'&onestep='+onestep+'',81,function(err,httpResponse,body){
				callbackfunc();
			},selfcam.user_auth,selfcam.password_auth);
			break;

		case 'UP':
			//http://192.168.1.29:81/decoder_control.cgi?command=0&onestep=4&user=admin&pwd=
			var command=0;
			var onestep=2;
			logger('INFO',{nom:selfcam.nom,id:selfcam.id,msg:"Ordre envoyé a la box ",lien:selfcam.ip+':81/decoder_control.cgi?command='+command+'&onestep='+onestep+''},'box_camera');
			global.req.comm.perso_get(selfcam.ip,'/decoder_control.cgi?command='+command+'&onestep='+onestep+'',81,function(err,httpResponse,body){
				callbackfunc();
			},selfcam.user_auth,selfcam.password_auth);break;
		case 'DOWN':
			//http://192.168.1.29:81/decoder_control.cgi?command=2&onestep=4&user=admin&pwd=
			var command=2;
			var onestep=2;
			logger('INFO',{nom:selfcam.nom,id:selfcam.id,msg:"Ordre envoyé a la box ",lien:selfcam.ip+':81/decoder_control.cgi?command='+command+'&onestep='+onestep+''},'box_camera');
			global.req.comm.perso_get(selfcam.ip,'/decoder_control.cgi?command='+command+'&onestep='+onestep+'',81,function(err,httpResponse,body){
				callbackfunc();
			},selfcam.user_auth,selfcam.password_auth);break;
		default:
			callbackfunc();
			break;
		}

		
		
	}

	this.get_etatbox=function(callbackfunc){
		var repcamera={};
		var selfcam=this;
		global.req.async.series([
    		   /*chargement des data*/
     		  function(callbackt){ 
     			  	 logger('INFO',{nom:selfcam.nom,id:selfcam.id,msg:"Ordre envoyé a la box ",lien:selfcam.ip+':81/get_status.cgi'},'box_camera');
     			
	     			 global.req.comm.perso_get(selfcam.ip,'/get_status.cgi',81,function(err,httpResponse,body){
	     				if (body) {
	     					repcamera.get_status=body.replace(/var /g,"").replace(/\\/g,"").split('\r\n');	
	     				}
	     				
	     				//console.log(body);
	     				callbackt();
	     			},selfcam.user_auth,selfcam.password_auth);
				},
			  function(callbackco){    
    			  	 logger('INFO',{nom:selfcam.nom,id:selfcam.id,msg:"Ordre envoyé a la box ",lien:selfcam.ip+':81//get_params.cgi'},'box_camera');
	     			 global.req.comm.perso_get(selfcam.ip,'/get_params.cgi',81,function(err,httpResponse,body){
	     				if (err) {
	    					logger('ERROR',{nom:selfcam.nom,id:selfcam.id,msg:err},'box_camera');
	    				}
	    				if (!body){
	    					logger('ERROR',{nom:selfcam.nom,id:selfcam.id,msg:'reponse vide'},'box_camera');
	    				} else {
	    					repcamera.get_params=body.replace(/var /g,"").replace(/\\/g,"").split('\r\n');
	    				}
		     				
		     				//console.log(body);
		     				callbackco();
		     			},selfcam.user_auth,selfcam.password_auth);
			    },
			  function(callbackco){    
    			 logger('INFO',{nom:selfcam.nom,id:selfcam.id,msg:"Ordre envoyé a la box ",lien:selfcam.ip+':81/get_camera_params.cgi'},'box_camera');
     			 global.req.comm.perso_get(selfcam.ip,'/get_camera_params.cgi',81,function(err,httpResponse,body){
	     				if (err) {
	    					logger('ERROR',{nom:selfcam.nom,id:selfcam.id,msg:err},'box_camera');
	    				}
	    				if (!body){
	    					logger('ERROR',{nom:selfcam.nom,id:selfcam.id,msg:'reponse vide'},'box_camera');
	    				} else {
	    					repcamera.get_camera_params=body.replace(/var /g,"").replace(/\\/g,"").split('\r\n');
	    				}
	     				
	     				//console.log(body);
	     				callbackco();
	     			},selfcam.user_auth,selfcam.password_auth);
			    }/*,
			  function(callbackco){    
    			 logger('INFO',{nom:selfcam.nom,id:selfcam.id,msg:"Ordre envoyé a la box ",lien:selfcam.ip+':81/check_user.cgi'},'box_camera');
     			 global.req.comm.perso_get(selfcam.ip,'/check_user.cgi',81,function(err,httpResponse,body){
	     				if (err) {
	    					logger('ERROR',{nom:selfcam.nom,id:selfcam.id,msg:err},'box_camera');
	    				}
	    				if (!body){
	    					logger('ERROR',{nom:selfcam.nom,id:selfcam.id,msg:'reponse vide'},'box_camera');
	    				} else {
	    					repcamera.check_user=body.replace(/var /g,"").replace(/\\/g,"").split('\r\n');
	    				}
	     				
	     				//console.log(body);
	     				callbackco();
	     			},selfcam.user_auth,selfcam.password_auth);
			    }*/]

  		, function(err) { //This is the final callback
			//console.log('fin get camera');
			callbackfunc(repcamera);
          });
		
		/*	$url ="http://".$ip.":81/livestream.cgi?streamid=10&loginuse=admin&loginpas=0000&user=admin&pwd=0000&";
			$array[4] = get_Url_result($header, $url);
						
			$url ="http://".$ip.":81/videostream.cgi?loginuse=admin&loginpas=0000&user=admin&pwd=0000";
			$array[5] = get_Url_result($header, $url);
			
			$url ="http://".$ip.":81/snapshot.cgi?loginuse=".constantes::$camiplogin."&loginpas=".constantes::$camippwd."&user=".constantes::$camiplogin."&pwd==".constantes::$camippwd.""; //&next_url=testsnap.jpg
			$array[6] = get_Url_result($header, $url);*/
		
		
	}
	
	this.get_etat=function(callbackfunc,picture_video,etatbox){
		var path='';
		var selfcam=this;
		if (picture_video=='picture') {
			path='/snapshot.cgi?loginuse='+this.user_auth+'&loginpas='+this.password_auth+'&user='+this.user_auth+'&pwd='+this.password_auth;
		} else if (picture_video=='video'){
			path='/videostream.cgi?loginuse='+this.user_auth+'&loginpas='+this.password_auth+'&user='+this.user_auth+'&pwd='+this.password_auth;
		}
		var options={
				'uuidcam':selfcam.uuid,
			    'host': selfcam.ip,
			    'port': 81,
			    'method': 'GET',
			    'path': path,
			    'agent': 'appli'//,
			    //'auth': userRequest.auth,
			    //'headers': userRequest.headers
			  };
		callbackfunc(null,options);
	}
	
	this.filtre_etat=function(callbackfunc,periph,etatbox){
		callbackfunc(etatbox);
	}
}

module.exports = camera;