import {MODULE_ID} from "../constants.mjs"
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
        Hooks.on("controlToken",this.onControlToken.bind(this));
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
        
}