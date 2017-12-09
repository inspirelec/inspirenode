   function chargePeriphPage(tag,tag_nom,onpageperiph) {
	   
	   tagclicked_uuid=$(tag).attr('id');
	   tagclicked_nom=tag_nom;
	   if (onpageperiph==false){
		 leveltag=1;
		 $.mobile.changePage( $("#periphpage"), { transition: "slide"});
	   	 
	   } else {
	   	 leveltag+=1;
	   	 $.mobile.changePage($("#periphpage"+leveltag), { transition: "slide"});
	   	 
	   }
	   
	   
	   //

   };