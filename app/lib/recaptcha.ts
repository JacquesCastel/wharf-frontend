export type RecaptchaApi = {
  render: (container: HTMLElement, options: {
    sitekey: string;
    size: 'normal' | 'compact';
    callback: (token: string) => void;
    'expired-callback': () => void;
    'error-callback': () => void;
  }) => number;
  reset: (widget: number) => void;
};

declare global {
  interface Window {
    grecaptcha?: RecaptchaApi;
    wharfContactRecaptchaReady?: () => void;
  }
}

const pending = new WeakMap<Window, Promise<RecaptchaApi>>();

// One loader per page. A failed or blocked script can be retried.
export function loadRecaptcha(browser: Window = window): Promise<RecaptchaApi> {
  if (browser.grecaptcha?.render) return Promise.resolve(browser.grecaptcha);
  const existing = pending.get(browser);
  if (existing) return existing;

  const request = new Promise<RecaptchaApi>((resolve, reject) => {
    const script = browser.document.createElement('script');
    const fail = () => {
      browser.clearTimeout(timeout);
      delete browser.wharfContactRecaptchaReady;
      script.remove();
      pending.delete(browser);
      reject(new Error('reCAPTCHA unavailable'));
    };
    const timeout = browser.setTimeout(fail, 15000);
    browser.wharfContactRecaptchaReady = () => {
      if (!browser.grecaptcha?.render) { fail(); return; }
      browser.clearTimeout(timeout);
      delete browser.wharfContactRecaptchaReady;
      resolve(browser.grecaptcha);
    };
    script.src = 'https://www.google.com/recaptcha/api.js?onload=wharfContactRecaptchaReady&render=explicit&hl=fr';
    script.async = true;
    script.defer = true;
    script.onerror = fail;
    browser.document.head.appendChild(script);
  });
  pending.set(browser, request);
  return request;
}
