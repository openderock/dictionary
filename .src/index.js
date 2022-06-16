// @ts-check
import wordsFrequency from '@derock.ir/words-frequency';
import { existsSync, mkdirSync } from 'fs';
import { blackList } from './data/black-list.js';
import { generatePath, remove } from './utils/fs.js';
import { generateLists } from './utils/generate-lists.js';
import { processWord } from './utils/process-word.js';

async function main() {
  remove('.dist/missed-words.txt');
  const list = [];
  for (const [rank, word, occurrence] of wordsFrequency) {
    const dest = generatePath(word);
    mkdirSync(dest, { recursive: true });
    // @ts-ignore
    if (blackList.includes(word)) {
      continue;
    }
    const exists =
      existsSync(`${dest}/${word}.json`) ||
      (await processWord({ rank, word, occurrence }, dest));
    if (exists) {
      list.push([rank, word, occurrence]);
    }
  }
  // @ts-ignore
  generateLists(list);
}

console.time('FIN');
main()
  .catch(console.error)
  .finally(() => console.timeEnd('FIN'));
