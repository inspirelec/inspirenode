

$(document).on("pagecreate","#periphpage",function(){ // When entering pagetwo
	  //alert('test create call');
	  //displayWaitPeriph();
		$('#titre').html(tagclicked_nom);
		displayPeriphInLists('#periphpage','#PeriphList1','#PeriphList2','#PeriphList3','#PeriphManuel',null,tagclicked_uuid,'b');
		
	});

$(document).on("pageshow","#periphpage",function(){ // When entering pagetwo
		//h=history;
	  //history.pushState({id : 'periphpage'}, 'periphpage', "#periphpage");
	//$(page).trigger('create');
	  //EntetePageTaille(page);
	  $("#periphpage").trigger('pagecreate');
	  //diplayHighchartBatiment(tagclicked_uuid);
	  
	});
$(document).on("swiperight","#periphpage",function(){ // When entering pagetwo
	parent.history.back();
});

$(document).on("pagecreate","#periphpage2",function(){ // When entering pagetwo
	  //alert('test create call');
	  //displayWaitPeriph();
		$('#titre').html(tagclicked_nom);
		displayPeriphInLists('#periphpage2','#PeriphList12','#PeriphList22','#PeriphList32','#PeriphManuel2',null,tagclicked_uuid,'c');
		
	});

$(document).on("pageshow","#periphpage2",function(){ // When entering pagetwo
		//alert($("#periphpage2").attr("href"));
	  //history.pushState({id : 'periphpage2'}, 'periphpage2', "#periphpage2");
	  	//h=history;

	  $("#periphpage2").trigger('pagecreate');
	  
	});
$(document).on("swiperight","#periphpage2",function(){ // When entering pagetwo
	parent.history.back();
});

$(document).on("pagecreate","#periphpage3",function(){ // When entering pagetwo
	  //alert('test create call');
	  //displayWaitPeriph();
		$('#titre').html(tagclicked_nom);
		displayPeriphInLists('#periphpage3','#PeriphList13','#PeriphList23','#PeriphList33','#PeriphManuel3',null,tagclicked_uuid,'d');
		
	});

$(document).on("pageshow","#periphpage3",function(){ // When entering pagetwo
			//h=history;
		//history.pushState({id : 'periphpage3'}, 'periphpage3', "#periphpage3");
	  $("#periphpage3").trigger('pagecreate');
	  
	});
$(document).on("swiperight","#periphpage3",function(){ // When entering pagetwo
	parent.history.back();
});


function displayPeriphInLists(page,listviewname1,listviewname2,listviewname3,listviewmanuel,tagname,taguuid,prefixedid){
	 if($('#periphpage2').length == 0){
 	 var newPage=$("#periphpage").clone();
 	      newPage.prop('id', 'periphpage2');
        newPage.find('#entete').prop('id', 'entete2');
        newPage.find('#content').prop('id', 'content2');
        newPage.find('#PeriphList1').prop('id', 'PeriphList12');
        newPage.find('#PeriphList2').prop('id', 'PeriphList22');
        newPage.find('#PeriphList3').prop('id', 'PeriphList32');
        newPage.find('#PeriphManuel').prop('id', 'PeriphManuel2');
        newPage.appendTo($.mobile.pageContainer); 
 		}
 	if($('#periphpage3').length == 0){
 	 var newPage=$("#periphpage").clone();
 	      newPage.prop('id', 'periphpage3');
        newPage.find('#entete').prop('id', 'entete3');
        newPage.find('#content').prop('id', 'content3');
        newPage.find('#PeriphList1').prop('id', 'PeriphList13');
        newPage.find('#PeriphList2').prop('id', 'PeriphList23');
        newPage.find('#PeriphList3').prop('id', 'PeriphList33');
        newPage.find('#PeriphManuel').prop('id', 'PeriphManuel3');
        newPage.appendTo($.mobile.pageContainer); 
 		}
	$(listviewname1+' li').remove();
	$(listviewname2+' li').remove();
	$(listviewname3+' li').remove();
	$(listviewmanuel+' li').remove();
	$(listviewname3).append('<li data-icon="false"><h4 align="center">Chargement ...</h4></li>');
	//$('#acceuilPeriphList2').append('<li data-icon="false"><input onClick="$("#acceuilPage").trigger("pagecreate");return false;" id="reload" type="button" data-mini="true" value="Recharger" ></li>'		);
	$(listviewname1).listview('refresh');
	$(listviewname2).listview('refresh');
	$(listviewname3).listview('refresh');
	$(listviewmanuel).listview('refresh');

	if (tagname!=null) {
		getPeriphsByTagName(
							function(data){
								/*mise de cote des peripheriques charg�s*/
								$.each(data, function(index, periph) {
									peripheriques[periph.uuid]=periph;
								});
								getModes(chargemodes);
								displayPeriphs(data,page,listviewname1,listviewname2,listviewname3,listviewmanuel,tagname,null,prefixedid);
							}
		                    ,tagname);
	} else {
		getPeriphsByTagUuid(
							function(data){
								/*mise de cote des peripheriques charg�s*/
								$.each(data, function(index, periph) {
									peripheriques[periph.uuid]=periph;
								});
								getModes(chargemodes);
								//getTagsEnfant(chargeTagsEnfant,taguuid);
								displayPeriphs(data,page,listviewname1,listviewname2,listviewname3,listviewmanuel,null,taguuid,prefixedid);}
		                    ,taguuid);
		            
	}
	
	
};
function chargemodes(data){
	$.each(data.modes, function(index, mode) {
		modes[index]=mode;
	});
}

function chargeTagsEnfant(data){
	//$.each(data.tags, function(index, tag) {
		//l=1;//modes[index]=mode;
	//});
	//tagsenfants=data.tags;
	
}

function displayPeriphs(periphs,page,listviewname1,listviewname2,listviewname3,listviewmanuel,tagname,taguuid,prefixedid) {

	$(listviewname1+' li').remove();
	$(listviewname2+' li').remove();
	$(listviewname3+' li').remove();
	$(listviewmanuel+' li').remove();
	

	var countplace=0;
	var arrayslider = {};
	cotegauche=false;
	cotedroite=false;
	$.each(periphs, function(index, periph) {
		if (index!='tags') {
			if (periph.ecriture_type=='TEMPERATURE' || periph.ecriture_type=='TEMPERATURECONSIGNE'
				|| periph.ecriture_type=='PLAYER' || periph.ecriture_type=='ALARME') {
				cotegauche=true;
			} else {
				cotedroite=true;
			}
		}

	});
	if (page=='#periphpage' && config.with_graphique_on_tag_page==true){
		
		cotegauche=true;
		htmlperiph=	 '<li  data-icon="false">';
		htmlperiph+= '<div id="containerG1"></div><div id="containerG2"></div>'+'</li>';
		$(listviewname1).append($(htmlperiph));
		
		htmlperiph=	 '<li  data-icon="false">';
		htmlperiph+= '<div id="containerD1"></div><div id="containerD2"></div>'+'</li>';
		$(listviewname2).append($(htmlperiph));
	}	
	tagsenfants=periphs.tags;
	nbtags=constructviewtags(tagsenfants,listviewname1,listviewname2,true);
	
	havebatterie=false;
	htmlbatterie="";
	havealarme=false;
	htmlalarme="";
	

	
	$.each(periphs, function(index, periph) {
		var coloricon_suffixe="";
		if (periph.categorie && periph.categorie.couleur_text && periph.categorie.couleur_text=='noir') coloricon_suffixe='_n';
		if (index!='tags') {
			var htmlperiph="";
			//if (periph.ecriture_type=="BINAIRE"){
			var nomtags="";
			if (tagname=="Acceuil"){
				$.each(periph.tags, function(index, tag) {
					if (tag.nom!=tagname){
						nomtags+=tag.nom+"</br>";
					}
				});			
			}
			//alert("periph "+periph.nom);
			var codetraduc="";
			if (periph.codei18n && traductionactive) codetraduc=' data-i18n="'+periph.codei18n+'" ';
	
			htmlperiph='<li  data-icon="false">'+
							'<a href="#" id="'+prefixedid+periph.uuid+'" obj="princ"';
									if (periph.ecriture_type!="SANS") 	
										htmlperiph+='" onclick="changeEtat(this,-2,\''+periph.categorie.iconMin+'\',\''+periph.categorie.iconMax+'\',\''+periph.categorie.iconMidle+'\',false);return false;"';
			htmlperiph+=    	'><div><div><p style = "float:left;">'+
						        	'<img id="icon" src="'+imagesURL+periph.categorie.iconMin+'" height="50" width="50"/>'+
						        '</p></div>'+
						        
								'<div style="display: inline-block;"><h4 id="nom" '+codetraduc+'>'+periph.nom+'</h4>'+
								'<h6 id="tags" style="font-size: 12px">'+nomtags+'</h6>'+
								//'<h6 id="etat" style="font-size: 12px"></h6>'+
								'<h6 id="expr1" style="font-size: 12px"></h6>'+
								'<h6 id="expr2" style="font-size: 12px"></h6>'+
								'<h6 id="expr3" style="font-size: 12px"></h6>'+
								
								'</div></div>'+
								//<h5 id="uuid"></h5>'+
							'</a>'+
						'</li>'
							
			if (periph.ecriture_type=='BATTERIE'){
				if (htmlbatterie=="") {
					htmlbatterie='<li  data-icon="false" class="ui-btn" obj="princ">'+
					'<div  id="batterietag" >'+
						'<div><p style = "float:left;">'+
					        	'<img id="icon" src="'+imagesURL+periph.categorie.iconMin+'" height="50" width="50"/>'+
					        '</p></div>'
					    '<div style="display: inline-block;">';
		    				//'<h4 id="nom">'+periph.nom+'</h4>'+
							//'<h6 id="tags">'+nomtags+'</h6>'+
		    				//'<h6 id="" style="font-size: 12px">'+nomtags+'</h6>';
				}
				
				htmlperiph="";
				havebatterie=true;
				htmlbatterie+='<h6 id="'+prefixedid+periph.uuid+'" style="font-size: 12px">'+periph.nom+/*' = <h7 id="etat">100</h7><h7">%</h7>*/'</h6>';
			}
			if (periph.ecriture_type=="ALARME") {
				alarmes[periph.uuid]=periph;
				if (htmlalarme=="") {
					htmlalarme='<li  data-icon="false" >'+
					'<a obj="princ" href="#"  id="alarmetag"  onclick="changeAlarme(\'alarmepopupMenu'+prefixedid+'\',-1,\''+periph.categorie.iconMin+'\',\''+periph.categorie.iconMax+'\',\''+periph.categorie.iconMidle+'\',false);return false;">'+
						'<div><p style = "float:left;">'+
					        	'<img id="icon" src="'+imagesURL+periph.categorie.iconMin+'" height="50" width="50"/>'+
					        '</p></div>'
					    '<div style="display: inline-block;">  <h4 id="nom">Alarme</h4>';
		    				//'<h4 id="nom">'+periph.nom+'</h4>'+
							//'<h6 id="tags">'+nomtags+'</h6>'+
		    				//'<h6 id="" style="font-size: 12px">'+nomtags+'</h6>';
				}
				
				htmlperiph="";
				havealarme=true;
				htmlalarme+='<h6 id="'+prefixedid+periph.uuid+'" style="font-size: 12px">'+periph.nom+' = <h7 id="etat"></h7><h7 id="pause"></h7></h6>';
	
				/*htmlperiph='<li  data-icon="false">'+
								'<a href="#" id="'+prefixedid+periph.uuid+'" ';
										
				htmlperiph+='" onclick="changeAlarme(this,-1,\''+periph.categorie.iconMin+'\',\''+periph.categorie.iconMax+'\',\''+periph.categorie.iconMidle+'\',false);return false;"';
				htmlperiph+=    	'><div><div><p style = "float:left;">'+
							        	'<img id="icon" src="'+serviceURL+periph.categorie.iconMin+'" height="50" width="50"/>'+
							        '</p></div>'+
							        
									'<div style="display: inline-block;"><h4 id="nom">'+periph.nom+'</h4>'+
									//'<h6 id="tags" style="font-size: 12px">'+nomtags+'</h6>'+
									'<h6 id="etat" style="font-size: 12px"></h6>'+
									'<h6 id="expr1" style="font-size: 12px"></h6>'+
									'<h6 id="expr2" style="font-size: 12px"></h6>'+
									'<h6 id="expr3" style="font-size: 12px"></h6>'+
									
									'</div></div>'+
									//<h5 id="uuid"></h5>'+
								'</a>'+
							'</li>'*/
			}			
				
			if (periph.ecriture_type=="VOLETR" || periph.ecriture_type=="VOLETRVARIABLE"){
				
				
				
				htmlperiph='<li  data-icon="false" class="ui-btn" obj="princ">'+
				'<div  id="'+prefixedid+periph.uuid+'">'+
			    	'<div><p style = "float:left;">'+
			        	'<img id="icon" src="'+imagesURL+periph.categorie.iconMin+'" height="40" width="40"/>'+
				        '</p>'+
				    '<div >'+
						'<label><h4 id="nom"'+codetraduc+'>'+periph.nom+'</h4>'+
					/*		'<h6 id="tags">'+nomtags+'</h6>'+
							'<h6 id="expr1"></h6>'+
							'<h6 id="expr2"></h6>'+
							'<h6 id="expr3"></h6>'+*/
						'</label>'+
						'<h6 id="tags" style="font-size: 12px">'+nomtags+'</h6>'+
						'<div class="ui-grid-b" >'+
						'<div class="ui-block-a"><div>'+
							'<a href="#" id="up" onclick="changeEtatVolet(\'#'+prefixedid+periph.uuid+'\',\'UP\',false);return false;">'+
							'<p style="text-align:center"><img id="iconup" align="middle" src="'+imagesURL+'images/up'+coloricon_suffixe+'.png'+'" height="25" width="25"/></p>'+
						'</a></div></div>'+
						
						'<div class="ui-block-b"><div>'+
							'<a href="#" id="stop" onclick="changeEtatVolet(\'#'+prefixedid+periph.uuid+'\',\'STOP\',false);return false;">'+
							'<p style="text-align:center"><img id="iconstop" align="middle" src="'+imagesURL+'images/stop'+coloricon_suffixe+'.png'+'" height="25" width="25"/></p>'+
						'</a></div></div>'+
						
						'<div class="ui-block-c"><div>'+
							'<a href="#" id="down" onclick="changeEtatVolet(\'#'+prefixedid+periph.uuid+'\',\'DOWN\',false);return false;">'+
							'<p style="text-align:center"><img id="icondown" align="middle" src="'+imagesURL+'images/down'+coloricon_suffixe+'.png'+'" height="25" width="25"/></p>'+
						'</a></div></div></div>'+
						
					'</div></div>'+
					//<h5 id="uuid"></h5>'+
				'</div>'+
			'</li>'
			}
			
			if (periph.ecriture_type=="PLAYER" ){
				htmlperiph='<li  data-icon="false" class="ui-btn" obj="princ">'+
				'<div  id="'+prefixedid+periph.uuid+'">'+
			    	'<label>'+
			    			//'<h4 id="nom">'+periph.nom+'</h4>'+
							//'<h6 id="tags">'+nomtags+'</h6>'+
			    			'<h6 id="tags" style="font-size: 12px">'+nomtags+'</h6>'+
			    			'<h6 id="expr2" style="font-size: 12px"></h6>'+
			    			//'<h6 id="expr1_unit" style="font-size: 12px"></h6>'+
							'<h6 id="expr3" style="font-size: 12px"></h6>'+
						'</label>'+
						'<div class="ui-grid-b" >'+
						'<div class="ui-block-a"><div>'+
							'<a href="#"  id="up" onclick="changeEtatPlayer(\'#'+prefixedid+periph.uuid+'\',\'DOWN\',false);return false;">'+
							'<p style="text-align:center"><img id="iconprev" align="middle" src="'+imagesURL+'images/previous'+coloricon_suffixe+'.png'+'" height="25" width="25"/></p>'+
						'</a></div></div>'+
						
						'<div class="ui-block-b"><div>'+
							'<a href="#"  id="stop" onclick="changeEtatPlayer(\'#'+prefixedid+periph.uuid+'\',\'ONOFF\',false);return false;">'+
							'<p style="text-align:center"><img id="iconplay" align="middle" src="'+imagesURL+'images/play'+coloricon_suffixe+'.png'+'" height="25" width="25"/></p>'+
						'</a></div></div>'+
						/*class="ui-btn"*/
						'<div class="ui-block-c"><div>'+
							'<a href="#"  id="down" onclick="changeEtatPlayer(\'#'+prefixedid+periph.uuid+'\',\'UP\',false);return false;">'+
							'<p style="text-align:center"><img id="iconnext" align="middle" src="'+imagesURL+'images/next'+coloricon_suffixe+'.png'+'" height="25" width="25"/></p>'+
						'</a></div></div></div>'+
					
					'</div>'+
					//<h5 id="uuid"></h5>'+
				''+
			'</li>'
			}
			
			if (periph.ecriture_type=="TEMPERATURECONSIGNE" || periph.ecriture_type=="TEMPERATURE" ){
				htmlperiph='<li  data-icon="false" class="ui-btn" obj="princ">'+
				
				'<div  id="'+prefixedid+periph.uuid+'" >'+
			    	''+
			    	//'<a href="#" id="'+prefixedid+periph.uuid+'" >'+
						'<div class="ui-grid-a" >'+
							'<div class="ui-block-a" id="gauche"><div>'+
								'<h6 style="font-size: 18px" id="expr1"></h6>'+
							'</div>'+					
							'</div>'+
							
							'<div class="ui-block-b" id="centre"><div>'+
								'<h6 align="right" style="font-size: 12px" id="expr2"></h6>'+
								'<h6 align="right" style="font-size: 12px" id="expr3"></h6>'+
							'</div></div>'+
						'</div>'+
						'<h6 id="tags" style="font-size: 12px;margin 0.1em">'+periph.nom/*nomtags*/+'</h6>';
					//'</a>';
						if (periph.ecriture_type=="TEMPERATURECONSIGNE" ){
							htmlperiph+='<div class="ui-grid-b" >'+
								'<div class="ui-block-a" id="gauche"><div>'+
									'<a href="#"  id="up" onclick="changeEtatConsigne(\'#'+prefixedid+periph.uuid+'\',\'down\',false);return false;">'+
									'<p style="text-align:center"><img id="iconmoins" align="middle" src="'+imagesURL+'images/moins'+coloricon_suffixe+'.png'+'" height="25" width="25"/></p>'+
								'</a></div></div>'+
								
								'<div class="ui-block-b" id="centre"><div style="vertical-align:middle;">'+
									'<h6 id="etat" align="center" style="vertical-align:middle;margin-top: 10px;"></h6>'+
								'</div></div>'+
								
								'<div class="ui-block-c id="droite"><div>'+
									
									'<a href="#"  id="down" onclick="changeEtatConsigne(\'#'+prefixedid+periph.uuid+'\',\'up\',false);return false;">'+
									'<p style="text-align:center"><img id="iconplus" align="middle" src="'+imagesURL+'images/plus'+coloricon_suffixe+'.png'+'" height="25" width="25"/></p>'+
									'</a></div></div>'+
							
							'</div>';						
						}
	
						htmlperiph+='<div class="ui-grid-a" >'+
							/*'<div class="ui-block-a" id="basgauche"><div>'+
							''+
							'</div></div>'+*/
							'<div class="ui-block-a" id="bascentre">'+
							'<a href="#"  style="text-align:center;font-size: 12px;text-decoration: none" id="modebtn" onclick="popupmenumode(\''+prefixedid+'\',\''+periph.uuid+'\');return false;"><div>'+
							'<label><h1 id="mode" style="text-align:center;"></h1></label>'+
							'</div></a></div>'+
							
							'<div class="ui-block-b" id="basdroite">'+
							'<a href="#"  style="text-align:center;font-size: 12px;text-decoration: none" id="auto_manuel" onclick="changeEtatType();return false;"><div >'+
							'<label><h1 id="auto_manueltext" style="text-align:center;"><u>Auto</u>\/Manuel</h1></label>'+
							'</div></a></div>'+
							
							'</div>';
					//<h5 id="uuid"></h5>'+
				'</div>'+
			'</li>'
			}
			
			if (periph.categorie.type=="camera"){
				cameraURL=serviceURL+'index.php?type=piping&action=video&uuid='+periph.uuid;
				cameraUUID=periph.uuid;
				htmlperiph='<li  data-icon="false">'+
					'<a href="#camerapage" id="'+prefixedid+periph.uuid+'" obj="princ" style="padding:0">'+
						//'<label><h4 id="nom" >'+periph.nom+'</h4></label>'+
						//'<h6 id="tags" style="font-size: 12px">'+nomtags+'</h6>'+
				    	//'<div><p>'+
				    		
				        	'<div><img id="cam" src_old="'+cameraURL+'" src="'+cameraURL+"&time="+ new Date().getTime()+'" style="width:100%;max-height:100%"/></div>'+
				        //'</p><div>'+
	
					'</a>'+
				'</li>'
				$(document).on("pagehide",page,function(){
					var idcam=prefixedid+periph.uuid;
					var camurl=cameraURL;
					$(page).find('#'+idcam).find('#cam').attr('src',"vide");
					alert($(page).find('#'+idcam).find('#cam').attr('src'));
				});
				$(document).on("pageshow",page,function(){
					var idcam=prefixedid+periph.uuid;
					var camurl=cameraURL;
					
					if ($(page).find('#cam').attr('src')=="vide" || $(page).find('#cam').attr('src')=="") {
						$(page).find('#cam').attr('src',$("#periphpage").find('#cam').attr('src_old')+"&time="+ new Date().getTime());
						alert(page);
					}
					
				});
			}	
	
	
			var jqueryhtmlperiph =$(htmlperiph);
			
			if (periph.ecriture_type=="BINVAR" || periph.ecriture_type=="VOLETRVARIABLE" || periph.ecriture_type=="PLAYER") {
				var slider=$('<a href="#"><input style="float:bottom" id="slider" type="range" min="'+periph.ecriture_min_value+'" max="'+periph.ecriture_max_value+'" step="10" value="0" data-mini="false"  data-highlight="true"></a>');
				arrayslider[index]= slider;
			}
			
			jqueryhtmlperiph.children('#'+prefixedid+periph.uuid).append(slider);
			if (listviewname1==listviewname2 && listviewname2==listviewname3) {
				$(listviewname1).append(jqueryhtmlperiph)
				$(listviewname1).parent().show();
			} else if ((nbtags>0 || cotegauche) && periph.visibleifmanuel!='O'){
				if (periph.ecriture_type=='TEMPERATURE' || periph.ecriture_type=='TEMPERATURECONSIGNE' || periph.ecriture_type=='ALARME'
					|| periph.ecriture_type=='INFOS' || periph.ecriture_type=='PLAYER'/*countplace%2==0*/) {
					$(listviewname1).parent().show();
					$(listviewname1).append(jqueryhtmlperiph);	
					countplace++;
					//alert('append'+periph.nom);
					$(listviewname3).parent().hide();
				} else {
					$(listviewname2).parent().show();
					$(listviewname2).append(jqueryhtmlperiph);	
					countplace++;
					//alert('append'+periph.nom);
					$(listviewname3).parent().hide();
				}
			} else if(periph.visibleifmanuel!='O'){
				$(listviewname3).parent().show();
				$(listviewname3).append(jqueryhtmlperiph);	
				countplace++;
				$(listviewname1).parent().hide();
				$(listviewname2).parent().hide();
				
			} else if(periph.visibleifmanuel=='O') {
				$(listviewmanuel).parent().show();
				$(listviewmanuel).append(jqueryhtmlperiph);	
				countplace++;
			}
	
			
			//alert("fin periph");
		}
	});
	
	


	if (havealarme){
			htmlalarme+=		'</div>'+
			'</a>'+
		'</li>';			
		var jqueryhtmlalarme =$(htmlalarme);
		if (cotegauche && cotedroite) {
			$(listviewname1).parent().show();
			$(listviewname1).append(jqueryhtmlalarme);			
		} else {
			$(listviewname3).parent().show();
			$(listviewname3).append(jqueryhtmlalarme);	
		}
	}
		
	if (havebatterie){
			htmlbatterie+=		'</div>'+
			'</div>'+
		'</li>';			
		var jqueryhtmlbatterie =$(htmlbatterie);
		if (cotegauche && cotedroite) {
			$(listviewname1).parent().show();
			$(listviewname1).append(jqueryhtmlbatterie);				
		} else {
			$(listviewname3).parent().show();
			$(listviewname3).append(jqueryhtmlbatterie);	
		}
		

	}
	if (listviewmanuel) {
		$(listviewmanuel+" li").hide(); 
	}
	
	
	
	$(listviewname1).listview('refresh');
	$(listviewname2).listview('refresh');
	$(listviewname3).listview('refresh');
	$(listviewmanuel).listview('refresh');
	
	EntetePageTaille(page);
	//EntetePageTaille(page);
	$(page).trigger('create');
	//EntetePageTaille();
	$(".ui-slider-input").hide();
	$(listviewname1).css('margin-right','-21px');
	$(listviewname2).css('margin-left','-21px');
	$(listviewmanuel).css('margin-right','-21px');
	$(listviewmanuel).css('margin-top','27px');
	$(listviewname1).parent().css('margin-top','10px')
	$(listviewname2).parent().css('margin-top','10px')
	$(listviewname3).parent().css('margin-top','10px')
$(page).trigger('create');
	EntetePageTaille(page);
	
	$.each(periphs, function(index, periph) {
		
		if (periph.categorie && periph.categorie.couleur_fond && periph.ecriture_type) {
			//$("#"+prefixedid+periph.uuid).closest( " [obj='princ']" ).css('background','linear-gradient(to right bottom,'+periph.categorie.couleur_fond+', white)');
			$("#"+prefixedid+periph.uuid).closest( " [obj='princ']" ).css('background',periph.categorie.couleur_fond);
			$("#"+prefixedid+periph.uuid).closest( " [obj='princ']" ).css('border-width','0');
		}
		if (periph.categorie && periph.categorie.couleur_text) {
			var colortext='#003449';
			if (periph.categorie.couleur_text=='blanc') colortext='#ffffff';
			$("#"+prefixedid+periph.uuid).closest( " [obj='princ']" ).css('color',colortext);
			$("#"+prefixedid+periph.uuid).find( "#auto_manueltext" ).css('color',colortext);
			$("#"+prefixedid+periph.uuid).find( "#mode" ).css('color',colortext);
			$("#"+prefixedid+periph.uuid).closest( " [obj='princ']" ).css('text-shadow','0 /*{c-bhover-shadow-x};0px/*{c-bhover-shadow-y}*/0/*{c-bhover-shadow-radius}*/#000000/*{c-bhover-shadow-color}*/');
		}
		$("#"+prefixedid+periph.uuid).closest( " [obj='princ'] > li h6" ).css('margin','0');

		if (periph.ecriture_type=='TEMPERATURE' || periph.ecriture_type=='TEMPERATURECONSIGNE'){
			$("#"+prefixedid+periph.uuid).closest( " [obj='princ']" ).css('padding','2%');

		}
		DisplayUpdatedEtat(periph,lastetat[periph.uuid],null,lastetat['mode'],lastetat['type']);
		$("#"+prefixedid+periph.uuid).on( "taphold", function(event){
				if (periph.ecriture_type=='ALARME') {
					popupalarme(prefixedid,periph.uuid);
				} else if (periph.ecriture_type!='BATTERIE'){
					popupmenuacceuil(prefixedid,periph.uuid);
				}
				
			} );
		
	});
	
	$.each(arrayslider, function(index, slidermort) {
			var periph=periphs[index];
			var slider=$("#"+prefixedid+periph.uuid).find("#slider");
			slider.hide();
			//alert(index+'='+prefixedid+periph.uuid);
			slider.on('slidestop',function(event,ui) {
			    sVal = slider.val();
			    changeEtatVariable($('#'+prefixedid+periph.uuid),sVal,periph.categorie.iconMin,periph.categorie.iconMax,periph.categorie.iconMidle,false)
			});
	});
	
	if (page=='#periphpage' && config.with_graphique_on_tag_page==true){
		setTimeout(function (){diplayHighchartBatiment(page,tagclicked_uuid);},100);
	}
	//renderhighchart('#batterietag');
	//alert("fin");

		   
   };

