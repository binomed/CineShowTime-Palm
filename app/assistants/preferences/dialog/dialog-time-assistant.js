function DialogTimeAssistant(sceneAssistant,callbackFunc, defaultValue, key, valueTitle) {
	this.callbackFunc = callbackFunc;
	this.sceneAssistant = sceneAssistant;
	this.controller = sceneAssistant.controller;
	this.value = defaultValue;
	this.valueTitle = valueTitle;
	this.key = key;
	console.log("DialogTimeAssistant"+defaultValue)
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

DialogTimeAssistant.prototype.setup = function(widget) {
	this.widget = widget;
	/* this function is for setup tasks that have to happen when the scene is first created */		
	/* use Mojo.View.render to render view templates and add them to the scene, if needed. */	
	/* setup widgets here */	
	/* add event handlers to listen to events from widgets */
	this.attributes = {
		label:	'Integer',
		min: 1,
		max: 60,
		modelProperty:	'value'
	    };
	this.model = {
		value : this.value
	}
	this.controller.setupWidget('valueTimeDialog', this.attributes, this.model);
	
	this.save = this.save.bindAsEventListener(this);
	this.cancel = this.cancel.bindAsEventListener(this);
	
	Mojo.Event.listen(this.controller.get('saveTimeDialog'),Mojo.Event.tap,this.save);
	Mojo.Event.listen(this.controller.get('cancelTimeDialog'),Mojo.Event.tap,this.cancel);
	
	$('idTitleTimeDialog').innerHTML = this.valueTitle;
	$('saveTimeDialog').innerHTML = $L('dialogRateMovieValidate');
	$('cancelTimeDialog').innerHTML = $L('dialogRateMovieCancel');
	
}
DialogTimeAssistant.prototype.save = function(event){
	/* put in event handlers here that should only be in effect when this scene is active. For
	 example, key handlers that are observing the document */
	this.callbackFunc(this.model.value, this.key);
	this.widget.mojo.close();
}
DialogTimeAssistant.prototype.cancel = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
	  
	  this.widget.mojo.close();
}
DialogTimeAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
}


DialogTimeAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

DialogTimeAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
	  Mojo.Event.stopListening(this.controller.get('saveTimeDialog'),Mojo.Event.tap,this.save);
	Mojo.Event.stopListening(this.controller.get('cancelTimeDialog'),Mojo.Event.tap,this.cancel);
}