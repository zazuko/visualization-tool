module.exports = (function(e, t) {
  var n = {};
  function __webpack_require__(t) {
    if (n[t]) {
      return n[t].exports;
    }
    var r = (n[t] = { i: t, l: false, exports: {} });
    e[t].call(r.exports, r, r.exports, __webpack_require__);
    r.l = true;
    return r.exports;
  }
  __webpack_require__.ab = __dirname + "/";
  function startup() {
    return __webpack_require__(325);
  }
  return startup();
})({
  202: function(e, t) {
    Object.defineProperty(t, "__esModule", { value: true });
    const n = new WeakMap();
    let r = 0;
    function hash(e) {
      let t = "arg";
      for (let u = 0; u < e.length; ++u) {
        let i;
        if (typeof e[u] !== "object") {
          i = String(e[u]);
        } else {
          if (!n.has(e[u])) {
            i = r;
            n.set(e[u], r++);
          } else {
            i = n.get(e[u]);
          }
        }
        t += "@" + i;
      }
      return t;
    }
    t.default = hash;
  },
  205: function(e, t) {
    Object.defineProperty(t, "__esModule", { value: true });
    function isOnline() {
      if (typeof navigator.onLine !== "undefined") {
        return navigator.onLine;
      }
      return true;
    }
    t.default = isOnline;
  },
  209: function(e, t, n) {
    Object.defineProperty(t, "__esModule", { value: true });
    const r = n(297);
    const u = r.createContext({});
    u.displayName = "SWRConfigContext";
    t.default = u;
  },
  297: function(e) {
    e.exports = require("react");
  },
  325: function(e, t, n) {
    function __export(e) {
      for (var n in e) if (!t.hasOwnProperty(n)) t[n] = e[n];
    }
    var r =
      (this && this.__importDefault) ||
      function(e) {
        return e && e.__esModule ? e : { default: e };
      };
    Object.defineProperty(t, "__esModule", { value: true });
    __export(n(516));
    const u = r(n(516));
    var i = n(926);
    t.useSWRPages = i.useSWRPages;
    t.default = u.default;
  },
  337: function(e, t, n) {
    Object.defineProperty(t, "__esModule", { value: true });
    const r = n(297);
    let u = true;
    function useHydration() {
      r.useEffect(() => {
        setTimeout(() => {
          u = false;
        }, 1);
      }, []);
      return u;
    }
    t.default = useHydration;
  },
  459: function(e, t) {
    Object.defineProperty(t, "__esModule", { value: true });
    function isDocumentVisible() {
      if (
        typeof document !== "undefined" &&
        typeof document.visibilityState !== "undefined"
      ) {
        return document.visibilityState !== "hidden";
      }
      return true;
    }
    t.default = isDocumentVisible;
  },
  516: function(e, t, n) {
    var r =
      (this && this.__importDefault) ||
      function(e) {
        return e && e.__esModule ? e : { default: e };
      };
    var u =
      (this && this.__importStar) ||
      function(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (e !== null)
          for (var n in e) if (Object.hasOwnProperty.call(e, n)) t[n] = e[n];
        t["default"] = e;
        return t;
      };
    Object.defineProperty(t, "__esModule", { value: true });
    const i = n(297);
    const o = r(n(832));
    const s = u(n(641));
    const f = r(n(209));
    const c = r(n(459));
    const a = r(n(337));
    const l = r(n(542));
    const d = r(n(202));
    const R = typeof window === "undefined";
    const S = R ? i.useEffect : i.useLayoutEffect;
    const _ = e => (e ? "err@" + e : "");
    const p = e => {
      let t = null;
      if (typeof e === "function") {
        try {
          e = e();
        } catch (t) {
          e = "";
        }
      }
      if (Array.isArray(e)) {
        t = e;
        e = d.default(e);
      } else {
        e = String(e || "");
      }
      return [e, t];
    };
    const O = (e, t = true) => {
      const [n] = p(e);
      if (!n) return;
      const r = s.CACHE_REVALIDATORS[n];
      if (n && r) {
        const e = s.cacheGet(n);
        const u = s.cacheGet(_(n));
        for (let n = 0; n < r.length; ++n) {
          r[n](t, e, u);
        }
      }
    };
    t.trigger = O;
    const E = (e, t, n) => {
      const r = s.CACHE_REVALIDATORS[e];
      if (e && r) {
        for (let e = 0; e < r.length; ++e) {
          r[e](false, t, n);
        }
      }
    };
    const h = async (e, t, n) => {
      const [r] = p(e);
      if (!r) return;
      s.MUTATION_TS[r] = Date.now() - 1;
      let u, i;
      if (t && typeof t.then === "function") {
        try {
          u = await t;
        } catch (e) {
          i = e;
        }
      } else {
        u = t;
        if (typeof n === "undefined") {
          n = true;
        }
      }
      if (typeof u !== "undefined") {
        s.cacheSet(r, u);
      }
      const o = s.CACHE_REVALIDATORS[r];
      if (o) {
        for (let e = 0; e < o.length; ++e) {
          o[e](!!n, u, i);
        }
      }
    };
    t.mutate = h;
    function mergeState(e, t) {
      return { ...e, ...t };
    }
    function useSWR(...e) {
      let t,
        n,
        r = {};
      if (e.length >= 1) {
        t = e[0];
      }
      if (typeof e[1] === "function") {
        n = e[1];
      } else if (typeof e[1] === "object") {
        r = e[1];
      }
      if (typeof e[2] === "object") {
        r = e[2];
      }
      const [u, d] = p(t);
      const O = _(u);
      r = Object.assign({}, s.default, i.useContext(f.default), r);
      if (typeof n === "undefined") {
        n = r.fetcher;
      }
      const h = r.suspense || !a.default();
      const C = (h ? s.cacheGet(u) : undefined) || r.initialData;
      const T = h ? s.cacheGet(O) : undefined;
      let [v, y] = i.useReducer(mergeState, {
        data: C,
        error: T,
        isValidating: false
      });
      const I = i.useRef(false);
      const g = i.useRef(u);
      const M = i.useRef(C);
      const A = i.useRef(T);
      const N = i.useCallback(
        async (e = {}) => {
          if (!u || !n) return false;
          if (I.current) return false;
          e = Object.assign({ dedupe: false }, e);
          let t = true;
          let i = typeof s.CONCURRENT_PROMISES[u] !== "undefined" && e.dedupe;
          try {
            y({ isValidating: true });
            let f;
            let c;
            if (i) {
              c = s.CONCURRENT_PROMISES_TS[u];
              f = await s.CONCURRENT_PROMISES[u];
            } else {
              if (r.loadingTimeout && !s.cacheGet(u)) {
                setTimeout(() => {
                  if (t) r.onLoadingSlow(u, r);
                }, r.loadingTimeout);
              }
              if (d !== null) {
                s.CONCURRENT_PROMISES[u] = n(...d);
              } else {
                s.CONCURRENT_PROMISES[u] = n(u);
              }
              s.CONCURRENT_PROMISES_TS[u] = c = Date.now();
              setTimeout(() => {
                delete s.CONCURRENT_PROMISES[u];
                delete s.CONCURRENT_PROMISES_TS[u];
              }, r.dedupingInterval);
              f = await s.CONCURRENT_PROMISES[u];
              r.onSuccess(f, u, r);
            }
            if (s.MUTATION_TS[u] && c <= s.MUTATION_TS[u]) {
              y({ isValidating: false });
              return false;
            }
            s.cacheSet(u, f);
            s.cacheSet(O, undefined);
            g.current = u;
            const a = { isValidating: false };
            if (typeof A.current !== "undefined") {
              a.error = undefined;
              A.current = undefined;
            }
            if (o.default(M.current, f)) {
            } else {
              a.data = f;
              M.current = f;
            }
            y(a);
            if (!i) {
              E(u, f, undefined);
            }
          } catch (t) {
            delete s.CONCURRENT_PROMISES[u];
            delete s.CONCURRENT_PROMISES_TS[u];
            s.cacheSet(O, t);
            g.current = u;
            if (A.current !== t) {
              A.current = t;
              y({ isValidating: false, error: t });
              if (!i) {
                E(u, undefined, t);
              }
            }
            r.onError(t, u, r);
            if (r.shouldRetryOnError) {
              const n = (e.retryCount || 0) + 1;
              r.onErrorRetry(
                t,
                u,
                r,
                N,
                Object.assign({ dedupe: true }, e, { retryCount: n })
              );
            }
          }
          t = false;
          return true;
        },
        [u]
      );
      S(() => {
        if (!u) return undefined;
        I.current = false;
        const e = M.current;
        const t = s.cacheGet(u) || r.initialData;
        if (g.current !== u || !o.default(e, t)) {
          y({ data: t });
          M.current = t;
          g.current = u;
        }
        const n = () => N({ dedupe: true });
        if (typeof t !== "undefined" && !R && window["requestIdleCallback"]) {
          window["requestIdleCallback"](n);
        } else {
          n();
        }
        let i;
        if (r.revalidateOnFocus) {
          i = l.default(n, r.focusThrottleInterval);
          if (!s.FOCUS_REVALIDATORS[u]) {
            s.FOCUS_REVALIDATORS[u] = [i];
          } else {
            s.FOCUS_REVALIDATORS[u].push(i);
          }
        }
        const f = (e = true, t, r) => {
          const i = {};
          if (typeof t !== "undefined" && !o.default(M.current, t)) {
            i.data = t;
            M.current = t;
          }
          if (A.current !== r) {
            i.error = r;
            A.current = r;
          }
          y(i);
          g.current = u;
          if (e) {
            return n();
          }
          return false;
        };
        if (!s.CACHE_REVALIDATORS[u]) {
          s.CACHE_REVALIDATORS[u] = [f];
        } else {
          s.CACHE_REVALIDATORS[u].push(f);
        }
        let a = null;
        if (r.refreshInterval) {
          const e = async () => {
            if (!A.current && (r.refreshWhenHidden || c.default())) {
              await n();
            }
            const t = r.refreshInterval;
            a = setTimeout(e, t);
          };
          a = setTimeout(e, r.refreshInterval);
        }
        return () => {
          y = () => null;
          I.current = true;
          if (i && s.FOCUS_REVALIDATORS[u]) {
            const e = s.FOCUS_REVALIDATORS[u];
            const t = e.indexOf(i);
            if (t >= 0) {
              e[t] = e[e.length - 1];
              e.pop();
            }
          }
          if (s.CACHE_REVALIDATORS[u]) {
            const e = s.CACHE_REVALIDATORS[u];
            const t = e.indexOf(f);
            if (t >= 0) {
              e[t] = e[e.length - 1];
              e.pop();
            }
          }
          if (a !== null) {
            clearTimeout(a);
          }
        };
      }, [u, r.refreshInterval, N]);
      if (r.suspense) {
        if (R) throw new Error("Suspense on server side is not yet supported!");
        let e = s.cacheGet(u);
        let t = s.cacheGet(O);
        if (typeof e === "undefined" && typeof t === "undefined") {
          if (!s.CONCURRENT_PROMISES[u]) {
            N();
          }
          if (
            s.CONCURRENT_PROMISES[u] &&
            typeof s.CONCURRENT_PROMISES[u].then === "function"
          ) {
            throw s.CONCURRENT_PROMISES[u];
          }
          e = s.CONCURRENT_PROMISES[u];
        }
        if (typeof e === "undefined" && t) {
          throw t;
        }
        return {
          error: t,
          data: e,
          revalidate: N,
          isValidating: v.isValidating
        };
      }
      return {
        error: v.error,
        data: g.current === u ? v.data : undefined,
        revalidate: N,
        isValidating: v.isValidating
      };
    }
    const C = f.default.Provider;
    t.SWRConfig = C;
    t.default = useSWR;
  },
  542: function(e, t) {
    Object.defineProperty(t, "__esModule", { value: true });
    function throttle(e, t) {
      let n = false;
      return (...r) => {
        if (n) return;
        n = true;
        e(...r);
        setTimeout(() => (n = false), t);
      };
    }
    t.default = throttle;
  },
  641: function(e, t, n) {
    var r =
      (this && this.__importDefault) ||
      function(e) {
        return e && e.__esModule ? e : { default: e };
      };
    Object.defineProperty(t, "__esModule", { value: true });
    const u = r(n(459));
    const i = r(n(205));
    const o = new Map();
    function cacheGet(e) {
      return o.get(e) || undefined;
    }
    t.cacheGet = cacheGet;
    function cacheSet(e, t) {
      return o.set(e, t);
    }
    t.cacheSet = cacheSet;
    function cacheClear() {
      o.clear();
    }
    t.cacheClear = cacheClear;
    const s = {};
    t.CONCURRENT_PROMISES = s;
    const f = {};
    t.CONCURRENT_PROMISES_TS = f;
    const c = {};
    t.FOCUS_REVALIDATORS = c;
    const a = {};
    t.CACHE_REVALIDATORS = a;
    const l = {};
    t.MUTATION_TS = l;
    function onErrorRetry(e, t, n, r, i) {
      if (!u.default()) {
        return;
      }
      const o = Math.min(i.retryCount || 0, 8);
      const s = ~~((Math.random() + 0.5) * (1 << o)) * n.errorRetryInterval;
      setTimeout(r, s, i);
    }
    const d = {
      onLoadingSlow: () => {},
      onSuccess: () => {},
      onError: () => {},
      onErrorRetry: onErrorRetry,
      errorRetryInterval: 5 * 1e3,
      focusThrottleInterval: 5 * 1e3,
      dedupingInterval: 2 * 1e3,
      loadingTimeout: 3 * 1e3,
      refreshInterval: 0,
      revalidateOnFocus: true,
      refreshWhenHidden: false,
      shouldRetryOnError: true,
      suspense: false
    };
    if (typeof window !== "undefined") {
      if (navigator["connection"]) {
        if (
          ["slow-2g", "2g"].indexOf(navigator["connection"].effectiveType) !==
          -1
        ) {
          d.errorRetryInterval = 10 * 1e3;
          d.loadingTimeout = 5 * 1e3;
        }
      }
    }
    let R = false;
    if (typeof window !== "undefined" && window.addEventListener && !R) {
      const e = () => {
        if (!u.default() || !i.default()) return;
        for (let e in c) {
          if (c[e][0]) c[e][0]();
        }
      };
      window.addEventListener("visibilitychange", e, false);
      window.addEventListener("focus", e, false);
      R = true;
    }
    t.default = d;
  },
  832: function(e) {
    var t = Array.isArray;
    var n = Object.keys;
    var r = Object.prototype.hasOwnProperty;
    e.exports = function equal(e, u) {
      if (e === u) return true;
      if (e && u && typeof e == "object" && typeof u == "object") {
        var i = t(e),
          o = t(u),
          s,
          f,
          c;
        if (i && o) {
          f = e.length;
          if (f !== u.length) return false;
          for (s = f; s-- !== 0; ) if (!equal(e[s], u[s])) return false;
          return true;
        }
        if (i !== o) return false;
        var a = e instanceof Date,
          l = u instanceof Date;
        if (a !== l) return false;
        if (a && l) return e.getTime() === u.getTime();
        var d = e instanceof RegExp,
          R = u instanceof RegExp;
        if (d !== R) return false;
        if (d && R) return e.toString() === u.toString();
        var S = n(e);
        f = S.length;
        if (f !== n(u).length) return false;
        for (s = f; s-- !== 0; ) if (!r.call(u, S[s])) return false;
        for (s = f; s-- !== 0; ) {
          c = S[s];
          if (!equal(e[c], u[c])) return false;
        }
        return true;
      }
      return e !== e && u !== u;
    };
  },
  926: function(e, t, n) {
    var r =
      (this && this.__importStar) ||
      function(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (e !== null)
          for (var n in e) if (Object.hasOwnProperty.call(e, n)) t[n] = e[n];
        t["default"] = e;
        return t;
      };
    Object.defineProperty(t, "__esModule", { value: true });
    const u = r(n(297));
    const i = n(641);
    function useSWRPages(e, t, n, r = []) {
      const o = `_swr_page_count_` + e;
      const s = `_swr_page_offset_` + e;
      const [f, c] = u.useState(i.cacheGet(o) || 1);
      const [a, l] = u.useState(i.cacheGet(s) || [null]);
      const [d, R] = u.useState([]);
      const S = u.useRef([]);
      const _ = u.useRef(t);
      const p = u.useRef(false);
      const O = u.useCallback(e => {
        const t = _.current(e);
        if (t && !t.length) {
          p.current = true;
        } else {
          p.current = false;
        }
        return t;
      }, []);
      const E = a[f] === null;
      const h = f === a.length;
      const C = E && f === 1 && p.current;
      const T = u.useCallback(() => {
        if (h || E) return;
        c(e => {
          i.cacheSet(o, e + 1);
          return e + 1;
        });
      }, [h || E]);
      const v = u.useCallback(t, r);
      _.current = v;
      const y = u.useMemo(() => {
        const e = e => t => {
          if (
            !d[e] ||
            d[e].data !== t.data ||
            d[e].error !== t.error ||
            d[e].revalidate !== t.revalidate
          ) {
            R(n => {
              const r = [...n];
              r[e] = t;
              return r;
            });
            if (typeof t.data !== "undefined") {
              const r = n(t, e);
              if (a[e + 1] !== r) {
                l(t => {
                  const n = [...t];
                  n[e + 1] = r;
                  i.cacheSet(s, n);
                  return n;
                });
              }
            }
          }
          return t;
        };
        const t = [];
        const r = S.current;
        for (let n = 0; n < f; ++n) {
          if (!r[n] || r[n].offset !== a[n] || r[n].pageFn !== v) {
            r[n] = {
              component: u.default.createElement(O, {
                key: `page-${a[n]}-${n}`,
                offset: a[n],
                withSWR: e(n)
              }),
              pageFn: v,
              offset: a[n]
            };
          }
          t.push(r[n].component);
        }
        return t;
      }, [v, f, d, a, e]);
      return {
        pages: y,
        pageCount: f,
        pageSWRs: d,
        isLoadingMore: h,
        isReachingEnd: E,
        isEmpty: C,
        loadMore: T
      };
    }
    t.useSWRPages = useSWRPages;
  }
});
