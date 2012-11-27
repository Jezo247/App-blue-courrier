Ext.define('Yamma.view.edit.EditDocumentView', {

	extend : 'Ext.panel.Panel',
	alias : 'widget.editdocumentview',
	
	requires : [
		'Yamma.view.edit.EditDocumentForm',
		'Yamma.view.comments.CommentsView',
		'Yamma.view.attachments.AttachmentsView',
		'Yamma.utils.datasources.Documents'
	],
	
	layout : 'accordion',
    layoutConfig: {
		titleCollapse: false,
		animate: false
    },
	
	items : [
		{
			xtype : 'editdocumentform'
		},
		{
			xtype : 'attachmentsview'
		},
		{
			xtype : 'commentsview'
		}
	],
	
	updateContext : function(context) {
		
		var
			nodeRef = context.get('nodeRef') || Ext.Error.raise('IllegalArgumentException! The provided nodeRef is not valid'),			
			formId = this.getFormId(context),
			
			editDocumentForm = this.getEditDocumentForm(),
			commentsView = this.getCommentsView(),
			attachmentsView = this.getAttachmentsView()
		;
		
		editDocumentForm.dload(nodeRef, formId);
		commentsView.dload(nodeRef);
		attachmentsView.dload(nodeRef);
		
	},
	
	getFormId : function(context) {
		
		var
			origin = context.get(Yamma.utils.datasources.Documents.MAIL_ORIGIN_QNAME),
			state = context.get(Yamma.utils.datasources.Documents.STATUSABLE_STATE_QNAME)
		;
			
		if ('manual' == origin) return 'fill-online';
		if (state) return 'state_' + state;
		
		return '';
		
	},
	
	getEditDocumentForm : function() {
		if (!this.editDocumentForm) { 
			this.editDocumentForm = this.child('editdocumentform');
		}
		return this.editDocumentForm;
	},
	
	getCommentsView : function() {
		if (!this.commentsView) {
			this.commentsView = this.child('commentsview');
		}
		return this.commentsView;
	},
	
	getAttachmentsView : function() {
		if (!this.attachmentsView) {
			this.attachmentsView = this.child('attachmentsview');
		}
		return this.attachmentsView;
	},
	
	clear : function() {
		
		var 
			editDocumentForm = this.getEditDocumentForm(),
			commentsView = this.getCommentsView(),
			attachmentsView = this.getAttachmentsView()
		;
		
		editDocumentForm.clear();
		commentsView.clear();
		attachmentsView.clear();
		
	}
	
	
});