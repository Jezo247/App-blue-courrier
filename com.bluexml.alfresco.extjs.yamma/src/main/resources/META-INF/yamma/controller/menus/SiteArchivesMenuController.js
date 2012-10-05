Ext.define('Yamma.controller.menus.SiteArchivesMenuController', {
	
	extend : 'Yamma.controller.menus.MainMenuController',
	
	init: function() {
		
		this.control({
			'sitearchivesmenu': {
				itemclick : this.onItemClick
			}
		});
		
		this.callParent();
	},
	
	extractContext : function(record) {
		
		if (!record) return {};
		
		var context = Ext.create('Yamma.utils.Context', {
			filters : [
				{
					property : 'archived',
					value : 'true'
				}
			]
		});
		
		// Iterates through ancestors to get the hierarchical context
		for (var iterator = record; null != iterator ; iterator = iterator.parentNode) {
			
			var type = iterator.get('type');
			
			if ('st:site' === type) {
				var serviceName = iterator.get('name');
				
				context.setService({
					label : iterator.get('text'),
					serviceName : serviceName,
					nodeRef : iterator.get('id')
				});
				
				context.setTitle(
					Ext.String.format('Documents archivés du service {0}', serviceName)
				);
				
			}
		}
		
		return context;
		
	}
	
	
});