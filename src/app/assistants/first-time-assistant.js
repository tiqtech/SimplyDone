var _FirstTimeAssistant = {
	initialize:function() {
		this.handlers  = new HandlerManager(this);
		this.model = {
			username:"",
			password:"",
			email:""
		}
	},
	setup:function() {
		this.controller.get("username-label").update($L("Username"));
		this.controller.get("password-label").update($L("Password"));
		this.controller.get("email-label").update($L("Email"));
		this.controller.get("create-account-title").update($L("Account Details"));
		
		this.controller.setupWidget("username-field", {modelProperty: "username"}, this.model);
		this.controller.setupWidget("password-field", {modelProperty: "password"}, this.model);
		this.controller.setupWidget("email-field", {modelProperty: "email"}, this.model);
		this.controller.setupWidget("create-account", {label:$L("Create Account")}, {});
	},
	activate:function() {
		this.controller.listen(this.controller.get("create-account"), Mojo.Event.tap, this.handlers.onCreateAccount);
	},
	deactivate:function() {
		this.controller.stopListening(this.controller.get("create-account"), Mojo.Event.tap, this.handlers.onCreateAccount);
	},
	onCreateAccount:function() {
		this.controller.stageController.swapScene("main");
	}
};

var FirstTimeAssistant = Class.create(_FirstTimeAssistant);