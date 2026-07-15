const path = require('path');
const { execFile } = require('child_process');
const { defineConfig } = require('cypress');
require('dotenv').config();

function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    execFile(command, args, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message || error);
      } else {
        resolve(stdout);
      }
    });
  });
}

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.SAUCE_URL || 'https://www.saucedemo.com',
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents(on, config) {
      on('task', {
        runLlmeval() {
          return runCommand('node', ['scripts/llm-eval.js'], path.resolve(__dirname)).then((output) => {
            const reportPath = path.join(__dirname, 'reports', 'llm-eval.json');
            return require(reportPath);
          });
        },
        runRagContext({ query }) {
          return runCommand('node', ['scripts/rag-context.js', query], path.resolve(__dirname)).then((stdout) => {
            return JSON.parse(stdout);
          });
        }
      });
      return config;
    }
  },
  env: {
    USERS: process.env.USERS,
    PASSWORD: process.env.PASSWORD
  }
});
