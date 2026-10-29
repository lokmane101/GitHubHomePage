# Lokmane Akkouh — Portfolio

A static portfolio for data engineering experience, projects, skills and certifications. Built with HTML, CSS and JavaScript, local fonts and supplied assets. No package installation or build step is required.

[Published website](https://akkouhlokmane.netlify.app) (local edits are not deployed automatically).

## Local preview and checks

From the repository root, with Python 3 and Node.js:

```powershell
python -m http.server 4174 --bind 127.0.0.1
```

Open [the local preview](http://127.0.0.1:4174/). Stop the server with Ctrl+C. In another terminal:

```powershell
python scripts/check_site.py
node --check js/main.js
node --check js/diagram-viewer.js
git diff --check
```

If the Windows Python alias has no runtime, this host has a bundled Python:

```powershell
$portfolioPython = Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe'
& $portfolioPython scripts/check_site.py
& $portfolioPython -m http.server 4174 --bind 127.0.0.1
```

Within Codex, `load_workspace_dependencies` returns the current bundled Python and Node paths. The site checker needs only the Python standard library. There is no npm test, build or lint configuration.

## Content

- `index.html`: page content, navigation and native project disclosure.
- `css/style.css`: visual tokens, local fonts and responsive layouts.
- `js/main.js`: mobile menu, keyboard focus, current-section navigation and one-time viewport entrances. Content remains visible without JavaScript or animation support; focus, fragment navigation and reduced-motion preferences bypass entrances.
- `js/diagram-viewer.js` and `css/diagram-viewer.css`: progressive enhancement for the native diagram dialog, fit/actual-size modes, Escape and focus restoration. Direct image links still work without JavaScript.
- `img/`: original portrait, transparent logos, icons and project references.
- `img/projects/`: AI-assisted layout adaptations of the three original technical diagrams, preserving tools and flows. The page offers one full-size link per diagram; originals remain in the repository. See [provenance and prompts](docs/project-visuals.md).
- `CV/Lokmane_akkouh_cv.pdf`: current resume, in French.

Update the asset version query in the HTML when deploying changed CSS or JavaScript so returning visitors receive the new files. Keep the original image filenames and casing.

## Project agent setup

`AGENTS.md` contains working agreements specific to this static portfolio. The new skills are stored in `.agents/skills/`, the [documented repository discovery location](https://learn.chatgpt.com/docs/build-skills). They are available on the next Codex turn; if discovery remains stale, reopen the project.

| Resource | Source / state | Use here |
| --- | --- | --- |
| `web-design-guidelines` | [Vercel](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines), installed locally | Review web UX and accessibility |
| `webapp-testing` | [Anthropic](https://github.com/anthropics/skills/tree/main/skills/webapp-testing), installed locally with its helper and examples | Browser verification |
| `distinctive-design` | Existing personal skill | Art direction; already covers the current upstream frontend-design guidance |
| `ui-ux-pro-max` | Existing personal skill | Design references and local search |
| `vercel-react-best-practices` | Existing personal skill | Conditional on future React/Next.js work |

Sources were inspected on 29 October 2026; the two new local skills were installed from their `main` branches. Their upstream instructions are preserved. Desktop-specific tool routing is in `AGENTS.md`.

The installed testing helper's `--help` works with the bundled Python. Python Playwright is not installed on this host; browser checks use the available Codex CUA tools. The standalone Python Playwright examples have not been run. shadcn and Vercel composition patterns are omitted because the current site has no React component system. No additional global skills or global settings were changed for this project setup.
