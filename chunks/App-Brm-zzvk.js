import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect } from "react";
import Typed from "typed.js";
import "react-dom";
import { Router, UNSAFE_NavigationContext, useHref, useResolvedPath, useLocation, UNSAFE_DataRouterStateContext, useNavigate, createPath, UNSAFE_useRouteId, UNSAFE_RouteContext, UNSAFE_DataRouterContext, Routes, Route } from "react-router";
import { createBrowserHistory, stripBasename, UNSAFE_warning, UNSAFE_invariant, joinPaths, matchPath } from "@remix-run/router";
import { BiSearch } from "react-icons/bi";
import { IoIosArrowForward } from "react-icons/io";
/**
 * React Router DOM v6.23.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}
const defaultMethod = "get";
const defaultEncType = "application/x-www-form-urlencoded";
function isHtmlElement(object) {
  return object != null && typeof object.tagName === "string";
}
function isButtonElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "button";
}
function isFormElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "form";
}
function isInputElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "input";
}
function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
function shouldProcessLinkClick(event, target) {
  return event.button === 0 && // Ignore everything but left clicks
  (!target || target === "_self") && // Let browser handle "target=_blank" etc.
  !isModifiedEvent(event);
}
let _formDataSupportsSubmitter = null;
function isFormDataSubmitterSupported() {
  if (_formDataSupportsSubmitter === null) {
    try {
      new FormData(
        document.createElement("form"),
        // @ts-expect-error if FormData supports the submitter parameter, this will throw
        0
      );
      _formDataSupportsSubmitter = false;
    } catch (e) {
      _formDataSupportsSubmitter = true;
    }
  }
  return _formDataSupportsSubmitter;
}
const supportedFormEncTypes = /* @__PURE__ */ new Set(["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"]);
function getFormEncType(encType) {
  if (encType != null && !supportedFormEncTypes.has(encType)) {
    process.env.NODE_ENV !== "production" ? UNSAFE_warning(false, '"' + encType + '" is not a valid `encType` for `<Form>`/`<fetcher.Form>` ' + ('and will default to "' + defaultEncType + '"')) : void 0;
    return null;
  }
  return encType;
}
function getFormSubmissionInfo(target, basename) {
  let method;
  let action;
  let encType;
  let formData;
  let body;
  if (isFormElement(target)) {
    let attr = target.getAttribute("action");
    action = attr ? stripBasename(attr, basename) : null;
    method = target.getAttribute("method") || defaultMethod;
    encType = getFormEncType(target.getAttribute("enctype")) || defaultEncType;
    formData = new FormData(target);
  } else if (isButtonElement(target) || isInputElement(target) && (target.type === "submit" || target.type === "image")) {
    let form = target.form;
    if (form == null) {
      throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');
    }
    let attr = target.getAttribute("formaction") || form.getAttribute("action");
    action = attr ? stripBasename(attr, basename) : null;
    method = target.getAttribute("formmethod") || form.getAttribute("method") || defaultMethod;
    encType = getFormEncType(target.getAttribute("formenctype")) || getFormEncType(form.getAttribute("enctype")) || defaultEncType;
    formData = new FormData(form, target);
    if (!isFormDataSubmitterSupported()) {
      let {
        name,
        type,
        value
      } = target;
      if (type === "image") {
        let prefix = name ? name + "." : "";
        formData.append(prefix + "x", "0");
        formData.append(prefix + "y", "0");
      } else if (name) {
        formData.append(name, value);
      }
    }
  } else if (isHtmlElement(target)) {
    throw new Error('Cannot submit element that is not <form>, <button>, or <input type="submit|image">');
  } else {
    method = defaultMethod;
    action = null;
    encType = defaultEncType;
    body = target;
  }
  if (formData && encType === "text/plain") {
    body = formData;
    formData = void 0;
  }
  return {
    action,
    method: method.toLowerCase(),
    encType,
    formData,
    body
  };
}
const _excluded = ["onClick", "relative", "reloadDocument", "replace", "state", "target", "to", "preventScrollReset", "unstable_viewTransition"], _excluded2 = ["aria-current", "caseSensitive", "className", "end", "style", "to", "unstable_viewTransition", "children"], _excluded3 = ["fetcherKey", "navigate", "reloadDocument", "replace", "state", "method", "action", "onSubmit", "relative", "preventScrollReset", "unstable_viewTransition"];
const REACT_ROUTER_VERSION = "6";
try {
  window.__reactRouterVersion = REACT_ROUTER_VERSION;
} catch (e) {
}
const ViewTransitionContext = /* @__PURE__ */ React.createContext({
  isTransitioning: false
});
if (process.env.NODE_ENV !== "production") {
  ViewTransitionContext.displayName = "ViewTransition";
}
const FetchersContext = /* @__PURE__ */ React.createContext(/* @__PURE__ */ new Map());
if (process.env.NODE_ENV !== "production") {
  FetchersContext.displayName = "Fetchers";
}
const START_TRANSITION = "startTransition";
const startTransitionImpl = React[START_TRANSITION];
function BrowserRouter(_ref4) {
  let {
    basename,
    children,
    future,
    window: window2
  } = _ref4;
  let historyRef = React.useRef();
  if (historyRef.current == null) {
    historyRef.current = createBrowserHistory({
      window: window2,
      v5Compat: true
    });
  }
  let history = historyRef.current;
  let [state, setStateImpl] = React.useState({
    action: history.action,
    location: history.location
  });
  let {
    v7_startTransition
  } = future || {};
  let setState = React.useCallback((newState) => {
    v7_startTransition && startTransitionImpl ? startTransitionImpl(() => setStateImpl(newState)) : setStateImpl(newState);
  }, [setStateImpl, v7_startTransition]);
  React.useLayoutEffect(() => history.listen(setState), [history, setState]);
  return /* @__PURE__ */ React.createElement(Router, {
    basename,
    children,
    location: state.location,
    navigationType: state.action,
    navigator: history,
    future
  });
}
if (process.env.NODE_ENV !== "production")
  ;
const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
const ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
const Link = /* @__PURE__ */ React.forwardRef(function LinkWithRef(_ref7, ref) {
  let {
    onClick,
    relative,
    reloadDocument,
    replace,
    state,
    target,
    to,
    preventScrollReset,
    unstable_viewTransition
  } = _ref7, rest = _objectWithoutPropertiesLoose(_ref7, _excluded);
  let {
    basename
  } = React.useContext(UNSAFE_NavigationContext);
  let absoluteHref;
  let isExternal = false;
  if (typeof to === "string" && ABSOLUTE_URL_REGEX.test(to)) {
    absoluteHref = to;
    if (isBrowser) {
      try {
        let currentUrl = new URL(window.location.href);
        let targetUrl = to.startsWith("//") ? new URL(currentUrl.protocol + to) : new URL(to);
        let path = stripBasename(targetUrl.pathname, basename);
        if (targetUrl.origin === currentUrl.origin && path != null) {
          to = path + targetUrl.search + targetUrl.hash;
        } else {
          isExternal = true;
        }
      } catch (e) {
        process.env.NODE_ENV !== "production" ? UNSAFE_warning(false, '<Link to="' + to + '"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.') : void 0;
      }
    }
  }
  let href = useHref(to, {
    relative
  });
  let internalOnClick = useLinkClickHandler(to, {
    replace,
    state,
    target,
    preventScrollReset,
    relative,
    unstable_viewTransition
  });
  function handleClick(event) {
    if (onClick)
      onClick(event);
    if (!event.defaultPrevented) {
      internalOnClick(event);
    }
  }
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    /* @__PURE__ */ React.createElement("a", _extends({}, rest, {
      href: absoluteHref || href,
      onClick: isExternal || reloadDocument ? onClick : handleClick,
      ref,
      target
    }))
  );
});
if (process.env.NODE_ENV !== "production") {
  Link.displayName = "Link";
}
const NavLink = /* @__PURE__ */ React.forwardRef(function NavLinkWithRef(_ref8, ref) {
  let {
    "aria-current": ariaCurrentProp = "page",
    caseSensitive = false,
    className: classNameProp = "",
    end = false,
    style: styleProp,
    to,
    unstable_viewTransition,
    children
  } = _ref8, rest = _objectWithoutPropertiesLoose(_ref8, _excluded2);
  let path = useResolvedPath(to, {
    relative: rest.relative
  });
  let location = useLocation();
  let routerState = React.useContext(UNSAFE_DataRouterStateContext);
  let {
    navigator,
    basename
  } = React.useContext(UNSAFE_NavigationContext);
  let isTransitioning = routerState != null && // Conditional usage is OK here because the usage of a data router is static
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useViewTransitionState(path) && unstable_viewTransition === true;
  let toPathname = navigator.encodeLocation ? navigator.encodeLocation(path).pathname : path.pathname;
  let locationPathname = location.pathname;
  let nextLocationPathname = routerState && routerState.navigation && routerState.navigation.location ? routerState.navigation.location.pathname : null;
  if (!caseSensitive) {
    locationPathname = locationPathname.toLowerCase();
    nextLocationPathname = nextLocationPathname ? nextLocationPathname.toLowerCase() : null;
    toPathname = toPathname.toLowerCase();
  }
  if (nextLocationPathname && basename) {
    nextLocationPathname = stripBasename(nextLocationPathname, basename) || nextLocationPathname;
  }
  const endSlashPosition = toPathname !== "/" && toPathname.endsWith("/") ? toPathname.length - 1 : toPathname.length;
  let isActive = locationPathname === toPathname || !end && locationPathname.startsWith(toPathname) && locationPathname.charAt(endSlashPosition) === "/";
  let isPending = nextLocationPathname != null && (nextLocationPathname === toPathname || !end && nextLocationPathname.startsWith(toPathname) && nextLocationPathname.charAt(toPathname.length) === "/");
  let renderProps = {
    isActive,
    isPending,
    isTransitioning
  };
  let ariaCurrent = isActive ? ariaCurrentProp : void 0;
  let className;
  if (typeof classNameProp === "function") {
    className = classNameProp(renderProps);
  } else {
    className = [classNameProp, isActive ? "active" : null, isPending ? "pending" : null, isTransitioning ? "transitioning" : null].filter(Boolean).join(" ");
  }
  let style = typeof styleProp === "function" ? styleProp(renderProps) : styleProp;
  return /* @__PURE__ */ React.createElement(Link, _extends({}, rest, {
    "aria-current": ariaCurrent,
    className,
    ref,
    style,
    to,
    unstable_viewTransition
  }), typeof children === "function" ? children(renderProps) : children);
});
if (process.env.NODE_ENV !== "production") {
  NavLink.displayName = "NavLink";
}
const Form = /* @__PURE__ */ React.forwardRef((_ref9, forwardedRef) => {
  let {
    fetcherKey,
    navigate,
    reloadDocument,
    replace,
    state,
    method = defaultMethod,
    action,
    onSubmit,
    relative,
    preventScrollReset,
    unstable_viewTransition
  } = _ref9, props = _objectWithoutPropertiesLoose(_ref9, _excluded3);
  let submit = useSubmit();
  let formAction = useFormAction(action, {
    relative
  });
  let formMethod = method.toLowerCase() === "get" ? "get" : "post";
  let submitHandler = (event) => {
    onSubmit && onSubmit(event);
    if (event.defaultPrevented)
      return;
    event.preventDefault();
    let submitter = event.nativeEvent.submitter;
    let submitMethod = (submitter == null ? void 0 : submitter.getAttribute("formmethod")) || method;
    submit(submitter || event.currentTarget, {
      fetcherKey,
      method: submitMethod,
      navigate,
      replace,
      state,
      relative,
      preventScrollReset,
      unstable_viewTransition
    });
  };
  return /* @__PURE__ */ React.createElement("form", _extends({
    ref: forwardedRef,
    method: formMethod,
    action: formAction,
    onSubmit: reloadDocument ? onSubmit : submitHandler
  }, props));
});
if (process.env.NODE_ENV !== "production") {
  Form.displayName = "Form";
}
if (process.env.NODE_ENV !== "production")
  ;
var DataRouterHook;
(function(DataRouterHook2) {
  DataRouterHook2["UseScrollRestoration"] = "useScrollRestoration";
  DataRouterHook2["UseSubmit"] = "useSubmit";
  DataRouterHook2["UseSubmitFetcher"] = "useSubmitFetcher";
  DataRouterHook2["UseFetcher"] = "useFetcher";
  DataRouterHook2["useViewTransitionState"] = "useViewTransitionState";
})(DataRouterHook || (DataRouterHook = {}));
var DataRouterStateHook;
(function(DataRouterStateHook2) {
  DataRouterStateHook2["UseFetcher"] = "useFetcher";
  DataRouterStateHook2["UseFetchers"] = "useFetchers";
  DataRouterStateHook2["UseScrollRestoration"] = "useScrollRestoration";
})(DataRouterStateHook || (DataRouterStateHook = {}));
function getDataRouterConsoleError(hookName) {
  return hookName + " must be used within a data router.  See https://reactrouter.com/routers/picking-a-router.";
}
function useDataRouterContext(hookName) {
  let ctx = React.useContext(UNSAFE_DataRouterContext);
  !ctx ? process.env.NODE_ENV !== "production" ? UNSAFE_invariant(false, getDataRouterConsoleError(hookName)) : UNSAFE_invariant(false) : void 0;
  return ctx;
}
function useLinkClickHandler(to, _temp) {
  let {
    target,
    replace: replaceProp,
    state,
    preventScrollReset,
    relative,
    unstable_viewTransition
  } = _temp === void 0 ? {} : _temp;
  let navigate = useNavigate();
  let location = useLocation();
  let path = useResolvedPath(to, {
    relative
  });
  return React.useCallback((event) => {
    if (shouldProcessLinkClick(event, target)) {
      event.preventDefault();
      let replace = replaceProp !== void 0 ? replaceProp : createPath(location) === createPath(path);
      navigate(to, {
        replace,
        state,
        preventScrollReset,
        relative,
        unstable_viewTransition
      });
    }
  }, [location, navigate, path, replaceProp, state, target, to, preventScrollReset, relative, unstable_viewTransition]);
}
function validateClientSideSubmission() {
  if (typeof document === "undefined") {
    throw new Error("You are calling submit during the server render. Try calling submit within a `useEffect` or callback instead.");
  }
}
let fetcherId = 0;
let getUniqueFetcherId = () => "__" + String(++fetcherId) + "__";
function useSubmit() {
  let {
    router
  } = useDataRouterContext(DataRouterHook.UseSubmit);
  let {
    basename
  } = React.useContext(UNSAFE_NavigationContext);
  let currentRouteId = UNSAFE_useRouteId();
  return React.useCallback(function(target, options) {
    if (options === void 0) {
      options = {};
    }
    validateClientSideSubmission();
    let {
      action,
      method,
      encType,
      formData,
      body
    } = getFormSubmissionInfo(target, basename);
    if (options.navigate === false) {
      let key = options.fetcherKey || getUniqueFetcherId();
      router.fetch(key, currentRouteId, options.action || action, {
        preventScrollReset: options.preventScrollReset,
        formData,
        body,
        formMethod: options.method || method,
        formEncType: options.encType || encType,
        unstable_flushSync: options.unstable_flushSync
      });
    } else {
      router.navigate(options.action || action, {
        preventScrollReset: options.preventScrollReset,
        formData,
        body,
        formMethod: options.method || method,
        formEncType: options.encType || encType,
        replace: options.replace,
        state: options.state,
        fromRouteId: currentRouteId,
        unstable_flushSync: options.unstable_flushSync,
        unstable_viewTransition: options.unstable_viewTransition
      });
    }
  }, [router, basename, currentRouteId]);
}
function useFormAction(action, _temp2) {
  let {
    relative
  } = _temp2 === void 0 ? {} : _temp2;
  let {
    basename
  } = React.useContext(UNSAFE_NavigationContext);
  let routeContext = React.useContext(UNSAFE_RouteContext);
  !routeContext ? process.env.NODE_ENV !== "production" ? UNSAFE_invariant(false, "useFormAction must be used inside a RouteContext") : UNSAFE_invariant(false) : void 0;
  let [match] = routeContext.matches.slice(-1);
  let path = _extends({}, useResolvedPath(action ? action : ".", {
    relative
  }));
  let location = useLocation();
  if (action == null) {
    path.search = location.search;
    let params = new URLSearchParams(path.search);
    if (params.has("index") && params.get("index") === "") {
      params.delete("index");
      path.search = params.toString() ? "?" + params.toString() : "";
    }
  }
  if ((!action || action === ".") && match.route.index) {
    path.search = path.search ? path.search.replace(/^\?/, "?index&") : "?index";
  }
  if (basename !== "/") {
    path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
  }
  return createPath(path);
}
function useViewTransitionState(to, opts) {
  if (opts === void 0) {
    opts = {};
  }
  let vtContext = React.useContext(ViewTransitionContext);
  !(vtContext != null) ? process.env.NODE_ENV !== "production" ? UNSAFE_invariant(false, "`unstable_useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?") : UNSAFE_invariant(false) : void 0;
  let {
    basename
  } = useDataRouterContext(DataRouterHook.useViewTransitionState);
  let path = useResolvedPath(to, {
    relative: opts.relative
  });
  if (!vtContext.isTransitioning) {
    return false;
  }
  let currentPath = stripBasename(vtContext.currentLocation.pathname, basename) || vtContext.currentLocation.pathname;
  let nextPath = stripBasename(vtContext.nextLocation.pathname, basename) || vtContext.nextLocation.pathname;
  return matchPath(path.pathname, nextPath) != null || matchPath(path.pathname, currentPath) != null;
}
const fondoHero = "/assets/fondoOserna2-CP5mWR-p.png";
const Hero = () => {
  let [renderCounter, setRenderCounter] = useState(0);
  const [animationState, setAnimationState] = useState("");
  useEffect(() => {
    setRenderCounter(renderCounter++);
    if (renderCounter > 1)
      return;
    StartTyped();
    StartAnimation();
  }, []);
  function StartTyped() {
    new Typed(".typed", {
      strings: [
        "satisfacer tus necesidades.",
        "soluciones eficientes.",
        "innovación.",
        "tecnologías.",
        "creatividad.",
        "atención al cliente.",
        "diseño gráfico.",
        "optimización.",
        "personalización.",
        "estratégias.",
        "experiencias.",
        "digitalización."
      ],
      typeSpeed: 35,
      backSpeed: 20,
      backDelay: 1250,
      loop: true,
      cursorChar: ""
    });
  }
  function StartAnimation() {
    setTimeout(() => {
      setAnimationState("ready");
    }, 10);
  }
  return /* @__PURE__ */ jsxs("section", { className: "hero", id: "Hero", children: [
    /* @__PURE__ */ jsxs("article", { className: `contentHero flex-cc ${animationState}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "information", children: [
        /* @__PURE__ */ jsxs("h3", { children: [
          "Especializados en ",
          /* @__PURE__ */ jsx("span", { id: "spanHeroInfo" }),
          /* @__PURE__ */ jsx("span", { className: "typed" })
        ] }),
        /* @__PURE__ */ jsx("p", { children: "Brindamos soluciones óptimas que te impulsarán hacia el éxito con la tecnología más innovadora." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "buttons flex-cc" })
    ] }),
    /* @__PURE__ */ jsx("article", { className: "imageHero", children: /* @__PURE__ */ jsx("img", { src: fondoHero, alt: "" }) })
  ] });
};
const HeroAgendarCita = () => {
  return /* @__PURE__ */ jsx("section", { className: "HeroAgendarCita", children: /* @__PURE__ */ jsxs("article", { className: "content", children: [
    /* @__PURE__ */ jsxs("div", { className: "information", children: [
      /* @__PURE__ */ jsx("h3", { children: "Estaremos esperandote, siempre disponibles para ti" }),
      /* @__PURE__ */ jsx("p", { children: "Comienza tu nueva historia junto a nosotros..." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "button", children: /* @__PURE__ */ jsx(Link, { to: `https://wa.me/5583574949/?text=¡Hola!, Me gustaría agendar una cita`, target: "_blank", children: /* @__PURE__ */ jsx("input", { type: "button", value: "¡Agenda una cita!" }) }) })
  ] }) });
};
const IconDesarrolloWeb = "/assets/web-BskNb83z.png";
const IconFotografiaVideologia = "/assets/camara-28VbgyTv.png";
const IconManejoComputadoras = "/assets/computadora-Cv-ue11h.png";
const IconDiseñoGrafico = "/assets/pluma-BIfGbNzD.png";
const IconMarketingDigital = "/assets/estadistica-Cy64S2b-.png";
const IconAppsMoviles = "/assets/android-Db0O349v.png";
const IconTierra = "/assets/tierra-C2kfm7M7.png";
const IconCaja = "/assets/caja-RJZHGaJw.png";
const IconApoyo = "/assets/apoyo-QGo1dpdi.png";
const IconGente = "/assets/gente-Aw6rHBIJ.png";
const IconEstrella = "/assets/marca-Cszmf6gO.png";
const IconCaptura = "/assets/capturar-Bsb0jIV0.png";
const IconAviso = "/assets/aviso-BNPBa5si.png";
const IconFeliz = "/assets/feliz-OV77l3zi.png";
const IconMantenimiento = "/assets/mantenimiento-D1ZgPwx2.png";
const IconDescarga = "/assets/descargar-8zAGqwUz.png";
const IconRapidez = "/assets/rapido-2I8p7F0m.png";
const IconBaseDatos = "/assets/base-de-datos-DVS2dz_E.png";
const IconCpu = "/assets/torre-de-la-cpu-DeaG7OeW.png";
const IconClientes = "/assets/cliente-q5VNlwP-.png";
const IconRompecabezas = "/assets/rompecabezas-Bb_gmiGZ.png";
const IconVentas = "/assets/ventas-BrBRYeo5.png";
const IconConfianza = "/assets/proteger-MVehM5UB.png";
const IconComentarios = "/assets/comentarios-5aIdkKLM.png";
const IconBeneficeService = "/assets/benefice-service-CdUgmO-o.png";
const IconTimeService = "/assets/time-service-DQXMmECM.png";
const FV_SesionesFotograficas = "/assets/sesiones-fotograficas-B6-WS7WQ.png";
const FV_ReunionesEmpresariales = "/assets/reuniones-empresariales-hhBvCSZn.png";
const FV_EventosPrivados = "/assets/eventos-privados-DM5yqv4_.png";
const FV_ProductosComerciales = "/assets/productos-comerciales-BpO4u954.png";
const FV_EventosSociales = "/assets/eventos-sociales-DA9ykbtm.png";
const MC_InstalacionOS = "/assets/instalacion-os-BeFCP_t8.png";
const MC_InstalacionSoftware = "/assets/instalacion-software-DMIvd1oA.png";
const MC_InstalacionHardware = "/assets/instalacion-hardware-DNTYMxJa.png";
const MC_MantenimientoPreventivo = "/assets/mantenimiento-prev-BzpyAV0Q.png";
const MC_MantenimientoCorrectivo = "/assets/mantenimiento-corr-zVA62LRP.png";
const MC_ArmadoComputo = "/assets/armado-computadora-BQnvY7KQ.png";
const MC_EliminacionVirus = "/assets/eliminacion-virus-CF4nTGXh.png";
const MC_RecuperacionArchivos = "/assets/recuperacion-archivos-DtLLsCao.png";
const MC_CapacitacionRemota = "/assets/capacitacion-remota-BUzgNHHa.png";
const DG_DiseñoLogotipos = "/assets/dise%C3%B1o-logotipos-DB_X5GKt.png";
const DG_DiseñoPublicitario = "/assets/dise%C3%B1o-publicitario-csvD69G3.png";
const DG_DiseñoWeb = "/assets/dise%C3%B1o-web-DHkrxaG6.png";
const DG_EdicionFotografias = "/assets/edicion-fotografias-C-daNwSN.png";
const DG_EdicionVideos = "/assets/edicion-videos-pZSB7h70.png";
const MD_ContenidoAudioVisual = "/assets/contenido-audiovisual-BJf9gANs.png";
const MD_CampañasPublicidad = "/assets/campa%C3%B1as-publicidad-Cbkis1Qw.png";
const MD_RedesSociales = "/assets/redes-sociales-Bb5T4eas.png";
const MD_PosicionamientoWeb = "/assets/posicionamiento-web-CFF4hkhN.png";
const MD_EmailMarketing = "/assets/email-marketing-BsxTI1x3.png";
const DA_AplicacionesWeb = "/assets/aplicaciones-web-BNBUro38.png";
const DA_AplicacionesEscritorio = "/assets/aplicaciones-escritorio-_5RoRh0i.png";
const DA_AplicacionesMoviles = "/assets/aplicaciones-moviles-DLOH_yEY.png";
const DA_Microservicios = "/assets/microservicios-CXXbb0MG.png";
const INDEX_SERVICES_CARDS = [
  {
    icon: IconDesarrolloWeb,
    name: "Desarrollo Web",
    description: /* @__PURE__ */ jsxs(Fragment, { children: [
      "Creamos sitios y aplicaciones web a medida, ",
      /* @__PURE__ */ jsx("b", { children: "rápidas, seguras y adaptables" }),
      " a cualquier dispositivo.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      "Desde ",
      /* @__PURE__ */ jsx("b", { children: "aplicaciones complejas" }),
      ", tiendas online, plataformas educativas y más, te ayudamos a tener una presencia online profesional que ",
      /* @__PURE__ */ jsx("b", { children: "impacte a tus clientes" }),
      " y te ayude a alcanzar ",
      /* @__PURE__ */ jsx("b", { children: "tus objetivos de negocio." })
    ] }),
    to: "/servicios/desarrollo-web"
  },
  {
    icon: IconFotografiaVideologia,
    name: "Fotografía y Videología",
    description: /* @__PURE__ */ jsxs(Fragment, { children: [
      "Capturamos la esencia de tu marca y tus productos con ",
      /* @__PURE__ */ jsx("b", { children: "imágenes y videos de alta calidad." }),
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      "Contamos con un equipo creativo y apasionado por contar historias a través de imágenes.",
      /* @__PURE__ */ jsx("br", {}),
      " ",
      /* @__PURE__ */ jsx("br", {}),
      "Desde fotos de productos hasta videos corporativos, ",
      /* @__PURE__ */ jsx("b", { children: " te ayudamos a conectar con tus clientes de una forma más emocional y memorable." })
    ] }),
    to: "/servicios/fotografia-y-videologia"
  },
  {
    icon: IconManejoComputadoras,
    name: "Manejo de Computadoras",
    description: /* @__PURE__ */ jsxs(Fragment, { children: [
      "En el mundo digital, ",
      /* @__PURE__ */ jsx("b", { children: "la tranquilidad y la eficiencia son esenciales" }),
      ".",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      "Con nuestro equipo de expertos en manejo de computadoras, ",
      /* @__PURE__ */ jsx("b", { children: "eliminamos las preocupaciones técnicas" }),
      " para que puedas concentrarte en lo que realmente importa: hacer ",
      /* @__PURE__ */ jsx("b", { children: "crecer tu negocio y tu productividad." })
    ] }),
    to: "/servicios/manejo-de-computadoras"
  },
  {
    icon: IconDiseñoGrafico,
    name: "Diseño Gráfico",
    description: /* @__PURE__ */ jsxs(Fragment, { children: [
      "Cada diseño cuenta una historia y comunica una visión única.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      "Con nuestra creatividad y experiencia en diseño gráfico, ",
      /* @__PURE__ */ jsx("b", { children: "transformamos conceptos en realidad visual" }),
      ".",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("b", { children: "Desde logotipos distintivos hasta campañas publicitarias impactantes" }),
      ", colaboramos contigo para ",
      /* @__PURE__ */ jsx("b", { children: "crear una identidad visual que te distinga" }),
      " en un mundo saturado de estímulos visuales."
    ] }),
    to: "/servicios/diseño-grafico"
  },
  {
    icon: IconMarketingDigital,
    name: "Marketing Digital",
    description: /* @__PURE__ */ jsxs(Fragment, { children: [
      "Implementamos ",
      /* @__PURE__ */ jsx("b", { children: "estrategias de marketing digital efectivas" }),
      " para aumentar tu visibilidad online, atraer nuevos clientes y fidelizar a los existentes.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      "Analizamos tu mercado objetivo y ",
      /* @__PURE__ */ jsx("b", { children: "creamos estrategias personalizadas" }),
      " para que puedas llegar a tus clientes potenciales de la forma más efectiva posible."
    ] }),
    to: "/servicios/marketing-digital"
  },
  {
    icon: IconAppsMoviles,
    name: "Desarrollo de Aplicaciones Móviles",
    description: /* @__PURE__ */ jsxs(Fragment, { children: [
      "Creamos aplicaciones móviles innovadoras y personalizadas que ",
      /* @__PURE__ */ jsx("b", { children: " te ayudan a conectar con tus clientes y mejorar la eficiencia de tu negocio." }),
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      "Te ofrecemos soluciones para ",
      /* @__PURE__ */ jsx("b", { children: "iOS y Android" }),
      ", desde apps simples hasta complejas plataformas móviles.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      "Trabajamos contigo para crear aplicaciones que sean ",
      /* @__PURE__ */ jsx("b", { children: "útiles, atractivas y que te ayuden a alcanzar tus objetivos." })
    ] }),
    to: "/servicios/desarrollo-apps-moviles"
  }
];
const SERVICES_BENEFICES = [
  {
    key: "desarrolloweb",
    benefices: [
      {
        icon: IconTierra,
        description: "Para mostrar tu negocio al mundo"
      },
      {
        icon: IconCaja,
        description: "Para vender tus servicios"
      },
      {
        icon: IconApoyo,
        description: "Para comunicarte con tus clientes"
      },
      {
        icon: IconGente,
        description: "Para construir una comunidad"
      },
      {
        icon: IconEstrella,
        description: "Para promocionar tu marca"
      }
    ]
  },
  {
    key: "fotografia-videologia",
    benefices: [
      {
        icon: IconCaptura,
        description: "Para capturar recuerdos"
      },
      {
        icon: IconAviso,
        description: "Para promocionar un negocio"
      },
      {
        icon: IconFeliz,
        description: "Para expresar emociones"
      }
    ]
  },
  {
    key: "manejo-computadoras",
    benefices: [
      {
        icon: IconMantenimiento,
        description: "Mantenimiento correctivo"
      },
      {
        icon: IconDescarga,
        description: "Instalación de software"
      },
      {
        icon: IconRapidez,
        description: "Optimización del rendimiento"
      },
      {
        icon: IconBaseDatos,
        description: "Recuperación y respaldo de datos"
      },
      {
        icon: IconCpu,
        description: "Armado de computadoras"
      },
      {
        icon: IconApoyo,
        description: "Soporte técnico remoto"
      }
    ]
  },
  {
    key: "diseño-grafico",
    benefices: [
      {
        icon: IconClientes,
        description: "Atraer la atención de tus clientes"
      },
      {
        icon: IconEstrella,
        description: "Una excelente presentación"
      },
      {
        icon: IconRompecabezas,
        description: "Construir una imagen a tu marca"
      },
      {
        icon: IconVentas,
        description: "Aumentar tu cantidad de ventas"
      },
      {
        icon: IconConfianza,
        description: "Generar confianza en tu empresa"
      },
      {
        icon: IconComentarios,
        description: "Mejorar la calidad de tus servicios"
      }
    ]
  },
  {
    key: "marketing-digital",
    benefices: [
      {
        icon: IconClientes,
        description: "Aumenta tu lista de clientes"
      },
      {
        icon: IconEstrella,
        description: "Atrae el tráfico a tu sitio web"
      },
      {
        icon: IconRompecabezas,
        description: "Aumenta tu popularidad"
      },
      {
        icon: IconVentas,
        description: "Aumenta tus ventas"
      },
      {
        icon: IconConfianza,
        description: "Genera confianza en tu empresa"
      },
      {
        icon: IconComentarios,
        description: "Crea comunidades con tu marca"
      }
    ]
  },
  {
    key: "desarrollo-aplicaciones",
    benefices: [
      {
        icon: IconClientes,
        description: "Atraer la atención de tus clientes"
      },
      {
        icon: IconEstrella,
        description: "Una excelente presentación"
      },
      {
        icon: IconRompecabezas,
        description: "Construir una imagen a tu marca"
      },
      {
        icon: IconVentas,
        description: "Aumentar tus ventas"
      },
      {
        icon: IconConfianza,
        description: "Genera confianza en tu empresa"
      },
      {
        icon: IconComentarios,
        description: "Mejorar la calidad de tus servicios"
      }
    ]
  }
];
const SERVICES$1 = [
  {
    key: "fotografia-videologia",
    services: [
      {
        title: "Sesiones fotográficas",
        background: FV_SesionesFotograficas,
        link: "wp"
      },
      {
        title: "Reuniones empresariales",
        background: FV_ReunionesEmpresariales,
        link: "wp"
      },
      {
        title: "Eventos privados",
        background: FV_EventosPrivados,
        link: "wp"
      },
      {
        title: "Productos comerciales",
        background: FV_ProductosComerciales,
        link: "wp"
      },
      {
        title: "Eventos sociales",
        background: FV_EventosSociales,
        link: "wp"
      }
    ]
  },
  {
    key: "manejo-computadoras",
    services: [
      {
        title: "Instalación de sistemas operativos",
        background: MC_InstalacionOS,
        link: "wp"
      },
      {
        title: "Instalación de software",
        background: MC_InstalacionSoftware,
        link: "wp"
      },
      {
        title: "Instalación de hardware",
        background: MC_InstalacionHardware,
        link: "wp"
      },
      {
        title: "Mantenimiento preventivo",
        background: MC_MantenimientoPreventivo,
        link: "wp"
      },
      {
        title: "Mantenimiento correctivo",
        background: MC_MantenimientoCorrectivo,
        link: "wp"
      },
      {
        title: "Armado de equipo de cómputo",
        background: MC_ArmadoComputo,
        link: "wp"
      },
      {
        title: "Eliminación de virus y malware",
        background: MC_EliminacionVirus,
        link: "wp"
      },
      {
        title: "Recuperación de archivos",
        background: MC_RecuperacionArchivos,
        link: "wp"
      },
      {
        title: "Capacitación remota",
        background: MC_CapacitacionRemota,
        link: "wp"
      }
    ]
  },
  {
    key: "diseño-grafico",
    services: [
      {
        title: "Diseño de logotipos",
        background: DG_DiseñoLogotipos,
        link: "wp"
      },
      {
        title: "Diseño publicitario",
        background: DG_DiseñoPublicitario,
        link: "wp"
      },
      {
        title: "Diseño web",
        background: DG_DiseñoWeb,
        link: "wp"
      },
      {
        title: "Edicion de fotografías",
        background: DG_EdicionFotografias,
        link: "wp"
      },
      {
        title: "Edicion de videos",
        background: DG_EdicionVideos,
        link: "wp"
      }
    ]
  },
  {
    key: "marketing-digital",
    services: [
      {
        title: "Contenido audio-visual",
        background: MD_ContenidoAudioVisual,
        link: "wp"
      },
      {
        title: "Campañas de publicidad",
        background: MD_CampañasPublicidad,
        link: "wp"
      },
      {
        title: "Gestión de redes sociales",
        background: MD_RedesSociales,
        link: "wp"
      },
      {
        title: "Posicionamiento web",
        background: MD_PosicionamientoWeb,
        link: "wp"
      },
      {
        title: "Email marketing",
        background: MD_EmailMarketing,
        link: "wp"
      }
    ]
  },
  {
    key: "desarrollo-aplicaciones",
    services: [
      {
        title: "Aplicaciones web",
        background: DA_AplicacionesWeb,
        link: "wp"
      },
      {
        title: "Aplicaciones de escritorio",
        background: DA_AplicacionesEscritorio,
        link: "wp"
      },
      {
        title: "Aplicaciones móviles",
        background: DA_AplicacionesMoviles,
        link: "wp"
      },
      {
        title: "Aplicaciones de micro-servicios",
        background: DA_Microservicios,
        link: "wp"
      }
    ]
  }
];
const CardOurServices = ({
  icon,
  name,
  description,
  to
}) => {
  return /* @__PURE__ */ jsx(Link, { to, children: /* @__PURE__ */ jsxs("li", { className: "CardOurServices", children: [
    /* @__PURE__ */ jsxs("div", { className: "title", children: [
      /* @__PURE__ */ jsx("img", { src: icon, alt: `Icono de servicio de ${name}` }),
      /* @__PURE__ */ jsx("h4", { children: name })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "description", children: /* @__PURE__ */ jsx("p", { children: description }) })
  ] }) });
};
const HeroOurServices = () => {
  function RenderServices() {
    return INDEX_SERVICES_CARDS.map((service, index) => /* @__PURE__ */ jsx(
      CardOurServices,
      {
        icon: service.icon,
        name: service.name,
        description: service.description,
        to: service.to
      },
      index
    ));
  }
  return /* @__PURE__ */ jsxs("section", { className: "HeroOurServices", id: "indexOurServices", children: [
    /* @__PURE__ */ jsx("h3", { children: "Nuestros servicios" }),
    /* @__PURE__ */ jsx("ul", { children: RenderServices() })
  ] });
};
const SERVICES = [
  { name: "Desarrollo Web" },
  { name: "Fotografía y Videología" },
  { name: "Manejo de Computadoras" },
  { name: "Diseño Gráfico" },
  { name: "Marketing Digital" },
  { name: "Desarrollo de Aplicaciones Móviles" }
];
const ServicesCard = ({ name }) => {
  return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("p", { children: name }) });
};
const ServicesHero = () => {
  let [renderCounter, setRenderCounter] = useState(0);
  let cardIndex = null;
  function renderServices() {
    return SERVICES.map((service, index) => /* @__PURE__ */ jsx(ServicesCard, { name: service.name }, index));
  }
  useEffect(() => {
    setRenderCounter(renderCounter++);
    if (renderCounter > 1)
      return;
    let TimeOut = 150;
    setInterval(() => {
      if (cardIndex === null)
        cardIndex = 0;
      else {
        if (cardIndex >= SERVICES.length - 1)
          return;
        cardIndex++;
      }
      SetReadyState(cardIndex);
    }, TimeOut);
  }, []);
  function SetReadyState(index) {
    const cards = document.querySelectorAll("section.servicesHero li");
    if (cards.length === 0)
      return;
    cards[index].classList.add("ready");
    setTimeout(() => {
      cards[index].setAttribute("style", "transition: 250ms ease;");
    }, 1e3);
  }
  return /* @__PURE__ */ jsx("section", { className: "servicesHero", children: /* @__PURE__ */ jsx("ul", { children: renderServices() }) });
};
const VideoSlogan = "/assets/videoSlogan-C1DJvcxk.mp4";
const HeroSlogan = () => {
  return /* @__PURE__ */ jsx("section", { className: "HeroSlogan", children: /* @__PURE__ */ jsxs("article", { className: "container", children: [
    /* @__PURE__ */ jsxs("div", { className: "information", children: [
      /* @__PURE__ */ jsxs("div", { className: "titles", children: [
        /* @__PURE__ */ jsxs("h3", { children: [
          "Impulsados por la pasión de",
          /* @__PURE__ */ jsx("br", {}),
          "hacer ",
          /* @__PURE__ */ jsx("span", { children: "tu proyecto una realidad" })
        ] }),
        /* @__PURE__ */ jsx("p", { children: "¡Conoce nuestros planes y empezemos a construir juntos!" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "button", children: /* @__PURE__ */ jsx("input", { type: "button", value: "Comenzar" }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "video", children: /* @__PURE__ */ jsx("video", { src: VideoSlogan, autoPlay: true, muted: true, loop: true }) })
  ] }) });
};
const IndexPage = () => {
  useEffect(() => {
    document.title = "Inicio | Oserna";
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Hero, {}),
    /* @__PURE__ */ jsx(ServicesHero, {}),
    /* @__PURE__ */ jsx(HeroSlogan, {}),
    /* @__PURE__ */ jsx(HeroOurServices, {}),
    /* @__PURE__ */ jsx(HeroAgendarCita, {})
  ] });
};
const HeaderRoute = ({ route }) => {
  function RenderRoute() {
    let correctRoute = "";
    if (route === "")
      return null;
    if (route.includes("-")) {
      route.split("-").forEach((element) => {
        correctRoute = `${correctRoute} ${element}`;
      });
    } else
      correctRoute = route;
    if (correctRoute.includes("%C3%B1")) {
      correctRoute = correctRoute.replace("%C3%B1", "ñ");
    }
    return /* @__PURE__ */ jsxs("li", { children: [
      /* @__PURE__ */ jsx(IoIosArrowForward, {}),
      /* @__PURE__ */ jsx("p", { children: correctRoute })
    ] });
  }
  return /* @__PURE__ */ jsx(Fragment, { children: RenderRoute() });
};
const Header = () => {
  let renderCounter = 0;
  const [headerState, setHeaderState] = useState("transparent");
  const [routes, setRoutes] = useState([]);
  const [isServicios, setIsServicios] = useState(false);
  const location = useLocation();
  function HandleAnimation() {
    const Hero2 = document.querySelector("section#Hero");
    if (Hero2 === null)
      return setHeaderState("opaque");
    const scrollY = window.scrollY;
    const MidHeight = Hero2.clientHeight * 0.75;
    if (scrollY < 10)
      return setHeaderState("transparent");
    if (scrollY < 20 || scrollY < MidHeight)
      return setHeaderState("blur");
    if (scrollY > MidHeight)
      return setHeaderState("opaque");
  }
  function RenderRoutes() {
    return routes.map((route, index) => /* @__PURE__ */ jsx(HeaderRoute, { route }, index));
  }
  useEffect(() => {
    renderCounter++;
    if (renderCounter > 1)
      return;
    window.addEventListener("scroll", HandleAnimation);
  }, []);
  useEffect(() => {
    setRoutes(location.pathname.split("/"));
    HandleAnimation();
    if (!isServicios)
      window.scroll({ top: 0 });
    setIsServicios(false);
  }, [location]);
  useEffect(() => {
    if (isServicios === false)
      return;
    const servicios = document.getElementById("indexOurServices");
    servicios == null ? void 0 : servicios.scrollIntoView({ behavior: "smooth" });
    setIsServicios(false);
  }, [isServicios]);
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("header", { className: `flex-bc ${headerState}`, children: [
    /* @__PURE__ */ jsxs("section", { className: "contentLogo", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", children: [
        /* @__PURE__ */ jsx("h1", { children: "Oserna" }),
        /* @__PURE__ */ jsx("p", { children: "- Desarrolladores Técnicos -" })
      ] }),
      /* @__PURE__ */ jsx("ul", { className: "", children: RenderRoutes() })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "contentUserOptions flex-cc", children: [
      /* @__PURE__ */ jsx("nav", { children: /* @__PURE__ */ jsxs("ul", { className: "menus flex-cc", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx("li", { className: "flex-cc", children: /* @__PURE__ */ jsx("p", { children: "Inicio" }) }) }),
        /* @__PURE__ */ jsx(Link, { to: "/", onClick: () => {
          setIsServicios(true);
        }, children: /* @__PURE__ */ jsx("li", { className: "flex-cc", children: /* @__PURE__ */ jsx("p", { children: "Servicios" }) }) }),
        /* @__PURE__ */ jsx(Link, { to: "/nosotros", children: /* @__PURE__ */ jsx("li", { className: "flex-cc", children: /* @__PURE__ */ jsx("p", { children: "Nosotros" }) }) }),
        /* @__PURE__ */ jsx(Link, { to: "/contacto", children: /* @__PURE__ */ jsx("li", { className: "flex-cc", children: /* @__PURE__ */ jsx("p", { children: "Contacto" }) }) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "imageSearch flex-cc", onClick: () => {
      }, children: /* @__PURE__ */ jsx(BiSearch, {}) })
    ] })
  ] }) });
};
const DescriptionServices = ({
  title,
  description,
  to,
  image
}) => {
  return /* @__PURE__ */ jsxs("section", { className: "DescriptionServices", children: [
    /* @__PURE__ */ jsxs("div", { className: "content", children: [
      /* @__PURE__ */ jsxs("h3", { children: [
        "¿Qué es el ",
        title,
        "?"
      ] }),
      /* @__PURE__ */ jsx("p", { children: description }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { children: [
          "¿Te interesaría saber más acerca de ",
          title.toLowerCase(),
          "?"
        ] }),
        /* @__PURE__ */ jsx(Link, { to, children: /* @__PURE__ */ jsx("input", { type: "button", value: "Conocer más" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "img",
      {
        src: image,
        alt: `Imagen representativa de ${title.toLowerCase()}`
      }
    )
  ] });
};
const HeroServices = ({
  title,
  slogan,
  background
}) => {
  return /* @__PURE__ */ jsxs("section", { className: "HeroServices", id: "Hero", children: [
    /* @__PURE__ */ jsxs("div", { className: "content", children: [
      /* @__PURE__ */ jsx("h2", { children: title }),
      /* @__PURE__ */ jsx("p", { children: slogan })
    ] }),
    /* @__PURE__ */ jsx(
      "img",
      {
        src: background,
        alt: `Fondo representativo de ${title.toLowerCase()}`
      }
    )
  ] });
};
const BackgroundHero = "/assets/desarrolloweb-hero-JBfyDod2.png";
const ImageDescription = "/assets/desarrolloweb-desc-DwLickS1.png";
const CardBenefices = ({ icon, description }) => {
  return /* @__PURE__ */ jsxs("li", { className: "CardBenefices", children: [
    /* @__PURE__ */ jsx("img", { src: icon, alt: "" }),
    /* @__PURE__ */ jsx("p", { children: description })
  ] });
};
const Benefices = ({ title, service }) => {
  const [benefices, setBenefices] = useState([]);
  function RenderBenefices() {
    return benefices.map((benefice, index) => /* @__PURE__ */ jsx(
      CardBenefices,
      {
        icon: benefice.icon,
        description: benefice.description
      },
      index
    ));
  }
  useEffect(() => {
    SERVICES_BENEFICES.forEach((benefice) => {
      if (benefice.key === service.toLowerCase().replace(" ", "")) {
        setBenefices(benefice.benefices);
      }
    });
  }, []);
  return /* @__PURE__ */ jsxs("section", { className: "Benefices", children: [
    /* @__PURE__ */ jsx("h3", { className: "TitleBenefices", children: title }),
    /* @__PURE__ */ jsx("ul", { className: "BeneficesList", children: RenderBenefices() })
  ] });
};
const SERVICES_PLANS = [
  {
    key: "desarrolloweb",
    plans: [
      {
        name: "Premium",
        price: "12,999",
        extra: /* @__PURE__ */ jsxs("p", { children: [
          "5",
          /* @__PURE__ */ jsx("span", { children: "secciones" })
        ] }),
        elements: [
          {
            type: "benefice",
            description: /* @__PURE__ */ jsx("p", { children: "Alojamiento Web (Web Hosting y SSL)" })
          },
          {
            type: "benefice",
            description: /* @__PURE__ */ jsx("p", { children: "Posicionamiento SEO" })
          },
          {
            type: "benefice",
            description: /* @__PURE__ */ jsxs("p", { children: [
              "Diseño ",
              /* @__PURE__ */ jsx("u", { children: "de plantilla" }),
              " y responsivo"
            ] })
          },
          {
            type: "benefice",
            description: /* @__PURE__ */ jsx("p", { children: "Emails corporativos" })
          },
          {
            type: "benefice",
            description: /* @__PURE__ */ jsxs("p", { children: [
              "Formularios ",
              /* @__PURE__ */ jsx("span", { children: "(1 formulario)" })
            ] })
          },
          {
            type: "benefice",
            description: /* @__PURE__ */ jsxs("p", { children: [
              "Bases de datos 1GB ",
              /* @__PURE__ */ jsx("span", { children: "(solo aplicables)" })
            ] })
          },
          {
            type: "benefice",
            description: /* @__PURE__ */ jsx("p", { children: "Reporte de visitas (1 al mes)" })
          },
          {
            type: "benefice",
            description: /* @__PURE__ */ jsx("p", { children: "Mantenimiento (1 vez al mes)" })
          },
          {
            type: "time",
            description: /* @__PURE__ */ jsx("p", { children: "Entrega de 3 a 4 semanas" })
          }
        ]
      },
      {
        name: "Elite",
        price: "18,999",
        extra: /* @__PURE__ */ jsxs("p", { children: [
          "10",
          /* @__PURE__ */ jsx("span", { children: "secciones" })
        ] }),
        elements: [
          {
            type: "benefice",
            description: /* @__PURE__ */ jsx("p", { children: "Alojamiento Web (Web Hosting y SSL)" })
          },
          {
            type: "benefice",
            description: /* @__PURE__ */ jsx("p", { children: "Posicionamiento SEO" })
          },
          {
            type: "benefice",
            description: /* @__PURE__ */ jsxs("p", { children: [
              "Diseño ",
              /* @__PURE__ */ jsx("u", { children: "personalizado" }),
              " y responsivo"
            ] })
          },
          {
            type: "benefice",
            description: /* @__PURE__ */ jsx("p", { children: "Emails corporativos" })
          },
          {
            type: "benefice",
            description: /* @__PURE__ */ jsxs("p", { children: [
              "Formularios ",
              /* @__PURE__ */ jsx("span", { children: "(3 formularios)" })
            ] })
          },
          {
            type: "benefice",
            description: /* @__PURE__ */ jsxs("p", { children: [
              "Bases de datos 2GB ",
              /* @__PURE__ */ jsx("span", { children: "(solo aplicables)" })
            ] })
          },
          {
            type: "benefice",
            description: /* @__PURE__ */ jsx("p", { children: "Reporte de visitas (3 al mes)" })
          },
          {
            type: "benefice",
            description: /* @__PURE__ */ jsx("p", { children: "Mantenimiento (3 veces al mes)" })
          },
          {
            type: "time",
            description: /* @__PURE__ */ jsx("p", { children: "Entrega de 4 a 5 semanas" })
          }
        ]
      },
      {
        name: "Ultimate",
        price: "23,999",
        extra: /* @__PURE__ */ jsxs("p", { children: [
          "15",
          /* @__PURE__ */ jsx("span", { children: "secciones" })
        ] }),
        elements: [
          {
            type: "benefice",
            description: /* @__PURE__ */ jsx("p", { children: "Alojamiento Web (Web Hosting y SSL)" })
          },
          {
            type: "benefice",
            description: /* @__PURE__ */ jsx("p", { children: "Posicionamiento SEO" })
          },
          {
            type: "benefice",
            description: /* @__PURE__ */ jsxs("p", { children: [
              "Diseño ",
              /* @__PURE__ */ jsx("u", { children: "personalizado" }),
              " y responsivo"
            ] })
          },
          {
            type: "benefice",
            description: /* @__PURE__ */ jsx("p", { children: "Emails corporativos" })
          },
          {
            type: "benefice",
            description: /* @__PURE__ */ jsxs("p", { children: [
              "Formularios ",
              /* @__PURE__ */ jsx("span", { children: "(6 formularios)" })
            ] })
          },
          {
            type: "benefice",
            description: /* @__PURE__ */ jsxs("p", { children: [
              "Bases de datos 3GB ",
              /* @__PURE__ */ jsx("span", { children: "(solo aplicables)" })
            ] })
          },
          {
            type: "benefice",
            description: /* @__PURE__ */ jsx("p", { children: "Reporte de visitas (5 al mes)" })
          },
          {
            type: "benefice",
            description: /* @__PURE__ */ jsx("p", { children: "Mantenimiento (6 veces al mes)" })
          },
          {
            type: "time",
            description: /* @__PURE__ */ jsx("p", { children: "Entrega de 4 a 5 semanas" })
          }
        ]
      }
    ]
  }
];
const CardPlanDark = ({
  name,
  price,
  extra,
  elements
}) => {
  function RenderElements() {
    return elements.map((element, index) => /* @__PURE__ */ jsxs("li", { children: [
      /* @__PURE__ */ jsx("img", { src: GetIconSearched(element.type), alt: "" }),
      element.description
    ] }, index));
  }
  function GetIconSearched(type) {
    switch (type) {
      case "benefice":
        return IconBeneficeService;
      case "time":
        return IconTimeService;
    }
  }
  return /* @__PURE__ */ jsxs("li", { className: "CardPlanDark", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { children: name }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("p", { children: [
          "Desde: $ ",
          /* @__PURE__ */ jsx("span", { children: price }),
          " ",
          /* @__PURE__ */ jsx("sub", { children: "MXN" })
        ] }) })
      ] }),
      extra
    ] }),
    /* @__PURE__ */ jsx("ul", { children: RenderElements() }),
    /* @__PURE__ */ jsx(Link, { to: "#", children: /* @__PURE__ */ jsx("input", { type: "button", value: `Contratar ${name}` }) })
  ] });
};
const ServicePlanDark = ({
  title,
  service,
  linkHelp,
  linkPersonalized
}) => {
  const [plans, setPlans] = useState([]);
  function RenderPlans() {
    return plans.map((plan, index) => /* @__PURE__ */ jsx(
      CardPlanDark,
      {
        name: plan.name,
        price: plan.price,
        extra: plan.extra,
        elements: plan.elements
      },
      index
    ));
  }
  useEffect(() => {
    SERVICES_PLANS.forEach((_service) => {
      if (_service.key === service)
        setPlans(_service.plans);
    });
  }, []);
  return /* @__PURE__ */ jsx("section", { className: "ServicePlanDark", children: /* @__PURE__ */ jsxs("article", { className: "content", children: [
    /* @__PURE__ */ jsx("h3", { children: title }),
    /* @__PURE__ */ jsx("ul", { children: RenderPlans() }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Link, { to: linkHelp, children: /* @__PURE__ */ jsx("input", { type: "button", value: "Ayudame a escoger" }) }),
      /* @__PURE__ */ jsx(Link, { to: linkPersonalized, children: /* @__PURE__ */ jsx("p", { children: "¿Buscas algo más grande o personalizado?" }) })
    ] })
  ] }) });
};
const DesarrolloWeb = () => {
  const title = "Desarrollo Web";
  useEffect(() => {
    document.title = "Desarrollo Web | Oserna";
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      HeroServices,
      {
        title,
        slogan: "Un sitio web seguro, llamativo, efectivo y con funciones especiales marcará la diferencia en tu negocio, empresa o portafolio.",
        background: BackgroundHero
      }
    ),
    /* @__PURE__ */ jsx(
      DescriptionServices,
      {
        title,
        description: /* @__PURE__ */ jsxs(Fragment, { children: [
          "Imagina tener una tienda abierta al mundo las 24 horas del día, 7 días a la semana, sin limitaciones de espacio o fronteras. Un lugar donde puedas ",
          /* @__PURE__ */ jsx("b", { children: "mostrar tus productos" }),
          ", ",
          /* @__PURE__ */ jsx("b", { children: "compartir ideas" }),
          ",",
          /* @__PURE__ */ jsx("b", { children: "conectar con clientes" }),
          " y ",
          /* @__PURE__ */ jsx("b", { children: "hacer crecer tu negocio" }),
          ".",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { children: "¡Eso es precisamente lo que te ofrece el desarrollo web!" })
        ] }),
        to: "/conocer/desarrollo-web",
        image: ImageDescription
      }
    ),
    /* @__PURE__ */ jsx(
      Benefices,
      {
        title: "¿Por qué elegir el desarrollo web?",
        service: "Desarrollo Web"
      }
    ),
    /* @__PURE__ */ jsx(
      ServicePlanDark,
      {
        title: "Dale un vistazo a nuestros planes",
        service: "desarrolloweb",
        linkHelp: "#",
        linkPersonalized: "#"
      }
    )
  ] });
};
const FacebookIcon = "/assets/facebook-C0Bd14EJ.png";
const InstagramIcon = "/assets/instagram-Ej9uLSTu.png";
const TelegramIcon = "/assets/telegram-CjOY47Y8.png";
const TikTokIcon = "/assets/tiktok-DrglLhyw.png";
const WhatsappIcon = "/assets/whatsapp-Cr7cG8vf.png";
const XIcon = "/assets/x-F_b8H9D3.png";
const YoutubeIcon = "/assets/youtube-15Akpyu9.png";
const Footer = () => {
  const phoneNumber = "5583574949";
  const linkWhatsApp = `https://wa.me/${phoneNumber}/`;
  return /* @__PURE__ */ jsx("footer", { children: /* @__PURE__ */ jsxs("section", { className: "topSection", children: [
    /* @__PURE__ */ jsxs("div", { className: "logo", children: [
      /* @__PURE__ */ jsxs("div", { className: "titles", children: [
        /* @__PURE__ */ jsx("h1", { children: "Oserna" }),
        /* @__PURE__ */ jsx("h2", { children: "- Desarrolladores Técnicos -" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "info", children: [
        /* @__PURE__ */ jsx("p", { children: "Somos una agencia digital especializada en resolver tus necesidades de la industria, el hogar y lo personal, abordando las ramas de: tecnología, marketing, programación y diseño gráfico." }),
        /* @__PURE__ */ jsx("p", { className: "slogan", children: "Somos tu mejor opción para alcanzar el éxito" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "servicios", children: [
      /* @__PURE__ */ jsx("h4", { children: "Servicios" }),
      /* @__PURE__ */ jsxs("ul", { children: [
        /* @__PURE__ */ jsx(Link, { to: "/servicios/desarrollo-web", children: /* @__PURE__ */ jsx("li", { children: "Desarrollo Web" }) }),
        /* @__PURE__ */ jsx(Link, { to: "/servicios/fotografia-y-videologia", children: /* @__PURE__ */ jsx("li", { children: "Fotografía y Videología" }) }),
        /* @__PURE__ */ jsx(Link, { to: "/servicios/manejo-de-computadoras", children: /* @__PURE__ */ jsx("li", { children: "Manejo de computadoras" }) }),
        /* @__PURE__ */ jsx(Link, { to: "/servicios/diseño-grafico", children: /* @__PURE__ */ jsx("li", { children: "Diseño Gráfico" }) }),
        /* @__PURE__ */ jsx(Link, { to: "/servicios/marketing-digital", children: /* @__PURE__ */ jsx("li", { children: "Marketing Digital" }) }),
        /* @__PURE__ */ jsx(Link, { to: "/servicios/desarrollo-apps-moviles", children: /* @__PURE__ */ jsx("li", { children: "Desarrollo de Aplicaciones Móviles" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "soporteTecnico", children: [
      /* @__PURE__ */ jsx("h4", { children: "Soporte Técnico" }),
      /* @__PURE__ */ jsxs("ul", { children: [
        /* @__PURE__ */ jsx(Link, { to: "/servicios/manejo-de-computadoras", children: /* @__PURE__ */ jsx("li", { children: "Mantenimiento de Computadoras." }) }),
        /* @__PURE__ */ jsx(Link, { to: "/servicios/manejo-de-computadoras", children: /* @__PURE__ */ jsx("li", { children: "Instalación de Software." }) }),
        /* @__PURE__ */ jsx(Link, { to: `${linkWhatsApp}?text=¡Hola!, Me gustaría cotizar el mantenimiento a sitios web.`, target: "_blank", children: /* @__PURE__ */ jsx("li", { children: "Mantenimiento a Sitios Web." }) }),
        /* @__PURE__ */ jsx(Link, { to: `${linkWhatsApp}?text=¡Hola!, Me gustaría cotizar la actualización en aplicaciones web.`, target: "_blank", children: /* @__PURE__ */ jsx("li", { children: "Actualizaciones a Aplicaciones Web." }) }),
        /* @__PURE__ */ jsx(Link, { to: `${linkWhatsApp}?text=¡Hola!, Lamentablemente tengo problemas con mi aplicacion o sitio web.`, target: "_blank", children: /* @__PURE__ */ jsx("li", { children: "Problemas en mi aplicación o sitio web." }) }),
        /* @__PURE__ */ jsx(Link, { to: `${linkWhatsApp}?text=¡Hola!, Lamentablemente tengo problemas con el seguimiento de mi servicio.`, target: "_blank", children: /* @__PURE__ */ jsx("li", { children: "Problemas con el seguimiento de mi servicio." }) }),
        /* @__PURE__ */ jsx(Link, { to: `${linkWhatsApp}?text=¡Hola!, Lamentablemente tengo problemas con el seguimiento de pago de mi servicio.`, target: "_blank", children: /* @__PURE__ */ jsx("li", { children: "Problemas con el seguimiento de pago de mi servicio." }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "redesSociales", children: [
      /* @__PURE__ */ jsx("h4", { children: "Redes Sociales" }),
      /* @__PURE__ */ jsxs("ul", { children: [
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, { to: "https://www.facebook.com/osernamx", target: "_blank", children: [
          /* @__PURE__ */ jsx("img", { src: FacebookIcon, alt: "Facebook - Oserna" }),
          /* @__PURE__ */ jsx("p", { children: "Facebook" })
        ] }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, { to: "", children: [
          /* @__PURE__ */ jsx("img", { src: InstagramIcon, alt: "Instagram - Oserna" }),
          /* @__PURE__ */ jsx("p", { children: "Instagram" })
        ] }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, { to: "", children: [
          /* @__PURE__ */ jsx("img", { src: TikTokIcon, alt: "Tik Tok - Oserna" }),
          /* @__PURE__ */ jsx("p", { children: "Tik Tok" })
        ] }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, { to: "", children: [
          /* @__PURE__ */ jsx("img", { src: YoutubeIcon, alt: "YouTube - Oserna" }),
          /* @__PURE__ */ jsx("p", { children: "YouTube" })
        ] }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, { to: "", children: [
          /* @__PURE__ */ jsx("img", { src: WhatsappIcon, alt: "WhatsApp - Oserna" }),
          /* @__PURE__ */ jsx("p", { children: "WhatsApp" })
        ] }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, { to: "", children: [
          /* @__PURE__ */ jsx("img", { src: XIcon, alt: "X - Oserna" }),
          /* @__PURE__ */ jsx("p", { children: "X" })
        ] }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, { to: "", children: [
          /* @__PURE__ */ jsx("img", { src: TelegramIcon, alt: "Telegram - Oserna" }),
          /* @__PURE__ */ jsx("p", { children: "Telegram" })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mensaje", children: [
      /* @__PURE__ */ jsx("h4", { children: "Dejanos un mensaje" }),
      /* @__PURE__ */ jsx("p", { children: "Te contactaremos lo más pronto posible" }),
      /* @__PURE__ */ jsxs("div", { className: "inputs", children: [
        /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Correo electrónico o teléfono", autoComplete: "email" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            cols: 30,
            rows: 10,
            placeholder: "Escribenos tu mensaje..."
          }
        ),
        /* @__PURE__ */ jsx("input", { type: "button", value: "Enviar mensaje" })
      ] })
    ] })
  ] }) });
};
const HeroImage$4 = "/assets/desarrolloaplicaciones-hero-CW0BH-rT.png";
const DescriptionImage$4 = "/assets/desarrolloaplicaciones-desc-D7s76fkn.png";
const CardService = ({ title, background, link }) => {
  const phoneNumber = "5583574949";
  const message = `¡Hola!, Me interesaria saber más acerca del servicio de ${title.toLowerCase()}`;
  function GetLink(link2) {
    return link2 === "wp" ? `https://wa.me/${phoneNumber}/?text=${message}` : "";
  }
  return /* @__PURE__ */ jsx(Link, { to: GetLink(link), target: "_blank", children: /* @__PURE__ */ jsxs("li", { className: "CardService", children: [
    /* @__PURE__ */ jsx("div", { className: "title", children: /* @__PURE__ */ jsx("h3", { children: title }) }),
    /* @__PURE__ */ jsx("div", { className: "backgroundLayer", children: /* @__PURE__ */ jsx("img", { src: background, alt: "" }) })
  ] }) });
};
const Services = ({
  title,
  service
}) => {
  const [services, setServices] = useState([]);
  function RenderServices() {
    return services.map((service2, index) => /* @__PURE__ */ jsx(
      CardService,
      {
        title: service2.title,
        background: service2.background,
        link: service2.link
      },
      index
    ));
  }
  useEffect(() => {
    SERVICES$1.forEach((_service) => {
      if (_service.key === service)
        setServices(_service.services);
    });
  }, []);
  return /* @__PURE__ */ jsxs("section", { className: "Services", children: [
    /* @__PURE__ */ jsx("h3", { children: title }),
    /* @__PURE__ */ jsx("ul", { children: RenderServices() })
  ] });
};
const DesarrolloAplicaciones = () => {
  const title = "Desarrollo de aplicaciones";
  useEffect(() => {
    document.title = "Desarrollo de Aplicaciones | Oserna";
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      HeroServices,
      {
        title,
        slogan: "Optimiza procesos internos y mejora la interacción con tus clientes, adapta tu empresa a la era digital y ofrece comodidad y accesibilidad a tus usuarios",
        background: HeroImage$4
      }
    ),
    /* @__PURE__ */ jsx(
      DescriptionServices,
      {
        title,
        description: /* @__PURE__ */ jsxs(Fragment, { children: [
          "El desarrollo de aplicaciones es el arte de ",
          /* @__PURE__ */ jsx("b", { children: "convertir ideas digitales en software funcional y atractivo." }),
          " Es un proceso que abarca desde ",
          /* @__PURE__ */ jsx("b", { children: "la idea hasta la implementación." }),
          " Ya sea que busques crear una ",
          /* @__PURE__ */ jsx("b", { children: "aplicación web" }),
          " para gestionar tu negocio, una ",
          /* @__PURE__ */ jsx("b", { children: "app móvil" }),
          " para ofrecer servicios a tus clientes o una ",
          /* @__PURE__ */ jsx("b", { children: "herramienta de escritorio" }),
          " para ",
          /* @__PURE__ */ jsx("b", { children: "optimizar tu trabajo" }),
          ", te brinda la posibilidad de materializar tus ideas y llevarlas al mundo digital."
        ] }),
        to: "/conocer/desarrollo-de-aplicaciones",
        image: DescriptionImage$4
      }
    ),
    /* @__PURE__ */ jsx(
      Benefices,
      {
        title: "¿Como puede beneficiarme?",
        service: "desarrollo-aplicaciones"
      }
    ),
    /* @__PURE__ */ jsx(
      Services,
      {
        title: "Conoce nuestras modalidades",
        service: "desarrollo-aplicaciones"
      }
    )
  ] });
};
const HeroImage$3 = "/assets/fotovideo-hero-qXY9p27t.png";
const DescriptionImage$3 = "/assets/fotovideo-desc-BbdgDba_.png";
const FotografiaVideologia = () => {
  const title = "Fotografía y videología";
  useEffect(() => {
    document.title = "Fotografía y Videología | Oserna";
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      HeroServices,
      {
        title,
        slogan: "Capturamos la esencia de tu marca y tus productos con imágenes y videos de alta calidad.",
        background: HeroImage$3
      }
    ),
    /* @__PURE__ */ jsx(
      DescriptionServices,
      {
        title,
        description: /* @__PURE__ */ jsxs(Fragment, { children: [
          "Imagina poder congelar el tiempo y preservar los recuerdos más preciados en imágenes y videos vibrantes que te transporten de regreso a esos instantes especiales. Eso es precisamente lo que ofrece la fotografía y la videografía: ",
          /* @__PURE__ */ jsx("b", { children: "la magia de capturar la esencia de un momento, una emoción, una historia." })
        ] }),
        to: "",
        image: DescriptionImage$3
      }
    ),
    /* @__PURE__ */ jsx(
      Benefices,
      {
        title: "¿Como puede beneficiarme?",
        service: "fotografia-videologia"
      }
    ),
    /* @__PURE__ */ jsx(
      Services,
      {
        title: "Observa nuestras modalidades",
        service: "fotografia-videologia"
      }
    )
  ] });
};
const HeroImage$2 = "/assets/manejocomp-hero-CYOyUeqi.png";
const DescriptionImage$2 = "/assets/manejocomp-desc-BuMc0OrX.png";
const ManejoComputadoras = () => {
  const title = "Manejo de computadoras";
  useEffect(() => {
    document.title = "Manejo de Computadoras | Oserna";
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      HeroServices,
      {
        title,
        slogan: "Un equipo de trabajo que es rápido, eficiente y multitareas te hará ser el más proactivo y eficaz.",
        background: HeroImage$2
      }
    ),
    /* @__PURE__ */ jsx(
      DescriptionServices,
      {
        title,
        description: /* @__PURE__ */ jsxs(Fragment, { children: [
          "El manejo de computadoras va más allá del uso básico. Abarca una serie de actividades escenciales para su buen funcionamiento, optimización y personalización Entre estos destacan: ",
          /* @__PURE__ */ jsx("b", { children: "mantenimiento preventivo y correctivo, reparación, armado y modificación, instalación de software, seguridad de la información y capacitaciones." })
        ] }),
        to: "/conocer/manejo-de-computadoras",
        image: DescriptionImage$2
      }
    ),
    /* @__PURE__ */ jsx(
      Benefices,
      {
        title: "¿Como puede beneficiarme?",
        service: "manejo-computadoras"
      }
    ),
    /* @__PURE__ */ jsx(
      Services,
      {
        title: "Conoce nuestras modalidades",
        service: "manejo-computadoras"
      }
    )
  ] });
};
const HeroImage$1 = "/assets/dise%C3%B1ografico-hero-DTnzUsfY.png";
const DescriptionImage$1 = "/assets/dise%C3%B1ografico-desc-CAduFF2Q.png";
const DiseñoGrafico = () => {
  const title = "Diseño gráfico";
  useEffect(() => {
    document.title = "Diseño Gráfico | Oserna";
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      HeroServices,
      {
        title,
        slogan: "El diseño gráfico es una disciplina que combina la creatividad, la técnica y la tecnología para crear soluciones visuales que comuniquen mensajes, ideas y emociones.",
        background: HeroImage$1
      }
    ),
    /* @__PURE__ */ jsx(
      DescriptionServices,
      {
        title,
        description: /* @__PURE__ */ jsxs(Fragment, { children: [
          "El diseño gráfico implica un proceso creativo que comienza con la definición del problema o la necesidad a comunicar. Luego, ",
          /* @__PURE__ */ jsx("b", { children: "se desarrollan ideas y conceptos" }),
          " a través de bocetos, prototipos y pruebas de diseño. Finalmente, se crea el ",
          /* @__PURE__ */ jsx("b", { children: "producto final" }),
          " utilizando herramientas digitales y técnicas de producción."
        ] }),
        to: "",
        image: DescriptionImage$1
      }
    ),
    /* @__PURE__ */ jsx(
      Benefices,
      {
        title: "¿Qué me ofrece el diseño gráfico?",
        service: "diseño-grafico"
      }
    ),
    /* @__PURE__ */ jsx(
      Services,
      {
        title: "Conoce nuestras modalidades",
        service: "diseño-grafico"
      }
    )
  ] });
};
const HeroImage = "/assets/marketingdigital-hero-CrEhWiv7.png";
const DescriptionImage = "/assets/marketingdigital-desc-C446WLB-.png";
const MarketingDigital = () => {
  const title = "Marketing digital";
  useEffect(() => {
    document.title = "Marketing Digital | Oserna";
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      HeroServices,
      {
        title,
        slogan: "Date a conocer ante tus actuales y futuros clientes mediante redes sociales, con la ayuda del contenido audiovisual, anuncios, banners y publicaciones altamente virales",
        background: HeroImage
      }
    ),
    /* @__PURE__ */ jsx(
      DescriptionServices,
      {
        title,
        description: /* @__PURE__ */ jsxs(Fragment, { children: [
          "Implementamos ",
          /* @__PURE__ */ jsx("b", { children: "estrategias" }),
          " de marketing digital efectivas para ",
          /* @__PURE__ */ jsx("b", { children: "aumentar tu visibilidad online, atraer nuevos clientes y fidelizar a los existentes." }),
          " Te ayudamos a alcanzar tus objetivos de negocio a través de ",
          /* @__PURE__ */ jsx("b", { children: "SEO, SEM, redes sociales, email marketing y más." }),
          " Analizamos tu mercado objetivo y creamos estrategias personalizadas para que puedas llegar a tus clientes potenciales de la forma más efectiva posible."
        ] }),
        to: "/conocer/marketing-digital",
        image: DescriptionImage
      }
    ),
    /* @__PURE__ */ jsx(
      Benefices,
      {
        title: "Qué me ofrece el marketing digital?",
        service: "marketing-digital"
      }
    ),
    /* @__PURE__ */ jsx(
      Services,
      {
        title: "Conoce nuestras modalidades",
        service: "marketing-digital"
      }
    )
  ] });
};
const Page404 = () => {
  return /* @__PURE__ */ jsx("section", { className: "Page404", children: /* @__PURE__ */ jsx("article", { children: "404 no encontrado" }) });
};
function App() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs(Routes, { children: [
      /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(IndexPage, {}) }),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/servicios/desarrollo-web",
          element: /* @__PURE__ */ jsx(DesarrolloWeb, {})
        }
      ),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/servicios/fotografia-y-videologia",
          element: /* @__PURE__ */ jsx(FotografiaVideologia, {})
        }
      ),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/servicios/manejo-de-computadoras",
          element: /* @__PURE__ */ jsx(ManejoComputadoras, {})
        }
      ),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/servicios/diseño-grafico",
          element: /* @__PURE__ */ jsx(DiseñoGrafico, {})
        }
      ),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/servicios/marketing-digital",
          element: /* @__PURE__ */ jsx(MarketingDigital, {})
        }
      ),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/servicios/desarrollo-apps-moviles",
          element: /* @__PURE__ */ jsx(DesarrolloAplicaciones, {})
        }
      ),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/nosotros",
          element: /* @__PURE__ */ jsx(Fragment, {})
        }
      ),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "*",
          element: /* @__PURE__ */ jsx(Page404, {})
        }
      )
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  App as A,
  BrowserRouter as B
};
