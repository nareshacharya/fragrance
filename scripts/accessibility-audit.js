#!/usr/bin/env node

/**
 * Accessibility Audit Script
 * 
 * This script runs comprehensive accessibility audits using axe-core
 * and generates detailed reports of accessibility violations.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // URLs to audit
  urls: [
    'http://localhost:3000',
    'http://localhost:3000/login',
    'http://localhost:3000/ingredients',
    'http://localhost:3000/dashboard'
  ],
  
  // Output directory
  outputDir: path.join(__dirname, '../reports/accessibility'),
  
  // Report formats
  formats: ['json', 'html', 'csv'],
  
  // Axe-core rules to include
  rules: [
    'color-contrast',
    'keyboard-navigation',
    'focus-management',
    'aria-attributes',
    'semantic-html',
    'landmark-roles',
    'heading-order',
    'image-alt',
    'link-name',
    'button-name',
    'form-field-multiple-labels',
    'label',
    'select-name',
    'text-input-label'
  ],
  
  // Axe-core rules to exclude
  exclude: [
    'color-contrast-enhanced', // Too strict for most use cases
    'focus-order-semantics' // Can be noisy
  ],
  
  // Thresholds
  thresholds: {
    violations: 0,
    incomplete: 5,
    inapplicable: 0
  }
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Utility functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Check if required tools are installed
function checkDependencies() {
  try {
    execSync('npx --version', { stdio: 'ignore' });
    logSuccess('npx is available');
  } catch (error) {
    logError('npx is not available. Please install Node.js and npm.');
    process.exit(1);
  }
}

// Create output directory
function createOutputDir() {
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    logInfo(`Created output directory: ${CONFIG.outputDir}`);
  }
}

// Run accessibility audit for a single URL
function auditUrl(url) {
  logInfo(`Auditing: ${url}`);
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const urlName = url.replace(/[^a-zA-Z0-9]/g, '_');
  
  const results = {
    url,
    timestamp,
    violations: [],
    incomplete: [],
    inapplicable: [],
    passes: []
  };
  
  try {
    // Run axe-core audit
    const command = `npx @axe-core/cli ${url} --rules ${CONFIG.rules.join(',')} --exclude ${CONFIG.exclude.join(',')} --format json`;
    const output = execSync(command, { encoding: 'utf8', timeout: 30000 });
    
    const axeResults = JSON.parse(output);
    
    results.violations = axeResults.violations || [];
    results.incomplete = axeResults.incomplete || [];
    results.inapplicable = axeResults.inapplicable || [];
    results.passes = axeResults.passes || [];
    
    // Save individual report
    const reportPath = path.join(CONFIG.outputDir, `${urlName}_${timestamp}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    
    logSuccess(`Audit completed for ${url}`);
    return results;
    
  } catch (error) {
    logError(`Failed to audit ${url}: ${error.message}`);
    return null;
  }
}

// Generate summary report
function generateSummaryReport(allResults) {
  const summary = {
    timestamp: new Date().toISOString(),
    totalUrls: allResults.length,
    totalViolations: 0,
    totalIncomplete: 0,
    totalPasses: 0,
    urls: []
  };
  
  allResults.forEach(result => {
    if (result) {
      const urlSummary = {
        url: result.url,
        violations: result.violations.length,
        incomplete: result.incomplete.length,
        passes: result.passes.length,
        status: result.violations.length === 0 ? 'PASS' : 'FAIL'
      };
      
      summary.urls.push(urlSummary);
      summary.totalViolations += result.violations.length;
      summary.totalIncomplete += result.incomplete.length;
      summary.totalPasses += result.passes.length;
    }
  });
  
  // Save summary report
  const summaryPath = path.join(CONFIG.outputDir, 'summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  
  return summary;
}

// Generate HTML report
function generateHtmlReport(summary, allResults) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Audit Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            border-bottom: 3px solid #007acc;
            padding-bottom: 10px;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .summary-card {
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        .summary-card.violations {
            background-color: #fee;
            border: 1px solid #fcc;
        }
        .summary-card.incomplete {
            background-color: #ffa;
            border: 1px solid #ffc;
        }
        .summary-card.passes {
            background-color: #efe;
            border: 1px solid #cfc;
        }
        .summary-card h3 {
            margin: 0 0 10px 0;
            font-size: 2em;
        }
        .url-results {
            margin-top: 30px;
        }
        .url-result {
            margin: 20px 0;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
        }
        .url-result.pass {
            border-color: #4caf50;
            background-color: #f8fff8;
        }
        .url-result.fail {
            border-color: #f44336;
            background-color: #fff8f8;
        }
        .violation {
            margin: 15px 0;
            padding: 15px;
            background-color: #fff5f5;
            border-left: 4px solid #f44336;
            border-radius: 4px;
        }
        .violation h4 {
            margin: 0 0 10px 0;
            color: #d32f2f;
        }
        .violation .description {
            margin: 10px 0;
            color: #666;
        }
        .violation .impact {
            font-weight: bold;
            color: #d32f2f;
        }
        .violation .help {
            margin: 10px 0;
            font-style: italic;
            color: #666;
        }
        .violation .nodes {
            margin: 10px 0;
        }
        .violation .node {
            margin: 5px 0;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 4px;
            font-family: monospace;
            font-size: 0.9em;
        }
        .timestamp {
            color: #666;
            font-size: 0.9em;
            margin-top: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Accessibility Audit Report</h1>
        
        <div class="summary">
            <div class="summary-card violations">
                <h3>${summary.totalViolations}</h3>
                <p>Violations</p>
            </div>
            <div class="summary-card incomplete">
                <h3>${summary.totalIncomplete}</h3>
                <p>Incomplete</p>
            </div>
            <div class="summary-card passes">
                <h3>${summary.totalPasses}</h3>
                <p>Passes</p>
            </div>
        </div>
        
        <div class="url-results">
            <h2>URL Results</h2>
            ${allResults.map(result => {
              if (!result) return '';
              
              const status = result.violations.length === 0 ? 'pass' : 'fail';
              const statusText = result.violations.length === 0 ? 'PASS' : 'FAIL';
              
              return `
                <div class="url-result ${status}">
                    <h3>${result.url} - ${statusText}</h3>
                    <p>Violations: ${result.violations.length}, Incomplete: ${result.incomplete.length}, Passes: ${result.passes.length}</p>
                    
                    ${result.violations.map(violation => `
                        <div class="violation">
                            <h4>${violation.id}</h4>
                            <div class="description">${violation.description}</div>
                            <div class="impact">Impact: ${violation.impact}</div>
                            <div class="help">Help: ${violation.help}</div>
                            <div class="nodes">
                                <strong>Affected Elements:</strong>
                                ${violation.nodes.map(node => `
                                    <div class="node">${node.html}</div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
              `;
            }).join('')}
        </div>
        
        <div class="timestamp">
            Generated on ${summary.timestamp}
        </div>
    </div>
</body>
</html>
  `;
  
  const htmlPath = path.join(CONFIG.outputDir, 'report.html');
  fs.writeFileSync(htmlPath, html);
  
  return htmlPath;
}

// Generate CSV report
function generateCsvReport(summary, allResults) {
  const csvRows = [
    ['URL', 'Status', 'Violations', 'Incomplete', 'Passes', 'Timestamp']
  ];
  
  allResults.forEach(result => {
    if (result) {
      const status = result.violations.length === 0 ? 'PASS' : 'FAIL';
      csvRows.push([
        result.url,
        status,
        result.violations.length,
        result.incomplete.length,
        result.passes.length,
        result.timestamp
      ]);
    }
  });
  
  const csv = csvRows.map(row => row.join(',')).join('\n');
  const csvPath = path.join(CONFIG.outputDir, 'report.csv');
  fs.writeFileSync(csvPath, csv);
  
  return csvPath;
}

// Check thresholds
function checkThresholds(summary) {
  const violations = summary.totalViolations;
  const incomplete = summary.totalIncomplete;
  
  let passed = true;
  
  if (violations > CONFIG.thresholds.violations) {
    logError(`Violations threshold exceeded: ${violations} > ${CONFIG.thresholds.violations}`);
    passed = false;
  }
  
  if (incomplete > CONFIG.thresholds.incomplete) {
    logWarning(`Incomplete threshold exceeded: ${incomplete} > ${CONFIG.thresholds.incomplete}`);
  }
  
  return passed;
}

// Main function
async function main() {
  log('🔍 Starting Accessibility Audit', 'cyan');
  
  // Check dependencies
  checkDependencies();
  
  // Create output directory
  createOutputDir();
  
  // Run audits for all URLs
  const allResults = [];
  
  for (const url of CONFIG.urls) {
    const result = auditUrl(url);
    allResults.push(result);
  }
  
  // Generate reports
  logInfo('Generating reports...');
  
  const summary = generateSummaryReport(allResults);
  const htmlPath = generateHtmlReport(summary, allResults);
  const csvPath = generateCsvReport(summary, allResults);
  
  // Display summary
  log('\n📊 Audit Summary:', 'cyan');
  log(`Total URLs: ${summary.totalUrls}`);
  log(`Total Violations: ${summary.totalViolations}`, summary.totalViolations > 0 ? 'red' : 'green');
  log(`Total Incomplete: ${summary.totalIncomplete}`, summary.totalIncomplete > 0 ? 'yellow' : 'green');
  log(`Total Passes: ${summary.totalPasses}`, 'green');
  
  // Check thresholds
  const passed = checkThresholds(summary);
  
  // Display report locations
  log('\n📁 Reports generated:', 'cyan');
  log(`HTML Report: ${htmlPath}`);
  log(`CSV Report: ${csvPath}`);
  log(`Summary: ${path.join(CONFIG.outputDir, 'summary.json')}`);
  
  // Exit with appropriate code
  if (passed) {
    logSuccess('Accessibility audit passed!');
    process.exit(0);
  } else {
    logError('Accessibility audit failed!');
    process.exit(1);
  }
}

// Handle errors
process.on('uncaughtException', (error) => {
  logError(`Uncaught exception: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logError(`Unhandled rejection: ${reason}`);
  process.exit(1);
});

// Run main function
main().catch(error => {
  logError(`Error: ${error.message}`);
  process.exit(1);
});

