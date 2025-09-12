# Terminal CV

My resume reimagined as a concept I spent most of my time in - terminal :)
I'm not a CSS expert, so credit goes to Claude Code for a lot of the heavy lifting.

## The Concept

I envisioned a digital resume which is
- reminiscent of the command line
- is contextually aware on desktop, mobile, and print
- has a tiny footprint—pure HTML and CSS
- no JavaScript

## Usage

Visit: https://parasdsingh.github.io/

To print or save as PDF, use the print button or browser's print function.

## Features

- Terminal command aesthetics (`whoami`, `ls -l`, etc.)
- Dark/light theme toggle
- Mobile-responsive layout
- A4-optimized printing with color detection
- Pure CSS navigation using `:target` selectors

## Development

Static site deployable to any web server. Main files:
- `index.html` - CV content and structure
- `styles.css` - All styling and responsive behavior
- `.stylelintrc.json` - StyleLint configuration

### Code Quality & Validation

The codebase is validated using standard tools:

```bash
# HTML validation
npx htmlhint index.html

# Code formatting
npx prettier --check index.html styles.css
npx prettier --write index.html styles.css

# CSS validation
npx stylelint styles.css
```

Built with vanilla web technologies for maximum compatibility and performance.
