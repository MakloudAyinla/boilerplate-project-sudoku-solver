const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

const { puzzlesAndSolutions } = require("../controllers/puzzle-strings.js");
const [validPuzzle, expectedSolution] = puzzlesAndSolutions[0];

chai.use(chaiHttp);

suite("Functional Tests", () => {
  test("Solve a puzzle with valid puzzle string: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: validPuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "solution");
        assert.equal(res.body.solution, expectedSolution);
        done();
      });
  });

  test("Solve a puzzle with missing puzzle string: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({})
      .end((err, res) => {
        assert.deepEqual(res.body, { error: "Required field missing" });
        done();
      });
  });

  test("Solve a puzzle with invalid characters: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: validPuzzle.slice(0, 80) + "X" })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: "Invalid characters in puzzle" });
        done();
      });
  });

  test("Solve a puzzle with incorrect length: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: validPuzzle.slice(0, 60) })
      .end((err, res) => {
        assert.deepEqual(res.body, {
          error: "Expected puzzle to be 81 characters long",
        });
        done();
      });
  });

  test("Solve a puzzle that cannot be solved: POST request to /api/solve", function (done) {
    const unsolvable =
      validPuzzle.slice(0, 1) + validPuzzle[0] + validPuzzle.slice(2); // duplicate value
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: unsolvable })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: "Puzzle cannot be solved" });
        done();
      });
  });

  test("Check a puzzle placement with all fields: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: validPuzzle, coordinate: "A2", value: "3" })
      .end((err, res) => {
        assert.deepEqual(res.body, { valid: true });
        done();
      });
  });

  test("Check a puzzle placement with single placement conflict", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: validPuzzle, coordinate: "A2", value: "4" })
      .end((err, res) => {
        assert.isFalse(res.body.valid);
        assert.deepEqual(res.body.conflict, ["row"]);
        done();
      });
  });

  test("Check a puzzle placement with multiple placement conflicts", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: validPuzzle, coordinate: "A2", value: "5" })
      .end((err, res) => {
        assert.isFalse(res.body.valid);
        assert.includeMembers(res.body.conflict, ["row", "region"]);
        done();
      });
  });

  test("Check a puzzle placement with all placement conflicts", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: validPuzzle, coordinate: "I9", value: "9" })
      .end((err, res) => {
        assert.isFalse(res.body.valid);
        assert.sameMembers(res.body.conflict, ["row", "column", "region"]);
        done();
      });
  });

  test("Check a puzzle placement with missing required fields", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: validPuzzle, coordinate: "A1" })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: "Required field(s) missing" });
        done();
      });
  });

  test("Check a puzzle placement with invalid characters", function (done) {
    const invalid = validPuzzle.slice(0, 80) + "#";
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: invalid, coordinate: "A1", value: "5" })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: "Invalid characters in puzzle" });
        done();
      });
  });

  test("Check a puzzle placement with incorrect length", function (done) {
    const short = validPuzzle.slice(0, 60);
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: short, coordinate: "A1", value: "5" })
      .end((err, res) => {
        assert.deepEqual(res.body, {
          error: "Expected puzzle to be 81 characters long",
        });
        done();
      });
  });

  test("Check a puzzle placement with invalid placement coordinate", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: validPuzzle, coordinate: "Z9", value: "5" })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: "Invalid coordinate" });
        done();
      });
  });

  test("Check a puzzle placement with invalid placement value", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: validPuzzle, coordinate: "A1", value: "X" })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: "Invalid value" });
        done();
      });
  });
});
