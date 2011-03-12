var _ListAssistant = {
	initialize:function(a) {
		Mojo.Log.info("a=")
		
		this.list = {
			items: [{
				"title": "Start the UI",
				"doToday": true,
				"created": "02282011",
				"updated": "02282011",
				"complete": false,
				"list": "b06fc8bfe012f85dfc56231c25d2b558",
				"order": 1,
				"id": "5a2146cdc56a0d69e3dbcd255803a68c",
				"links": {
					"self": "/users/ryan/lists/b06fc8bfe012f85dfc56231c25d2b558/items/5a2146cdc56a0d69e3dbcd255803a68c"
				}
			}, {
				"title": "Finish this app",
				"doToday": true,
				"created": "02282011",
				"updated": "02282011",
				"complete": false,
				"list": "b06fc8bfe012f85dfc56231c25d2b558",
				"order": 2,
				"id": "17b376719e757c7b6320b31a379fec12",
				"links": {
					"self": "/users/ryan/lists/b06fc8bfe012f85dfc56231c25d2b558/items/17b376719e757c7b6320b31a379fec12"
				}
			}, {
				"title": "Do some testing",
				"doToday": false,
				"created": "02282011",
				"updated": "02282011",
				"complete": false,
				"list": "b06fc8bfe012f85dfc56231c25d2b558",
				"order": 3,
				"id": "17b376719e757c7b6320b31a379fec12",
				"links": {
					"self": "/users/ryan/lists/b06fc8bfe012f85dfc56231c25d2b558/items/17b376719e757c7b6320b31a379fec12"
				}
			}]
		};
		
		this.handlers = new HandlerManager(this);
		this.handlers.bind("doTodayDivider");
	},
	setup:function(a) {
		Mojo.Log.info("a");
		this.controller.setupWidget("list-widget", {
			itemTemplate: 'list/item-template',
			reorderable:true,
			addItemLabel: $L('Add ...'),
			swipeToDelete: true,
			dividerFunction:this.handlers.doTodayDivider,
			dividerTemplate:"list/divider"
		}, this.list);
		
		this.controller.setupWidget("item-complete", {modelProperty:"complete"})
	},
	activate:function() {
		this.controller.listen(this.controller.get("list-widget"), Mojo.Event.listTap, this.handlers.onItemTap);
		this.controller.listen(this.controller.get("list-widget"), Mojo.Event.listReorder, this.handlers.onReorder);
	},
	deactivate:function() {
		this.controller.stopListening(this.controller.get("list-widget"), Mojo.Event.listTap, this.handlers.onItemTap)
		this.controller.stopListening(this.controller.get("list-widget"), Mojo.Event.listReorder, this.handlers.onReorder);
	},
	doTodayDivider:function(itemModel) {
		return (itemModel.doToday) ? $L("Today") : $L("Later");
	},
	onItemTap:function(event) {
		this.controller.stageController.pushScene("item", event.item)
	},
	onReorder:function(event) {
		try {
			Mojo.Log.error("before %j", this.list)
			
			this.list.items.splice(event.fromIndex, 1);
			this.list.items.splice(event.toIndex, 0, event.item);
			
			var nextItem = this.list.items[event.toIndex + 1];
			var prevItem = this.list.items[event.toIndex - 1];
			
			if (!nextItem && prevItem) {
				Mojo.Log.error("inheriting previous item doToday", prevItem.doToday)
				event.item.doToday = prevItem.doToday;
			} else if (nextItem) {
				Mojo.Log.error("inheriting next item doToday", nextItem.doToday)
				event.item.doToday = nextItem.doToday;
			}
			
			Mojo.Log.error("after %j", this.list);
			
			this.controller.modelChanged(this.list, this);
			
		} catch (e) {
			Mojo.Log.error(e);
		}
	}
};

var ListAssistant = Class.create(_ListAssistant);