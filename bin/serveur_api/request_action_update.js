/**
 * New node file
 */

/*var dbmodel=require('./dbmodel');*/


module.exports =function(variables,res){
		var sep="";
		this.controleTables=controleTables;
	    this.createTable=createTable;
	    this.controleColonnes=controleColonnes;
	    
		switch (variables.action) {
			case '':
				
				res.writeHead(200, {'Content-Type': 'text/plain'});
				

				res.end('Action insert1000\n');
				
				break;
			default:
				break;
		}
		

	};
