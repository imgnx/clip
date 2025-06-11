# C.L.I.P. — Command Line Interface Parser

Powered w/ 🥄 by @imgnxtion

$$
\begin{aligned}
\text{Runtime}_{\text{CLI}} &= \mathcal{O}(n + m \cdot \log k) + \sum_{i=1}^{f} \Bigg[\frac{d_i^2}{\sqrt{p_i + 1}} + \ln\left(\frac{v_i!}{(v_i - u_i)!}\right)\Bigg] \\\\
\text{where:} \quad
n &= \text{number of arguments}, \\
m &= \text{number of key-value pairs}, \\
k &= \text{distinct normalized keys}, \\
f &= \text{number of flags}, \\
d_i &= \text{depth of nesting in flag } i, \\
p_i &= \text{number of positional args before flag } i, \\
v_i &= \text{length of value assigned to flag } i, \\
u_i &= \text{number of underscores in that value}
\end{aligned}
$$

## Outline

<!-- prettier-ignore -->
This script is a Node.js CLI parser designed to handle command-line arguments with special handling for sub-commands and escape sequences. It allows for flexible argument parsing, including flags, commands,
and paths.

1. Shebang and Setup

Script is executable as a Node.js CLI.

2. Configuration

Defines escapeSequences (e.g., exec) and escapeTerminator (e.g., ;, \;) for special argument handling.

3. Argument Parsing Helpers

- `printHelp()`: Prints usage instructions and available options.

- `normalizeKey(flag)`: Converts flags like -my-flag to myFlag.

- `parseValue(val)`: Converts "true"/"false" to booleans, numeric strings to numbers, otherwise returns the
  string.

4. `parseArgs`: Main Argument Parser

<!-- prettier-ignore -->
Iterates through command-line arguments: If -h or --help is found, prints help and exits. The first argument is treated as the command. The first non-flag after the command is treated as the path. Handles flags in the form `-key=value` or `--key=value`. Handles flags in the form `-key value`. If the flag is in escapeSequences (like
`exec`), collects all following arguments until a terminator (`;` or `\;`), and stores them as a single string.

- Boolean flags (e.g., `-flag`) are set to `true`. Ignores any other positional arguments.

## Triage

### Includes:

- Error Handlers
- Cleanup
- Main execution

### Overview:

<!-- prettier-ignore -->
If no arguments are provided, prints help and exits with error. Parses arguments using `parseArgs`. If no command is found, prints an error and help, then exits. Prints the parsed result as formatted JSON. This script is a flexible CLI argument parser with special handling for sub-commands like `-exec` ... `;`, and is easy to extend for more escape sequences or options.
