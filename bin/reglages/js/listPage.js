/**
 * New node file
 */
 
var recharge_detail=true;

$(document).on("pageshow","#listPage",function(){ // When entering pagetwo
	
	$("#listPage").find("#container li").remove();
	getJsonObject(function(err,httpResponse,body){
		var objs=(body.responseJSON);
		//objs.sort(function(a,b){return -a.categorie.id+b.categorie.id})
		var list=$("#listPage").find("#container");
		var titre=$("#listPage").find("#titre");
		titre.html("Reglages "+type_element_encours);
		for (i in objs) {
			var functionOnclick='onclick="chargeDetail(this,\''+type_element_encours+'\',\''+ objs[i].id+'\');return false;"';
			switch (type_element_encours) {
			case 'box':
				var box = objs[i];
				list.append('<li><a href="#" '+functionOnclick +' class="ui-btn"><div style="font-size: 16px">('+box.id+') '+box.nom+'  </div><div style="font-size: 11px"> model :'+box.model+'   </br> ip : '+box.ip+' </br>    uuid : '+box.uuid+' </div> </a>');
				break;
			case 'automation':
				var automation = objs[i];
				var html='<li><a href="#" '+functionOnclick +' class="ui-btn">';
				html+='<div style="font-size: 16px">('+automation.id+') '+automation.nom+'  </div>';
				/*info*/
				html+='<div class="ui-grid-b" >';
					html+='<div class="ui-block-a">';
					html+='</div>';
				
					html+='<div class="ui-block-b">';
					html+='    <div class="ui-btn ui-btn-b" style="font-size: 10px;text-align:left">';
					html+='Etat : '+automation.etat;
					html+='</br> Last run : '+automation.lastrun;
				    html+='</br> Source : '+automation.source;
					html+='    </div>';
					html+='</div>';

					html+='<div class="ui-block-c">';
					html+='</div>';
				html+='</div>';

				/*etat*/
				
				html+='</a></li>';
				list.append(html);
				break;	
			case 'peripherique':
			case 'peripheriquedeporte':
			case 'peripheriquebatterie':	
				var periph = objs[i];
				var html='<li><a href="#" '+functionOnclick +' class="ui-btn">';
				html+='<div style="font-size: 16px">('+periph.id+') '+periph.nom+'  </div>';
				/*info*/
				html+='<div class="ui-grid-b" >';
					html+='<div class="ui-block-a">';
					html+='	<div class="ui-btn ui-btn-b" style="font-size: 10px;text-align:left">';
					for (t in periph.tag){
						html+=periph.tag[t].nom+"</br>";
					}
					html+='    </div>';
					html+='</div>';
				
					html+='<div class="ui-block-b">';
					html+='    <div class="ui-btn ui-btn-b" style="font-size: 10px;text-align:left">';
					if (periph.box) {html+='box : '+periph.box.nom;}
					html+='</br> box_identifiant :'+periph.box_identifiant;
					html+='</br> box_type : '+periph.box_type;
					html+='</br> box_protocole : '+periph.box_protocole;
					if (periph.categorie) {html+='</br> cat�gorie : '+periph.categorie.nom;}
					html+='    </div>';
					html+='</div>';

					html+='<div class="ui-block-c">';
					html+='	<div class="ui-btn ui-btn-b" style="font-size: 10px;text-align:left">';
					html+='<pre>'+JSON.stringify(periph.last_etat, null, '\t')+'</pre>';
					/*for (t in periph.last_etat){
						if (periph.last_etat[t]!=null && periph.last_etat[t]+""!="") html+=t+"\t\t:"+periph.last_etat[t]+"</br>";
					}*/
					html+='    </div>';
					html+='</div>';
				html+='</div>';

				/*etat*/
				
				html+='</a></li>';
				list.append(html);
				break;		
			
			case 'peripheriquechauff':
				var periph = objs[i];
				var html='<li><a href="#" '+functionOnclick +' class="ui-btn">';
				html+='<div style="font-size: 16px">('+periph.id+') '+periph.nom+'  </div>';
				/*info*/
				html+='<div class="ui-grid-b" >';
					html+='<div class="ui-block-a">';
					html+='	<div class="ui-btn ui-btn-b" style="font-size: 10px;text-align:left">';
					for (t in periph.tag){
						html+=periph.tag[t].nom+"</br>";
					}
					html+='    </div>';
					html+='</div>';
				
					html+='<div class="ui-block-b">';
					html+='    <div class="ui-btn ui-btn-b" style="font-size: 10px;text-align:left">';
					html+='ecriture_type :'+periph.ecriture_type;
					html+='    </div>';
					html+='</div>';

					html+='<div class="ui-block-c">';
					html+='	<div class="ui-btn ui-btn-b" style="font-size: 10px;text-align:left">';
					html+='<pre>'+JSON.stringify(periph.last_etat, null, '\t')+'</pre>';
					/*for (t in periph.last_etat){
						if (periph.last_etat[t]!=null && periph.last_etat[t]+""!="") html+=t+"\t\t:"+periph.last_etat[t]+"</br>";
					}*/
					html+='    </div>';
					html+='</div>';
				html+='</div>';

				/*etat*/
				
				html+='</a></li>';
				list.append(html);
				break;
			case 'images':
				var img = objs[i];
				list.append('<li><a href="#" '+functionOnclick +' class="ui-btn"><div style="font-size: 16px"><p style="text-align:center"><img src="/'+img.nom+'" align="middle" height="40" width="40"/></p>'+img.nom+'  </div></a>');
				break;
			case 'pubs':
				var pub = objs[i];
				list.append('<li><a href="#" '+functionOnclick +' class="ui-btn"><div style="font-size: 16px">'+pub.nom+'  </div><div style="font-size: 11px"> '+pub.size+' bytes </div> </a>');
				break;
			case 'constantes':
				var constante = objs[i];
				list.append('<li><a href="#" '+functionOnclick +' class="ui-btn"><div style="font-size: 16px">('+constante.id+') '+constante.nom+'  </div><div style="font-size: 11px"> valeur :'+constante.valeur+' </div> </a>');
				break;
			default:
				var obj = objs[i];
				list.append('<li><a href="#" '+functionOnclick +' class="ui-btn"><div style="font-size: 16px">('+obj.id+') = '+obj.nom+'  </div><div style="font-size: 11px"> '+obj.uuid+' </div> </a>');
				break;
			}

		}
		
		list.append('<li><a href="#" onclick="chargeDetail(this,\''+type_element_encours+'\',null);return false;" class="ui-btn ui-btn-icon-right ui-icon-carat-r">Ajouter</a></li>');
		$("#listPage").find("#container").listview('refresh');

		
		
		$("#listPage").trigger('create');
	},'main?type=get&action=list'+type_element_encours);

});


function chargeDetail(element,action,id){
	//$('#loginPage').load('#acceuilPage');
	type_element_encours=action;
	id_element_encours=id;
	recharge_detail=true;
	$.mobile.changePage( $('#detailPage'), { transition: 'slide'});
}