#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Email Spam Analyzer...\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 14) {
  console.error('❌ Node.js version 14 or higher is required');
  console.error(`Current version: ${nodeVersion}`);
  process.exit(1);
}

console.log('✅ Node.js version check passed');

// Function to run commands
function runCommand(command, cwd = process.cwd()) {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { cwd, stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`❌ Failed to run: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Check if directories exist
const serverDir = path.join(__dirname, 'server');
const clientDir = path.join(__dirname, 'client');

if (!fs.existsSync(serverDir)) {
  console.error('❌ Server directory not found');
  process.exit(1);
}

if (!fs.existsSync(clientDir)) {
  console.error('❌ Client directory not found');
  process.exit(1);
}

console.log('✅ Project structure verified');

// Install root dependencies
console.log('\n📦 Installing root dependencies...');
if (!runCommand('npm install')) {
  process.exit(1);
}

// Install server dependencies
console.log('\n📦 Installing server dependencies...');
if (!runCommand('npm install', serverDir)) {
  process.exit(1);
}

// Install client dependencies
console.log('\n📦 Installing client dependencies...');
if (!runCommand('npm install', clientDir)) {
  process.exit(1);
}

// Run tests
console.log('\n🧪 Running tests...');
console.log('Testing server...');
if (!runCommand('npm test', serverDir)) {
  console.log('⚠️  Server tests failed, but continuing setup...');
}

console.log('Testing client...');
if (!runCommand('npm test -- --watchAll=false', clientDir)) {
  console.log('⚠️  Client tests failed, but continuing setup...');
}

console.log('\n✅ Setup completed successfully!');
console.log('\n🎉 Email Spam Analyzer is ready to use!');
console.log('\nTo start the application:');
console.log('  npm run dev');
console.log('\nThis will start both the server (port 5000) and client (port 3000)');
console.log('\nOpen http://localhost:3000 in your browser to use the application.');
console.log('\nFor more information, see README.md');
