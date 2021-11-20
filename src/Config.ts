import { readFileSync, promises, writeFileSync } from 'fs';
const { readFile, writeFile } = promises;

import Strategy from './strategy/Strategy.js';

export default class Config {
	private constructor(private config: NodeJS.Dict<any> = {}, private immutable: Boolean = false, private readonly path?: string) {
		for (const key in config) {
			const value = config[key];

			if (typeof value == "object" && !Array.isArray(value) && !(value instanceof Config)) {
				config[key] = new Config(value, immutable);
			}
		}
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

		if (this.config.hasOwnProperty(key))
			this.config[key] = value;
		else if (key.indexOf(".") != -1) {
			const tree = key.split(".");
			let newKey = tree[0];
			let cfg = this.config[newKey];

			if (cfg === undefined)
				cfg = this.config[newKey] = new Config();

			if (!(cfg instanceof Config))
				throw new ReferenceError("");

			cfg.set(tree.slice(1).join("."), value);
		}

		return this;
	}

	public setImmutable() {
		this.immutable = true;
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

	public static async parseFromFile(path: string, immutable: Boolean = false): Promise<Config> {
		const raw = await readFile(path);
		return this.parse(raw, immutable, path);
	}

	public static parseFromFileSync(path: string, immutable: Boolean = false): Config {
		const raw = readFileSync(path);
		return this.parse(raw, immutable, path);
	}
	private static parse(raw: string | Buffer, immutable: Boolean, path?: string) {
		const strategy = (strategy => new strategy())(Strategy.getStrategy(path));
		return new Config(strategy.parse(raw), immutable, path);
	}
}
