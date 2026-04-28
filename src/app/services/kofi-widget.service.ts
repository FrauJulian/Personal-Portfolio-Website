import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class KofiWidgetService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly widgetScriptUrl = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js';
  private readonly widgetIframeTitle = 'Ko-fi support chat';
  private readonly fallbackDelayMs = 2500;
  private readonly mobileBreakpointPx = 700;
  private readonly mobileViewportOffsetPx = 24;

  private loadTimeoutId: number | null = null;
  private loadIdleCallbackId: number | null = null;
  private loadListenerAbortController: AbortController | null = null;
  private resizeListenerAbortController: AbortController | null = null;
  private iframeObserver: MutationObserver | null = null;
  private isWidgetScheduled = false;
  private isWidgetLoaded = false;
  private isWidgetDrawn = false;

  scheduleLoad(): void {
    if (!isPlatformBrowser(this.platformId) || this.isWidgetScheduled) {
      return;
    }

    this.isWidgetScheduled = true;

    const windowRef = this.document.defaultView;
    if (windowRef === null) {
      return;
    }

    const queueWidgetLoad = (): void => {
      if (this.isWidgetLoaded || this.isWidgetDrawn) {
        return;
      }

      const loadWidget = (): void => {
        this.loadIdleCallbackId = null;
        void this.loadWidget();
      };

      if (typeof windowRef.requestIdleCallback === 'function') {
        this.loadIdleCallbackId = windowRef.requestIdleCallback(loadWidget, { timeout: 2500 });
        return;
      }

      this.loadTimeoutId = windowRef.setTimeout(loadWidget, 1800);
    };

    const triggerWidgetLoad = (): void => {
      this.clearStartListeners();
      queueWidgetLoad();
    };

    const scheduleFallbackWidgetLoad = (): void => {
      if (this.isWidgetLoaded || this.isWidgetDrawn) {
        return;
      }

      this.loadTimeoutId = windowRef.setTimeout((): void => {
        this.loadTimeoutId = null;
        triggerWidgetLoad();
      }, this.fallbackDelayMs);
    };

    this.loadListenerAbortController = new AbortController();
    const listenerOptions: AddEventListenerOptions = {
      passive: true,
      signal: this.loadListenerAbortController.signal,
    };

    windowRef.addEventListener('pointerdown', triggerWidgetLoad, listenerOptions);
    windowRef.addEventListener('keydown', triggerWidgetLoad, listenerOptions);
    windowRef.addEventListener('touchstart', triggerWidgetLoad, listenerOptions);
    windowRef.addEventListener('scroll', triggerWidgetLoad, listenerOptions);

    if (this.document.readyState === 'complete') {
      scheduleFallbackWidgetLoad();
    } else {
      windowRef.addEventListener('load', scheduleFallbackWidgetLoad, {
        ...listenerOptions,
        once: true,
      });
    }
  }

  prioritizeLoad(): void {
    if (!isPlatformBrowser(this.platformId) || this.isWidgetLoaded || this.isWidgetDrawn) {
      return;
    }

    const windowRef = this.document.defaultView;
    if (windowRef === null) {
      return;
    }

    this.clearStartListeners();
    this.clearPendingLoadTimers();

    const loadWidget = (): void => {
      this.loadIdleCallbackId = null;
      this.loadTimeoutId = null;
      void this.loadWidget();
    };

    if (typeof windowRef.requestIdleCallback === 'function') {
      this.loadIdleCallbackId = windowRef.requestIdleCallback(loadWidget, { timeout: 1200 });
      return;
    }

    this.loadTimeoutId = windowRef.setTimeout(loadWidget, 200);
  }

  teardown(): void {
    this.clearStartListeners();
    this.resizeListenerAbortController?.abort();
    this.resizeListenerAbortController = null;
    this.clearPendingLoadTimers();

    this.iframeObserver?.disconnect();
    this.iframeObserver = null;
  }

  private clearStartListeners(): void {
    this.loadListenerAbortController?.abort();
    this.loadListenerAbortController = null;
  }

  private clearPendingLoadTimers(): void {
    const windowRef = this.document.defaultView;

    if (windowRef !== null && this.loadTimeoutId !== null) {
      windowRef.clearTimeout(this.loadTimeoutId);
      this.loadTimeoutId = null;
    }

    if (
      windowRef !== null &&
      this.loadIdleCallbackId !== null &&
      typeof windowRef.cancelIdleCallback === 'function'
    ) {
      windowRef.cancelIdleCallback(this.loadIdleCallbackId);
      this.loadIdleCallbackId = null;
    }
  }

  private async loadWidget(): Promise<void> {
    if (this.isWidgetLoaded || this.isWidgetDrawn) {
      return;
    }

    const windowRef = this.document.defaultView;
    if (windowRef === null) {
      return;
    }

    if (windowRef.kofiWidgetOverlay !== undefined) {
      this.isWidgetLoaded = true;
      this.drawWidget();
      return;
    }

    const existingScript = this.document.querySelector<HTMLScriptElement>(
      `script[src="${this.widgetScriptUrl}"]`,
    );

    if (existingScript !== null) {
      existingScript.addEventListener(
        'load',
        (): void => {
          this.isWidgetLoaded = true;
          this.drawWidget();
        },
        { once: true },
      );
      return;
    }

    await new Promise<void>((resolve, reject): void => {
      const scriptElement = this.document.createElement('script');
      scriptElement.src = this.widgetScriptUrl;
      scriptElement.async = true;
      scriptElement.crossOrigin = 'anonymous';
      scriptElement.addEventListener(
        'load',
        (): void => {
          this.isWidgetLoaded = true;
          resolve();
        },
        { once: true },
      );
      scriptElement.addEventListener(
        'error',
        (): void => reject(new Error('Failed to load the Ko-fi widget script.')),
        { once: true },
      );
      this.document.body.appendChild(scriptElement);
    }).catch((): void => {
      this.isWidgetLoaded = false;
    });

    this.drawWidget();
  }

  private drawWidget(): void {
    if (this.isWidgetDrawn) {
      return;
    }

    const windowRef = this.document.defaultView;
    if (windowRef?.kofiWidgetOverlay === undefined) {
      return;
    }

    windowRef.kofiWidgetOverlay.draw('fraujulian', {
      type: 'floating-chat',
      'floating-chat.donateButton.text': 'Coffee',
      'floating-chat.donateButton.background-color': '#ff5f5f',
      'floating-chat.donateButton.text-color': '#fff',
    });

    this.isWidgetDrawn = true;
    this.ensureAccessibleIframeTitles();
    this.applyResponsiveWidgetLayout();
    this.observeInjectedIframes();
    this.observeViewportChanges();
  }

  private ensureAccessibleIframeTitles(): void {
    this.document
      .querySelectorAll<HTMLIFrameElement>('iframe[id^="kofi-wo-container"]')
      .forEach((iframe: HTMLIFrameElement): void => {
        iframe.title = this.widgetIframeTitle;
      });
  }

  private applyResponsiveWidgetLayout(): void {
    const windowRef = this.document.defaultView;
    if (windowRef === null) {
      return;
    }

    const isMobileViewport: boolean = windowRef.innerWidth <= this.mobileBreakpointPx;
    const mobileWidthPx: number = Math.max(windowRef.innerWidth - this.mobileViewportOffsetPx, 280);
    const mobileHeightPx: number = Math.max(
      Math.min(Math.round(windowRef.innerHeight * 0.68), 520),
      360,
    );

    this.document
      .querySelectorAll<HTMLElement>('[id*="kofi-widget-overlay"]')
      .forEach((overlay: HTMLElement): void => {
        if (isMobileViewport) {
          overlay.style.left = '12px';
          overlay.style.right = '12px';
          overlay.style.bottom = '12px';
          overlay.style.width = 'auto';
          overlay.style.maxWidth = `${mobileWidthPx}px`;
        } else {
          overlay.style.removeProperty('left');
          overlay.style.removeProperty('right');
          overlay.style.removeProperty('width');
          overlay.style.removeProperty('max-width');
        }
      });

    this.document
      .querySelectorAll<HTMLElement>(
        '.floatingchat-container-wrap, .floatingchat-container-wrap-mobi',
      )
      .forEach((container: HTMLElement): void => {
        if (isMobileViewport) {
          container.style.width = `${mobileWidthPx}px`;
          container.style.maxWidth = 'calc(100vw - 24px)';
          container.style.left = '0';
          container.style.right = '0';
        } else {
          container.style.removeProperty('width');
          container.style.removeProperty('max-width');
          container.style.removeProperty('left');
          container.style.removeProperty('right');
        }
      });

    this.document
      .querySelectorAll<HTMLIFrameElement>('iframe[id^="kofi-wo-container"]')
      .forEach((iframe: HTMLIFrameElement): void => {
        iframe.title = this.widgetIframeTitle;

        if (isMobileViewport) {
          iframe.style.width = `${mobileWidthPx}px`;
          iframe.style.maxWidth = 'calc(100vw - 24px)';
          iframe.style.height = `${mobileHeightPx}px`;
          iframe.style.maxHeight = '68vh';
          iframe.style.borderRadius = '18px';
        } else {
          iframe.style.removeProperty('width');
          iframe.style.removeProperty('max-width');
          iframe.style.removeProperty('height');
          iframe.style.removeProperty('max-height');
          iframe.style.removeProperty('border-radius');
        }
      });
  }

  private observeInjectedIframes(): void {
    if (this.iframeObserver !== null) {
      return;
    }

    this.iframeObserver = new MutationObserver((): void => {
      this.ensureAccessibleIframeTitles();
      this.applyResponsiveWidgetLayout();
    });

    this.iframeObserver.observe(this.document.body, {
      childList: true,
      subtree: true,
    });
  }

  private observeViewportChanges(): void {
    if (this.resizeListenerAbortController !== null) {
      return;
    }

    const windowRef = this.document.defaultView;
    if (windowRef === null) {
      return;
    }

    this.resizeListenerAbortController = new AbortController();
    const listenerOptions: AddEventListenerOptions = {
      passive: true,
      signal: this.resizeListenerAbortController.signal,
    };

    windowRef.addEventListener(
      'resize',
      (): void => {
        this.applyResponsiveWidgetLayout();
      },
      listenerOptions,
    );
  }
}
