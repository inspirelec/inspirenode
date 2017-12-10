/**
 * New node file
 */
var debugging = 0;
 

module.exports =function(variables,userResponse,user,userRequest){
	logger('DEBUG',{variables:variables,userResponse:userResponse,user:user,userRequest:userRequest},'request_action_piping');

	var options={};
	for (var p_id in global.obj.peripheriques) {
		//if (global.obj.peripheriques[cam_id].categorie && global.obj.peripheriques[cam_id].categorie.type=='camera'){
			
			if (global.obj.peripheriques[p_id].uuid==variables.uuid){
				switch (global.obj.peripheriques[p_id].ecriture_type) {
				case 'PLAYER':
					
					global.obj.peripheriques[p_id].get_etat(function(vide,data){
						var opt={
							    'host': data.ip,
							    'port': data.port,
							    'method': 'GET',
							    'path': data.track.albumArtURL,
							    'agent': 'appli'//,
							    //'auth': userRequest.auth,
							    //'headers': userRequest.headers
							  };
						
						opt.agent=userRequest.agent;
						piping(userResponse,userRequest,opt);
					});
					break;

				default:
					global.obj.peripheriques[p_id].box.get_etat(function(vide,options){
						var opt=options;
						opt.agent=userRequest.agent;
						opt.keep=variables.keep;
						//piping(userResponse,userRequest,opt);
						clientpiping(userResponse,userRequest,opt);
					},variables.action,global.obj.peripheriques[p_id].box_identifiant);
					break;
				}
				
			}
			
		//}
	}
	
	
	  
	 


	 
	 

};
var proxyrequest={};
var clients={};

function clientpiping(userResp,userReq,optio){
	var remoteip=userReq.connection.remoteAddress;
	var client={
			userResponse:userResp,
			userRequest:userReq,
			opt:optio,
			sendpacket:false,
			uuidclient:remoteip+'keep'+optio.keep
			};
	client.listenerror=function(error){
		client.userResponse.writeHead( 500 );
		client.userResponse.write(
	        "<h1>500 Error</h1>\r\n" +
	        "<p>Error was <pre>" + error + "</pre></p>\r\n" +
	        "</body></html>\r\n"
	      );
		client.userResponse.end();
		if (clients['uuid_'+client.uuidclient]){
			clients['uuid_'+client.uuidclient].userResponse.end();
			//console.log('end piping for other','uuid_'+client.uuidclient,optio.uuidcam);
		}
	}
	client.listenresponse=function(proxyresp){
		//console.log('event response',proxyresp.statusCode,proxyresp.headers);
		if (proxyresp.statusCode) {
			client.userResponse.writeHead(
				  proxyresp.statusCode,
				  proxyresp.headers
			  );			
		}
		
	}
	client.listenend=function(){
		client.userResponse.end();
	}
	client.listendata=function(datacam,chunk){
		//console.log('Clients',client.uuidclient,Object.keys(clients).length);
		//console.log('event data',chunk.length);
        if (client.userRequest.socket.writable) {
      	var buf3=0;
      	var bufeval=false;
      	try {
      		buf3=client.userResponse.socket._writableState.getBuffer().length;
      		//console.log('_writableState.getBuffer().length',client.userResponse.socket._writableState.getBuffer().length);
      		bufeval=true;
		} catch (e) {
		}
      	if (!bufeval){
          	try {
          		buf3=client.userResponse.socket._writableState.length;
          		//console.log('_writableState.length',client.userResponse.socket._writableState.length);
          		bufeval=true;
          	} catch (e) {
    		}
      	}

      	//console.log('_writableState.needDrain',client.userResponse.socket._writableState.needDrain);
      	  //console.log('--');
      	  if (chunk[0]==13 && chunk[1]==10) {
      		  if (buf3<24 /*&& compteur<1*/) {
      			client.sendpacket=true;
	          } else {
	        	  client.sendpacket=false;
	          }
      	  }
      	  if (client.sendpacket) {
      		client.userResponse.write( chunk );
      	  } 
        } 
	};
	obj.app.serveur.on('response_'+optio.uuidcam,client.listenresponse);
	obj.app.serveur.on('error_'+optio.uuidcam,client.listenerror);
	obj.app.serveur.on('data_'+optio.uuidcam,client.listendata);
	obj.app.serveur.on('end_'+optio.uuidcam,client.listenend);

	client.userRequest.socket.on('close',
	 	    function(){
				obj.app.serveur.removeListener('end_'+optio.uuidcam,client.listenend);
				obj.app.serveur.removeListener('data_'+optio.uuidcam,client.listendata);
				obj.app.serveur.removeListener('error_'+optio.uuidcam,client.listenerror);
				obj.app.serveur.removeListener('response_'+optio.uuidcam,client.listenresponse);
				delete clients['uuid_'+client.uuidclient];
				if (Object.keys(clients).length<=0){
					//proxyResponse.emit('end');
					if (proxyrequest['piping_'+client.opt.uuidcam] ) {
						console.log('Fermeture connex cam',client.opt.uuidcam);
						proxyrequest['piping_'+client.opt.uuidcam].emit('end');
						delete proxyrequest['piping_'+client.opt.uuidcam];						
					}

				}
	 	    });
	
	if (clients['uuid_'+client.uuidclient]){
		clients['uuid_'+client.uuidclient].userResponse.end();
		console.log('end piping for other','uuid_'+client.uuidclient,optio.uuidcam);
	}	
	console.log('New client',optio.uuidcam);
	if (!proxyrequest['piping_'+optio.uuidcam]){
		proxyrequest['piping_'+optio.uuidcam]=true;
		console.log('start piping',optio.uuidcam);
		startpiping(optio,optio.uuidcam);
	} else {
		client.listenresponse(proxyrequest['piping_'+optio.uuidcam]);
	}

	clients['uuid_'+client.uuidclient]=client;
	//console.log('Clients',Object.keys(clients).length);
}
//global.obj.app.serveur.emit('peripherique.update_etat_periph_of_box',box);

function startpiping(opt,uuidpiping){
	var proxyRequest = global.req.http.request(  opt,function ( proxyResp ) {
		var proxyResponse=proxyResp;
		//console.log('receive response',uuidpiping);
		global.obj.app.serveur.emit('response_'+uuidpiping,proxyResponse);
		proxyrequest['piping_'+uuidpiping]=proxyResponse;
		proxyResponse.on('data',
	        function (chunk) {
				//console.log('receive data',uuidpiping);
				global.obj.app.serveur.emit('data_'+uuidpiping,'datacam',chunk);
	        }
	      );
	 
		proxyResponse.on('end',
	        function () {
				//console.log('receive end',uuidpiping);
				global.obj.app.serveur.emit('end_'+uuidpiping);
	        }
	    );
    }
  );

  proxyRequest.on(
    'error',
    function ( error ) {
    	//console.log('receive error',uuidpiping,error);
    	global.obj.app.serveur.emit('error_'+uuidpiping,error);
    }
  );
  
  proxyRequest.end();
}

