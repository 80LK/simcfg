import YAML from "yaml";
import JSONStrategy from "./JSONStrategy.js";

class YAMLStrategy extends JSONStrategy {
	public parse(raw: string | Buffer): Object {
		let obj = YAML.parse(raw.toString());

		if (typeof obj == "object" && !Array.isArray(obj))
			obj = this.parseObj(obj)

		return obj;
	}
}

export default YAMLStrategy;
