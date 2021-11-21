import YAML from "yaml";
import Strategy from "./Strategy.js";

class YAMLStrategy extends Strategy {
	public parse(raw: string | Buffer): Object {
		return YAML.parse(raw.toString());
	}

	public stringify(raw: Object): string {
		return YAML.stringify(raw);
	}
}

export default YAMLStrategy;
