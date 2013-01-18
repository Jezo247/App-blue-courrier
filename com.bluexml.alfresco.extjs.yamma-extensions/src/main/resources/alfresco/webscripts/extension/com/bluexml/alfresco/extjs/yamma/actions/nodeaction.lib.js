
(function() {

	Actions = Utils.ns('Yamma.Actions');
	
	Actions.Utils = {
		
		getRepliesListDescription : function(node) {
			
			var 
				replies = ReplyUtils.getReplies(node),
				replyNames = Utils.map(replies, function(replyNode) {
					return replyNode.properties.title || replyNode.name;
				}),			
				formattedRepliesTitle = Utils.String.join(replyNames, ',')				
			;
			
			return ({
				
				repliesNames : replyNames,
				titleList : formattedRepliesTitle,
				hasMany : replies.length > 1
				
			});			
			
		}
		
	};
	
	Actions.NodeAction = Utils.Object.create({
		
		fullyAuthenticatedUserName : Utils.Alfresco.getFullyAuthenticatedUserName(),
		
		parseArgs : null,
		
		node : null, // iterator on nodes
		nodes : null,
		
		wsArguments : null,
		nodeArg : 'nodeRef',
		
		failureReason : '', 
		
		execute : function() {
			
			var me = this;
			
			Common.securedExec(function() {
			
				me.parseArguments();
			
				me.extractNodes();
				
				me.prepare();
				
				if (!me.isBatchExecutable()) {
					throw {
						code : '403',
						message : 'Forbidden! The action cannot be executed by you in the current context' + (me.failureReason ? ': ' + me.failureReason : '')
					}			
				}
				
				me.doBatchExecute();
				
				me.setModel();
				
			});
			
		},
		
		parseArguments : function() {
			
			var 
				wsArguments = (this.wsArguments || []).concat({ name : this.nodeArg, mandatory : true})
			;
			
			this.parseArgs = this.parseArgs || ( new ParseArgs(wsArguments) );
			
		},
		
		extractNodes : function() {
			
			if (null == this.nodeArg) {
				throw {
					code : '500',
					message : 'IllegalStateException! The node-argument is invalid'
				}
			}
			
			var 
				me = this,
				nodeArg = this.nodeArg,
				nodeRef = this.parseArgs[nodeArg]
			;
			nodeRef = Utils.String.trim(Utils.asString(nodeRef));
			
			if (Utils.Alfresco.isNodeRef(nodeRef)) {
				this.node = this.extractNode(nodeRef);
				this.nodes = [this.node];
			} else if (nodeRef.indexOf('[') == 0) {
				var nodeRefs = Utils.JSON.parse(nodeRef);
				this.nodes = Utils.map(nodeRefs, function(nodeRef) {
					return me.extractNode(nodeRef);
				});
			}
			
			
		},
		
		extractNode : function(nodeRef) {
			
			if (Utils.Alfresco.isNodeRef(nodeRef)) {
			
				var node = search.findNode(nodeRef);
				if (null != node) return node;
				
			}
			
			throw {
				code : '512',
				message : "InvalidStateException! The provided nodeRef='" + Utils.asString(nodeRef) + "' is not a valid nodeRef or it does not exist in the repository"
			}
			
		},
		
		prepare : function() {
			
		},
		
		isBatchExecutable : function() {
			
			var
				me = this,
				isExecutable = true
			;
			
			Utils.forEach(this.nodes, function(node) {
				me.node = node;
				var _isExecutable = me.isExecutable(node);
				
				if ('string' == typeof _isExecutable) {
					// failure
					this.failureReason = _isExecutable;
				}
				
				isExecutable &= ( true === _isExecutable );
				return isExecutable; // breaks on isExecutable == false
			});
			
			return isExecutable;
			
		},
		
		isExecutable : function(node) {
			return true;
		},
		
		doBatchExecute : function() {
			
			var me = this;
			
			Utils.forEach(this.nodes, function(node) {
				me.node = node;
				me.doExecute(node);
			});
			
		},
		
		doExecute : function(node) {
			// Should be implemented by prototyping classes
		},
		
		setModel : function() {
			
			model.actionOutcome = this.getActionOutcome(); 
			
		},
		
		getActionOutcome : function() {
			
			var me = this;
			
			return ({
				nodes : Utils.map(this.nodes, function(node) {
					return me.getNodeOutcome(node);
				})
			});
			
		},
		
		getNodeOutcome : function(node) {
			return Utils.asString(node.nodeRef);
		}
		
	});
	
	Actions.DocumentNodeAction = Utils.Object.create(Actions.NodeAction, {
		
		eventType : null,
	
		updateDocumentState : function(newState) {
			this.node.properties[YammaModel.STATUSABLE_STATE_PROPNAME] = newState;				
			this.node.save();
		},
		
		updateDocumentHistory : function(commentKey, commentArgs, referrer, delegate) {
			
			if (null == this.eventType) return;
			
			var 
				message = msg.get(commentKey, commentArgs || []),
				trimmedMessage = Utils.String.trim(message)
			;
			
			// set a new history event
			HistoryUtils.addHistoryEvent(
				this.node, 
				this.eventType, /* eventType */
				message, /* comment */
				referrer, /* referrer */
				delegate /* delegate */
			);
			
		},
		
		getNodeOutcome : function(node) {
			return ({
				nodeRef : Utils.asString(node.nodeRef),
				state : node.properties[YammaModel.STATUSABLE_STATE_PROPNAME] || ''
			});
		}
		
		
	});
	
	Actions.ManagerDocumentNodeAction = Utils.Object.create(Actions.DocumentNodeAction, {
		
		managerUserName : null,
		
		parseArguments : function() {
			
			this.wsArguments = (this.wsArguments || []).concat('manager');
			Actions.NodeAction.parseArguments.call(this);
			
		},
		
		prepare : function() {
			
			this.managerUserName = Utils.asString(this.parseArgs['manager']);
			
		},
		
		isExecutable : function(node) {
			
			/*
			 * This complexity is not necessary yet but may be in the future.
			 * The batched nodes actions can indeed only receive nodes from the
			 * same service.
			 */
			var isServiceManager = DocumentUtils.isServiceManager(node, this.fullyAuthenticatedUserName);
			if (!isServiceManager && this.managerUserName) {
				isServiceManager = DocumentUtils.isServiceManager(node, this.managerUserName);
			}
			
			if (!isServiceManager) {
				return 'The action cannot be executed by a service-assistant without providing a manager w.r.t. node=\'' + node.nodeRef + '\'';
			}
			
			return true;
			
		},
		
		updateDocumentHistory : function(msgKey, commentArgs) {
			
			Actions.DocumentNodeAction.updateDocumentHistory.call(this, 
				msgKey, 
				commentArgs,
				this.managerUserName || this.fullyAuthenticatedUserName, /* referrer */
				this.fullyAuthenticatedUserName /* delegate */
			);
			
		}


		
	});

	Actions.InstructorDocumentNodeAction = Utils.Object.create(Actions.DocumentNodeAction, {
				
		updateDocumentHistory : function(msgKey, commentArgs) {
			
			var
				assignedAuthority = DocumentUtils.getAssignedAuthority(this.node),
				isAssignedAuthority = DocumentUtils.isAssignedAuthority(this.node, this.fullyAuthenticatedUserName)				
			;
			
			Actions.DocumentNodeAction.updateDocumentHistory.call(this, 
				msgKey, 
				commentArgs,
				assignedAuthority, /* referrer */
				isAssignedAuthority ? null : this.fullyAuthenticatedUserName /* delegate */
			);
			
		}

		
	});
	
	
})();