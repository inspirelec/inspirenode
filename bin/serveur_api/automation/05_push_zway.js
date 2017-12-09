/**
 * New node file
 */
var push_zway={id:5,nom:"push_zway",etat:"OFF",lastrun:null};
var timer=null;
var timerWakeup=null;
var config=null;
var lastupdatetime={};

push_zway.start=function(){
	if (push_zway.etat=='OFF') {
		push_zway.etat='ON';
		logger('INFO',{msg:'demarrage automation',nom:this.nom},'startstop');
		timer=setInterval(function(){
			//console.log(data);
			boucle_push();
		},2000);
		timerWakeup=setInterval(function(){
			//console.log(data);
			controleWakeUp();
		},60000);
		config=null;
	}
}

push_zway.stop=function(){
	if (push_zway.etat=='ON') {
		push_zway.etat='OFF';
		logger('INFO',{msg:'extinction automation',nom:this.nom},'startstop');
		clearInterval(timer);
		clearInterval(timerWakeup);
	}
}



function boucle_push(){
	for (var b in obj.boxs) {
		if (obj.boxs[b].model=='zwayme'){
			if (!lastupdatetime['box_'+obj.boxs[b].id]) lastupdatetime['box_'+obj.boxs[b].id]=0;
			var url =obj.boxs[b].ip +':8083/ZWaveAPI/Data/'+lastupdatetime['box_'+obj.boxs[b].id];
			//console.log(url);
			var id_time='box_'+obj.boxs[b].id;
			var ip=obj.boxs[b].ip;	
			var boxb=obj.boxs[b];
			var f=function (box) {
				req.comm.perso_get(ip,'/ZWaveAPI/Data/'+lastupdatetime[id_time],'8083',function(err,httprep,body) {
					//console.log(body);
					
					if (body) {
						var rep=JSON.parse(body);
						
						if (rep.updateTime) {
							lastupdatetime[id_time]=rep.updateTime;
						}
						//console.log(body);
						rep=get_json_hierarchie(JSON.parse(body));
						//console.log(JSON.stringify(rep));
						var array_periph_id={};
						var nb_periph=0;
						if (rep.devices) {
							for (var d in rep.devices){
								//console.log('      device '+d)
								var send_get=false;
								//if (rep.devices[d].instances && rep.devices[d].instances[0])
								send_get=true;
								
								for (var p_id in global.obj.peripheriques){
									if (global.obj.peripheriques[p_id].box_id==box.id && global.obj.peripheriques[p_id].box_identifiant==d ){
										/*device correspond a un periph*/
										var box_idinstcde={device:global.obj.peripheriques[p_id].box_identifiant
															,instance:global.obj.peripheriques[p_id].box_type
															,commandClasse:global.obj.peripheriques[p_id].box_protocole
															,send_get:send_get};
										
										var key_array="device"+box_idinstcde.device+"_"+
						                				"instance"+box_idinstcde.instance+"_"+
						                				"commandClasse"+box_idinstcde.commandClasse;
										if (!array_periph_id[key_array]){
											nb_periph++;
											//console.log(box_idinstcde);
											if (!box_idinstcde.peripheriques) box_idinstcde.peripheriques=[];
											if ((!global.obj.peripheriques[p_id].box_type || (rep.devices[d].instances &&  rep.devices[d].instances[global.obj.peripheriques[p_id].box_type])) &&
													(!global.obj.peripheriques[p_id].box_protocole || (rep.devices[d].instances && rep.devices[d].instances[global.obj.peripheriques[p_id].box_type] && rep.devices[d].instances[global.obj.peripheriques[p_id].box_type].commandClasses && rep.devices[d].instances[global.obj.peripheriques[p_id].box_type].commandClasses[global.obj.peripheriques[p_id].box_protocole]))){
												/*device, instance, commandeclasse correpons*/
												box_idinstcde.send_get=false;
												box_idinstcde.peripheriques.push(global.obj.peripheriques[p_id]);
											}
											array_periph_id[key_array]=box_idinstcde;
										}
										//global.req.peripherique.update_etat_periph(global.obj.peripheriques[p_id]);
									}
								}	
								
							}
							
							if (nb_periph>0) {
								if (box.arrangereponsebox) rep=box.arrangereponsebox(rep);
								//console.log(box.last_etat.device16.instance1.commandClasse37.data.level.value);
								var r=JSONfusion(box.last_etat,rep);
								
								box.last_etat=r;
								for (var dicp_id in array_periph_id){
									/*send get a la box*/
									if (array_periph_id[dicp_id].send_get==true && array_periph_id[dicp_id].peripheriques.length<=0){
											box.forceUpdateBox(array_periph_id[dicp_id].device,array_periph_id[dicp_id].instance,array_periph_id[dicp_id].commandClasse);
											logger('INFO',{msg:'Push recu sur instance/commandclasse non utilisée, envoi Get()',device:array_periph_id[dicp_id].device,instance:array_periph_id[dicp_id].instance,commandclasse:array_periph_id[dicp_id].commandClasse},'automation_push_zway');
									}
									/*/ZWave.zway/Run/devices[16].instances[0].commandClasses[37].Get()*/
									for(var p in array_periph_id[dicp_id].peripheriques){
										/*mise a jour d'état periph*/
										logger('INFO',{msg:'Push etat recu',periph_nom:array_periph_id[dicp_id].peripheriques[p].nom,periph_id:array_periph_id[dicp_id].peripheriques[p].id},'automation_push_zway');
										
										global.req.peripherique.update_etat_periph(array_periph_id[dicp_id].peripheriques[p],function(data){
											//console.log(JSON.stringify(data));
										});										
									}
								}
								//console.log(box.last_etat.device16.instance1.commandClasse37.data.level.value);
							}		
						}
					}
				},obj.boxs[b].user_auth,obj.boxs[b].password_auth);
			}(boxb);
		}
	}
}

function controleWakeUp(){
	var heure=parseInt(req.moment().format('HH'));
	var minutes=parseInt(req.moment().format('mm'));
	
	if (heure<=0 && minutes<=1){
		for (var b in obj.boxs) {
			if (obj.boxs[b].model=='zwayme'){
				var ip=obj.boxs[b].ip;	
				var boxb=obj.boxs[b];
				var id_time='box_'+obj.boxs[b].id;
				var array_periph_id={};
				var nbperiphusethis=0;
				for (var p_id in global.obj.peripheriques){
					if (global.obj.peripheriques[p_id].box_id==boxb.id ){
						/*device correspond a un periph*/
						var inf ={device:global.obj.peripheriques[p_id].box_identifiant
											,instance:global.obj.peripheriques[p_id].box_type
											,commandClasse:global.obj.peripheriques[p_id].box_protocole};
						var key_array="device"+inf.device+"_"+
						"instance"+inf.instance+"_"+
						"commandClasse"+inf.commandClasse;
						if (!array_periph_id[key_array]){
							nbperiphusethis++;
							array_periph_id[key_array]=inf;
						}
					}
				}		

				for (var g in array_periph_id){
					logger('INFO',{msg:'  envoi get journalier !! ',inf:array_periph_id[g] },'automation_push_zway_controle_wakeup');
		
					//console.error('envoi get',array_periph_id[g]);
					boxb.forceUpdateBox(array_periph_id[g].device,array_periph_id[g].instance,array_periph_id[g].commandClasse);
				}
			}
		}
		return true;
	}
	
	for (var b in obj.boxs) {
		if (obj.boxs[b].model=='zwayme'){
			var ip=obj.boxs[b].ip;	
			var boxb=obj.boxs[b];
			var id_time='box_'+obj.boxs[b].id;
			if (boxb.last_etat ){
				//console.error('controle periph wakeup');
				for (var d in boxb.last_etat){
					for (var i in boxb.last_etat[d]){
						if (boxb.last_etat[d][i].commandClasse132){
							//console.error('wakeup commandclasse132 trouvée ' +d+' ' +i);
							var intervale=boxb.last_etat[d][i].commandClasse132.data.interval.value;
							var lastwakeup=boxb.last_etat[d][i].commandClasse132.data.lastWakeup.value;
							logger('INFO',{msg:' controle last wakeup ' +d+' ' +i + '  '+lastwakeup+ ' + ' +intervale + ' == '+(lastwakeup+intervale) + ' < ou > ' + lastupdatetime[id_time]},'automation_push_zway_controle_wakeup');
							
							//console.error(' controle last wakeup ' +d+' ' +i + '  '+lastwakeup+ ' + ' +intervale + ' == '+(lastwakeup+intervale) + ' < ou > ' + lastupdatetime[id_time]);
							if ((lastwakeup+intervale)<(lastupdatetime[id_time])) {
								//console.error('  Il faut se reveiller !! ' +d+' ' +i + '  '+lastwakeup+ ' + ' +intervale + ' == '+(lastwakeup+intervale) + ' < ou > ' + lastupdatetime[id_time]);
//								logger('WARNING',{msg:'  Il faut se reveiller !! ' +d+' ' +i + '  '+lastwakeup+ ' + ' +intervale + ' == '+(lastwakeup+intervale) + ' < ou > ' + lastupdatetime[id_time]},'automation_push_zway_controle_wakeup');
								if ((lastwakeup+(intervale*3))<(lastupdatetime[id_time])) {
									logger('WARNING',{msg:'  Il aurait du se reveiller depuis longtemps!! ' +d+' ' +i + '  '+lastwakeup+ ' + ' +intervale + ' == '+(lastwakeup+intervale) + ' < ou > ' + lastupdatetime[id_time]},'automation_push_zway_controle_wakeup');
								} else {
									logger('WARNING',{msg:'  Il faut se reveiller !! ' +d+' ' +i + '  '+lastwakeup+ ' + ' +intervale + ' == '+(lastwakeup+intervale) + ' < ou > ' + lastupdatetime[id_time]},'automation_push_zway_controle_wakeup');
								}
								var array_periph_id={};
								var nbperiphusethis=0;
								for (var p_id in global.obj.peripheriques){
									if (global.obj.peripheriques[p_id].box_id==boxb.id && ('device'+global.obj.peripheriques[p_id].box_identifiant)==d ){
										/*device correspond a un periph*/
										var inf ={device:global.obj.peripheriques[p_id].box_identifiant
															,instance:global.obj.peripheriques[p_id].box_type
															,commandClasse:global.obj.peripheriques[p_id].box_protocole};
										var key_array="device"+inf.device+"_"+
		                				"instance"+inf.instance+"_"+
		                				"commandClasse"+inf.commandClasse;
										if (!array_periph_id[key_array]){
											nbperiphusethis++;
											array_periph_id[key_array]=inf;
										}
									}
								}		
								if (nbperiphusethis==0) {
									boxb.forceUpdateBox(d.split('device')[1],d.split('instance')[1],132);
									
									logger('INFO',{msg:'  pas utilisé mais envoi get !! ',inf:{d:d,i:i,c:132} },'automation_push_zway_controle_wakeup');

								}
								for (var g in array_periph_id){
									logger('INFO',{msg:'  envoi get !! ',inf:array_periph_id[g] },'automation_push_zway_controle_wakeup');

									//console.error('envoi get',array_periph_id[g]);
									boxb.forceUpdateBox(array_periph_id[g].device,array_periph_id[g].instance,array_periph_id[g].commandClasse);
								}
							}
						}
					}
				}
			}
		}
	}
}

function get_json_hierarchie(arrayObj,objet){
	
	var obj=objet;
	if (!obj) obj={};
	for (var l in arrayObj){
		if (l!="updateTime") {
			var eclatinfo=l.split(".");
			var noeudcourant=obj;
			for (var i in eclatinfo){
				if (!noeudcourant[eclatinfo[i]]) noeudcourant[eclatinfo[i]]={};
				noeudcourant=noeudcourant[eclatinfo[i]];
			}
			for (var d in arrayObj[l]) {
				noeudcourant[d]=arrayObj[l][d];		
			}
			
		} else {
			obj[l]=arrayObj[l];
		}
	}
	return obj
}


module.exports = push_zway;



//






/*refresh config all 5 minutes*/
/*
function get_config(){
	req.comm.perso_get('192.168.1.41','/inspireathome/command_externe/push.php?action=getconfigzwayme','80',
			function(err,httprep,body) {
				//console.log(body);
				if (body) {
					config=JSON.parse(body);
					bouclepush(config);
				}
			});
}


function bouclepush(config){
	if (config) {
		LastUpdateTime=new Date().getTime()/1000|0;
		busy=false;
		var etatupdatetime=[];
		setInterval(function() {
			//console.log(LastUpdateTime);
			if (busy==false){
				busy=true;
				req.comm.perso_get('localhost','/ZWaveAPI/Data/'+LastUpdateTime,'8083',function(err,httprep,body) {
					//console.log(body);
					if (body) {
						rep=JSON.parse(body);
						
						if (rep.updateTime) {
							LastUpdateTime=rep.updateTime;
						}
						
						var GETdmande=[];
						var PUSHdmande=[];
						for (iddev in rep) {
							if (iddev!="updateTime") {
								//console.log(iddev+"--"+rep[iddev]['updateTime']);
								tid=iddev.split(".");
								if (tid.length>=6) {
									d=tid[1];
									i=tid[3];
									c=tid[5];
									
									if (etatupdatetime[iddev] && etatupdatetime[iddev]==rep[iddev]['updateTime']){
										//etat dÃ©ja connu
										
									} else {
										//controle si besoind'un get
										if (i=="0") {
											for (iduuid in config){
												uuid=config[iduuid];
												if (uuid.batterie==0 && uuid.d+''==d+'' && (uuid.i+''!=i+'' || uuid.c+''!=c+'')) {
													GETdmande.push(uuid);
													
												}
											}
										}
										//push vers inspireathome
										for (iduuid in config){
											uuid=config[iduuid];
											if (uuid.d+''==d+'' && uuid.i+''==i+'' && uuid.c+''==c+'') {
												
												obj={};
												obj[iddev]=rep[iddev];
												//obj[iddev]['uuid']=iduuid;
												//obj[iddev]['dic']=uuid;
												
												
												index = GETdmande.indexOf(uuid);
												if (index > -1) {
													GETdmande.splice(index, 1);
												}
												
												sendpushinfo(obj,iduuid);
											}
										}										
									}

									if (rep[iddev]['updateTime']){
										etatupdatetime[iddev]=rep[iddev]['updateTime'];
									}
								}
															
							}

						}
						
						for (iduuid in GETdmande){
							uuid=GETdmande[iduuid];
							sendGetcde(uuid.d,uuid.i,uuid.c);
						}
						
									
					}
					busy=false;
				})
				
				
				
			} 
		
		},2000);
	}
}

function sendGetcde(device,instance,cdeclass){
	//console.log(">>>> GET "+device+"-"+instance+"-"+cdeclass);
	req.comm.perso_post(null,'localhost','/ZWaveAPI/Run/devices['+device+'].instances['+instance+'].commandClasses['+cdeclass+'].Get()','8083');
	
}

var pushobj={};
var resetpushobj=true;

function sendpushinfo(obj,iduuid){
	
	//console.log(">>>> PUSH "+obj.dic.d+"-"+obj.dic.i+"-"+obj.dic.c);
	data=(transforminfo(obj));
	if (resetpushobj) {
		resetpushobj=false;
		pushobj={};
		pushobj.uuids=[];
	}
	pushobj=MergeRecursive(pushobj,data);
	pushobj.uuids.push(iduuid);


}
var busypush=false;
setInterval(
	function(){
		nbs=Object.keys(pushobj).length;
		if (busypush==false && nbs>0){
			busypush=true;
			data=JSON.stringify(pushobj);
			pushobj={};
			resetpushobj=true;
			//console.log('-----------------------'+nbs);
			//console.log(data);
			//console.log("-----");
			if(data) {
				req.comm.perso_get('192.168.1.41','/inspireathome/command_externe/push.php?data='+data,'80',
						function(err,httprep,body) {
							//console.log(body);
						})			
			}
		}
		busypush=false;
	},1000);


function MergeRecursive(obj1, obj2) {

	  for (var p in obj2) {
	    try {
	      // Property in destination object set; update its value.
	      if ( obj2[p].constructor==Object ) {
	        obj1[p] = MergeRecursive(obj1[p], obj2[p]);

	      } else {
	        obj1[p] = obj2[p];

	      }

	    } catch(e) {
	      // Property in destination object not set; create it and set its value.
	      obj1[p] = obj2[p];

	    }
	  }

	  return obj1;
}
function transforminfo(obj){
	
	for (id in obj) {
		o=obj[id];
		decoup=id.split(".");
		for (i = decoup.length-1; i >=0 ; i--) { 
		    text = decoup[i];
		    oo={};
		    oo[text]=o;
		    o=oo;
		}
	}
	return o; 
}

*/