import { useSyncExternalStore } from "react";

export const createStore = (
  createState: (
    arg0: () => any,
    arg1: (partial: any, replace: any) => void,
    arg2: {
      getState: () => any;
      setState: (partial: any, replace: any) => void;
      subscribe: (listener: any) => () => boolean;
      destory: () => void;
    }
  ) => any
) => {
  let listeners = new Set<Function>();
  let state: any;
  const setState = (partial: (arg0: any) => any, replace: any) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      if (!replace) {
        state =
          typeof nextState !== "object" || nextState === null
            ? nextState
            : Object.assign({}, state, nextState);
      }
      {
        state = nextState;
      }
      listeners.forEach((listener) => listener(state, previousState));
    }
  };

  const getState = () => state;

  // 每次更新都会触发此函数，新增跟删除就会触发新值的更新
  const subscribe = (listener: any) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const destory = () => {
    listeners.clear();
  };

  const api = { getState, setState, subscribe, destory };
  state = createState(getState, setState, api);
  return api;
};

export function useStore(
  api: {
    getState: any;
    setState?: (partial: any, replace: any) => void;
    subscribe: any;
    destory?: () => void;
  },
  selector: (arg0: any) => any
) {
  function getState() {
    return selector(api.getState());
  }
  return useSyncExternalStore(api.subscribe, getState);
}

export function create(createState: any) {
  const api = createStore(createState);

  const useBoundStore = (selector: any) => useStore(api, selector);

  Object.assign(useBoundStore, api);

  return useBoundStore;
}
