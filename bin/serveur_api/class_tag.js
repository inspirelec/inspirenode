/**
 * New node file
 */


var class_tag = function tag(){
	var self =this;
	
	this.chargeById=function(id,callback){
		var sql='Select * from tag where id=\''+id+'\';';

		global.obj.app.db.sqlorder(sql,
			function(rows){
				var data =rows[0];
				for (var p in data){
					var prop=data[p];
					self[p]=prop;
				}
				
				callback(null,self);
				
			});
	}
	
	
	this.charge_parents=function(callback){
		if (self.parent_tag) {
			self.parent=global.obj.app.core.findobj(self.parent_tag,'tags');
		}
		/*self.enfants=[];
		for (t in global.obj.tags){
			if (global.obj.tags[t].parent_tag==self.id){
				self.enfants.push(global.obj.tags[t]);
			}
		}*/
		
		callback();
	}
	
	this.get_child=function(){
		var enfants=[];
		for (var t in global.obj.tags){
			if (global.obj.tags[t].parent_tag==self.id){
				enfants.push(global.obj.tags[t]);
			}
		}
		return enfants;
	}
	
	this.findchild_visible=function(array_res){
		if (this.visible=='N') {
			var child_of_this=this.get_child();
			for (var c in child_of_this){
				child_of_this[c].findchild_visible(array_res);
			}			
		} else {
			array_res.push(this);
		}
		return array_res;
	}
}

class_tag.charge_tags = function(callback){
  	  var sql='Select * from tag t;';
	  global.obj.app.db.sqlorder(sql,
		function(rows){
		  global.req.async.map(rows,function(tag,callbacktt){
			  var t= new global.req.tag();
			  t.chargeById(tag.id,callbacktt);
		  },function(err,tags){
			  global.obj.tags=tags;
			  global.obj.app.serveur.emit('tag.charge_tags');
			  callback();
		  })
		});
	}
class_tag.charge_parents_tags=function(callback){
	 global.req.async.map(global.obj.tags,function(tag,callbacktt){
		  tag.charge_parents(callbacktt);
	  },function(err,tags){
		  global.obj.app.serveur.emit('tag.charge_parents_tags');
		  callback();
	  })
	}
//class_tag.prototype= new global.req.events.EventEmitter();
module.exports = class_tag;