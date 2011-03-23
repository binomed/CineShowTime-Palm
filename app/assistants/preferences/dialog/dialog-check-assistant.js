function DialogCheckAssistant(sceneAssistant,callbackFunc, defaultValue, key, valueTitle) {
	this.callbackFunc = callbackFunc;
	this.sceneAssistant = sceneAssistant;
	this.controller = sceneAssistant.controller;
	this.value = defaultValue;
	this.valueTitle = valueTitle;
	this.key = key;
	console.log("DialogCheckAssistant"+defaultValue)
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

DialogCheckAssistant.prototype.setup = function(widget) {
	this.widget = widget;
	/* this function is for setup tasks that have to happen when the scene is first created */		
	/* use Mojo.View.render to render view templates and add them to the scene, if needed. */	
	/* setup widgets here */	
	/* add event handlers to listen to events from widgets */
	this.attributes = {
			property: 'value',
			trueValue: 'true',
			falseValue: 'false'
		};

	
	this.model = {
			value: this.value,
			disabled: false
		};
	this.controller.setupWidget('idCheckDialog', this.attributes, this.model);
	
	this.save = this.save.bindAsEventListener(this);
	this.cancel = this.cancel.bindAsEventListener(this);
	
	Mojo.Event.listen(this.controller.get('saveCheckDialog'),Mojo.Event.tap,this.save);
	Mojo.Event.listen(this.controller.get('cancelCheckDialog'),Mojo.Event.tap,this.cancel);
	
	$('idTitleCheckDialog').innerHTML = this.valueTitle;
	$('saveCheckDialog').innerHTML = $L('dialogRateMovieValidate');
	$('cancelCheckDialog').innerHTML = $L('dialogRateMovieCancel');
	
}
DialogCheckAssistant.prototype.save = function(event){
	/* put in event handlers here that should only be in effect when this scene is active. For
	 example, key handlers that are observing the document */
	this.callbackFunc(this.model.value, this.key);
	this.widget.mojo.close();
}
DialogCheckAssistant.prototype.cancel = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
	  
	  this.widget.mojo.close();
}
DialogCheckAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
}


DialogCheckAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

DialogCheckAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
	  Mojo.Event.stopListening(this.controller.get('saveCheckDialog'),Mojo.Event.tap,this.save);
	Mojo.Event.stopListening(this.controller.get('cancelCheckDialog'),Mojo.Event.tap,this.cancel);
}