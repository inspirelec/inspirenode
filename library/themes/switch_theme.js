/**
 * test pour switcher de theme
 */
switch_theme=function(lettre_theme){
	
	    var currentTheme = $('#loginPage').attr('data-theme');
	    var selectedTheme = lettre_theme;
	    
	    //alert('CT '+currentTheme+' ST '+selectedTheme);

	    $('.ui-body-' + currentTheme).each(function(){
	        $(this).removeClass('ui-body-' + currentTheme).addClass('ui-body-' + selectedTheme);    
	    });
	    
	    $('.ui-page-' + currentTheme).each(function(){
	        $(this).removeClass('ui-page-' + currentTheme).addClass('ui-page-' + selectedTheme);    
	    });
	    
	    $('.ui-btn-up-' + currentTheme).each(function(){
	        $(this).removeClass('ui-btn-up-' + currentTheme).addClass('ui-btn-up-' + selectedTheme);    
	    });
	    
	    $('.ui-btn-down-' + currentTheme).each(function(){
	        $(this).removeClass('ui-btn-down-' + currentTheme).addClass('ui-btn-down-' + selectedTheme);    
	    });
	    
	    $('*[data-theme]').each(function(index){
	        $(this).attr('data-theme',selectedTheme);
	    });
	    
	    $("[data-role='page']").each(function(index){
	        $(this).trigger('create');
	        
	    });
	    //$('#home').attr('data-theme', selectedTheme).removeClass('ui-body-' + currentTheme).addClass('ui-body-' + selectedTheme).trigger('create');
	
}