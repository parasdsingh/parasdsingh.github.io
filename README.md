# Terminal CV

A terminal-themed CV website for Parasdeep Singh, DevOps Engineer. Built with assistance from Claude Code.

## Technology Stack

- Pure HTML and CSS
- No JavaScript frameworks or dependencies
- Responsive design with CSS Grid and Flexbox
- Print-optimized styles

## Features

- Terminal command aesthetics (`whoami`, `ls -l`, etc.)
- Dark/light theme toggle
- Mobile-responsive layout
- A4-optimized printing with color detection
- Pure CSS navigation using `:target` selectors

## Usage

Visit: https://parasdsingh.github.io/

To print or save as PDF, use the print button or browser's print function.

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

**Validation Status:**
- HTML: Valid HTML5 with proper semantics (HTMLHint)
- CSS: CSS3 with custom properties and grid layout (StyleLint) 
- Formatting: Prettier-formatted for consistency
- Accessibility: Proper ARIA labels and semantic markup

Built with vanilla web technologies for maximum compatibility and performance.