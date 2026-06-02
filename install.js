#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const home = os.homedir();
const pluginDir = path.join(home, '.gemini', 'config', 'plugins', 'local-custom-skills');
const skillsDir = path.join(pluginDir, 'skills');
const targetDir = path.join(skillsDir, 'solid-code-auditor');

console.log('Installing solid-code-auditor skill...');

try {
  // 1. Create directory structure
  fs.mkdirSync(skillsDir, { recursive: true });

  // 2. Create plugin.json if it doesn't exist
  const pluginJsonPath = path.join(pluginDir, 'plugin.json');
  if (!fs.existsSync(pluginJsonPath)) {
    fs.writeFileSync(pluginJsonPath, JSON.stringify({
      name: "local-custom-skills",
      description: "User's local custom skills for the agent",
      version: "1.0.0"
    }, null, 2));
  }

  // 3. Create target directory
  fs.mkdirSync(targetDir, { recursive: true });

  // 4. Copy files from the running npm package to the target directory
  const filesToCopy = ['SKILL.md', 'README.md', 'package.json', 'mcp-server.mjs', 'auditor.mjs'];
  filesToCopy.forEach(file => {
    const src = path.join(__dirname, file);
    const dest = path.join(targetDir, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`✓ Copied ${file}`);
    }
  });

  console.log('\n🎉 Installation complete! Please restart your agent/chat interface to load the skill.');
} catch (error) {
  console.error('❌ Installation failed:', error.message);
  process.exit(1);
}
