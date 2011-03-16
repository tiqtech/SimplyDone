SimplyDone = {
	getItemTemplate:function() {
		var dt = new Date().toString();
		return {
			title:"",
			description:"",
			created:dt,
			updated:dt,
			complete:false,
			doToday:false
		}
	}
};
