export default class HashRouter {
  private routers = new Map<string, Function>();
  private home: string = "/";
  constructor() {
    window.addEventListener(
      "hashchange",
      this.handleCallback.bind(this),
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
  private handleCallback() {
    const hash = location.hash.slice(1);
    let handle: Function | undefined;
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
