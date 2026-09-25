# Godot Forge module style guide

Use this guide when creating or updating a tutorial module. It describes the visual conventions to follow across the landing page and module pages. The CSS files remain the source of the rendered styles; this guide records the intended shared design. Some existing modules predate these conventions and can be brought into line when they are next edited.

## Where styles live

| File | Responsibility |
| --- | --- |
| [`tutorial-web-app/theme.css`](tutorial-web-app/theme.css) and [`theme.js`](tutorial-web-app/theme.js) | Shared light palette, theme toggle, and saved light/dark preference. The server injects both into the landing page and module pages. |
| [`tutorial-web-app/styles.css`](tutorial-web-app/styles.css) | Landing page layout, navigation, cards, and base styles reused by overview modules. |
| [`tutorial-web-app/module-overview.css`](tutorial-web-app/module-overview.css) | Common layout for simple module overview pages. |
| [`tutorial-web-app/toast.css`](tutorial-web-app/toast.css) and [`module-reset.css`](tutorial-web-app/module-reset.css) | Shared notification and reset controls. |
| `<module>/styles.css` or another module CSS file | Styles specific to a lesson, editor, simulation, or game canvas. Character Creation also supplies base styles reused by Game Assets Creation, Boss Creation, and the quiz. |

Use the shared styles before a module stylesheet in the page's `<head>`. The server appends `theme.css` and `theme.js` to served pages, so do not add a second copy to a module's HTML. Scope module-specific selectors to the module wrapper or its distinct class names to avoid changing shared controls.

## Color and type

Use semantic CSS variables rather than repeating color literals throughout a page. These are the common roles and current dark-theme reference values; `theme.css` supplies their light-theme counterparts where applicable.

| Role | Variable | Dark reference |
| --- | --- | --- |
| Page background | `--bg` or `--paper` | `#101d18` |
| Surface | `--panel` or `--card` | `#182a22` |
| Main text | `--ink` | `#edf5e9` |
| Secondary text | `--muted` | `#9eb1a5` |
| Borders | `--line` | `#385246` |
| Primary accent | `--lime` or `--mint` | `#c4f265` |
| Secondary accent | `--violet` | `#9c8cff` |

Use the primary accent for progress, active states, and the main action; use violet for a secondary highlight. Reserve orange/red for warnings and destructive actions. Keep text and controls legible against both theme backgrounds. If a module needs extra colors for its game art, keep them inside the game surface and retain the shared page colors for surrounding UI.

Use **Space Grotesk** for page text and headings and **DM Mono** for chapter labels, eyebrow text, metadata, and compact controls, with sans-serif and monospace fallbacks. The current interactive modules include some system-font styles; use the shared font pairing when adding or substantially revising their surrounding UI. Keep one clear `h1` per page, followed by ordered `h2`/`h3` sections. Use short, readable text lines and avoid fixed heights for translated copy.

## Page structure

- Give every module a clear route back to the learning path, a chapter label, language controls, and the shared theme toggle in its header. `theme.js` mounts the toggle in the first `<header>` if the page does not already contain one.
- Keep lesson content in a centered container with responsive side padding. Use the established `.module-overview` layout for simple chapters; use a module-specific shell for interactive chapters.
- Separate introduction, learning goals, prompts, interactive practice, and completion into visible sections. Reuse the existing card treatment: a panel background, one-pixel `--line` border, consistent padding, and no decorative border radius unless the game artwork requires it.
- Keep labels and instructional text in the HTML, outside a canvas where practical, so learners can read, translate, and navigate them.

## Controls and states

Use a real `<button>` for actions and a real `<a>` for navigation. Buttons and form fields should inherit the page font, use the palette variables, and show distinct hover, keyboard-focus, selected, disabled, loading, and error states when relevant. Keep keyboard focus visible with a high-contrast outline. Give icon-only controls an accessible name. Use `aria-pressed` for toggle state and the shared toast component for brief action feedback. Use the shared reset control for module progress resets.

Do not encode meaning through color alone: include a label, icon, or status text for success, errors, and progress. Maintain readable contrast in both themes, including placeholders, borders, and text over game artwork.

## Responsive and motion behavior

Check narrow phone widths, tablet widths, and desktop. Let headers wrap; collapse multi-column learning and prompt grids to one column on small screens; avoid horizontal page scrolling. Keep controls large enough to tap and do not make translated strings depend on a fixed width. Preserve a usable size for the game canvas while allowing adjacent instructions and controls to reflow.

Respect `prefers-reduced-motion: reduce` for decorative animation and scrolling. Game motion may remain essential to a lesson, but instructions and controls must remain usable without animation.

## Review before finishing a module

1. Check the page in light and dark mode. The saved theme should carry across module navigation and reloads.
2. Check English, Simplified Chinese, and Malay for wrapping, clipped controls, and readable spacing.
3. Check desktop and narrow mobile layouts, including the module header, prompts, game area, and completion controls.
4. Navigate with a keyboard and confirm visible focus, sensible heading order, accessible control names, and status text.
5. Use an existing module page as a visual comparison for shared chrome, then keep any lesson-specific styling limited to the lesson itself.

For the theme behavior already covered by an automated browser check, run `npm run test:theme-browser` from `tutorial-web-app` when changing the shared theme files or module headers.
