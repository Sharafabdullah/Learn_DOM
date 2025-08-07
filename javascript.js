// Initialize CodeMirror editor
let jsEditor;
let previewArea;
let domTree;

function initializeEditor() {
  jsEditor = CodeMirror(document.getElementById('jsEditor'), {
    mode: 'javascript',
    theme: 'monokai',
    lineNumbers: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    tabSize: 2,
    value: `// Try this example:
const div = document.createElement('div');
div.textContent = 'Hello DOM!';
div.style.color = 'cyan';
previewArea.appendChild(div);

// Or create your own DOM elements!`,
  });

  previewArea = document.getElementById('previewArea');
  domTree = document.getElementById('domTree');
}

function updateDOMTree() {
  const treeContent = generateDOMTree(previewArea);
  domTree.innerHTML = '<h3>DOM Tree</h3>' + treeContent;
}

function generateDOMTree(element, depth = 0) {
  if (!element) return '';

  const indent = '  '.repeat(depth);
  let html = `<div class="node" style="margin-left: ${depth * 20}px">
    <span class="tag">${element.nodeName.toLowerCase()}</span>`;

  if (element.children.length) {
    Array.from(element.children).forEach((child) => {
      html += generateDOMTree(child, depth + 1);
    });
  }

  html += '</div>';
  return html;
}

function runCode() {
  // Clear previous content
  previewArea.innerHTML = '';

  try {
    // Create a safe function from the editor's content
    const code = jsEditor.getValue();
    const safeFunction = new Function('previewArea', code);

    // Run the code
    safeFunction(previewArea);

    // Update the DOM tree visualization
    updateDOMTree();
  } catch (error) {
    previewArea.innerHTML = `<div style="color: #ff5555">Error: ${error.message}</div>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initializeEditor();
  // Smooth scrolling
  document.querySelectorAll('nav a').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      e.target.blur(); // Remove focus from the link after clicking
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth',
      });
    });
  });

  // Animate sections on scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Highlight the nav link for the visible section
          navLinks.forEach((link) => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { threshold: 0.4 } // Slightly higher threshold for better accuracy
  );

  sections.forEach((section) => {
    observer.observe(section);

    section.addEventListener('mousemove', (e) => {
      // const rect = section.getBoundingClientRect();
      // const x = ((e.clientX - rect.left) / rect.width) * 100;
      // const y = ((e.clientY - rect.top) / rect.height) * 100;
      // section.style.setProperty('--halo-x', `${x}%`);
      // section.style.setProperty('--halo-y', `${y}%`);
    });
    section.addEventListener('mouseleave', () => {
      // section.style.setProperty('--halo-x', `50%`);
      // section.style.setProperty('--halo-y', `50%`);
    });
  });

  // Dark mode toggle
  const darkModeToggle = document.getElementById('darkModeToggle');
  const body = document.body;
  darkModeToggle.addEventListener('click', () => {
    if (body.hasAttribute('data-theme')) {
      body.removeAttribute('data-theme');
      darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
      body.setAttribute('data-theme', 'dark');
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
  });

  // Add placeholder content for the rest of the sections to ensure scrolling
  const main = document.querySelector('main');
  const remainingSections = [
    'html',
    'css',
    'animations',
    'events',
    'listeners',
    'navigation',
    'nodes',
    'collections',
    'nodelists',
  ];
  const icons = {
    html: 'fa-code',
    css: 'fa-paint-brush',
    animations: 'fa-magic',
    events: 'fa-mouse-pointer',
    listeners: 'fa-assistive-listening-systems',
    navigation: 'fa-sitemap',
    nodes: 'fa-project-diagram',
    collections: 'fa-layer-group',
    nodelists: 'fa-list-ol',
  };

  remainingSections.forEach((id) => {
    const section = document.createElement('section');
    section.id = id;
    section.innerHTML = `
            <h2 class="section-title"><i class="fas ${icons[id]}"></i> ${
      id.charAt(0).toUpperCase() + id.slice(1)
    }</h2>
            <p>Content for the ${id} section will be displayed here. This is a placeholder to demonstrate the layout and scrolling functionality.</p>
            <div class="code-playground">
                <p>Interactive playground for ${id}.</p>
                <div class="live-preview">Live preview area.</div>
            </div>
        `;
    main.appendChild(section);
    observer.observe(section);
  });
});
