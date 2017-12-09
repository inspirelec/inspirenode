/**
 * New node file
 */

var class_graph = function graph(){
	
	var self =this;
	
	this.chargeById=function(id,callback){
		
		var sql='Select * from graph where id=\''+id+'\';';
		global.obj.app.db.sqlorder(sql,
			function(rows){
				var data=rows[0];
				for (var p in data){
					var prop=data[p];
					self[p]=prop;
				}
				callback(null,self);
			});
	}
	this.charge_parents=function(callback){
		if (self.Graph_regroupe) {
			self.Graph_regroupe=global.obj.app.core.findobj(self.Graph_regroupe,'graphs');
		}
		/*self.enfants=[];
		for (t in global.obj.tags){
			if (global.obj.tags[t].parent_tag==self.id){
				self.enfants.push(global.obj.tags[t]);
			}
		}*/
		
		callback();
	}

}

class_graph.charge_graphs=function(callback){
  	  var sql='Select * from graph c;';
	  global.obj.app.db.sqlorder(sql,
		function(rows){
		  global.req.async.map(rows,function(categ,callbacktt){
			  var t= new global.req.graph();
			  t.chargeById(categ.id,callbacktt);
		  },function(err,graphs){
			  global.obj.graphs=graphs;
			  global.obj.app.serveur.emit('graph.charge_graphs');
			  callback();
		  })
		});
	}
class_graph.charge_parents_graphs=function(callback){
	 global.req.async.map(global.obj.graphs,function(graph,callbacktt){
		 graph.charge_parents(callbacktt);
	  },function(err,graphs){
		  global.obj.app.serveur.emit('graph.charge_parents_graphs');
		  callback();
	  })
	}
//class_graph.prototype= new global.req.events.EventEmitter();
module.exports = class_graph;