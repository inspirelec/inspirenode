/**
 * 
 */

var sendspeedrefresh=false;
var etatbusyspeed=false;
var refreshspeedtonbtime=0
var refreshspeedtime=0;

function runboucleEtat(){
	timerinterval=setInterval(ListenNewEtat,1000);
}

function ListenNewEtat(){
	refreshspeedtime+=1000;
	if ( etatbusyspeed==false && sendspeedrefresh==true && refreshspeedtime>=refreshspeedtonbtime){
		etatbusyspeed=true;
		refreshspeedtime=0;
		getEtatPeriphsSpeed(function(data){
			
			CheckifEtatschanged(data,false);
			etatbusyspeed=false;
			});
		
	}
	
	if (etatbusy==false) {
		etatbusy=true;
		//alert('its time');
		
		getEtatPeriphs(function(data){
			if (data.updateTime!=null){
				//alert("pas de changement");
				//lastmd5_etat=data.md5_etat;
				lastmd5_etat=data.updateTime;
				CheckifEtatschanged(data,true);
			} else {
				//alert("pas de changement");
			}
			etatbusy=false;
		},lastmd5_etat)			
	}
}


function CheckifEtatschanged(etats,withmajlastetat){
	$.each(etats, function(index, etat) {
		
		if (index!="md5_etat" && index !='type' && index!="mode" && index!="" && index !=null && etat['expression']!=null ){
			
			if(lastetat[index]!=null) {
				if (	lastetat[index]['expression']['etat']!= etat['expression']['etat']
					||	lastetat[index]['expression']['etat2']!= etat['expression']['etat2']
					||  lastetat[index]['expression']['expr1']!= etat['expression']['expr1']
					||	lastetat[index]['expression']['expr2']!= etat['expression']['expr2']
					||	lastetat[index]['expression']['expr3']!= etat['expression']['expr3'])	{
					
					/*if (index.indexOf('Compteur_')>=0){
						p=peripheriques[index.substring(9)];
					} else {*/
						p=peripheriques[index];
					/*}*/
					
					
					if (p!=null) {
						//$("#debug2").html("recu etat "+ p['nom'] + ' ' + p['uuid']);
						//alert("changement" + p.nom + '=' + etat['expression']['expr1']);
						DisplayUpdatedEtat(p,etat,lastetat[index],etats['mode'],etats['type']);
					}					
				}				
			} else {
				p=peripheriques[index];
				if (p!=null) {
					
					DisplayUpdatedEtat(p,etat,lastetat[index],etats['mode'],etats['type']);
				}
			}

		} else if (index=="mode") {
				
				$.each(modes, function(index, mod) {
					if(mod.nom==etats['mode']){
						modeactuel=index;
					}
				});
				$.each(peripheriques, function(index, per) {
					if (per.ecriture_type=='TEMPERATURE' || per.ecriture_type=='TEMPERATURECONSIGNE') {
						//alert('mode='+etat+'=>'+per.nom);
						DisplayUpdatedEtat(per,lastetat[index],lastetat[index],etats['mode']);
						//changeInfoTemp(per,lastetat[index],etat,true);
					}
				});
			
		} else if (index=="type") {
				typeactuel=etats['type'];
				$.each(peripheriques, function(index, per) {
					if (per.ecriture_type=='TEMPERATURE' || per.ecriture_type=='TEMPERATURECONSIGNE') {
						//alert('mode='+etat+'=>'+per.nom);
						DisplayUpdatedEtat(per,lastetat[index],lastetat[index],etats['mode'],etats['type']);
						//changeInfoTemp(per,lastetat[index],etat,true);
					}
				});
		}
		
		if (withmajlastetat) lastetat[index]=etat;
	});	
	
	
}

function DisplayUpdatedEtat(periph,etatnew,etatold,mode,type){
	var prefixesid=["a", "b","c","d"];
	
	if (etatnew!=null){
		$.each(prefixesid, function(index, pref) {
			
			var pdisplay='#'+pref+periph.uuid;
			if (periph.ecriture_type=="BINAIRE"){
				changeEtat(pdisplay,etatnew['expression']['etat'],periph.categorie.iconMin,periph.categorie.iconMax,periph.categorie.iconMidle,true);
				changeInfoExpr(pdisplay,etatnew,mode,true);
			} else if (periph.ecriture_type=="ALARME"){
				/*if (etatnew['expression']['actif'] && etatnew['expression']['actif']==1){
					e='pause '+etatnew['expression']['etat']+"/"+etatnew['expression']['etatmax'];
					$(pdisplay).find("#etat").html('');
					$(pdisplay).find("#pause").html(e);	  
					//changeAlarme(pdisplay,e,periph.categorie.iconMin,periph.categorie.iconMax,periph.categorie.iconMidle,true);
				} else if (!etatnew['expression']['actif']) {*/
					
					$(pdisplay).find("#pause").html('');	 
					changeAlarme(pdisplay,etatnew['expression']['etat'],periph.categorie.iconMin,periph.categorie.iconMax,periph.categorie.iconMidle,true);
				/*}*/
			} else if (periph.ecriture_type=="BINVAR") {
				changeEtatVariable(pdisplay,etatnew['expression']['etat'],periph.categorie.iconMin,periph.categorie.iconMax,periph.categorie.iconMidle,true);			
				changeInfoExpr(pdisplay,etatnew,mode,true);
			} else if (periph.ecriture_type=='TEMPERATURE') {
				changeInfoTemp(pdisplay,etatnew,mode,true,type);
			} else if (periph.ecriture_type=='TEMPERATURECONSIGNE') {
				changeInfoTemp(pdisplay,etatnew,mode,true,type);
			} else if (periph.ecriture_type=='PLAYER') {
				changeEtatPlayer(pdisplay,etatnew['expression']['expr1_val'],true)
				changeInfoExpr(pdisplay,etatnew,mode,true);
				changeEtatVariable(pdisplay,etatnew['expression']['etat'],periph.categorie.iconMin,periph.categorie.iconMax,periph.categorie.iconMidle,true);			
			} else if (periph.ecriture_type=='VOLETRVARIABLE') {
				changeEtatVolet(pdisplay,etatnew,true);
				changeInfoExpr(pdisplay,etatnew,mode,true);
				//changeEtatVariable(pdisplay,etatnew['expression']['etat'],periph.categorie.iconMin,periph.categorie.iconMax,periph.categorie.iconMidle,true);			
			} else if (periph.ecriture_type=='VOLETR') {
				changeEtatVolet(pdisplay,etatnew,true);
				changeInfoExpr(pdisplay,etatnew,mode,true);
				//changeEtatVariable(pdisplay,etatnew['expression']['etat'],periph.categorie.iconMin,periph.categorie.iconMax,periph.categorie.iconMidle,true);			
			} else if (periph.ecriture_type=='BATTERIE') {
				changeInfoBatterie(pdisplay,etatnew);
				//changeEtatVariable(pdisplay,etatnew['expression']['etat'],periph.categorie.iconMin,periph.categorie.iconMax,periph.categorie.iconMidle,true);			
			} else if (periph.ecriture_type=='INFOS') {
				changeInfos(pdisplay,etatnew);
				//changeEtatVariable(pdisplay,etatnew['expression']['etat'],periph.categorie.iconMin,periph.categorie.iconMax,periph.categorie.iconMidle,true);			
			} else{
				changeInfoExpr(pdisplay,etatnew,mode,true);
			}	
			

		});
	}

		

}