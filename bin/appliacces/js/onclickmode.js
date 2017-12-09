 
   var progmodeAcopier=null;
   var differemodeid=null;
   var urlpostcopieprog='inspireathome/index.php?action=copiemodeprog'
   var urlposteffaceprog='inspireathome/index.php?action=effacemodeprog'
   var urlpostdiffereprog='index.php?action=differemode'
	   
   var modeschanged=false;
   function addmode(){
	   
	   m={};
	   m['id']=$('#setnom').val();
	   m['icon']=$('#seticon').val();
	   m['nom']=$('#setnom').val();
	   
	   int_id=0;
	   if (modes==null) modes={};
			for (var i = 0, len = m['id'].length; i < len; i++) {
			  int_id+=m['id'][i].charCodeAt(0)
			}
			m['id']='p'+int_id;
	   modes[m['id']]=m;
	   modeschanged=true;
	   refreshlistmode();
   }
   
   function refreshlistmode(){
		$('#modeslist li').remove();
		$('#modeslist').append('<li data-role="list-divider">Modes</li>');
		if (modes!=null){
				for(var modename in modes) {
				   m=modes[modename];
				   indexp=modename;
				   texte =  m['nom'] ;
				   
				   ligne='<li ';
				    if (m.id==0 || m.id==1 || m.id==2) ligne +='data-icon="false"';
				   ligne +='><a href="#" >'+texte+'</a>';
				   if (m.id!=0 && m.id!=1 && m.id!=2) {
					   ligne+='<a href="#" onclick="deletemode(\''+indexp+'\');return false;" data-rel="popup" data-position-to="window" data-transition="pop">delete</a>';
				   }
				   ligne+='</li>'
				   $('#modeslist').append(ligne);	
				}
		}
		
	    $('#modeslist').append('<li><a href="#" onclick="addmode();return false;">Ajouter</a></li>');
	    $('#modeslist').listview('refresh');
	    
   }
   function copierprog(id){
	   progmodeAcopier=id
   }
   function collerprog(id){
	   if (progmodeAcopier!=null){
		   linkurl=urlpostcopieprog+"&idsource=mode_"+progmodeAcopier+"&idcible=mode_"+id
		   sendaction(serviceURL + linkurl);		   
	   }

   }
   function effacerprog(id){
		   linkurl=urlposteffaceprog+"&idcible=mode_"+id
		   sendaction(serviceURL + linkurl);

   }
   function popupdiffererEtatMode(id){
	   differemodeid=id;
	   setTimeout(function(){
		   $( "#differemodepopupMenu" ).find("#titre").html('Passer en '+modes[differemodeid]);
		   $( "#differemodepopupMenu" ).popup( "open" ,{ shadow: false ,positionTo : "window"} );
	   },100);
   }
   function differerEtatMode(nompopuptoclose){
		if (nompopuptoclose==null) nompopuptoclose='differemodepopupMenu';
	  linkurl=urlpostdiffereprog;
		diff={};
		diff.id=differemodeid;
		diff.date=$('#'+nompopuptoclose).find('#modedate').val();
		diff.heure=$('#'+nompopuptoclose).find('#modetimer').val();
		$.post(serviceURL + linkurl, diff, 
			function(response) {
				i=1;
				
			}, 'json');
		$( '#'+nompopuptoclose ).popup( 'close');
		setTimeout(function () {$("#progmodepage").trigger('pagecreate');},0);
		//setTimeout(function () {$("#progmodepage").trigger('pagecreate');},0);
   }
   function deletemode(id){
	   
	   delete modes[id];
	   modeschanged=true;
	   refreshlistmode();
   }