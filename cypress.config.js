const { defineConfig } = require('cypress');
require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.SAUCE_URL || 'https://www.saucedemo.com',
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents(on, config) {
      // load additional config or plugins if needed
      return config;
    }
  },
  env: {
    USERS: process.env.USERS,
    PASSWORD: process.env.PASSWORD
  }
});
