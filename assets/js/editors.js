// CodeMirror/editor setup logic for DOM Tutorial App
import { CONFIG, defaultEditorCodeMap } from "./config-optimized.js";

/**
 * Editor management class for handling CodeMirror instances and editor setup
 */
export class EditorManager {
  constructor(app) {
    this.app = app; // Reference to main DOMTutorialApp instance
  }

  /**
   * Set up editors that already exist in the HTML - Optimized for SPA
   */
  setupExistingEditors() {
    const editorElements = document.querySelectorAll(
      ".jsEditor[data-editor-id]"
    );

    console.log(
      `Setting up ${editorElements.length} editors for current tutorial`
    );

    // Use requestAnimationFrame for better performance
    const setupBatch = async (elements, index = 0) => {
      if (index >= elements.length) return;

      const el = elements[index];
      const editorId = el.getAttribute("data-editor-id");
      console.log(`Initializing editor: ${editorId}`);
      await this.initializeEditor(editorId);

      // Process next editor in next frame
      if (index + 1 < elements.length) {
        requestAnimationFrame(() => setupBatch(elements, index + 1));
      }
    };

    if (editorElements.length > 0) {
      requestAnimationFrame(() => setupBatch(editorElements));
    }
  }

  /**
   * Initialize a single editor group with its preview area and DOM tree - Optimized
   * @param {string} editorId - Unique identifier for the editor
   * @returns {Promise<CodeMirror|null>} - The created editor instance or null if failed
   */
  async initializeEditor(editorId) {
    const elements = this.findEditorElements(editorId);
    if (!elements.isValid) return null;

    const editor = await this.createCodeMirrorInstance(elements.editorElement);

    this.app.editors.set(editorId, editor);
    this.app.previewAreas.set(editorId, elements.previewArea);
    this.app.domTrees.set(editorId, elements.treeElement);

    this.setupEditorEvents(editorId, elements.runButton);

    if (elements.runButton) {
      elements.runButton.addEventListener("click", () =>
        this.app.executeCode(editorId)
      );
    }

    // Set up tree toggle event
    let treeToggle = document.querySelector(
      `.tree-toggle-input[data-editor-id="${editorId}"]`
    );
    if (treeToggle) {
      treeToggle.addEventListener("change", () => {
        const isVisible = treeToggle.checked;
        this.app.treeToggleStates.set(editorId, isVisible);
        this.app.toggleDOMTreeVisibility(editorId, isVisible);
      });
    }

    // Initialize tree visibility state
    treeToggle = elements.treeToggle;
    if (treeToggle) {
      const initialState = treeToggle.checked;
      this.app.treeToggleStates.set(editorId, initialState);
      // Set initial visibility
      this.app.toggleDOMTreeVisibility(editorId, initialState);
    } else {
      // Default to visible if no toggle found
      this.app.treeToggleStates.set(editorId, true);
    }

    // Auto-run initial code after a brief delay to ensure DOM is ready
    setTimeout(() => this.app.executeCode(editorId), 100);

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
      editorElement?.parentElement?.querySelector(".run-button");
    const treeToggle = document.querySelector(
      `.tree-toggle-input[data-editor-id="${editorId}"]`
    );

    return {
      editorElement,
      previewArea,
      treeElement,
      runButton,
      treeToggle,
      isValid: !!(editorElement && previewArea && treeElement),
    };
  }

  /**
   * Create a CodeMirror editor instance with standard configuration - Optimized
   */
  async createCodeMirrorInstance(editorElement) {
    console.log("Creating CodeMirror instance for:", editorElement);

    // Use the editor's data-editor-id to get the correct default code
    const editorId = editorElement.getAttribute("data-editor-id");

    let defaultCode = "";
    try {
      // Use async loading for examples
      defaultCode = (await defaultEditorCodeMap.get(editorId)) || "";
    } catch (error) {
      console.warn(`Could not load code for ${editorId}, using empty content`);
      defaultCode = `<!-- Loading ${editorId}... -->`;
    }
    console.log(defaultCode);
    const editor = CodeMirror(editorElement, {
      value: defaultCode,
      mode: "htmlmixed",
      theme: CONFIG.EDITOR_THEME,
      lineNumbers: true,
      autoCloseTags: true,
      autoCloseBrackets: true,
      matchBrackets: true,
      indentUnit: 2,
      lineWrapping: true,
      foldGutter: true,
      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    });

    console.log(`CodeMirror editor created for ${editorId}`);
    return editor;
  }

  /**
   * Set up event listeners for an editor
   * @param {string} editorId - The editor identifier
   * @param {HTMLElement} runButton - The run button element
   */
  setupEditorEvents(editorId, runButton) {}
}
