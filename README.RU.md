# Simple Config(simcfg)
Простой модуль для управления файлами конфигурации

[[en](README.md)|**ru**]

## Установка

```
npm i --save simcfg
```

Вы можете установить модуль [yaml](https://www.npmjs.com/package/yaml), если хотите использовать файлы формата [YAML](https://en.wikipedia.org/wiki/YAML).
```
npm i --save yaml
```

## Использование

### Новый конфиг
```ts
const config = new Config();//Empty config
const config = new Config({
	a:1
});// Config with a = 1
```

### Чтение файла.
```ts
const config:Config = await Config.parseFromFile("test.json"); // Promise
const config:Config = Config.parseFromFileSync("test.json");

config.parseFromFile("test.json"); // Promise
config.parseFromFileSync("test.json"); 
```

**!!!ВАЖНО!!!**
Следующая запись в конфиге бросит ошибку при чтении файла, из-за попытки перезаписи значения *a*.
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

### Получение значений
 Если значение не найдено и стандартное значение не указано. метод бросит ошибку.
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

### Изменение значений
 Если конфиг иммутабелен, метод бросит ошибку.
```ts
const config = Config.parseFromFileSync("...");
config.set("a", 10); //Success

const config = Config.parseFromFileSync("...", true);
config.set("a", 10); //throw Error
```

### Запись в файл
Если файл не указан, то конфиг запишется в файл, из которого был прочитан.
```ts
const config = Config.parseFromFileSync("test.json");
config.set("a", 1);

config.writeFile("new-test.json");// Конфиг записан в новый файл "new-test.json"
config.writeFile();// Конфиг записан в старый файл "test.json"
```

Так же файл можно записать и в другом формате
```js
const config = Config.parseFromFileSync("test.json");
config.writeFile("new-test.yaml");// Конфиг записан в YAML-формате
```
