---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:

**Purpose**: What problem does this interface solve? Who uses it?

**Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.

**Constraints**: Technical requirements (framework, performance, accessibility).

**Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

CRITICAL: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:

- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:

**Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.

Examples of distinctive fonts: `Outfit`, `DM Sans`, `Fraunces`, `Instrument Sans`, `Syne`, `Questrial`, `Archivo`, `Plus Jakarta Sans`, `Manrope`, `Lexend`, `Work Sans`, `Raleway`.

**Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.

**Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.

**Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.

**Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

**NEVER use generic AI-generated aesthetics** like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

IMPORTANT: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

## Aesthetic Direction Options

Choose one and execute with full commitment:

- **Brutally minimal** — Monochrome palette, severe spacing, stark typography, no decoration
- **Maximalist chaos** — Dense layers, overlapping elements, vibrant color clashes, bold patterns
- **Retro-futuristic** — Neon gradients, chrome effects, geometric shapes, 80s/90s nostalgia
- **Organic/natural** — Earthy tones, flowing shapes, soft textures, nature-inspired
- **Luxury refined** — Elegant serifs, generous whitespace, muted gold accents, sophisticated
- **Editorial/magazine** — Large typography, asymmetric grids, bold headlines, photo-driven
- **Brutalist/raw** — Exposed structure, harsh shadows, concrete textures, intentionally rough
- **Art deco/geometric** — Sharp angles, metallic accents, symmetry, ornamental details
- **Soft/pastel** — Gentle curves, light gradients, calming palette, friendly
- **Industrial/utilitarian** — Monospace fonts, grid systems, functional aesthetic, tool-like

## Anti-Pattern Checklist

Before shipping, verify you've avoided these AI clichés:

- [ ] Not using Inter/Roboto/Arial/system-ui
- [ ] No purple gradient hero on white background
- [ ] Layout isn't symmetrical centered boxes
- [ ] Color palette has clear dominance (not equal distribution)
- [ ] Motion serves a purpose (not random decoration)
- [ ] At least one unexpected layout choice
- [ ] Typography has personality and character
- [ ] Background isn't plain solid color

## Implementation Standards

1. **Match complexity to vision**
   - Maximalist → elaborate code, extensive effects
   - Minimalist → restraint, precision, subtle details

2. **Production-grade quality**
   - Semantic HTML
   - Accessible (ARIA labels, focus states, keyboard navigation)
   - Responsive (mobile-first or desktop-first with clear intent)
   - Performance-conscious (CSS animations > JavaScript)

3. **Cohesive execution**
   - Every detail supports the chosen aesthetic
   - No mixed visual languages
   - Consistent spacing rhythm

## Examples

### Login Page

❌ **Generic**: White centered card, blue button, Inter font
✅ **Distinctive**: Split-screen with dark illustrated hero (gradient background, floating accents), Outfit font, staggered form entrance animation

### Dashboard

❌ **Generic**: White background, equal-height stat cards in a row, default colors
✅ **Distinctive**: Asymmetric stat cards with diagonal accent shapes, custom themed icons, personalized greeting, page entrance animation

### 404 Page

❌ **Generic**: "404" centered text, small message, blue link
✅ **Distinctive**: Giant gradient-filled "404" typography (background-clip: text), empathetic copy, animated scale-in entrance

### Navigation

❌ **Generic**: Horizontal navbar, centered logo, even spacing
✅ **Distinctive**: Backdrop-blur header with semi-transparent background, smooth collapse transitions, grouped navigation with role-based visibility

## Usage Pattern

When the user requests frontend work:

1. **Analyze context**: What is this for? Who will use it? What should they feel?
2. **Choose aesthetic**: Pick ONE direction from the list above (or create a new one that fits)
3. **Define signature**: What's the ONE unforgettable visual element?
4. **Select typography**: Pick 1-2 distinctive fonts from Google Fonts
5. **Design color strategy**: Choose dominant color + 1-2 accents
6. **Plan key animation**: What's the main motion moment?
7. **Implement with precision**: Write production-ready code that executes the vision

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.
