const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api
//See {@link https://foundryvtt.wiki/en/development/api/applicationv2}
/**
 * [ApplicationV2 API]{@link https://foundryvtt.com/api/v12/classes/foundry.applications.api.ApplicationV2.html}
 */

export default class TestApp extends HandlebarsApplicationMixin(ApplicationV2) {
    
    //Instance of Foundryvtt Type [ApplicationConfiguration]{@link https://foundryvtt.com/api/v12/interfaces/foundry.applications.types.ApplicationConfiguration.html}
    static DEFAULT_OPTIONS = {
        tag: "form", //The base tag of this element. It is default <div>. When switched to <form> Appv2 will setup listeners for the submit behavior. 
        form: { //Define  form behavior if tag=form, For this to work your handlebars file needs to contain form contents in a div, not a form or you will end up with a nested form. The listener will only be setup on the form tag created by Appv2
            handler: TestApp.handleSubmit,
            closeOnSubmit : true
        },
        actions : { //This field sends a map of keys : functions to be bound by listeners when the form is generated.
            testAction : TestApp.testAction,
            submit : TestApp.handleSubmit
        }
    }

    static PARTS = {
        form : {
            template : `${MODULE_TEMPLATE_PATH}/TestApp.hbs`
        }
    }

    /**
     * Here we set some data for our application. 
     * While you can do them individually, if you want to pass it for rendering it will be easier
     * to do it in a single object so you can use the elipsis to merge the data with the existing context during rendering
     */
    constructor() {
        super();
        this.data = {
            "title" : "My title",
            "text" : "my text is here!",
            "inputBoxText" : ""
        }

    }



    /**
     * An event handler function. It's bound in DEFAULT_OPTIONS under the 'actions' field.
     * Foundry uses it as a static function but will bind the instance to this function as 'this' when called
     * @param {*} event 
     * @param {*} target 
     */
    static testAction(event,target) {
        console.log("Action Fired 'testAction', event: ",event,", target: ",target);
    }

    updateText(event) {
        console.log("value",event.target.value)
        console.log("Action Fired 'updateText', event: ", event, ", target: ", event.target, ", value: ", event.target.value);
        console.log("class instance",this); //The 'this' value is bound to the specific instance of the class, so this is an oddity.
        this.data.inputBoxText = event.target.value;
        this.render();

    }

    /**
     * This lifecycle step gives us the opportunity to send data to the handlebars template to be rendered.
     * We can expand on the existing context to include our variables.
     * @param {*} partId 
     * @param {*} context 
     * @returns 
     */
    async _prepareContext(partId,context) {
        const newContext = {
            ...context,
            ...this.data
        };
        console.log("Preparing context",partId,newContext);
        console.log("Parts:",TestApp.PARTS);
        return newContext;
;    }

    /**
     * Here we setup listeners on elements that are not for click events. 
     * Click events should use the actions defined above.
     * In this example we need a change listener on a textbox.
     * @param {*} context 
     * @param {*} options 
     */
    async _onRender(context,options) {
        console.log("_onRender: context:",context,", options: ",options,", this: ",this);

        const updateTextBox = this.element.querySelector(".js-testTextSelector");
        updateTextBox?.addEventListener("change",this.updateText.bind(this)); //Do not forget to bind the function call to this application context. Otherewise it will be the clicked element.
        console.log("addedEventListener to",updateTextBox);
    }

    /**
     * This is the form submit handler that we reference with our form optoins.
     * Application V2 will run this when the form is submitted instead of refreshing the entire page which is the default behavior for any other form element not controlled by Appve (the form added by the tag)
     * @param {*} event 
     * @param {*} form 
     * @param {*} formData 
     */
    static async handleSubmit(event,form,formData) {    
        console.log("Form Submit Handler Triggered: event: ",event, ", form: ",form,", formData: ",formData);
        // this._onSubmitForm(this.options.form,event);
    }
}