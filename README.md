# Derock Dictionary

An English dictionary with words frequency info

## Sources

1. Free Dictionary API: [https://dictionaryapi.dev/](https://dictionaryapi.dev/)
2. Wikitionary: [https://www.npmjs.com/package/wiktionary-node](https://www.npmjs.com/package/wiktionary-node)
3. Derock words frequency list: [https://github.com/openderock/words-frequency](https://github.com/openderock/words-frequency)

## Usage

### words list

```bash
npm i "@derock.ir/dictionary"
```

```javascript
const dictionary = require('@derock.ir/dictionary');

console.log(dictionary[0]);
// [1, "the", 5.6271872]
```
