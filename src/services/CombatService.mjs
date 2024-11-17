import {MODULE_ID} from "../constants.mjs"
/**
 * Combat Service 
 * 
 * Tracks a combat 
 */

/**
 * @typedef {Object} UpdateData
 * @property {number} round The round number for the current combat
 * @property {number} turn The turn number for the current turn
 */

/**
 * @typedef {Object} UpdateOptions
 * @property {number} advanceTime The amount of time in seconds that time is being advanced
 * @property {number} direction A signed integer for whether the turn order is advancing or rewinding
 */

/**
 * @typedef {Object} CombatHistoryData
 * @property {number} round The round number for a combat record
 * @property {number} turn The turn number for a combat record
 * @property {string} The token id that acted in this combat record
 * @property {string} The combat id that acted in this combat record
 */



export default class CombatService {

    constructor() {
        if(CombatService._instance) {
            return CombatService._instance;
        }

        CombatService._instance = this;
        Hooks.on("combatStart",this.onCombatStart.bind(this));
        Hooks.on("combatTurnChange",this.onCombatTurnChange.bind(this));
        Hooks.on("combatTurn",this.onCombatTurn.bind(this));
        Hooks.on("combatRound",this.onCombatRound.bind(this));
    }

    /**
     * Handles a hook event that fires when a Combat encounter is started. This event fires on the initiating client before any database update occurs. combatStart
     * 
     * @param {Combat} combat An object which contains Combat properties that will be updated. Can be mutated.
     * @param {UpdateData} updateData The initial data for combat round and turn
     */
    onCombatStart(combat, updateData) {
        console.log("Event: onCombatStart")
        console.log(combat)
        console.log(updateData)
    }

    /**
     * A hook event that fires when the turn of the Combat encounter changes. This event fires on the initiating client before any database update occurs. combatTurn
     * 
     *  Use this to modify data prior to update
     * 
     * @param {Combat} combat The Combat encounter which is advancing or rewinding its turn
     * @param {UpdateData} updateData An object which contains Combat properties that will be updated. Can be mutated.
     * @param {UpdateOptions} updateOptions An object which contains options provided to the update method. Can be mutated.
     */
    onCombatTurn(combat,updateData,updateOptions) {
        console.log("Event: onCombatTurn")
        console.log(combat)
        console.log(updateData)
        console.log(updateOptions)

    }

    /**
     * Handles a hook event that fires when the round of the Combat encounter changes. This event fires on the initiating client before any database update occurs. combatRound
     * 
     * Use this to modify data prior to update
     * 
     * @param {Combat} combat The Combat encounter which is advancing or rewinding its turn
     * @param {UpdateData} updateData An object which contains Combat properties that will be updated. Can be mutated.
     * @param {UpdateOptions} updateOptions An object which contains options provided to the update method. Can be mutated.
     */
    onCombatRound(combat, updateData, updateOptions) {
        console.log("Event: onCombatRound")
        console.log(combat)
        console.log(updateData)
        console.log(updateOptions)
    }
    
    /**
     * Handles a hook event which fires when the turn order of a Combat encounter is progressed. This event fires on all clients after the database update has occurred for the Combat.
     * 
     * This should be used to react to turn changes.
     * 
     * @param {Combat} combat The Combat encounter for which the turn order has changed
     * @param {CombatHistoryData} prior The prior turn state
     * @param {CombatHistoryData} current The new turn state
     */
    onCombatTurnChange(combat, prior, current) {
        console.log("Event: onCombatTurnChange")
        console.log(combat)
        console.log(prior)
        console.log(current)

    }

}

