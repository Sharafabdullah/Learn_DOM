// CodeMirror/editor setup logic for DOM Tutorial App
import { CONFIG, defaultEditorCodeMap } from "./config.js";

/**
 * Editor management class for handling CodeMirror instances and editor setup
 */
export class EditorManager {
  constructor(app) {
    this.app = app; // Reference to main DOMTutorialApp instance
  }

  /**
   * Set up editors that already exist in the HTML
   */
  setupExistingEditors() {
    const editorElements = document.querySelectorAll(
      ".jsEditor[data-editor-id]"
    );
    editorElements.forEach(el => {
      const editorId = el.getAttribute("data-editor-id");
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

    // Initialize tree visibility state
    const treeToggle = elements.treeToggle;
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
   * Create a CodeMirror editor instance with standard configuration
   * @param {HTMLElement} editorElement - The DOM element to attach the editor to
   * @returns {CodeMirror} - The created editor instance
   */
  createCodeMirrorInstance(editorElement) {
    console.log("Creating CodeMirror instance for:", editorElement);

    // Use the editor's data-editor-id to get the correct default code
    const editorId = editorElement.getAttribute("data-editor-id");
    let defaultCode = defaultEditorCodeMap.get(editorId) || "";

    const editor = CodeMirror(editorElement, {
      mode: "htmlmixed",
      theme: CONFIG.EDITOR_THEME,
      lineNumbers: true,
      autoCloseBrackets: true,
      matchBrackets: true,
      styleActiveLine: true,
      cursorBlinkRate: 530,
      tabSize: 2,
      value: defaultCode,
    });

    console.log("CodeMirror instance created:", editor);
    return editor;
  }

  /**
   * Store references to editor components
   * @param {string} editorId - The editor identifier
   * @param {CodeMirror} editor - The editor instance
   * @param {Object} elements - Object containing element references
   */
  storeEditorReferences(editorId, editor, elements) {
    this.app.editors.set(editorId, editor);
    this.app.previewAreas.set(editorId, elements.previewArea);
    this.app.domTrees.set(editorId, elements.treeElement);
  }

  /**
   * Set up event listeners for an editor
   * @param {string} editorId - The editor identifier
   * @param {HTMLElement} runButton - The run button element
   */
  setupEditorEvents(editorId, runButton) {
    if (runButton) {
      runButton.addEventListener("click", () => this.app.executeCode(editorId));
    }

    // Set up tree toggle event
    const treeToggle = document.querySelector(
      `.tree-toggle-input[data-editor-id="${editorId}"]`
    );
    if (treeToggle) {
      treeToggle.addEventListener("change", () => {
        const isVisible = treeToggle.checked;
        this.app.treeToggleStates.set(editorId, isVisible);
        this.app.toggleDOMTreeVisibility(editorId, isVisible);
      });
    }
  }
}
