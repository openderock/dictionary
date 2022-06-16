// @ts-check
import wordsFrequency from '@derock.ir/words-frequency';
import { existsSync, mkdirSync } from 'fs';
import colors from 'colors';
import { lookup } from './utils/lookup';
import { persist } from './utils/persist';
import { append, generatePath, remove } from './utils/fs';
import { blackList } from './data/black-list';

async function processWord({ word, rank, occurrence }, dir) {
  try {
    const records = await lookup(word);
    const data = {
      word,
      rank,
      occurrence,
      records,
    };
    await persist(dir, word, data);
    console.log(
      `[${colors.green(word)}]: saved. ${(
        (rank * 100) /
        wordsFrequency.length
      ).toFixed(2)}%`
    );
  } catch (error) {
    console.log(`[${colors.green(word)}]: ${error.message}.`);
    append('.dist/missed-words.txt', `\n${word}`);
  }
}

async function main() {
  remove('.dist/missed-words.txt');
  for (const [rank, word, occurrence] of wordsFrequency) {
    const dir = generatePath(word);
    mkdirSync(dir, { recursive: true });
    // @ts-ignore
    if (blackList.includes(word) || existsSync(`${dir}/${word}.json`)) {
      continue;
    }
    await processWord({ rank, word, occurrence }, dir);
  }
}

console.time('FIN');
main()
  .catch(console.error)
  .finally(() => console.timeEnd('FIN'));
