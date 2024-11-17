import CombatService from "../services/CombatService.mjs";
import TargetService from "../services/TargetService.mjs";

const services = new Map();

Hooks.once("init",() => {
    console.log("INIT: Drazev's Gamemaster Toolbox");
});

Hooks.once("ready",()=> {
    services.set("CombatService",new CombatService());
    services.set("TargetService",new TargetService());
});
