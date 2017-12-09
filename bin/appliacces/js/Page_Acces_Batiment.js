$(document).on("pageshow","#Acces_Batiment_Page",function(){ // When entering pagetwo
	
});
$(document).on("pagecreate","#Acces_Batiment_Page",function(){ // When entering pagetwo
	getJsonObject(get_info_batiment,'index.php?action=allbatiment&v='+version);
	/*
*/
			


	
});


function get_info_batiment(data){
	displayTagslistIndus(data,"#BatimentList1","#BatimentList2","#Acces_Batiment_Page");
	//$( "#Gerant_Tache_Page").find( " .connectedSortable" ).listview('refresh');
	
}



function displayTagslistIndus(data,TagList1,TagList2,tagListPage){
	//showAlert("display tag","trace");

$(TagList1+' li').remove();
$(TagList2+' li').remove();

tagss = data.tags;
constructviewtagsindus(tagss,TagList1,TagList2);

$(TagList1).listview('refresh');
$(TagList2).listview('refresh');

EntetePageTaille(tagListPage);
$(tagListPage).trigger('create');

//$( "#entete" ).children().css( "margin-top", "20px" );
};



function constructviewtagsindus(tagss,TagList1,TagList2){
var countplace=0;
$.each(tagss, function(index, tag) {
	tags[tag.id]=tag;
	functionOnclick='onclick="chargeTagPageIndus(this,\''+tag.id+'\');return false;"';
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