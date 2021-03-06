/**
 * New node file
 */


var parserxml2json = new global.req.xml2js.Parser();

module.exports =function(variables,res,user,req){
    	
	    

		logger('DEBUG',{variables:variables,res:res,user:user,req:req},'request_action_appli');

		switch (variables.action) {
		
		case 'configappli':


			var d =global.obj.app.config.menus_appli;
			
			var rep = JSON.stringify(d);
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
			break;
		case 'allconfiglite' :
			/*{"action":"allconfiglite","tagname":"Acceuil","v":"1.1.1"}*/
			var sql="Select a.id_peripherique from peripherique_user_acceuil a, utilisateurs u where u.id='"+this.user.id+"' and u.id=a.id_utilisateurs;";
			global.obj.app.db.sqlorder(sql,
				function(rows){
					var result=[];
					
					for (p in global.obj.peripheriques){
						var periphatraiter=false;
						var acceuil_coche=false;
						if (variables.tagname=='Acceuil'){
							for (r in rows) {
								if (rows[r].id_peripherique==global.obj.peripheriques[p].id) {
									acceuil_coche=true;
									periphatraiter=true;
								}
							}			
							if (global.obj.peripheriques[p].ecriture_type=='ALARME') {
								acceuil_coche=true;
								periphatraiter=true;
							}
						}
						for (t in global.obj.peripheriques[p].tag) {
							if ((global.obj.peripheriques[p].tag[t]
							        && (global.obj.peripheriques[p].tag[t].nom==variables.tagname
							    		 || global.obj.peripheriques[p].tag[t].uuid==variables.taguuid
							    		 || global.obj.peripheriques[p].tag[t].id==variables.tagid
							    		 || acceuil_coche) 
								    && global.obj.peripheriques[p].visibilite=="visible")
								    	|| global.obj.peripheriques[p].visibleifmanuel=='O'){
								periphatraiter=true;
								
							}							
						}
						
						if (periphatraiter==true){
							var pe=JSON.parse(JSON.stringify(global.obj.peripheriques[p]));
							var pemin={};
							pemin.id=pe.id;
							pemin.uuid=pe.uuid;
							pemin.nom=pe.nom;
							pemin.box_type=pe.box_type;
							pemin.ecriture_type=pe.ecriture_type;
							pemin.ecriture_max_value=pe.ecriture_max_value;
							pemin.ecriture_min_value=pe.ecriture_min_value;
							pemin.lecture_etat_graph=pe.lecture_etat_graph;
							pemin.lecture_expr1_graph=pe.lecture_expr1_graph;
							pemin.lecture_expr2_graph=pe.lecture_expr2_graph;
							pemin.lecture_expr3_graph=pe.lecture_expr3_graph;
							pemin.lecture_expr4_graph=pe.lecture_expr4_graph;
							pemin.lecture_expr5_graph=pe.lecture_expr5_graph;
							pemin.lecture_expr6_graph=pe.lecture_expr6_graph;
							pemin.lecture_expr7_graph=pe.lecture_expr7_graph;
							pemin.categorie=pe.categorie;
							pemin.categorie_id=pe.categorie_id;
							if (pemin.categorie) {
								pemin.categorie.iconMin=pemin.categorie.iconmin;
								pemin.categorie.iconMax=pemin.categorie.iconmax;
								pemin.categorie.iconMidle=pemin.categorie.iconmidle;							
							}

							pemin.visibilite=pe.visibilite;
							if (pemin.visibilite=='visible') {
								pemin.visible=true;
							} else {
								pemin.visible=false;
							}
							pemin.box_ip=pe.box_ip;
							pemin.visibleifmanuel=pe.visibleifmanuel;
							pemin.tags=pe.tag;
							result.push(pemin);
						}


						
					}
					for (p in global.obj.peripheriques_chauffage){
						var periphatraiter=false;
						var acceuil_coche=false;
						if (variables.tagname=='Acceuil'){
							for (r in rows) {
								if (rows[r].id_peripherique==global.obj.peripheriques_chauffage[p].id) {
									acceuil_coche=true;
									periphatraiter=true;
								}
							}

						}
						for (t in global.obj.peripheriques_chauffage[p].tag) {
							if (global.obj.peripheriques_chauffage[p].tag[t] && (global.obj.peripheriques_chauffage[p].tag[t].nom==variables.tagname
									|| global.obj.peripheriques_chauffage[p].tag[t].uuid==variables.taguuid
									|| global.obj.peripheriques_chauffage[p].tag[t].id==variables.tagid
									|| acceuil_coche) && global.obj.peripheriques_chauffage[p].visibilite=="visible"){
								periphatraiter=true;						
							}
						}
						if (periphatraiter==true){
							var pe=JSON.parse(JSON.stringify(global.obj.peripheriques_chauffage[p]));
							var pemin={};
							pemin.id=pe.id;
							pemin.uuid=pe.uuid;
							pemin.nom=pe.nom;
							pemin.ecriture_type=pe.ecriture_type;
							pemin.ecriture_max_value=pe.ecriture_max_value;
							pemin.ecriture_min_value=pe.ecriture_min_value;
							pemin.lecture_etat_graph=pe.lecture_etat_graph;
							pemin.lecture_expr1_graph=pe.lecture_expr1_graph;
							pemin.lecture_expr2_graph=pe.lecture_expr2_graph;
							pemin.lecture_expr3_graph=pe.lecture_expr3_graph;
							pemin.lecture_expr4_graph=pe.lecture_expr4_graph;
							pemin.lecture_expr5_graph=pe.lecture_expr5_graph;
							pemin.lecture_expr6_graph=pe.lecture_expr6_graph;
							pemin.lecture_expr7_graph=pe.lecture_expr7_graph;
							for (c in global.obj.categories){
								if (global.obj.categories[c].type=='consigne_temperature'){
									var cat=global.obj.categories[c];
									pemin.categorie=cat;
								}
							}
							pemin.categorie_id=pe.categorie_id;
							if (pemin.categorie) {
								pemin.categorie.iconMin=pemin.categorie.iconmin;
								pemin.categorie.iconMax=pemin.categorie.iconmax;
								pemin.categorie.iconMidle=pemin.categorie.iconmidle;							
							}
							pemin.visibilite=pe.visibilite;
							if (pemin.visibilite=='visible') {
								pemin.visible=true;
							} else {
								pemin.visible=false;
							}
							pemin.box_ip=pe.box_ip;
							pemin.visibleifmanuel=pe.visibleifmanuel;
							pemin.tags=pe.tag;
							result.push(pemin);
						}


						
					}
					
					for (p in global.obj.peripheriques_batterie){
						var periphatraiter=false;
						var acceuil_coche=false;
						if (variables.tagname=='Acceuil'){
								acceuil_coche=true;
								periphatraiter=true;
						}
						for (t in global.obj.peripheriques_batterie[p].tag) {
							if (global.obj.peripheriques_batterie[p].tag[t] && (global.obj.peripheriques_batterie[p].tag[t].nom==variables.tagname
									|| global.obj.peripheriques_batterie[p].tag[t].uuid==variables.taguuid
									|| global.obj.peripheriques_batterie[p].tag[t].id==variables.tagid
									|| acceuil_coche) && global.obj.peripheriques_batterie[p].visibilite=="visible"){
								periphatraiter=true;
								
							}							
						}
						
						if (periphatraiter==true){
							var pe=JSON.parse(JSON.stringify(global.obj.peripheriques_batterie[p]));
							var pemin={};
							pemin.id=pe.id;
							pemin.uuid=pe.uuid;
							pemin.nom=pe.nom;
							pemin.ecriture_type=pe.ecriture_type;
							pemin.ecriture_max_value=pe.ecriture_max_value;
							pemin.ecriture_min_value=pe.ecriture_min_value;
							pemin.categorie=pe.categorie;
							pemin.categorie_id=pe.categorie_id;
							pemin.lecture_etat_graph=pe.lecture_etat_graph;
							pemin.lecture_expr1_graph=pe.lecture_expr1_graph;
							pemin.lecture_expr2_graph=pe.lecture_expr2_graph;
							pemin.lecture_expr3_graph=pe.lecture_expr3_graph;
							pemin.lecture_expr4_graph=pe.lecture_expr4_graph;
							pemin.lecture_expr5_graph=pe.lecture_expr5_graph;
							pemin.lecture_expr6_graph=pe.lecture_expr6_graph;
							pemin.lecture_expr7_graph=pe.lecture_expr7_graph;
							if (pemin.categorie) {
								pemin.categorie.iconMin=pemin.categorie.iconmin;
								pemin.categorie.iconMax=pemin.categorie.iconmax;
								pemin.categorie.iconMidle=pemin.categorie.iconmidle;							
							}

							pemin.visibilite=pe.visibilite;
							if (pemin.visibilite=='visible') {
								pemin.visible=true;
							} else {
								pemin.visible=false;
							}
							pemin.box_ip=pe.box_ip;
							pemin.visibleifmanuel=pe.visibleifmanuel;
							pemin.tags=pe.tag;
							result.push(pemin);
						}


						
					}
					for (p in global.obj.peripheriquesdeportes){
						var periphatraiter=false;
						var acceuil_coche=false;
						if (variables.tagname=='Acceuil'){
							for (r in rows) {
								if (rows[r].id_peripherique==global.obj.peripheriquesdeportes[p].id) {
									acceuil_coche=true;
									periphatraiter=true;
								}
							}			
							if (global.obj.peripheriques[p].ecriture_type=='ALARME') {
								acceuil_coche=true;
								periphatraiter=true;
							}
						}
						for (t in global.obj.peripheriquesdeportes[p].tag) {
							if ((global.obj.peripheriquesdeportes[p].tag[t]
							        && (global.obj.peripheriquesdeportes[p].tag[t].nom==variables.tagname
							    		 || global.obj.peripheriquesdeportes[p].tag[t].uuid==variables.taguuid
							    		 || global.obj.peripheriquesdeportes[p].tag[t].id==variables.tagid
							    		 || acceuil_coche) 
								    && global.obj.peripheriquesdeportes[p].visibilite=="visible")
								    	|| global.obj.peripheriquesdeportes[p].visibleifmanuel=='O'){
								periphatraiter=true;
								
							}							
						}
						
						if (periphatraiter==true){
							var pe=JSON.parse(JSON.stringify(global.obj.peripheriquesdeportes[p]));
							var pemin={};
							pemin.id=pe.id;
							pemin.uuid=pe.uuid;
							pemin.nom=pe.nom;
							pemin.ecriture_type=pe.ecriture_type;
							pemin.ecriture_max_value=pe.ecriture_max_value;
							pemin.ecriture_min_value=pe.ecriture_min_value;
							pemin.categorie=pe.categorie;
							pemin.categorie_id=pe.categorie_id;
							pemin.lecture_etat_graph=pe.lecture_etat_graph;
							pemin.lecture_expr1_graph=pe.lecture_expr1_graph;
							pemin.lecture_expr2_graph=pe.lecture_expr2_graph;
							pemin.lecture_expr3_graph=pe.lecture_expr3_graph;
							pemin.lecture_expr4_graph=pe.lecture_expr4_graph;
							pemin.lecture_expr5_graph=pe.lecture_expr5_graph;
							pemin.lecture_expr6_graph=pe.lecture_expr6_graph;
							pemin.lecture_expr7_graph=pe.lecture_expr7_graph;
							if (pemin.categorie) {
								pemin.categorie.iconMin=pemin.categorie.iconmin;
								pemin.categorie.iconMax=pemin.categorie.iconmax;
								pemin.categorie.iconMidle=pemin.categorie.iconmidle;							
							}

							pemin.visibilite=pe.visibilite;
							if (pemin.visibilite=='visible') {
								pemin.visible=true;
							} else {
								pemin.visible=false;
							}
							pemin.box_ip=pe.box_ip;
							pemin.visibleifmanuel=pe.visibleifmanuel;
							pemin.tags=pe.tag;
							result.push(pemin);
						}


						
					}
					result.tags=[];
					var rep = JSON.stringify(result);
					res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
			});

		
			break;
		case 'allmodes' :
			/*{"action":"allmodes","v":"1.1.1"}*/
			
			var result={};
			result.modes={};
			for (p in global.obj.modes){
				var pe=JSON.parse(JSON.stringify(global.obj.modes[p]));
				var pemin={};
				pemin.id=pe.uuid;
				pemin.nom=pe.nom;
				pemin.icon=pe.icon;
				result.modes[pe.uuid]=pemin;
			}
			var sql='Select * from modeactivationdiff;';
			
			global.obj.app.db.sqlorder(sql,
				function(rows){
					if (rows && rows[0]) {
						result.diff={id:rows[0].mode,heure:rows[0].heure,	date:rows[0].date};
						var modeatt=global.obj.app.core.findobj(rows[0].mode,'modes');
						result.diff.id=modeatt.uuid;
					}
										
					var rep = JSON.stringify(result);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			//result.diff
			/*if (data.diff!=null && data.diff.id==index){
				$('#mode_'+index).find("#etat").html('Activation différée à '+data.diff.heure+' le '+data.diff.date);	
			}*/	
			
			var rep = JSON.stringify(result);
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
		
			break;
		case 'getcategories' :
			/*{"action":"allmodes","v":"1.1.1"}*/
			
			var result={};

			for (p in global.obj.categories){
				var pe=JSON.parse(JSON.stringify(global.obj.categories[p]));
				/*if (pe.type=='sonde_de_temperature'
					|| pe.type=='alarme') {
					result[pe.type]=pe;
				}*/
				if (pe.programmable=='O') {
					result[pe.id]=pe;
				}
			}
			var rep = JSON.stringify(result);
			res.writeHead(200,
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
		
			break;
		case 'getallcategories' :
                /*{"action":"allmodes","v":"1.1.1"}*/

                var result={};

                for (p in global.obj.peripheriques){
                    var per=global.obj.peripheriques[p];
                    if (per.visibilite =='visible'){
                        result[per.categorie.id]=per.categorie;
					}
                }
				for (p in global.obj.peripheriques_chauffage){
					var per=global.obj.peripheriques_chauffage[p];
					if (per.visibilite =='visible'){
						result[per.categorie.id]=per.categorie;
					}
				}
                var rep = JSON.stringify(result);
                res.writeHead(200,
                    {'Content-Type': 'text/plain',
                        'Access-Control-Allow-Origin': '*'});
                res.end(rep);

                break;
		case 'alltagplan' :
			/*{"action":"alltag","v":"1.1.1"}*/
			var result={};
			result.tags=[];

            var sql="Select 'plan_peripherique' type,pp.* from plan_peripherique pp where plan='"+variables.idplan+"'; ";
            //var dataarray=[variables.idplan,variables.idplan];
            global.obj.app.db.sqlorder(sql,
                function(rows){
                    if(rows && rows[0]){
                    	for (var t in rows){
							if(rows[t].type=='plan_peripherique'){
                                var pe=global.obj.app.core.findobj(rows[t].peripherique,'peripheriques');
                                if (!pe) {
                                	pe=global.obj.app.core.findobj(rows[t].peripherique,'peripheriques_chauffage');
								}
                                var pemin={};
                                pemin.id=rows[t].id;
                                pemin.table=rows[t].type;
                                pemin.nom=pe.nom;
                                pemin.periph_id=pe.id;
                                pemin.parent_tag=[];
                                pemin.categorie=pe.categorie;
                                pemin.uuid=pe.uuid;
                                pemin.action=rows[t].action;
                                pemin.ecriture_max_value=pe.ecriture_max_value;
                                pemin.ecriture_min_value=pe.ecriture_min_value;
                                pemin.ecriture_type=pe.ecriture_type;
                                pemin.tag_uuid=pe.tag[0].id;
                                pemin.visible=pe.visible;
                                pemin.position_x=rows[t].position_x;
                                pemin.position_y=rows[t].position_y;

                                result.tags.push(pemin);
							}
						}

                    }
                    var rep = JSON.stringify(result);
                    res.writeHead(200,
                        {'Content-Type': 'text/plain',
                            'Access-Control-Allow-Origin': '*'});
                    res.end(rep);
                }/*, dataarray*/);



		
			break;	
		case 'alltag' :
			/*{"action":"alltag","v":"1.1.1"}*/
			var result={};
			result.tags=[];
			for (p in global.obj.tags){
				var pe=JSON.parse(JSON.stringify(global.obj.tags[p]));
				var pemin={};
				pemin.id=pe.id;
				pemin.nom=pe.nom;
				pemin.parent_tag=[];
				pemin.icon=pe.icon;
				pemin.uuid=pe.uuid;
				pemin.visible=pe.visible;
				pemin.position_x=pe.position_x;
				pemin.position_y=pe.position_y;
				pemin.icon_plan=pe.icon_plan;
				pemin.type=pe.type;
				pemin.typeprog=pe.typeprog;
				if(pemin.visible=='O') {
					result.tags.push(pemin);	
				}
				
			}
			var rep = JSON.stringify(result);
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
		
			break;
        case 'alltagmode' :
        	var restrictecrituretype="TEMPERATURE";
            var restrictecrituretype2="SANS";
		case 'alltagperiphsel' :


			/*{"action":"alltagmode","v":"1.1.1"}*/
			var categorie_id=variables.categorie;
			
			var recursivegetenfant= function(periph_parent,categorie_id){
				var enfants=periph_parent.get_child();
				var res={};
				res.enfants=[];
				res.avecchauffe=false;
				for (e in enfants) {
					var enf=enfants[e];
					var avecchauffe=false;
					var tmin={};
					tmin.id=enf.id;
					tmin.nom=enf.nom;
					tmin.icon=enf.icon;
					tmin.uuid=enf.uuid;
					var findenfants=recursivegetenfant(enf,categorie_id);
					if (findenfants.avecchauffe==true) {
						tmin.enfants=findenfants.enfants;
						res.avecchauffe=true;
						tmin.ecriture_type=tmin.enfants[0].ecriture_type;
						avecchauffe=true;
					} else {
						tmin.enfants=[];
					}
					
					var periphschauffe=getifexistsconsigne(enf.id,categorie_id) 
					if (periphschauffe.length>0) {
						res.avecchauffe=true;
						tmin.ecriture_type=periphschauffe[0].ecriture_type;
						avecchauffe=true;
					}
					tmin.periphs=periphschauffe;
					
					if (avecchauffe) {
						res.enfants.push(tmin);	
					}
					
				}
				return res;
			
			} 
			
			var getifexistsconsigne =function (tag_id,categorie_id){
				var periphschauffe=[];
				
				
				for (var pc in global.obj.peripheriques_chauffage) {
					/*for (pct in global.obj.peripheriques_chauffage[pc].tag) {*/
						if (global.obj.peripheriques_chauffage[pc].tag && global.obj.peripheriques_chauffage[pc].tag[0]
							&& global.obj.peripheriques_chauffage[pc].tag[0].id==tag_id
							&& global.obj.peripheriques_chauffage[pc].ecriture_type	!=restrictecrituretype
							&& global.obj.peripheriques_chauffage[pc].categorie_id==categorie_id
								
						) {
							var pchauff={};
							

							pchauff.id=global.obj.peripheriques_chauffage[pc].id;
							pchauff.uuid=global.obj.peripheriques_chauffage[pc].uuid;
							pchauff.nom=global.obj.peripheriques_chauffage[pc].nom;
							pchauff.ecriture_type=global.obj.peripheriques_chauffage[pc].ecriture_type;
							periphschauffe.push(pchauff);
							
						}							
					/*}*/
				}
				for (var pc in global.obj.peripheriquesdeportes) {
					/*for (pct in global.obj.peripheriques_chauffage[pc].tag) {*/
						if (global.obj.peripheriquesdeportes[pc].tag && global.obj.peripheriquesdeportes[pc].tag[0]
							&& global.obj.peripheriquesdeportes[pc].tag[0].id==tag_id
							&& global.obj.peripheriquesdeportes[pc].ecriture_type !=restrictecrituretype
							&& global.obj.peripheriquesdeportes[pc].categorie_id==categorie_id
						) {
							var pchauff={};
							

							pchauff.id=global.obj.peripheriquesdeportes[pc].id;
							pchauff.uuid=global.obj.peripheriquesdeportes[pc].uuid;
							pchauff.nom=global.obj.peripheriquesdeportes[pc].nom;
							pchauff.ecriture_type=global.obj.peripheriquesdeportes[pc].ecriture_type;
							periphschauffe.push(pchauff);
							
						}							
					/*}*/
				}
				for (var pc in global.obj.peripheriques) {
					/*for (pct in global.obj.peripheriques_chauffage[pc].tag) {*/
						if (global.obj.peripheriques[pc].tag && global.obj.peripheriques[pc].tag[0]
							&& global.obj.peripheriques[pc].tag[0].id==tag_id
							&& global.obj.peripheriques[pc].ecriture_type !=restrictecrituretype2
							&& global.obj.peripheriques[pc].categorie_id==categorie_id
						) {
							var pchauff={};
							

							pchauff.id=global.obj.peripheriques[pc].id;
							pchauff.uuid=global.obj.peripheriques[pc].uuid;
							pchauff.nom=global.obj.peripheriques[pc].nom;
							pchauff.ecriture_type=global.obj.peripheriques[pc].ecriture_type;
							periphschauffe.push(pchauff);
							
						}							
					/*}*/
				}
				return periphschauffe;
			}
			var result={};
			result.tagsmode=[];
			for (var p in global.obj.tags){
				var pe=JSON.parse(JSON.stringify(global.obj.tags[p]));
				if(!pe.parent_tag /*&& avecchauffe*/) {
					var avecchauffe=false
					var pemin={};
					pemin.id=pe.id;
					pemin.nom=pe.nom;
					pemin.icon=pe.icon;
					pemin.uuid=pe.uuid;
					var findenfants=recursivegetenfant(global.obj.tags[p],categorie_id);
					if (findenfants.avecchauffe==true) {
						pemin.enfants=findenfants.enfants;
						pemin.ecriture_type=pemin.enfants[0].ecriture_type;
						avecchauffe=true;
					} else {
						pemin.enfants=[];
					}
					var periphschauffe=getifexistsconsigne(pe.id,categorie_id) 
					if (periphschauffe.length>0) {
						res.avecchauffe=true;
						pemin.ecriture_type=periphschauffe[0].ecriture_type;
						avecchauffe=true;
					}
					pemin.periphs=periphschauffe;
				
					if (avecchauffe) {
						result.tagsmode.push(pemin);	
					}
						
				}
				
			}
			var rep = JSON.stringify(result);
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
			break;	

		case 'getalerte' :
			/*{"action":"getalerte","updateTime":"0","v":"1.1.1"}*/
			 
			var boucle60sec = function(res,req_action){
				temps_waiting-=1;
				//console.log('requete alertes',temps_waiting,variables.updateTime);
				var result={updateTime:variables.updateTime};
				
				
				var sql="select max(timestamp_modif+0) max_timestamp from alerte ;";
				var sql_bind=[];
				global.obj.app.db.sqlorder(sql,
				   function(rows){
						var max_timestamp=0;
						if (rows && rows[0]) {
							max_timestamp=rows[0].max_timestamp+0
						}
						//console.log(max_timestamp,'>',parseInt(variables.updateTime));
						if (temps_waiting<10 || (rows && rows[0] && rows[0].max_timestamp>parseInt(variables.updateTime))){
							//console.log('alerte modifiées');
							
							var sql="select a.* from alerte a where date_acquitement is null";/* +
							" and exists (select count(*) from alerte where timestamp_modif+0>?+0);";
							var sql_bind=[variables.updateTime];*/
							
							global.obj.app.db.sqlorder(sql,
								function(rows){
									
									if (rows && rows.length>0) {

										result = {data:rows,updateTime:max_timestamp};
										var rep = JSON.stringify(result);
										//console.log('----> send datas '+' === ' + rep);
										res.writeHead(200, 
												{'Content-Type': 'text/plain',
												 'Access-Control-Allow-Origin': '*'});
									    res.end(rep);
										clearInterval(TimerEtat);	
									} else {
										result = {data:[],updateTime:max_timestamp};
										var rep = JSON.stringify(result);
										//console.log('----> send data vide '+' === ' + rep);
										res.writeHead(200, 
												{'Content-Type': 'text/plain',
												 'Access-Control-Allow-Origin': '*'});
									    res.end(rep);
										clearInterval(TimerEtat);
									}	
								});
		
							
							
						} 
				  }/*,sql_bind*/);
				if (temps_waiting<=0) {
					
					//result['mode']=mode.nom;
					var rep = JSON.stringify(result);
					//console.log('----> send nothing '+' === ' + rep);
					res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
				    res.end(rep);
					clearInterval(TimerEtat);						
				

				}

			};
			//console.log('----> client wait etat ');
			
			var temps_waiting=30;
			var self=this;
			var TimerEtat=setInterval(function(){
				
				boucle60sec(res,self);
				},2000);
			

		
			break;	
		case 'setacquitementalerte':
			if (variables.data){
				
				var timestamp_str=global.req.moment().format('YYYY-MM-DD HH:mm:ss');
				var timestamp=new Date().getTime();	
				if(!Array.isArray(variables.data)){
					variables.data=[variables.data];
				}
				for (var d in variables.data){
					//console.log('setacquitement',timestamp,timestamp_str,variables.data[d]);
					var  sql='update alerte set date_acquitement=?, timestamp_modif=? where uuid=?';
					var sql_bind=[timestamp_str,timestamp,variables.data[d]];
					global.obj.app.db.sqltrans(sql,function(){
						//console.log('-');
					},sql_bind);
				}
				global.obj.app.serveur.emit('applipiscine.acquitementrecu');
				rep={};
				res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
				res.end(JSON.stringify(rep));
			}
			
			break;
		case 'getetat' :
			/*{"action":"getetat","updateTime":"0","v":"1.1.1"}*/
			 
			
			
			var boucle60sec = function(res,req_action){
				temps_waiting-=1;
				var result={};
				var etatchanged=false;
				result.updateTime=0;
				for (var p in global.obj.peripheriques){
					var pe={};
					var etat={};
					if (global.obj.peripheriques[p].last_etat && global.obj.peripheriques[p].last_etat.expression) {
						if (global.obj.peripheriques[p].last_etat.TimeOfetat>variables.updateTime) {
							pe=JSON.parse(JSON.stringify(global.obj.peripheriques[p].last_etat));
							etat=pe;
							if (pe.expression.expr1_val || pe.expression.expr1_unit) etat.expression.expr1=pe.expression.expr1_val +" "+pe.expression.expr1_unit;
							if (pe.expression.expr2_val || pe.expression.expr2_unit) etat.expression.expr2=pe.expression.expr2_val +" "+pe.expression.expr2_unit;
							if (pe.expression.expr3_val || pe.expression.expr3_unit) etat.expression.expr3=pe.expression.expr3_val +" "+pe.expression.expr3_unit;
							if (pe.expression.expr4_val || pe.expression.expr4_unit) etat.expression.expr3=pe.expression.expr4_val +" "+pe.expression.expr4_unit;
							if (pe.expression.expr5_val || pe.expression.expr5_unit) etat.expression.expr3=pe.expression.expr5_val +" "+pe.expression.expr5_unit;
							if (pe.expression.expr6_val || pe.expression.expr6_unit) etat.expression.expr3=pe.expression.expr6_val +" "+pe.expression.expr6_unit;
							if (pe.expression.expr7_val || pe.expression.expr7_unit) etat.expression.expr3=pe.expression.expr7_val +" "+pe.expression.expr7_unit;
							result[global.obj.peripheriques[p].uuid]=etat;
							etatchanged=true;		
						}
					}

					if (global.obj.peripheriques[p].last_etat && global.obj.peripheriques[p].last_etat.TimeOfetat>result.updateTime){
						result.updateTime=global.obj.peripheriques[p].last_etat.TimeOfetat;
					}
				}
				for (p in global.obj.peripheriquesdeportes){
					var pe={};
					var etat={};
					if (global.obj.peripheriquesdeportes[p].last_etat && global.obj.peripheriquesdeportes[p].last_etat.expression) {
						if (global.obj.peripheriquesdeportes[p].last_etat.TimeOfetat>variables.updateTime) {
							pe=JSON.parse(JSON.stringify(global.obj.peripheriquesdeportes[p].last_etat));
							etat=pe;
							if (pe.expression.expr1_val || pe.expression.expr1_unit) etat.expression.expr1=pe.expression.expr1_val +" "+pe.expression.expr1_unit;
							if (pe.expression.expr2_val || pe.expression.expr2_unit) etat.expression.expr2=pe.expression.expr2_val +" "+pe.expression.expr2_unit;
							if (pe.expression.expr3_val || pe.expression.expr3_unit) etat.expression.expr3=pe.expression.expr3_val +" "+pe.expression.expr3_unit;
							if (pe.expression.expr4_val || pe.expression.expr4_unit) etat.expression.expr3=pe.expression.expr4_val +" "+pe.expression.expr4_unit;
							if (pe.expression.expr5_val || pe.expression.expr5_unit) etat.expression.expr3=pe.expression.expr5_val +" "+pe.expression.expr5_unit;
							if (pe.expression.expr6_val || pe.expression.expr6_unit) etat.expression.expr3=pe.expression.expr6_val +" "+pe.expression.expr6_unit;
							if (pe.expression.expr7_val || pe.expression.expr7_unit) etat.expression.expr3=pe.expression.expr7_val +" "+pe.expression.expr7_unit;
							result[global.obj.peripheriquesdeportes[p].uuid]=etat;
							etatchanged=true;		
						}
					}

					if (global.obj.peripheriquesdeportes[p].last_etat && global.obj.peripheriquesdeportes[p].last_etat.TimeOfetat>result.updateTime){
						result.updateTime=global.obj.peripheriques[p].last_etat.TimeOfetat;
					}
				}
				
				for (p in global.obj.peripheriques_chauffage){
					var pe={};
					var etat={};
					if (global.obj.peripheriques_chauffage[p] && global.obj.peripheriques_chauffage[p].last_etat && global.obj.peripheriques_chauffage[p].last_etat.expression) {
						if (global.obj.peripheriques_chauffage[p].last_etat.TimeOfetat>variables.updateTime) {
							pe=JSON.parse(JSON.stringify(global.obj.peripheriques_chauffage[p].last_etat));
							etat=pe;
							if (pe.expression.expr1_val || pe.expression.expr1_unit) etat.expression.expr1=pe.expression.expr1_val +" "+pe.expression.expr1_unit;
							if (pe.expression.expr2_val || pe.expression.expr2_unit) etat.expression.expr2=pe.expression.expr2_val +" "+pe.expression.expr2_unit;
							if (pe.expression.expr3_val || pe.expression.expr3_unit) etat.expression.expr3=pe.expression.expr3_val +" "+pe.expression.expr3_unit;
							if (pe.expression.expr4_val || pe.expression.expr4_unit) etat.expression.expr3=pe.expression.expr4_val +" "+pe.expression.expr4_unit;
							if (pe.expression.expr5_val || pe.expression.expr5_unit) etat.expression.expr3=pe.expression.expr5_val +" "+pe.expression.expr5_unit;
							if (pe.expression.expr6_val || pe.expression.expr6_unit) etat.expression.expr3=pe.expression.expr6_val +" "+pe.expression.expr6_unit;
							if (pe.expression.expr7_val || pe.expression.expr7_unit) etat.expression.expr3=pe.expression.expr7_val +" "+pe.expression.expr7_unit;
							result[global.obj.peripheriques_chauffage[p].uuid]=etat;
							etatchanged=true;		
						}
					}

					if (global.obj.peripheriques_chauffage[p].last_etat && global.obj.peripheriques_chauffage[p].last_etat.TimeOfetat &&  global.obj.peripheriques_chauffage[p].last_etat.TimeOfetat>result.updateTime){
						result.updateTime=global.obj.peripheriques_chauffage[p].last_etat.TimeOfetat;
					}
					
				}
				for (p in global.obj.peripheriques_batterie){
					var pe={};
					var etat={};
					if (global.obj.peripheriques_batterie[p] && global.obj.peripheriques_batterie[p].last_etat && global.obj.peripheriques_batterie[p].last_etat.expression) {
						if (global.obj.peripheriques_batterie[p].last_etat.TimeOfetat>variables.updateTime) {
							pe=JSON.parse(JSON.stringify(global.obj.peripheriques_batterie[p].last_etat));
							etat=pe;
							if (pe.expression.expr1_val || pe.expression.expr1_unit) etat.expression.expr1=pe.expression.expr1_val +" "+pe.expression.expr1_unit;
							if (pe.expression.expr2_val || pe.expression.expr2_unit) etat.expression.expr2=pe.expression.expr2_val +" "+pe.expression.expr2_unit;
							if (pe.expression.expr3_val || pe.expression.expr3_unit) etat.expression.expr3=pe.expression.expr3_val +" "+pe.expression.expr3_unit;
							if (pe.expression.expr4_val || pe.expression.expr4_unit) etat.expression.expr3=pe.expression.expr4_val +" "+pe.expression.expr4_unit;
							if (pe.expression.expr5_val || pe.expression.expr5_unit) etat.expression.expr3=pe.expression.expr5_val +" "+pe.expression.expr5_unit;
							if (pe.expression.expr6_val || pe.expression.expr6_unit) etat.expression.expr3=pe.expression.expr6_val +" "+pe.expression.expr6_unit;
							if (pe.expression.expr7_val || pe.expression.expr7_unit) etat.expression.expr3=pe.expression.expr7_val +" "+pe.expression.expr7_unit;
							result[global.obj.peripheriques_batterie[p].uuid]=etat;
							etatchanged=true;		
						}
					}

					if (global.obj.peripheriques_batterie[p].last_etat && global.obj.peripheriques_batterie[p].last_etat.TimeOfetat &&  global.obj.peripheriques_batterie[p].last_etat.TimeOfetat>result.updateTime){
						result.updateTime=global.obj.peripheriques_batterie[p].last_etat.TimeOfetat;
					}
					
				}
				if ((global.req.mode.last_etat && global.req.mode.last_etat.TimeOfetat>=variables.updateTime)
						|| (global.req.type.last_etat && global.req.type.last_etat.TimeOfetat>variables.updateTime)){
						try {
							var etat=global.req.mode.last_etat;
							result['modemaj']=etat;	
							
							if (etat.expression.etat) {
								result['mode']=etat.expression.etat.nom;
							}
							if (etat.TimeOfetat>result.updateTime){
								result.updateTime=etat.TimeOfetat;
							}	
							
							var etat=global.req.type.last_etat;
							result['typemaj']=etat;	
							
							if (etat.expression.etat) result['type']=etat.expression.etat.nom;
							if (etat.TimeOfetat>result.updateTime){
								result.updateTime=etat.TimeOfetat;
							}
							
							etatchanged=true;							
						} catch (e) {
							console.log(e);
							console.log(new Error().stack);
						}

					}

				//console.log('---temps---'+temps_waiting);
				if (etatchanged || temps_waiting<=0) {
					
					
					//result['mode']=mode.nom;
					var rep = JSON.stringify(result);
					//console.log('----> send etat '+' === ' + rep);
					res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
					res.end(rep);	
					clearInterval(TimerEtat);						
				

				}

			};
			//console.log('----> client wait etat ');
			
			var temps_waiting=60*2;
			var self=this;
			var TimerEtat=setInterval(function(){
				
				boucle60sec(res,self);
				},500);
			

		
			break;	
		case 'setetat' :
			switch (variables.cmd){
				case 'ON':
					var periphe=global.obj.app.core.findinperiphs(variables.uuid);
					
					periphe.set_etat('ON',null,function(rep_box){
						
							res.writeHead(200, 
									{'Content-Type': 'text/plain',
									 'Access-Control-Allow-Origin': '*'});
							res.end(JSON.stringify(rep_box));
						},null,user);
							
					break;
				case 'OFF':
				case 'STOP':
					var periphe=global.obj.app.core.findinperiphs(variables.uuid);
	
					periphe.set_etat(variables.cmd,null,function(rep_box){
							res.writeHead(200, 
									{'Content-Type': 'text/plain',
									 'Access-Control-Allow-Origin': '*'});
							res.end(JSON.stringify(rep_box));
						},null,user);
					break;
				case 'UP':
					var periphe=global.obj.app.core.findinperiphs(variables.uuid);
					periphe.set_etat('UP',null,function(rep_box){
							res.writeHead(200, 
									{'Content-Type': 'text/plain',
									 'Access-Control-Allow-Origin': '*'});
							res.end(JSON.stringify(rep_box));
						},null,user);
							
					break;
				case 'DOWN':
					var periphe=global.obj.app.core.findinperiphs(variables.uuid);
					periphe.set_etat('DOWN',null,function(rep_box){
							res.writeHead(200, 
									{'Content-Type': 'text/plain',
									 'Access-Control-Allow-Origin': '*'});
							res.end(JSON.stringify(rep_box));
						},null,user);
					break;
				case 'DIM':
					var periphe=global.obj.app.core.findinperiphs(variables.uuid);
					periphe.set_etat('DIM',variables.valeur,function(rep_box){
						res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
						res.end(JSON.stringify(rep_box));
					},null,user);
	
					break;
				default:
					if (variables.mode){
						global.req.mode.set_etat(variables.mode,function(){
							res.writeHead(200, 
									{'Content-Type': 'text/plain',
									 'Access-Control-Allow-Origin': '*'});
							res.end(JSON.stringify({}));
						},null,user)
					}
					if (variables.type){
						global.req.type.set_etat(variables.type,function(){
							res.writeHead(200, 
									{'Content-Type': 'text/plain',
									 'Access-Control-Allow-Origin': '*'});
							res.end(JSON.stringify({}));
						},null,user)
					}
					break;
			}
			break;
			
		case 'getid' :
			var cid=global.obj.app.core.findobj('idapplication','constantes');
			var rep={};
			rep['id']=cid.valeur;
			rep['user']=user.user;
			rep['droit_tarif']=user.droit_tarif;
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(JSON.stringify(rep));

			break;
		case 'setacceuil' :
			/*"/index.php?action=setacceuil&uuid=dfd15553caf75d02e01ed2ac272782&bool=1"
			1338:GET : /index.php{"action":"setacceuil","uuid":"dfd15553caf75d02e01ed2ac272782","bool":"1"}
			*/
			var sql="Select * from utilisateurs where id='"+this.user.id+"';";
			global.obj.app.db.sqlorder(sql,
				function(rows){
					if (rows.length>0) {
						
						var periph_uuid=variables.uuid;
						var is_onacceuil=variables.bool;
						var periph=global.obj.app.core.findobj(periph_uuid,'peripheriques');
						if (!periph) {
							periph=global.obj.app.core.findobj(periph_uuid,'peripheriques_chauffage');
						}
						if (!periph) {
							periph=global.obj.app.core.findobj(periph_uuid,'peripheriques_alarme');
						}
						var sql=["delete from peripherique_user_acceuil where id_peripherique='"+periph.id+"' and id_utilisateurs='"+rows[0].id+"';" ];
						
						if (variables.bool=="1") {
							sql.push("insert into peripherique_user_acceuil values ('"+periph.id+"','"+rows[0].id+"');")   
						}
						global.obj.app.db.sqltrans(sql,function(){
							rep={};
							res.writeHead(200, 
									{'Content-Type': 'text/plain',
									 'Access-Control-Allow-Origin': '*'});
							res.end(JSON.stringify(rep));
						});
					} else {
						rep={};
						res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
						res.end(JSON.stringify(rep));							
					}
					

			});

			break;	
			
			
		case 'getprogrammation' :
				/*var categ_consigne_temperature=null;
				for (var c in global.obj.categories){
					if (global.obj.categories[c].type=='consigne_temperature'){
						categ_consigne_temperature=global.obj.categories[c];
					}
				}*/
				/*/index.php{"action":"getprogrammation"}*/
				/*{"mode_m0":{"tag_24":[{"heure":"0h00","valeur":"20","jours":{"Lu":"1","Ma":"1","Me":"1","Je":"1","Ve":"1","Sa":"1","Di":"1"}}],"tag_10":[{"heure":"5h00","valeur":"20.5","jours":{"Lu":"0","Ma":"1","Me":"1","Je":"0","Ve":"1","Sa":"0","Di":"1"}},{"heure":"10h00","valeur":"19","jours":{"Lu":"0","Ma":"1","Me":"1","Je":"0","Ve":"1","Sa":"0","Di":"1"}}]},"mode_m2":{"tag_24":[{"heure":"0h00","valeur":"20","jours":{"Lu":"1","Ma":"1","Me":"1","Je":"1","Ve":"1","Sa":"1","Di":"1"}}]}}*/
				var result={};
				var sql="  select distinct 'mode_' || m.uuid mode,'categ_' || c.categorie categorie,'tag_' || t.id tag,peripherique,c.id prog_id,c.heure,c.valeur,cj.id_jours ";
					sql+=" from consigne_temp c,tag t,mode m, consigne_temp_jours cj";
					sql+=" where c.mode=m.id";
					sql+=" and c.tag=t.id";
					sql+=" and c.categorie='"+variables.categorie+"'";
					sql+=" and cj.id_consigne_temp=c.id";
					sql+=" order by mode,categorie,tag,prog_id"	;
				
				global.obj.app.db.sqlorder(sql,
					function(rows){
						var obj={};
						for (l in rows){
							//console.log(JSON.stringify(rows[l]));
							var lig=rows[l];
							if (!obj[lig.mode]) obj[lig.mode]={};
							if (!obj[lig.mode][lig.categorie]) obj[lig.mode][lig.categorie]={};
							if (!obj[lig.mode][lig.categorie][lig.tag]) obj[lig.mode][lig.categorie][lig.tag]={};
							if (!obj[lig.mode][lig.categorie][lig.tag][lig.prog_id]) obj[lig.mode][lig.categorie][lig.tag][lig.prog_id]={};
							if (!obj[lig.mode][lig.categorie][lig.tag][lig.prog_id]['peripherique']) obj[lig.mode][lig.categorie][lig.tag][lig.prog_id]['peripherique']=lig.peripherique;
							if (!obj[lig.mode][lig.categorie][lig.tag][lig.prog_id]['valeur']) obj[lig.mode][lig.categorie][lig.tag][lig.prog_id]['valeur']=lig.valeur;
							if (!obj[lig.mode][lig.categorie][lig.tag][lig.prog_id]['heure']) obj[lig.mode][lig.categorie][lig.tag][lig.prog_id]['heure']=lig.heure;
							if (!obj[lig.mode][lig.categorie][lig.tag][lig.prog_id]['jours']) obj[lig.mode][lig.categorie][lig.tag][lig.prog_id]['jours']={"Lu":"0","Ma":"0","Me":"0","Je":"0","Ve":"0","Sa":"0","Di":"0"};
							obj[lig.mode][lig.categorie][lig.tag][lig.prog_id]['jours'][lig.id_jours]="1";
						}
					
						var rep = JSON.stringify(obj);
						res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
						res.end(rep);
					});

			break;
		case 'setprogrammation' :
			/* "/http://192.168.1.10:1338/index.php?action=setprogrammation"
			1338:POST: /http://192.168.1.10:1338/index.php{"action":"setprogrammation"}
			Body: {"data":{"mode_dd4912e9ddb325d161cade3aa9aca67d":{"tag_27":[{"heure":"2h15","valeur":"11.5","jours":{"Lu":0,"Ma":1,"Me":0,"Je":1,"Ve":1,"Sa":0,"Di":0}},{"heure":"21h15","valeur":"13","jours":{"Lu":0,"Ma":1,"Me":1,"Je":1,"Ve":1,"Sa":0,"Di":0}}],"tag_5":[{"heure":"18h00","valeur":"11","jours":{"Lu":1,"Ma":0,"Me":0,"Je":0,"Ve":0,"Sa":0,"Di":1}}]}}}
			 */
			/*
			 * {"data":{"id":"1","jours":[{"id":"Lu","value":true},{"id":"Ve","value":true},{"id":"Ma","value":true},{"id":"Di","value":true},{"id":"Je","value":true}],"mode":"2","tag":"5","heure":"0h00","valeur":"20"}}
			 */
			
			
			/*global.req.async.map(global.obj.peripheriques,function(periph,callbacko){
			 	callbacko(obj);
			}
	  		,function(err,objs){
		  		  callback();
	  		});*/
			
			/*global.req.async.series([
			             function(callbackd){
			              	callbackd();
			              }]
			           , function(err){
			           		//fin
			           });*/
			var modesprogs=variables.data;
			global.req.async.series([
			 
					function(callbackd){
						 /*delete consigne_temp_jours des modes recu*/
						 global.req.async.map(Object.keys(modesprogs),function(m,callbacke){
							 var mode=global.obj.app.core.findobj(m.substring(5, 99),'modes');
							 global.req.async.map(Object.keys(modesprogs[m]),function(c,callbackec){
								var categ=global.obj.app.core.findobj(c.substring(6, 99),'categories');
								var sql="delete from consigne_temp_jours where id_consigne_temp in (select id from consigne_temp where consigne_temp.mode=? and consigne_temp.categorie=?) ; ";
								//console.log("d1mode "+mode.id+" "+mode.nom);
								global.obj.app.db.sqltrans(sql,function(){
									callbackec();	
								},[mode.id,categ.id]);
							 	
								}
						  		,function(err){
						  			callbacke();
						  		});	}
					  		,function(err){
					  			console.log('fin des delete consigne_temp_jours');
					  			callbackd();
					  		});
					      	
					    },
					function(callbackf){
						 /*delete consigne_temp des modes recu*/
						 global.req.async.map(Object.keys(modesprogs),function(m,callbacke){
							 var mode=global.obj.app.core.findobj(m.substring(5, 99),'modes');
							 global.req.async.map(Object.keys(modesprogs[m]),function(c,callbackec){
								var categ=global.obj.app.core.findobj(c.substring(6, 99),'categories');
								var sql="delete from consigne_temp where consigne_temp.mode=?  and consigne_temp.categorie=?; ";
								//console.log("d2mode "+mode.id+" "+mode.nom);
								global.obj.app.db.sqltrans(sql,function(){
									callbackec();	
								},[mode.id,categ.id]);
							 	
							}
					  		,function(err){
					  			callbacke();
					  		});	}
				  		,function(err){
				  			console.log('fin des delete consigne_temp');
				  			callbackf();
				  		});
					      	
					    },
					function(callbackd){
						 //ajout des modes prog recus
						 global.req.async.map(Object.keys(modesprogs),function(m,callbacko){
							 
							 	var mode=global.obj.app.core.findobj(m.substring(5, 99),'modes');
							 	//console.log("inmode "+mode.id+" "+mode.nom);
							 	var objprog={};
							 	global.req.async.map(Object.keys(modesprogs[m]),function(c,callbackc){
									var categ=global.obj.app.core.findobj(c.substring(6, 99),'categories');
									//console.log("  categorie " +categ.id+" "+categ.nom);
									global.req.async.map(Object.keys(modesprogs[m][c]),function(t,callbackt){
										var tag=global.obj.app.core.findobj(t.substring(4, 99),'tags');
										var periph={};
										if (!tag) {
											periph=global.obj.app.core.findobj(t.substring(4, 99),'peripheriques');
											if (periph && periph.tag && periph.tag[0]){
												tag=periph.tag[0];
											} else {
												tag={};
											}
											
										}
										//console.log("  tag " +tag.id+" "+tag.nom);
										global.req.async.map(Object.keys(modesprogs[m][c][t]),function(p,callbackp){
											var prog=modesprogs[m][c][t][p];
											objprog={};
											objprog.mode=mode.id;
											objprog.tag=tag.id;
											objprog.peripherique=prog.peripherique;
											objprog.heure=prog.heure;
											objprog.valeur=prog.valeur;
											objprog.jours=[];
											objprog.categorie=categ.id;
											//console.log("    prog " +prog.heure+" = "+prog.valeur + " categ "+categ.id);
											for (j in prog.jours){
												if (prog.jours[j]==1) {
													var jour={"id":j,"value":true};
													objprog.jours.push(jour);
												}
											}
											var objsave={};
											objsave.action="save";
											objsave.element="consigne_temp";
											objsave.data=objprog;
											//console.log(JSON.stringify(objsave));
											global.obj.app.core.majdb(objsave,callbackp);
											
										},
										function(err){
											callbackt();
										});
									},function(err){
										callbackc();
									});
							 	}, function(err){
									callbacko();
								});
								
							}
					  		,function(err){
					  			//console.log('fin des enregistrement consigne_temp');
					  			callbackd();
					  		});
					    }
	             ]
	           , function(err){
					global.req.mode.get_etat(function(err,mode){
						global.req.mode.set_etat(mode.id,function(){
							global.obj.app.serveur.emit('programmation_consigne.changed');
							res.writeHead(200, 
									{'Content-Type': 'text/plain',
									 'Access-Control-Allow-Origin': '*'});
							res.end(JSON.stringify({}));
						},null,user)
					})

					/*var result={};
					var rep = JSON.stringify(result);
					res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
					res.end(rep);*/
	           });
			break;
			
		case 'getalarmeprog' :
			/*/index.php?action=getalarmeprog&mode=85685a0ec82e72a280fe6e6e38b58457"
			1338:GET : /index.php{"action":"getalarmeprog","mode":"85685a0ec82e72a280fe6e6e38b58457"}*/
			var result={};
			var mode=obj.app.core.findobj(variables.mode,'modes');
			req.async.map(Object.keys(global.obj.peripheriques_alarme),function(a,callbacks){
				var pa=global.obj.peripheriques_alarme[a];
				result[pa.uuid]=false;
				var sql="select '"+pa.uuid+"' uuid from peripheriquealarme_mode where id_mode='"+mode.id+"' and id_peripheriquealarme='"+pa.id+"';";
				global.obj.app.db.sqlorder(sql,function(rows){
					if (rows[0] && rows[0].uuid) {
						result[rows[0].uuid]=true;
					}
					callbacks();	
				});
				
			},function (err){
				var rep = JSON.stringify(result);
				res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
				res.end(rep);
			});
			
			break;
		case 'confirmPin' :
			//http://192.168.1.10:1339/index.php?action=confirmPin&uuid=6486b4e98228b83d4b13d54febe5f170&pin=227f6afd3b7f89b96c4bb91f95d50f6d
			//variables.uuid
			//variables.pin		
			var md5=calcMD5('alarm');
			if (variables.uuid==calcMD5('alarm')){
				req.constante.get_etat('code_pin_alarme',function(val){
					var rep ={};
					if (val==variables.pin || val=='0000' || val==null) {
						rep = {res:'OK'};	
					} 					
					res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
					res.end(JSON.stringify(rep));						
				})
			}

		break;
		case 'setalarmeprog' :
			//"/http://192.168.1.10:1338/index.php?action=setalarmeprog&uuid=6486b4e98228b83d4b13d54febe5f170"
			//1338:POST: /http://192.168.1.10:1338/index.php{"action":"setalarmeprog","uuid":"6486b4e98228b83d4b13d54febe5f170"}
			//Body: {"data":{"alarms":{"de181a41ea47a4a6bf2d3dec2b2926":true,"a9aea2406b2000526dd97e6c707edc":true},"mode":"765909642cbcd5c6f7c41e8196713018","pin":"d41d8cd98f00b204e9800998ecf8427e"}}

			var md5=calcMD5('alarm');
			if (variables.uuid==calcMD5('alarm')){
				req.constante.get_etat('code_pin_alarme',function(val){
					var rep ={};
					if (val==variables.data.pin || val=='0000' || val==null) {
						var mode=obj.app.core.findobj(variables.data.mode,'modes');
						for (a in variables.data.alarms){
							var al=obj.app.core.findobj(a,'peripheriques');
                 			var sql="delete from peripheriquealarme_mode where id_mode='"+mode.id+"' and id_peripheriquealarme='"+al.id+"';";
                 			global.obj.app.db.sqltrans(sql);
             				if (variables.data.alarms[a]==true){
	                 			sql="insert into peripheriquealarme_mode (id_mode,id_peripheriquealarme) values('"+mode.id+"','"+al.id+"');"
	                 			global.obj.app.db.sqltrans(sql);
                 			}                 		       		
						}
					} 	
					var rep ={};
					res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
					res.end(JSON.stringify(rep));						
								
						
				})
			}
			
			break;
		case 'setalarme':
			
			var md5=calcMD5('alarm');
			if (variables.uuid==calcMD5('alarm')){
				req.constante.get_etat('code_pin_alarme',function(val){
					var rep ={};
					if (val==variables.data.pin || val=='0000' || val==null) {
						
						for (a in variables.data.alarms){
							var al=obj.app.core.findobj(a,'peripheriques');
							if (variables.data.alarms[a]==true) {
								al.set_etat("ON",al.ecriture_max,function(){},null,user);
							} else if (variables.data.alarms[a]==false) {
								al.set_etat("OFF",al.ecriture_min,function(){},null,user);
							}
							
						}
						
					} 	
					var rep ={};
					res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
					res.end(JSON.stringify(rep));						
							
						
				})
			}
			break;
		case 'setalarmecode':
			
			var md5=calcMD5('alarm');
			var data={};
			try {
				data=JSON.parse(variables.valeur);
			} catch (e) {
				// TODO: handle exception
			}
			
			if (data.uuid==calcMD5('alarm')){
				req.constante.get_etat('code_pin_alarme',function(val){
					var rep ={};
					if (val==data.pin || val=='0000' || val==null) {
						
						var new_md5pin=data.pina;
						req.constante.set_etat('code_pin_alarme',new_md5pin,function(){
							var rep ={};
							res.writeHead(200, 
									{'Content-Type': 'text/plain',
									 'Access-Control-Allow-Origin': '*'});
							res.end(JSON.stringify(rep));	
						});
						
					} else {
						var rep ={};
						res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
						res.end(JSON.stringify(rep));							
					}
					
							
						
				})
			}
			break;
		case 'deletemode':
			var mode_uuid=variables.mode_uuid;
			//console.log('delete mode ', mode_uuid);
			var objs={action:'delete',element:'mode'};
			var deleted=false;
			for (m in global.obj.modes){
				if (global.obj.modes[m].uuid==mode_uuid){
					//console.log('delete mode '+ global.obj.modes[m].nom +" " +global.obj.modes[m].uuid)
					objs.data=global.obj.modes[m];
					deleted=true;
					global.obj.app.core.majdb(objs,function(){
						var rep ={};
						res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
						res.end(JSON.stringify(rep));
					});
				}
			}
			if (!deleted){
				var rep ={};
				res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
				res.end(JSON.stringify(rep));
			}
			break;
		case 'addmode':
			var mode_name=variables.mode_nom;
			//console.log('add mode ', mode_name);
			var added=false;
			objs={action:'save',element:'mode'};
				objs.data={nom:mode_name,icon:'images/confort_n.png'};
				var modeexists=global.obj.app.core.findobj(objs.data.nom,'modes');
				if (modeexists) {
					objs.data.id=modeexists.id;
					objs.data.uuid=modeexists.uuid;
				}else {
				}
				added=true;
				global.obj.app.core.majdb(objs,function(){
					var rep ={};
					res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
					res.end(JSON.stringify(rep));	
				})
			
			if (!added){
				var rep ={};
				res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
				res.end(JSON.stringify(rep));	
			}

			break;				
				var rep ={};
				res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
				res.end(JSON.stringify(rep));

			break;
		case 'setmodes' :
			//variables.data.modes	.id/.nom/.icon
			//Body: {"data":{"modes":{"dd4912e9ddb325d161cade3aa9aca67d":{"id":"dd4912e9ddb325d161cade3aa9aca67d","nom":"Confort","icon":"images/alarm0.png"},"85685a0ec82e72a280fe6e6e38b58457":{"id":"85685a0ec82e72a280fe6e6e38b58457","nom":"Eco","icon":"images/alarm0.png"},"765909642cbcd5c6f7c41e8196713018":{"id":"765909642cbcd5c6f7c41e8196713018","nom":"Absence","icon":"images/alarm0.png"},"p448":{"id":"p448","icon":"images/confort.png","nom":"test"}}}}
			var objs={action:'delete',element:'mode'};
			for (m in global.obj.modes){
				if (!variables.data.modes[global.obj.modes[m].uuid]){
					//console.log('delete mode '+ global.obj.modes[m].nom +" " +global.obj.modes[m].uuid)
					objs.data=global.obj.modes[m];
					global.obj.app.core.majdb(objs,function(){	});
				}
			}
			objs={action:'save',element:'mode'};
			for (m in variables.data.modes){
				var modesend=variables.data.modes[m];
				objs.data=modesend;
				objs.data.uuid=objs.data.id;
				var modeexists=global.obj.app.core.findobj(objs.data.uuid,'modes');
				if (modeexists) {
					objs.data.id=modeexists.id;
				}else {
					objs.data.id="";
				}
				global.obj.app.core.majdb(objs,function(){
				})
			}
			var rep ={};
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(JSON.stringify(rep));	
			break;				
		
			
		case 'confirmpinifchangemode' :
			//"/index.php?action=confirmpinifchangemode&mode=Confort"
			//1338:GET : /index.php{"action":"confirmpinifchangemode","mode":"Confort"}
			//variables.mode =Confort
			var modeselect=global.obj.app.core.findobj(variables.mode,'modes');
			
			var sql="select * from peripheriquealarme_mode where id_mode='"+modeselect.id+"';";
			global.obj.app.db.sqlorder(sql,function(rows){
				
				var rep ={};
				rep.nbdiff=0;
				rep[modeselect.uuid]={};
				rep['alarmeactuel']={};
				for (a in global.obj.peripheriques_alarme){
					var al = global.obj.peripheriques_alarme[a];
					var eta=al.last_etat;
					var modeselect_al_on="0";
					for (r in rows){
						if (rows[r].id_peripheriquealarme==al.id){
							modeselect_al_on="1";
						}
					}
					rep[modeselect.uuid][al.uuid]={etat:modeselect_al_on};
					rep['alarmeactuel'][al.uuid]=al.alarme[0].last_etat.expression.etat;
					if (modeselect_al_on!=al.alarme[0].last_etat.expression.etat) {
						rep.nbdiff+=1;
					}
					
				}
				
				res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
				res.end(JSON.stringify(rep));	
			});
			break;		

		case 'copiemodeprog' :
				//		?action=copiemodeprog&idsource=mode_p731&idcible=mode_p689&v=home.1.1.1",
				//"query":{"action":"copiemodeprog","idsource":"mode_p731","idcible":"mode_p689","v":"home.1.1.1"},"pathname":"/http://192.168.1.10:1338/inspireathome/index.php","path":"/http://192.168.1.10:1338/inspireathome/index.php?action=copiemodeprog&idsource=mode_p731&idcible=mode_p689&v=home.1.1.1","href":"/http://192.168.1.10:1338/inspireathome/index.php?action=copiemodeprog&idsource=mode_p731&idcible=mode_p689&v=home.1.1.1"}} --
			if (variables.idsource != variables.idcible) {
				var modesource=global.obj.app.core.findobj(variables.idsource.substring(5,99),'modes');
				var modecible=global.obj.app.core.findobj(variables.idcible.substring(5,99),'modes');
				
				global.req.async.map(global.obj.consignes,function(cons,callbacke){
						if (cons.mode==modecible.id){
							var objmaj={action:'delete',element:'consigne_temp',data:cons};
							global.obj.app.core.majdb(objmaj,callbacke);
						} else {
							callbacke();
						}
					}, function(err) {
					
						global.req.async.map(global.obj.consignes,function(consn,callbacke){
							if (consn.mode==modesource.id){
								
								var conscible=consn;
								conscible.id=null;
								conscible.mode=modecible.id;
								//{"action":"save","element":"consigne_temp","data":{"mode":6,"tag":10,"heure":"0h00","valeur":"5","jours":[{"id":"Me","value":true},{"id":"Ve","value":true},{"id":"Di","value":true}]}}
								//after_id_tableprinc id=406  insert into consigne_temp (mode,tag,heure,valeur) values ('6','10','0h00','5');
								var joursseultrue=[];
								for(var j in conscible.jours){
									if (conscible.jours[j].value==true){
										joursseultrue.push(conscible.jours[j]);
									}
								}
								conscible.jours=joursseultrue;
								var objmaj={action:'save',element:'consigne_temp',data:conscible};
								global.obj.app.core.majdb(objmaj,callbacke);
							} else {
								callbacke();
							}
						},function(err){
							global.req.consigne.charge_consignes(function(){
								global.obj.app.serveur.emit('programmation_consigne.changed');
							});
							res.writeHead(200, 
									{'Content-Type': 'text/plain',
									 'Access-Control-Allow-Origin': '*'});
							res.end(JSON.stringify({}));
						});
						
						
				});	
			} else {
				res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
				res.end(JSON.stringify({}));	
			}

			
			break;
		case 'effacemodeprog' :
			
				var modecible=global.obj.app.core.findobj(variables.idcible.substring(5,99),'modes');
				
				global.req.async.map(global.obj.consignes,function(cons,callbacke){
						if (cons.mode==modecible.id){
							var objmaj={action:'delete',element:'consigne_temp',data:cons};
							global.obj.app.core.majdb(objmaj,callbacke);
						} else {
							callbacke();
						}
					}, function(err) {
							global.req.consigne.charge_consignes(function(){
								global.obj.app.serveur.emit('programmation_consigne.changed');
							});
							res.writeHead(200, 
									{'Content-Type': 'text/plain',
									 'Access-Control-Allow-Origin': '*'});
							res.end(JSON.stringify({}));
					});	
			 
			break;


			case 'differemode' :
				//console.log(JSON.stringify(variables));
				//{"action":"differemode","data":"id=p731&date=2016-01-08&heure=6h00"}
				var jsondata='{"'+variables.data.split("\n").join().split('&').join('","').split('=').join('":"')+'"}';
				//console.log(jsondata);
				var objdata=JSON.parse(jsondata);
				var modediff= global.obj.app.core.findobj(objdata.id,'modes');
				if (modediff) {
					var sql = ['delete from modeactivationdiff',
			           'insert into modeactivationdiff (mode,heure,date) values (\''+modediff.id+'\',\''+objdata.heure+'\',\''+objdata.date+'\');'];
			
					global.obj.app.db.sqltrans(sql,function(){
							rep=JSON.stringify({"res":"OK"});
						res.writeHead(200, 
									{'Content-Type': 'text/plain',
									 'Access-Control-Allow-Origin': '*'});
						res.end(rep); 						
						
						});
				 } else {
				 
					//appli $('#mode_'+index).find("#etat").html('Activation différée à '+data.diff.heure+' le '+data.diff.date);
					res.writeHead(404, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
					res.end("");				 
				 }
									
				break;
						
			case 'getuser' :
				var sql='Select u.user name,u.* from utilisateurs u;';
				var self=this
				global.obj.app.db.sqlorder(sql,
					function(rows){
						var user=self.user;
						var rep = {};
						for (var u in rows) {
							if ((rows[u].name !='administrateur' &&
									rows[u].name!='demo') || user.user=='administrateur') {
								var us={};
								us.name=rows[u].name;
								if (rows[u].phone!=null) us.phone=unescape(rows[u].phone);
								if (rows[u].mail!=null) us.mail=unescape(rows[u].mail);
								us.alarme_phone=rows[u].alarme_phone;
								us.alarme_mail=rows[u].alarme_mail;
								us.uuid=rows[u].uuid;
								rep[us.uuid]=us;
							}
						}
						rep=JSON.stringify(rep);
						res.writeHead(200, 
									{'Content-Type': 'text/plain',
									 'Access-Control-Allow-Origin': '*'});
						res.end(rep);
					});
				break;
					
			case 'adduser' :
				
				if (variables.data ){
					var txtdata=variables.data;
					txtdata=txtdata.split('user[').join('"');
					txtdata=txtdata.split(']=').join('":"');
					txtdata=txtdata.split('&').join('",');
					txtdata='{'+txtdata+'"}';
					var userdata=JSON.parse(txtdata);
				    var sql="insert into utilisateurs ("
						var cols="";
						var vals="";
						var sep="";
							for (c in userdata){
								var col=userdata[c];
								var colname=c;
								if (colname=='name') colname='user';
								if (c!='id' ){
									cols+=sep+colname;
									vals+=sep+"'"+col+"'"
									sep=",";
								}
							}
						sql+=cols+") values ("+vals+");";
						
						
  						global.obj.app.db.sqltrans(sql,function(){
 							rep=JSON.stringify({"res":"OK"});
							res.writeHead(200, 
										{'Content-Type': 'text/plain',
										 'Access-Control-Allow-Origin': '*'});
							res.end(rep); 						
  						
  						});
				} else {
					rep=JSON.stringify({});
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep); 
				}
				break;
			case 'modifuser' :
				if (variables.uuid) {
					var sql='Select u.user name,u.* from utilisateurs u where uuid=\''+variables.uuid+'\' and password=\''+variables.password+'\';';
					global.obj.app.db.sqlorder(sql,
						function(rows){
							
							var rep = {};
							if (rows.length>0) {
								rep.res='OK';
							} 

							rep=JSON.stringify(rep);
							res.writeHead(200, 
										{'Content-Type': 'text/plain',
										 'Access-Control-Allow-Origin': '*'});
							res.end(rep);
						});					
				} else if (variables.data ){
					var txtdata=variables.data;
					txtdata=txtdata.split('user[').join('"');
					txtdata=txtdata.split(']=').join('":"');
					txtdata=txtdata.split('&').join('",');
					txtdata='{'+txtdata+'"}';
					var userdata=JSON.parse(txtdata);
					
					    var sql="update utilisateurs set "
						var cols="";
						var sep="";
							for (c in userdata){
								var col=userdata[c];
								var colname=c;
								if (colname=='name') colname='user';
								if (c!='uuid' && isRealValue(col) ){
									if (colname=='password' && col=="" ) {
										
									} else {
										cols+=sep+colname+"="+"'"+col+"'";
										sep=",";
									}
									
								}
							}
						sql+=cols+" where uuid='"+userdata.uuid+"';";
						
  						global.obj.app.db.sqltrans(sql,function(){
 							rep=JSON.stringify({"res":"OK"});
							res.writeHead(200, 
										{'Content-Type': 'text/plain',
										 'Access-Control-Allow-Origin': '*'});
							res.end(rep); 						
  						
  						});

						
				}

				break;

				break;			
			case 'deleteuser' :
				var sql='Select u.uuid ,u.password from utilisateurs u where uuid=\''+variables.uuid+'\' and password=\''+variables.password+'\';';
				global.obj.app.db.sqlorder(sql,
					function(rows){
						
						var rep = {};
						if (rows.length>0) {
							rep.res='OK';
							var sql='delete from utilisateurs where uuid=\''+rows[0].uuid+'\' and password=\''+rows[0].password+'\';';
	  						global.obj.app.db.sqltrans(sql,function(){
	  						
	  						});						
  						} 

						rep=JSON.stringify(rep);
						res.writeHead(200, 
									{'Content-Type': 'text/plain',
									 'Access-Control-Allow-Origin': '*'});
						res.end(rep);
						

					});
				break;
            case 'refresh_infos_cloture':
                console.log('demande de refresh pour cloture',variables.sejour_id,variables.titulaire_id);
                var automation=global.automation['40_aire_voyage_calcul_sejour'];
                automation.calculsejour(variables.titulaire_id,null,null,function(lignes_consos){

                    var rep = JSON.stringify(lignes_consos);
                    res.writeHead(200,
                        {'Content-Type': 'text/plain',
                            'Access-Control-Allow-Origin': '*'});
                    res.end(rep);
                });
                break;
            case 'maj_sejour_refresh_infos_cloture':
                console.log('demande de refresh pour cloture',variables.sejour_id,variables.titulaire_id);
                var automation=global.automation['40_aire_voyage_calcul_sejour'];
                //var vars={element:'sejour', data:variables.data,action:'save'};
                //obj.app.core.majdb(vars,function(variabls,reponse){
                automation.calculsejour(variables.titulaire_id,variables.sejour_id,variables.data,function(lignes_consos){
                    var rep = JSON.stringify(lignes_consos);
                    res.writeHead(200,
                        {'Content-Type': 'text/plain',
                            'Access-Control-Allow-Origin': '*'});
                    res.end(rep);
                });
                //});

                break;

            case 'maj_sejour_cloture':
                console.log('demande de refresh pour cloture',variables.sejour_id,variables.titulaire_id);
                var automation=global.automation['40_aire_voyage_calcul_sejour'];
                logger('INFO',{msg:'maj_sejour_cloture',variablesrecues:variables},'maj_sejour_cloture');

                var ecritures=[];
                for (var e in variables.data.facture.ecritures){
                    if (variables.data.facture.ecritures[e].titulaire_id!=variables.titulaire_id
                        || variables.data.facture.titulaire_id!=variables.titulaire_id
                        || variables.data.sejour.titulaire_id!=variables.titulaire_id){
                        logger('ERROR',{msg:'probleme de sauvegarde de facture avec une ecriture.titulaire_id différent de la facture',variablesrecues:variables},'maj_sejour_cloture');

                    } else {
                        ecritures.push(variables.data.facture.ecritures[e]);
                    }
                }
                var vars={element:'sejour', data:variables.data.sejour,action:'save'};
                obj.app.core.majdb(vars,function(variabls,reponse){
                    var rep = JSON.stringify(reponse);

                    if (variables.data.facture.facture_num=='Fxxxxxxxx'){
                        global.req.numerotation.create_numero(function(num){
                            console.log('facture num',lpad(num,4));
                            var num= 'F'+global.req.moment().format('YYMM')+lpad(num,4);

                            savefacture(variables.data.facture,ecritures,res,num);

                        },'facture',global.req.moment().format('YYYYMM'));
                    } else {
                        savefacture(variables.data.facture,ecritures,res);
                    }
                });

                break;
			case 'getrecu_num':

							var rep=JSON.stringify({num:'Rxxxxxxxx'});
							res.writeHead(200,
									{'Content-Type': 'text/plain',
									 'Access-Control-Allow-Origin': '*'});
							res.end(rep);

				break;
			/*case 'getfacture_num':

				global.req.numerotation.create_numero(function(num){
						console.log('facture num',lpad(num,4));
						var cde_no= 'F'+global.req.moment().format('YYMM')+lpad(num,4);
						var rep=JSON.stringify({num:cde_no});
						res.writeHead(200,
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
						res.end(rep);

				},'facture',global.req.moment().format('YYYYMM'));
				break;*/
			case 'saverecu' :
				if (variables.data.recu_num=='Rxxxxxxxx'){
                    global.req.numerotation.create_numero(function(num){
                        console.log('recu num',lpad(num,4));
                        var num= 'R'+global.req.moment().format('YYMM')+lpad(num,4);
                        saveecriture(variables.data,res,num);
                    },'recu',global.req.moment().format('YYYYMM'));
				} else {
                    savefacture(variables.data,variables.data.ecritures,res);
				}

			  break;
			case 'savefacture':

				if (variables.data.facture_num=='Fxxxxxxxx'){
                    global.req.numerotation.create_numero(function(num){
                        console.log('facture num',lpad(num,4));
                        var num= 'F'+global.req.moment().format('YYMM')+lpad(num,4);

                        savefacture(variables.data,variables.data.ecritures,res,num);

                    },'facture',global.req.moment().format('YYYYMM'));
				} else {
                    savefacture(variables.data,variables.data.ecritures,res);
				}


			break;
            case 'getplans' :
                var sql='Select * from plan u;';
                var self=this
                global.obj.app.db.sqlorder(sql,
                    function(rows){
                        var rep = {};

                        rep=JSON.stringify(rows);
                        res.writeHead(200,
                            {'Content-Type': 'text/plain',
                                'Access-Control-Allow-Origin': '*'});
                        res.end(rep);
                    });
                break;
			
			/*********************/
			/*	case 'allconfig2':
					break;
				case 'allconfig':
					break;
				case 'checkconfig':
					break;
				case 'checketat':
					break;	*/	
			
			
		default:
			res.writeHead(404, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end("");
			break;
	}
};
var saveecriture=function(dataecriture,res,newrecunum){

        var vars={element:'compte_ecriture',
            data:dataecriture,action:'save'};
            if(newrecunum) {
		             vars.data.recu_num=newrecunum;
            }
        obj.app.core.majdb(vars,function(variabls,reponse){
            console.log(JSON.stringify(reponse));
            res.writeHead(200, {'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*'});
            res.write(JSON.stringify(reponse));
            res.end();
        }

        );

}


var savefacture=function(datafacture,dataecritures,res,newfacturenum){
    global.req.async.mapSeries(dataecritures,function(element,callbackbe){
        var vars={element:'compte_ecriture',
            data:element,action:'save'};
        if(newfacturenum) {
            if (Array.isArray(vars.data)){
                for (var i in vars.data){
                    vars.data[i].facture_num=newfacturenum;
				}
			} else {
                vars.data.facture_num=newfacturenum;
			}


        }
        if (vars.data.recu_num=='Rxxxxxxxx') {
          global.req.numerotation.create_numero(function(num){
              console.log('recu num',lpad(num,4));
              var num= 'R'+global.req.moment().format('YYMM')+lpad(num,4);
              vars.data.recu_num=num;
              obj.app.core.majdb(vars,function(){callbackbe()});

          },'recu',global.req.moment().format('YYYYMM'));
        } else {
           obj.app.core.majdb(vars,function(){callbackbe()});
        }

    },function(err){
        var vars={element:'facture',
            data:datafacture,action:'save'};
        if(newfacturenum) {
            vars.data.facture_num=newfacturenum;
        }
        obj.app.core.majdb(vars,function(variabls,reponse){
            console.log(JSON.stringify(reponse));
            res.writeHead(200, {'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*'});
            res.write(JSON.stringify(reponse));
            res.end();
        });
    });
};