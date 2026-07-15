#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const sources = [
  '.github/copilot-instructions.md',
  '.github/agents/sathcypress-qa.agent.md',
  '.github/prompts/qa-ticket-workflow.prompt.md',
  'README.md',
  'cypress.config.js',
  'env.json',
  'cypress/support/commands.js',
  'cypress/e2e/e2e_login.cy.js',
  'cypress/e2e/e2e_checkout_flow.cy.js',
  'cypress/e2e/e2e_reset_flow.cy.js'
];

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text) {
  return normalize(text).split(' ').filter(Boolean);
}

function chunkText(text) {
  const cleaned = text.replace(/\r/g, '').trim();
  if (!cleaned) return [];

  const paragraphs = cleaned.split(/\n\s*\n/).map(part => part.trim()).filter(Boolean);
  if (paragraphs.length === 0) return [cleaned];

  const chunks = [];
  paragraphs.forEach((paragraph) => {
    const lines = paragraph.split('\n').map(line => line.trim()).filter(Boolean);
    let current = '';
    lines.forEach((line) => {
      const candidate = current ? `${current}\n${line}` : line;
      if (candidate.length < 500) {
        current = candidate;
      } else {
        chunks.push(current);
        current = line;
      }
    });
    if (current) chunks.push(current);
  });

  return chunks;
}

function scoreChunk(queryTokens, chunkText, filePath) {
  const normalizedChunk = normalize(chunkText);
  const chunkTokens = tokenize(chunkText);
  const uniqueChunkTokens = [...new Set(chunkTokens)];
  const uniqueQueryTokens = [...new Set(queryTokens)];

  const overlap = uniqueQueryTokens.filter(token => uniqueChunkTokens.includes(token)).length;
  const fileBoost = filePath.includes('e2e') ? 0.2 : 0;
  const pathBoost = filePath.includes('checkout') ? 0.15 : 0;
  const exactPhraseBonus = normalizedChunk.includes(normalize(queryTokens.join(' '))) ? 0.4 : 0;

  return overlap + fileBoost + pathBoost + exactPhraseBonus;
}

function collectContext(query) {
  const queryTokens = tokenize(query);
  const results = [];

  for (const relativePath of sources) {
    const absolutePath = path.join(rootDir, relativePath);
    if (!fs.existsSync(absolutePath)) continue;

    const content = fs.readFileSync(absolutePath, 'utf8');
    const chunks = chunkText(content);

    chunks.forEach((chunk) => {
      const score = scoreChunk(queryTokens, chunk, relativePath);
      if (score > 0) {
        results.push({
          path: relativePath,
          score: Number(score.toFixed(2)),
          excerpt: chunk.replace(/\s+/g, ' ').slice(0, 400)
        });
      }
    });
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

function main() {
  const query = process.argv.slice(2).join(' ').trim();
  if (!query) {
    console.log('Usage: node scripts/rag-context.js "your query"');
    process.exit(1);
  }

  const results = collectContext(query);
  const output = {
    query,
    totalResults: results.length,
    results
  };

  console.log(JSON.stringify(output, null, 2));
}

main();
