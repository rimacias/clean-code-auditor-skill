#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const home = os.homedir();
const pluginDir = path.join(home, '.gemini', 'config', 'plugins', 'local-custom-skills');
const skillsDir = path.join(pluginDir, 'skills');
const targetDir = path.join(skillsDir, 'clean-code-auditor');
const legacyDir = path.join(skillsDir, 'solid-code-auditor');

console.log('Installing clean-code-auditor skill...');

try {
  // 1. Create directory structure
  fs.mkdirSync(skillsDir, { recursive: true });

  // 2. Create plugin.json if it doesn't exist
  const pluginJsonPath = path.join(pluginDir, 'plugin.json');
  if (!fs.existsSync(pluginJsonPath)) {
    fs.writeFileSync(pluginJsonPath, JSON.stringify({
      name: "local-custom-skills",
      description: "User's local custom skills for the agent",
      version: "2.0.0"
    }, null, 2));
  }

  // 3. Remove legacy solid-code-auditor directory if present to avoid stale duplicates
  if (fs.existsSync(legacyDir)) {
    try {
      fs.rmSync(legacyDir, { recursive: true, force: true });
      console.log('✓ Cleaned up legacy solid-code-auditor directory');
    } catch (e) {
      // ignore
    }
  }

  // 4. Create target directory
  fs.mkdirSync(targetDir, { recursive: true });

  // 5. Copy core files
  const filesToCopy = ['SKILL.md', 'README.md', 'package.json', 'mcp-server.mjs', 'auditor.mjs'];
  filesToCopy.forEach(file => {
    const src = path.join(__dirname, file);
    const dest = path.join(targetDir, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`✓ Copied ${file}`);
    }
  });

  // 6. Copy references directory recursively
  const refSrc = path.join(__dirname, 'references');
  const refDest = path.join(targetDir, 'references');
  if (fs.existsSync(refSrc)) {
    fs.cpSync(refSrc, refDest, { recursive: true });
    console.log('✓ Copied complete references knowledge base (140 documents)');
  }

  console.log('\n🎉 Installation complete! The clean-code-auditor skill is now active.');
} catch (error) {
  console.error('❌ Installation failed:', error.message);
  process.exit(1);
}
