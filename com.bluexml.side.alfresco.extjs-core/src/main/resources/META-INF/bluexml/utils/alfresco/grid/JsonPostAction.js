Ext.define('Bluexml.utils.alfresco.grid.JsonPostAction', {
	
	actionUrl : null,

	jsonPost : function(dataObj, scope) {
		
		dataObj = dataObj || this.getArguments(dataObj);
		
		var 
			me = this,
			actionUrl = me.getActionUrl(), 
			url = Bluexml.Alfresco.resolveAlfrescoProtocol(actionUrl)
		;
		
		if (this.showBusy) {
			this.setBusy(true);
		}
		
//		function onSuccess() {
//			
//		}
//		
//		function onFailure() {
//			
//		}

		Bluexml.Alfresco.jsonPost(
			{
				url : url,
				dataObj : dataObj,
				onSuccess : me.onSuccess,
				onFailure : me.onFailure,
				scope : scope || me
			}
		);
		
	},	
	
	getActionUrl : function() {
		return this.actionUrl;
	},
	
	getArguments : function(dataObj) {
		return {};
	},
	
	onSuccess : function() {
		
		this.fireEvent('actionComplete', 'success', arguments);
		
		if (this.showBusy) {
			this.setBusy(false);
		}
		
	},
	
	onFailure : function() {
		
		this.fireEvent('actionComplete', 'failure', arguments);
		
		if (this.showBusy) {
			this.setBusy(false);
		}
		
	}
	
});