/**
 * New node file
 */
$(document).on("pageshow","#detailPage",function(){ // When entering pagetwo
	if (recharge_detail){
		$("#detailPage").find("#container li").remove();
		//getJsonObject(function(err,httpResponse,body){
			//var objs=(body.responseJSON);
		if (id_element_encours) {
			getJsonObject(function(err,httpResponse,body){
				var objs=(body.responseJSON);	
				chargementDetail(objs);
			},'main?type=get&action=detail'+type_element_encours+'&id='+id_element_encours);
		} else {
			var new_obj={};
			var table=null;
			for (tab in database.tables) {
				if (database.tables[tab].name==type_element_encours){
					table=database.tables[tab];
				};
			}
			for (col in table.colonnes) {
				var colonne=table.colonnes[col];
				if (colonne.defaut) {
					new_obj[colonne.name]=colonne.defaut;
				} else {
					new_obj[colonne.name]="";
				}
				
			}
			var res=[];
			res.push(new_obj);
			chargementDetail(res);
		}		
	}
	recharge_detail=false;
	$("#message").fadeOut();

	
});


function chargementDetail(objs){
	var decodeHtmlEntity = function(str) {
		  return str.replace(/&#(\d+);/g, function(match, dec) {
		    return String.fromCharCode(dec);
		  });
		};
		 
	var encodeHtmlEntity = function(str) {
	  var buf = [];
	  for (var i=str.length-1;i>=0;i--) {
	    buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
	  }
	  return buf.join('');
	};
		
	var content=$("#detailPage").find("#content");
	var sidebar=$("#detailPage").find("#sidebar");
	var pied=$("#detailPage").find("#pied");
	var titre=$("#detailPage").find("#titre");
	titre.html("Reglages "+type_element_encours + " id "+id_element_encours);
	
	content.html("");
	pied.html("");
	sidebar.html("");
	for (var i = 0; i < objs.length; i++) {

		/*switch (type_element_encours) {
		case 'box':*/
			var obj = objs[i];
			for (var dbc = 0; dbc < database.tables.length; dbc++) {
				var table = database.tables[dbc];
				if (table.name==type_element_encours){
					var colonnes=table.colonnes;
					var tables_compl=table.tables_compl;
					var actionsdetail=table.actionsdetail;
					var actionsreturnlist=table.actionsreturnlist;
					
					for (var c = 0; c < colonnes.length; c++) {
						var colonne = colonnes[c];
						var parentcontent=content;
						var placeholder="";
						if (colonne.placeholder) placeholder=colonne.placeholder;
						if (obj[colonne.name]==null) obj[colonne.name]='';
						switch (colonne.formulaire) {
						case 'label':
							parentcontent.append('<div data-role="fieldcontain" data-mini="true"><label for="'+colonne.name+'">'+colonne.name+"</label>"+'<input type="text" disabled=true name="'+colonne.name+'" id="'+colonne.name+'" value="'+(obj[colonne.name])+'"></div>');
							break;
						case 'input':
							parentcontent.append('<div data-role="fieldcontain" data-mini="true"><label for="'+colonne.name+'">'+colonne.name+"</label>"+'<input type="text" name="'+colonne.name+'" id="'+colonne.name+'" value="'+encodeHtmlEntity(obj[colonne.name])+'" placeholder="'+placeholder+'"></div>');
							break;
						case 'textarea':
							parentcontent.append('<div data-role="fieldcontain" data-mini="true"><label for="'+colonne.name+'">'+colonne.name+"</label>"+
									'<textarea cols="40" rows="4" name="'+colonne.name+'" id="'+colonne.name+'" >'+encodeHtmlEntity(obj[colonne.name])+'</textarea></div>');
							break;
						case 'password':
							parentcontent.append('<div data-role="fieldcontain" data-mini="true"><label for="'+colonne.name+'">'+colonne.name+"</label>"+'<input type="password" name="'+colonne.name+'" id="'+colonne.name+'" value="'+encodeHtmlEntity(obj[colonne.name])+'"></div>');
							break;
						case 'select':
							if (colonne.linkobject) {
								var htmlselect='<div data-mini="true" data-role="fieldcontain" data-mini="true"><label for="'+colonne.name+'">'+colonne.name+"</label>"+'<select id="'+colonne.name+'" name="'+colonne.name+'">';
								htmlselect+='<option value="">- non définit -</option>';
								getJsonObjectSync(function(errs,httpResponses,bodys){
									var sobjs=(bodys.responseJSON);
									
									for (var op = 0; op < sobjs.length; op++) {
										var option = sobjs[op];
										var selected="";
										if (option.id==obj[colonne.name]) selected=" selected=true ";
										htmlselect+='<option value="'+option.id+'"'+selected+'>'+option.id+' '+option.nom+'</option>';
									}
								},'main?type=get&action=list'+colonne.linkobject);
								htmlselect+='</select></div>';
								parentcontent.append(htmlselect)
							} else if (colonne.object) {
								var htmlselect='<div data-mini="true" data-role="fieldcontain"><label for="'+colonne.name+'">'+colonne.name+"</label>"+'<select id="'+colonne.name+'" name="'+colonne.name+'">';
								htmlselect+='<option value=" ">- non définit -</option>';
								for (var op = 0; op < colonne.object.length; op++) {
									var option = colonne.object[op];
									var selected="";
									if (option.id==obj[colonne.name]) selected=" selected=true ";
									htmlselect+='<option value="'+option.id+'"'+selected+'>'+option.nom+'</option>';
								}
								htmlselect+='</select></div>';
								parentcontent.append(htmlselect)
							}
							
							break;
						default:
							break;
						}
					}
					var field='id';
					function compare_field(a,b){
						if (a[field]<b[field]){
							return -1;
						} else if (a[field]>b[field]) {
							return 1;
						} else {
							return 0;
						}
					}
					
					if (tables_compl) {
						for (var tc = 0; tc < tables_compl.length; tc++) {
							var table_compl = tables_compl[tc];
							switch (table_compl.formulaire) {
							case 'checkbox':
								var table_enfant;
								var table_lien;
								
								getJsonObjectSync(function(errs,httpResponses,bodys){
									 table_enfant=(bodys.responseJSON);
								},'main?type=get&action=list'+table_compl.soustable_name);
								getJsonObjectSync(function(errs,httpResponses,bodys){
									 table_lien=(bodys.responseJSON);
								},'main?type=get&action=list'+table_compl.name+'&id='+id_element_encours );
								if (table_compl.groupby){
									field=table_compl.groupby;
									table_enfant.sort(compare_field);
								}
								
								
								var htmlcheckboxlistt={"col0":"","col1":"","col2":"","col3":""};
								for (var colaffid = 0; colaffid < 4; colaffid++) {
									 htmlcheckboxlistt['col'+colaffid]='<div data-role="fieldcontain">';
								}
								var indexcol=0;
								for (var r = 0; r < table_enfant.length; r++) {
									var enfant_row = table_enfant[r];
									var checked="";
									if (table_lien) {
										for (var il = 0; il < table_lien.length; il++) {
											var lien_row = table_lien[il];
											if (lien_row['id_'+table_compl.soustable_name]==enfant_row.id) checked=" checked=true ";
										}										
									}

									htmlcheckboxlistt['col'+indexcol]+='<fieldset data-role="controlgroup">';
									htmlcheckboxlistt['col'+indexcol]+='<input type="checkbox" group="'+table_compl.soustable_name+'" name="'+enfant_row.id+'" '+checked+' id="'+table_compl.soustable_name+enfant_row.id+'" class="custom" />';
									htmlcheckboxlistt['col'+indexcol]+='<label for="'+table_compl.soustable_name+enfant_row.id+'">'+enfant_row.nom+'</label>';
									htmlcheckboxlistt['col'+indexcol]+='</fieldset>';
									indexcol++;
									if (indexcol>=4) indexcol=0;
								}
								var htmlcheckboxlist=""
								for (var colaffid = 0; colaffid < 4; colaffid++) {
									 htmlcheckboxlistt['col'+colaffid]+='</div>';
								}
								htmlcheckboxlist='<div class="ui-grid-c" >';
								htmlcheckboxlist+='<div class="ui-block-a">';
								htmlcheckboxlist+='    <div class="ui-bar ui-bar-c">';
								htmlcheckboxlist+=htmlcheckboxlistt['col0'];
								htmlcheckboxlist+='    </div>';
								htmlcheckboxlist+='</div>';
								htmlcheckboxlist+='<div class="ui-block-b">';
								htmlcheckboxlist+='	   <div class="ui-bar ui-bar-c">';
								htmlcheckboxlist+=htmlcheckboxlistt['col1'];
								htmlcheckboxlist+='    </div>';
								htmlcheckboxlist+='</div>';
								htmlcheckboxlist+='<div class="ui-block-c">';
								htmlcheckboxlist+='	   <div class="ui-bar ui-bar-c">';
								htmlcheckboxlist+=htmlcheckboxlistt['col2'];
								htmlcheckboxlist+='    </div>';
								htmlcheckboxlist+='</div>';
								htmlcheckboxlist+='<div class="ui-block-d">';
								htmlcheckboxlist+='	   <div class="ui-bar ui-bar-c">';
								htmlcheckboxlist+=htmlcheckboxlistt['col3'];
								htmlcheckboxlist+='    </div>';
								htmlcheckboxlist+='</div>';
								htmlcheckboxlist+='</div>';
								
								content.append(htmlcheckboxlist);
								break;
							default:
								break;
							}
							
						}
					}
					if (actionsdetail) {
						var indexcol=0;
						var htmlactionlistt={"col0":""/*,"col1":"","col2":"","col3":""*/};
						for (var colaffid = 0; colaffid < 1; colaffid++) {
									htmlactionlistt['col'+colaffid]='<div data-role="fieldcontain">';
								}
						var sliderref=[];
						for (var tc = 0; tc < actionsdetail.length; tc++) {
							var action_detail = actionsdetail[tc];
							switch (action_detail.type) {
							case 'button':

								
									var functionOnclick="sendaction('"+action_detail.action+"','"+type_element_encours+"','"+id_element_encours+"','#reponsePage');";
									//htmlactionlistt['col'+indexcol]+='<fieldset data-role="controlgroup">';
									htmlactionlistt['col'+indexcol]+='<button id="'+action_detail.name+'" type="submit" data-theme="d" onclick="'+functionOnclick+'return false;";>'+action_detail.name+'</button>'
										//'<a href="#" id="'+action_detail.name+'" '+functionOnclick+'>' +
																	//'<p style="text-align:center"><img src="'+button.image+'" align="middle" height="40" width="40"/></p>' +
																	
									//htmlactionlistt['col'+indexcol]+='</fieldset>';
									indexcol++;
									if (indexcol>=0) indexcol=0;
								

								break;
							case 'slider':
								htmlactionlistt['col'+indexcol]+='<input id="'+action_detail.name+'" type="range" min="'+obj[action_detail.min_field]+'" max="'+obj[action_detail.max_field]+'" step="1" value="'+obj[action_detail.min_field]+'" data-mini="false"  data-highlight="true">';
								sliderref.push(action_detail);
								
								
								
								break;
							default:
								break;
							}
							
						}
						var htmlactionlist=""
						for (var colaffid = 0; colaffid < 1; colaffid++) {
							htmlactionlistt['col'+colaffid]+='</div>';
						}
						htmlactionlist='';//'<div class="ui-grid-c" >';
						//htmlactionlist+='<div class="ui-block-a">';
						htmlactionlist+='    <div class="ui-bar ui-bar-d">';
						htmlactionlist+=htmlactionlistt['col0'];
						htmlactionlist+='    </div>';
						/*htmlactionlist+='</div>';
						htmlactionlist+='<div class="ui-block-b">';
						htmlactionlist+='	   <div class="ui-bar ui-bar-d">';
						htmlactionlist+=htmlactionlistt['col1'];
						htmlactionlist+='    </div>';
						htmlactionlist+='</div>';
						htmlactionlist+='<div class="ui-block-c">';
						htmlactionlist+='	   <div class="ui-bar ui-bar-d">';
						htmlactionlist+=htmlactionlistt['col2'];
						htmlactionlist+='    </div>';
						htmlactionlist+='</div>';
						htmlactionlist+='<div class="ui-block-d">';
						htmlactionlist+='	   <div class="ui-bar ui-bar-d">';
						htmlactionlist+=htmlactionlistt['col3'];
						htmlactionlist+='    </div>';
						htmlactionlist+='</div>';
						htmlactionlist+='</div>';*/
						
						sidebar.append(htmlactionlist);
					}
					if (actionsreturnlist) {
						var indexcol=0;
						var htmlactionlistt={"col0":""/*,"col1":"","col2":"","col3":""*/};
						for (var colaffid = 0; colaffid < 1; colaffid++) {
									htmlactionlistt['col'+colaffid]='<div data-role="fieldcontain">';
								}
						for (var tc = 0; tc < actionsreturnlist.length; tc++) {
							var action_returnlist = actionsreturnlist[tc];
							switch (action_returnlist.type) {
							case 'button':

								
									var functionOnclick="sendaction('"+action_returnlist.action+"','"+type_element_encours+"','"+id_element_encours+"','back');";
									//htmlactionlistt['col'+indexcol]+='<fieldset data-role="controlgroup">';
									htmlactionlistt['col'+indexcol]+='<button id="'+action_returnlist.name+'" type="submit" data-theme="d" onclick="'+functionOnclick+'return false;";>'+action_returnlist.name+'</button>'
										//'<a href="#" id="'+action_detail.name+'" '+functionOnclick+'>' +
																	//'<p style="text-align:center"><img src="'+button.image+'" align="middle" height="40" width="40"/></p>' +
																	
									//htmlactionlistt['col'+indexcol]+='</fieldset>';
									indexcol++;
									if (indexcol>=0) indexcol=0;
								

								break;
							default:
								break;
							}
							
						}
						var htmlactionlist=""
						for (var colaffid = 0; colaffid < 1; colaffid++) {
							htmlactionlistt['col'+colaffid]+='</div>';
						}
						/*htmlactionlist='<div class="ui-grid-c" >';
						htmlactionlist+='<div class="ui-block-a">';*/
						htmlactionlist='    <div class="ui-bar ui-bar-d">';
						htmlactionlist+=htmlactionlistt['col0'];
						htmlactionlist+='    </div>';
						/*htmlactionlist+='</div>';
						htmlactionlist+='<div class="ui-block-b">';
						htmlactionlist+='	   <div class="ui-bar ui-bar-d">';
						htmlactionlist+=htmlactionlistt['col1'];
						htmlactionlist+='    </div>';
						htmlactionlist+='</div>';
						htmlactionlist+='<div class="ui-block-c">';
						htmlactionlist+='	   <div class="ui-bar ui-bar-d">';
						htmlactionlist+=htmlactionlistt['col2'];
						htmlactionlist+='    </div>';
						htmlactionlist+='</div>';
						htmlactionlist+='<div class="ui-block-d">';
						htmlactionlist+='	   <div class="ui-bar ui-bar-d">';
						htmlactionlist+=htmlactionlistt['col3'];
						htmlactionlist+='    </div>';
						htmlactionlist+='</div>';
						htmlactionlist+='</div>';*/
						
						sidebar.append(htmlactionlist);
					}
				}
			}
			

		/*default:
			var obj = objs[i];
			break;
		}*/

	}
	sidebar.append('<div id="message"></div>');
	$("#detailPage").trigger('create');
	
	for (l in sliderref){
		var action=sliderref[l];
		$('#'+action.name).on('slidestop',function(event,ui) {
		    sVal = this.value;
		    sendaction(action.action+sVal,type_element_encours,id_element_encours,'#reponsePage');
		});
	}
	//list.append('<li><a href="#" onclick="addligne();return false;" class="ui-btn ui-btn-icon-right ui-icon-carat-r">Ajouter</a></li>');
	//$("#listPage").find("#container").listview('refresh');
	//$("#listPage").trigger('create');
	
		

}

function sendaction(action_link,element,id,pagecible){
	var childs_inputs=$("#detailPage").find('#content').find('input');
	
	var childs_select=$("#detailPage").find('#content').find('select');
	
	var data={};
	for (i in childs_inputs){
		var champ=childs_inputs[i];
		if (champ.attributes){
			var champobj={id:champ.name,value:champ.value}
			
			if (champ.attributes.group){
				if (!data[champ.attributes.group.value]) data[champ.attributes.group.value]=[];
				if (champ.attributes.type.value!='checkbox' || champ.checked){
					if (champ.attributes.type.value=='checkbox') champobj.value=champ.checked;
					data[champ.attributes.group.value].push(champobj);
				}
			} else {
				data[champ.id]=champ.value;
			}			
		}

	}
	for (i in childs_select){
		var champ=childs_select[i];
		if (champ.attributes){
			if (champ.attributes.group){
				var champobj={id:champ.id,value:champ.value}
				if (!data[champ.attributes.group.value]) data[champ.attributes.group.value]=[];
				data[champ.attributes.group.value].push(champobj);
			} else {
				data[champ.id]=champ.value;
			}			
		}

	}
	getJsonObject(function(err,httpResponse,body){
		reponse_action_encours=JSON.stringify(body.responseJSON, null, "\t");
		var rep = body.responseJSON;
		if (rep.msg) {
			var messageplace=$("#detailPage").find("#message");
			messageplace.html('<pre>'+rep.msg+'</pre>');
			messageplace.fadeIn();
			setTimeout(function(){
				messageplace.fadeOut();
			},4000);
			//alert(rep.msg);
		}
		if (rep.element && rep.element.id) {
			$("#detailPage").find('#content').find('#id').val(rep.element.id);
		}
		if (rep.element && rep.element.uuid) {
			$("#detailPage").find('#content').find('#uuid').val(rep.element.uuid);
		}
		if (pagecible!='back') {
			$.mobile.changePage( $(pagecible), { transition: 'slide'});	
		} else {
			if (rep.page && rep.page=='back'){
				parent.history.back();
			}
			
		}
		
	},action_link+'&element='+element,data);
}
