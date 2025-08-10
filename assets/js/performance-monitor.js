// Performance monitoring for DOM Tutorial App
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.startTime = performance.now();
    this.memoryBaseline = this.getMemoryUsage();

    console.log("🚀 Performance Monitor initialized");
    console.log(
      `📊 Initial memory usage: ${this.formatMemory(this.memoryBaseline)}`
    );
  }

  getMemoryUsage() {
    if (performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
      };
    }
    return null;
  }

  formatMemory(memory) {
    if (!memory) return "N/A";
    return `${(memory.used / 1024 / 1024).toFixed(2)} MB used / ${(
      memory.total /
      1024 /
      1024
    ).toFixed(2)} MB total`;
  }

  startMeasure(name) {
    this.metrics[name] = {
      start: performance.now(),
      memory: this.getMemoryUsage(),
    };
  }

  endMeasure(name) {
    if (!this.metrics[name]) return;

    const metric = this.metrics[name];
    const duration = performance.now() - metric.start;
    const currentMemory = this.getMemoryUsage();

    console.log(`⏱️  ${name}: ${duration.toFixed(2)}ms`);

    if (currentMemory && metric.memory) {
      const memoryDiff = currentMemory.used - metric.memory.used;
      console.log(
        `📈 Memory change: ${(memoryDiff / 1024 / 1024).toFixed(2)} MB`
      );
    }

    delete this.metrics[name];
  }

  logCurrentStats() {
    const currentTime = performance.now();
    const uptime = currentTime - this.startTime;
    const currentMemory = this.getMemoryUsage();

    console.group("📊 Performance Stats");
    console.log(`🕐 Uptime: ${(uptime / 1000).toFixed(2)}s`);
    console.log(`💾 Current memory: ${this.formatMemory(currentMemory)}`);

    if (currentMemory && this.memoryBaseline) {
      const memoryIncrease = currentMemory.used - this.memoryBaseline.used;
      console.log(
        `📈 Memory increase since start: ${(
          memoryIncrease /
          1024 /
          1024
        ).toFixed(2)} MB`
      );
    }

    // Count DOM elements
    const totalElements = document.querySelectorAll("*").length;
    const editors = document.querySelectorAll(".CodeMirror").length;
    const previews = document.querySelectorAll(".previewArea").length;

    console.log(
      `🏗️  DOM elements: ${totalElements} total, ${editors} editors, ${previews} previews`
    );
    console.groupEnd();
  }

  // Monitor for memory leaks
  checkMemoryLeaks() {
    const currentMemory = this.getMemoryUsage();
    if (!currentMemory || !this.memoryBaseline) return;

    const memoryIncrease = currentMemory.used - this.memoryBaseline.used;
    const increasePercentage =
      (memoryIncrease / this.memoryBaseline.used) * 100;

    if (increasePercentage > 50) {
      console.warn(
        `⚠️  Potential memory leak detected: ${increasePercentage.toFixed(
          1
        )}% increase`
      );
    }
  }
}

// Initialize performance monitor
const perfMonitor = new PerformanceMonitor();

// Export for global access
window.perfMonitor = perfMonitor;

// Auto-log stats every 30 seconds in development
if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  setInterval(() => {
    perfMonitor.logCurrentStats();
    perfMonitor.checkMemoryLeaks();
  }, 30000);
}

export { PerformanceMonitor, perfMonitor };
