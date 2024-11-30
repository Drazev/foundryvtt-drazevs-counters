import { MODULE_ID } from "../../constants.mjs";

/**
 * The logging service manages loggers for modules. Loggers have implemented
 * some security measures that govern how logs are collected, viewed, and shared.
 * 
 * Internally the main view for a logger is via journal documents.
 * 
 */
export default class LoggerService {
    static get HOOK_PREFIX() {
        return `${MODULE_ID}-${SERVICE_NAME}`;
    }

    static get HOOKS() {
        return {
            'Ready' : `Signals ${LoggerService.name} is ready.` 
        }
    }

    constructor() {
        if(LoggerService._instance) {
            return LoggerService._instance;
        }
        LoggerService._instance = this;
    }

    /**
     * @private
     * 
     */
    _init() {
        Hooks.callAll(`${LoggerService.HOOK_PREFIX}-Ready`);
    }
}