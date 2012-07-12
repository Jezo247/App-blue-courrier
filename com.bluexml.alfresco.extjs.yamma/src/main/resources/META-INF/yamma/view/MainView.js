Ext.define('Yamma.view.MainView',{

	extend : 'Ext.container.Container',
	alias : 'widget.mainview',
	
	requires : [
		'Yamma.view.menus.MainMenu',
		'Yamma.view.MailsView',
		'Yamma.view.ReferencesView',
		'Yamma.view.DisplayView',
		'Yamma.view.EditDocumentView',
		'Yamma.view.charts.StatesStatsView'
	],	
	
	layout : 'border',
	
	defaults : {
		split : true
	},
	
	items : [
		{
			region : 'north',
			layout : 'border',
			
			border : false,
			height : '30%',
			
			defaults : {
				split : true
			},
			
			items : [
				{
					xtype : 'statesstatsview',
					region : 'east',
					width : '25%',
					headerPosition : 'right',
					collapsed : false,
					collapsible : true,
					animCollapse : true,
					collapseMode : 'header'
				},
				{
					xtype : 'mailsview',
					region : 'center'
				}
//				,
//				{
//					xtype : 'referencesview',
//					frame : true,
//					region : 'east',
//					headerPosition : 'right',
//					width : '33%',
//					collapsed : false,
//					collapsible : true,
//					animCollapse : true
//					
//				}
			]			
			
		},
		
		{
			region : 'center',
			layout : 'border',			
			border : false,
			
			defaults : {
				split : true
			},
			
			items : [
				{
					xtype : 'displayview',
					region : 'center',
					title : '',
					headerPosition : 'right'
				},
				{
					xtype : 'editdocumentview',
					region : 'east',
					headerPosition : 'right',
					width : '33%',
					frame : true

				}
			]
			
		}
	]
	
	
});