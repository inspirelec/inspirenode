
var camera = function(adresseip) {
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

		
		
	}

	this.get_etatbox=function(callbackfunc){
		var repcamera={};
		var selfcam=this;
		callbackfunc(repcamera);
		/*global.req.async.series([
    		   
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
			    },
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
			    }]

  		, function(err) { //This is the final callback
			//console.log('fin get camera');
			callbackfunc(repcamera);
          });*/
		
		/*	$url ="http://".$ip.":81/livestream.cgi?streamid=10&loginuse=admin&loginpas=0000&user=admin&pwd=0000&";
			$array[4] = get_Url_result($header, $url);
						
			$url ="http://".$ip.":81/videostream.cgi?loginuse=admin&loginpas=0000&user=admin&pwd=0000";
			$array[5] = get_Url_result($header, $url);
			
			$url ="http://".$ip.":81/snapshot.cgi?loginuse=".constantes::$camiplogin."&loginpas=".constantes::$camippwd."&user=".constantes::$camiplogin."&pwd==".constantes::$camippwd.""; //&next_url=testsnap.jpg
			$array[6] = get_Url_result($header, $url);*/
		
		
	}
	
	this.get_etat=function(callbackfunc,picture_video,boxidentifiant){
		var path='';
		var selfcam=this;
		var port=80;
		if (picture_video=='video') {
			path='/image'+boxidentifiant;
		} else if (picture_video=='picture'){
			path='/oneshotimage'+boxidentifiant;
		} else if (picture_video=='videotest'){
			path='/index.php?type=piping&action=video&uuid=86dc64feca36749d9a5176798f3f0c94';
			port=1338;
		} else if (picture_video=='videotest2'){
			path='/index.php?type=piping&action=video&uuid=bbca22acbd4b03d4d02a03660d8716fd';
			port=1338;
		} else if (picture_video=='videotest3'){
			path='/index.php?type=piping&action=video&uuid=868407229ec6990eaabe29c5048f4dde';
			port=1338;
		}
		http://109.211.58.132:1338/index.php?type=piping&action=video&uuid=bbca22acbd4b03d4d02a03660d8716fd
		var options={
			    'host': selfcam.ip,
			    'port': port,
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