$(document).on("pageshow","#Acces_Parametres_Page",function(){ // When entering pagetwo
	refreshinfosparams(true);
});
$(document).on("pagecreate","#Acces_Parametres_Page",function(){ // When entering pagetwo
	refreshinfosparams();
});

function ParamsRemoveLi(element,listname){
	element.parentElement.remove();
	$('#'+listname).listview('refresh');
}

function ParamsAddLi(typeparams,idparams,obj){
	switch (typeparams) {
	case 'params_dispolist':
		var jours=['Di','Lu','Ma','Me','Je','Ve','Sa'];
		if (obj) {
			
		} else {
			obj={dow:[],typeparams:typeparams,idparams:idparams};
			var elesjours=$('#params_'+idparams).find('#addhoraires').find('[id^="check"]');
			var elesstart=$('#params_'+idparams).find('#addhoraires').find('#start');
			var elesend=$('#params_'+idparams).find('#addhoraires').find('#end');
			obj.start=elesstart[0].value;
			obj.end=elesend[0].value;
			obj.text=obj.start+' -> '+obj.end + ' [ ';
			var sep='';
			for (var j=0;j<elesjours.length;j++){
				if(elesjours[j].checked){
					obj.dow.push(elesjours[j].value);
					obj.text+=sep+jours[elesjours[j].value];
					sep=', ';
				}
			}
			obj.text+=' ]';			
		}
		

		
		var html='<li id="params_horairedispo" jsondata=\''+JSON.stringify(obj)+'\'>'+
				'<a href="#">'+ obj.text +'</a>' +
				'<a href="#" onclick="ParamsRemoveLi(this,\''+typeparams+'\');return false" title="delete" class="ui-btn-icon-notext ui-icon-delete" style="border-color: #B3CB00" ></a></li>';
			
		$('#params_'+idparams).find('#params_dispolist').append(html);
		
		$('#params_'+idparams).find('#params_dispolist').listview('refresh');
		break;
	case 'params_tariflist':
		if (obj) {
			
		} else { 
			obj={typeparams:typeparams,idparams:idparams};
			var eletranche= $('#params_'+idparams).find('#addtarifs').find('#uniteheures');
			var eletarif=$('#params_'+idparams).find('#addtarifs').find('#tarif');
			obj.uniteheures=eletranche[0].value;
			obj.tarif=eletarif[0].value;
			obj.text=obj.tarif + ' Euros les '+obj.uniteheures+ ' Heures';
		}
		var html='<li id="params_tarif" jsondata=\''+JSON.stringify(obj)+'\'>'+
		'<a href="#">'+ obj.text +'</a>' +
		'<a href="#" onclick="ParamsRemoveLi(this,\''+typeparams+'\');return false" title="delete" class="ui-btn-icon-notext ui-icon-delete" style="border-color: #B3CB00" ></a></li>';
	
		$('#params_'+idparams).find('#params_tariflist').append(html);
		$('#params_'+idparams).find('#params_tariflist').listview('refresh');
		break;
	default:
		break;
	}
	
}
function sendparametres(){
	var params={};
	var test =$( "#Acces_Parametres_Page").find("#params").find('[id^="params_"]');
	var res=jsonParams(params,test);
	getJsonObject(function(){},'index.php?action=setparametres&v='+version,res);
}
function refreshinfosparams(withoutele){
	getJsonObject(function(data){get_info_params(data,withoutele);},'index.php?action=infosparametres&v='+version);
}
function get_info_params(data,withoutElement){

	if (data.tags && !withoutElement){
		for (var t in data.tags){
			var tag=data.tags[t];
			if (tag.parent_nom) {
				tag.nom=" - " +tag.parent_nom + " - " + tag.nom;
			} else {
				tag.nom=" - " + tag.nom;
			}
			
			add_params_sallehtml($( "#Acces_Parametres_Page").find("#params" ),tag);
			$("#Acces_Parametres_Page").trigger('create');
		}
	}
	if (data.parametres){
		$('#params').find(' UL').find('[id^="params_"]').remove();
		$('#params').find(' UL').listview('refresh');
		
		setvaluerecurcive($( "#Acces_Parametres_Page").find("#params" ),data.parametres);
	}
	if (!withoutElement){
		try {
			$( "#Acces_Parametres_Page").find("#params" ).accordion({
			       heightStyle: "content",
			 	   active: false,
				   collapsible: true  
			    });
			$( "#Acces_Parametres_Page").find(".parametres" ).accordion({
			       heightStyle: "content",
			 	   active: false,
				   collapsible: true  
			    });
		} catch (e) {}		
	}

	
	
}

function setvaluerecurcive(eleparent,objvalues){
	for (var o in objvalues){
		var eleset=eleparent.find('#'+o);
		if (eleset[0] && eleset[0].tagName=='INPUT') {
			$(eleset[0]).val(objvalues[o]);	
		} else if (eleset[0] && eleset[0].tagName=='UL'){
			$(eleset).find('[id^="params_"]').remove();
			for (var li in objvalues[o]){
				ParamsAddLi(objvalues[o][li].typeparams,objvalues[o][li].idparams,objvalues[o][li]);
			}
			
		} else if (eleset[0]){
			setvaluerecurcive(eleset,objvalues[o]);
		}
	}
}

function add_params_sallehtml(container,salleinfo){
	
	var html ='<h3>'+salleinfo.nom+'</h3>'+
		'<div id="params_'+salleinfo.id+'" class="sans_scroll">'+
		'	<div class="parametres" >'+
		'	  <h3>Horaires ouverture</h3>'+
		'	  <div class="sans_scroll">'+
		'	  		<div >'+
		'				<div id="addhoraires" style="display: inline-flex;">'+
		'				  	<p>De</p>'+
		'				    <div style="width: 100px;margin-right: 10px;margin-left: 10px;">'+
		'				     	<input type="time" name="heure_deb" id="start" class="custom" style="background-color:white">'+
		'				    </div>'+ 
		'				    <p>a</p> '+
		'				    <div style="width: 100px;margin-left: 10px;margin-right: 10px;">'+
		'				    	<input type="time" name="heure_fin" id="end" class="custom" style="background-color:white">'+
		'					</div>'+
		'					<p>Jours</p>'+
		'					<fieldset style="margin-right: 10px;margin-left: 10px;" name="jours'+salleinfo.id+'" data-role="controlgroup" data-type="horizontal">'+
		'					   <input type="checkbox" value="1" name="checkJour'+salleinfo.id+'" id="checkLu'+salleinfo.id+'" class="custom" />'+
		'					   <label for="checkLu'+salleinfo.id+'">L</label>'+
		'					   <input type="checkbox" value="2" name="checkJour'+salleinfo.id+'" id="checkMa'+salleinfo.id+'" class="custom" />'+
		'					   <label for="checkMa'+salleinfo.id+'">M</label>'+
		'					   <input type="checkbox" value="3" name="checkJour'+salleinfo.id+'" id="checkMe'+salleinfo.id+'" class="custom" />'+
		'					   <label for="checkMe'+salleinfo.id+'">M</label>'+
		'					   <input type="checkbox" value="4" name="checkJour'+salleinfo.id+'" id="checkJe'+salleinfo.id+'" class="custom" />'+
		'					   <label for="checkJe'+salleinfo.id+'">J</label>'+
		'					   <input type="checkbox" value="5" name="checkJour'+salleinfo.id+'" id="checkVe'+salleinfo.id+'" class="custom" />'+
		'					   <label for="checkVe'+salleinfo.id+'">V</label>'+
		'					   <input type="checkbox" value="6" name="checkJour'+salleinfo.id+'" id="checkSa'+salleinfo.id+'" class="custom" />'+
		'					   <label for="checkSa'+salleinfo.id+'">S</label>'+
		'					   <input type="checkbox" value="0" name="checkJour'+salleinfo.id+'" id="checkDi'+salleinfo.id+'" class="custom" />'+
		'					   <label for="checkDi'+salleinfo.id+'">D</label>'+
		'					</fieldset>'+
							
		'				 </div>'+
						 						 
		'			</div>'+	
		'			<div class="ui-bar ui-bar-b" style="border-width:0;padding:0px;background-color:transparent;border	-color:transparent">'+
		'				<ul id="params_dispolist" data-role="listview" data-filter="false" data-theme="c" data-inset="true" data-divider-theme="b" data-split-theme="b" data-split-icon="delete">'+
		'						<li style="margin:0px;border"data-role="list-divider" class="ui-accordion-header-active ui-state-active">Plages d\'ouverture</li>'+
		'					    <li ><a href="#" onclick="ParamsAddLi(\'params_dispolist\','+salleinfo.id+');return false;">Ajouter</a></li>'+
		'				</ul>'+
		'			</div>'+
		'	  </div>'+
		'	  <h3>Tarifs</h3>'+
		'	  <div class="sans_scroll">'+
		'	  	<div style="display: inline-flex;" id="addtarifs">'+	
		'		  	<p>Tarif </p>'+
		'		    <div style="width: 100px;margin-left: 10px;margin-right: 10px;">'+
		'		    	<input type="number" step="0.01" min="0" name="tarif" id="tarif" class="custom" style="background-color:white">'+
		'			</div>'+
		'			<p> Euro les </p>'+
		'			<div style="width: 100px;margin-right: 10px;margin-left: 10px;">'+
		'		     	<input type="number" step="0.25" min="0" name="uniteheures" id="uniteheures" class="custom" style="background-color:white">'+
		'		    </div>'+ 
		'		    <p>heures</p>'+ 
		'		</div>'+
		'		<div style="display: block;">'+
		'			<div class="ui-bar ui-bar-b" style="border-width:0;padding:0px;background-color:transparent;border	-color:transparent">'+
		'				<ul id="params_tariflist" data-role="listview" data-filter="false" data-theme="c" data-inset="true" data-divider-theme="b" data-split-theme="b" data-split-icon="delete">'+
		'						<li style="margin:0px;border"data-role="list-divider" class="ui-accordion-header-active ui-state-active">Tarifs par tranche</li>'+
		'					    <li ><a href="#" onclick="ParamsAddLi(\'params_tariflist\','+salleinfo.id+');return false;">Ajouter</a></li>'+
		'				</ul>'+
		'			</div>'+
		'		</div>'+
		'	    <div style="display: inline-flex;">	'+
		'		  	<p>Forfait semaine à </p>'+
		'		    <div style="width: 100px;margin-right: 10px;margin-left: 10px;">'+
		'		     	<input type="number" step="0.01" min="0" name="forfaitsemaine" id="params_forfaitsemaine" class="custom" style="background-color:white">'+
		'		    </div>'+ 
		'		    <p> euros</p>'+
		'		</div>'+
		'       <div style="display: block;"></div>'+
		'	    <div style="display: inline-flex;">	'+
		'		  	<p>Forfait mois à </p>'+
		'		    <div style="width: 100px;margin-right: 10px;margin-left: 10px;">'+
		'		     	<input type="number" step="0.01" min="0" name="forfaitmois" id="params_forfaitmois" class="custom" style="background-color:white">'+
		'		    </div>'+ 
		'		    <p> euros</p>'+
		'		</div>'+
	/*	'		<div style="display: inline-flex;">'+	
		'		    <p>Minimum facture par reservation</p>'+ 
		'		    <div style="width: 100px;margin-left: 10px;margin-right: 10px;">'+
		'		    	<input type="number" step="0.01" min="0" name="minfactresa" id="params_minfactresa" class="custom" style="background-color:white">'+
		'			</div>'+
		'			<p> Euro</p>'+ 
		'		</div>'+
		'		<div style="display: block;"></div>'+
		'	   	<div style="display: inline-flex;">'+	
		'		  	<p>Minimum facture par commande </p>'+
		'		    <div style="width: 100px;margin-right: 10px;margin-left: 10px;">'+
		'		     	<input type="number" step="0.01" min="0" name="minfactcde" id="params_minfactcde" class="custom" style="background-color:white">'+
		'		    </div>'+ 
		'		    <p> Euro</p>'+
		'		</div>'+*/
				

		'	  </div>'+
		'	  <h3>Parametres</h3>'+
		'	  <div class="sans_scroll">'+
		'	    <div style="display: inline-flex;">	'+
		'		  	<p>Nombre de place maxi </p>'+
		'		    <div style="width: 100px;margin-right: 10px;margin-left: 10px;">'+
		'		     	<input type="number" step="1" min="0" name="nbplaces" id="params_nbplaces" class="custom" style="background-color:white">'+
		'		    </div>'+ 
		'		    <p> places</p>'+
		'		</div>'+
		'	  </div>'+
		'	</div>'+	  
		'</div>';
		
		
		
	container.append(html);
		
		
	
	
}


function jsonParams(jsonobj,elementsselected,levelname){
	if (!levelname) levelname='params';
	var niv;
	for (var e=0 ;e<elementsselected.length;e++) {
		
		var par='params';
		var tagname='div';
		if (elementsselected[e].parentElement) {
			var elepar =elementsselected[e].parentElement.closest('[id^="params_"]');
			if (elepar && elepar.id){
				par=elepar.id;
				tagname=elepar.tagName;
				
			}
		}
		
		if (levelname==par){
			console.log(par,tagname,elementsselected[e].id)
			if (!niv && tagname!='UL') {
				niv={};
			} else if (!niv) {
				niv=[];
			}
			var nivinf=jsonParams(niv,$(elementsselected[e]).find('[id^="params_"]'),elementsselected[e].id);
			if (tagname=='UL' && !nivinf && elementsselected[e].attributes.jsondata) {
				nivinf=JSON.parse(elementsselected[e].attributes.jsondata.value)
				nivinf.id=elementsselected[e].id;
			} else if (!nivinf){
				nivinf=elementsselected[e].value;
			}
			if (tagname!='UL' ) {
				niv[elementsselected[e].id]=nivinf;
			} else {
				niv.push(nivinf);
			} 
			
						
		} 
		
	}
	return niv;
}
