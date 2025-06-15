class SudokuSolver {
  validate(puzzleString) {
    if (!puzzleString) {
      return { error: "Required field missing" };
    }

    if (puzzleString.length !== 81) {
      return { error: "Expected puzzle to be 81 characters long" };
    }

    if (/[^1-9.]/.test(puzzleString)) {
      return { error: "Invalid characters in puzzle" };
    }

    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowIndex = row.toUpperCase().charCodeAt(0) - 65; // 'A' → 0, ..., 'I' → 8
    const rowStart = rowIndex * 9;
    const rowValues = puzzleString.slice(rowStart, rowStart + 9);

    return !rowValues.includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    const colIndex = parseInt(column) - 1;
    for (let i = 0; i < 9; i++) {
      const index = i * 9 + colIndex;
      if (puzzleString[index] === value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const rowIndex = row.toUpperCase().charCodeAt(0) - 65;
    const colIndex = parseInt(column) - 1;

    const regionRowStart = Math.floor(rowIndex / 3) * 3;
    const regionColStart = Math.floor(colIndex / 3) * 3;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const index = (regionRowStart + r) * 9 + (regionColStart + c);
        if (puzzleString[index] === value) {
          return false;
        }
      }
    }

    return true;
  }

  solve(puzzleString) {
    // 1. Vérifier la validité de la string
    const validation = this.validate(puzzleString);
    if (validation !== true) {
      return validation; // retourne l'erreur (invalid characters, longueur, etc.)
    }

    // 2. Fonction récursive de résolution
    const solveRecursive = (puzzle) => {
      const emptyIndex = puzzle.indexOf(".");
      if (emptyIndex === -1) return puzzle; // Plus de cases vides → terminé !

      const row = Math.floor(emptyIndex / 9);
      const col = emptyIndex % 9;
      const rowLetter = String.fromCharCode(65 + row); // 0 => A, etc.
      const colNumber = (col + 1).toString(); // 0 => "1", etc.

      for (let num = 1; num <= 9; num++) {
        const val = num.toString();

        if (
          this.checkRowPlacement(puzzle, rowLetter, colNumber, val) &&
          this.checkColPlacement(puzzle, rowLetter, colNumber, val) &&
          this.checkRegionPlacement(puzzle, rowLetter, colNumber, val)
        ) {
          const newPuzzle =
            puzzle.slice(0, emptyIndex) + val + puzzle.slice(emptyIndex + 1);
          const result = solveRecursive(newPuzzle);
          if (result) return result; // Solution trouvée
        }
      }

      return null; // échec → backtrack
    };

    const solution = solveRecursive(puzzleString);
    if (!solution) {
      return { error: "Puzzle cannot be solved" };
    }

    return solution;
  }
}

module.exports = SudokuSolver;
