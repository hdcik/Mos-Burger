# Copilot Instructions for Mos Burger Project

## Project Overview
- This is a web-based application for managing a burger restaurant's products, orders, customers, and related details.
- The project is organized with separate HTML and JS files for each major entity (e.g., `product__details.html`/`.js`, `order__details.html`/`.js`).
- All HTML files are located in `Html File/`. JavaScript files are in the project root or `JS File/` (if used).

## Key Patterns & Conventions
- Each HTML file is paired with a similarly named JS file for logic (e.g., `product__details.html` and `product__details.js`).
- UI logic is handled via direct DOM manipulation and inline event handlers (e.g., `onclick="placeCheckout()"`).
- Naming uses double underscores for multi-word file names (e.g., `order__details.js`).
- Customer, order, and product data are managed on the client side; no backend integration is present in this codebase.
- CSS is not included in this repo; external stylesheets (e.g., Font Awesome) are loaded via CDN.

## Developer Workflows
- No build system or package manager is present; development is done by editing HTML and JS files directly.
- To test changes, open the relevant HTML file in a browser (e.g., `Html File/product__details.html`).
- There are no automated tests or scripts; manual testing is required.

## Integration Points
- All logic is client-side JavaScript. No API calls or server communication are present.
- External dependencies are loaded via CDN in HTML `<head>` sections.

## Examples
- To add a new feature for products, update both `product__details.html` and `product__details.js`.
- To wire up a new button, use an `onclick` attribute in HTML and define the function in the corresponding JS file.

## Special Notes
- The project uses some non-standard HTML (e.g., `<dir>` instead of `<div>`). Maintain compatibility with existing markup.
- Keep file naming consistent with the current double-underscore pattern.

---

For questions or unclear conventions, review existing HTML/JS pairs for examples. If adding new entities, follow the established file and naming structure.
