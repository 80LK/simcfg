# Simple Config(simcfg)
A simple module for managing configuration files

[**en**|[ru](README.RU.md)]

## Install

```
npm i --save simcfg
```

You can install the [yaml](https://www.npmjs.com/package/yaml) module, if you want to use [YAML](https://en.wikipedia.org/wiki/YAML) format files.
```
npm i --save yaml
```

## Usage

### New config
```ts
const config = new Config();//Empty config
const config = new Config({
	a:1
});// Config with a = 1
```

### Reading the file.
```ts
const config:Config = await Config.parseFromFile("test.json"); // Promise
const config:Config = Config.parseFromFileSync("test.json");

config.parseFromFile("test.json"); // Promise
config.parseFromFileSync("test.json"); 
```

**!!!WARNING!!!**
The next entry in the config will throw an error when reading the file, due to an attempt to overwrite the value of *a*.
```json
{
	"a":1,
	"a.b":2
}
```
```yml
a: 1
a.b: 2
```

### Getting values
If no value is found and no standard value is specified. the method will throw an error.
```ts
/*
@config
{
	"a":1,
	"c":{
		"e":false
	}
}
*/
config.get<number>("a"); // return 1
config.get<number>("b", 10); // return 10
config.get<string>("c.d", "defaultValue"); //return "defaultValue"
config.get<boolean>("c.e", false);//return false
config.get<number>("f");// throw Error
```

#### !!!WARNING!!!
With the following config entry:
```json
{
	"a": 1,
	"a.b": 2
}
```
```yml
a: 1
a.b: 2
```
it is impossible to get the *b* field from *a* as from an object.
```ts
config.get("a.b"); //return 2
config.get("a"); //return 1
config.get("a").b // 1.b === undefined
```

### Changing values
If the config is immutable, the method will throw an error.
```ts
const config = Config.parseFromFileSync("...");
config.set("a", 10); //Success

const config = Config.parseFromFileSync("...", true);
config.set("a", 10); //throw Error
```

### Writing to a file
If the file is not specified, the config will be written to the file from which it was read.
```ts
const config = Config.parseFromFileSync("test.json");
config.set("a", 1);

config.writeFile("new-test.json");// The config is written to a new file "new-test.json"
config.WriteFile();// Config is written to the old file "test.json"
```

The file can also be written in another format
```js
const config = Config.parseFromFileSync("test.json");
config.writeFile("new-test.yaml");// The config is written in YAML format
``
