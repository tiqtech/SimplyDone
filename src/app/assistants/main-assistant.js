var _MainAssistant = {
	initialize:function() {
		this.handlers = new HandlerManager(this);
        this.lists = {
			items: [{
				"template": "basic",
				"name": "TODO",
				"description": "Basic Todo List",
				"id": "5d6f09cbf2f1e92005b6de4cefb44b1c",
				"links": {
					"self": "/users/ryan/lists/5d6f09cbf2f1e92005b6de4cefb44b1c",
					"items": "/users/ryan/lists/5d6f09cbf2f1e92005b6de4cefb44b1c/items",
					"owner": "/users/ryan"
				}
			}, {
				"template": "basic",
				"name": "Groceries",
				"description": "Yummy food to get",
				"id": "81502fb9906a3cb805c0701886d2359c",
				"links": {
					"self": "/users/ryan/lists/81502fb9906a3cb805c0701886d2359c",
					"items": "/users/ryan/lists/81502fb9906a3cb805c0701886d2359c/items",
					"owner": "/users/ryan"
				}
			}]
		};
	},
	setup:function() {
		this.controller.get("my-lists-title").update($L("My Lists"));
		this.controller.setupWidget("my-lists", {
			itemTemplate: 'main/list-item-template',
			addItemLabel: $L('Add ...'),
			swipeToDelete: true
		}, this.lists);
	},
	activate:function() {
		this.controller.listen(this.controller.get("my-lists"), Mojo.Event.listTap, this.handlers.onListTap);
	},
	deactivate:function() {
		this.controller.stopListening(this.controller.get("my-lists"), Mojo.Event.listTap, this.handlers.onListTap);
	},
	onListTap:function(event) {
		this.controller.stageController.pushScene("list", event.item);
	}
};

var MainAssistant = Class.create(_MainAssistant);