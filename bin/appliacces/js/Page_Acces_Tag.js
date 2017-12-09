var batiment_clicked_indus="";

$(document).on("pageshow","#Acces_Tag_Page",function(){ // When entering pagetwo
	getJsonObject(get_info_tags,'index.php?action=alltag&batiment='+batiment_clicked_indus+'&v='+version);

});
$(document).on("pagecreate","#Acces_Tag_Page",function(){ // When entering pagetwo

});


function chargeTagPageIndus(element,tag_id) {
	   
    batiment_clicked_indus=tag_id;
   
    $.mobile.changePage( $("#Acces_Tag_Page"), { transition: "slide"});
    document.location.hash = "#Acces_Tag_Page";
};

function get_info_tags(data){
	displayTagslistIndus2(data,"#TagList1","#TagList2","#Acces_Tag_Page");
	//$( "#Gerant_Tache_Page").find( " .connectedSortable" ).listview('refresh');
	
}



function displayTagslistIndus2(data,TagList1,TagList2,tagListPage){
	//showAlert("display tag","trace");

$(TagList1+' li').remove();
$(TagList2+' li').remove();

tagss = data.tags;
constructviewtagsindus2(tagss,TagList1,TagList2);

$(TagList1).listview('refresh');
$(TagList2).listview('refresh');

EntetePageTaille(tagListPage);
$(tagListPage).trigger('create');

//$( "#entete" ).children().css( "margin-top", "20px" );
};



function constructviewtagsindus2(tagss,TagList1,TagList2){
var countplace=0;
$.each(tagss, function(index, tag) {
	tags[tag.id]=tag;
	functionOnclick='onclick="chargeIndusPeriphPage(this,\''+tag.uuid+'\');return false;"';
	if (countplace%2==0 && tag.nom!="Acceuil") {
//		$('#TagList1').append('<li data-icon="false"><a href="'+urltagdetail + tag.uuid + '&tagnom='+tag.nom+ '" data-transition="slide">' +
		$(TagList1).append('<li data-icon="false"><a href="#" id="'+tag.uuid+'" '+functionOnclick+'>' +
				'<p style="text-align:center"><img src="'+imagesURL+tag.icon + '" align="middle" height="40" width="40"/></p>' +
				'<h4 align="center">' + tag.nom + '</h4></li>' //+
				//'<p>' + tag.visible + '</p>' +
				//'<p>' + tag.uuid + '</p>' //+
				//'<span class="ui-li-count">' + 0 + '</span></a></li>'
				);	
		countplace++;
	} else if (tag.nom!="Acceuil"){
		//$('#TagList2').append('<li data-icon="false"><a href="'+urltagdetail + tag.uuid + '&tagnom='+tag.nom+ '" data-transition="slide">' +
		$(TagList2).append('<li data-icon="false"><a href="#" id="'+tag.uuid+'" '+functionOnclick+'>' +
				'<p style="text-align:center"><img src="'+imagesURL+tag.icon + '" align="middle" height="40" width="40"/></p>' +
				'<h4 align="center">' + tag.nom + '</h4></li>' //+
				//'<p>' + tag.visible + '</p>' +
				//'<p>' + tag.uuid + '</p>' //+
				//'<span class="ui-li-count">' + 0 + '</span></a></li>'
				);	
		countplace++;
	}


});
return countplace;
}