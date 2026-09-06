import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REFERENCES_DIR = path.join(__dirname, 'references');

// Helper to recursively walk a directory and list source files
export async function getFiles(dir, excludeDirs = ['node_modules', '.git', '.codegraph', 'dist', 'build', 'out', '.next', '.nuxt', 'coverage']) {
  const files = [];
  async function walk(currentDir) {
    let entries;
    try {
      entries = await fs.promises.readdir(currentDir, { withFileTypes: true });
    } catch (e) {
      return;
    }
    for (const entry of entries) {
      const res = path.resolve(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (excludeDirs.includes(entry.name)) continue;
        await walk(res);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        const supportedExts = ['.js', '.ts', '.jsx', '.tsx', '.py', '.go', '.java', '.cpp', '.c', '.cs', '.rb', '.php', '.rs'];
        if (supportedExts.includes(ext)) {
          files.push(res);
        }
      }
    }
  }
  await walk(dir);
  return files;
}

// DRY duplicate detector using normalized token sliding windows
export async function detectDuplicates(directory, minLines = 6) {
  const files = await getFiles(directory);
  
  // Keep track of normalized lines for each file
  const fileLines = {}; // filePath -> Array of { originalLineNumber, originalText, normalizedText }
  
  for (const file of files) {
    try {
      const content = await fs.promises.readFile(file, 'utf8');
      const lines = content.split(/\r?\n/);
      const normalized = [];
      let inBlockComment = false;
      
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        const originalText = line;
        
        // Strip block comments
        if (inBlockComment) {
          const endIdx = line.indexOf('*/');
          if (endIdx !== -1) {
            line = line.substring(endIdx + 2);
            inBlockComment = false;
          } else {
            continue;
          }
        }
        
        const startIdx = line.indexOf('/*');
        if (startIdx !== -1) {
          const endIdx = line.indexOf('*/', startIdx + 2);
          if (endIdx !== -1) {
            line = line.substring(0, startIdx) + line.substring(endIdx + 2);
          } else {
            line = line.substring(0, startIdx);
            inBlockComment = true;
          }
        }
        
        // Strip line comments
        const commentCharIdx = line.indexOf('//');
        if (commentCharIdx !== -1) {
          line = line.substring(0, commentCharIdx);
        }
        const hashCommentIdx = line.indexOf('#');
        if (hashCommentIdx !== -1 && (file.endsWith('.py') || file.endsWith('.rb') || file.endsWith('.sh') || file.endsWith('.yaml') || file.endsWith('.yml'))) {
          line = line.substring(0, hashCommentIdx);
        }
        
        const normalizedText = line.trim();
        if (normalizedText.length > 0) {
          normalized.push({
            originalLineNumber: i + 1,
            originalText,
            normalizedText
          });
        }
      }
      fileLines[file] = normalized;
    } catch (e) {
      // ignore read errors
    }
  }

  // Find duplicate blocks using sliding window hashes
  const blockHashes = new Map();
  
  const getBlockKey = (lines, startIndex, length) => {
    let key = '';
    for (let i = 0; i < length; i++) {
      key += lines[startIndex + i].normalizedText + '\n';
    }
    return key;
  };
  
  for (const file of Object.keys(fileLines)) {
    const lines = fileLines[file];
    if (lines.length < minLines) continue;
    
    for (let i = 0; i <= lines.length - minLines; i++) {
      const blockKey = getBlockKey(lines, i, minLines);
      if (!blockHashes.has(blockKey)) {
        blockHashes.set(blockKey, []);
      }
      blockHashes.get(blockKey).push({ filePath: file, startIndex: i });
    }
  }
  
  const rawDuplicates = [];
  for (const occurrences of blockHashes.values()) {
    if (occurrences.length > 1) {
      rawDuplicates.push(occurrences);
    }
  }
  
  const extendedDuplicates = [];
  const visited = new Set();
  
  for (const occurrences of rawDuplicates) {
    const primary = occurrences[0];
    const key = `${primary.filePath}:${primary.startIndex}`;
    if (visited.has(key)) continue;
    
    let length = minLines;
    let canExpand = true;
    
    while (canExpand) {
      let nextLinesMatch = true;
      let firstNextNormalized = null;
      
      for (const occ of occurrences) {
        const fl = fileLines[occ.filePath];
        const nextIndex = occ.startIndex + length;
        if (nextIndex >= fl.length) {
          nextLinesMatch = false;
          break;
        }
        const normalizedVal = fl[nextIndex].normalizedText;
        if (firstNextNormalized === null) {
          firstNextNormalized = normalizedVal;
        } else if (firstNextNormalized !== normalizedVal) {
          nextLinesMatch = false;
          break;
        }
      }
      
      if (nextLinesMatch && firstNextNormalized !== null) {
        length++;
      } else {
        canExpand = false;
      }
    }
    
    for (const occ of occurrences) {
      for (let offset = 0; offset <= length - minLines; offset++) {
        visited.add(`${occ.filePath}:${occ.startIndex + offset}`);
      }
    }
    
    const snippetLines = fileLines[primary.filePath].slice(primary.startIndex, primary.startIndex + length);
    const snippet = snippetLines.map(l => l.originalText).join('\n');
    
    const instances = occurrences.map(occ => {
      const startLineObj = fileLines[occ.filePath][occ.startIndex];
      const endLineObj = fileLines[occ.filePath][occ.startIndex + length - 1];
      return {
        filePath: occ.filePath,
        startLine: startLineObj.originalLineNumber,
        endLine: endLineObj.originalLineNumber
      };
    });
    
    extendedDuplicates.push({
      linesCount: length,
      snippet,
      instances,
      smell: "Duplicate Code",
      category: "Dispensables",
      reference: "01-refactoring/05-code-smells/04-dispensables/02-duplicate-code.md",
      recommendedRefactorings: ["Extract Method", "Pull Up Method", "Form Template Method", "Substitute Algorithm"]
    });
  }
  
  extendedDuplicates.sort((a, b) => b.linesCount - a.linesCount);
  return extendedDuplicates;
}

// Clean Code & SOLID principles compliance auditor
export async function auditSolid(directoryOrFile) {
  let files = [];
  const stat = await fs.promises.stat(directoryOrFile);
  if (stat.isFile()) {
    files = [directoryOrFile];
  } else {
    files = await getFiles(directoryOrFile);
  }
  
  const violations = [];
  
  for (const file of files) {
    try {
      const content = await fs.promises.readFile(file, 'utf8');
      const relativePath = path.relative(process.cwd(), file);
      const lines = content.split(/\r?\n/);
      
      let methodLinesCount = 0;
      let insideMethod = false;
      let methodStartLine = 0;
      let methodName = '';
      let braceCount = 0;
      
      let insideClass = false;
      let classStartLine = 0;
      let className = '';
      let classBraceCount = 0;
      let classMethodCount = 0;
      
      const fileImports = [];
      const paramSignatures = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        
        // Imports tracking
        if (trimmed.startsWith('import ') || (trimmed.startsWith('const ') && trimmed.includes("require('")) || trimmed.startsWith('import {')) {
          fileImports.push(trimmed);
        }
        
        // Class check
        const classMatch = trimmed.match(/(?:export\s+)?class\s+(\w+)/);
        if (classMatch && !insideClass) {
          insideClass = true;
          className = classMatch[1];
          classStartLine = i + 1;
          classBraceCount = 0;
          classMethodCount = 0;
        }
        
        if (insideClass) {
          const opens = (line.match(/\{/g) || []).length;
          const closes = (line.match(/\}/g) || []).length;
          classBraceCount += opens - closes;
          
          if (classBraceCount === 0 && i > classStartLine) {
            const classLength = i + 1 - classStartLine;
            if (classLength > 250) {
              violations.push({
                file: relativePath,
                line: classStartLine,
                principle: 'SRP',
                smell: 'Large Class',
                category: 'Bloaters',
                severity: 'warning',
                rule: 'Large Class (Bloater)',
                description: `Class '${className}' contains ${classLength} lines. Large classes accumulate too many responsibilities, violating the Single Responsibility Principle.`,
                remedy: 'Split the class into smaller, specialized classes or extract sub-components.',
                reference: '01-refactoring/05-code-smells/01-bloaters/02-large-class.md',
                recommendedRefactorings: ['Extract Class', 'Extract Subclass', 'Extract Interface', 'Duplicate Observed Data']
              });
            }
            if (classMethodCount > 12) {
              violations.push({
                file: relativePath,
                line: classStartLine,
                principle: 'ISP / SRP',
                smell: 'Large Class',
                category: 'Bloaters',
                severity: 'info',
                rule: 'Bloated Class Interface',
                description: `Class '${className}' exposes ${classMethodCount} methods, suggesting poor cohesion and possible Interface Segregation Principle violation.`,
                remedy: 'Segregate the class into smaller interfaces or delegate subsets of operations to collaborator objects.',
                reference: '01-refactoring/05-code-smells/01-bloaters/02-large-class.md',
                recommendedRefactorings: ['Extract Class', 'Extract Interface', 'Hide Delegate']
              });
            }
            insideClass = false;
          }
        }
        
        // Method/Function check
        const funcMatch = trimmed.match(/(?:async\s+)?(?:function\s+(\w+)|(\w+)\s*\([^)]*\)\s*\{|(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>)/);
        if (funcMatch && !insideMethod) {
          methodName = funcMatch[1] || funcMatch[2] || funcMatch[3];
          if (methodName && !['if', 'for', 'while', 'switch', 'catch'].includes(methodName)) {
            insideMethod = true;
            methodStartLine = i + 1;
            braceCount = 0;
            methodLinesCount = 0;
            if (insideClass) {
              classMethodCount++;
            }
            
            const paramStart = line.indexOf('(');
            const paramEnd = line.indexOf(')', paramStart);
            if (paramStart !== -1 && paramEnd !== -1) {
              const paramsStr = line.substring(paramStart + 1, paramEnd);
              const params = paramsStr.split(',').map(p => p.trim()).filter(Boolean);
              if (params.length > 0) {
                paramSignatures.push({ methodName, params: params.join(',') });
              }
              if (params.length >= 4) {
                violations.push({
                  file: relativePath,
                  line: i + 1,
                  principle: 'Clean Code',
                  smell: 'Long Parameter List',
                  category: 'Bloaters',
                  severity: 'warning',
                  rule: 'Long Parameter List (Bloater)',
                  description: `Function '${methodName}' takes ${params.length} parameters, making callers brittle and hard to maintain.`,
                  remedy: 'Group related parameters into a parameter object, dictionary, or configuration struct.',
                  reference: '01-refactoring/05-code-smells/01-bloaters/04-long-parameter-list.md',
                  recommendedRefactorings: ['Introduce Parameter Object', 'Preserve Whole Object', 'Replace Parameter with Method Call']
                });
              }
            }
          }
        }
        
        if (insideMethod) {
          if (trimmed.length > 0 && !trimmed.startsWith('//') && !trimmed.startsWith('/*') && !trimmed.startsWith('*')) {
            methodLinesCount++;
          }
          const opens = (line.match(/\{/g) || []).length;
          const closes = (line.match(/\}/g) || []).length;
          braceCount += opens - closes;
          
          if (braceCount === 0 && i > methodStartLine) {
            if (methodLinesCount > 40) {
              violations.push({
                file: relativePath,
                line: methodStartLine,
                principle: 'SRP',
                smell: 'Long Method',
                category: 'Bloaters',
                severity: 'warning',
                rule: 'Long Method (Bloater)',
                description: `Method '${methodName}' has ${methodLinesCount} logical lines. Long methods obscure intent and hide multiple hidden responsibilities.`,
                remedy: 'Decompose the method into smaller, clearly named functions using Extract Method.',
                reference: '01-refactoring/05-code-smells/01-bloaters/01-long-method.md',
                recommendedRefactorings: ['Extract Method', 'Replace Temp with Query', 'Introduce Parameter Object', 'Decompose Conditional']
              });
            }
            insideMethod = false;
          }
        }
        
        // OCP Check: Switch statements or complex type branches inside classes
        if (trimmed.startsWith('switch ') || (trimmed.startsWith('if ') && (trimmed.includes('=== "') || trimmed.includes('== "') || trimmed.includes('.type ===') || trimmed.includes('.kind ===')))) {
          if (insideClass && (trimmed.startsWith('switch') || trimmed.includes('.type') || trimmed.includes('.kind'))) {
            violations.push({
              file: relativePath,
              line: i + 1,
              principle: 'OCP',
              smell: 'Switch Statements',
              category: 'Object-Orientation Abusers',
              severity: 'info',
              rule: 'Switch Statements / Type Checking (OO Abuser)',
              description: `Type-branching conditional detected in class '${className}'. Adding a new type requires modifying this code, violating the Open/Closed Principle.`,
              remedy: 'Replace conditional logic with polymorphism or dynamic strategy dispatch.',
              reference: '01-refactoring/05-code-smells/02-oo-abusers/03-switch-statements.md',
              recommendedRefactorings: ['Replace Conditional with Polymorphism', 'Replace Type Code with Subclasses', 'Replace Type Code with State/Strategy'],
              designPatterns: ['Strategy Pattern', 'Factory Method', 'State Pattern']
            });
          }
        }
        
        // DIP Check: Hardcoded object instantiation in business classes
        if (insideClass && trimmed.includes('new ') && !trimmed.includes('new Date') && !trimmed.includes('new Error') && !trimmed.includes('new Promise') && !trimmed.includes('new Map') && !trimmed.includes('new Set') && !trimmed.includes('new RegExp')) {
          const newMatch = trimmed.match(/new\s+([A-Z]\w+)/);
          if (newMatch) {
            violations.push({
              file: relativePath,
              line: i + 1,
              principle: 'DIP',
              smell: 'Inappropriate Intimacy / Hardcoded Dependency',
              category: 'Couplers',
              severity: 'warning',
              rule: 'Hardcoded Instantiation (DIP Violation)',
              description: `Direct instantiation of '${newMatch[1]}' inside class '${className}'. Violates Dependency Inversion Principle; higher-level classes should depend on abstractions.`,
              remedy: `Inject '${newMatch[1]}' or its interface abstraction via constructor or factory.`,
              reference: '01-refactoring/05-code-smells/05-couplers/02-inappropriate-intimacy.md',
              recommendedRefactorings: ['Replace Constructor with Factory Method', 'Extract Interface'],
              designPatterns: ['Factory Method', 'Abstract Factory', 'Dependency Injection']
            });
          }
        }
      }
      
      // High Coupling / Couplers smell
      if (fileImports.length > 15) {
        violations.push({
          file: relativePath,
          line: 1,
          principle: 'Clean Architecture',
          smell: 'High Coupling',
          category: 'Couplers',
          severity: 'warning',
          rule: 'Excessive Coupling (Coupler)',
          description: `Module imports ${fileImports.length} external dependencies. High coupling makes changes cascading and units difficult to test in isolation.`,
          remedy: 'Consolidate dependencies, introduce Facade or Mediator patterns, or split module responsibilities.',
          reference: '01-refactoring/05-code-smells/05-couplers/00-overview.md',
          recommendedRefactorings: ['Extract Class', 'Hide Delegate', 'Remove Middle Man'],
          designPatterns: ['Facade Pattern', 'Mediator Pattern']
        });
      }
      
    } catch (e) {
      // ignore read errors
    }
  }
  
  return violations;
}

// Search and lookup helper for bundled references
export async function lookupKnowledge(query) {
  const queryLower = query.toLowerCase().trim();
  const results = [];
  
  if (!fs.existsSync(REFERENCES_DIR)) {
    return results;
  }
  
  async function searchDir(currentDir, relPrefix = '') {
    const entries = await fs.promises.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relPath = path.join(relPrefix, entry.name);
      if (entry.isDirectory()) {
        await searchDir(fullPath, relPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        try {
          const content = await fs.promises.readFile(fullPath, 'utf8');
          const lines = content.split('\n');
          const title = lines[0]?.replace(/^#\s+/, '').trim() || entry.name;
          
          if (title.toLowerCase().includes(queryLower) || entry.name.toLowerCase().includes(queryLower) || content.toLowerCase().includes(queryLower)) {
            // extract short summary (first non-empty paragraph)
            let summary = '';
            for (let i = 1; i < Math.min(lines.length, 30); i++) {
              const l = lines[i].trim();
              if (l && !l.startsWith('#') && !l.startsWith('>') && !l.startsWith('!') && !l.startsWith('---')) {
                summary = l;
                break;
              }
            }
            results.push({
              title,
              relPath,
              summary: summary.substring(0, 160) + (summary.length > 160 ? '...' : ''),
              fullPath
            });
          }
        } catch (e) {}
      }
    }
  }
  
  await searchDir(REFERENCES_DIR);
  return results.slice(0, 10);
}

// Retrieve full text of a reference file
export async function getKnowledgeDoc(relDocPath) {
  const target = path.resolve(REFERENCES_DIR, relDocPath);
  if (!target.startsWith(REFERENCES_DIR)) {
    throw new Error('Access denied: Invalid document path');
  }
  if (!fs.existsSync(target)) {
    throw new Error(`Document not found: ${relDocPath}`);
  }
  return await fs.promises.readFile(target, 'utf8');
}
