var tags;
var urltaglist='index.php?action=alltag';
var urltagdetail='periphbytag.html?taguuid='//'index.php?action=getlistperiphoftag&uuidtag=';
var refreshtag=true;

$(document).on("swiperight","#tagListPage",function(){ // When entering pagetwo
	parent.history.back();
});
$(document).on("pagecreate","#tagListPage",function(){ // When entering pagetwo
	refreshtag=false;
	
	displayWaitTags();
	
});
$(document).on("pageshow","#tagListPage",function(){ // When entering pagetwo
	if (refreshtag){
		$("#acceuilPage").trigger('pagecreate');
		$("#tagListPage").trigger('pagecreate');
		
	}
	
});

/*$('#tagListPage').bind('eventRefreshTags', function(event) {
	displayWaitTags();
});*/

function displayWaitTags(){
	$('#TagList1 li').remove();
	$('#TagList2 li').remove();
	$('#TagList1').append('<li data-icon="false"><h4 align="center">Chargement...</h4></li>');
	//$('#TagList2').append('<li data-icon="false"><input onClick="$("#tagListPage").trigger("pagecreate");return false;" id="reload" type="button" data-mini="true" value="Recharger" ></li>'		);
	
	$('#TagList1').listview('refresh');
	$('#TagList2').listview('refresh');
	getJsonObject(displayTags,urltaglist+'&v='+version);
	//$.getJSON(urltaglist, displayTags);
};

function displayTags(data) {
	
	displayTagslist(data,'#TagList1','#TagList2','#tagListPage');
};

function displayTagslist(data,TagList1,TagList2,tagListPage){
		//showAlert("display tag","trace");
	
	$(TagList1+' li').remove();
	$(TagList2+' li').remove();
	
	tagss = data.tags;
	constructviewtags(tagss,TagList1,TagList2,false);

	$(TagList1).listview('refresh');
	$(TagList2).listview('refresh');

	EntetePageTaille(tagListPage);
	$(tagListPage).trigger('create');

	$(TagList1).css('margin-right','-21px');
	$(TagList2).css('margin-left','-21px');
	//$( "#entete" ).children().css( "margin-top", "20px" );
};



function constructviewtags(tagss,TagList1,TagList2,onpageperiph){
	var countplace=0;
	$.each(tagss, function(index, tag) {
		tags[tag.id]=tag;
		functionOnclick='onclick="chargePeriphPage(this,\''+tag.nom+'\','+onpageperiph+');return false;"';
		if (countplace%2==0 && tag.nom!="Acceuil") {
//			$('#TagList1').append('<li data-icon="false"><a href="'+urltagdetail + tag.uuid + '&tagnom='+tag.nom+ '" data-transition="slide">' +
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







