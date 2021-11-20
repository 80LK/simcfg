import Config from "./index.js";

let cfg = Config.parseFromFileSync("test.json");

console.log("JSON");
console.log("get a:", cfg.get("a"));
console.log("get b.a:", cfg.get("b.a"));
console.log("get c:", cfg.get("c"));
console.log("get c.a:", cfg.get("c.a"));
console.log("get c, get b:", cfg.get<Config>("c").get("b"));
console.log("get c.c.a:", cfg.get("c.c.a"));
console.log("get c.d.a:", cfg.get("c.d.a"));
console.log("get c.d.c:", cfg.get("c.d.c", "defaultValue"));
console.groupEnd();

cfg.set("c.d.c", 123);
console.log("set c.d.c, get:", cfg.get("c.d.c", "defaultValue"));
cfg.writeFileSync("test.w.json");

cfg = Config.parseFromFileSync("test.yml", true);
console.log("YAML");
console.log("get a:", cfg.get("a"));
console.log("get b.a:", cfg.get("b.a"));
console.log("get c:", cfg.get("c"));
console.log("get c.a:", cfg.get("c.a"));
console.log("get c, get b:", cfg.get<Config>("c").get("b"));
console.log("get c.c.a:", cfg.get("c.c.a"));
console.log("get c.d.a:", cfg.get("c.d.a"));
console.log("get c.d.c:", cfg.get("c.d.c", "defaultValue"));

try {
	console.log("yaml immutable", cfg.getImmutable());
	cfg.set("c.d.c", 123);
} catch (e) {
	console.error("Error:", e);
}
