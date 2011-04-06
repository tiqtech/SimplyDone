beListful = {
	Config: {
		secure: false,
		host: "10.0.2.2",
		port: 9000
//		host: "ec2-50-16-63-167.compute-1.amazonaws.com",
//		port: 80
	},
	User: {
		username: null,
		token: "" // future auth token
	},
	url: function(){
		if (!this._url) {
			this._url = ((this.Config.secure) ? "https://" : "http://") + this.Config.host + ":" + this.Config.port;
		}
		
		return this._url;
	},
	get:function(url, callback) {
		this.call(url, "GET", undefined, callback)
	},
	post:function(url, body, callback) {
		this.call(url, "POST", body, callback)
	},
	put:function(url, body, callback) {
		this.call(url, "PUT", body, callback)
	},
	del:function(url, callback) {
		this.call(url, "DELETE", undefined, callback)
	},
	call:function(relativeUrl, method, body, callback) {
		
		var url = this.url() + relativeUrl;
		
		var options = {
			method:method,
			onSuccess:this.onSuccess.bind(this, callback),
			onFailure:this.onFailure.bind(this, callback)
		};
		
		// XmlHttpRequest in webOS WebKit doesn't support DELETE method
		// so have to revert to "compatibility" method of DELETE over POST
		if(method === "DELETE") {
			options.parameters = "_method=DELETE";
			options.method="POST";
		} else if(body) {
			options.contentType = "application/json";
			options.postBody = JSON.stringify(body);
		}
		
		new Ajax.Request(url, options);
	},
	authenticate:function(username, password) {
		// not implemented
		this.User.username = "ryan";
	},
	onFailure:function(callback,response) {
		Mojo.Controller.getAppController().showBanner($L("Unable to complete request"), {response:response}, "error-banner");
		callback(undefined, response.status);
	},
	onSuccess:function(callback, response) {
		callback(response.responseJSON);
	}
}


