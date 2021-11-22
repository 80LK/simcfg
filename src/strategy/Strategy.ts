import { basename, extname } from "path";

interface Info {
	files: RegExp;
	strategy: StrategyConstructor;
}
interface InfoError {
	files: RegExp;
	message: string;
}
interface StrategyConstructor {
	new(): Strategy
}

type Files = string | string[] | RegExp;

abstract class Strategy {
	private static strategies: Info[] = [];
	private static errors: InfoError[] = [];

	public static registerForFiles(files: Files, strategy: StrategyConstructor) {
		if (Array.isArray(files)) {
			files = files.join("|");
		}
		if (typeof files === "string") {
			files = new RegExp(`\.(${files})$`);
		}

		this.strategies.push({ files, strategy });
	}

	public static refisterErrorForFiles(files: Files, message: string) {
		if (Array.isArray(files)) {
			files = files.join("|");
		}
		if (typeof files === "string") {
			files = new RegExp(`\.(${files})$`);
		}

		this.errors.push({ files, message });
	}

	public static getStrategy(file: string): StrategyConstructor {
		const fileName = basename(file);
		const err = this.errors.find(e => e.files.test(fileName));
		if (err)
			throw new ReferenceError(err.message);

		const info = this.strategies.find(e => e.files.test(fileName));
		if (!info)
			throw new RangeError(`There is no strategy for the file ${extname(fileName)}`);

		return info.strategy;
	}

	public abstract parse(raw: string | Buffer): Object;
	public abstract stringify(raw: Object): string
}

export default Strategy;
export { StrategyConstructor }
