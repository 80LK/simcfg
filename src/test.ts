import Config from "./index.js";

let cfg = Config.parseFromFileSync("test.json");

console.log("JSON");
console.log("get a:", cfg.get("a"));
console.log("get a.b:", cfg.get("a.b"));
console.log("(get a).b:", cfg.get<{ b: number }>("a").b);
console.log("get b.a:", cfg.get("b.a"));
console.log("get c:", cfg.get("c"));
console.log("get c.a:", cfg.get("c.a"));
console.log("(get c).b:", cfg.get<{ b: number }>("c").b);
console.log("get c.c.a:", cfg.get("c.c.a"));
console.log("get c.d.a:", cfg.get("c.d.a"));
console.log("get c.d.c:", cfg.get("c.d.c", "defaulValue"));
try {
	console.log("get d.d.c:", cfg.get("d.d.c"));
} catch (e) {
	console.error("Error get d.d.c:", e.message);
}

cfg.set("c.d.c", 123);
console.log("set c.d.c, get:", cfg.get("c.d.c", "defaultValue"));
cfg.writeFileSync("test.w.json");

cfg = Config.parseFromFileSync("test.yml", true);
console.log("YAML");
console.log("get a:", cfg.get("a"));
console.log("get a.b:", cfg.get("a.b"));
console.log("(get a).b:", cfg.get<{ b: number }>("a").b);
console.log("get b.a:", cfg.get("b.a"));
console.log("get c:", cfg.get("c"));
console.log("get c.a:", cfg.get("c.a"));
console.log("(get c).b:", cfg.get<{ b: number }>("c").b);
console.log("get c.c.a:", cfg.get("c.c.a"));
console.log("get c.d.a:", cfg.get("c.d.a"));
console.log("get c.d.c:", cfg.get("c.d.c", "defaultValue"));
try {
	console.log("get d.d.c:", cfg.get("d.d.c"));
} catch (e) {
	console.error("Error get d.d.c:", e.message);
}


try {
	console.log("yaml immutable", cfg.getImmutable());
	cfg.set("c.d.c", 123);
} catch (e) {
	console.error("Error set c.d.c:", e.message);
}
