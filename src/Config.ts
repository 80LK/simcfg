import { readFileSync, promises, writeFileSync } from 'fs';
const { readFile, writeFile } = promises;

import Strategy from './strategy/Strategy.js';

export default class Config {
	public constructor(private config: NodeJS.Dict<any> = {}) { }

	private path: string;
	private immutable: boolean = false

	public get<T = any>(key: string, defaultValue?: T): T {
		if (this.config.hasOwnProperty(key))
			return this.config[key];

		if (key.indexOf(".") != -1) {
			const tree = key.split(".");
			const l = tree.length;
			let newKey = tree[0];
			let i = 1;
			for (; !this.config.hasOwnProperty(newKey) && i < l; i++)
				newKey += "." + tree[i];

			if (i != l) {
				const value = this.config[newKey];
				if (typeof value == "object" && !Array.isArray(value))
					return new Config(value).get(tree.slice(i).join("."), defaultValue);

			}
		}

		if (defaultValue === undefined)
			throw new Error(`The config does not have a "${key}" field.`);

		return defaultValue;
	}

	public set(key: string, value: any): this {
		if (this.immutable)
			throw new ReferenceError("Config immutable");

		if (this.config.hasOwnProperty(key)) {
			this.config[key] = value;
		} else if (key.indexOf(".") != -1) {
			const tree = key.split(".");
			const l = tree.length;
			let newKey = tree[0];
			let i = 1;
			for (; !this.config.hasOwnProperty(newKey) && i < l; i++)
				newKey += "." + tree[i];

			if (i != l) {
				const _value = this.config[newKey];
				if (typeof _value == "object" && !Array.isArray(_value)) {
					const cfg = new Config(_value).set(tree.slice(i).join("."), value);
					this.config[newKey] = cfg.toObject();
				} else {
					this.config[newKey] = value;
				}
			}
		} else {
			this.config[key] = value;
		}

		return this;
	}

	public setImmutable() {
		this.immutable = true;

		for (const key in this.config) {
			const value = this.config[key];
			if (value instanceof Config)
				value.setImmutable();
		}

		return this;
	}
	public getImmutable() {
		return this.immutable;
	}

	public writeFile(path?: string) {
		if (!path) path = this.path;
		const source = this.stringify(path);
		return writeFile(path, source);
	}
	public writeFileSync(path?: string) {
		if (!path) path = this.path;
		const source = this.stringify(path);
		writeFileSync(path, source);
	}
	private stringify(path: string) {
		const strategy = (strategy => new strategy())(Strategy.getStrategy(path));
		return strategy.stringify(this.toObject())
	}

	public async parseFromFile(path?: string) {
		if (!path) path = this.path;
		const raw = await readFile(path);
		this.parse(raw, path);
	}
	public async parseFromFileSync(path?: string) {
		if (!path) path = this.path;
		const raw = readFileSync(path);
		this.parse(raw, path);
	}
	private parse(raw: string | Buffer, path: string) {
		if (this.immutable)
			throw new ReferenceError("Config immutable");

		const strategy = (strategy => new strategy())(Strategy.getStrategy(path));
		this.config = strategy.parse(raw);
	}

	public static async parseFromFile(path: string, immutable: boolean = false): Promise<Config> {
		const raw = await readFile(path);
		return this.parse(raw, immutable, path);
	}

	public static parseFromFileSync(path: string, immutable: boolean = false): Config {
		const raw = readFileSync(path);
		return this.parse(raw, immutable, path);
	}
	private static parse(raw: string | Buffer, immutable: boolean, path: string) {
		const strategy = (strategy => new strategy())(Strategy.getStrategy(path));
		const cfg = new Config(strategy.parse(raw))
		cfg.immutable = immutable;
		cfg.path = path;
		return cfg;
	}

	private toObject() {
		return Object.assign({}, this.config);
	}
}
