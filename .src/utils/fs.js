import { resolve } from 'path';

export function generatePath(word) {
  switch (word.length) {
    case 1:
      return resolve(word);
    case 2:
      return resolve(`${word[0]}/${word[1]}`);
    default:
      return resolve(`${word[0]}/${word[1]}/${word[2]}`);
  }
}

export function append(filename, content) {
  writeFileSync(resolve(filename), content, {
    encoding: 'utf-8',
    flag: 'a+',
  });
}

export function remove(filename) {
  try {
    unlinkSync(resolve(filename));
  } catch (error) {}

}