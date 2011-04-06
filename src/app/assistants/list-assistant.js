var _ListAssistant = {
	initialize:function(list) {
		this.list = list;
		this.handlers = new HandlerManager(this);
		this.doTodayList = null;
		this.doLaterList = null;
		
		this.doTodayModel = {
			title:"doToday",
			items: null
		};
		
		this.doLaterModel = {
			title:"doLater",
			items: null
		};
		
		this.commandMenuModel = {
			visible:true,
			items:[
				{label:"Add",command:"add-item"}
			]
		}
		
		this.disableUpdate = false;
		
		this.deletedItems = {};
	},
	setup:function() {
		var listAttributes = {
			itemTemplate: 'list/item-template',
			reorderable:true,
			swipeToDelete: true,
			emptyTemplate:"list/empty",
			dragDatatype:"simply-done-item",
			uniquenessProperty:"id",
			itemsCallback:this.handlers.onLoadItems
		};
		
		this.controller.setupWidget("list-title", {modelProperty: "name"}, this.list);
		this.controller.setupWidget("list-description", {modelProperty: "description"}, this.list);
		this.controller.setupWidget("doToday-list", listAttributes);
		this.controller.setupWidget("doLater-list", listAttributes);
		this.controller.setupWidget("item-complete", {modelProperty:"complete"});
		this.controller.setupWidget(Mojo.Menu.commandMenu, {}, this.commandMenuModel)
		
		this.doTodayList = this.controller.get("doToday-list");
		this.doLaterList = this.controller.get("doLater-list");
		this.titleBar = this.controller.select("DIV.list-title")
		
		beListful.get(this.list.links.items, this.handlers.onGetItems);
	},
	activate:function() {
		// clear disableUpdate flag
		this.disableUpdate = false;
		
		if (!this.titleFieldInput) {
			this.titleFieldInput = this.controller.select("DIV#list-title INPUT");
		}
		
		if (!this.descriptionFieldInput) {
			this.descriptionFieldInput = this.controller.select("DIV#list-description INPUT");
		}
		
		this.titleFieldInput.onfocus = this.handlers.onFocusTitleField;
		//this.controller.listen(this.descriptionFieldInput, "onfocus", this.handlers.onFocusTitleField)
		
		this.controller.listen(this.doTodayList, Mojo.Event.listAdd, this.handlers.onAddItem);
		this.controller.listen(this.doTodayList, Mojo.Event.listDelete, this.handlers.onDeleteItem);
		this.controller.listen(this.doTodayList, Mojo.Event.listTap, this.handlers.onItemTap);
		this.controller.listen(this.doTodayList, Mojo.Event.listReorder, this.handlers.onReorder);
		
		this.controller.listen(this.doLaterList, Mojo.Event.listAdd, this.handlers.onAddItem);
		this.controller.listen(this.doLaterList, Mojo.Event.listDelete, this.handlers.onDeleteItem);
		this.controller.listen(this.doLaterList, Mojo.Event.listTap, this.handlers.onItemTap);
		this.controller.listen(this.doLaterList, Mojo.Event.listReorder, this.handlers.onReorder);
	},
	deactivate:function() {
		
		for(var k in this.deletedItems) {
			beListful.del(this.deletedItems[k].links.self, function() {});
		}
		
		if (!this.disableUpdate) {
			beListful.put(this.list.links.items, this.combineItems(), function(){});
		}
		
		this.controller.stopListening(this.doTodayList, Mojo.Event.listAdd, this.handlers.onAddItem);
		this.controller.stopListening(this.doTodayList, Mojo.Event.listDelete, this.handlers.onDeleteItem);
		this.controller.stopListening(this.doTodayList, Mojo.Event.listTap, this.handlers.onItemTap)
		this.controller.stopListening(this.doTodayList, Mojo.Event.listReorder, this.handlers.onReorder);
	
		this.controller.stopListening(this.doLaterList, Mojo.Event.listAdd, this.handlers.onAddItem);
		this.controller.stopListening(this.doLaterList, Mojo.Event.listDelete, this.handlers.onDeleteItem);
		this.controller.stopListening(this.doLaterList, Mojo.Event.listTap, this.handlers.onItemTap);
		this.controller.stopListening(this.doLaterList, Mojo.Event.listReorder, this.handlers.onReorder);
	},
	handleCommand:function(event) {
		if(event.type == Mojo.Event.command) {
			switch(event.command) {
				case "add-item":
					this.onAddNewItem();
					break;
			}
		}
	},
	onGetItems:function(items) {
		this.doTodayModel.items = [];
		this.doLaterModel.items = [];
		
		for(var i=0;i<items.length;i++) {
			this[(items[i].doToday) ? "doTodayModel" : "doLaterModel"].items.push(items[i]);
		}
		
		if(this.doTodayModel.items.length == 0) {
			this.doTodayModel.items.push(this.getEmptyListItem(true));
		}
		
		if(this.doLaterModel.items.length == 0) {
			this.doLaterModel.items.push(this.getEmptyListItem(false));
		}
		
		this.doTodayList.mojo.noticeAddedItems(0, this.doTodayModel.items);
		this.doLaterList.mojo.noticeAddedItems(0, this.doLaterModel.items);				
	},
	onLoadItems:function(widget, offset, count) {
		var model = (widget == this.doTodayList) ? this.doTodayModel : this.doLaterModel;
		
		if(model.items) {
			widget.mojo.noticeAddedItems(offset, model.items.slice(offset, count));
		}
	},
	onDeleteItem:function(event) {
		var m = this.getListModel(event);		
		m.items.splice(event.index, 1);
		
		this.deletedItems[event.item.id] = event.item;
		
		// add "no-items" item if the last real item is removed
		if(m.items.length === 0 ) {
			m.items.push(this.getEmptyListItem(m===this.doTodayModel));
			var widget = event.currentTarget;
			(function(){
				widget.mojo.noticeAddedItems(0, m.items);
			}).defer(0);
		}
	},
	/** Add item due to drag and drop **/
	onAddItem:function(event) {
		var doToday = (event.currentTarget === this.doTodayList);
		var m = this.getListModel(event);

		// remove item from delete queue if adding to another list
		if(this.deletedItems[event.item.id]) {
			delete this.deletedItems[event.item.id];
		}
		
		event.item.doToday = doToday;
		this.addListItem(event.currentTarget, m, event.item, event.index);
	},
	/** Show add new item scene on command menu button click **/
	onAddNewItem:function() {
		// prevent beListful update when pushing item scene
		this.disableUpdate = true; 
		this.controller.stageController.pushScene("item", SimplyDone.getItemTemplate(), this.handlers.onNewItem);
	},
	/** callback from onAddNewItem **/
	onNewItem:function(item) {
		if(!item) return;
		
		if(item.doToday) {
			this.addListItem(this.doTodayList, this.doTodayModel, item, this.doTodayModel.items.length, true);
		} else {
			this.addListItem(this.doLaterList, this.doLaterModel, item, this.doLaterModel.items.length, true)
		}
				
		// send to server and report any errors that occur
		beListful.post(this.list.links.items, item, function(response) {
			item.id = response.id;
		}.bind(this));
	},
	onItemTap:function(event) {
		// prevent beListful update when pushing item scene
		this.disableUpdate = true;
		this.controller.stageController.pushScene("item", event.item)
	},
	onReorder:function(event) {
		var m = this.getListModel(event);
		
		m.items.splice(event.fromIndex, 1);
		m.items.splice(event.toIndex, 0, event.item);
	},
	onFocusTitleField:function(event) {
		this.titleBar.addClassName("focused");
	},
	getListModel:function(event) {
		return (event.currentTarget === this.doTodayList) ? this.doTodayModel : this.doLaterModel;
	},
	getEmptyListItem:function(doToday) {
		return {
			noItemsMessage: (doToday) ? $L("No tasks for today") : $L("No tasks for later"),
			noItemsClass:"no-items"
		}
	},
	addListItem:function(widget, model, newItem, newIndex, notice) {
		Mojo.Log.error("addListItem",widget==this.doTodayList,model==this.doTodayModel,newItem,newIndex,notice);
		if(model.items.length === 1 && model.items[0].noItemsClass) {
			model.items[0] = newItem;
			widget.mojo.noticeRemovedItems(0, 1);
		} else {
			model.items.splice(newIndex, 0, newItem);
			
			if(notice) {
				widget.mojo.noticeAddedItems(newIndex, [newItem]);
			}
		}
	},
	combineItems:function() {
		var items = [];
		
		// strip "no item" items from each model
		for(var i=0;i<this.doTodayModel.items.length;i++) {
			if(!this.doTodayModel.items[i].noItemsClass) {
				items.push(this.doTodayModel.items[i]);
			}
		}
		
		for(var i=0;i<this.doLaterModel.items.length;i++) {
			if(!this.doLaterModel.items[i].noItemsClass) {
				items.push(this.doLaterModel.items[i]);
			}
		}
		
		for(var i=0;i<items.length;i++) {
			items[i].order = i+1;
		}
		
		return items;
	},
	dumpModel:function(label, m) {
		Mojo.Log.error(label,"-",m.title);
		for(var i=0;i<m.items.length;i++) {
			Mojo.Log.error(m.items[i].order + ": " + m.items[i].title);
		}
	}
};

var ListAssistant = Class.create(_ListAssistant);