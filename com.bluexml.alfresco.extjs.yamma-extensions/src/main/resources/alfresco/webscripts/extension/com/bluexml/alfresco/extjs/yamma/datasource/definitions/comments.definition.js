(function() {
	
	const UNKNOWN_AUTHOR = '(inconnu)'

	DatasourceDefinitions.register('Comments',
		{
		
			searchAdditional : {
				
				listnodes : function(params) {
					
					var nodeRef = params.getFilterValue('nodeRef');
					if (!nodeRef)
						throw new Error("[DataSource.Comments] IllegalStateException! There should be one filter named 'nodeRef'");
					
					var document = search.findNode(nodeRef);
					if (null == document)
						throw new Error('[Datasource.Comments] IllegateStateException! Cannot find a valid document for the given nodeRef: ' + nodeRef);
						
					return CommentUtils.getComments(document);
					
				}
				
			},
			
			fields : [
				
				'@nodeRef',
				'cm:title',
				{
					name : 'author',
					type : 'string',
					evaluate : function(node) {
						var creator = node.properties['cm:creator'];
						if (!creator) return UNKNOWN_AUTHOR;
						
						return Utils.Alfresco.getPersonDisplayName(creator);
					}
				},
				{
					name : 'avatar',
					type : 'string',
					evaluate : function(node) {
						var creator = node.properties['cm:creator'];
						if (!creator) return '';
						
						return Utils.Alfresco.getPersonAvatarUrl(creator);
					}
					
				},
				{
					name : 'cm:content',
					type : 'string',
					evaluate : function(node) {
						var contentString = '' + node.content;
						return contentString;
					}
				},
				'cm:created',
				'cm:modified',
				
				{
					name : 'canEdit',
					type : 'boolean',
					evaluate : function(node) {
						var canEdit = node.hasPermission('Write');
						return canEdit;
					}
				},
				{
					name : 'canDelete',
					type : 'boolean',
					evaluate : function(node) {
						var canDelete = node.hasPermission('Delete');
						return canDelete;
					}
				}
				
				
				
			]			
			
	
		}
		
	);

})();