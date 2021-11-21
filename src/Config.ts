import { readFileSync, promises, writeFileSync } from 'fs';
const { readFile, writeFile } = promises;

import Strategy from './strategy/Strategy.js';

export default class Config {
	public constructor(private config: NodeJS.Dict<any> = {}) {
		for (const key in config) {
			config[key] = this.parseObject(config[key]);
		}
	}

	private path: string;
	private immutable: boolean = false

	private parseObject(value: any) {
		if (typeof value == "object" && !Array.isArray(value) && !(value instanceof Config)) {
			const cfg = new Config(value)
			value = cfg;
		}
		return value;
	}
	private toObject() {
		const config = this.config;
		const res = {}
		for (const key in config) {
			const value = config[key];
			res[key] = (value instanceof Config) ? value.toObject() : value;
		}
		return res;
	}

	public get<T = any>(key: string, defaultValue?: T): T {
		if (this.config.hasOwnProperty(key))
			return this.config[key];

		if (key.indexOf(".") != -1) {
			const tree = key.split(".");
			let newKey = tree[0];
			const value = this.config[newKey];
			if (!(value instanceof Config))
				throw new ReferenceError("");

			return value.get(tree.slice(1).join("."), defaultValue);
		}

		if (defaultValue === undefined)
			throw new Error(`The config does not have a "${key}" field.`);

		return defaultValue;
	}

	public set(key: string, value: any): this {
		if (this.immutable)
			throw new ReferenceError("Config immutable");

		if (typeof value == "object" && !Array.isArray(value) && !(value instanceof Config)) {
			const cfg = new Config(value)
			value = cfg;

		}

		if (key.indexOf(".") != -1) {
			const tree = key.split(".");
			let newKey = tree[0];
			let cfg = this.config[newKey];

			if (cfg === undefined)
				cfg = this.config[newKey] = new Config();

			if (!(cfg instanceof Config))
				throw new ReferenceError("");

			cfg.set(tree.slice(1).join("."), value);
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
		this.config = this.parseObject(strategy.parse(raw));
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
}
