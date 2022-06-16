
import colors from 'colors';
import { lookup } from './lookup.js';
import { persist } from './persist.js';
import { append } from './fs.js';

export async function processWord({ word, rank, occurrence }, dest) {
  try {
    const records = await lookup(word);
    const data = {
      word,
      rank,
      occurrence,
      records,
    };
    await persist(dest, word, data);
    console.log(
      `[${colors.green(word)}]: saved. ${(
        (rank * 100) /
        wordsFrequency.length
      ).toFixed(2)}%`
    );
    return true;
  } catch (error) {
    console.log(`[${colors.green(word)}]: ${error.message}.`);
    append('.dist/missed-words.txt', `\n${word}`);
    return false;
  }
}