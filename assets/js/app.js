/** Copied from original app.js **/

// Import configuration and editor code map
import { CONFIG, defaultEditorCodeMap } from "./config-optimized.js";
import { EditorManager } from "./editors.js";
import { DOMVisualizer } from "./dom-visualizer.js";

// Initialize performance monitor with error handling
// let perfMonitor = {
//   startTimer: () => {},
//   endTimer: () => {},
//   logMetrics: () => {},
//   startMonitoring: () => {},
// };

// // Helper function to safely call perfMonitor methods
// function safePerfCall(method, ...args) {
//   if (perfMonitor && typeof perfMonitor[method] === "function") {
//     return perfMonitor[method](...args);
//   }
// }

// async function initializePerformanceMonitor() {
//   try {
//     const { perfMonitor: pm } = await import("./performance-monitor.js");
//     if (pm && typeof pm === "object") {
//       // Safely merge the real performance monitor with fallbacks
//       perfMonitor = {
//         startTimer: pm.startTimer || (() => {}),
//         endTimer: pm.endTimer || (() => {}),
//         logMetrics: pm.logMetrics || (() => {}),
//         startMonitoring: pm.startMonitoring || (() => {}),
//       };
//       if (perfMonitor.startMonitoring) {
//         perfMonitor.startMonitoring();
//         console.log("Performance monitoring enabled");
//       }
//     }
//   } catch (error) {
//     console.warn("Performance monitor not available:", error);
//     // perfMonitor already has dummy functions
//   }
// }

// ==================== TUTORIAL MANAGER CLASS ====================

/**
 * SPA Tutorial Manager - Lazy Loading Implementation
 */
class TutorialManager {
  constructor() {
    this.currentTutorial = null;
    this.loadedTutorials = new Set();
    this.tutorialContent = document.getElementById("tutorial-content");
  }

  async loadTutorial(tutorialId) {
    // Avoid reloading the same tutorial
    if (this.currentTutorial === tutorialId) return;

    try {
      // Load tutorial HTML
      const url = `./assets/tutorial-pages/${tutorialId}.html`;
      console.log(`Fetching: ${url}`);
      const response = await fetch(url);

      //   console.log(`Response status: ${response.status}`);
      if (!response.ok)
        throw new Error(`Failed to load ${tutorialId}: ${response.status}`);

      const content = await response.text();
      console.log(`Content loaded, length: ${content.length}`);

      // Clear current content and load new
      this.tutorialContent.innerHTML = content;
      this.currentTutorial = tutorialId;

      // Update mobile section title
      this.updateMobileSectionTitle(tutorialId);

      // Scroll to top of page
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Initialize editors for this tutorial only

      this.cleanupPreviousTutorial();

      // Initialize new tutorial - wait for animation frame (after the next repaint)
      requestAnimationFrame(() => {
        window.app.editorManager.setupExistingEditors();
      });

      this.loadedTutorials.add(tutorialId);
      console.log(`Successfully loaded tutorial: ${tutorialId}`);
    } catch (error) {
      console.error(`Error loading tutorial ${tutorialId}:`, error);
      this.tutorialContent.innerHTML = `
        <div class="error-state">
          <h2>Error Loading Tutorial</h2>
          <p>Failed to load tutorial: ${tutorialId}</p>
          <button onclick="window.tutorialManager.loadTutorial('${tutorialId}')">
            Retry
          </button>
        </div>
      `;
    }
  }

  updateMobileSectionTitle(tutorialId) {
    const mobileTitleElement = document.getElementById("mobileSectionTitle");
    if (mobileTitleElement) {
      // Create a map of tutorial IDs to display names
      const titleMap = {
        introduction: "Introduction",
        methods: "Methods",
        document: "Document",
        elements: "Elements",
        "changing-html": "Changing HTML",
        Forms: "Forms",
        css: "CSS",
        animations: "Animations",
        events: "Events",
        listeners: "Listeners",
        navigation: "Navigation",
        nodes: "Nodes",
        collections: "Collections",
        nodelists: "NodeLists",
      };

      mobileTitleElement.textContent =
        titleMap[tutorialId] ||
        tutorialId.charAt(0).toUpperCase() + tutorialId.slice(1);
    }
  }

  cleanupPreviousTutorial() {
    window.app.editors.forEach(editor => {
      if (editor && editor.toTextArea) {
        editor.toTextArea();
      }
    });
    window.app.editors.clear();
    window.app.previewAreas.clear();
    window.app.domTrees.clear();
    window.app.simulations.forEach(sim => {
      if (sim && sim.stop) sim.stop();
    });
    window.app.simulations.clear();
    window.app.treeToggleStates.clear();
  }
}

// ==================== MAIN APPLICATION CLASS ====================

/**
 * Main application class that manages multiple code editors and their DOM visualizations
 */
class DOMTutorialApp {
  constructor() {
    // These three maps track the state of various components
    this.editors = new Map();
    this.previewAreas = new Map();
    this.domTrees = new Map();
    this.simulations = new Map();
    this.treeToggleStates = new Map(); // Track toggle states for each editor
    this.editorManager = new EditorManager(this);
    this.domVisualizer = new DOMVisualizer(this);
    this.tutorialManager = new TutorialManager();
  }

  /**
   * Initialize the entire application
   */
  initialize() {
    try {
      console.log("Setting up existing editors...");
      // this.editorManager.setupExistingEditors();
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
        // Check if we're on mobile
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
          // Mobile: toggle mobile menu
          header.classList.toggle("mobile-open");
        } else {
          // Desktop: toggle collapsed state
          header.classList.toggle("collapsed");
          const mainElement = document.querySelector("main");
          if (mainElement) {
            mainElement.style.marginLeft = header.classList.contains(
              "collapsed"
            )
              ? "80px"
              : "280px";
          }
        }
      });

      // Close mobile menu when clicking nav links
      const navLinks = document.querySelectorAll("nav a");
      navLinks.forEach(link => {
        link.addEventListener("click", () => {
          if (window.innerWidth <= 768) {
            header.classList.remove("mobile-open");
          }
        });
      });

      // Handle window resize
      window.addEventListener("resize", () => {
        const isMobile = window.innerWidth <= 768;
        if (!isMobile) {
          header.classList.remove("mobile-open");
        }
      });
    }
  }

  /**
   * Set up smooth scrolling for navigation links - Disabled for SPA (handled in index.html)
   */
  setupSmoothScrolling() {
    // Navigation is now handled by TutorialManager in index.html
    // This method is kept for compatibility but does nothing in SPA mode
    console.log("Navigation handled by TutorialManager in SPA mode");
  }

  /**
   * Set up scroll animations and active link highlighting - Simplified for SPA
   */
  setupScrollAnimations() {
    // Simplified for SPA - no intersection observer needed
    // Active link highlighting is handled in setupSmoothScrolling
    const sections = document.querySelectorAll("section");
    console.log("Found sections:", sections.length);

    // Set first nav item as active by default
    const firstNavLink = document.querySelector("nav a");
    if (firstNavLink) {
      firstNavLink.classList.add("active");
    }
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
document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM Content Loaded - Setting up SPA navigation...");

  // Initialize performance monitoring
  //   await initializePerformanceMonitor();

  // Set up navigation links
  const navLinks = document.querySelectorAll("nav a[href^='#']");
  console.log(`Found ${navLinks.length} navigation links`);

  navLinks.forEach(link => {
    link.addEventListener("click", async e => {
      e.preventDefault();

      // Extract tutorial ID from href (remove #)
      const tutorialId = link.getAttribute("href").substring(1);
      console.log(`Loading tutorial: ${tutorialId}`);

      // Update active nav item
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      // Close mobile navigation menu if open
      const header = document.querySelector("header");
      if (header && header.classList.contains("mobile-open")) {
        header.classList.remove("mobile-open");
      }

      // Load the tutorial
      await app.tutorialManager.loadTutorial(tutorialId);
    });
  });

  // Load default tutorial and set first nav item as active
  const firstNavLink = navLinks[0];

  firstNavLink.classList.add("active");
  const tutorialId = firstNavLink.getAttribute("href").substring(1);

  app.tutorialManager.loadTutorial(tutorialId);

  app.initialize();
});

// Export for global access
window.DOMTutorialApp = DOMTutorialApp;
window.app = app;
window.tutorialManager = app.tutorialManager;
// window.perfMonitor = perfMonitor;
