import Config from "./index.js";

let cfg = Config.parseFromFileSync("test.json");

console.group("JSON");
console.log("get a:", cfg.get("a"));
console.log("get b.a:", cfg.get("b.a"));
console.log("get c:", cfg.get("c"));
console.log("get c.a:", cfg.get("c.a"));
console.log("get c, get b:", cfg.get<Config>("c").get("b"));
console.log("get c.c.a:", cfg.get("c.c.a"));
console.log("get c.d.a:", cfg.get("c.d.a"));
console.log("get c.d.c:", cfg.get("c.d.c", "defaultValue"));
console.groupEnd();

cfg = Config.parseFromFileSync("test.yml");
console.group("YAML");
console.log("get a:", cfg.get("a"));
console.log("get b.a:", cfg.get("b.a"));
console.log("get c:", cfg.get("c"));
console.log("get c.a:", cfg.get("c.a"));
console.log("get c, get b:", cfg.get<Config>("c").get("b"));
console.log("get c.c.a:", cfg.get("c.c.a"));
console.log("get c.d.a:", cfg.get("c.d.a"));
console.log("get c.d.c:", cfg.get("c.d.c", "defaultValue"));
console.groupEnd();
