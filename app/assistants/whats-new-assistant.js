function WhatsNewAssistant(sceneAssistant) {
	this.sceneAssistant = sceneAssistant;
	this.controller = sceneAssistant.controller;
	this.cst = sceneAssistant.cst;
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

WhatsNewAssistant.prototype.setup = function(widget) {
	this.widget = widget;
	
	this.controller.setupWidget("whatsNewScroll", {mode: 'vertical'}, {});
	$('whatsNewScroll').style.height = (Mojo.Environment.DeviceInfo.screenHeight - 200) + "px";
	
	this.btnPressed = this.btnPressed.bindAsEventListener(this);
	
	$('whats-new_title').innerHTML = $L("dialogLastChangeTitle");
	$('whats-new_content').innerHTML = this.cst.LAST_CHANGE_MESSAGE;
	
	this.controller.setupWidget("ok_btn", {}, { label : "OK", disabled: false });		
	Mojo.Event.listen(this.controller.get('ok_btn'),Mojo.Event.tap,this.btnPressed);
		
}

WhatsNewAssistant.prototype.btnPressed = function(event){
	/* put in event handlers here that should only be in effect when this scene is active. For
	 example, key handlers that are observing the document */
	this.widget.mojo.close();
}
WhatsNewAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
}


WhatsNewAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

WhatsNewAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
	  Mojo.Event.stopListening(this.controller.get('ok_btn'),Mojo.Event.tap,this.save);
}