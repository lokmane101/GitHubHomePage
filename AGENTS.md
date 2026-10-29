# Portfolio working agreements

## Architecture and scope

This is a buildless HTML/CSS/JavaScript portfolio. `index.html` contains content and semantic markup, `css/style.css` owns the visual system and responsive rules, and `js/main.js` progressively enhances navigation. `js/diagram-viewer.js` and its scoped stylesheet add a native dialog with fit/actual-size inspection; preserve direct image links as the fallback. Assets and local fonts live in `img/`, `fonts/` and `CV/`. There is no npm build, React, Next.js, Tailwind or shadcn dependency. Keep this architecture unless a user request needs a migration.

Keep agent configuration changes in this repository. Preserve unrelated working-tree changes. Before replacing an asset, inspect the existing file and check for a newer user-supplied version. Ask the user for missing brand assets when needed; do not invent logos. Ground experience, dates, metrics and certification status in the supplied resume or user instructions. The current resume is `CV/Lokmane_akkouh_cv.pdf`; the portrait is `img/PROFIL_new.png`.

## Design and skill routing

- Read the existing page and CSS tokens before substantial visual changes. Plan and critique a coherent palette, typography and composition before implementation. The current direction uses forest ink and celadon paper, local General Sans/Satoshi and the supplied portrait. Avoid dazzling white experience cards. The user requested removal of the temporary design worksheet; do not recreate it unless asked.
- Use the existing personal `distinctive-design` skill for art direction and `ui-ux-pro-max` for targeted design intelligence. `frontend-design` currently repeats the same design guidance; avoid installing a duplicate. If working on another machine where personal skills are absent, use the current CSS tokens and explain the missing resource.
- Use `.agents/skills/web-design-guidelines/SKILL.md` for a web UX/accessibility review of changed UI files, fetching the linked current guidelines. Keep the portfolio's deliberate sentence case and first-person biography when generic copy guidance conflicts with its purpose.
- Use `.agents/skills/webapp-testing/SKILL.md` for browser verification. In Codex desktop, use the available CUA browser tools for browser actions and inspection. The upstream Python Playwright examples are an alternative only in environments where that execution method is permitted and installed; do not install a second browser just to follow an example. The local helper's `--help` is checked, but Python Playwright is not installed on the current host.
- Apply the existing personal `vercel-react-best-practices` only if React/Next.js is actually introduced. shadcn and composition-patterns are not needed for the current site.

## Implementation and verification

Use semantic native controls, meaningful link labels, visible keyboard focus and reserved image dimensions. Preserve usable links and disclosures without JavaScript. Respect reduced motion and keep mobile navigation state, keyboard focus and body scroll consistent. Reuse local fonts and icons rather than introducing external CDNs. Keep supplied PNG/company logos transparent: no extra tiles/backgrounds, image generation, recoloring or recreated marks. Place dark wordmarks on a suitably light section surface. Existing monochrome SVG technology icons may take the section's ink tone through CSS. The portrait's social reveal must remain available to hover, keyboard focus and touch users.

The user wants the original project diagrams reformatted with AI assistance, preserving their tools, recognizable icons, stages and data-flow relationships. The selected 3:2 layout adaptations live in `img/projects/`; originals remain in `img/`. Do not replace technical diagrams with concept illustrations or decorative objects. Keep complete diagrams at their natural proportions, give them enough display width for labels, and retain one full-size link per diagram. The user removed original-image links from the page; keep source references, prompts and targeted corrections in `docs/project-visuals.md`. Do not call these architecture illustrations application screenshots or evidence of project results.

The user removed the experience KPI rows and the employer-name strip below the hero. Do not reintroduce them unless asked; keep factual engineering contributions in the experience disclosures.

Use the executables returned by `load_workspace_dependencies` when system Python/Node is unavailable. From the repository root:

- Run `node --check js/main.js` and `node --check js/diagram-viewer.js` after JavaScript changes.
- Run `python scripts/check_site.py` to check exact asset casing, local links, anchors, duplicate IDs, image dimensions and font references. This script uses only the Python standard library.
- Preview with `python -m http.server 4174 --bind 127.0.0.1`, using a retained session. Reuse an existing project server. Local sockets may require native sandbox approval.
- After substantial UI changes, inspect desktop and phone layouts, including 375px and tablet widths. Check overflow, loaded images, keyboard focus, mobile menu open/close/Escape, anchor navigation, resume links and the project disclosure. Respect the browser tool's allowed inspection surface; reset temporary viewport overrides.
- Report checks that could not run. Do not claim automated accessibility conformance or a standalone Playwright suite from visual checks alone. No npm test/build/lint command currently exists.

Skills under `.agents/skills/` are repository-scoped and should be available on the next turn; do not duplicate them into a global skills folder. Keep test screenshots and temporary runtimes outside the published website. Deployment and pushes require the user's task to include them.
