import Strategy from "./Strategy.js";

class JSONStrategy extends Strategy {
	public parse(raw: string | Buffer): Object {
		return JSON.parse(raw.toString());
	}

	public stringify(raw: Object): string {
		return JSON.stringify(raw, null, '\t');
	}
}

export default JSONStrategy;
