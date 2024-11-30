import {MODULE_ID} from "../constants.mjs"
const CLASS_ID = 'TargetService'
const TOKEN_TARGET_FLAG = "targets"


  
/**
 * Service that sets active targets based on the currently selected scene token document.
 * 
 * This is an aid that allows players and GM's to control multiple tokens with ease.
 * 
 */
export default class TargetService {
    
    constructor() {
        if(TargetService._instance) {
            return TargetService._instance;
        }
        
        TargetService._instance = this;
        
        this.initSettings();
    
        //When we first load we check if service is enabled by settings and then activate it
        if(this.isEnabled) {
            this.activateService();
        }
    }

    
    activateService() {
        Hooks.on("controlToken",this.onControlToken.bind(this));
        console.debug(MODULE_ID,": TargetService activated");
        this.isEnabled = true;
    }

    deactivateService() {
        Hooks.off("controlToken",this.onControlToken);
        this.isEnabled = false;
        console.debug(MODULE_ID,": TargetService deactivated");
    }

    clearTokenTargets(token) {
        return token.document.unsetFlag(MODULE_ID,TOKEN_TARGET_FLAG);
    }

    /**
     * Handles a hook event that fires when a PlaceableObject of type Token is selected or deselected. 
     * @param {PlaceableObject} token 
     * @param {boolean} isControlled 
     */
    onControlToken(token,isControlled) {
        if(!token.isOwner) {
            return;
        }

        if(isControlled) {
            this.restoreTokenTargets(token);
        }
        else {
            this.saveTokenTargets(token);
        }
    }

    async restoreTokenTargets(token) {
        const targets = await token.document.getFlag(MODULE_ID,TOKEN_TARGET_FLAG);
        if(Array.isArray(targets)) {
            game.user.updateTokenTargets(targets);
        }
        else if (targets) {
            //Targets was not empty and isn't an array. Unset flag
            console.warn("Token target data was corrupt. Clearing flag.");
            await this.clearTokenTargets(token);
        }
    }

    async saveTokenTargets(token) {
        const targets =  new Array();
        for(const tokenId of game.user.targets.ids) {
            targets.push(tokenId);
        }
        game.user.updateTokenTargets(null);
        await token.document.setFlag(MODULE_ID,TOKEN_TARGET_FLAG,targets);
    }
    
    /**
     * Defines settings in the game client. This definition includes the scope of the setting
     * and any change handlers, validation, defaults, choices, etc.
     * 
     * This does NOT set the actual value in the database. Before getting or setting the value
     * of any setting it must first be registered.
     */
    initSettings() {
        const I18N_PREFIX = `${MODULE_ID}.${CLASS_ID}.settings`
        const settings = {
            isEnabled: { 
                scope : "client",
                config: true,
                requiresReload: false,
                type: new foundry.data.fields.BooleanField(),
                default: true,
                onChange: this.onIsEnabledSettingChange.bind(this)
            }
        }
        
        for (const [key, data] of Object.entries(settings)) {
    
            const SETTING_KEY = `${CLASS_ID}-${key}`
            data.hint = `${I18N_PREFIX}.${key}.hint`;
            data.name = `${I18N_PREFIX}.${key}.name`;
            game.settings.register(MODULE_ID,SETTING_KEY, data);

            // After registration, get the current value or default value if unset and add it as a property to the class
            this[`${key}`] = game.settings.get(MODULE_ID,SETTING_KEY);
            console.debug(`${CLASS_ID}.${key}=${this[`${key}`]}`);
        }
    }

    onIsEnabledSettingChange(value) {
        console.debug(CLASS_ID,"#onIsEnabledSettingChange(value=\"",value,"\")");
        if(value === this.isEnabled)  {
            return;
        }
        else if(!value instanceof Boolean)  {
            throw new TypeError('Value must be of type Boolean');
        }
        
        if(value) {
            this.activateService();
        }
        else {
            this.deactivateService();
        }
    }
}
