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
		
		var firstTime = true;
		var sceneName = (firstTime) ? "first-time" : "main";
		
		stageController.pushScene({
			name:sceneName,
			transition:Mojo.Transition.crossFade,
			disableSceneScroller:true
		});
	}
}

var AppAssistant = Class.create(_AppAssistant);
