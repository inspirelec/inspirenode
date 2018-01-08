/**
 * Gestion des volets roulants.
 */
var VR={id:52,nom:"Volets_roulants",etat:"OFF",lastrun:null};
var timer=null;
var timer_1=null;
var timer_2=null;
var timer_3=null;
var timer_4=null;
var ete = null;  // été = 1 ou hiver = 0
var nuit = null; // jour = 0 ou nuit = 1
var mode = null; // soleil = 1, confort = 2 , autre = 0
var exe_unique = 0; //exécution unique
var exe_temp = 0;   //  exécution pour limiter les ouvertures/fermetures delai à definir
var delai_temp = 3600000; // delai pour execution temporaire en ms (1h)
var delai_temp_court = 60000; // delai pour execution temporaire en ms (1 min)
var temp_switch_saison = 19; // température de changement entre été et hivers
var temp_confort = 20; // température de confort
var delta_temp_confort = 2; // delta autour de la température de confort (+ ou -)
var seuil_lum=10; // seuil de luminosité pour le jour/nuit

//id de périphérique pour la gestion méteo
var meteo = false;
var id_temp_ext=162;
var id_temp_soleil=228
var id_lumino_ext=268;
var id_vent=226;

var id_vr_1=272; //zone suite
var id_vr_2=276; //zone nuit
var id_vr_3=279; //zone jour

var id_alarme_decl=273;
var id_alarme=280;


VR.start=function(){
    if (VR.etat=='OFF') {
        VR.etat='ON';
        logger('INFO',{msg:'demarrage automation',nom:this.nom},'startstop');
        // boucle toutes les minutes (delai en ms)
        timer=setInterval(function(){
            controleVR();
        }, 60000);
        controleVR();
    }
}

VR.stop=function(){
    if (VR.etat=='ON') {
        VR.etat='OFF';
        logger('INFO',{msg:'extinction automation',nom:this.nom},'startstop');

        clearInterval(timer);
    }
}

function controleVR(){
    VR.lastrun=req.moment().format('DD/MM/YY HH:mm:ss');
    var heure=parseInt(req.moment().format('HH'));
    var minutes=parseInt(req.moment().format('mm'));

    var periph_vr_1=obj.app.core.findobj(id_vr_1,'peripheriques');
    var periph_vr_2=obj.app.core.findobj(id_vr_2,'peripheriques');
    var periph_vr_3=obj.app.core.findobj(id_vr_3,'peripheriques');

    var periph_alarme_decl=obj.app.core.findobj(id_alarme_decl,'peripheriques');
    var periph_alarme=obj.app.core.findobj(id_alarme,'peripheriques');

    if (meteo){
        var periph_temp_ext=obj.app.core.findobj(id_temp_ext,'peripheriques');
        var periph_temp_soleil=obj.app.core.findobj(id_temp_soleil,'peripheriques');
        var periph_vent=obj.app.core.findobj(id_vent,'peripheriques');
        var periph_lumino_ext=obj.app.core.findobj(id_lumino_ext,'peripheriques');
        // derterminer été ou hiver
        if (periph_temp_ext.last_etat && periph_temp_ext.last_etat.expression ) {
            var temp_ext = periph_temp_ext.last_etat.expression.etat;
            if (temp_ext>=temp_switch_saison) {
                if(ete==0){
                    logger('DEBUG',{msg:'Temperature exterieure : '+temp_ext,nom:this.nom},'VR');
                    logger('INFO',{msg:'Temperature été',nom:this.nom},'VR');
                }
                ete = 1;
            }else{
                if(ete==1){
                    logger('DEBUG',{msg:'Temperature exterieure : '+temp_ext,nom:this.nom},'VR');
                    logger('INFO',{msg:'Temperature hiver',nom:this.nom},'VR');
                }
                ete = 0;
            }
        }
        // determiner jour ou nuit
        if (periph_lumino_ext.last_etat && periph_lumino_ext.last_etat.expression ) {
            var lumino_ext = periph_lumino_ext.last_etat.expression.etat;
            if (lumino_ext<=seuil_lum) {
                if(nuit==0){
                    logger('DEBUG',{msg:'Luminosité exterieure : '+lumino_ext,nom:this.nom},'VR');
                    logger('INFO',{msg:'Nuit',nom:this.nom},'VR');
                }
                nuit = 1;

            }else{
                if(nuit==1){
                    logger('DEBUG',{msg:'Luminosité exterieure : '+lumino_ext,nom:this.nom},'VR');
                    logger('INFO',{msg:'Jour',nom:this.nom},'VR');
                }
                nuit = 0;
                // remise zero de l'exécution unique tout les jours
                exe_unique = 0;
            }
        }

        //determiner si soleil, température de confort ou autre
        if (periph_temp_ext.last_etat && periph_temp_ext.last_etat.expression
            && periph_temp_soleil.last_etat && periph_temp_soleil.last_etat.expression ) {
            var temp_ext = periph_temp_ext.last_etat.expression.etat;
            var temp_soleil = periph_temp_soleil.last_etat.expression.etat;
            var diff_temp  =  temp_soleil - temp_ext;
            if(diff_temp>5){
                if(mode != 1){
                    logger('DEBUG',{msg:'Temperature soleil : '+temp_soleil,nom:this.nom},'VR');
                    logger('DEBUG',{msg:'Temperature exterieure : '+temp_ext,nom:this.nom},'VR');
                    logger('DEBUG',{msg:'Mode Soleil',nom:this.nom},'VR');
                }
                // mode soleil
                mode = 1;

            }else{
                if(diff_temp < 3){
                    if(mode != 0){
                        logger('DEBUG',{msg:'Temperature soleil : '+temp_soleil,nom:this.nom},'VR');
                        logger('DEBUG',{msg:'Temperature exterieure : '+temp_ext,nom:this.nom},'VR');
                        logger('DEBUG',{msg:'Mode Autre',nom:this.nom},'VR');
                    }
                    // mode autre
                    mode = 0;
                }
            }
            if(mode == 0 && temp_ext<=temp_confort+delta_temp_confort && temp_ext>=temp_confort-delta_temp_confort){
                if(mode != 2){
                    logger('DEBUG',{msg:'Temperature soleil : '+temp_soleil,nom:this.nom},'VR');
                    logger('DEBUG',{msg:'Temperature exterieure : '+temp_ext,nom:this.nom},'VR');
                    logger('DEBUG',{msg:'Mode confort',nom:this.nom},'VR');
                }
                //mode confort
                mode = 2;
            }
        }
        if(periph_alarme_decl.last_etat.expression.etat != 1){
            if(periph_alarme.last_etat.expression.etat == 1){
                if (nuit == 1 && exe_unique == 0){
                    //Scénario nuit
                    periph_vr_1.set_etat('DOWN',null,function(){});
                    periph_vr_2.set_etat('DOWN',null,function(){});
                    periph_vr_3.set_etat('DOWN',null,function(){});
                    exe_unique = 1;
                    logger('INFO',{msg:'Fermeture VR nuit',nom:this.nom},'VR');
                }

                if (nuit == 0 && exe_temp == 0){
                    //Scénario journée et delai entre 2 actions
                    if (ete == 1) {
                        //Scénario été
                        if (mode == 1) {
                            // conservation de la fraicheur intérieur
                            periph_vr_1.set_etat('DOWN',null,function(){});
                            periph_vr_2.set_etat('DOWN',null,function(){});
                            exe_temp = 1;
                            timer_1=setTimeout(function(){
                                exe_temp = 0;
                            }, delai_temp);
                            logger('INFO',{msg:'Fermeture VR',nom:this.nom},'VR');
                        }
                        if (mode == 2 || mode == 0) {
                            // profiter de la luminosité extérieure
                            //periph_vr_1.set_etat(periph_vr_1,'UP',null,function(){});
                            periph_vr_2.set_etat('UP',null,function(){});
                            exe_temp = 1;
                            timer_2=setTimeout(function(){
                                exe_temp = 0;
                            }, delai_temp_court);
                            logger('INFO',{msg:'Ouverture VR',nom:this.nom},'VR');
                        }

                    }else{
                        //Scénario hiver
                        if (mode == 1 || mode == 2) {
                            // recuperation de chaleur du soleil
                            //periph_vr_1.set_etat(periph_vr_1,'UP',null,function(){});
                            periph_vr_2.set_etat('UP',null,function(){});
                            exe_temp = 1;
                            timer_3=setTimeout(function(){
                                exe_temp = 0;
                            }, delai_temp);
                            logger('INFO',{msg:'Ouverture VR',nom:this.nom},'VR');
                        }
                        if (mode == 0) {
                            // conservation de la chaleur
                            periph_vr_1.set_etat('DOWN',null,function(){});
                            periph_vr_2.set_etat('DOWN',null,function(){});
                            exe_temp = 1;
                            timer_4=setTimeout(function(){
                                exe_temp = 0;
                            }, delai_temp_court);
                            logger('INFO',{msg:'Fermeture VR',nom:this.nom},'VR');
                        }

                    }
                }
            }
        }
        if(periph_vent.last_etat.expression.etat > 80){
            periph_vr_3.set_etat('UP',null,function(){});
            logger('INFO',{msg:'Rafale de vent ouverture BSO',nom:this.nom},'VR');
        }
    }
    else{
        logger('DEBUG',{msg:'Alarme Déclanchée : '+periph_alarme_decl.last_etat.expression.etat,nom:this.nom},'VR');
        if(periph_alarme_decl.last_etat.expression.etat != 1){
            logger('DEBUG',{msg:'Alarme active : '+periph_alarme.last_etat.expression.etat,nom:this.nom},'VR');
            if(periph_alarme.last_etat.expression.etat == 1){
                if((heure >= 21 && heure < 24) || (heure >= 0 && heure < 8) ){
                    periph_vr_1.set_etat('DOWN',null,function(){});
                    periph_vr_2.set_etat('DOWN',null,function(){});
                    periph_vr_3.set_etat('DOWN',null,function(){});
                    logger('INFO',{msg:'Fermeture des volets',nom:this.nom},'VR');
                }
                if(heure >= 8 && heure < 21){
                    periph_vr_1.set_etat('UP',null,function(){});
                    periph_vr_2.set_etat('UP',null,function(){});
                    periph_vr_3.set_etat('UP',null,function(){});
                    logger('INFO',{msg:'Ouverture des volets',nom:this.nom},'VR');
                }
            }
        }
    }

}





module.exports = VR;