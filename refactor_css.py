with open('frontend/css/styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Replace body styles
css = css.replace(
'''body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: var(--base-size);
  background-color: #EDE8DF; /* Outer page frame background */
  color: var(--text-primary);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 12px 0 24px 0;
}''',
'''body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: var(--base-size);
  background-color: var(--bg-cream);
  color: var(--text-primary);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}'''
)

# Append new layout styles
new_layout = '''
/* ==========================================================================
   DESKTOP LAYOUT OVERRIDES
   ========================================================================== */
.desktop-layout {
  display: flex;
  flex: 1;
  width: 100%;
  height: calc(100vh - 54px); /* Fallback, though we handle header inside main-content-area */
  overflow: hidden;
}

.desktop-layout {
  height: 100vh;
}

.sidebar {
  width: 260px;
  flex-shrink: 0;
  background: #FFFFFF;
  border-right: 1px solid var(--border-card);
  display: flex;
  flex-direction: column;
  z-index: 10;
}

.sidebar .app-brand-bar {
  padding: 20px;
  background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
  color: #FFF;
  display: flex;
  align-items: center;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  padding: 16px 12px;
  gap: 8px;
  flex: 1;
}

.sidebar-nav .nav-dock-item {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 0.95rem;
  background: transparent;
  width: 100%;
}

.sidebar-nav .nav-dock-item.active {
  background: var(--primary-subtle);
  color: var(--primary-dark);
  font-weight: 700;
}

.sidebar-nav .nav-dock-item .nav-icon {
  font-size: 1.4rem;
}

.main-content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--bg-cream);
}

.top-accessibility-header {
  padding: 12px 32px;
  border-bottom: 1px solid var(--border-card);
  background: #FFFFFF;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 5;
}

.app-scroll-content {
  padding: 32px;
  overflow-y: auto;
  flex: 1;
}

.split-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
}

@media (max-width: 900px) {
  .split-panel {
    grid-template-columns: 1fr;
  }
  .sidebar {
    width: 220px;
  }
}

@media (max-width: 768px) {
  .desktop-layout {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    height: auto;
    flex-direction: row;
    border-right: none;
    border-bottom: 1px solid var(--border-card);
  }
  .sidebar .app-brand-bar {
    padding: 10px;
    flex: 1;
  }
  .sidebar-nav {
    flex-direction: row;
    overflow-x: auto;
    padding: 8px;
  }
  .sidebar-nav .nav-dock-item {
    flex-direction: column;
    padding: 8px;
    font-size: 0.75rem;
  }
}
'''

css += new_layout

with open('frontend/css/styles.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("styles.css refactored successfully.")
