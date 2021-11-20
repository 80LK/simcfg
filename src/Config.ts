import { readFileSync, promises } from 'fs';
const { readFile } = promises;

import Strategy from './strategy/Strategy.js';

export default class Config {
	private constructor(private config: NodeJS.Dict<any> = {}, private immutable: Boolean = false) {
		for (const key in config) {
			const value = config[key];

			if (typeof value == "object" && !Array.isArray(value) && !(value instanceof Config)) {
				config[key] = new Config(value, immutable);
			}
		}
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

	public static async parseFromFile(file: string, immutable: Boolean = false): Promise<Config> {
		const strategy = (strategy => new strategy())(Strategy.getStrategy(file));

		return new Config(strategy.parse(await readFile(file)), immutable);
	}

	public static parseFromFileSync(file: string, immutable: Boolean = false): Config {
		const strategy = (strategy => new strategy())(Strategy.getStrategy(file));

		return new Config(strategy.parse(readFileSync(file)), immutable);
	}
}
