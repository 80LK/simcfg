import Strategy from "./strategy/Strategy.js";
import JSONStrategy from './strategy/JSONStrategy.js';
import Config from "./Config.js";

Strategy.registerForFiles("json", JSONStrategy);

try {
	require.resolve("yaml");
	Strategy.registerForFiles(["yaml", "yml"], require("./strategy/YAMLStrategy.js").default)
} catch (e) {
	Strategy.refisterErrorForFiles(["yaml", "yml"], "Module YAML not installed.");
}

export default Config;
export { Strategy }
