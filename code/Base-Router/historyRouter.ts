export default class HistoryRouter {
  private routers = new Map<string, Function>();
  private home: string = "/";
  constructor() {
    this.listenLinkClick();
    this.listenPopState();
  }
  private listenPopState() {
    window.addEventListener("popstate", this.handleCallback.bind(this), false);
  }
  private listenLinkClick() {
    window.addEventListener(
      "click",
      (e) => {
        const target = e.target;
        if (
          target?.tagName.toUpperCase() === "A" &&
          target?.getAttribute("href")
        ) {
          e.preventDefault();
          this.pushState({}, "", target.getAttribute("href"));
        }
      },
      false
    );
  }
  register(path: string, callback: Function) {
    this.routers.set(path, callback);
  }
  revoke(path: string) {
    this.routers.delete(path);
  }
  revokeAll() {
    this.routers.clear();
  }
  pushState(state: Record<string, any>, title: string, path: string) {
    history.pushState(state, title, path);
    this.handleCallback();
  }
  replaceState(state: Record<string, any>, title: string, path: string) {
    history.replaceState(state, title, path);
    this.handleCallback();
  }
  private handleCallback() {
    const hash = location.hash.slice(1);
    let handle;
    if (!!hash) {
      handle = this.routers.get(hash);
    } else {
      handle = this.routers.get(this.home) || this.NotFound;
    }
    try {
      handle?.call(this);
    } catch (error) {
      console.log(error);
      (this.routers.get("error") || function () {}).call(this);
    }
  }
  private NotFound() {
    return "404 Not Found";
  }
}
