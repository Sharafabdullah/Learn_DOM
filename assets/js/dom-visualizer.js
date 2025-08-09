// DOM visualization and preview management for DOM Tutorial App
import { CONFIG } from "./config.js";

/**
 * DOM Visualizer class for handling code execution, preview generation, and DOM tree visualization
 */
export class DOMVisualizer {
  constructor(app) {
    this.app = app; // Reference to main DOMTutorialApp instance
  }

  /**
   * Execute code from a specific editor and update its visualization
   * @param {string} editorId - The editor identifier
   */
  executeCode(editorId) {
    const editor = this.app.editors.get(editorId);
    const previewArea = this.app.previewAreas.get(editorId);
    const treeElement = this.app.domTrees.get(editorId);

    if (!editor || !previewArea || !treeElement) return;

    try {
      const code = editor.getValue();
      // Create an isolated iframe for true browser-like behavior
      this.createIsolatedPreview(previewArea, code);

      // Only update DOM tree visualization if toggle is enabled
      const isTreeVisible = this.app.treeToggleStates.get(editorId);
      if (isTreeVisible) {
        setTimeout(() => {
          const graphData = this.createDOMGraphDataFromIframe(previewArea);
          if (graphData.nodes.length > 1) {
            this.renderDOMVisualization(editorId, graphData);
          }
        }, 100);
      }
    } catch (error) {
      previewArea.innerHTML = `<div style="color: #ff5555; padding: 1rem;">
        <strong>Error:</strong> ${error.message}
      </div>`;
    }
  }

  /**
   * Toggle the visibility of DOM tree visualization
   * @param {string} editorId - The editor identifier
   * @param {boolean} isVisible - Whether the tree should be visible
   */
  toggleDOMTreeVisibility(editorId, isVisible) {
    const treeElement = this.app.domTrees.get(editorId);
    if (!treeElement) return;

    if (isVisible) {
      // Show the tree and regenerate visualization
      treeElement.style.display = "block";
      const previewArea = this.app.previewAreas.get(editorId);
      if (previewArea) {
        setTimeout(() => {
          const graphData = this.createDOMGraphDataFromIframe(previewArea);
          if (graphData.nodes.length > 1) {
            this.renderDOMVisualization(editorId, graphData);
          }
        }, 100);
      }
    } else {
      // Hide the tree and stop any running simulation
      treeElement.style.display = "none";
      const simulation = this.app.simulations.get(editorId);
      if (simulation) {
        simulation.stop();
      }
      // Clear the tree content
      treeElement.innerHTML = "";
    }
  }

  /**
   * Create an isolated iframe-based preview that acts like a mini-browser
   * @param {HTMLElement} previewArea - The preview container
   * @param {string} code - The HTML/JS code to execute
   */
  createIsolatedPreview(previewArea, code) {
    // Clear previous content
    previewArea.innerHTML = "";

    // Create iframe for isolated execution
    const iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.style.borderRadius = "4px";
    iframe.style.background = "#fff";
    iframe.sandbox = "allow-scripts allow-same-origin";

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
        console.error("Error injecting code into iframe:", error);
        previewArea.innerHTML = `<div style="color: #ff5555; padding: 1rem;">
          <strong>Preview Error:</strong> ${error.message}
        </div>`;
      }
    };

    // Initialize empty iframe
    iframe.src = "about:blank";
  }

  /**
   * Create graph data from iframe content
   * @param {HTMLElement} previewArea - The preview container
   * @returns {Object} - Graph data with nodes and links
   */
  createDOMGraphDataFromIframe(previewArea) {
    const iframe = previewArea.querySelector("iframe");
    if (!iframe) {
      return { nodes: [], links: [] };
    }

    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      // Create a cleaner DOM representation focusing on user content
      return this.createCleanDOMGraphData(iframeDoc);
    } catch (error) {
      console.error("Error accessing iframe content for DOM tree:", error);
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
    const docNode = { id: counter++, name: "Document", type: "document" };
    nodes.push(docNode);

    // Create html node
    const htmlNode = { id: counter++, name: "html", type: "element" };
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
            type: "text",
          };
          nodes.push(textNode);
          links.push({ source: parentNode.id, target: textNode.id });
        }
        return;
      }

      // Skip <script> nodes
      if (
        element.nodeType === Node.ELEMENT_NODE &&
        element.nodeName.toLowerCase() === "script"
      ) {
        return;
      }

      // Skip auto-generated elements in head
      if (isHead) {
        const tagName = element.nodeName.toLowerCase();
        // Only include user-added head elements, skip auto-generated ones
        if (
          tagName === "meta" ||
          (tagName === "title" && element.textContent === "")
        ) {
          return;
        }
      }

      // Element node
      const elementNode = {
        id: counter++,
        name: element.nodeName.toLowerCase(),
        type: "element",
      };
      nodes.push(elementNode);
      links.push({ source: parentNode.id, target: elementNode.id });

      // Process attributes (but filter out some auto-generated ones)
      Array.from(element.attributes || []).forEach(attr => {
        // Skip some auto-generated attributes
        if (
          attr.name === "data-darkreader-mode" ||
          attr.name === "data-darkreader-scheme"
        ) {
          return;
        }
        const attrNode = {
          id: counter++,
          name: `${attr.name}="${attr.value}"`,
          type: "attribute",
        };
        nodes.push(attrNode);
        links.push({ source: elementNode.id, target: attrNode.id });
      });

      // Process child nodes
      Array.from(element.childNodes).forEach(child => {
        traverse(child, elementNode, isHead);
      });
    };

    // Add head if it has user content
    if (head && head.children.length > 0) {
      const headNode = { id: counter++, name: "head", type: "element" };
      nodes.push(headNode);
      links.push({ source: htmlNode.id, target: headNode.id });

      Array.from(head.childNodes).forEach(child => {
        traverse(child, headNode, true);
      });
    }

    // Add body and its content
    if (body) {
      const bodyNode = { id: counter++, name: "body", type: "element" };
      nodes.push(bodyNode);
      links.push({ source: htmlNode.id, target: bodyNode.id });

      Array.from(body.childNodes).forEach(child => {
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
    const docNode = { id: counter++, name: "Document", type: "document" };
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
            type: "text",
          };
          nodes.push(textNode);
          links.push({ source: parentNode.id, target: textNode.id });
        }
        return;
      }

      // Skip <script> nodes
      if (
        element.nodeType === Node.ELEMENT_NODE &&
        element.nodeName.toLowerCase() === "script"
      ) {
        return;
      }

      // Element node
      const elementNode = {
        id: counter++,
        name: element.nodeName.toLowerCase(),
        type: "element",
      };
      nodes.push(elementNode);
      links.push({ source: parentNode.id, target: elementNode.id });

      // Process attributes
      Array.from(element.attributes || []).forEach(attr => {
        const attrNode = {
          id: counter++,
          name: `${attr.name}="${attr.value}"`,
          type: "attribute",
        };
        nodes.push(attrNode);
        links.push({ source: elementNode.id, target: attrNode.id });
      });

      // Process child nodes (including text nodes)
      Array.from(element.childNodes).forEach(child => {
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
    const container = this.app.domTrees.get(editorId);
    if (!container) return;

    container.innerHTML = "";

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
          link =>
            link.source === nodeId ||
            (typeof link.source === "object" && link.source.id === nodeId)
        )
        .forEach(link => {
          const targetId =
            typeof link.target === "object" ? link.target.id : link.target;
          calculateDepth(targetId, depth + 1);
        });
    };

    // Start from document node (should be id: 0)
    calculateDepth(0);

    // Assign target y positions based on depth
    graphData.nodes.forEach(node => {
      const depth = nodeDepths.get(node.id) || 0;
      node.targetY = 60 + depth * 80; // 60px from top, 80px between levels
    });

    // Inline createSVGContainer
    const svg = d3
      .select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    // Inline createForceSimulation with tree-like positioning
    const simulation = d3
      .forceSimulation(graphData.nodes)
      .force(
        "link",
        d3
          .forceLink(graphData.links)
          .id(d => d.id)
          .distance(60) // Shorter, more consistent distance
          .strength(0.8)
      )
      .force(
        "charge",
        d3.forceManyBody().strength(-300) // Reduced repulsion for tighter tree
      )
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "y",
        d3
          .forceY()
          .y(d => d.targetY || height / 2)
          .strength(0.3) // Strong y-positioning to maintain layers
      )
      .force(
        "x",
        d3
          .forceX()
          .x(width / 2)
          .strength(0.05) // Weak x-centering to allow spreading
      )
      .force(
        "collision",
        d3.forceCollide().radius(25) // Prevent node overlap
      );

    this.app.simulations.set(editorId, simulation);

    // Explicitly render links
    const links = svg
      .append("g")
      .selectAll("line")
      .data(graphData.links)
      .join("line")
      .attr("class", "link");

    // Explicitly render nodes
    const nodeGroups = svg
      .append("g")
      .selectAll("g")
      .data(graphData.nodes)
      .join("g");

    nodeGroups
      .append("circle")
      .attr("r", d => {
        const radii = CONFIG.NODE_RADIUS;
        return radii[(d.type || "").toUpperCase()] || radii.DEFAULT;
      })
      .attr("class", d => `node node-type-${d.type}`);

    nodeGroups
      .append("text")
      .text(d => d.name)
      .attr("class", "node-label");

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
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded)
    );

    // Inline setupSimulationTick
    simulation.on("tick", () => {
      links
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      nodeGroups.attr("transform", d => `translate(${d.x},${d.y})`);
    });
  }
}
