# Interactive DOM Tutorial

An interactive web application for learning DOM manipulation with real-time code execution and visual DOM tree representation.

## Features

- **Multiple Code Editors**: Each section has its own isolated code editor with custom default code
- **Real-time Execution**: Code runs instantly with preview and DOM visualization
- **Force-Directed DOM Tree**: Beautiful D3.js visualization showing DOM structure
- **Interactive Elements**: Drag nodes, smooth scrolling, dark mode
- **Responsive Design**: Works on different screen sizes
- **Modular Structure**: Easy to copy and customize sections with different examples

## File Structure

```
tests/
├── dom_website.html    # Main HTML file with all sections
├── app.js             # Main application JavaScript
├── styles.css         # All styling and CSS
└── README.md          # This file
```

## Modular Section Structure

Each interactive demo section follows this modular pattern:

```html
<section id="section-name">
  <h2 class="section-title"><i class="fas fa-icon"></i> Section Title</h2>
  <p>Section description</p>

  <div class="code-playground interactive-demo">
    <div class="editor-sandbox-container">
      <div class="editor-container">
        <div class="jsEditor" data-editor-id="unique-id">
          <script type="text/template">
            // Your default JavaScript code here
            const html = `<!DOCTYPE html>...`;
            previewArea.innerHTML = html;
            // More JavaScript...
          </script>
        </div>
        <button class="run-button"><i class="fas fa-play"></i> Run Code</button>
      </div>
      <div class="visualization-container">
        <div class="sandbox">
          <div class="sandbox-content">
            <h3>Preview</h3>
            <div class="previewArea" data-editor-id="unique-id"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="domTree" data-editor-id="unique-id"></div>
  </div>
</section>
```

## Customizing Sections

To add or modify a section:

1. **Copy the modular structure** above
2. **Change the unique-id** to match your section (must be consistent across all `data-editor-id` attributes)
3. **Update the default code** inside the `<script type="text/template">` tag
4. **Modify title, icon, and description** as needed

## Usage

1. Open `dom_website.html` in a web browser
2. Navigate through different sections using the sidebar
3. Edit JavaScript code in any editor
4. Click "Run Code" to execute and see results
5. Observe the DOM tree visualization update in real-time

## Available Sections

- **Introduction**: Basic DOM manipulation
- **Methods**: Element selection methods
- **Document**: Working with the document object
- **Elements**: Creating and manipulating elements
- **HTML**: Dynamic HTML generation
- **CSS**: Styling with JavaScript
- **Animations**: CSS and JavaScript animations
- **Events**: Event handling
- **Listeners**: Advanced event management
- **Navigation**: DOM traversal
- **Nodes**: Working with different node types
- **Collections**: Element collections (HTMLCollection)
- **NodeLists**: Understanding NodeLists

## Dependencies

- **D3.js v7**: For force-directed graph visualization
- **CodeMirror 5.65.2**: For code editing functionality
- **Font Awesome 6**: For icons throughout the interface

## Browser Compatibility

- Modern browsers with ES6+ support
- Chrome 60+, Firefox 60+, Safari 12+, Edge 79+

## Development

The application uses a clean, modular architecture:

- **Static HTML sections**: All sections are defined in HTML, no dynamic generation
- **Template-based default code**: Each editor reads its default code from embedded `<script type="text/template">` tags
- **Event-driven updates**: Real-time DOM tree visualization updates as code executes
- **Copy-paste friendly**: Easy to duplicate and customize sections

## License

Educational use only.
