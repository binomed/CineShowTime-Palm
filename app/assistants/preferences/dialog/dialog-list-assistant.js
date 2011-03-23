function DialogListAssistant(sceneAssistant,callbackFunc, defaultValue, key, valueTitle, listValue) {
	this.callbackFunc = callbackFunc;
	this.sceneAssistant = sceneAssistant;
	this.controller = sceneAssistant.controller;
	this.value = defaultValue;
	this.valueTitle = valueTitle;
	this.listValue = listValue;
	this.key = key;
	console.log("DialogListAssistant"+defaultValue)
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

DialogListAssistant.prototype.setup = function(widget) {
	this.widget = widget;
	/* this function is for setup tasks that have to happen when the scene is first created */		
	/* use Mojo.View.render to render view templates and add them to the scene, if needed. */	
	/* setup widgets here */	
	/* add event handlers to listen to events from widgets */
	this.attributes = {
			property: 'value',
			choices: this.listValue
		};

	
	this.model = {
			value: this.value,
			disabled: false
		};
	
	
	
	this.controller.setupWidget('idListDialog', this.attributes, this.model);
	
	this.save = this.save.bindAsEventListener(this);
	this.cancel = this.cancel.bindAsEventListener(this);
	
	Mojo.Event.listen(this.controller.get('saveListDialog'),Mojo.Event.tap,this.save);
	Mojo.Event.listen(this.controller.get('cancelListDialog'),Mojo.Event.tap,this.cancel);
	
	$('idTitleListDialog').innerHTML = this.valueTitle;
	$('saveListDialog').innerHTML = $L('dialogRateMovieValidate');
	$('cancelListDialog').innerHTML = $L('dialogRateMovieCancel');
	
}
DialogListAssistant.prototype.save = function(event){
	/* put in event handlers here that should only be in effect when this scene is active. For
	 example, key handlers that are observing the document */
	this.callbackFunc(this.model.value, this.key);
	this.widget.mojo.close();
}
DialogListAssistant.prototype.cancel = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
	  
	  this.widget.mojo.close();
}
DialogListAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
}


DialogListAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

DialogListAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
	  Mojo.Event.stopListening(this.controller.get('saveListDialog'),Mojo.Event.tap,this.save);
	Mojo.Event.stopListening(this.controller.get('cancelListDialog'),Mojo.Event.tap,this.cancel);
}