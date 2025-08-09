/**
 * Interactive DOM Tutorial Application
 *
 * This application provides an interactive learning environment for DOM manipulation
 * with real-time code execution and visual DOM tree representation.
 */

// ==================== CONSTANTS AND CONFIGURATION ====================

const CONFIG = {
  EDITOR_THEME: 'monokai',
  DEFAULT_WIDTH: 400,
  DEFAULT_HEIGHT: 300,
  FORCE_SIMULATION: {
    LINK_DISTANCE: {
      ELEMENT: 120,
      DOCUMENT: 120,
      DEFAULT: 80,
    },
    LINK_STRENGTH: 1.0,
    CHARGE_STRENGTH: -500,
    Y_FORCE_STRENGTH: 0.1,
  },
  NODE_RADIUS: {
    DOCUMENT: 22,
    ELEMENT: 18,
    DEFAULT: 14,
  },
};

// Map to store the default code for every editor (customizable per editor)
const defaultEditorCodeMap = new Map([
  [
    'introduction1',
    `<!-- Introduction Example: Basic DOM Manipulation -->
<!DOCTYPE html>
<html>
  <body>
    <h2>My First Page</h2>
    <p id="demo">Original content here</p>
    <script>
      document.getElementById('demo').innerHTML = 'Hello World!';
    </script>
  </body>
</html>`,
  ],
  [
    'methods1',
    `<!-- Methods Example: getElementById & innerHTML -->
<!DOCTYPE html>
<html>
  <body>
    <h2>DOM Methods Example</h2>
    <p id="output">Original content</p>
    <button onclick="changeContent()">Change Content</button>
    <script>
      function changeContent() {
        document.getElementById('output').innerHTML = 'Content changed using DOM methods!';
      }
    </script>
  </body>
</html>`,
  ],
  [
    'document1',
    `<!-- Document Object Example: Find, Change, Add Elements -->
<!DOCTYPE html>
<html>
  <body>
    <h2>Document Object Demo</h2>
    <p id="info">This paragraph will be changed using <code>document</code> methods.</p>
    <button onclick="changeText()">Change Text</button>
    <button onclick="addElement()">Add Element</button>
    <button onclick="changeStyle()">Change Style</button>
    <ul id="myList">
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
    <script>
      // Find and change content
      function changeText() {
        document.getElementById('info').innerHTML = 'Paragraph changed!';
      }
      // Add a new list item
      function addElement() {
        var li = document.createElement('li');
        li.textContent = 'New Item';
        document.getElementById('myList').appendChild(li);
      }
      // Change style
      function changeStyle() {
        document.getElementById('info').style.color = '#e17055';
        document.getElementById('info').style.fontWeight = 'bold';
      }
    </script>
  </body>
</html>`,
  ],
  [
    'elements1',
    `<!-- DOM Elements Example: Finding Elements by ID -->
<!DOCTYPE html>
<html>
  <body>
    <h2>JavaScript HTML DOM</h2>
    <p id="intro">Finding HTML Elements by Id</p>
    <p>This example demonstrates the <b>getElementById</b> method.</p>
    <p id="demo"></p>
    <script>
      const element = document.getElementById("intro");
      document.getElementById("demo").innerHTML = 
        "The text from the intro paragraph is: " + element.innerHTML;
    </script>
  </body>
</html>`,
  ],
  [
    'elements2',
    `<!-- DOM Elements Example: Finding Elements by Tag Name -->
<!DOCTYPE html>
<html>
  <body>
    <h2>JavaScript HTML DOM</h2>
    <p>Finding HTML Elements by Tag Name.</p>
    <p>This example demonstrates the <b>getElementsByTagName</b> method.</p>
    <p id="demo"></p>
    <script>
      const element = document.getElementsByTagName("p");
      document.getElementById("demo").innerHTML = 'The text in first paragraph (index 0) is: ' + element[0].innerHTML;
    </script>
  </body>
</html>`,
  ],
  [
    'elements3',
    `<!-- DOM Elements Example: Finding Elements by Tag Name (within element) -->
<!DOCTYPE html>
<html>
  <body>
    <h2>JavaScript HTML DOM</h2>
    <div id="main">
      <p>Finding HTML Elements by Tag Name</p>
      <p>This example demonstrates the <b>getElementsByTagName</b> method.</p>
    </div>
    <p id="demo"></p>
    <script>
      const x = document.getElementById("main");
      const y = x.getElementsByTagName("p");
      document.getElementById("demo").innerHTML = 
        'The first paragraph (index 0) inside "main" is: ' + y[0].innerHTML;
    </script>
  </body>
</html>`,
  ],
  [
    'elements4',
    `<!-- DOM Elements Example: Finding Elements by Class Name -->
<!DOCTYPE html>
<html>
  <body>
    <h2>JavaScript HTML DOM</h2>
    <p>Finding HTML Elements by Class Name.</p>
    <p class="intro">Hello World!</p>
    <p class="intro">This example demonstrates the <b>getElementsByClassName</b> method.</p>
    <p id="demo"></p>
    <script>
      const x = document.getElementsByClassName("intro");
      document.getElementById("demo").innerHTML = 
        'The first paragraph (index 0) with class="intro" is: ' + x[0].innerHTML;
    </script>
  </body>
</html>`,
  ],
]);

// ==================== MAIN APPLICATION CLASS ====================

/**
 * Main application class that manages multiple code editors and their DOM visualizations
 */
class DOMTutorialApp {
  constructor() {
    this.editors = new Map();
    this.previewAreas = new Map();
    this.domTrees = new Map();
    this.simulations = new Map();
  }

  /**
   * Initialize the entire application
   */
  initialize() {
    try {
      console.log('Setting up existing editors...');
      this.setupExistingEditors();
      console.log('Setting up UI events...');
      this.setupUIEvents();
      console.log('Application initialized successfully!');
    } catch (error) {
      console.error('Error initializing application:', error);
    }
  }

  /**
   * Set up editors that already exist in the HTML
   */
  setupExistingEditors() {
    const editorElements = document.querySelectorAll(
      '.jsEditor[data-editor-id]'
    );
    editorElements.forEach((el) => {
      const editorId = el.getAttribute('data-editor-id');
      console.log(`Initializing editor: ${editorId}`);
      this.initializeEditor(editorId);
    });
  }

  /**
   * Initialize a single editor group with its preview area and DOM tree
   * @param {string} editorId - Unique identifier for the editor
   * @returns {CodeMirror|null} - The created editor instance or null if failed
   */
  initializeEditor(editorId) {
    const elements = this.findEditorElements(editorId);
    if (!elements.isValid) return null;

    const editor = this.createCodeMirrorInstance(elements.editorElement);
    this.storeEditorReferences(editorId, editor, elements);
    this.setupEditorEvents(editorId, elements.runButton);

    // Auto-run initial code after a brief delay to ensure DOM is ready
    setTimeout(() => this.executeCode(editorId), 100);

    return editor;
  }

  /**
   * Find all required DOM elements for an editor
   * @param {string} editorId - The editor identifier
   * @returns {Object} - Object containing element references and validity flag
   */
  findEditorElements(editorId) {
    const editorElement = document.querySelector(
      `.jsEditor[data-editor-id="${editorId}"]`
    );
    const previewArea = document.querySelector(
      `.previewArea[data-editor-id="${editorId}"]`
    );
    const treeElement = document.querySelector(
      `.domTree[data-editor-id="${editorId}"]`
    );
    const runButton =
      editorElement?.parentElement?.querySelector('.run-button');

    return {
      editorElement,
      previewArea,
      treeElement,
      runButton,
      isValid: !!(editorElement && previewArea && treeElement),
    };
  }

  /**
   * Create a CodeMirror editor instance with standard configuration
   * @param {HTMLElement} editorElement - The DOM element to attach the editor to
   * @returns {CodeMirror} - The created editor instance
   */
  createCodeMirrorInstance(editorElement) {
    console.log('Creating CodeMirror instance for:', editorElement);

    // Use the editor's data-editor-id to get the correct default code
    const editorId = editorElement.getAttribute('data-editor-id');
    let defaultCode = defaultEditorCodeMap.get(editorId) || '';

    const editor = CodeMirror(editorElement, {
      mode: 'htmlmixed',
      theme: CONFIG.EDITOR_THEME,
      lineNumbers: true,
      autoCloseBrackets: true,
      matchBrackets: true,
      styleActiveLine: true,
      cursorBlinkRate: 530,
      tabSize: 2,
      value: defaultCode,
    });

    console.log('CodeMirror instance created:', editor);
    return editor;
  }

  /**
   * Store references to editor components
   * @param {string} editorId - The editor identifier
   * @param {CodeMirror} editor - The editor instance
   * @param {Object} elements - Object containing element references
   */
  storeEditorReferences(editorId, editor, elements) {
    this.editors.set(editorId, editor);
    this.previewAreas.set(editorId, elements.previewArea);
    this.domTrees.set(editorId, elements.treeElement);
  }

  /**
   * Set up event listeners for an editor
   * @param {string} editorId - The editor identifier
   * @param {HTMLElement} runButton - The run button element
   */
  setupEditorEvents(editorId, runButton) {
    if (runButton) {
      runButton.addEventListener('click', () => this.executeCode(editorId));
    }
  }

  /**
   * Execute code from a specific editor and update its visualization
   * @param {string} editorId - The editor identifier
   */
  executeCode(editorId) {
    const editor = this.editors.get(editorId);
    const previewArea = this.previewAreas.get(editorId);
    const treeElement = this.domTrees.get(editorId);

    if (!editor || !previewArea || !treeElement) return;

    try {
      const code = editor.getValue();
      // Create an isolated iframe for true browser-like behavior
      this.createIsolatedPreview(previewArea, code);

      // Update DOM tree visualization after a brief delay to allow iframe to load
      setTimeout(() => {
        const graphData = this.createDOMGraphDataFromIframe(previewArea);
        if (graphData.nodes.length > 1) {
          this.renderDOMVisualization(editorId, graphData);
        }
      }, 100);
    } catch (error) {
      previewArea.innerHTML = `<div style="color: #ff5555; padding: 1rem;">
        <strong>Error:</strong> ${error.message}
      </div>`;
    }
  }

  /**
   * Create an isolated iframe-based preview that acts like a mini-browser
   * @param {HTMLElement} previewArea - The preview container
   * @param {string} code - The HTML/JS code to execute
   */
  createIsolatedPreview(previewArea, code) {
    // Clear previous content
    previewArea.innerHTML = '';

    // Create iframe for isolated execution
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '4px';
    iframe.style.background = '#fff';
    iframe.sandbox = 'allow-scripts allow-same-origin';

    previewArea.appendChild(iframe);

    // Wait for iframe to load then inject code
    iframe.onload = () => {
      try {
        const iframeDoc =
          iframe.contentDocument || iframe.contentWindow.document;

        // Write complete HTML document
        iframeDoc.open();
        iframeDoc.write(code);
        iframeDoc.close();
      } catch (error) {
        console.error('Error injecting code into iframe:', error);
        previewArea.innerHTML = `<div style="color: #ff5555; padding: 1rem;">
          <strong>Preview Error:</strong> ${error.message}
        </div>`;
      }
    };

    // Initialize empty iframe
    iframe.src = 'about:blank';
  }

  /**
   * Create graph data from iframe content
   * @param {HTMLElement} previewArea - The preview container
   * @returns {Object} - Graph data with nodes and links
   */
  createDOMGraphDataFromIframe(previewArea) {
    const iframe = previewArea.querySelector('iframe');
    if (!iframe) {
      return { nodes: [], links: [] };
    }

    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      // Create a cleaner DOM representation focusing on user content
      return this.createCleanDOMGraphData(iframeDoc);
    } catch (error) {
      console.error('Error accessing iframe content for DOM tree:', error);
      return { nodes: [], links: [] };
    }
  }

  /**
   * Create a clean DOM graph that focuses on user content only
   * @param {Document} iframeDoc - The iframe document
   * @returns {Object} - Graph data with nodes and links
   */
  createCleanDOMGraphData(iframeDoc) {
    const nodes = [];
    const links = [];
    let counter = 0;

    // Create root document node
    const docNode = { id: counter++, name: 'Document', type: 'document' };
    nodes.push(docNode);

    // Create html node
    const htmlNode = { id: counter++, name: 'html', type: 'element' };
    nodes.push(htmlNode);
    links.push({ source: docNode.id, target: htmlNode.id });

    // Get the head and body from iframe
    const head = iframeDoc.head;
    const body = iframeDoc.body;

    /**
     * Recursively traverse DOM elements
     * @param {HTMLElement} element - Current element to process
     * @param {Object} parentNode - Parent node in the graph
     * @param {boolean} isHead - Whether this is head content (to filter auto-generated)
     */
    const traverse = (element, parentNode, isHead = false) => {
      if (!element) return;

      // Handle text nodes
      if (element.nodeType === Node.TEXT_NODE) {
        const text = element.textContent.trim();
        if (text) {
          const textNode = {
            id: counter++,
            name:
              text.length > 15 ? `"${text.substring(0, 15)}..."` : `"${text}"`,
            type: 'text',
          };
          nodes.push(textNode);
          links.push({ source: parentNode.id, target: textNode.id });
        }
        return;
      }

      // Skip <script> nodes
      if (
        element.nodeType === Node.ELEMENT_NODE &&
        element.nodeName.toLowerCase() === 'script'
      ) {
        return;
      }

      // Skip auto-generated elements in head
      if (isHead) {
        const tagName = element.nodeName.toLowerCase();
        // Only include user-added head elements, skip auto-generated ones
        if (
          tagName === 'meta' ||
          (tagName === 'title' && element.textContent === '')
        ) {
          return;
        }
      }

      // Element node
      const elementNode = {
        id: counter++,
        name: element.nodeName.toLowerCase(),
        type: 'element',
      };
      nodes.push(elementNode);
      links.push({ source: parentNode.id, target: elementNode.id });

      // Process attributes (but filter out some auto-generated ones)
      Array.from(element.attributes || []).forEach((attr) => {
        // Skip some auto-generated attributes
        if (
          attr.name === 'data-darkreader-mode' ||
          attr.name === 'data-darkreader-scheme'
        ) {
          return;
        }
        const attrNode = {
          id: counter++,
          name: `${attr.name}="${attr.value}"`,
          type: 'attribute',
        };
        nodes.push(attrNode);
        links.push({ source: elementNode.id, target: attrNode.id });
      });

      // Process child nodes
      Array.from(element.childNodes).forEach((child) => {
        traverse(child, elementNode, isHead);
      });
    };

    // Add head if it has user content
    if (head && head.children.length > 0) {
      const headNode = { id: counter++, name: 'head', type: 'element' };
      nodes.push(headNode);
      links.push({ source: htmlNode.id, target: headNode.id });

      Array.from(head.childNodes).forEach((child) => {
        traverse(child, headNode, true);
      });
    }

    // Add body and its content
    if (body) {
      const bodyNode = { id: counter++, name: 'body', type: 'element' };
      nodes.push(bodyNode);
      links.push({ source: htmlNode.id, target: bodyNode.id });

      Array.from(body.childNodes).forEach((child) => {
        traverse(child, bodyNode, false);
      });
    }

    return { nodes, links };
  }

  /**
   * Create graph data structure from DOM elements
   * @param {HTMLElement} rootElement - The root element to traverse
   * @returns {Object} - Graph data with nodes and links
   */
  createDOMGraphData(rootElement) {
    const nodes = [];
    const links = [];
    let counter = 0;

    // Create root document node
    const docNode = { id: counter++, name: 'Document', type: 'document' };
    nodes.push(docNode);

    /**
     * Recursively traverse DOM elements, including html/head/body
     * @param {HTMLElement} element - Current element to process
     * @param {Object} parentNode - Parent node in the graph
     */
    const traverse = (element, parentNode) => {
      if (!element) return;

      // Handle text nodes
      if (element.nodeType === Node.TEXT_NODE) {
        const text = element.textContent.trim();
        if (text) {
          const textNode = {
            id: counter++,
            name:
              text.length > 15 ? `"${text.substring(0, 15)}..."` : `"${text}"`,
            type: 'text',
          };
          nodes.push(textNode);
          links.push({ source: parentNode.id, target: textNode.id });
        }
        return;
      }

      // Skip <script> nodes
      if (
        element.nodeType === Node.ELEMENT_NODE &&
        element.nodeName.toLowerCase() === 'script'
      ) {
        return;
      }

      // Element node
      const elementNode = {
        id: counter++,
        name: element.nodeName.toLowerCase(),
        type: 'element',
      };
      nodes.push(elementNode);
      links.push({ source: parentNode.id, target: elementNode.id });

      // Process attributes
      Array.from(element.attributes || []).forEach((attr) => {
        const attrNode = {
          id: counter++,
          name: `${attr.name}="${attr.value}"`,
          type: 'attribute',
        };
        nodes.push(attrNode);
        links.push({ source: elementNode.id, target: attrNode.id });
      });

      // Process child nodes (including text nodes)
      Array.from(element.childNodes).forEach((child) => {
        traverse(child, elementNode);
      });
    };

    // Start traversal from the root element
    if (rootElement) {
      traverse(rootElement, docNode);
    }

    return { nodes, links };
  }

  /**
   * Render the DOM visualization using D3.js force simulation
   * @param {string} editorId - The editor identifier
   * @param {Object} graphData - Graph data with nodes and links
   */
  renderDOMVisualization(editorId, graphData) {
    const container = this.domTrees.get(editorId);
    if (!container) return;

    container.innerHTML = '';

    // Inline getContainerDimensions
    const rect = container.getBoundingClientRect();
    const width = Math.max(rect.width, CONFIG.DEFAULT_WIDTH);
    const height = Math.max(rect.height, CONFIG.DEFAULT_HEIGHT);

    // Calculate node depths for tree-like positioning
    const nodeDepths = new Map();
    const calculateDepth = (nodeId, depth = 0) => {
      if (nodeDepths.has(nodeId)) return;
      nodeDepths.set(nodeId, depth);

      graphData.links
        .filter(
          (link) =>
            link.source === nodeId ||
            (typeof link.source === 'object' && link.source.id === nodeId)
        )
        .forEach((link) => {
          const targetId =
            typeof link.target === 'object' ? link.target.id : link.target;
          calculateDepth(targetId, depth + 1);
        });
    };

    // Start from document node (should be id: 0)
    calculateDepth(0);

    // Assign target y positions based on depth
    graphData.nodes.forEach((node) => {
      const depth = nodeDepths.get(node.id) || 0;
      node.targetY = 60 + depth * 80; // 60px from top, 80px between levels
    });

    // Inline createSVGContainer
    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Inline createForceSimulation with tree-like positioning
    const simulation = d3
      .forceSimulation(graphData.nodes)
      .force(
        'link',
        d3
          .forceLink(graphData.links)
          .id((d) => d.id)
          .distance(60) // Shorter, more consistent distance
          .strength(0.8)
      )
      .force(
        'charge',
        d3.forceManyBody().strength(-300) // Reduced repulsion for tighter tree
      )
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force(
        'y',
        d3
          .forceY()
          .y((d) => d.targetY || height / 2)
          .strength(0.3) // Strong y-positioning to maintain layers
      )
      .force(
        'x',
        d3
          .forceX()
          .x(width / 2)
          .strength(0.05) // Weak x-centering to allow spreading
      )
      .force(
        'collision',
        d3.forceCollide().radius(25) // Prevent node overlap
      );

    this.simulations.set(editorId, simulation);

    // Explicitly render links
    const links = svg
      .append('g')
      .selectAll('line')
      .data(graphData.links)
      .join('line')
      .attr('class', 'link');

    // Explicitly render nodes
    const nodeGroups = svg
      .append('g')
      .selectAll('g')
      .data(graphData.nodes)
      .join('g');

    nodeGroups
      .append('circle')
      .attr('r', (d) => {
        const radii = CONFIG.NODE_RADIUS;
        return radii[(d.type || '').toUpperCase()] || radii.DEFAULT;
      })
      .attr('class', (d) => `node node-type-${d.type}`);

    nodeGroups
      .append('text')
      .text((d) => d.name)
      .attr('class', 'node-label');

    // Inline createDragBehavior
    const dragStarted = (event, d) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    };
    const dragged = (event, d) => {
      d.fx = event.x;
      d.fy = event.y;
    };
    const dragEnded = (event, d) => {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };
    nodeGroups.call(
      d3
        .drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded)
    );

    // Inline setupSimulationTick
    simulation.on('tick', () => {
      links
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      nodeGroups.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });
  }

  /**
   * Set up UI event handlers for the application
   */
  setupUIEvents() {
    this.setupHeaderToggle();
    this.setupSmoothScrolling();
    this.setupScrollAnimations();
    this.setupDarkModeToggle();
  }

  /**
   * Set up header toggle functionality
   */
  setupHeaderToggle() {
    const header = document.querySelector('header');
    const headerToggle = document.querySelector('.header-toggle');

    if (headerToggle && header) {
      headerToggle.addEventListener('click', () => {
        header.classList.toggle('collapsed');
        const mainElement = document.querySelector('main');
        if (mainElement) {
          mainElement.style.marginLeft = header.classList.contains('collapsed')
            ? '80px'
            : '280px';
        }
      });
    }
  }

  /**
   * Set up smooth scrolling for navigation links
   */
  setupSmoothScrolling() {
    document.querySelectorAll('nav a').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        e.target.blur();
        const targetElement = document.querySelector(this.getAttribute('href'));
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /**
   * Set up scroll animations and active link highlighting
   */
  setupScrollAnimations() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            navLinks.forEach((link) => {
              link.classList.toggle(
                'active',
                link.getAttribute('href') === `#${entry.target.id}`
              );
            });
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    sections.forEach((section, index) => {
      // Keep the first section visible, hide the rest
      if (index === 0) {
        section.classList.add('visible');
      } else {
        section.classList.remove('visible');
      }
      observer.observe(section);
    });
  }

  /**
   * Set up dark mode toggle functionality
   */
  setupDarkModeToggle() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    if (darkModeToggle) {
      // Default is dark theme, so show sun icon initially
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';

      darkModeToggle.addEventListener('click', () => {
        if (body.hasAttribute('data-theme')) {
          // Currently light theme, switch to dark theme (default)
          body.removeAttribute('data-theme');
          darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
          // Currently dark theme (default), switch to light theme
          body.setAttribute('data-theme', 'light');
          darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
      });
    }
  }
}

// ==================== APPLICATION INITIALIZATION ====================

// Create global app instance
const app = new DOMTutorialApp();

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded - Initializing app...');
  app.initialize();

  // Section visibility is now handled by setupScrollAnimations
  const sections = document.querySelectorAll('section');
  console.log('Found sections:', sections.length);
  sections.forEach((section, index) => {
    console.log(`Section ${index}: ${section.id}`);
  });
});

// Export for potential external use
window.DOMTutorialApp = DOMTutorialApp;
