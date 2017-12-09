/**
 * New node file
 */

var class_numerotation = function numerotation(){}

class_numerotation.create_numero=function(callback,type,arg1,arg2,arg3){
  	  var sql='';
  	  var sqlinsert='';
  	  var paramsql=[];
  	  if (arg3 && arg2 && arg1) {
  		sql= "select max(increment*1)+1 increment from numerotation n" +
  				" where type=? and arg1=? and arg2=? and arg3=?;";
  		sqlinsert= "insert into numerotation (type,arg1,arg2,arg3,increment) values(?,?,?,?,?);";
  		paramsql=[type,arg1,arg2,arg3];
  	  } else if (arg2 && arg1) {
    	sql= "select max(increment*1)+1 increment from numerotation n" +
				" where type=? and arg1=? and arg2=? and arg3 is null;"
    	sqlinsert= "insert into numerotation (type,arg1,arg2,increment) values(?,?,?,?);";
		paramsql=[type,arg1,arg2];
  	  } else if (arg1) {
      	sql= "select max(increment*1)+1 increment from numerotation n" +
      			" where type=? and arg1=? and arg2 is null and arg3 is null;"
      	sqlinsert= "insert into numerotation (type,arg1,increment) values(?,?,?);";
      	paramsql=[type,arg1];
  	  } else {
  		callback(undefined,paramsql);
  	  }
  	  
	  global.obj.app.db.sqlorder(sql,
		function(rows){
		  var res_num=1;
		  if (rows && rows[0] && rows[0].increment){
			  res_num=rows[0].increment
		  } 
		  paramsql.push(res_num);
		  global.obj.app.db.sqltrans(sqlinsert,function(){
			console.log('numérotation inserted',JSON.stringify(paramsql)) 
			callback(res_num,paramsql);
		  },paramsql);
	  	},paramsql);
}

module.exports = class_numerotation;