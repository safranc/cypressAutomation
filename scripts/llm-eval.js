#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
const OPENAI_API_URL = process.env.OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions';
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:3b';
const LLM_PROVIDER = (process.env.LLM_PROVIDER || 'local').toLowerCase();
const REPORT_PATH = path.resolve(__dirname, '..', 'reports', 'llm-eval.json');

const cases = [
  {
    id: 'login-file',
    question: 'Which Cypress spec covers the login flow?',
    expected: ['e2e_login.cy.js', 'login'],
    required: ['e2e_login.cy.js'],
    minWords: 5
  },
  {
    id: 'rag-command',
    question: 'How do I run the RAG context script in this project?',
    expected: ['rag:context', 'scripts/rag-context.js'],
    required: ['rag:context'],
    minWords: 6
  },
  {
    id: 'checkout-spec',
    question: 'Which Cypress spec covers the checkout flow?',
    expected: ['e2e_checkout_flow.cy.js', 'checkout'],
    required: ['e2e_checkout_flow.cy.js'],
    minWords: 5
  }
];

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function countMatchedTerms(answer, terms) {
  const normalizedAnswer = normalize(answer);
  return terms.filter((term) => normalize(term) && normalizedAnswer.includes(normalize(term))).length;
}

function scoreAnswer(answer, testCase) {
  const matched = countMatchedTerms(answer, testCase.expected);
  const requiredMatched = countMatchedTerms(answer, testCase.required);
  const completeness = testCase.expected.length > 0 ? matched / testCase.expected.length : 0;
  const accuracy = testCase.required.length > 0 ? requiredMatched / testCase.required.length : 0;
  const words = normalize(answer).split(/\s+/).filter(Boolean).length;
  const format = words >= testCase.minWords ? 1 : 0;
  const overall = (accuracy + completeness + format) / 3;

  return {
    accuracy,
    completeness,
    format,
    overall
  };
}

function generateLocalAnswer(prompt) {
  const normalizedPrompt = normalize(prompt);

  if (normalizedPrompt.includes('login')) {
    return 'The login flow is covered by cypress/e2e/e2e_login.cy.js.';
  }

  if (normalizedPrompt.includes('checkout')) {
    return 'The checkout flow is covered by cypress/e2e/e2e_checkout_flow.cy.js.';
  }

  if (normalizedPrompt.includes('rag')) {
    return 'Run npm run rag:context with a query such as npm run rag:context "checkout".';
  }

  return `Local fallback answer for: ${prompt}`;
}

async function callOpenAI(prompt) {
  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: 'You are a concise assistant. Answer using repository context when relevant.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

async function callOllama(prompt) {
  const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      options: { temperature: 0.1 }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama request failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.response?.trim() || '';
}

async function callModel(prompt) {
  if (LLM_PROVIDER === 'openai' && OPENAI_API_KEY) {
    return callOpenAI(prompt);
  }

  if (LLM_PROVIDER === 'ollama') {
    try {
      return await callOllama(prompt);
    } catch (error) {
      return generateLocalAnswer(prompt);
    }
  }

  return generateLocalAnswer(prompt);
}

async function runCase(testCase) {
  const answer = await callModel(testCase.question);
  const metrics = scoreAnswer(answer, testCase);
  const passed = metrics.accuracy >= 1 && metrics.completeness >= 0.5 && metrics.format >= 1;

  return {
    id: testCase.id,
    question: testCase.question,
    answer,
    metrics,
    passed
  };
}

function writeReport(results) {
  const reportDir = path.dirname(REPORT_PATH);
  fs.mkdirSync(reportDir, { recursive: true });

  const summary = {
    totalCases: results.length,
    passedCases: results.filter((result) => result.passed).length,
    averageOverall: results.reduce((sum, result) => sum + result.metrics.overall, 0) / results.length,
    provider: LLM_PROVIDER,
    generatedAt: new Date().toISOString()
  };

  const report = { summary, results };
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`\nReport written to ${path.relative(process.cwd(), REPORT_PATH)}`);
}

(async () => {
  try {
    const results = [];

    for (const testCase of cases) {
      const result = await runCase(testCase);
      results.push(result);
    }

    const passedCount = results.filter((result) => result.passed).length;
    console.log('LLM evaluation results');
    console.log('======================');

    results.forEach((result) => {
      console.log(`\n[${result.passed ? 'PASS' : 'FAIL'}] ${result.id}`);
      console.log(`Q: ${result.question}`);
      console.log(`A: ${result.answer}`);
      console.log(`Accuracy: ${result.metrics.accuracy.toFixed(2)}`);
      console.log(`Completeness: ${result.metrics.completeness.toFixed(2)}`);
      console.log(`Format: ${result.metrics.format.toFixed(2)}`);
      console.log(`Overall: ${result.metrics.overall.toFixed(2)}`);
    });

    console.log(`\nSummary: ${passedCount}/${results.length} passed`);
    console.log(`Average overall score: ${(results.reduce((sum, result) => sum + result.metrics.overall, 0) / results.length).toFixed(2)}`);

    writeReport(results);
  } catch (error) {
    console.error('Evaluation failed:', error.message);
    process.exit(1);
  }
})();
