Ext.define('Yamma.admin.modules.services.CreateServiceForm', {

	extend : 'Yamma.admin.modules.services.ServiceForm',
	
    title: i18n.t('admin.modules.services.servicesform.title'),//'Créer un nouveau service',

    statics : {
    	CREATE_URL : Alfresco.constants.URL_CONTEXT + 'service/modules/create-site'
    },

	initComponent : function() {
		var
			me = this
		;
		
		this.loadingMask = new Ext.LoadMask(me, {msg: i18n.t('admin.modules.services.createserviceform.message.create')});
		this.addEvents('new-service');
		
		this.buttons = [
		    {
				text: i18n.t('admin.modules.services.createserviceform.buttons.create'),
				formBind: true, // only enabled once the form is valid
				disabled: true,
				handler: onCreateServiceButtonClicked
		    }
		];
		
		this.callParent(arguments);
		
		function onCreateServiceButtonClicked() {
			
			var
				form = this.up('form').getForm()
			;
			if (!form.isValid()) return;
	
			var 
				values = form.getValues(false),
				siteShortName = values['shortName'],
				title = values['title']
			;
	
			if (!title) {
				values['title'] = siteShortName;
			}
			
			values['description'] = values['description'] || "Service '" + title + "'";
			
			me.loadingMask.show();
			
			Bluedolmen.Alfresco.jsonPost({
				url : Yamma.admin.modules.services.CreateServiceForm.CREATE_URL,
				dataObj : values,
			    onSuccess: function(response, options) {
			    	
			    	Yamma.admin.modules.services.SitesAdminUtils.setAsService(siteShortName, null /* serviceDefinition */, {
			    		loadingMask : new Ext.LoadMask({
			    			target : me, 
			    			msg: i18n.t('admin.modules.services.createserviceform.message.adding')//"Ajout d'un service en cours..."
			    		}),
			    		onSuccess : function() {
			    			me.fireEvent('new-service', siteShortName);
			    		}
			    	} /* config */);
			    	
			    },
				'finally' : function() {
					me.loadingMask.hide();
				}
			});
			
	}
		
	}
	
	
	
});