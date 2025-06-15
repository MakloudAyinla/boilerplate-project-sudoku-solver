const { puzzlesAndSolutions } = require("./controllers/puzzle-strings");
const SudokuSolver = require("./controllers/sudoku-solver");

const solver = new SudokuSolver();
const puzzle = puzzlesAndSolutions[0][0]; // premier puzzle

const tripleConflicts = [];

function getCoordinate(row, col) {
  return String.fromCharCode(65 + row) + (col + 1);
}

for (let i = 0; i < 81; i++) {
  if (puzzle[i] !== ".") continue; // Ne traiter que les cellules vides

  const row = Math.floor(i / 9);
  const col = i % 9;
  const coord = getCoordinate(row, col);

  for (let value = 1; value <= 9; value++) {
    const valStr = value.toString();

    // 🛡️ Vérifie si la valeur est déjà présente à cet index (au cas où tu désactives la ligne 5)
    if (puzzle[i] === valStr) continue;

    const rowValid = solver.checkRowPlacement(
      puzzle,
      coord[0],
      coord[1],
      valStr
    );
    const colValid = solver.checkColPlacement(
      puzzle,
      coord[0],
      coord[1],
      valStr
    );
    const regValid = solver.checkRegionPlacement(
      puzzle,
      coord[0],
      coord[1],
      valStr
    );

    const conflicts = [];
    if (!rowValid) conflicts.push("row");
    if (!colValid) conflicts.push("column");
    if (!regValid) conflicts.push("region");

    if (conflicts.length === 3) {
      tripleConflicts.push({ coordinate: coord, value: valStr });
    }
  }
}

console.log(
  "✅ Valid triple conflicts (row + column + region) — excluding equal cell values:"
);
console.table(tripleConflicts);
