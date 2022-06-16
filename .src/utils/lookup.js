
import wiktionary from 'wiktionary-node';
import fetch from 'node-fetch';

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

export async function lookup(word) {
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