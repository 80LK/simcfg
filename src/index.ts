import Strategy from "./strategy/Strategy.js";
import JSONStrategy from './strategy/JSONStrategy.js';
import Config from "./Config.js";

Strategy.registerForFiles("json", JSONStrategy);
Strategy.registerForFiles(["yaml", "yml"], YAMLStrategy);

export default Config;
export { Strategy }
