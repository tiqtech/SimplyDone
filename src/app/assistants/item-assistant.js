var _ItemAssistant = {
	initialize:function(model) {
		this.model = model;
	},
	setup:function() {
		this.controller.get("item-title-label").update($L("Title"));
		this.controller.get("item-complete-label").update($L("Complete"));
		this.controller.get("item-description-label").update($L("Description"));
		this.controller.get("item-doToday-label").update("Do Today");
		
		this.controller.setupWidget("item-title-field", {modelProperty: "title"}, this.model);
		this.controller.setupWidget("item-complete-field", {modelProperty: "complete"}, this.model);
		this.controller.setupWidget("item-doToday-field", {modelProperty: "doToday",trueLabel: $L("Yes"),falseLabel: $L("No")}, this.model);
		this.controller.setupWidget("item-description-field", {modelProperty: "description", multiline:true}, this.model);
	}
};

var ItemAssistant = Class.create(_ItemAssistant);