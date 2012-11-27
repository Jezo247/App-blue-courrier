<import resource="classpath:/alfresco/webscripts/extension/com/bluexml/side/alfresco/extjs/utils/utils.lib.js">
<import resource="classpath:/alfresco/extension/com/bluexml/alfresco/init/init-utils.lib.js">

(function() {
	
	var registeredInitDefinitions = sideInitHelper.getRegisteredInitDefinitions();
	var statuses = [];
	
	Utils.forEach(registeredInitDefinitions, function(initDef) {
		
		var 
			installationState = initDef.checkInstalled(),
			actions = [],
			details = initDef.getDetails ? initDef.getDetails() : ''
		;
		
		if (Init.InstallationStates.FULL != installationState && Init.InstallationStates.MODIFIED != installationState) {
			actions.push({
				id : 'execute',
				title : 'Install',
				url : 'bluexml/init/execute/' + initDef.id	
			});
		}
		
		if ( (Init.InstallationStates.PARTIALLY == installationState || Init.InstallationStates.MODIFIED == installationState) && (null != initDef.reset) ) {
			actions.push({
				id : 'reset',
				title : 'Reset',
				url : 'bluexml/init/reset/' + initDef.id
			});
		}
		
		statuses.push({
		
			id : initDef.id,
			state : installationState,
			details : details,
			actions : actions
			
		});
		
	});
	
	model.statuses = statuses;
	
})();