var _AppAssistant = {
	initialize:function() {
		this.handlers = new HandlerManager(this);
	},
	handleLaunch: function(params){
		var c = this.controller.getStageController("main");
		if (!c) {
			// only post data when Main is created
			//this.Metrix.postDeviceData();
			
			this.controller.createStageWithCallback({
				name: "main",
				lightweight: true
			}, this.handlers.onCreateStage, "card");
		}
	},
	onCreateStage:function(stageController) {
		Mojo.Log.info("> onCreateStage");
		
		var firstTime = false;
		var sceneName = (firstTime) ? "first-time" : "main";
		
		beListful.get("/users/ryan", function(user) {
			stageController.pushScene({
				name:sceneName,
				transition:Mojo.Transition.crossFade
			}, user);	
		});
	}
}

var AppAssistant = Class.create(_AppAssistant);
