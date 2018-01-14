/**
 * New node file
 */

var database = {
				"tables": [
					{"name": "box", "in_database":true,"reloadAll":true,
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
						             {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
						             {"name" : "nom" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "user_auth" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "password_auth" , "type" : "TEXT","formulaire" : "password"},
						             {"name" : "model" , "type" : "TEXT","formulaire" : "select" , "object" : [{"id":"ipx800","nom":"ipx800"},
						                                                                                       {"id":"ipxV4","nom":"ipxV4"},
						                                                                                       {"id":"zwayme","nom":"zwayme"},
						                                                                                       {"id":"zibase","nom":"zibase"},
						                                                                                       {"id":"zipato","nom":"zipato"},
						                                                                                       {"id":"eco device","nom":"eco device"},
						                                                                                       {"id":"fibaro","nom":"fibaro"},
						                                                                                       {"id":"virtuel","nom":"virtuel"},
						                                                                                       {"id":"infoOS","nom":"infoOS"},
						                                                                                       {"id":"onduleur","nom":"onduleur"},
						                                                                                       {"id":"sonos","nom":"sonos"},
						                                                                                       {"id":"cameraipfoscam","nom":"camera ip foscam"},
						                                                                                       {"id":"cameradomesony","nom":"camera dome sony"},
						                                                                                       {"id":"i2c","nom":"i2c raspberry"},
						                                                                                       {"id":"modbus","nom":"modbus"},
						                                                                                       {"id":"modbuscoils","nom":"modbuscoils"},
						                                                                                       {"id":"modbusinteger","nom":"modbusinteger"},
						                                                                                       {"id":"modbus_real","nom":"modbus_real"},
						                                                                                       {"id":"arduino_pwm","nom":"Arduino PWM"},
						                                                                                       {"id":"arduino_meteo","nom":"Arduino METEO"},
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
                    {"name": "periph_virtuel_etat", "in_database":true,"table_suffixe":"virtuel",
                        "colonnes": [
								{"name" : "id" , "type" : " TEXT","formulaire" : "label"},
								{"name" : "etat" , "type" : "TEXT"},
								{"name" : "expr1" , "type" : "TEXT"},
								{"name" : "expr2" , "type" : "TEXT"},
								{"name" : "expr3" , "type" : "TEXT"},
								{"name" : "expr4" , "type" : "TEXT"},
								{"name" : "expr5" , "type" : "TEXT"},
								{"name" : "expr6" , "type" : "TEXT"},
								{"name" : "expr7" , "type" : "TEXT"},
								{"name" : "etat_unit" , "type" : "TEXT"},
								{"name" : "expr1_unit" , "type" : "TEXT"},
								{"name" : "expr2_unit" , "type" : "TEXT"},
								{"name" : "expr3_unit" , "type" : "TEXT"},
								{"name" : "expr4_unit" , "type" : "TEXT"},
								{"name" : "expr5_unit" , "type" : "TEXT"},
								{"name" : "expr6_unit" , "type" : "TEXT"},
								{"name" : "expr7_unit" , "type" : "TEXT"},
								{"name" : "TimeOfetat_str" , "type" : "TEXT"},
                                {"name" : "TimeOfetat" , "type" : "TEXT"}
                        ],
                        "actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
                            {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
                            {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
                        ]
                    },
                    {"name": "periph_virtuel_etatavant", "in_database":true,"table_suffixe":"virtuel",
                        "colonnes": [
                            {"name" : "id" , "type" : " TEXT","formulaire" : "label"},
                            {"name" : "etat" , "type" : "TEXT"},
                            {"name" : "expr1" , "type" : "TEXT"},
                            {"name" : "expr2" , "type" : "TEXT"},
                            {"name" : "expr3" , "type" : "TEXT"},
                            {"name" : "expr4" , "type" : "TEXT"},
                            {"name" : "expr5" , "type" : "TEXT"},
                            {"name" : "expr6" , "type" : "TEXT"},
                            {"name" : "expr7" , "type" : "TEXT"},
                            {"name" : "etat_unit" , "type" : "TEXT"},
                            {"name" : "expr1_unit" , "type" : "TEXT"},
                            {"name" : "expr2_unit" , "type" : "TEXT"},
                            {"name" : "expr3_unit" , "type" : "TEXT"},
                            {"name" : "expr4_unit" , "type" : "TEXT"},
                            {"name" : "expr5_unit" , "type" : "TEXT"},
                            {"name" : "expr6_unit" , "type" : "TEXT"},
                            {"name" : "expr7_unit" , "type" : "TEXT"},
                            {"name" : "TimeOfetat_str" , "type" : "TEXT"},
                            {"name" : "TimeOfetat" , "type" : "TEXT"}
                        ],
                        "actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
                            {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
                            {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
                        ]
                    },{"name": "box_virtuel_etat", "in_database":true,"table_suffixe":"virtuel",
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
					{"name": "mode","in_database":true,"reloadAll":true,
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
						             {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
						             {"name" : "nom" , "type" : "TEXT","formulaire" : "input"},
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
					{"name": "type","in_database":true,"reloadAll":true,
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
						             {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
						             {"name" : "nom" , "type" : "TEXT","formulaire" : "input"}
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
						             {"name" : "categorie" , "type" : "TEXT","formulaire" : "select", "linkobject" : "categories"},
						             {"name" : "tag" , "type" : "TEXT","formulaire" : "select", "linkobject" : "tag"},
						             {"name" : "peripherique" , "type" : "TEXT","formulaire" : "select", "linkobject" : "peripheriques"},
						             {"name" : "heure" , "type" : "TEXT","formulaire" : "select" , "object" : [{"id":"0h00","nom":"0h00"},{"id":"0h15","nom":"0h15"},{"id":"0h30","nom":"0h30"},{"id":"0h45","nom":"0h45"},{"id":"1h00","nom":"1h00"},{"id":"1h15","nom":"1h15"},{"id":"1h30","nom":"1h30"},{"id":"1h45","nom":"1h45"},{"id":"2h00","nom":"2h00"},{"id":"2h15","nom":"2h15"},{"id":"2h30","nom":"2h30"},{"id":"2h45","nom":"2h45"},{"id":"3h00","nom":"3h00"},{"id":"3h15","nom":"3h15"},{"id":"3h30","nom":"3h30"},{"id":"3h45","nom":"3h45"},{"id":"4h00","nom":"4h00"},{"id":"4h15","nom":"4h15"},{"id":"4h30","nom":"4h30"},{"id":"4h45","nom":"4h45"},{"id":"5h00","nom":"5h00"},{"id":"5h15","nom":"5h15"},{"id":"5h30","nom":"5h30"},{"id":"5h45","nom":"5h45"},{"id":"6h00","nom":"6h00"},{"id":"6h15","nom":"6h15"},{"id":"6h30","nom":"6h30"},{"id":"6h45","nom":"6h45"},{"id":"7h00","nom":"7h00"},{"id":"7h15","nom":"7h15"},{"id":"7h30","nom":"7h30"},{"id":"7h45","nom":"7h45"},{"id":"8h00","nom":"8h00"},{"id":"8h15","nom":"8h15"},{"id":"8h30","nom":"8h30"},{"id":"8h45","nom":"8h45"},{"id":"9h00","nom":"9h00"},{"id":"9h15","nom":"9h15"},{"id":"9h30","nom":"9h30"},{"id":"9h45","nom":"9h45"},{"id":"10h00","nom":"10h00"},{"id":"10h15","nom":"10h15"},{"id":"10h30","nom":"10h30"},{"id":"10h45","nom":"10h45"},{"id":"11h00","nom":"11h00"},{"id":"11h15","nom":"11h15"},{"id":"11h30","nom":"11h30"},{"id":"11h45","nom":"11h45"},{"id":"12h00","nom":"12h00"},{"id":"12h15","nom":"12h15"},{"id":"12h30","nom":"12h30"},{"id":"12h45","nom":"12h45"},{"id":"13h00","nom":"13h00"},{"id":"13h15","nom":"13h15"},{"id":"13h30","nom":"13h30"},{"id":"13h45","nom":"13h45"},{"id":"14h00","nom":"14h00"},{"id":"14h15","nom":"14h15"},{"id":"14h30","nom":"14h30"},{"id":"14h45","nom":"14h45"},{"id":"15h00","nom":"15h00"},{"id":"15h15","nom":"15h15"},{"id":"15h30","nom":"15h30"},{"id":"15h45","nom":"15h45"},{"id":"16h00","nom":"16h00"},{"id":"16h15","nom":"16h15"},{"id":"16h30","nom":"16h30"},{"id":"16h45","nom":"16h45"},{"id":"17h00","nom":"17h00"},{"id":"17h15","nom":"17h15"},{"id":"17h30","nom":"17h30"},{"id":"17h45","nom":"17h45"},{"id":"18h00","nom":"18h00"},{"id":"18h15","nom":"18h15"},{"id":"18h30","nom":"18h30"},{"id":"18h45","nom":"18h45"},{"id":"19h00","nom":"19h00"},{"id":"19h15","nom":"19h15"},{"id":"19h30","nom":"19h30"},{"id":"19h45","nom":"19h45"},{"id":"20h00","nom":"20h00"},{"id":"20h15","nom":"20h15"},{"id":"20h30","nom":"20h30"},{"id":"20h45","nom":"20h45"},{"id":"21h00","nom":"21h00"},{"id":"21h15","nom":"21h15"},{"id":"21h30","nom":"21h30"},{"id":"21h45","nom":"21h45"},{"id":"22h00","nom":"22h00"},{"id":"22h15","nom":"22h15"},{"id":"22h30","nom":"22h30"},{"id":"22h45","nom":"22h45"},{"id":"23h00","nom":"23h00"},{"id":"23h15","nom":"23h15"},{"id":"23h30","nom":"23h30"},{"id":"23h45","nom":"23h45"}]},
						             {"name" : "valeur" , "type" : "TEXT","formulaire" : "select" , "object" : [{"id":"5","nom":"5�"},{"id":"5.5","nom":"5.5�"},{"id":"6","nom":"6�"},{"id":"6.5","nom":"6.5�"},{"id":"7","nom":"7�"},{"id":"7.5","nom":"7.5�"},{"id":"8","nom":"8�"},{"id":"8.5","nom":"8.5�"},{"id":"9","nom":"9�"},{"id":"9.5","nom":"9.5�"},{"id":"10","nom":"10�"},{"id":"10.5","nom":"10.5�"},{"id":"11","nom":"11�"},{"id":"11.5","nom":"11.5�"},{"id":"12","nom":"12�"},{"id":"12.5","nom":"12.5�"},{"id":"13","nom":"13�"},{"id":"13.5","nom":"13.5�"},{"id":"14","nom":"14�"},{"id":"14.5","nom":"14.5�"},{"id":"15","nom":"15�"},{"id":"15.5","nom":"15.5�"},{"id":"16","nom":"16�"},{"id":"16.5","nom":"16.5�"},{"id":"17","nom":"17�"},{"id":"17.5","nom":"17.5�"},{"id":"18","nom":"18�"},{"id":"18.5","nom":"18.5�"},{"id":"19","nom":"19�"},{"id":"19.5","nom":"19.5�"},{"id":"20","nom":"20�"},{"id":"20.5","nom":"20.5�"},{"id":"21","nom":"21�"},{"id":"21.5","nom":"21.5�"},{"id":"22","nom":"22�"},{"id":"22.5","nom":"22.5�"},{"id":"23","nom":"23�"},{"id":"23.5","nom":"23.5�"},{"id":"24","nom":"24�"},{"id":"24.5","nom":"24.5�"},{"id":"25","nom":"25�"},{"id":"25.5","nom":"25.5�"},{"id":"26","nom":"26�"},{"id":"26.5","nom":"26.5�"},{"id":"27","nom":"27�"},{"id":"27.5","nom":"27.5�"},{"id":"28","nom":"28�"},{"id":"28.5","nom":"28.5�"},{"id":"29","nom":"29�"},{"id":"29.5","nom":"29.5�"},{"id":"30","nom":"30�"}]}
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
					{"name": "tag", "in_database":true,"reloadAll":true,
						"colonnes" : [
						              {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
						              {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "nom" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "icon" , "type" : "TEXT" ,"formulaire" : "select" , "linkobject" : "images"},
						              {"name" : "parent_tag" , "type" : "integer" ,"formulaire" : "select" , "linkobject" : "tag"},
						              {"name" : "visible" , "type" : "TEXT", "formulaire" : "select" , "object" : [{"id":"N","nom":"Non visible"},
							                                                                                       {"id":"O","nom":"Visible"}
							                                                                                      ]},
						              {"name" : "position_x" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "position_y" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "icon_plan" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "periph_elec_id" , "type" : "integer","formulaire" : "select" , "linkobject" : "peripherique"},
						              {"name" : "periph_eau_id" , "type" : "integer","formulaire" : "select" , "linkobject" : "peripherique"},
						              {"name" : "type" , "type" : "TEXT", "formulaire" : "select" , "object" : [{"id":"Batiment","nom":"Batiment"},
							                                                                                       {"id":"Piece","nom":"Piece"}
						              																			]},
						              {"name" : "typeprog" , "type" : "TEXT", "formulaire" : "select" , "object" : [{"id":"Programmation","nom":"Programmation"},
								                                                                                       {"id":"Reservation","nom":"Reservation"}
                                      																			]}
						              ],
						"actionsdetail" : [{"name" : "Objet serveur", "type" : "button", "action" : "index?type=get&action=afficheobject&typeobj=tags"}
										],
						"actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
						                       {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
						                       {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
		                   					]
					},
					{"name": "categorie", "in_database":true,"reloadAll":true,
						"colonnes" : [
						              {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
						              {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
						              {"name" : "nom" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "histo_mini" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "couleur_fond" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "couleur_text" , "type" : "TEXT","formulaire" : "select" , "object" : [{"id":"noir","nom":"Noir"},
								                                                                                      {"id":"blanc","nom":"blanc"}]},
						              {"name" : "textmin" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "textmax" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "textmidle" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "iconmin" , "type" : "TEXT","formulaire" : "select" , "linkobject" : "images"},
						              {"name" : "iconmax" , "type" : "TEXT","formulaire" : "select" , "linkobject" : "images"},
						              {"name" : "iconmidle" , "type" : "TEXT","formulaire" : "select" , "linkobject" : "images"},
						              {"name" : "type" , "type" : "TEXT","formulaire" : "select" , "object" : [{"id":"autre","nom":"autre"},
										  																	   {"id":"compteur","nom":"compteur"},
						                                                                                       {"id":"sonde_de_temperature","nom":"sonde_de_temperature"},
						                                                                                       {"id":"element_de_chauffage","nom":"element_de_chauffage"},
						                                                                                       {"id":"sonde_autre","nom":"sonde_autre"},
						                                                                                       {"id":"consigne_temperature","nom":"consigne_temperature"},
						                                                                                       {"id":"alarme","nom":"alarme"},
						                                                                                       {"id":"camera","nom":"camera"},
						                                                                                       {"id":"alerte","nom":"alerte"},
						                                                                                       {"id":"declencheur_alarme","nom":"declencheur_alarme"},
						                                                                                       {"id":"sirene_alarme","nom":"sirene_alarme"},
						                                                                                       {"id":"batterie","nom":"batterie"}]},
 						              {"name" : "programmable" , "type" : "TEXT", "formulaire" : "select" , "object" : [{"id":"N","nom":"Non programmable"},
					                                                                                                	{"id":"O","nom":"Programmable"}]},
						              ],
						"actionsdetail" : [{"name" : "Objet serveur", "type" : "button", "action" : "index?type=get&action=afficheobject&typeobj=categories"}
					                   ],
						"actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
						                       {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
						                       {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
		                   					]
					},
					{"name": "peripherique", "in_database":true,"reloadAll":true,
						"colonnes" : [
						              {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
						              {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
						            	  
						              {"name" : "nom" , "type" : "TEXT","formulaire" : "input"},
							          {"name" : "box_id" , "type" : "integer","formulaire" : "select" , "linkobject" : "box"},
							          {"name" : "inspireathome_box_id" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "box_identifiant" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "box_type" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "box_protocole" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "box_coeff" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "visibilite" , "type" : "TEXT", "formulaire" : "select" , "object" : [{"id":"non visible","nom":"Non visible"},
								                                                                                       {"id":"visible","nom":"Visible"}
                                      																				]},
									 	
						              {"name" : "categorie_id" , "type" : "integer","formulaire" : "select" , "linkobject" : "categorie"},
						              {"name" : "ecriture_type" , "type" : "TEXT","formulaire" : "select" , "object" : [{"id":"SANS","nom":"autre"},
									                                                                                       {"id":"BINAIRE","nom":"on/off"},
									                                                                                       {"id":"VARIABLE","nom":"Variable"},
									                                                                                       {"id":"CONSIGNE","nom":"Consigne"},
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
						              {"name" : "ecriture_pas_value" , "type" : "TEXT","formulaire" : "input"},
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
						              {"name" : "lecture_etat_graph" , "type" : "TEXT","formulaire" : "select" , "linkobject" : "graph"},
						              {"name" : "lecture_expr1" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "lecture_expr1_unit" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "lecture_expr1_graph" , "type" : "TEXT","formulaire" : "select" , "linkobject" : "graph"},
						              {"name" : "lecture_expr2" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "lecture_expr2_unit" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "lecture_expr2_graph" , "type" : "TEXT","formulaire" : "select" , "linkobject" : "graph"},
						              {"name" : "lecture_expr3" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "lecture_expr3_unit" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "lecture_expr3_graph" , "type" : "TEXT","formulaire" : "select" , "linkobject" : "graph"},
						              {"name" : "lecture_expr4" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "lecture_expr4_unit" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "lecture_expr4_graph" , "type" : "TEXT","formulaire" : "select" , "linkobject" : "graph"},
						              {"name" : "lecture_expr5" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "lecture_expr5_unit" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "lecture_expr5_graph" , "type" : "TEXT","formulaire" : "select" , "linkobject" : "graph"},
						              {"name" : "lecture_expr6" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "lecture_expr6_unit" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "lecture_expr6_graph" , "type" : "TEXT","formulaire" : "select" ,"linkobject" : "graph"},
						              {"name" : "lecture_expr7" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "lecture_expr7_unit" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "lecture_expr7_graph" , "type" : "TEXT","formulaire" : "select" , "linkobject" : "graph"},
						              {"name" : "ajustement" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "limitebasse2" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "limitebasse" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "limitehaute" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "on_acceuil" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "position_x" , "type" : "TEXT","formulaire" : "input"},
						              {"name" : "position_y" , "type" : "TEXT","formulaire" : "input"}
						              ],
						 "tables_compl" : [{"name" : "peripherique_tag", "soustable_name" : "tag" ,"formulaire" : "checkbox"},
						                   {"name" : "peripherique_user_acceuil", "soustable_name" : "utilisateurs" ,"formulaire" : "checkbox"}
						                   ],
						 "actionsdetail" : [{"name" : "ON", "type" : "button", "action" : "index?type=set&action=ON"},
						                    {"name" : "OFF", "type" : "button", "action" : "index?type=set&action=OFF"},
						                    {"name" : "DIM", "type" : "slider", "max_field":"ecriture_max_value","min_field":"ecriture_min_value","action" : "index?type=set&action=DIM&val="},
						                    {"name" : "UP", "type" : "button", "action" : "index?type=set&action=UP"},
						                    {"name" : "DOWN", "type" : "button", "action" : "index?type=set&action=DOWN"},
						                    {"name" : "STOP", "type" : "button", "action" : "index?type=set&action=STOP"},
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
					{"name": "peripherique_tag","in_database":true,"reloadAll":true,
						"colonnes": [
						             {"name" : "id_peripherique" , "type" : "integer"},
						             {"name" : "id_tag" , "type" : "integer"}
						             ]
					},
					{"name": "graph","in_database":true,"reloadAll":true,
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
						              {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
						             {"name" : "nom" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "type" , "type" : "TEXT","formulaire" : "select" , "object" : [{"id":"sans","nom":"sans"},
								                                                                              {"id":"line","nom":"courbe"},
								                                                                            //  {"id":"arearange","nom":"aire min_max"},
								                                                                              {"id":"column","nom":"barre"},
								                                                                              {"id":"pie","nom":"camembert"}
                                      																				]},
						             {"name" : "legende" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "titreY" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "titreX" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "type_valeur" , "type" : "TEXT","formulaire" : "select" , "object" : [{"id":"max","nom":"max"},
							                                         {"id":"min","nom":"min"},
							                                         {"id":"moy","nom":"moy"},
							                                         {"id":"ecart_compteur_max","nom":"ecart_compteur_max"}
													]},
						             {"name" : "Graph_regroupe" , "type" : "TEXT","formulaire" : "select" , "linkobject" : "graph"}
						             ],
					"actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
					                       {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
					                       {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
	                   					]
					},
					{"name": "peripherique_user_acceuil","in_database":true,
							"colonnes": [
							             {"name" : "id_peripherique" , "type" : "integer"},
							             {"name" : "id_utilisateurs" , "type" : "integer"}
							             ]
					},
					{"name": "peripheriquedeporte", "in_database":true,"reloadAll":true,
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
					{"name": "peripheriquedeporte_tag","in_database":true,"reloadAll":true,
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
						             {"name" : "phone" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "mail" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "email" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "droit_tarif" , "type" : "TEXT","formulaire" : "select" , "object" : [{"id":"O","nom":"Oui modif"},
																			                                         {"id":"N","nom":"Non aucune modif"}
																													]},
						             {"name" : "alarme_mail" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "alarme_phone" , "type" : "TEXT","formulaire" : "input"}
						             ],					
						"actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
						                       {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
						                       {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
		                   					]
					},
					{"name": "constantes","in_database":true,"reloadALL":true,
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
					{"name": "historique","in_database":true,"table_suffixe":"histo",
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement"},
						             {"name" : "etat" , "type" : "TEXT"},
						             {"name" : "expr1" , "type" : "TEXT"},
						             {"name" : "expr2" , "type" : "TEXT"},
						             {"name" : "expr3" , "type" : "TEXT"},
						             {"name" : "expr4" , "type" : "TEXT"},
						             {"name" : "expr5" , "type" : "TEXT"},
						             {"name" : "expr6" , "type" : "TEXT"},
						             {"name" : "expr7" , "type" : "TEXT"},
						             {"name" : "etat_unit" , "type" : "TEXT"},
						             {"name" : "expr1_unit" , "type" : "TEXT"},
						             {"name" : "expr2_unit" , "type" : "TEXT"},
						             {"name" : "expr3_unit" , "type" : "TEXT"},
						             {"name" : "expr4_unit" , "type" : "TEXT"},
						             {"name" : "expr5_unit" , "type" : "TEXT"},
						             {"name" : "expr6_unit" , "type" : "TEXT"},
						             {"name" : "expr7_unit" , "type" : "TEXT"},
						             {"name" : "timestamp" , "type" : "TEXT"},
						             {"name" : "uuid" , "type" : "TEXT"}
						             ]
					},
					{"name": "historique_heure","in_database":true,"table_suffixe":"histo",
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement"},
						             {"name" : "etat_min" , "type" : "TEXT"},
						             {"name" : "etat_max" , "type" : "TEXT"},
						             {"name" : "etat_moy" , "type" : "TEXT"},
						             {"name" : "etat" , "type" : "TEXT"},
						             {"name" : "expr1" , "type" : "TEXT"},
						             {"name" : "expr1_min" , "type" : "TEXT"},
						             {"name" : "expr1_max" , "type" : "TEXT"},
						             {"name" : "expr1_moy" , "type" : "TEXT"},
						             {"name" : "expr2" , "type" : "TEXT"},
						             {"name" : "expr2_min" , "type" : "TEXT"},
						             {"name" : "expr2_max" , "type" : "TEXT"},
						             {"name" : "expr2_moy" , "type" : "TEXT"},
						             {"name" : "expr3" , "type" : "TEXT"},
						             {"name" : "expr3_min" , "type" : "TEXT"},
						             {"name" : "expr3_max" , "type" : "TEXT"},
						             {"name" : "expr3_moy" , "type" : "TEXT"},
						             {"name" : "expr4" , "type" : "TEXT"},
						             {"name" : "expr4_min" , "type" : "TEXT"},
						             {"name" : "expr4_max" , "type" : "TEXT"},
						             {"name" : "expr4_moy" , "type" : "TEXT"},
						             {"name" : "expr5" , "type" : "TEXT"},
						             {"name" : "expr5_min" , "type" : "TEXT"},
						             {"name" : "expr5_max" , "type" : "TEXT"},
						             {"name" : "expr5_moy" , "type" : "TEXT"},
						             {"name" : "expr6" , "type" : "TEXT"},
						             {"name" : "expr6_min" , "type" : "TEXT"},
						             {"name" : "expr6_max" , "type" : "TEXT"},
						             {"name" : "expr6_moy" , "type" : "TEXT"},
						             {"name" : "expr7" , "type" : "TEXT"},
						             {"name" : "expr7_min" , "type" : "TEXT"},
						             {"name" : "expr7_max" , "type" : "TEXT"},
						             {"name" : "expr7_moy" , "type" : "TEXT"},
						             {"name" : "etat_unit" , "type" : "TEXT"},
						             {"name" : "expr1_unit" , "type" : "TEXT"},
						             {"name" : "expr2_unit" , "type" : "TEXT"},
						             {"name" : "expr3_unit" , "type" : "TEXT"},
						             {"name" : "expr4_unit" , "type" : "TEXT"},
						             {"name" : "expr5_unit" , "type" : "TEXT"},
						             {"name" : "expr6_unit" , "type" : "TEXT"},
						             {"name" : "expr7_unit" , "type" : "TEXT"},
						             {"name" : "timestamp" , "type" : "TEXT"},
						             {"name" : "uuid" , "type" : "TEXT"}
						             ]
					},
					{"name": "historique_jour","in_database":true,"table_suffixe":"histo",
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement"},
						             {"name" : "etat_min" , "type" : "TEXT"},
						             {"name" : "etat_max" , "type" : "TEXT"},
						             {"name" : "etat_moy" , "type" : "TEXT"},
						             {"name" : "etat" , "type" : "TEXT"},
						             {"name" : "expr1" , "type" : "TEXT"},
						             {"name" : "expr1_min" , "type" : "TEXT"},
						             {"name" : "expr1_max" , "type" : "TEXT"},
						             {"name" : "expr1_moy" , "type" : "TEXT"},
						             {"name" : "expr2" , "type" : "TEXT"},
						             {"name" : "expr2_min" , "type" : "TEXT"},
						             {"name" : "expr2_max" , "type" : "TEXT"},
						             {"name" : "expr2_moy" , "type" : "TEXT"},
						             {"name" : "expr3" , "type" : "TEXT"},
						             {"name" : "expr3_min" , "type" : "TEXT"},
						             {"name" : "expr3_max" , "type" : "TEXT"},
						             {"name" : "expr3_moy" , "type" : "TEXT"},
						             {"name" : "expr4" , "type" : "TEXT"},
						             {"name" : "expr4_min" , "type" : "TEXT"},
						             {"name" : "expr4_max" , "type" : "TEXT"},
						             {"name" : "expr4_moy" , "type" : "TEXT"},
						             {"name" : "expr5" , "type" : "TEXT"},
						             {"name" : "expr5_min" , "type" : "TEXT"},
						             {"name" : "expr5_max" , "type" : "TEXT"},
						             {"name" : "expr5_moy" , "type" : "TEXT"},
						             {"name" : "expr6" , "type" : "TEXT"},
						             {"name" : "expr6_min" , "type" : "TEXT"},
						             {"name" : "expr6_max" , "type" : "TEXT"},
						             {"name" : "expr6_moy" , "type" : "TEXT"},
						             {"name" : "expr7" , "type" : "TEXT"},
						             {"name" : "expr7_min" , "type" : "TEXT"},
						             {"name" : "expr7_max" , "type" : "TEXT"},
						             {"name" : "expr7_moy" , "type" : "TEXT"},
						             {"name" : "etat_unit" , "type" : "TEXT"},
						             {"name" : "expr1_unit" , "type" : "TEXT"},
						             {"name" : "expr2_unit" , "type" : "TEXT"},
						             {"name" : "expr3_unit" , "type" : "TEXT"},
						             {"name" : "expr4_unit" , "type" : "TEXT"},
						             {"name" : "expr5_unit" , "type" : "TEXT"},
						             {"name" : "expr6_unit" , "type" : "TEXT"},
						             {"name" : "expr7_unit" , "type" : "TEXT"},
						             {"name" : "timestamp" , "type" : "TEXT"},
						             {"name" : "uuid" , "type" : "TEXT"}
						             ]
					},
					{"name": "historique_mois","in_database":true,"table_suffixe":"histo",
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement"},
						             {"name" : "etat_min" , "type" : "TEXT"},
						             {"name" : "etat_max" , "type" : "TEXT"},
						             {"name" : "etat_moy" , "type" : "TEXT"},
						             {"name" : "etat" , "type" : "TEXT"},
						             {"name" : "expr1" , "type" : "TEXT"},
						             {"name" : "expr1_min" , "type" : "TEXT"},
						             {"name" : "expr1_max" , "type" : "TEXT"},
						             {"name" : "expr1_moy" , "type" : "TEXT"},
						             {"name" : "expr2" , "type" : "TEXT"},
						             {"name" : "expr2_min" , "type" : "TEXT"},
						             {"name" : "expr2_max" , "type" : "TEXT"},
						             {"name" : "expr2_moy" , "type" : "TEXT"},
						             {"name" : "expr3" , "type" : "TEXT"},
						             {"name" : "expr3_min" , "type" : "TEXT"},
						             {"name" : "expr3_max" , "type" : "TEXT"},
						             {"name" : "expr3_moy" , "type" : "TEXT"},
						             {"name" : "expr4" , "type" : "TEXT"},
						             {"name" : "expr4_min" , "type" : "TEXT"},
						             {"name" : "expr4_max" , "type" : "TEXT"},
						             {"name" : "expr4_moy" , "type" : "TEXT"},
						             {"name" : "expr5" , "type" : "TEXT"},
						             {"name" : "expr5_min" , "type" : "TEXT"},
						             {"name" : "expr5_max" , "type" : "TEXT"},
						             {"name" : "expr5_moy" , "type" : "TEXT"},
						             {"name" : "expr6" , "type" : "TEXT"},
						             {"name" : "expr6_min" , "type" : "TEXT"},
						             {"name" : "expr6_max" , "type" : "TEXT"},
						             {"name" : "expr6_moy" , "type" : "TEXT"},
						             {"name" : "expr7" , "type" : "TEXT"},
						             {"name" : "expr7_min" , "type" : "TEXT"},
						             {"name" : "expr7_max" , "type" : "TEXT"},
						             {"name" : "expr7_moy" , "type" : "TEXT"},
						             {"name" : "etat_unit" , "type" : "TEXT"},
						             {"name" : "expr1_unit" , "type" : "TEXT"},
						             {"name" : "expr2_unit" , "type" : "TEXT"},
						             {"name" : "expr3_unit" , "type" : "TEXT"},
						             {"name" : "expr4_unit" , "type" : "TEXT"},
						             {"name" : "expr5_unit" , "type" : "TEXT"},
						             {"name" : "expr6_unit" , "type" : "TEXT"},
						             {"name" : "expr7_unit" , "type" : "TEXT"},
						             {"name" : "timestamp" , "type" : "TEXT"},
						             {"name" : "uuid" , "type" : "TEXT"}
						             ]
					},
					{"name": "historique_an","in_database":true,"table_suffixe":"histo",
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement"},
						             {"name" : "etat_min" , "type" : "TEXT"},
						             {"name" : "etat_max" , "type" : "TEXT"},
						             {"name" : "etat_moy" , "type" : "TEXT"},
						             {"name" : "etat" , "type" : "TEXT"},
						             {"name" : "expr1" , "type" : "TEXT"},
						             {"name" : "expr1_min" , "type" : "TEXT"},
						             {"name" : "expr1_max" , "type" : "TEXT"},
						             {"name" : "expr1_moy" , "type" : "TEXT"},
						             {"name" : "expr2" , "type" : "TEXT"},
						             {"name" : "expr2_min" , "type" : "TEXT"},
						             {"name" : "expr2_max" , "type" : "TEXT"},
						             {"name" : "expr2_moy" , "type" : "TEXT"},
						             {"name" : "expr3" , "type" : "TEXT"},
						             {"name" : "expr3_min" , "type" : "TEXT"},
						             {"name" : "expr3_max" , "type" : "TEXT"},
						             {"name" : "expr3_moy" , "type" : "TEXT"},
						             {"name" : "expr4" , "type" : "TEXT"},
						             {"name" : "expr4_min" , "type" : "TEXT"},
						             {"name" : "expr4_max" , "type" : "TEXT"},
						             {"name" : "expr4_moy" , "type" : "TEXT"},
						             {"name" : "expr5" , "type" : "TEXT"},
						             {"name" : "expr5_min" , "type" : "TEXT"},
						             {"name" : "expr5_max" , "type" : "TEXT"},
						             {"name" : "expr5_moy" , "type" : "TEXT"},
						             {"name" : "expr6" , "type" : "TEXT"},
						             {"name" : "expr6_min" , "type" : "TEXT"},
						             {"name" : "expr6_max" , "type" : "TEXT"},
						             {"name" : "expr6_moy" , "type" : "TEXT"},
						             {"name" : "expr7" , "type" : "TEXT"},
						             {"name" : "expr7_min" , "type" : "TEXT"},
						             {"name" : "expr7_max" , "type" : "TEXT"},
						             {"name" : "expr7_moy" , "type" : "TEXT"},
						             {"name" : "etat_unit" , "type" : "TEXT"},
						             {"name" : "expr1_unit" , "type" : "TEXT"},
						             {"name" : "expr2_unit" , "type" : "TEXT"},
						             {"name" : "expr3_unit" , "type" : "TEXT"},
						             {"name" : "expr4_unit" , "type" : "TEXT"},
						             {"name" : "expr5_unit" , "type" : "TEXT"},
						             {"name" : "expr6_unit" , "type" : "TEXT"},
						             {"name" : "expr7_unit" , "type" : "TEXT"},
						             {"name" : "timestamp" , "type" : "TEXT"},
						             {"name" : "uuid" , "type" : "TEXT"}
						             ]
					},
					{"name": "alerte","in_database":true,
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement"},

						             {"name" : "date_alerte" , "type" : "TEXT"},
						             {"name" : "date_acquitement" , "type" : "TEXT"},
						             {"name" : "timestamp_modif" , "type" : "TEXT"},
						             {"name" : "libelle" , "type" : "TEXT"},
						             {"name" : "commentaire" , "type" : "TEXT"},
							         {"name" : "levels","type": "TEXT","formulaire" : "select" , "object" : [{"id":"ERROR","nom":"ERROR"},
																					 {"id":"WARNING","nom":"WARNING"},
																					 {"id":"INFO","nom":"INFO"},
																					 {"id":"DEBUG","nom":"DEBUG"}]},
						             /*{"name" : "uuid_peripherique" , "type" : "TEXT"},*/
							         {"name" : "etat" , "type" : "TEXT"},
                                     {"name" : "origine" , "type" : "TEXT"},
                                     {"name" : "origine_identifiant" , "type" : "TEXT"},
						             {"name" : "uuid" , "type" : "TEXT"}
						             ]
					},
					{"name": "alerte_historique","in_database":true,"table_suffixe":"histo",
						"colonnes": [
										{"name" : "id" , "type" : "integer"},
										{"name" : "date_alerte" , "type" : "TEXT"},
										{"name" : "date_acquitement" , "type" : "TEXT"},
										{"name" : "timestamp_modif" , "type" : "TEXT"},
										{"name" : "libelle" , "type" : "TEXT"},
										{"name" : "commentaire" , "type" : "TEXT"},
										{"name" : "levels","type": "TEXT","formulaire" :"select" , "object" : [{"id":"ERROR","nom":"ERROR"},
											{"id":"WARNING","nom":"WARNING"},
											{"id":"INFO","nom":"INFO"},
											{"id":"DEBUG","nom":"DEBUG"}]},
										/*{"name" : "uuid_peripherique" , "type" : "TEXT"},*/
										{"name" : "etat" , "type" : "TEXT"},
										{"name" : "origine" , "type" : "TEXT"},
										{"name" : "origine_identifiant" , "type" : "TEXT"},
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
	                   ]
					
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
	                   ]
					
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
	                   ]
					
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
						                   ]


					},
					{"name": "outils","in_database":false,
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
						             {"name" : "nom" , "type" : "TEXT","formulaire" : "label"},
						             {"name" : "requete" , "type" : "TEXT","formulaire" : "input"}
						             ],
						"actionsdetail" : [{"name" : "Select", "type" : "button", "action" : "index?type=get&action=select"},
										   {"name" : "transaction", "type" : "button", "action" : "index?type=set&action=transaction"}
						                   ]


					},
					{"name": "historise_cron","in_database":true,
					"colonnes": [
					             {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
					             {"name" : "nom" , "type" : "TEXT","formulaire" : "input"},
					             {"name" : "historise_on" , "type" : "TEXT","formulaire" : "select","object" : [{"id":"changementetat","nom":"chaque changement valeur"},
																				                                 {"id":"changementetat_cron","nom":"a fr�quence r�guliere si changement d'�tat"},
																				                                 {"id":"frequence","nom":"a fr�quence r�guliere"}]
																				},
								 {"name" : "type" , "type" : "TEXT","formulaire" : "select","object" : [{"id":"nouveletat","nom":"nouvelle valeur"},
																			                                 {"id":"ancienetat","nom":"ancienne valeur"},
																			                                 {"id":"nouvelancienetat","nom":"ancienne puis nouvelle valeur"}]
																				},
					             {"name" : "minutes" , "type" : "TEXT","formulaire" : "input","placeholder":"* ou 0,15,35,55 ou 0/5 ou 0-30 ou 0-30/3"},
					             {"name" : "heures" , "type" : "TEXT","formulaire" : "input","placeholder":"* ou 0,5,10,20 ou 0/2 ou 8-22 ou 8-22/2"},
					             {"name" : "jours_du_mois" , "type" : "TEXT","formulaire" : "input","placeholder":"? ou * ou 1,15,31 ou 1/2 ou 5-20 ou 1/7"},
					             {"name" : "mois" , "type" : "TEXT","formulaire" :  "input","placeholder":"* ou 3,6,9,12 ou 1/3 ou 5-12 ou 1-6/2"},
					             {"name" : "jours_de_semaine" , "type" : "TEXT","formulaire" :  "input","placeholder":"? ou * ou 0,6 ou 0/2 ou 0-7 ou 1-6/2"}
					             																          
					             ],
					"tables_compl" : [{"name" : "historise_cron_periphetattype", "soustable_name" : "periphetattype" ,"formulaire" : "checkbox"},
	                   {"name" : "historise_cron_peripherique", "soustable_name" : "peripherique" ,"formulaire" : "checkbox","groupby":"categorie_id"}
	                   ],						             
						 "actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
	                       {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
	                       {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
     					]

					},
					{"name": "periphetattype","in_database":false,
						"colonnes": [{"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
						             {"name" : "nom" , "type" : "TEXT","formulaire" : "label"}],
						"object" : [{"id":"etat","nom":"Etat"},{"id":"expr1","nom":"Expression 1"},{"id":"expr2","nom":"Expression 2"},{"id":"expr3","nom":"Expression 3"}]
					},
					{"name": "historise_cron_periphetattype","in_database":true,
					"colonnes": [
					             {"name" : "id_historise_cron" , "type" : "integer"},
					             {"name" : "id_periphetattype" , "type" : "TEXT"}
					             ]
					},
					{"name": "historise_cron_peripherique","in_database":true,
					"colonnes": [
					             {"name" : "id_historise_cron" , "type" : "integer"},
					             {"name" : "id_peripherique" , "type" : "TEXT"}
					             ]
					},

					{"name": "joursconsigne","in_database":true,
						"colonnes": [
							 {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
				             {"name" : "nom" , "type" : "TEXT","formulaire" : "input"},
				             {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
				             {"name" : "date_debut" , "type" : "TEXT","formulaire" : "input"},
				             {"name" : "date_fin" , "type" : "TEXT","formulaire" : "input"},

					         {"name" : "typejour" , "type" : "TEXT", "formulaire" : "label" , "object" : [{"id":"Vacances","nom":"vacances"},
						                                                                                       {"id":"Fériés","nom":"feries"}
                             																				]},

				           ]
						},
					{"name": "personne","in_database":true,
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
							         {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
							         {"name" : "titulaire_id" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "nom" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "sexe" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "prenom1" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "prenom2" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "prenom3" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "datenaissance" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "lieunaissance" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "adresse" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "codepostal" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "ville" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "pays" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "phone" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "email" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "profession" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "livretcirc_num" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "cartegrise" , "type" : "TEXT","formulaire" : "input"},
									 {"name" : "immatriculation" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "commentaire" , "type" : "TEXT","formulaire" : "input"}
						             ],					
						"actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
						                       {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
						                       {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
		                   					]
					},
					{"name": "societe","in_database":true,
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
							         {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
						             {"name" : "nom" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "adresse" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "codepostal" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "ville" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "pays" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "phone" , "type" : "TEXT","formulaire" : "input"},
						             ],					
						"actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
						                       {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
						                       {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
		                   					]
					},
					{"name": "aire","in_database":true,
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
							         {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
						             {"name" : "nom" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "adresse" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "codepostal" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "ville" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "pays" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "phone" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "part_fixe" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "part_variable" , "type" : "TEXT","formulaire" : "input"},
						             ],					
						"actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
						                       {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
						                       {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
		                   					]
					},
					{"name": "sexe","in_database":true,
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
							         {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
							         {"name" : "nom" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "code" , "type" : "TEXT","formulaire" : "input"}
						             
						             ],					
						"actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
						                       {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
						                       {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
		                   					]
					}	,
					{"name": "sejour","in_database":true,
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
							         {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
							         {"name" : "titulaire_id" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "date_debut" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "date_fin" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "type_caf" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "type_tarif" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "emplacement_id" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "valeur0" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "valeur1" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "valeur2" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "valeur3" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "valeur4" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "valeur5" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "service_eau" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "service_elec" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "service_chauffeeau" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "clos" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "index_fac_eau" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "index_fac_elec" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "date_fac" , "type" : "TEXT","formulaire" : "input"}
						             
						             ],					
						"actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
						                       {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
						                       {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
		                   					]
					},
					{"name": "compte_ecriture","in_database":true,
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
							         {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
							         {"name" : "sejour_id" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "titulaire_id" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "type_operation" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "mode_paiement" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "date" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "libelle" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "qte" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "pu" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "montant" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "recu_num" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "facture_num" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "solde" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "editable" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "printable" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "signe" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "calcul_solde" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "deleted" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "index_deb" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "index_fin" , "type" : "TEXT","formulaire" : "input"}
						             
						             ],					
						"actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
						                       {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
						                       {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
		                   					]
					},
					{"name": "facture","in_database":true,
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
							         {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
							         {"name" : "titulaire_id" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "facture_num" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "date" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "libelle" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "solde" , "type" : "TEXT","formulaire" : "input"}
						             
						             ],					
						"actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
						                       {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
						                       {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
		                   					]
					},
					{"name": "tarif","in_database":true,
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
							         {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
							         {"name" : "nom" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "type" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "prix_elec_kwh" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "prix_eau_m3" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "prix_empl_jour" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "seuil_alerte" , "type" : "TEXT","formulaire" : "input"},
						             {"name" : "seuil_coupure" , "type" : "TEXT","formulaire" : "input"}
						             
						             ],					
						"actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
						                       {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
						                       {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
		                   					]
					},
					{"name": "typecaf","in_database":true,
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
							         {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
							         {"name" : "nom" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "code" , "type" : "TEXT","formulaire" : "input"}
						             
						             ],					
						"actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
						                       {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
						                       {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
		                   					]
					},
					{"name": "type_operation","in_database":true,
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
							         {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
							         {"name" : "nom" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "code" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "signe" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "calcul_solde" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "montant_fixe" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "code_annulation" , "type" : "TEXT","formulaire" : "input"}
							         
						             
						             ],					
						"actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
						                       {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
						                       {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
		                   					]
					},
					{"name": "type_paiement","in_database":true,
						"colonnes": [
						             {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
							         {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
							         {"name" : "nom" , "type" : "TEXT","formulaire" : "input"},
							         {"name" : "code" , "type" : "TEXT","formulaire" : "input"}
						             
						             ],					
						"actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
						                       {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
						                       {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
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
						},


                    {"name": "plan","in_database":true,
                        "colonnes": [
                            {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
                            {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
                            {"name" : "nom" , "type" : "TEXT","formulaire" : "input"},
                            {"name" : "icon" , "type" : "TEXT","formulaire" : "select" , "linkobject" : "images"},
                            {"name" : "visible" , "type" : "TEXT", "formulaire" : "select" , "object" : [{"id":"N","nom":"Non visible"},
                                    {"id":"O","nom":"Visible"}
                                ]},

                        ],
                        "actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
                            {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
                            {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
                        ]
                    },
                    {"name": "plan_peripherique","in_database":true,
                        "colonnes": [
                            {"name" : "id" , "type" : " integer primary key autoincrement","formulaire" : "label"},
                            {"name" : "uuid" , "type" : "TEXT","formulaire" : "label"},
                            {"name" : "position_x" , "type" : "TEXT","formulaire" : "input"},
                            {"name" : "position_y" , "type" : "TEXT","formulaire" : "input"},
                            {"name" : "icon_plan" , "type" : "TEXT","formulaire" : "input"},
                            {"name" : "icon_plan" , "type" : "TEXT","formulaire" : "input"},
                            {"name" : "peripherique" , "type" : "TEXT","formulaire" : "select" , "linkobject" : "peripherique"},
                            {"name" : "plan" , "type" : "TEXT","formulaire" : "select" , "linkobject" : "plan"},
                            {"name" : "action" , "type" : "TEXT","formulaire" : "select","object" : [{"id":"nothing","nom":"Rien faire"},
                                    {"id":"tag","nom":"Ouvrir la pièce"},
                                    {"id":"famille","nom":"Famille sinon pièce"},
                                    {"id":"switchonoff","nom":"Switch ON/OFF"}]
                            },
                        ],
                        "actionsreturnlist" : [{"name" : "Supprimer", "type" : "button", "action" : "index?type=maj&action=delete"},
                            {"name" : "Annuler", "type" : "button", "action" : "index?type=maj&action=keep"},
                            {"name" : "Enregistrer", "type" : "button", "action" : "index?type=maj&action=save"}
                        ]
                    }

					]
				};


module.exports=database;