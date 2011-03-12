var HandlerManager = Class.create({
	initialize:function(owner, autoBind) {
		this._owner = owner;
		
		if(autoBind == true || typeof(autoBind) === "undefined") {
			var m = [];
			for(var k in owner) {
				// search for any function that starts with onX* or handleX*
				if(Object.isFunction(owner[k]) && k.match(/^(on|handle)[A-Z].*/)) {
					m.push(k);
				}
			}
			
			if(m.length > 0) {
				this.bind(m);
			}
		}
	},
	bind:function(name) {
		if(!Object.isArray(name)) {
			name = [name];
		}
		
		for(var i=0;i<name.length;i++) {
			var n = name[i];
			this[n] = this._owner[n].bind(this._owner);
		} 
	},
	release:function(name) {
		try {
			if(name) {
				this[name] = null;
			} else {
				for(var p in this) {
					if(p.indexOf("_") != 0 && typeof(p) == "object") {
						this[p] = null;
					}
				}
			}
		} catch (e) {
			Mojo.Log.warn(e);
		}
	}
});

var ElementCache = Class.create({
	initialize:function(assistant, ids) {
		this.assistant = assistant;
		this.cache = {};
				
		if(!!ids) {
			for(var i=0;i<ids.length;i++) {
				this.get(ids[i]);
			}
		}
	},
	get:function(id) {
		return (!!this.cache[id]) ? this.cache[id] : this.assistant.controller.get(id);
	},
	refresh:function(id) {
		// if id is provided, only refresh that item.  otherwise, validate all items
		if(!!id) {
			this.cache[id] = this.assistant.controller.get(id);
			return this.cache[id];
		} else {
			for(var k in this.cache) {
				var x = this.assistant.controller.get(k);
				// only cache if it's valid
				if(!!x) {
					this.cache[k] = x;
				}
			}
		}
	},
	release:function(id) {
		// if id is provided, only refresh that item.  otherwise, validate all items
		if(!!id) {
			delete this.cache[id];
		} else {
			for(var k in this.cache) {
				delete this.cache[k];
			}
		}
	},
	remove:function(idOrElement) {
		var e = (!!idOrElement.id) ? idOrElement : this.get(idOrElement);
		
		this.assistant.controller.remove(e);
		this.release(e.id);
	}
});