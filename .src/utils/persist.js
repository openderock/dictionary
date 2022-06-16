import exec from 'await-exec';
import { writeFileSync } from 'fs';

export async function persist(dir, word, data) {
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
