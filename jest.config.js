module.exports = {
  roots: ["<rootDir>/tests"],
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": "ts-jest",
  },
  testRegex: "(/tests/.*|(.|/)(test|spec)).tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  coverageDirectory: "./coverage",
  collectCoverage: true,
};
