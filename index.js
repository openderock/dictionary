import wordsFrequency from '@derock.ir/words-frequency';
import wiktionary from 'wiktionary-node';
import fetch from 'node-fetch';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import colors from 'colors';
import exec from 'await-exec';

async function lookupWikitionary(word) {
  const res = await wiktionary(word);
  return res.definitions.map((item) => ({
    word,
    phonetics: [],
    meanings: [
      {
        partOfSpeech: item.speech.toLowerCase(),
        definitions: item.lines.map(({ define, examples }) => ({
          definition: define,
          synonyms: [],
          antonyms: [],
          example: examples[0] ?? '',
        })),
        synonyms: [],
        antonyms: [],
      },
    ],
    license: {
      name: 'CC BY-SA 3.0',
      url: 'https://creativecommons.org/licenses/by-sa/3.0',
    },
    sourceUrls: ['https://en.wiktionary.org/wiki/oak'],
  }));
}

async function lookup(word) {
  try {
    return await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    )
      .then((res) => {
        if (res.ok) return res;
        else throw new Error(res.statusText);
      })
      .then((res) => res.json());
  } catch (error) {
    const wikitionaryEntry = await lookupWikitionary(word);
    if (wikitionaryEntry.length == 0) {
      throw new Error('Not Found');
    }
    return wikitionaryEntry;
  }
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
  try {
    unlinkSync(resolve('missed-words.txt'));
  } catch (error) {}
  for (const [rank, word, occurrence] of wordsFrequency) {
    if (word == 'con') {
      continue;
    }
    const dir = generateDirectory(word);
    mkdirSync(dir, { recursive: true });
    if (existsSync(`${dir}/${word}.json`)) {
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
      console.log(
        `[${colors.green(word)}]: saved. ${(
          (rank * 100) /
          wordsFrequency.length
        ).toFixed(2)}%`
      );
    } catch (error) {
      console.log(`[${colors.green(word)}]: ${error.message}.`);
      writeFileSync(resolve('missed-words.txt'), `\n${word}`, {
        encoding: 'utf-8',
        flag: 'a+',
      });
    }
  }
}

console.time('FIN');
main()
  .catch(console.error)
  .finally(() => console.timeEnd('FIN'));
