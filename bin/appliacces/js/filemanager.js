/**
 * New node file
 */


var downloadtask=function(URLfilename,filename,callback,folderstore,sizecontrole,callbackprogress){
	this.store = folderstore;
	this.assetURL = URLfilename;
	this.fileName = filename;
	this.callbackfunction=callback;
	this.callbackfunctionprogress=callbackprogress;
	
	this.sizeifexist=sizecontrole;
	var self =this;
	
	this.GetFile=function() {
		//alert('get file '+self.store + self.fileName);
		window.resolveLocalFileSystemURL(self.store + self.fileName, self.fileexist, self.filenotexist);
	}

	this.filenotexist =function(evt) {
		//alert("File not exist! ");
		var fileTransfer = new FileTransfer();
		//alert("start transfer "+self.assetURL);
		/*fileTransfer.onprogress = function(progressEvent) {
			$("#telechargement_video").html(JSON.stringify(progressEvent));
		     //self.callbackfunctionprogress(progressEvent.loaded,self.sizeifexist,self.filename);
		};*/
		alert('get ' +self.assetURL);
		fileTransfer.download(self.assetURL, self.store + self.fileName, 
			function(entry) {
				alert("Download Success! "+self.fileName);
				//$("#telechargement_video").html("");
				self.callbackfunction(entry,self.store + self.fileName,self.filename);
				
			}, 
			function(err) {
			});
	}
	 
	this.fileexist=function(fileEntry) {
		//alert("File exist! ");
		fileEntry.getMetadata(function(metadata){
			if (self.sizeifexist && metadata.size!=self.sizeifexist){
				//alert("Size change! "+self.fileName);
				fileEntry.remove(function(){
					self.filenotexist(null);
				}, function(){});				
			} else {
				//alert("Size Ok! "+self.fileName);
				self.callbackfunction(fileEntry,self.store + self.fileName);
			}

		},function(){});
	}
}


