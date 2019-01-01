module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/src/specs/setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/']
}
