import { getCurrentWindow } from "@tauri-apps/api/window";

export function TitleBar() {
  const win = getCurrentWindow();

  return (
    <div className="titlebar" data-tauri-drag-region>
      <span className="titlebar-title" data-tauri-drag-region>
        Tower of Hanoi
      </span>
      <div className="titlebar-controls">
        <button
          className="titlebar-btn titlebar-minimize"
          onClick={() => win.minimize()}
          title="Minimize"
        >
          ─
        </button>
        <button
          className="titlebar-btn titlebar-close"
          onClick={() => win.close()}
          title="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
