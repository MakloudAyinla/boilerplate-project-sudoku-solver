const chai = require('chai');
const assert = chai.assert;

const { puzzlesAndSolutions } = require("../controllers/puzzle-strings.js");
const [validPuzzle, expectedSolution] = puzzlesAndSolutions[0];

const Solver = require('../controllers/sudoku-solver.js');
let solver;

suite('Unit Tests', () => {
    before(() => {
      solver = new Solver();
    });

    test("Logic handles a valid puzzle string of 81 characters", () => {
      assert.equal(solver.validate(validPuzzle), true);
    });

    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", () => {
      const invalid = validPuzzle.slice(0, 80) + "X";
      assert.deepEqual(solver.validate(invalid), {
        error: "Invalid characters in puzzle",
      });
    });

    test("Logic handles a puzzle string that is not 81 characters in length", () => {
      const short = validPuzzle.slice(0, 80);
      assert.deepEqual(solver.validate(short), {
        error: "Expected puzzle to be 81 characters long",
      });
    });

    test("Logic handles a valid row placement", () => {
      assert.isTrue(solver.checkRowPlacement(validPuzzle, "A", "1", "3"));
    });

    test("Logic handles an invalid row placement", () => {
      const val = validPuzzle[1]; // valeur déjà dans la ligne
      assert.isFalse(solver.checkRowPlacement(validPuzzle, "A", "1", val));
    });

    test("Logic handles a valid column placement", () => {
      assert.isTrue(solver.checkColPlacement(validPuzzle, "A", "1", "7"));
    });

    test("Logic handles an invalid column placement", () => {
      const val = validPuzzle[9]; // valeur déjà dans la colonne
      assert.isFalse(solver.checkColPlacement(validPuzzle, "A", "1", val));
    });

    test("Logic handles a valid region (3x3 grid) placement", () => {
      assert.isTrue(solver.checkRegionPlacement(validPuzzle, "A", "1", "7"));
    });

    test("Logic handles an invalid region (3x3 grid) placement", () => {
      const val = validPuzzle[20]; // valeur présente dans le bloc
      assert.isFalse(solver.checkRegionPlacement(validPuzzle, "A", "1", val));
    });

    test("Valid puzzle strings pass the solver", () => {
      const solution = solver.solve(validPuzzle);
      assert.equal(solution, expectedSolution);
    });

    test("Invalid puzzle strings fail the solver", () => {
      const invalid = validPuzzle.slice(0, 80) + "!";
      const result = solver.solve(invalid);
      assert.deepEqual(result, { error: "Invalid characters in puzzle" });
    });

    test("Solver returns the expected solution for an incomplete puzzle", () => {
      const solution = solver.solve(validPuzzle);
      assert.equal(solution, expectedSolution);
    });
});
