// @ts-check
import { writeFileSync } from 'fs';
/**
 *
 * @param {[number,string, number][]} list
 */
export function generateLists(list) {
  // saving as CSV
  const csvRows = list.map((row) => row.join(','));
  csvRows.unshift('Rank,Word,Occurrence percentage');
  writeFileSync('./.dist/words-list.csv', csvRows.join('\n'), {
    encoding: 'utf-8',
  });

  // saving as JS
  const jsArray = list
    .map(([rank, word, percentage]) => `[${rank},"${word}",${percentage}]`)
    .join(',');
  writeFileSync('./.dist/words-list.js', `module.exports=[${jsArray}];`, {
    encoding: 'utf-8',
  });

  // saving as JSON
  writeFileSync('./.dist/words-list.json', JSON.stringify(list), {
    encoding: 'utf-8',
  });

  // saving as SQL
  writeFileSync(
    './.dist/words-list.sql',
    `
-- DROP TABLE IF EXISTS "Word";
-- CreateTable
-- CREATE TABLE "Word" (
--   "rank" INTEGER NOT NULL,
--   "word" TEXT NOT NULL,
--   "occurrence" DOUBLE PRECISION NOT NULL,
--   CONSTRAINT "Word_pkey" PRIMARY KEY ("rank")
-- );
INSERT INTO 
  "Word" (rank, word, occurrence)
VALUES ${list
      .map(
        ([rank, word, percentage]) => `
  (${rank},'${word}',${percentage})`
      )
      .join(',')};
`,
    { encoding: 'utf-8' }
  );
}
