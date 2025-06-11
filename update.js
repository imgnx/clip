#!/usr/bin/env node

import { cyan, red, green } from "chalk";
import { inspect } from "eyes";

// List of escape sequences/sub-commands that should collect args until a terminator (e.g., ";")
const escapeSequences = ["exec"];
const escapeTerminator = [";", "\\;"];

const rawArgs = process.argv.slice(2);

function printHelp() {
  console.log(
    cyan(`Usage: main.sh <command> <path> [options]\n
Options:
  -key value         Set a key to a value
  -key=value         Set a key to a value
  -flag              Boolean flag
  -exec ... ;        Special escape sequence, collects args until ';' or '\\;'
  -h, --help         Show this help message
`)
  );
}

function normalizeKey(flag) {
  return flag.replace(/^-+/, "").replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function parseValue(val) {
  if (val === "true") return true;
  if (val === "false") return false;
  const num = Number(val);
  return isNaN(num) ? val : num;
}

function parseArgs(args) {
  const result = {};
  let i = 0;
  while (i < args.length) {
    const arg = args[i];

    // Help flag
    if (arg === "-h" || arg === "--help") {
      printHelp();
      process.exit(0);
    }

    // First is the command
    if (!result.command) {
      result.command = arg;
      i++;
      continue;
    }

    // First non-flag after command is path
    if (!result.path && !arg.startsWith("-")) {
      result.path = arg;
      i++;
      continue;
    }

    // Normalize -key=value or --key=value
    if (arg.startsWith("-") && arg.includes("=")) {
      const [rawKey, value] = arg.split(/=(.+)/);
      const key = normalizeKey(rawKey);
      result[key] = parseValue(value);
      i++;
      continue;
    }

    // -key <value> pattern or escape sequence
    if (arg.startsWith("-")) {
      const key = normalizeKey(arg);
      const next = args[i + 1];

      // Handle escape sequences (e.g., exec)
      if (escapeSequences.includes(key)) {
        let parts = [];
        i++;
        while (i < args.length && !escapeTerminator.includes(args[i])) {
          parts.push(args[i]);
          i++;
        }
        result[key] = parts.join(" ");
        i++; // skip the terminating ; or \\;
        continue;
      }

      // -key <value>
      if (next && !next.startsWith("-")) {
        result[key] = parseValue(next);
        i += 2;
      } else {
        result[key] = true; // treat as boolean flag
        i++;
      }
      continue;
    }

    // fallback positional (not path, not a flag)
    i++;
  }
  return result;
}

// Main execution
if (rawArgs.length === 0) {
  printHelp();
  process.exit(1);
}

const result = parseArgs(rawArgs);

if (!result.command) {
  console.error(red("Error: No command provided."));
  printHelp();
  process.exit(1);
}

inspect(result);

console.log(green(JSON.stringify(result, null, 2)));
