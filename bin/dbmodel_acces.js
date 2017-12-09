/**
 * New node file
 */

var database = {"name" : "mydb_acces.db",
				"application" : "inspireacces",
				"descriptif" : "Base de donnée inspireatacces",
				"menus": [{"id" : "box", "titre" : "Boxs", "action" : "box", "image" : "../images/zcarte-8-relais-ethernet-ip-ipx800-v3.jpg"},
			               {"id" : "categ", "titre" : "Catégories", "action" : "categorie", "image" : "../images/light50.png"},
			               {"id" : "tag", "titre" : "Tags", "action" : "tag", "image" : "../images/pomieszczenia.png"},
			               {"id" : "periphs", "titre" : "Periphériques", "action" : "peripherique", "image" : "../images/onoff100.png"},
			               /*{"id" : "periphsalarme", "titre" : "Periphériques alarme", "action" : "peripheriquealarme", "image" : "../images/alarm100.png"},
			               {"id" : "peripheriquedeporte", "titre" : "Periphériques déportés", "action" : "peripheriquedeporte", "image" : "../images/onoff0.png"},
			               {"id" : "periphschauff", "titre" : "Periphériques chauffage", "action" : "peripheriquechauff", "image" : "../images/termometr.png"},
			               {"id" : "periphsbatterie", "titre" : "Periphériques batterie", "action" : "peripheriquebatterie", "image" : "../images/pile.png"},
			               {"id" : "mode", "titre" : "Modes", "action" : "mode", "image" : "../images/confort.png"},
			               {"id" : "mode", "titre" : "Modes activ. différé", "action" : "modeactivationdiff", "image" : "../images/confort.png"},
			               {"id" : "type", "titre" : "Types", "action" : "type", "image" : "../images/type.png"},
			               {"id" : "consigne_temp", "titre" : "Consignes chauffage", "action" : "consigne_temp", "image" : "../images/confort.png"},
			               */{"id" : "user", "titre" : "Utilisateurs", "action" : "utilisateurs", "image" : "../images/user.jpg"},
			               {"id" : "reservations", "titre" : "Reservations", "action" : "reservations", "image" : "../images/log.jpg"},
			               {"id" : "image", "titre" : "Images", "action" : "images", "image" : "../images/images.jpg"},
			              // {"id" : "log", "titre" : "Logs", "action" : "log", "image" : "../images/log.jpg"},
			               {"id" : "automation", "titre" : "Automation", "action" : "automation", "image" : "../images/log.jpg"},
			               {"id" : "contantes", "titre" : "Contantes", "action" : "constantes", "image" : "../images/constantes.jpg"},
			               {"id" : "box_virtuel_etat", "titre" : "Etat boxs virtuelles", "action" : "box_virtuel_etat", "image" : "../images/constantes.jpg"},
			               {"id" : "servicemsg", "titre" : "Service Message", "action" : "servicemsg", "image" : "../images/log.jpg"}
			               ],
				"tables": [
					{"name": "box", "in_database":true,
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
						             {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
						             {"name" : "nom" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "user_auth" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "password_auth" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "model" , "type" : "TEXT","formulaire" : "select" , "object" : [{"id":"ipx800","nom":"ipx800"},
						                                                                                       {"id":"zwayme","nom":"zwayme"},
						                                                                                       {"id":"zibase","nom":"zibase"},
						                                                                                       {"id":"zipato","nom":"zipato"},
						                                                                                       {"id":"eco device","nom":"eco device"},
						                                                                                       {"id":"fibaro","nom":"fibaro"},
						                                                                                       {"id":"virtuel","nom":"virtuel"},
						                                                                                       {"id":"infoOS","nom":"infoOS"},
						                                                                                       {"id":"sonos","nom":"sonos"},
						                                                                                       {"id":"cameraipfoscam","nom":"camera ip foscam"},
						                                                                                       {"id":"cameradomesony","nom":"camera dome sony"},
						                                                                                       {"id":"i2c","nom":"i2c raspberry"},
						                                                                                       {"id":"domoticz","nom":"domoticz"},
						                                                                                       {"id":"inspirenode_box","nom":"inspirenode_box"},
						                                                                                       {"id":"inspirenode_periph","nom":"inspirenode_periph"}
																												]},
						             {"name" : "ip" , "type" : "TEXT","formulaire" : "input" },
						             {"name" : "port" , "type" : "TEXT","formulaire" : "input" }
						             ],
					"actionsdetail" : [{"name" : "Etat Box", "type" : "button", "action" : "index?type=get&action=boxetat"}
					                   ],
					"actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
					                       {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
					                       {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
	                   					]
					},
					{"name": "box_virtuel_etat", "in_database":true,
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
						             {"name" : "id_box" , "type" : "TEXT","formulaire" : "label" , "linkobject" : "box"},
						             {"name" : "id_peripherique" , "type" : "TEXT","formulaire" : "label" , "linkobject" : "peripherique"},
						             {"name" : "value" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "last_command" , "type" : "TEXT","formulaire" : "select" , "object" : [{"id":"ON","nom":"ON"},
						                                                                                       {"id":"OFF","nom":"OFF"},
						                                                                                       {"id":"DIM","nom":"DIM"},
						                                                                                       {"id":"UP","nom":"UP"},
						                                                                                       {"id":"DOWN","nom":"DOWN"}
																												]}
						             ],
					"actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
					                       {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
					                       {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
	                   					]
					},
					{"name": "mode","in_database":true,
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
						             {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
						             {"name" : "nom" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "codei18n" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "icon" , "type" : "TEXT","formulaire" : "select" , "linkobject" : "images"}
						             ],
						"actionsdetail" : [{"name" : "Activer ce mode", "type" : "button", "action" : "index?type=get&action=activemode"},
						                   {"name" : "Calcul consigne", "type" : "button", "action" : "index?type=get&action=calculconsignemode"}
						                   ],
						"actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
						                       {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
						                       {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
		                   					]
					},
					{"name": "modeactivationdiff","in_database":true,
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
						             {"name" : "mode" , "type" : "TEXT","formulaire" : "select" , "linkobject" : "mode"},
						             {"name" : "heure" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "date" , "type" : "TEXT","formulaire" : "input" }
						             ],
						"actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
						                       {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
						                       {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
		                   					]
					},
					{"name": "type","in_database":true,
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
						             {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
						             {"name" : "nom" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "codei18n" , "type" : "TEXT","formulaire" : "input"}
						             ],
						"actionsdetail" : [{"name" : "Activer ce type", "type" : "button", "action" : "index?type=get&action=activetype"}
						                   ],
						"actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
						                       {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
						                       {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
		                   					]
					},
					{"name": "consigne_temp","in_database":true,
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
						             {"name" : "mode" , "type" : "TEXT","formulaire" : "select", "linkobject" : "mode"},
						             {"name" : "tag" , "type" : "TEXT","formulaire" : "select", "linkobject" : "tag"},
						             {"name" : "heure" , "type" : "TEXT","formulaire" : "select" , "object" : [{"id":"0h00","nom":"0h00"},{"id":"0h15","nom":"0h15"},{"id":"0h30","nom":"0h30"},{"id":"0h45","nom":"0h45"},{"id":"1h00","nom":"1h00"},{"id":"1h15","nom":"1h15"},{"id":"1h30","nom":"1h30"},{"id":"1h45","nom":"1h45"},{"id":"2h00","nom":"2h00"},{"id":"2h15","nom":"2h15"},{"id":"2h30","nom":"2h30"},{"id":"2h45","nom":"2h45"},{"id":"3h00","nom":"3h00"},{"id":"3h15","nom":"3h15"},{"id":"3h30","nom":"3h30"},{"id":"3h45","nom":"3h45"},{"id":"4h00","nom":"4h00"},{"id":"4h15","nom":"4h15"},{"id":"4h30","nom":"4h30"},{"id":"4h45","nom":"4h45"},{"id":"5h00","nom":"5h00"},{"id":"5h15","nom":"5h15"},{"id":"5h30","nom":"5h30"},{"id":"5h45","nom":"5h45"},{"id":"6h00","nom":"6h00"},{"id":"6h15","nom":"6h15"},{"id":"6h30","nom":"6h30"},{"id":"6h45","nom":"6h45"},{"id":"7h00","nom":"7h00"},{"id":"7h15","nom":"7h15"},{"id":"7h30","nom":"7h30"},{"id":"7h45","nom":"7h45"},{"id":"8h00","nom":"8h00"},{"id":"8h15","nom":"8h15"},{"id":"8h30","nom":"8h30"},{"id":"8h45","nom":"8h45"},{"id":"9h00","nom":"9h00"},{"id":"9h15","nom":"9h15"},{"id":"9h30","nom":"9h30"},{"id":"9h45","nom":"9h45"},{"id":"10h00","nom":"10h00"},{"id":"10h15","nom":"10h15"},{"id":"10h30","nom":"10h30"},{"id":"10h45","nom":"10h45"},{"id":"11h00","nom":"11h00"},{"id":"11h15","nom":"11h15"},{"id":"11h30","nom":"11h30"},{"id":"11h45","nom":"11h45"},{"id":"12h00","nom":"12h00"},{"id":"12h15","nom":"12h15"},{"id":"12h30","nom":"12h30"},{"id":"12h45","nom":"12h45"},{"id":"13h00","nom":"13h00"},{"id":"13h15","nom":"13h15"},{"id":"13h30","nom":"13h30"},{"id":"13h45","nom":"13h45"},{"id":"14h00","nom":"14h00"},{"id":"14h15","nom":"14h15"},{"id":"14h30","nom":"14h30"},{"id":"14h45","nom":"14h45"},{"id":"15h00","nom":"15h00"},{"id":"15h15","nom":"15h15"},{"id":"15h30","nom":"15h30"},{"id":"15h45","nom":"15h45"},{"id":"16h00","nom":"16h00"},{"id":"16h15","nom":"16h15"},{"id":"16h30","nom":"16h30"},{"id":"16h45","nom":"16h45"},{"id":"17h00","nom":"17h00"},{"id":"17h15","nom":"17h15"},{"id":"17h30","nom":"17h30"},{"id":"17h45","nom":"17h45"},{"id":"18h00","nom":"18h00"},{"id":"18h15","nom":"18h15"},{"id":"18h30","nom":"18h30"},{"id":"18h45","nom":"18h45"},{"id":"19h00","nom":"19h00"},{"id":"19h15","nom":"19h15"},{"id":"19h30","nom":"19h30"},{"id":"19h45","nom":"19h45"},{"id":"20h00","nom":"20h00"},{"id":"20h15","nom":"20h15"},{"id":"20h30","nom":"20h30"},{"id":"20h45","nom":"20h45"},{"id":"21h00","nom":"21h00"},{"id":"21h15","nom":"21h15"},{"id":"21h30","nom":"21h30"},{"id":"21h45","nom":"21h45"},{"id":"22h00","nom":"22h00"},{"id":"22h15","nom":"22h15"},{"id":"22h30","nom":"22h30"},{"id":"22h45","nom":"22h45"},{"id":"23h00","nom":"23h00"},{"id":"23h15","nom":"23h15"},{"id":"23h30","nom":"23h30"},{"id":"23h45","nom":"23h45"}]},
						             {"name" : "valeur" , "type" : "TEXT","formulaire" : "select" , "object" : [{"id":"5","nom":"5�"},{"id":"5.5","nom":"5.5�"},{"id":"6","nom":"6�"},{"id":"6.5","nom":"6.5�"},{"id":"7","nom":"7�"},{"id":"7.5","nom":"7.5�"},{"id":"8","nom":"8�"},{"id":"8.5","nom":"8.5�"},{"id":"9","nom":"9�"},{"id":"9.5","nom":"9.5�"},{"id":"10","nom":"10�"},{"id":"10.5","nom":"10.5�"},{"id":"11","nom":"11�"},{"id":"11.5","nom":"11.5�"},{"id":"12","nom":"12�"},{"id":"12.5","nom":"12.5�"},{"id":"13","nom":"13�"},{"id":"13.5","nom":"13.5�"},{"id":"14","nom":"14�"},{"id":"14.5","nom":"14.5�"},{"id":"15","nom":"15�"},{"id":"15.5","nom":"15.5�"},{"id":"16","nom":"16�"},{"id":"16.5","nom":"16.5�"},{"id":"17","nom":"17�"},{"id":"17.5","nom":"17.5�"},{"id":"18","nom":"18�"},{"id":"18.5","nom":"18.5�"},{"id":"19","nom":"19�"},{"id":"19.5","nom":"19.5�"},{"id":"20","nom":"20�"},{"id":"20.5","nom":"20.5�"},{"id":"21","nom":"21�"},{"id":"21.5","nom":"21.5�"},{"id":"22","nom":"22�"},{"id":"22.5","nom":"22.5�"},{"id":"23","nom":"23�"},{"id":"23.5","nom":"23.5�"},{"id":"24","nom":"24�"},{"id":"24.5","nom":"24.5�"},{"id":"25","nom":"25�"},{"id":"25.5","nom":"25.5�"},{"id":"26","nom":"26�"},{"id":"26.5","nom":"26.5�"},{"id":"27","nom":"27�"},{"id":"27.5","nom":"27.5�"},{"id":"28","nom":"28�"},{"id":"28.5","nom":"28.5�"},{"id":"29","nom":"29�"},{"id":"29.5","nom":"29.5�"},{"id":"30","nom":"30�"}]},
						             {"name" : "jours" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "joure" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "heures" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "heuree" , "type" : "TEXT","formulaire" : "input"}
						             ],
						"tables_compl" : [{"name" : "consigne_temp_jours", "soustable_name" : "jours" ,"formulaire" : "checkbox"}
					                   ],
						"actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
						                       {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
						                       {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
		                   					]
					},
					{"name": "consigne_temp_jours","in_database":true,
						"colonnes": [
						             {"name" : "id_consigne_temp" , "type" : "integer"},
						             {"name" : "id_jours" , "type" : "TEXT"}
						             ]
					},
					{"name": "jours","in_database":false,
						"colonnes": [{"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
						             {"name" : "nom" , "type" : "TEXT","formulaire" : "label"}],
						"object" : [{"id":"Lu","nom":"Lundi"},{"id":"Ma","nom":"Mardi"},{"id":"Me","nom":"Mercredi"},{"id":"Je","nom":"Jeudi"},{"id":"Ve","nom":"Vendredi"},{"id":"Sa","nom":"Samedi"},{"id":"Di","nom":"Dimanche"}]
					},
					{"name": "tag", "in_database":true,
						"colonnes" : [
						              {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
						              {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "nom" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "codei18n" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "position_x" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "position_y" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "icon" , "type" : "TEXT" ,"formulaire" : "select" , "linkobject" : "images"},
						              {"name" : "parent_tag" , "type" : "integer" ,"formulaire" : "select" , "linkobject" : "tag"},
						              {"name" : "visible" , "type" : "TEXT", "formulaire" : "select" , "object" : [{"id":"N","nom":"Non visible"},
							                                                                                       {"id":"O","nom":"Visible"}
							                                                                                      ]},
						              {"name" : "type" , "type" : "TEXT", "formulaire" : "select" , "object" : [{"id":"Batiment","nom":"Batiment"},
							                                                                                       {"id":"Piece","nom":"Piece"}
						              																			]},
						              {"name" : "typeprog" , "type" : "TEXT", "formulaire" : "select" , "object" : [{"id":"Programmation","nom":"Programmation"},
								                                                                                       {"id":"Reservation","nom":"Reservation"}
                                      																			]},
						              {"name" : "code_liste" , "type" : "TEXT","formulaire" : "select","linkobject" : "liste_inventaire"}
						              ],
						"actionsdetail" : [{"name" : "Objet serveur", "type" : "button", "action" : "index?type=get&action=afficheobject&typeobj=tags"}
										],
						"actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
						                       {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
						                       {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
		                   					]
					},
					{"name": "categorie", "in_database":true,
						"colonnes" : [
						              {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
						              {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "nom" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "couleur_fond" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "couleur_text" , "type" : "TEXT","formulaire" : "select" , "object" : [{"id":"noir","nom":"Noir"},
								                                                                                      {"id":"blanc","nom":"blanc"}]},
						              {"name" : "codei18n" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "textmin" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "textmax" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "textmidle" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "iconmin" , "type" : "TEXT","formulaire" : "select" , "linkobject" : "images"},
						              {"name" : "iconmax" , "type" : "TEXT","formulaire" : "select" , "linkobject" : "images"},
						              {"name" : "iconmidle" , "type" : "TEXT","formulaire" : "select" , "linkobject" : "images"},
						              {"name" : "type" , "type" : "TEXT","formulaire" : "select" , "object" : [{"id":"autre","nom":"autre"},
						                                                                                       {"id":"sonde_de_temperature","nom":"sonde_de_temperature"},
						                                                                                       {"id":"element_de_chauffage","nom":"element_de_chauffage"},
						                                                                                       {"id":"sonde_autre","nom":"sonde_autre"},
						                                                                                       {"id":"alarme","nom":"alarme"},
						                                                                                       {"id":"camera","nom":"camera"},
						                                                                                       {"id":"declencheur_alarme","nom":"declencheur_alarme"},
						                                                                                       {"id":"sirene_alarme","nom":"sirene_alarme"},
						                                                                                       {"id":"batterie","nom":"batterie"}]}
						              ],
						"actionsdetail" : [{"name" : "Objet serveur", "type" : "button", "action" : "index?type=get&action=afficheobject&typeobj=categories"}
					                   ],
						"actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
						                       {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
						                       {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
		                   					]
					},
					{"name": "peripherique", "in_database":true,
						"colonnes" : [
						              {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
						              {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
						            	  
						              {"name" : "nom" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "codei18n" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "box_id" , "type" : "integer","formulaire" : "select" , "linkobject" : "box"},
							          {"name" : "inspireathome_box_id" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "box_identifiant" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "box_type" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "box_protocole" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "visibilite" , "type" : "TEXT", "formulaire" : "select" , "object" : [{"id":"non visible","nom":"Non visible"},
								                                                                                       {"id":"visible","nom":"Visible"}
                                      																				]},
									 	
						              {"name" : "categorie_id" , "type" : "integer","formulaire" : "select" , "linkobject" : "categorie"},
						              {"name" : "ecriture_type" , "type" : "TEXT","formulaire" : "select" , "object" : [{"id":"SANS","nom":"autre"},
									                                                                                       {"id":"BINAIRE","nom":"on/off"},
									                                                                                       {"id":"VARIABLE","nom":"Variable"},
									                                                                                       {"id":"BINVAR","nom":"on/off/Variable"},
									                                                                                       {"id":"PLAYER","nom":"Player Multim�dia"},
									                                                                                       {"id":"VOLETR","nom":"Volet Roulant"},
									                                                                                       {"id":"VOLETRVARIABLE","nom":"Volet Roulant variable"},
									                                                                                       {"id":"CHAUDIERE","nom":"Chaudiere"},
									                                                                                       {"id":"ALARME","nom":"On/Off avec code pin"},
									                                                                                       {"id":"INFOS","nom":"Infos"},
									                                                                                       {"id":"BATTERIE","nom":"Batterie visible si etat # null"}]},
						              {"name" : "ecriture_max_value" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "ecriture_min_value" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "ecriture_value" , "type" : "TEXT"},
						              {"name" : "ecriture_etat_ON" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "ecriture_etat_OFF" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "ecriture_etat_DIM" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "ecriture_etat_UP" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "ecriture_etat_DOWN" , "type" : "TEXT","formulaire" : "input"},
						            	  
						              {"name" : "lecture_type" , "type" : "TEXT"},
						              {"name" : "lecture_max_value" , "type" : "TEXT"},
						              {"name" : "lecture_min_value" , "type" : "TEXT"},
						              {"name" : "lecture_value" , "type" : "TEXT"},
						              
						              {"name" : "lecture_etat_expr" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "lecture_compl_hist" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "lecture_expr1" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "lecture_expr1_unit" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "lecture_expr2" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "lecture_expr2_unit" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "lecture_expr3" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "lecture_expr3_unit" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "ajustement" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "limitebasse2" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "limitebasse" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "limitehaute" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "on_acceuil" , "type" : "TEXT","formulaire" : "input"}
						              ],
						 "tables_compl" : [{"name" : "peripherique_tag", "soustable_name" : "tag" ,"formulaire" : "checkbox"},
						                   {"name" : "peripherique_user_acceuil", "soustable_name" : "utilisateurs" ,"formulaire" : "checkbox"}
						                   ],
						 "actionsdetail" : [{"name" : "ON", "type" : "button", "action" : "index?type=set&action=ON"},
						                    {"name" : "OFF", "type" : "button", "action" : "index?type=set&action=OFF"},
						                    {"name" : "DIM", "type" : "slider", "max_field":"ecriture_max_value","min_field":"ecriture_min_value","action" : "index?type=set&action=DIM&val="},
						                    {"name" : "UP", "type" : "button", "action" : "index?type=set&action=UP"},
						                    {"name" : "DOWN", "type" : "button", "action" : "index?type=set&action=DOWN"},
						                    {"name" : "Etat box", "type" : "button", "action" : "index?type=get&action=periphboxetat"},
						                    {"name" : "Etat peripherique", "type" : "button", "action" : "index?type=get&action=periphetat"},
						                    {"name" : "Result expressions", "type" : "button", "action" : "index?type=get&action=periphexpress"},
						                    {"name" : "Objet serveur", "type" : "button", "action" : "index?type=get&action=afficheobject&typeobj=peripheriques"}
															
						                    ],
							                
						"actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
						                       {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
						                       {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
		                   					]
					
					},
					{"name": "peripherique_tag","in_database":true,
						"colonnes": [
						             {"name" : "id_peripherique" , "type" : "integer"},
						             {"name" : "id_tag" , "type" : "integer"}
						             ]
					},
					{"name": "peripherique_user_acceuil","in_database":true,
							"colonnes": [
							             {"name" : "id_peripherique" , "type" : "integer"},
							             {"name" : "id_utilisateurs" , "type" : "integer"}
							             ]
					},
					{"name": "peripheriquedeporte", "in_database":true,
						"colonnes" : [
						              {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
						              {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
						            	  
						              {"name" : "nom" , "type" : "TEXT","formulaire" : "input"},
							          {"name" : "box_id" , "type" : "integer","formulaire" : "select" , "linkobject" : "box"},
						              {"name" : "box_identifiant" , "type" : "TEXT","formulaire" : "select" , "object" : [{"id":"peripheriques","nom":"Peripheriques std"},
									                                                                                       {"id":"peripheriques_chauffage","nom":"Peripheriques chauffage"}
										]},
						              {"name" : "box_type" , "type" : "TEXT","formulaire" : "input"},
						              /*{"name" : "box_protocole" , "type" : "TEXT","formulaire" : "input"},*/
						              {"name" : "visibilite" , "type" : "TEXT", "formulaire" : "select" , "object" : [{"id":"non visible","nom":"Non visible"},
								                                                                                       {"id":"visible","nom":"Visible"}
                                      																				]},
									 	
						              {"name" : "categorie_id" , "type" : "integer","formulaire" : "select" , "linkobject" : "categorie"},
					              ],
						 "tables_compl" : [{"name" : "peripheriquedeporte_tag", "soustable_name" : "tag" ,"formulaire" : "checkbox"},
						                   {"name" : "peripheriquedeporte_user_acceuil", "soustable_name" : "utilisateurs" ,"formulaire" : "checkbox"}
						                   ],
						 "actionsdetail" : [{"name" : "ON", "type" : "button", "action" : "index?type=set&action=ON"},
						                    {"name" : "OFF", "type" : "button", "action" : "index?type=set&action=OFF"},
						                    {"name" : "DIM", "type" : "slider", "max_field":"ecriture_max_value","min_field":"ecriture_min_value","action" : "index?type=set&action=DIM&val="},
						                    {"name" : "UP", "type" : "button", "action" : "index?type=set&action=UP"},
						                    {"name" : "DOWN", "type" : "button", "action" : "index?type=set&action=DOWN"},
						                    {"name" : "Etat box", "type" : "button", "action" : "index?type=get&action=periphboxetat"},
						                    {"name" : "Etat peripherique", "type" : "button", "action" : "index?type=get&action=periphetat"},
						                    {"name" : "Result expressions", "type" : "button", "action" : "index?type=get&action=periphexpress"},
						                    {"name" : "Objet serveur", "type" : "button", "action" : "index?type=get&action=afficheobject&typeobj=peripheriquesdeportes"}
															
						                    ],
							                
						"actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
						                       {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
						                       {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
		                   					]
					
					},
					{"name": "peripheriquedeporte_tag","in_database":true,
						"colonnes": [
						             {"name" : "id_peripheriquedeporte" , "type" : "integer"},
						             {"name" : "id_tag" , "type" : "integer"}
						             ]
					},
					{"name": "peripheriquedeporte_user_acceuil","in_database":true,
							"colonnes": [
							             {"name" : "id_peripheriquedeporte" , "type" : "integer"},
							             {"name" : "id_utilisateurs" , "type" : "integer"}
							             ]
					},
					{"name": "utilisateurs","in_database":true,
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
							         {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
							         {"name" : "user" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "password" , "type" : "TEXT","formulaire" : "password"},
							         {"name" : "codeacces" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "badge_numero" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "badge_abonnement_date_debut" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "badge_abonnement_date_fin" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "societe" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "descriptif_activite" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "siret" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "nom" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "prenom" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "adresse1" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "adresse2" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "codepostal" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "ville" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "pays" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "email" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "telephone" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "telephone_portable" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "fax" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "validkey" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "afficheaide" , "type" : "TEXT","formulaire" : "input"},
						             
							         {"name" : "type" , "type" : "TEXT","formulaire" : "select" , "object" : [{"id":"CLIENT","nom":"Client"},
							                                                                                  {"id":"SERVICE","nom":"Service"},
							                                                                                  {"id":"ADMINISTRATEUR","nom":"Administrateur"},
								                                                                              {"id":"GERANT","nom":"Gérant"}]},

						             ],					
					"actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
					                       {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
					                       {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
	                   					]
					},
					{"name": "cpville","in_database":true,
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
						             {"name" : "departement" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "slug" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "nom" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "nom_simple" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "nom_reel" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "nom_soundex" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "nom_metaphone" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "codepostal" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "numero_commune" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "code_insee" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "arrondissement" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "canton" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "canton2" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "popul_2010" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "popul_1999" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "popul_2012" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "densite_2010" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "superficie_kmcar" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "longitude_deg" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "latitude_deg" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "longitude_grd" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "latitude_grd" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "longitude_dms" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "latitude_dms" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "altitude_min" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "altitude_max" , "type" : "TEXT","formulaire" : "input"}
						             ]
					},
					{"name": "reservations","in_database":true,
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
							         {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
							         {"name" : "clientid" , "type" : "TEXT","formulaire" : "select","linkobject" : "utilisateurs"},
							         {"name" : "start" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "end" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "title" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "cde_no" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "cde_validcode" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "montant_tot_cde" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "cde_dat" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "salle" , "type" : "integer" ,"formulaire" : "select" , "linkobject" : "tag"},
							         
							         //{"name" : "constraint" , "type" : "TEXT","formulaire" : "input"},
							         
							         {"name" : "etat" , "type" : "TEXT","formulaire" : "select" , "object" : [{"id":"COMMANDE","nom":"En commande"},
							                                                                                  {"id":"PAIEMENT","nom":"En paiement"},
								                                                                              {"id":"ACTIF","nom":"Actif"},
								                                                                              {"id":"CLOS","nom":"Clos"}]},
	                                 {"name" : "supprime" , "type" : "TEXT","formulaire" : "select" , "object" : [{"id":"N","nom":"Non"},
								                                                                              {"id":"O","nom":"Oui"}]}
							         ],					
					"actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
					                       {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
					                       {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
	                   					]
					},
					{"name": "retourpaiement","in_database":true,
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
						             {"name" : "numcli" , "type" : "TEXT","formulaire" : "label"},
							         {"name" : "exer" , "type" : "TEXT","formulaire" : "label"},
							         {"name" : "refdet" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "objet" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "montant" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "mel" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "saisie" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "resultrans" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "numauto" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "dattrans" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "heurtrans" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "remoteipinspirelec" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "remoteiptipi" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "dnsadrinspirelec" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "dnsadrtipi" , "type" : "TEXT","formulaire" : "input"}
							         
							         ],					
					"actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
					                       {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
					                       {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
	                   					]
					}
					,
					{"name": "constantes","in_database":true,
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
						             {"name" : "code" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "nom" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "valeur" , "type" : "TEXT","formulaire" : "input"}
						             ]	,					
						 "actionsdetail" : [{"name" : "Objet serveur", "type" : "button", "action" : "index?type=get&action=afficheobject&typeobj=constantes"}
															
						                    ],						             
						 "actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
					                       {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
					                       {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
	                   					]
					},
					{"name": "historique","in_database":true,
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement"},
						             {"name" : "etat" , "type" : "TEXT"},
						             {"name" : "expr1" , "type" : "TEXT"},
						             {"name" : "expr2" , "type" : "TEXT"},
						             {"name" : "expr3" , "type" : "TEXT"},
						             {"name" : "expr1_unit" , "type" : "TEXT"},
						             {"name" : "expr2_unit" , "type" : "TEXT"},
						             {"name" : "expr3_unit" , "type" : "TEXT"},
						             {"name" : "timestamp" , "type" : "TEXT"},
						             {"name" : "uuid" , "type" : "TEXT"}
						             ]
					},
					{"name": "peripheriquechauff", "in_database":false,
						"colonnes" : [
						              {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
						              {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
							          {"name" : "box_id" , "type" : "integer","formulaire" : "label" , "linkobject" : "box"},
						              {"name" : "box_identifiant" , "type" : "TEXT","formulaire" : "label"},  
						              {"name" : "nom" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "visibilite" , "type" : "TEXT", "formulaire" : "label" , "object" : [{"id":"non visible","nom":"Non visible"},
								                                                                                       {"id":"visible","nom":"Visible"}
                                      																				]},
									 	
						              {"name" : "ecriture_type" , "type" : "TEXT","formulaire" : "label" , "object" : [{"id":"SANS","nom":"autre"},
									                                                                                       {"id":"BINAIRE","nom":"on/off"},
									                                                                                       {"id":"VARIABLE","nom":"Variable"},
									                                                                                       {"id":"BINVAR","nom":"on/off/Variable"},
									                                                                                       {"id":"PLAYER","nom":"Player Multim�dia"},
									                                                                                       {"id":"VOLETR","nom":"Volet Roulant"},
									                                                                                       {"id":"VOLETRVARIABLE","nom":"Volet Roulant variable"},
									                                                                                       {"id":"CHAUDIERE","nom":"Chaudiere"},
									                                                                                       {"id":"ALARME","nom":"On/Off avec code pin"},
									                                                                                       {"id":"BATTERIE","nom":"Batterie visible si etat # null"}]},
						              {"name" : "ecriture_max_value" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "ecriture_min_value" , "type" : "TEXT","formulaire" : "label"},
						            	  
						              {"name" : "lecture_etat_expr" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "lecture_compl_hist" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "lecture_expr1" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "lecture_expr1_unit" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "lecture_expr2" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "lecture_expr2_unit" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "lecture_expr3" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "lecture_expr3_unit" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "etat2" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "on_acceuil" , "type" : "TEXT","formulaire" : "input"}
						              ],
						"actionsdetail" : [{"name" : "Objet serveur", "type" : "button", "action" : "index?type=get&action=afficheobject&typeobj=peripheriques_chauffage"}
										,   {"name" : "DIM", "type" : "slider", "max_field":"ecriture_max_value","min_field":"ecriture_min_value","action" : "index?type=set&action=DIM&val="},
						 					{"name" : "Etat peripherique", "type" : "button", "action" : "index?type=get&action=periphetat"},
						                    {"name" : "Result expressions", "type" : "button", "action" : "index?type=get&action=periphexpress"}
							                ],
					 	"tables_compl" : [{"name" : "peripheriquechauff_tag", "soustable_name" : "tag" ,"formulaire" : "checkbox"}
	                   ],
					
					},
					{"name": "peripheriquechauff_tag","in_database":false,
						"colonnes": [
						             {"name" : "id_peripheriquechauff" , "type" : "integer"},
						             {"name" : "id_tag" , "type" : "integer"}
						             ]
					},
					{"name": "peripheriquealarme", "in_database":false,
						"colonnes" : [
						              {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
						              {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
							          {"name" : "box_id" , "type" : "integer","formulaire" : "label" , "linkobject" : "box"},
						              {"name" : "box_identifiant" , "type" : "TEXT","formulaire" : "label"},  
						              {"name" : "nom" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "visibilite" , "type" : "TEXT", "formulaire" : "label" , "object" : [{"id":"non visible","nom":"Non visible"},
								                                                                                       {"id":"visible","nom":"Visible"}
                                      																				]},
									 	
						              {"name" : "ecriture_type" , "type" : "TEXT","formulaire" : "label" , "object" : [{"id":"SANS","nom":"autre"},
									                                                                                       {"id":"BINAIRE","nom":"on/off"},
									                                                                                       {"id":"VARIABLE","nom":"Variable"},
									                                                                                       {"id":"BINVAR","nom":"on/off/Variable"},
									                                                                                       {"id":"PLAYER","nom":"Player Multim�dia"},
									                                                                                       {"id":"VOLETR","nom":"Volet Roulant"},
									                                                                                       {"id":"VOLETRVARIABLE","nom":"Volet Roulant variable"},
									                                                                                       {"id":"CHAUDIERE","nom":"Chaudiere"},
									                                                                                       {"id":"ALARME","nom":"On/Off avec code pin"},
									                                                                                       {"id":"BATTERIE","nom":"Batterie visible si etat # null"}]},
						              {"name" : "ecriture_max_value" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "ecriture_min_value" , "type" : "TEXT","formulaire" : "label"},
						            	  
						              {"name" : "lecture_etat_expr" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "lecture_compl_hist" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "lecture_expr1" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "lecture_expr1_unit" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "lecture_expr2" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "lecture_expr2_unit" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "lecture_expr3" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "lecture_expr3_unit" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "etat2" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "on_acceuil" , "type" : "TEXT","formulaire" : "input"}
						              ],
						"actionsdetail" : [{"name" : "Objet serveur", "type" : "button", "action" : "index?type=get&action=afficheobject&typeobj=peripheriques_alarme"}
										,   {"name" : "DIM", "type" : "slider", "max_field":"ecriture_max_value","min_field":"ecriture_min_value","action" : "index?type=set&action=DIM&val="},
						 					{"name" : "Etat peripherique", "type" : "button", "action" : "index?type=get&action=periphetat"},
						                    {"name" : "Result expressions", "type" : "button", "action" : "index?type=get&action=periphexpress"}
							                ],
					 	"tables_compl" : [{"name" : "peripheriquealarme_tag", "soustable_name" : "tag" ,"formulaire" : "checkbox"},
					 	                  {"name" : "peripheriquealarme_mode", "soustable_name" : "mode" ,"formulaire" : "checkbox"}
	                   ],
					
					},
					{"name": "peripheriquealarme_tag","in_database":false,
						"colonnes": [
						             {"name" : "id_peripheriquealarme" , "type" : "integer"},
						             {"name" : "id_tag" , "type" : "integer"}
						             ]
					},
					{"name": "peripheriquealarme_mode","in_database":true,
						"colonnes": [
						             {"name" : "id_peripheriquealarme" , "type" : "integer"},
						             {"name" : "id_mode" , "type" : "integer"}
						             ]
					},
					{"name": "peripheriquebatterie", "in_database":false,
						"colonnes" : [
						              {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
						              {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
							          {"name" : "box_id" , "type" : "integer","formulaire" : "label" , "linkobject" : "box"},
						              {"name" : "box_identifiant" , "type" : "TEXT","formulaire" : "label"},  
						              {"name" : "box_type" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "box_protocole" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "nom" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "visibilite" , "type" : "TEXT", "formulaire" : "label" , "object" : [{"id":"non visible","nom":"Non visible"},
								                                                                                       {"id":"visible","nom":"Visible"}
                                      																				]},
									 	
						              {"name" : "ecriture_type" , "type" : "TEXT","formulaire" : "label" , "object" : [{"id":"SANS","nom":"autre"},
									                                                                                       {"id":"BINAIRE","nom":"on/off"},
									                                                                                       {"id":"VARIABLE","nom":"Variable"},
									                                                                                       {"id":"BINVAR","nom":"on/off/Variable"},
									                                                                                       {"id":"PLAYER","nom":"Player Multim�dia"},
									                                                                                       {"id":"VOLETR","nom":"Volet Roulant"},
									                                                                                       {"id":"VOLETRVARIABLE","nom":"Volet Roulant variable"},
									                                                                                       {"id":"CHAUDIERE","nom":"Chaudiere"},
									                                                                                       {"id":"ALARME","nom":"On/Off avec code pin"},
									                                                                                       {"id":"BATTERIE","nom":"Batterie visible si etat # null"}]},
						              {"name" : "ecriture_max_value" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "ecriture_min_value" , "type" : "TEXT","formulaire" : "label"},
						            	  
						              {"name" : "lecture_etat_expr" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "lecture_compl_hist" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "lecture_expr1" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "lecture_expr1_unit" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "lecture_expr2" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "lecture_expr2_unit" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "lecture_expr3" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "lecture_expr3_unit" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "etat2" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "on_acceuil" , "type" : "TEXT","formulaire" : "input"}
						              ],
						"actionsdetail" : [{"name" : "Objet serveur", "type" : "button", "action" : "index?type=get&action=afficheobject&typeobj=peripheriques_batterie"}
										,   {"name" : "DIM", "type" : "slider", "max_field":"ecriture_max_value","min_field":"ecriture_min_value","action" : "index?type=set&action=DIM&val="},
						 					{"name" : "Etat peripherique", "type" : "button", "action" : "index?type=get&action=periphetat"},
						                    {"name" : "Result expressions", "type" : "button", "action" : "index?type=get&action=periphexpress"}
							               ],
					 	"tables_compl" : [{"name" : "peripheriquebatterie_tag", "soustable_name" : "tag" ,"formulaire" : "checkbox"}
	                   ],
					
					},
					{"name": "peripheriquebatterie_tag","in_database":false,
						"colonnes": [
						             {"name" : "id_peripheriquechauff" , "type" : "integer"},
						             {"name" : "id_tag" , "type" : "integer"}
						             ]
					},
					{"name": "automation", "in_database":false,
						"colonnes" : [
						              {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
						              {"name" : "nom" , "type" : "TEXT","formulaire" : "label"},
						              ],
						"actionsdetail" : [{"name" : "Objet serveur", "type" : "button", "action" : "index?type=get&action=afficheobject&typeobj=automations"}
										 ,  {"name" : "ON", "type" : "button", "action" : "index?type=set&action=automation_ON"},
					 					{"name" : "OFF", "type" : "button", "action" : "index?type=set&action=automation_OFF"}
							          ]	                   
					
					},
					{"name": "automation_etat", "in_database":true,
						"colonnes" : [
						              {"name" : "id" , "type" : " integer primary key","formulaire" : "label"},
						              {"name" : "nom" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "etat" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "id_automation" , "type" : "TEXT","formulaire" : "label"}
						              ]                
					
					},
					{"name": "servicemsg","in_database":false,
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
						             {"name" : "nom" , "type" : "TEXT","formulaire" : "label"},
						             {"name" : "destinataire" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "from" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "objet" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "message" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "type_envoi" , "type" : "TEXT","formulaire" : "select" , "object" : [{"id":"smshttp","nom":"Sms service http"},
						                                                                                            {"id":"sms3G","nom":"Sms cle 3G gammu"},
						                                                                                            {"id":"mailhttp","nom":"Mail service http"}]}
						             ],
						"actionsdetail" : [{"name" : "Envoyer", "type" : "button", "action" : "index?type=push&action=sendmessage"}
						                   ],

					},
					{"name": "parametres","in_database":true,
						"colonnes": [
						             {"name" : "id" , "type" : "integer primary key autoincrement" ,"formulaire" : "label"},
						             {"name" : "jsonparam" , "type" : "TEXT"}
						             ]
					},
					{"name": "numerotation","in_database":true,
						"colonnes": [
						             {"name" : "id" , "type" : "integer primary key autoincrement" ,"formulaire" : "label"},
						             {"name" : "type" , "type" : "TEXT"},
						             {"name" : "arg1" , "type" : "TEXT"},
						             {"name" : "arg2" , "type" : "TEXT"},
						             {"name" : "arg3" , "type" : "TEXT"},
						             {"name" : "increment" , "type" : "TEXT"}
						             ]
						}
					]
				};


module.exports=database;