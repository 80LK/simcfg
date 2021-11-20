import { basename, extname } from "path";

interface Info {
	files: RegExp,
	strategy: StrategyConstructor
}

interface StrategyConstructor {
	new(): Strategy
}

abstract class Strategy {
	private static strategies: Info[] = [];

	public static registerForFiles(files: string | string[] | RegExp, strategy: StrategyConstructor) {
		if (Array.isArray(files)) {
			files = files.join("|");
		}
		if (typeof files === "string") {
			files = new RegExp(`\.(${files})$`);
		}

		this.strategies.push({ files, strategy });
	}

	public static getStrategy(file: string): StrategyConstructor {
		const fileName = basename(file);
		const info = this.strategies.find(e => e.files.test(fileName));
		if (!info)
			throw new RangeError(`There is no strategy for the file ${extname(fileName)}`);
		return info.strategy;
	}


	public abstract parse(raw: string | Buffer): Object;
}

export default Strategy;
export { StrategyConstructor }
