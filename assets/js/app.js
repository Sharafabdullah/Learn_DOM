/** Copied from original app.js **/

// Import configuration and editor code map
import { CONFIG, defaultEditorCodeMap } from "./config.js";
import { EditorManager } from "./editors.js";
import { DOMVisualizer } from "./dom-visualizer.js";

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
    this.treeToggleStates = new Map(); // Track toggle states for each editor
    this.editorManager = new EditorManager(this);
    this.domVisualizer = new DOMVisualizer(this);
  }

  /**
   * Initialize the entire application
   */
  initialize() {
    try {
      console.log("Setting up existing editors...");
      this.editorManager.setupExistingEditors();
      console.log("Setting up UI events...");
      this.setupUIEvents();
      console.log("Application initialized successfully!");
    } catch (error) {
      console.error("Error initializing application:", error);
    }
  }

  /**
   * Execute code from a specific editor (delegates to DOMVisualizer)
   * @param {string} editorId - The editor identifier
   */
  executeCode(editorId) {
    this.domVisualizer.executeCode(editorId);
  }

  /**
   * Toggle DOM tree visibility (delegates to DOMVisualizer)
   * @param {string} editorId - The editor identifier
   * @param {boolean} isVisible - Whether the tree should be visible
   */
  toggleDOMTreeVisibility(editorId, isVisible) {
    this.domVisualizer.toggleDOMTreeVisibility(editorId, isVisible);
  }

  /**
   * Render DOM visualization (delegates to DOMVisualizer)
   * @param {string} editorId - The editor identifier
   * @param {Object} graphData - Graph data with nodes and links
   */
  renderDOMVisualization(editorId, graphData) {
    this.domVisualizer.renderDOMVisualization(editorId, graphData);
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
    const header = document.querySelector("header");
    const headerToggle = document.querySelector(".header-toggle");

    if (headerToggle && header) {
      headerToggle.addEventListener("click", () => {
        header.classList.toggle("collapsed");
        const mainElement = document.querySelector("main");
        if (mainElement) {
          mainElement.style.marginLeft = header.classList.contains("collapsed")
            ? "80px"
            : "280px";
        }
      });
    }
  }

  /**
   * Set up smooth scrolling for navigation links
   */
  setupSmoothScrolling() {
    document.querySelectorAll("nav a").forEach(anchor => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        e.target.blur();
        const targetElement = document.querySelector(this.getAttribute("href"));
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  /**
   * Set up scroll animations and active link highlighting
   */
  setupScrollAnimations() {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("nav a");

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            navLinks.forEach(link => {
              link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${entry.target.id}`
              );
            });
          }
        });
      },
      {
        rootMargin: `-${window.innerHeight * 0.9}px 0px -${
          window.innerHeight * 0.1
        }px 0px`,
      }
    );

    sections.forEach((section, index) => {
      // Keep the first section visible, hide the rest
      if (index === 0) {
        section.classList.add("visible");
      } else {
        section.classList.remove("visible");
      }
      observer.observe(section);
    });
  }

  /**
   * Set up dark mode toggle functionality
   */
  setupDarkModeToggle() {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const body = document.body;

    if (darkModeToggle) {
      // Default is dark theme, so show sun icon initially
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';

      darkModeToggle.addEventListener("click", () => {
        if (body.hasAttribute("data-theme")) {
          // Currently light theme, switch to dark theme (default)
          body.removeAttribute("data-theme");
          darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
          // Currently dark theme (default), switch to light theme
          body.setAttribute("data-theme", "light");
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
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Content Loaded - Initializing app...");
  setTimeout(() => {
    app.initialize();
  }, 500);

  // Section visibility is now handled by setupScrollAnimations
  const sections = document.querySelectorAll("section");
  console.log("Found sections:", sections.length);
  sections.forEach((section, index) => {
    console.log(`Section ${index}: ${section.id}`);
  });
});

// Export for potential external use
window.DOMTutorialApp = DOMTutorialApp;
