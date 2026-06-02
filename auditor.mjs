import fs from 'fs';
import path from 'path';

// Helper to recursively walk a directory and list source files
export async function getFiles(dir, excludeDirs = ['node_modules', '.git', '.codegraph', 'dist', 'build', 'out']) {
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

// DRY duplicate detector
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
        let originalText = line;
        
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
  for (const [hash, occurrences] of blockHashes.entries()) {
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
      instances
    });
  }
  
  extendedDuplicates.sort((a, b) => b.linesCount - a.linesCount);
  return extendedDuplicates;
}

// SOLID principles and Code Smells compliance checker
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
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        
        // Imports check
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
            if (classLength > 300) {
              violations.push({
                file: relativePath,
                line: classStartLine,
                type: 'SRP',
                severity: 'warning',
                rule: 'Large Class',
                description: `Class '${className}' is too large (${classLength} lines). Large classes often violate the Single Responsibility Principle.`,
                remedy: 'Refactor this class by splitting it into smaller, focused classes or extracting specific responsibilities.'
              });
            }
            if (classMethodCount > 15) {
              violations.push({
                file: relativePath,
                line: classStartLine,
                type: 'ISP',
                severity: 'info',
                rule: 'Too Many Class Methods',
                description: `Class '${className}' defines ${classMethodCount} methods, which may violate Interface Segregation or Single Responsibility.`,
                remedy: 'Divide the interface into smaller, more specific interfaces or separate implementation duties.'
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
              if (params.length > 4) {
                violations.push({
                  file: relativePath,
                  line: i + 1,
                  type: 'Code Smell',
                  severity: 'warning',
                  rule: 'Too Many Parameters',
                  description: `Function '${methodName}' has ${params.length} parameters, making it hard to maintain and test.`,
                  remedy: 'Introduce a parameter object or config struct to encapsulate these arguments.'
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
            if (methodLinesCount > 50) {
              violations.push({
                file: relativePath,
                line: methodStartLine,
                type: 'SRP',
                severity: 'warning',
                rule: 'Long Method',
                description: `Method '${methodName}' is too long (${methodLinesCount} logical lines). Long methods indicate multiple responsibilities.`,
                remedy: 'Extract logical sub-sections of this method into smaller helper functions.'
              });
            }
            insideMethod = false;
          }
        }
        
        // OCP Check: Switch statements / kind checks inside classes
        if (trimmed.startsWith('switch ') || (trimmed.startsWith('if ') && (trimmed.includes('=== "') || trimmed.includes('== "') || trimmed.includes('.type ===') || trimmed.includes('.kind ===')))) {
          if (insideClass && (trimmed.startsWith('switch') || trimmed.includes('.type') || trimmed.includes('.kind'))) {
            violations.push({
              file: relativePath,
              line: i + 1,
              type: 'OCP',
              severity: 'info',
              rule: 'Type Checking Violation',
              description: `Type or kind checking detected in class method. Modifying type ranges will require editing this block, violating Open/Closed Principle.`,
              remedy: 'Use polymorphism, factory pattern, or strategy pattern to decouple behavior from type values.'
            });
          }
        }
        
        // DIP Check: hardcoded instantiation of complex objects
        if (insideClass && trimmed.includes('new ') && !trimmed.includes('new Date') && !trimmed.includes('new Error') && !trimmed.includes('new Promise') && !trimmed.includes('new Map') && !trimmed.includes('new Set') && !trimmed.includes('new RegExp')) {
          const newMatch = trimmed.match(/new\s+(\w+)/);
          if (newMatch) {
            violations.push({
              file: relativePath,
              line: i + 1,
              type: 'DIP',
              severity: 'warning',
              rule: 'Hardcoded Dependency Injection',
              description: `Hardcoded instantiation of class '${newMatch[1]}' inside class '${className}'. This violates the Dependency Inversion Principle.`,
              remedy: `Inject '${newMatch[1]}' (or its interface abstraction) via constructor or factory injection.`
            });
          }
        }
      }
      
      if (fileImports.length > 15) {
        violations.push({
          file: relativePath,
          line: 1,
          type: 'Code Smell',
          severity: 'warning',
          rule: 'High Coupling',
          description: `File has too many imports (${fileImports.length}). High coupling makes the code fragile and harder to test.`,
          remedy: 'Split the file or group related imports/responsibilities to decouple dependencies.'
        });
      }
      
    } catch (e) {
      // ignore
    }
  }
  
  return violations;
}
