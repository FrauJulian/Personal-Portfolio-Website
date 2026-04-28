import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class KofiWidgetService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly widgetScriptUrl = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js';
  private readonly widgetIframeTitle = 'Ko-fi support chat';
  private readonly fallbackDelayMs = 10000;

  private loadTimeoutId: number | null = null;
  private loadIdleCallbackId: number | null = null;
  private loadListenerAbortController: AbortController | null = null;
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

  teardown(): void {
    const windowRef = this.document.defaultView;

    this.clearStartListeners();

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

    this.iframeObserver?.disconnect();
    this.iframeObserver = null;
  }

  private clearStartListeners(): void {
    this.loadListenerAbortController?.abort();
    this.loadListenerAbortController = null;
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
    this.observeInjectedIframes();
  }

  private ensureAccessibleIframeTitles(): void {
    this.document
      .querySelectorAll<HTMLIFrameElement>('iframe[id^="kofi-wo-container"]')
      .forEach((iframe: HTMLIFrameElement): void => {
        iframe.title = this.widgetIframeTitle;
      });
  }

  private observeInjectedIframes(): void {
    if (this.iframeObserver !== null) {
      return;
    }

    this.iframeObserver = new MutationObserver((): void => {
      this.ensureAccessibleIframeTitles();
    });

    this.iframeObserver.observe(this.document.body, {
      childList: true,
      subtree: true,
    });
  }
}
