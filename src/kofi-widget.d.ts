interface KofiWidgetOverlay {
  draw(userName: string, options: Record<string, string>): void;
}

interface Window {
  kofiWidgetOverlay?: KofiWidgetOverlay;
  requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  cancelIdleCallback?: (handle: number) => void;
}
