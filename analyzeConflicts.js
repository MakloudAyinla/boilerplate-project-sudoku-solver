const { puzzlesAndSolutions } = require("./controllers/puzzle-strings");
const SudokuSolver = require("./controllers/sudoku-solver");

const solver = new SudokuSolver();
const puzzle = puzzlesAndSolutions[0][0]; // Premier puzzle de référence

// Résultats classés
const results = {
  oneConflict: {
    row: [],
    column: [],
    region: [],
  },
  twoConflicts: {
    "row,column": [],
    "row,region": [],
    "column,region": [],
  },
  threeConflicts: [],
};

function getCoordinate(row, col) {
  return String.fromCharCode(65 + row) + (col + 1);
}

for (let i = 0; i < 81; i++) {
  const current = puzzle[i];
  if (current !== ".") continue; // On ne teste que les cases vides

  const row = Math.floor(i / 9);
  const col = i % 9;
  const coord = getCoordinate(row, col);

  for (let v = 1; v <= 9; v++) {
    const value = v.toString();

    // Sécurité : la cellule contient déjà cette valeur
    if (value === current) continue;

    const rowValid = solver.checkRowPlacement(
      puzzle,
      coord[0],
      coord[1],
      value
    );
    const colValid = solver.checkColPlacement(
      puzzle,
      coord[0],
      coord[1],
      value
    );
    const regValid = solver.checkRegionPlacement(
      puzzle,
      coord[0],
      coord[1],
      value
    );

    const conflicts = [];
    if (!rowValid) conflicts.push("row");
    if (!colValid) conflicts.push("column");
    if (!regValid) conflicts.push("region");

    const conflictKey = conflicts.join(",");

    if (conflicts.length === 1) {
      results.oneConflict[conflictKey].push({ coordinate: coord, value });
    } else if (conflicts.length === 2) {
      results.twoConflicts[conflictKey].push({ coordinate: coord, value });
    } else if (conflicts.length === 3) {
      results.threeConflicts.push({ coordinate: coord, value });
    }
  }
}

// Affichage des résultats

console.log("=== ✅ ONE CONFLICT ONLY ===");
Object.entries(results.oneConflict).forEach(([type, data]) => {
  console.log(`\n→ ${type.toUpperCase()} only:`);
  console.table(data);
});

console.log("\n=== ⚠️ TWO CONFLICTS ONLY ===");
Object.entries(results.twoConflicts).forEach(([type, data]) => {
  console.log(`\n→ ${type.replace(",", " + ").toUpperCase()}:`);
  console.table(data);
});

console.log("\n=== ❌ THREE CONFLICTS ===");
console.table(results.threeConflicts);
