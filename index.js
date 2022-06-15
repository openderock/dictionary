import wordsFrequency from '@derock.ir/words-frequency';
import fetch from 'node-fetch';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import colors from 'colors';
import exec from 'await-exec';

function lookup(word) {
  return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((res) => {
      if (res.ok) return res;
      else throw new Error(res.statusText);
    })
    .then((res) => res.json());
}

/**
 *
 * @param {String} word
 */
function generateDirectory(word) {
  switch (word.length) {
    case 1:
      return resolve(word);
    case 2:
      return resolve(`${word[0]}/${word[1]}`);
    default:
      return resolve(`${word[0]}/${word[1]}/${word[2]}`);
  }
}
async function persist(dir, word, data) {
  writeFileSync(`${dir}/${word}.json`, JSON.stringify(data), {
    encoding: 'utf-8',
  });
  if (data.rank % 10 == 0) {
    const { stdout } = await exec(
      `git add --all && git commit -m "${word}" && git push`
    );
    console.log(stdout);
  }
}

async function main() {
  for (const [rank, word, occurrence] of wordsFrequency) {
    const dir = generateDirectory(word);
    mkdirSync(dir, { recursive: true });
    if (existsSync(`${dir}/${word}.json`)) {
      console.log(`[${colors.green(word)}]: exists.`);
      continue;
    }
    try {
      const records = await lookup(word);
      const data = {
        word,
        rank,
        occurrence,
        records,
      };
      await persist(dir, word, data);
      console.log(`[${colors.green(word)}]: saved. ${(rank *100/wordsFrequency.length).toFixed(2)}%`);
    } catch (error) {
      console.log(`[${colors.green(word)}]: ${error.message}.`);
    }
  }
}

console.time('FIN');
main()
  .catch(console.error)
  .finally(() => console.timeEnd('FIN'));
