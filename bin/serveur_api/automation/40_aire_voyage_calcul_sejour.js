/**
 * New node file
 */
var aire_voyage_calcul_sejour={id:40,nom:"aire_voyage_calcul_sejour",etat:"OFF",lastrun:null};
var timer=null;


aire_voyage_calcul_sejour.start=function(){
    if (aire_voyage_calcul_sejour.etat=='OFF') {
        aire_voyage_calcul_sejour.etat='ON';
        logger('INFO',{msg:'demarrage automation',nom:this.nom},'startstop');
        /*obj.app.serveur.on('core_charge_all',run_update_etat);
        obj.app.serveur.on('box.update_etat_box',actions_on_event1);
        obj.app.serveur.on('box.update_etat_boxs',actions_on_event2);
        
        /*Execution toutes les  30 secondes*/
        timer=setInterval(function(){
            calcul_sejours();
            }, 300000);
        calcul_sejours();
        
    }
}

aire_voyage_calcul_sejour.stop=function(){
    if (aire_voyage_calcul_sejour.etat=='ON') {
        aire_voyage_calcul_sejour.etat='OFF';
        logger('INFO',{msg:'extinction automation',nom:this.nom},'startstop');
        /*obj.app.serveur.removeListener('core_charge_all',actions_on_event1);
        obj.app.serveur.removeListener('box.update_etat_box',actions_on_event1);
        obj.app.serveur.removeListener('box.update_etat_boxs',actions_on_event2);*/
        clearInterval(timer);
    }

}


function calcul_sejours(in_titulaire_id,in_sejour_id,sejourdata,callback){

	//console.log('appel automation calcul sejours',in_titulaire_id);
    var sqlsel="select r.*,round(nb_jour*prix_empl_jour,2) total_empl"+
" from ("+
"	select t.id tag_id,"+
"				s.titulaire_id,"+
"				s.id sejour_id,"+
"				case when s.date_fac  "+
"					then s.date_fac "+
"					else s.date_debut "+
"				end  date_debut,"+
"	            p.prix_empl_jour, "+
"				case when s.index_fac_elec  "+
"					then s.index_fac_elec "+
"					else s.valeur0 "+
"				end  index_deb_elec,"+
"				p.prix_elec_kwh,"+
"				case when s.index_fac_eau  "+
"					then s.index_fac_eau "+
"					else s.valeur1 "+
"				end  index_deb_eau,"+
"				p.prix_eau_m3, "+
"				t.periph_eau_id, "+
"				t.periph_elec_id "+
"				, c.facture_num ,";
if (sejourdata) {
    sqlsel+="			case when 1 == 0 and s.date_debut is not null "+
        "					then date('now')  "+
        "					else '"+sejourdata.date_fin+"'   "+
        "				end date_fin ,"+

        "				case when 1 == 0"+
        "					then julianday(date('now'))     "+
        "					else julianday('"+sejourdata.date_fin+"') "+
        "				end -julianday(case when s.date_fac  "+
        "					then s.date_fac "+
        "					else s.date_debut "+
        "				end) nb_jour,"+

		"				1 sejour_clos,"+

		"				"+sejourdata.valeur2+" sejour_elec_fin,"+

		"				"+sejourdata.valeur3+" sejour_eau_fin";
} else {
    sqlsel+="				case when s.clos == 0 and s.date_debut is not null "+
        "					then date('now')  "+
        "					else s.date_fin   "+
        "				end date_fin ,"+
        "				case when s.clos == 0"+
        "					then julianday(date('now'))     "+
        "					else julianday(s.date_fin) "+
        "				end -julianday(case when s.date_fac  "+
        "					then s.date_fac "+
        "					else s.date_debut "+
        "				end) nb_jour,"+
    "				s.clos sejour_clos,"+
    "				s.valeur2 sejour_elec_fin,"+
    "				s.valeur3 sejour_eau_fin";
}


    sqlsel+=" "+
" from sejour s "+
"		left outer join tag t on t.id=s.emplacement_id       "+
"		left outer join tarif p on p.id=s.type_tarif"+
"		left outer join compte_ecriture c on c.sejour_id=s.id and c.libelle='Electricité' "+
"		) r";
    if (in_titulaire_id){
        sqlsel+= " where r.titulaire_id="+in_titulaire_id;
    }
    if (in_sejour_id){
        sqlsel+= " and r.sejour_id="+in_sejour_id;
    }
	sqlsel+= ";";
            logger('DEBUG',{msg:'Requete : '+sqlsel,nom:this.nom},'40_calcul_sejour');
            
    global.obj.app.db.sqlorder(sqlsel,
            function(rows){
                if (rows) {
                    var date_str=req.moment().format('YYYY-MM-DD');     
					var sqlmaj=[];		
                    logger('DEBUG',{msg:'Date : '+date_str,nom:this.nom},'40_calcul_sejour');
                    for (var l in rows){
                        //console.log('rows',rows[l]);
                        logger('DEBUG',{msg:'Titulaire : '+rows[l].titulaire_id,nom:this.nom},'40_calcul_sejour');
                        logger('DEBUG',{msg:'Séjour : '+rows[l].sejour_id,nom:this.nom},'40_calcul_sejour');
                        logger('DEBUG',{msg:'cout emplacement : '+rows[l].total_empl+' date début: '+rows[l].date_debut+' date fin: '+rows[l].date_fin+' nombre de jour: '+rows[l].nb_jour,nom:this.nom},'40_calcul_sejour');
						
						var nb_jour = rows[l].nb_jour;
						nb_jour= nb_jour.toFixed(2);
						var total_empl = rows[l].total_empl;			
						total_empl= total_empl.toFixed(2);
                        if (total_empl){
							sqlmaj.push("delete from compte_ecriture where  (recu_num is null OR recu_num='')  and (facture_num is null  OR facture_num='') and type_operation = 9 and libelle = 'Emplacement' and sejour_id="+rows[l].sejour_id+";");
                            
							if (rows[l].sejour_clos==0 || (rows[l].sejour_clos==1 && (rows[l].facture_num === null || rows[l].facture_num==''))){
								var uuid=generateUUID();
								var sql="insert into compte_ecriture  (uuid,sejour_id,titulaire_id,type_operation,qte,pu,montant,libelle,date,signe,calcul_solde, index_deb, index_fin) ";
								sql+=" values( '"+uuid+"',"+rows[l].sejour_id+","+rows[l].titulaire_id+",'9','"+nb_jour+"','"+rows[l].prix_empl_jour+"','"+total_empl+"','Emplacement','"+date_str+"','-' "+",'O' "+",'"+rows[l].date_debut+"','"+rows[l].date_fin+"')"+";";
								logger('DEBUG',{msg:'Requete : '+sql,nom:this.nom},'40_calcul_sejour');
								sqlmaj.push(sql);
							}
                        }
						
						//calcul élec
						var total_kwh=0;
						var nb_kwh=0;
						var index_elec_fin=0;
						var periph_elec=obj.app.core.findobj(rows[l].periph_elec_id,'peripheriques');
                        logger('DEBUG',{msg:'sejour clos : '+rows[l].sejour_clos,nom:this.nom},'40_calcul_sejour');
						if (rows[l].sejour_clos==1){
							logger('DEBUG',{msg:'index fin elec sejour : '+rows[l].sejour_elec_fin,nom:this.nom},'40_calcul_sejour');
							index_elec_fin=rows[l].sejour_elec_fin;
						}else{
							if (periph_elec.last_etat) {
                                logger('DEBUG',{msg:'index fin elec memoire : '+periph_elec.last_etat.expression.etat,nom:this.nom},'40_calcul_sejour');
                                index_elec_fin=periph_elec.last_etat.expression.etat;
							}else{
								logger('WARNING',{msg:'index fin elec sejour : '+rows[l].sejour_elec_fin,nom:this.nom},'40_calcul_sejour');
								index_elec_fin=rows[l].sejour_elec_fin;
							}

						}
						logger('DEBUG',{msg:'index_deb_elec : '+rows[l].index_deb_elec,nom:this.nom},'40_calcul_sejour');
						nb_kwh=index_elec_fin-rows[l].index_deb_elec;					
						nb_kwh= nb_kwh.toFixed(2);
						if(nb_kwh<0){
							nb_kwh=0;
							logger('ERROR',{msg:'probleme d index de fin élec',nom:this.nom},'40_calcul_sejour');
						}
						logger('DEBUG',{msg:'nb_kwh : '+nb_kwh,nom:this.nom},'40_calcul_sejour');
						total_kwh=rows[l].prix_elec_kwh*nb_kwh;						
						total_kwh= total_kwh.toFixed(2);
						logger('DEBUG',{msg:'total_kwh : '+total_kwh,nom:this.nom},'40_calcul_sejour');
						
                        if (total_kwh){
							sqlmaj.push("delete from compte_ecriture where  (recu_num is null OR recu_num='')  and (facture_num is null  OR facture_num='') and type_operation = 9 and libelle = 'Electricité' and sejour_id="+rows[l].sejour_id+";");
                            
							if (rows[l].sejour_clos==0 || (rows[l].sejour_clos==1 && (rows[l].facture_num === null || rows[l].facture_num==''))){
								var uuid=generateUUID();
								var sql="insert into compte_ecriture  (uuid,sejour_id,titulaire_id,type_operation,qte,pu,montant,libelle,date,signe,calcul_solde, index_deb, index_fin) ";
								sql+=" values( '"+uuid+"',"+rows[l].sejour_id+","+rows[l].titulaire_id+",'9','"+nb_kwh+"','"+rows[l].prix_elec_kwh+"','"+total_kwh+"','Electricité','"+date_str+"','-' "+",'O' "+",'"+rows[l].index_deb_elec+"','"+index_elec_fin+"')"+";";
								logger('DEBUG',{msg:'Requete : '+sql,nom:this.nom},'40_calcul_sejour');
								sqlmaj.push(sql);
							}
                        }
						
						
						//calcul eau
						var total_m3=0;
						var nb_m3=0;
						var index_eau_fin=0;
						var periph_eau=obj.app.core.findobj(rows[l].periph_eau_id,'peripheriques');
                        logger('DEBUG',{msg:'sejour clos : '+rows[l].sejour_clos,nom:this.nom},'40_calcul_sejour');
						if (rows[l].sejour_clos==1){
							logger('DEBUG',{msg:'index fin eau sejour : '+rows[l].sejour_eau_fin,nom:this.nom},'40_calcul_sejour');
							index_eau_fin=rows[l].sejour_eau_fin;
						}else{
                            if (periph_eau.last_etat) {
                                logger('DEBUG',{msg:'index fin eau memoire : '+periph_eau.last_etat.expression.etat,nom:this.nom},'40_calcul_sejour');
                                index_eau_fin=periph_eau.last_etat.expression.etat;
                            }else{
								logger('WARNING',{msg:'index fin eau sejour : '+rows[l].sejour_eau_fin,nom:this.nom},'40_calcul_sejour');
								index_eau_fin=rows[l].sejour_eau_fin;
							}
						}
						logger('DEBUG',{msg:'index_deb_eau : '+rows[l].index_deb_eau,nom:this.nom},'40_calcul_sejour');
						nb_m3=index_eau_fin- rows[l].index_deb_eau;			
						nb_m3= nb_m3.toFixed(2);	
						if(nb_m3<0){
							nb_m3=0;
							logger('ERROR',{msg:'probleme d index de fin eau',nom:this.nom},'40_calcul_sejour');
						}						
						logger('DEBUG',{msg:'nb_m3 : '+nb_m3,nom:this.nom},'40_calcul_sejour');
						total_m3=rows[l].prix_eau_m3*nb_m3;	
						total_m3= total_m3.toFixed(2);						
						logger('DEBUG',{msg:'total_m3 : '+total_m3,nom:this.nom},'40_calcul_sejour');
						
                        if (total_m3){
							sqlmaj.push("delete from compte_ecriture where  (recu_num is null OR recu_num='')  and (facture_num is null  OR facture_num='') and type_operation = 9 and libelle = 'Eau' and sejour_id="+rows[l].sejour_id+";");
                            var uuid=generateUUID();
							if (rows[l].sejour_clos==0 || (rows[l].sejour_clos==1 && (rows[l].facture_num === null || rows[l].facture_num==''))){
								var sql="insert into compte_ecriture  (uuid,sejour_id,titulaire_id,type_operation,qte,pu,montant,libelle,date,signe,calcul_solde, index_deb, index_fin) ";
								sql+=" values( '"+uuid+"',"+rows[l].sejour_id+","+rows[l].titulaire_id+",'9','"+nb_m3+"','"+rows[l].prix_eau_m3+"','"+total_m3+"','Eau','"+date_str+"','-' "+",'O' "+",'"+rows[l].index_deb_eau+"','"+index_eau_fin+"')"+";";
								logger('DEBUG',{msg:'Requete : '+sql,nom:this.nom},'40_calcul_sejour');
								sqlmaj.push(sql);
							}
                        }
                        //console.log('fin row');
                    }
                }
                //console.log(sqlmaj);
				//console.log('test passe ici');
                logger('DEBUG',{msg:'Début mise à jour: '+sqlmaj,nom:this.nom},'40_calcul_sejour');
                global.obj.app.db.sqltrans(sqlmaj,
                    function(rows){
                        logger('DEBUG',{msg:'Mise à jour des consos : '+rows,nom:this.nom},'40_calcul_sejour');
						if(callback){
							var sqlselcptecr='select * from compte_ecriture where titulaire_id='+in_titulaire_id+' order by 1 desc';

                            global.obj.app.db.sqlorder(sqlselcptecr,
                                function(rows){
                                    callback(rows);
                                });
						}
                });
    });
};

aire_voyage_calcul_sejour.calculsejour=calcul_sejours;

module.exports = aire_voyage_calcul_sejour;