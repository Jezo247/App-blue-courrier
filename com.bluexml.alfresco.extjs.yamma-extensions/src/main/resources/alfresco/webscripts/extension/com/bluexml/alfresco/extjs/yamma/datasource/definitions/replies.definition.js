(function() {

	DatasourceDefinitions.register('Replies',
		{
		
			searchAdditional : {
				
				listnodes : function(params) {
					
					var nodeRef = params.getFilterValue('nodeRef');
					if (!nodeRef)
						throw new Error("[DataSource.Replies] IllegalStateException! There should be one filter named 'nodeRef'");
					
					var document = search.findNode(nodeRef);
					if (!document)
						throw new Error('[Datasource.Replies] IllegateStateException! Cannot find a valid document for the given nodeRef: ' + nodeRef);
						
					return ReplyUtils.getReplies(document);
					
				}
				
			},
			
			fields : [
				
				'@nodeRef',
				'@typeShort',
				'@mimetype',
				'cm:name',
				'cm:title',
				YammaModel.MAIL_WRITING_DATE_PROPNAME,
				YammaModel.MAIL_SENT_DATE_PROPNAME,
				
				{
					name : YammaModel.MAIL_TYPE_SHORTNAME + '_author',
					type : 'string',
					evaluate : function(reply) {
					
						if (!reply) return '';
						var author = 
							reply.properties['cm:author'] ||
							reply.properties['cm:owner'] ||
							reply.properties['cm:modifier'] ||
							reply.properties['cm:creator'];
							
						if (!author) return '';
						return Utils.Alfresco.getPersonDisplayName(author);

					}
				},
				
				{
					name : 'canAttach',
					type : 'boolean',
					evaluate : function(reply) {
						
						return ReplyUtils.canAttach(reply);
						
					}
				},
				
				{
					name : 'canDelete',
					type : 'boolean',
					evaluate : function(reply) {
						
						return ReplyUtils.canDelete(reply);
						
					}
					
				}
				
			]			
			
	
		}
		
	);

})();