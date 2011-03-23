function AboutAssistant(sceneAssistant) {
	this.sceneAssistant = sceneAssistant;
	this.controller = sceneAssistant.controller;
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

AboutAssistant.prototype.setup = function(widget) {
	this.widget = widget;
	
	this.btnPressed = this.btnPressed.bindAsEventListener(this);
	
	$('about_title').innerHTML = Mojo.Controller.appInfo.title;
	$('about_version').innerHTML = "v"+Mojo.Controller.appInfo.version;
	
	$('about_devby').innerHTML = $L("msgDevelopped") + " <a href=\"http://m.blog.binomed.fr\">Binomed</a>";
	$('about_translated').innerHTML = $L("msgTraductorName");
	
	$('about_copyright').innerHTML = Mojo.Controller.appInfo.copyright;
	$('about_licence').innerHTML = Mojo.Controller.appInfo.licence;
	
	//$('about_contenu').innerHTML = $L("msgTraductorName") + "<br />" + parseLinks($L("msgDonation"));
	
	this.controller.setupWidget("ok_btn", {}, { label : "OK", disabled: false });		
	Mojo.Event.listen(this.controller.get('ok_btn'),Mojo.Event.tap,this.btnPressed);
		
}

AboutAssistant.prototype.btnPressed = function(event){
	/* put in event handlers here that should only be in effect when this scene is active. For
	 example, key handlers that are observing the document */
	this.widget.mojo.close();
}
AboutAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
}


AboutAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

AboutAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
	  Mojo.Event.stopListening(this.controller.get('ok_btn'),Mojo.Event.tap,this.save);
}