const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api
//See {@link https://foundryvtt.wiki/en/development/api/applicationv2}
/**
 * [ApplicationV2 API]{@link https://foundryvtt.com/api/v12/classes/foundry.applications.api.ApplicationV2.html}
 */

export default class CombatCardSheet extends HandlebarsApplicationMixin(ApplicationV2) {
    
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
        this.actor = null;
        this.data = {
            "title" : "My title",
            "text" : "my text is here!",
            "inputBoxText" : ""
        }

    }

    async getData(options) {
        const context = await this.actor.sheet.getData(options);
        const { attributes, resources } = this.actor.system;
        context.encumbrance = attributes.encumbrance;
    
        // Ability Scores
        Object.entries(context.abilities).forEach(([k, ability]) => {
          ability.key = k;
          ability.abbr = CONFIG.DND5E.abilities[k]?.abbreviation ?? "";
          ability.baseValue = context.source.abilities[k]?.value ?? 0;
          ability.icon = CONFIG.DND5E.abilities[k]?.icon;
        });
    
        // Show Death Saves
        context.showDeathSaves = !foundry.utils.isEmpty(this.actor.classes)
          || this.actor.getFlag("dnd5e", "showDeathSaves");
    
        // Speed
        context.speed = Object.entries(CONFIG.DND5E.movementTypes).reduce((obj, [k, label]) => {
          const value = attributes.movement[k];
          if ( value ) {
            obj[k] = { label, value };
            if ( (k === "fly") && attributes.movement.hover ) obj.fly.icons = [{
              icon: "fas fa-cloud", label: game.i18n.localize("DND5E.MovementHover")
            }];
          }
          return obj;
        }, {});
    
        // Skills & Tools
        const skillSetting = new Set(game.settings.get("dnd5e", "defaultSkills"));
        context.skills = Object.fromEntries(Object.entries(context.skills).filter(([k, v]) => {
          return v.value || skillSetting.has(k) || v.bonuses.check || v.bonuses.passive;
        }));
    
        // Senses
        if ( this.actor.system.skills.prc ) {
          context.senses.passivePerception = {
            label: game.i18n.localize("DND5E.PassivePerception"), value: this.actor.system.skills.prc.passive
          };
        }
    
        // Legendary Actions & Resistances
        const plurals = new Intl.PluralRules(game.i18n.lang, { type: "ordinal" });
        ["legact", "legres"].forEach(res => {
          const { max, value } = resources[res];
          context[res] = Array.fromRange(max, 1).map(n => {
            const i18n = res === "legact" ? "LegAct" : "LegRes";
            const filled = value >= n;
            const classes = ["pip"];
            if ( filled ) classes.push("filled");
            return {
              n, filled,
              tooltip: `DND5E.${i18n}`,
              label: game.i18n.format(`DND5E.${i18n}N.${plurals.select(n)}`, { n }),
              classes: classes.join(" ")
            };
          });
        });
        context.hasLegendaries = resources.legact.max || resources.legres.max || resources.lair.initiative;
    
        // Spellcasting
        this._prepareSpellcasting(context);
    
        // Biographies
        const enrichmentOptions = {
          secrets: this.actor.isOwner, relativeTo: this.actor, rollData: context.rollData
        };
    
        context.enriched = {
          public: await TextEditor.enrichHTML(this.actor.system.details.biography.public, enrichmentOptions),
          value: context.biographyHTML
        };
    
        if ( this.editingDescriptionTarget ) {
          context.editingDescriptionTarget = this.editingDescriptionTarget;
          context.enriched.editing = this.editingDescriptionTarget.endsWith("public")
            ? context.enriched.public
            : context.enriched.value;
        }
    
        return context;
    }

    async _render(force=false, options={}) {
        await super._render(force, options);
        const [warnings] = this.element.find(".pseudo-header-button.preparation-warnings");
        warnings?.toggleAttribute("hidden", !this.actor._preparationWarnings?.length);
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