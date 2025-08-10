// Configuration and constants for the DOM Tutorial App
const CONFIG = {
  EDITOR_THEME: "monokai",
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

// Lazy loading configuration map - only load examples when needed
class LazyExampleLoader {
  constructor() {
    this.loadedExamples = new Map();
    this.examplePromises = new Map();
  }

  async getExample(exampleId) {
    // Return cached if already loaded
    if (this.loadedExamples.has(exampleId)) {
      return this.loadedExamples.get(exampleId);
    }

    // Return pending promise if already loading
    if (this.examplePromises.has(exampleId)) {
      return this.examplePromises.get(exampleId);
    }

    // Start loading and cache the promise
    const promise = this.loadExample(exampleId);
    this.examplePromises.set(exampleId, promise);

    try {
      const example = await promise;
      this.loadedExamples.set(exampleId, example);
      this.examplePromises.delete(exampleId);
      return example;
    } catch (error) {
      this.examplePromises.delete(exampleId);
      throw error;
    }
  }

  async loadExample(exampleId) {
    // Load example from dedicated file or generate on demand
    try {
      const response = await fetch(`./assets/examples/${exampleId}.txt`);
      if (response.ok) {
        return await response.text();
      }
    } catch (error) {
      console.warn(
        `Could not load example file for ${exampleId}, using fallback`
      );
    }

    // Fallback to inline examples for critical ones
    return `<!-- Example ${exampleId} not found -->`;
  }

  // Clear cache to free memory
  clearCache() {
    this.loadedExamples.clear();
    this.examplePromises.clear();
  }

  // Get cache size for debugging
  getCacheSize() {
    return this.loadedExamples.size;
  }
}

// Create lazy loader instance
const lazyExampleLoader = new LazyExampleLoader();

// Lightweight default editor code map - only loads when accessed
const defaultEditorCodeMap = new Proxy(new Map(), {
  get(target, prop) {
    if (prop === "get") {
      return async exampleId => {
        try {
          return await lazyExampleLoader.getExample(exampleId);
        } catch (error) {
          console.error(`Failed to load example ${exampleId}:`, error);
          return `<!-- Error loading example ${exampleId} -->`;
        }
      };
    }
    return target[prop];
  },
});

// Export the configuration and optimized map
export { CONFIG, defaultEditorCodeMap, lazyExampleLoader };
