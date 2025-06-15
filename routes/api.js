"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    if (!puzzle || !coordinate || !value) {
      return res.json({ error: "Required field(s) missing" });
    }

    const match = coordinate.match(/^([A-I])([1-9])$/i);
    if (!match) {
      return res.json({ error: "Invalid coordinate" });
    }

    if (!/^[1-9]$/.test(value)) {
      return res.json({ error: "Invalid value" });
    }

    const validation = solver.validate(puzzle);
    if (validation !== true) {
      return res.json(validation); // { error: ... }
    }

    const [row, col] = [match[1].toUpperCase(), match[2]];
    const rowIndex = row.charCodeAt(0) - 65;
    const colIndex = parseInt(col) - 1;
    const index = rowIndex * 9 + colIndex;

    // ✅ Vérification ajoutée ici
    if (puzzle[index] === value) {
      return res.json({ valid: true });
    }

    const conflicts = [];
    if (!solver.checkRowPlacement(puzzle, row, col, value))
      conflicts.push("row");
    if (!solver.checkColPlacement(puzzle, row, col, value))
      conflicts.push("column");
    if (!solver.checkRegionPlacement(puzzle, row, col, value))
      conflicts.push("region");

    if (conflicts.length === 0) {
      return res.json({ valid: true });
    } else {
      return res.json({ valid: false, conflict: conflicts });
    }
  });
  
  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;

    const result = solver.solve(puzzle);

    if (typeof result === "string") {
      return res.json({ solution: result });
    } else {
      return res.json(result); // { error: ... }
    }
  });
};
