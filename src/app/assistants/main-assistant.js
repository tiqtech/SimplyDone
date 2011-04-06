var _MainAssistant = {
	initialize:function(user) {
		this.handlers = new HandlerManager(this);
		this.user = user;
		this.model = {items:null}
	},
	setup:function() {
		this.controller.get("my-lists-title").update($L("My Lists"));
		this.controller.setupWidget("my-lists", {
			itemTemplate: 'main/list-item-template',
			addItemLabel: $L('Add')+' ...',
			swipeToDelete: true,
			itemsCallback: this.handlers.onGetItems
		});
		
		this.listWidget = this.controller.get("my-lists");
	},
	activate:function() {
		if(this.editIndex) {
			this.listWidget.mojo.noticeUpdatedItems(this.editIndex, this.model.items.slice(this.editIndex, this.editIndex+1));
			this.editIndex = undefined;
		}
		
		this.controller.listen(this.listWidget, Mojo.Event.listTap, this.handlers.onListTap);
		this.controller.listen(this.listWidget, Mojo.Event.listAdd, this.handlers.onAddList);
		this.controller.listen(this.listWidget, Mojo.Event.listDelete, this.handlers.onDeleteList);
	},
	deactivate:function() {
		this.controller.stopListening(this.listWidget, Mojo.Event.listTap, this.handlers.onListTap);
		this.controller.stopListening(this.listWidget, Mojo.Event.listAdd, this.handlers.onAddList);
		this.controller.stopListening(this.listWidget, Mojo.Event.listDelete, this.handlers.onDeleteList);
	},
	onGetItems:function(widget, offset, count) {
		if(this.model.items) {
			widget.mojo.noticeAddedItems(offset, this.model.items.slice(offset, count));
		} else {
			beListful.get(this.user.links.lists, function(items) {
				this.model.items = items;
				this.onGetItems(widget, offset, count);
			}.bind(this));	
		}
	},
	onListTap:function(event) {
		this.editIndex = event.index;
		this.controller.stageController.pushScene("list", event.item);
	},
	onAddList:function(event) {
		var item = {"template":"basic","name":"New List","description":""};
		var that = this;
		beListful.post(this.user.links.lists, item, function(obj, err) {
			if (obj) {
				that.model.items.push(obj);
				that.listWidget.mojo.noticeAddedItems(that.model.items.length-1, [obj]);
				this.editIndex = that.model.items.length-1;
				that.controller.stageController.pushScene("list", obj);
			} else {
				Mojo.Log.error("error=",err);
			}
		});
	},
	onDeleteList:function(event) {
		beListful.del(event.item.links.self, function(obj, err) {
			if(err) {
				Mojo.Log.error("Unable to delete list");
			}
		});
	}
};

var MainAssistant = Class.create(_MainAssistant);