import Strategy from "./Strategy.js";

class JSONStrategy extends Strategy {
	protected parseObj(obj: Object, path: string[] = []) {

		const res: Object = {};
		for (const key in obj) {
			const value = obj[key];

			if (key.indexOf(".") != -1) {
				const _path = [...path];

				const tree = key.split(".");
				const l = tree.length - 1;
				let _obj = res;
				for (let i = 0; i < l; i++) {
					const subKey = tree[i];
					_path.push(subKey);
					let subObj = _obj[subKey];
					if (!subObj) subObj = _obj[subKey] = {};

					if (typeof subObj != "object" || Array.isArray(subObj))
						throw new ReferenceError(`The path "${_path.join(".")}" already exists`);

					_obj = _obj[subKey];
				}

				_path.push(tree[l]);
				if (typeof value == "object" && !Array.isArray(value))
					_obj[tree[l]] = this.parseObj(value, _path);
				else
					_obj[tree[l]] = value;
			} else {
				const _path = [...path, key];

				if (typeof value == "object" && !Array.isArray(value))
					res[key] = this.parseObj(value, _path);
				else
					res[key] = value;

			}
		}
		return res;
	}

	public parse(raw: string | Buffer): Object {
		let obj = JSON.parse(raw.toString());

		if (typeof obj == "object" && !Array.isArray(obj))
			obj = this.parseObj(obj)

		return obj;
	}

	public stringify(raw: Object): string {
		return JSON.stringify(raw, null, '\t');
	}
}

export default JSONStrategy;
