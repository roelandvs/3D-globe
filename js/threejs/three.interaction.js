import * as THREE from "./three.module.js";
(function (t, o) {
    "use strict";
    function i(t) {
        return Object.prototype.toString.call(t);
    }
    const r = {
        isFunction: (function () {
            const e = i(function () {});
            return function (t) {
                return i(t) === e;
            };
        })(),
        isUndefined(t) {
            return void 0 === t;
        },
    };
    (o.EventDispatcher.prototype.on = function (t, e) {
        if (r.isFunction(e))
            return (
                this instanceof o.Object3D && (this.interactive = !0),
                this.addEventListener(t, e),
                this
            );
    }),
        (o.EventDispatcher.prototype.off = function (t, e) {
            return this.removeEventListener(t, e), this;
        }),
        (o.EventDispatcher.prototype.once = function (e, i) {
            if (r.isFunction(i)) {
                const n = (t) => {
                    i(t), this.off(e, n);
                };
                return this.on(e, n), this;
            }
        }),
        (o.EventDispatcher.prototype.emit = function (t, ...e) {
            if (
                void 0 !== this._listeners &&
                !r.isUndefined(this._listeners[t])
            ) {
                const i = this._listeners[t] || [],
                    n = i.slice(0);
                for (let t = 0; t < n.length; t++) n[t].apply(this, e);
                return this;
            }
        }),
        (o.Object3D.prototype.interactive = !1),
        (o.Object3D.prototype.interactiveChildren = !0),
        (o.Object3D.prototype.started = !1),
        Object.defineProperty(o.Object3D.prototype, "trackedPointers", {
            get() {
                return (
                    this._trackedPointers || (this._trackedPointers = {}),
                    this._trackedPointers
                );
            },
        }),
        (o.Object3D.prototype.raycastTest = function (t) {
            var e = [];
            return this.raycast(t, e), 0 < e.length && e[0];
        });
    class s {
        constructor() {
            (this.global = new o.Vector2()),
                (this.target = null),
                (this.originalEvent = null),
                (this.identifier = null),
                (this.isPrimary = !1),
                (this.button = 0),
                (this.buttons = 0),
                (this.width = 0),
                (this.height = 0),
                (this.tiltX = 0),
                (this.tiltY = 0),
                (this.pointerType = null),
                (this.pressure = 0),
                (this.rotationAngle = 0),
                (this.twist = 0),
                (this.tangentialPressure = 0);
        }
        get pointerId() {
            return this.identifier;
        }
        _copyEvent(t) {
            t.isPrimary && (this.isPrimary = !0),
                (this.button = t.button),
                (this.buttons = t.buttons),
                (this.width = t.width),
                (this.height = t.height),
                (this.tiltX = t.tiltX),
                (this.tiltY = t.tiltY),
                (this.pointerType = t.pointerType),
                (this.pressure = t.pressure),
                (this.rotationAngle = t.rotationAngle),
                (this.twist = t.twist || 0),
                (this.tangentialPressure = t.tangentialPressure || 0);
        }
        _reset() {
            this.isPrimary = !1;
        }
    }
    class a {
        constructor() {
            (this.stopped = !1),
                (this.target = null),
                (this.currentTarget = null),
                (this.type = null),
                (this.data = null),
                (this.intersects = []);
        }
        stopPropagation() {
            this.stopped = !0;
        }
        _reset() {
            (this.stopped = !1),
                (this.currentTarget = null),
                (this.target = null),
                (this.intersects = []);
        }
    }
    class h {
        constructor(t) {
            (this._pointerId = t), (this._flags = h.FLAGS.NONE);
        }
        _doSet(t, e) {
            this._flags = e ? this._flags | t : this._flags & ~t;
        }
        get pointerId() {
            return this._pointerId;
        }
        get flags() {
            return this._flags;
        }
        set flags(t) {
            this._flags = t;
        }
        get none() {
            return this._flags === this.constructor.FLAGS.NONE;
        }
        get over() {
            return 0 != (this._flags & this.constructor.FLAGS.OVER);
        }
        set over(t) {
            this._doSet(this.constructor.FLAGS.OVER, t);
        }
        get rightDown() {
            return 0 != (this._flags & this.constructor.FLAGS.RIGHT_DOWN);
        }
        set rightDown(t) {
            this._doSet(this.constructor.FLAGS.RIGHT_DOWN, t);
        }
        get leftDown() {
            return 0 != (this._flags & this.constructor.FLAGS.LEFT_DOWN);
        }
        set leftDown(t) {
            this._doSet(this.constructor.FLAGS.LEFT_DOWN, t);
        }
    }
    h.FLAGS = Object.freeze({ NONE: 0, OVER: 1, LEFT_DOWN: 2, RIGHT_DOWN: 4 });
    const c = "MOUSE",
        n = { target: null, data: { global: null } };
    class e extends o.EventDispatcher {
        constructor(t, e, i, n) {
            super(),
                (n = n || {}),
                (this.renderer = t),
                (this.scene = e),
                (this.camera = i),
                (this.autoPreventDefault = n.autoPreventDefault || !1),
                (this.interactionFrequency = n.interactionFrequency || 10),
                (this.mouse = new s()),
                (this.mouse.identifier = c),
                this.mouse.global.set(-999999),
                (this.activeInteractionData = {}),
                (this.activeInteractionData[c] = this.mouse),
                (this.interactionDataPool = []),
                (this.eventData = new a()),
                (this.interactionDOMElement = null),
                (this.moveWhenInside = !0),
                (this.eventsAdded = !1),
                (this.mouseOverRenderer = !1),
                (this.supportsTouchEvents = "ontouchstart" in window),
                (this.supportsPointerEvents = !!window.PointerEvent),
                (this.onClick = this.onClick.bind(this)),
                (this.processClick = this.processClick.bind(this)),
                (this.onPointerUp = this.onPointerUp.bind(this)),
                (this.processPointerUp = this.processPointerUp.bind(this)),
                (this.onPointerCancel = this.onPointerCancel.bind(this)),
                (this.processPointerCancel =
                    this.processPointerCancel.bind(this)),
                (this.onPointerDown = this.onPointerDown.bind(this)),
                (this.processPointerDown = this.processPointerDown.bind(this)),
                (this.onPointerMove = this.onPointerMove.bind(this)),
                (this.processPointerMove = this.processPointerMove.bind(this)),
                (this.onPointerOut = this.onPointerOut.bind(this)),
                (this.processPointerOverOut =
                    this.processPointerOverOut.bind(this)),
                (this.onPointerOver = this.onPointerOver.bind(this)),
                (this.cursorStyles = {
                    default: "inherit",
                    pointer: "pointer",
                }),
                (this.currentCursorMode = null),
                (this.cursor = null),
                (this.raycaster = new o.Raycaster()),
                (this._deltaTime = 0),
                this.setTargetElement(this.renderer.domElement);
        }
        hitTest(t, e) {
            return (
                (n.target = null),
                (n.data.global = t),
                (e = e || this.scene),
                this.processInteractive(n, e, null, !0),
                n.target
            );
        }
        setTargetElement(t) {
            this.removeEvents(),
                (this.interactionDOMElement = t),
                this.addEvents();
        }
        addEvents() {
            this.interactionDOMElement &&
                !this.eventsAdded &&
                (this.emit("addevents"),
                this.interactionDOMElement.addEventListener(
                    "click",
                    this.onClick,
                    !0
                ),
                window.navigator.msPointerEnabled
                    ? ((this.interactionDOMElement.style[
                          "-ms-content-zooming"
                      ] = "none"),
                      (this.interactionDOMElement.style["-ms-touch-action"] =
                          "none"))
                    : this.supportsPointerEvents &&
                      (this.interactionDOMElement.style["touch-action"] =
                          "none"),
                this.supportsPointerEvents
                    ? (window.document.addEventListener(
                          "pointermove",
                          this.onPointerMove,
                          !0
                      ),
                      this.interactionDOMElement.addEventListener(
                          "pointerdown",
                          this.onPointerDown,
                          !0
                      ),
                      this.interactionDOMElement.addEventListener(
                          "pointerleave",
                          this.onPointerOut,
                          !0
                      ),
                      this.interactionDOMElement.addEventListener(
                          "pointerover",
                          this.onPointerOver,
                          !0
                      ),
                      window.addEventListener(
                          "pointercancel",
                          this.onPointerCancel,
                          !0
                      ),
                      window.addEventListener(
                          "pointerup",
                          this.onPointerUp,
                          !0
                      ))
                    : (window.document.addEventListener(
                          "mousemove",
                          this.onPointerMove,
                          !0
                      ),
                      this.interactionDOMElement.addEventListener(
                          "mousedown",
                          this.onPointerDown,
                          !0
                      ),
                      this.interactionDOMElement.addEventListener(
                          "mouseout",
                          this.onPointerOut,
                          !0
                      ),
                      this.interactionDOMElement.addEventListener(
                          "mouseover",
                          this.onPointerOver,
                          !0
                      ),
                      window.addEventListener("mouseup", this.onPointerUp, !0)),
                this.supportsTouchEvents &&
                    (this.interactionDOMElement.addEventListener(
                        "touchstart",
                        this.onPointerDown,
                        !0
                    ),
                    this.interactionDOMElement.addEventListener(
                        "touchcancel",
                        this.onPointerCancel,
                        !0
                    ),
                    this.interactionDOMElement.addEventListener(
                        "touchend",
                        this.onPointerUp,
                        !0
                    ),
                    this.interactionDOMElement.addEventListener(
                        "touchmove",
                        this.onPointerMove,
                        !0
                    )),
                (this.eventsAdded = !0));
        }
        removeEvents() {
            this.interactionDOMElement &&
                (this.emit("removeevents"),
                this.interactionDOMElement.removeEventListener(
                    "click",
                    this.onClick,
                    !0
                ),
                window.navigator.msPointerEnabled
                    ? ((this.interactionDOMElement.style[
                          "-ms-content-zooming"
                      ] = ""),
                      (this.interactionDOMElement.style["-ms-touch-action"] =
                          ""))
                    : this.supportsPointerEvents &&
                      (this.interactionDOMElement.style["touch-action"] = ""),
                this.supportsPointerEvents
                    ? (window.document.removeEventListener(
                          "pointermove",
                          this.onPointerMove,
                          !0
                      ),
                      this.interactionDOMElement.removeEventListener(
                          "pointerdown",
                          this.onPointerDown,
                          !0
                      ),
                      this.interactionDOMElement.removeEventListener(
                          "pointerleave",
                          this.onPointerOut,
                          !0
                      ),
                      this.interactionDOMElement.removeEventListener(
                          "pointerover",
                          this.onPointerOver,
                          !0
                      ),
                      window.removeEventListener(
                          "pointercancel",
                          this.onPointerCancel,
                          !0
                      ),
                      window.removeEventListener(
                          "pointerup",
                          this.onPointerUp,
                          !0
                      ))
                    : (window.document.removeEventListener(
                          "mousemove",
                          this.onPointerMove,
                          !0
                      ),
                      this.interactionDOMElement.removeEventListener(
                          "mousedown",
                          this.onPointerDown,
                          !0
                      ),
                      this.interactionDOMElement.removeEventListener(
                          "mouseout",
                          this.onPointerOut,
                          !0
                      ),
                      this.interactionDOMElement.removeEventListener(
                          "mouseover",
                          this.onPointerOver,
                          !0
                      ),
                      window.removeEventListener(
                          "mouseup",
                          this.onPointerUp,
                          !0
                      )),
                this.supportsTouchEvents &&
                    (this.interactionDOMElement.removeEventListener(
                        "touchstart",
                        this.onPointerDown,
                        !0
                    ),
                    this.interactionDOMElement.removeEventListener(
                        "touchcancel",
                        this.onPointerCancel,
                        !0
                    ),
                    this.interactionDOMElement.removeEventListener(
                        "touchend",
                        this.onPointerUp,
                        !0
                    ),
                    this.interactionDOMElement.removeEventListener(
                        "touchmove",
                        this.onPointerMove,
                        !0
                    )),
                (this.interactionDOMElement = null),
                (this.eventsAdded = !1));
        }
        update({ snippet: t }) {
            if (
                ((this._deltaTime += t),
                !(this._deltaTime < this.interactionFrequency) &&
                    ((this._deltaTime = 0), this.interactionDOMElement))
            )
                if (this.didMove) this.didMove = !1;
                else {
                    this.cursor = null;
                    for (const i in this.activeInteractionData) {
                        var e;
                        !this.activeInteractionData.hasOwnProperty(i) ||
                            ((e = this.activeInteractionData[i])
                                .originalEvent &&
                                "touch" !== e.pointerType &&
                                ((e = this.configureInteractionEventForDOMEvent(
                                    this.eventData,
                                    e.originalEvent,
                                    e
                                )),
                                this.processInteractive(
                                    e,
                                    this.scene,
                                    this.processPointerOverOut,
                                    !0
                                )));
                    }
                    this.setCursorMode(this.cursor);
                }
        }
        setCursorMode(t) {
            if (this.currentCursorMode !== (t = t || "default")) {
                this.currentCursorMode = t;
                const e = this.cursorStyles[t];
                if (e)
                    switch (typeof e) {
                        case "string":
                            this.interactionDOMElement.style.cursor = e;
                            break;
                        case "function":
                            e(t);
                            break;
                        case "object":
                            Object.assign(this.interactionDOMElement.style, e);
                    }
                else
                    "string" != typeof t ||
                        Object.prototype.hasOwnProperty.call(
                            this.cursorStyles,
                            t
                        ) ||
                        (this.interactionDOMElement.style.cursor = t);
            }
        }
        triggerEvent(t, e, i) {
            i.stopped ||
                ((i.currentTarget = t),
                (i.type = e),
                t.emit(e, i),
                t[e] && t[e](i));
        }
        processInteractive(e, t, i, n, o) {
            if (!t || !t.visible) return !1;
            let r = !1,
                s = (o = t.interactive || o);
            if (t.interactiveChildren && t.children) {
                var a = t.children;
                for (let t = a.length - 1; 0 <= t; t--) {
                    var h = a[t],
                        c = this.processInteractive(e, h, i, n, s);
                    c &&
                        h.parent &&
                        ((s = !1), c && (e.target && (n = !1), (r = !0)));
                }
            }
            return (
                o &&
                    (n &&
                        !e.target &&
                        e.intersects[0] &&
                        e.intersects[0].object === t &&
                        (r = !0),
                    t.interactive &&
                        (r && !e.target && (e.data.target = e.target = t),
                        i && i(e, t, !!r))),
                r
            );
        }
        onClick(t) {
            if ("click" === t.type) {
                var e = this.normalizeToPointerData(t);
                this.autoPreventDefault &&
                    e[0].isNormalized &&
                    t.preventDefault();
                var i = this.getInteractionDataForPointerId(e[0]);
                const n = this.configureInteractionEventForDOMEvent(
                    this.eventData,
                    e[0],
                    i
                );
                (n.data.originalEvent = t),
                    this.processInteractive(
                        n,
                        this.scene,
                        this.processClick,
                        !0
                    ),
                    this.emit("click", n);
            }
        }
        processClick(t, e, i) {
            i && this.triggerEvent(e, "click", t);
        }
        onPointerDown(e) {
            if (!this.supportsTouchEvents || "touch" !== e.pointerType) {
                var i = this.normalizeToPointerData(e);
                this.autoPreventDefault &&
                    i[0].isNormalized &&
                    e.preventDefault();
                var n = i.length;
                for (let t = 0; t < n; t++) {
                    var o = i[t],
                        r = this.getInteractionDataForPointerId(o);
                    const s = this.configureInteractionEventForDOMEvent(
                        this.eventData,
                        o,
                        r
                    );
                    (s.data.originalEvent = e),
                        this.processInteractive(
                            s,
                            this.scene,
                            this.processPointerDown,
                            !0
                        ),
                        this.emit("pointerdown", s),
                        "touch" === o.pointerType
                            ? this.emit("touchstart", s)
                            : ("mouse" !== o.pointerType &&
                                  "pen" !== o.pointerType) ||
                              ((o = 2 === o.button),
                              this.emit(
                                  o ? "rightdown" : "mousedown",
                                  this.eventData
                              ));
                }
            }
        }
        processPointerDown(t, e, i) {
            var n = t.data,
                o = t.data.identifier;
            i &&
                (e.trackedPointers[o] || (e.trackedPointers[o] = new h(o)),
                this.triggerEvent(e, "pointerdown", t),
                "touch" === n.pointerType
                    ? ((e.started = !0), this.triggerEvent(e, "touchstart", t))
                    : ("mouse" !== n.pointerType && "pen" !== n.pointerType) ||
                      ((n = 2 === n.button)
                          ? (e.trackedPointers[o].rightDown = !0)
                          : (e.trackedPointers[o].leftDown = !0),
                      this.triggerEvent(e, n ? "rightdown" : "mousedown", t)));
        }
        onPointerComplete(e, i, n) {
            var o = this.normalizeToPointerData(e),
                r = o.length,
                s = e.target !== this.interactionDOMElement ? "outside" : "";
            for (let t = 0; t < r; t++) {
                var a,
                    h = o[t],
                    c = this.getInteractionDataForPointerId(h);
                const l = this.configureInteractionEventForDOMEvent(
                    this.eventData,
                    h,
                    c
                );
                (l.data.originalEvent = e),
                    this.processInteractive(l, this.scene, n, i || !s),
                    this.emit(i ? "pointercancel" : `pointerup${s}`, l),
                    "mouse" === h.pointerType || "pen" === h.pointerType
                        ? ((a = 2 === h.button),
                          this.emit(a ? `rightup${s}` : `mouseup${s}`, l))
                        : "touch" === h.pointerType &&
                          (this.emit(i ? "touchcancel" : `touchend${s}`, l),
                          this.releaseInteractionDataForPointerId(
                              h.pointerId,
                              c
                          ));
            }
        }
        onPointerCancel(t) {
            (this.supportsTouchEvents && "touch" === t.pointerType) ||
                this.onPointerComplete(t, !0, this.processPointerCancel);
        }
        processPointerCancel(t, e) {
            var i = t.data,
                n = t.data.identifier;
            void 0 !== e.trackedPointers[n] &&
                (delete e.trackedPointers[n],
                this.triggerEvent(e, "pointercancel", t),
                "touch" === i.pointerType &&
                    this.triggerEvent(e, "touchcancel", t));
        }
        onPointerUp(t) {
            (this.supportsTouchEvents && "touch" === t.pointerType) ||
                this.onPointerComplete(t, !1, this.processPointerUp);
        }
        processPointerUp(t, e, i) {
            var n = t.data,
                o = t.data.identifier;
            const r = e.trackedPointers[o];
            var s,
                a = "touch" === n.pointerType;
            ("mouse" !== n.pointerType && "pen" !== n.pointerType) ||
                ((s = 2 === n.button),
                (n = h.FLAGS),
                (n = s ? n.RIGHT_DOWN : n.LEFT_DOWN),
                (n = void 0 !== r && r.flags & n),
                i
                    ? (this.triggerEvent(e, s ? "rightup" : "mouseup", t),
                      n &&
                          this.triggerEvent(
                              e,
                              s ? "rightclick" : "leftclick",
                              t
                          ))
                    : n &&
                      this.triggerEvent(
                          e,
                          s ? "rightupoutside" : "mouseupoutside",
                          t
                      ),
                r && (s ? (r.rightDown = !1) : (r.leftDown = !1))),
                a &&
                    e.started &&
                    ((e.started = !1), this.triggerEvent(e, "touchend", t)),
                i
                    ? (this.triggerEvent(e, "pointerup", t),
                      r &&
                          (this.triggerEvent(e, "pointertap", t),
                          a && (this.triggerEvent(e, "tap", t), (r.over = !1))))
                    : r &&
                      (this.triggerEvent(e, "pointerupoutside", t),
                      a && this.triggerEvent(e, "touchendoutside", t)),
                r && r.none && delete e.trackedPointers[o];
        }
        onPointerMove(e) {
            if (!this.supportsTouchEvents || "touch" !== e.pointerType) {
                var i = this.normalizeToPointerData(e);
                "mouse" === i[0].pointerType &&
                    ((this.didMove = !0), (this.cursor = null));
                var n = i.length;
                for (let t = 0; t < n; t++) {
                    var o = i[t],
                        r = this.getInteractionDataForPointerId(o);
                    const s = this.configureInteractionEventForDOMEvent(
                        this.eventData,
                        o,
                        r
                    );
                    s.data.originalEvent = e;
                    r = "touch" !== o.pointerType || this.moveWhenInside;
                    this.processInteractive(
                        s,
                        this.scene,
                        this.processPointerMove,
                        r
                    ),
                        this.emit("pointermove", s),
                        "touch" === o.pointerType && this.emit("touchmove", s),
                        ("mouse" !== o.pointerType &&
                            "pen" !== o.pointerType) ||
                            this.emit("mousemove", s);
                }
                "mouse" === i[0].pointerType && this.setCursorMode(this.cursor);
            }
        }
        processPointerMove(t, e, i) {
            var n = t.data,
                o = "touch" === n.pointerType,
                n = "mouse" === n.pointerType || "pen" === n.pointerType;
            n && this.processPointerOverOut(t, e, i),
                o && e.started && this.triggerEvent(e, "touchmove", t),
                (this.moveWhenInside && !i) ||
                    (this.triggerEvent(e, "pointermove", t),
                    n && this.triggerEvent(e, "mousemove", t));
        }
        onPointerOut(t) {
            if (!this.supportsTouchEvents || "touch" !== t.pointerType) {
                var e = this.normalizeToPointerData(t)[0];
                "mouse" === e.pointerType &&
                    ((this.mouseOverRenderer = !1), this.setCursorMode(null));
                t = this.getInteractionDataForPointerId(e);
                const i = this.configureInteractionEventForDOMEvent(
                    this.eventData,
                    e,
                    t
                );
                (i.data.originalEvent = e),
                    this.processInteractive(
                        i,
                        this.scene,
                        this.processPointerOverOut,
                        !1
                    ),
                    this.emit("pointerout", i),
                    "mouse" === e.pointerType || "pen" === e.pointerType
                        ? this.emit("mouseout", i)
                        : this.releaseInteractionDataForPointerId(t.identifier);
            }
        }
        processPointerOverOut(t, e, i) {
            var n = t.data,
                o = t.data.identifier,
                n = "mouse" === n.pointerType || "pen" === n.pointerType;
            let r = e.trackedPointers[o];
            i && !r && (r = e.trackedPointers[o] = new h(o)),
                void 0 !== r &&
                    (i && this.mouseOverRenderer
                        ? (r.over ||
                              ((r.over = !0),
                              this.triggerEvent(e, "pointerover", t),
                              n && this.triggerEvent(e, "mouseover", t)),
                          n && null === this.cursor && (this.cursor = e.cursor))
                        : r.over &&
                          ((r.over = !1),
                          this.triggerEvent(e, "pointerout", this.eventData),
                          n && this.triggerEvent(e, "mouseout", t),
                          r.none && delete e.trackedPointers[o]));
        }
        onPointerOver(t) {
            var e = this.normalizeToPointerData(t)[0],
                t = this.getInteractionDataForPointerId(e);
            const i = this.configureInteractionEventForDOMEvent(
                this.eventData,
                e,
                t
            );
            "mouse" === (i.data.originalEvent = e).pointerType &&
                (this.mouseOverRenderer = !0),
                this.emit("pointerover", i),
                ("mouse" !== e.pointerType && "pen" !== e.pointerType) ||
                    this.emit("mouseover", i);
        }
        getInteractionDataForPointerId(t) {
            var e = t.pointerId;
            let i;
            return (
                e === c || "mouse" === t.pointerType
                    ? (i = this.mouse)
                    : this.activeInteractionData[e]
                    ? (i = this.activeInteractionData[e])
                    : ((i = this.interactionDataPool.pop() || new s()),
                      (i.identifier = e),
                      (this.activeInteractionData[e] = i)),
                i._copyEvent(t),
                i
            );
        }
        releaseInteractionDataForPointerId(t) {
            const e = this.activeInteractionData[t];
            e &&
                (delete this.activeInteractionData[t],
                e._reset(),
                this.interactionDataPool.push(e));
        }
        mapPositionToPoint(t, e, i) {
            let n;
            (n = this.interactionDOMElement.parentElement
                ? this.interactionDOMElement.getBoundingClientRect()
                : { x: 0, y: 0, left: 0, top: 0, width: 0, height: 0 }),
                (t.x = ((e - n.left) / n.width) * 2 - 1),
                (t.y = 2 * -((i - n.top) / n.height) + 1);
        }
        configureInteractionEventForDOMEvent(t, e, i) {
            return (
                (t.data = i),
                this.mapPositionToPoint(i.global, e.clientX, e.clientY),
                this.raycaster.setFromCamera(i.global, this.camera),
                "touch" === e.pointerType &&
                    ((e.globalX = i.global.x), (e.globalY = i.global.y)),
                (i.originalEvent = e),
                t._reset(),
                (t.intersects = this.raycaster.intersectObjects(
                    this.scene.children,
                    !0
                )),
                t
            );
        }
        normalizeToPointerData(i) {
            const n = [];
            if (this.supportsTouchEvents && i instanceof TouchEvent)
                for (let t = 0, e = i.changedTouches.length; t < e; t++) {
                    const o = i.changedTouches[t];
                    void 0 === o.button &&
                        (o.button = i.touches.length ? 1 : 0),
                        void 0 === o.buttons &&
                            (o.buttons = i.touches.length ? 1 : 0),
                        void 0 === o.isPrimary &&
                            (o.isPrimary =
                                1 === i.touches.length &&
                                "touchstart" === i.type),
                        void 0 === o.width && (o.width = o.radiusX || 1),
                        void 0 === o.height && (o.height = o.radiusY || 1),
                        void 0 === o.tiltX && (o.tiltX = 0),
                        void 0 === o.tiltY && (o.tiltY = 0),
                        void 0 === o.pointerType && (o.pointerType = "touch"),
                        void 0 === o.pointerId &&
                            (o.pointerId = o.identifier || 0),
                        void 0 === o.pressure && (o.pressure = o.force || 0.5),
                        (o.twist = 0),
                        void (o.tangentialPressure = 0) === o.layerX &&
                            (o.layerX = o.offsetX = o.clientX),
                        void 0 === o.layerY &&
                            (o.layerY = o.offsetY = o.clientY),
                        (o.isNormalized = !0),
                        n.push(o);
                }
            else
                !(i instanceof MouseEvent) ||
                    (this.supportsPointerEvents &&
                        i instanceof window.PointerEvent) ||
                    (void 0 === i.isPrimary && (i.isPrimary = !0),
                    void 0 === i.width && (i.width = 1),
                    void 0 === i.height && (i.height = 1),
                    void 0 === i.tiltX && (i.tiltX = 0),
                    void 0 === i.tiltY && (i.tiltY = 0),
                    void 0 === i.pointerType && (i.pointerType = "mouse"),
                    void 0 === i.pointerId && (i.pointerId = c),
                    void 0 === i.pressure && (i.pressure = 0.5),
                    (i.twist = 0),
                    (i.tangentialPressure = 0),
                    (i.isNormalized = !0)),
                    n.push(i);
            return n;
        }
        destroy() {
            this.removeEvents(),
                this.removeAllListeners(),
                (this.renderer = null),
                (this.mouse = null),
                (this.eventData = null),
                (this.interactionDOMElement = null),
                (this.onPointerDown = null),
                (this.processPointerDown = null),
                (this.onPointerUp = null),
                (this.processPointerUp = null),
                (this.onPointerCancel = null),
                (this.processPointerCancel = null),
                (this.onPointerMove = null),
                (this.processPointerMove = null),
                (this.onPointerOut = null),
                (this.processPointerOverOut = null),
                (this.onPointerOver = null),
                (this._tempPoint = null);
        }
    }
    const l = "MOUSE",
        u = { target: null, data: { global: null } };
    class p extends o.EventDispatcher {
        constructor(t, e) {
            super(),
                (e = e || {}),
                (this.renderer = t),
                (this.layer = null),
                (this.autoPreventDefault = e.autoPreventDefault || !1),
                (this.interactionFrequency = e.interactionFrequency || 10),
                (this.mouse = new s()),
                (this.mouse.identifier = l),
                this.mouse.global.set(-999999),
                (this.activeInteractionData = {}),
                (this.activeInteractionData[l] = this.mouse),
                (this.interactionDataPool = []),
                (this.eventData = new a()),
                (this.interactionDOMElement = null),
                (this.moveWhenInside = !0),
                (this.eventsAdded = !1),
                (this.mouseOverRenderer = !1),
                (this.supportsTouchEvents = "ontouchstart" in window),
                (this.supportsPointerEvents = !!window.PointerEvent),
                (this.onClick = this.onClick.bind(this)),
                (this.processClick = this.processClick.bind(this)),
                (this.onPointerUp = this.onPointerUp.bind(this)),
                (this.processPointerUp = this.processPointerUp.bind(this)),
                (this.onPointerCancel = this.onPointerCancel.bind(this)),
                (this.processPointerCancel =
                    this.processPointerCancel.bind(this)),
                (this.onPointerDown = this.onPointerDown.bind(this)),
                (this.processPointerDown = this.processPointerDown.bind(this)),
                (this.onPointerMove = this.onPointerMove.bind(this)),
                (this.processPointerMove = this.processPointerMove.bind(this)),
                (this.onPointerOut = this.onPointerOut.bind(this)),
                (this.processPointerOverOut =
                    this.processPointerOverOut.bind(this)),
                (this.onPointerOver = this.onPointerOver.bind(this)),
                (this.cursorStyles = {
                    default: "inherit",
                    pointer: "pointer",
                }),
                (this.currentCursorMode = null),
                (this.cursor = null),
                (this.raycaster = new o.Raycaster()),
                (this._deltaTime = 0),
                this.setTargetElement(this.renderer.domElement);
        }
        isAble() {
            return this.layer && this.layer.interactive;
        }
        setLayer(t) {
            this.layer = t;
        }
        hitTest(t, e) {
            return this.isAble()
                ? ((u.target = null),
                  (u.data.global = t),
                  (e = e || this.layer.scene),
                  this.processInteractive(u, e, null, !0),
                  u.target)
                : null;
        }
        setTargetElement(t) {
            this.removeEvents(),
                (this.interactionDOMElement = t),
                this.addEvents();
        }
        addEvents() {
            this.interactionDOMElement &&
                !this.eventsAdded &&
                (this.emit("addevents"),
                this.interactionDOMElement.addEventListener(
                    "click",
                    this.onClick,
                    !0
                ),
                window.navigator.msPointerEnabled
                    ? ((this.interactionDOMElement.style[
                          "-ms-content-zooming"
                      ] = "none"),
                      (this.interactionDOMElement.style["-ms-touch-action"] =
                          "none"))
                    : this.supportsPointerEvents &&
                      (this.interactionDOMElement.style["touch-action"] =
                          "none"),
                this.supportsPointerEvents
                    ? (window.document.addEventListener(
                          "pointermove",
                          this.onPointerMove,
                          !0
                      ),
                      this.interactionDOMElement.addEventListener(
                          "pointerdown",
                          this.onPointerDown,
                          !0
                      ),
                      this.interactionDOMElement.addEventListener(
                          "pointerleave",
                          this.onPointerOut,
                          !0
                      ),
                      this.interactionDOMElement.addEventListener(
                          "pointerover",
                          this.onPointerOver,
                          !0
                      ),
                      window.addEventListener(
                          "pointercancel",
                          this.onPointerCancel,
                          !0
                      ),
                      window.addEventListener(
                          "pointerup",
                          this.onPointerUp,
                          !0
                      ))
                    : (window.document.addEventListener(
                          "mousemove",
                          this.onPointerMove,
                          !0
                      ),
                      this.interactionDOMElement.addEventListener(
                          "mousedown",
                          this.onPointerDown,
                          !0
                      ),
                      this.interactionDOMElement.addEventListener(
                          "mouseout",
                          this.onPointerOut,
                          !0
                      ),
                      this.interactionDOMElement.addEventListener(
                          "mouseover",
                          this.onPointerOver,
                          !0
                      ),
                      window.addEventListener("mouseup", this.onPointerUp, !0)),
                this.supportsTouchEvents &&
                    (this.interactionDOMElement.addEventListener(
                        "touchstart",
                        this.onPointerDown,
                        !0
                    ),
                    this.interactionDOMElement.addEventListener(
                        "touchcancel",
                        this.onPointerCancel,
                        !0
                    ),
                    this.interactionDOMElement.addEventListener(
                        "touchend",
                        this.onPointerUp,
                        !0
                    ),
                    this.interactionDOMElement.addEventListener(
                        "touchmove",
                        this.onPointerMove,
                        !0
                    )),
                (this.eventsAdded = !0));
        }
        removeEvents() {
            this.interactionDOMElement &&
                (this.emit("removeevents"),
                this.interactionDOMElement.removeEventListener(
                    "click",
                    this.onClick,
                    !0
                ),
                window.navigator.msPointerEnabled
                    ? ((this.interactionDOMElement.style[
                          "-ms-content-zooming"
                      ] = ""),
                      (this.interactionDOMElement.style["-ms-touch-action"] =
                          ""))
                    : this.supportsPointerEvents &&
                      (this.interactionDOMElement.style["touch-action"] = ""),
                this.supportsPointerEvents
                    ? (window.document.removeEventListener(
                          "pointermove",
                          this.onPointerMove,
                          !0
                      ),
                      this.interactionDOMElement.removeEventListener(
                          "pointerdown",
                          this.onPointerDown,
                          !0
                      ),
                      this.interactionDOMElement.removeEventListener(
                          "pointerleave",
                          this.onPointerOut,
                          !0
                      ),
                      this.interactionDOMElement.removeEventListener(
                          "pointerover",
                          this.onPointerOver,
                          !0
                      ),
                      window.removeEventListener(
                          "pointercancel",
                          this.onPointerCancel,
                          !0
                      ),
                      window.removeEventListener(
                          "pointerup",
                          this.onPointerUp,
                          !0
                      ))
                    : (window.document.removeEventListener(
                          "mousemove",
                          this.onPointerMove,
                          !0
                      ),
                      this.interactionDOMElement.removeEventListener(
                          "mousedown",
                          this.onPointerDown,
                          !0
                      ),
                      this.interactionDOMElement.removeEventListener(
                          "mouseout",
                          this.onPointerOut,
                          !0
                      ),
                      this.interactionDOMElement.removeEventListener(
                          "mouseover",
                          this.onPointerOver,
                          !0
                      ),
                      window.removeEventListener(
                          "mouseup",
                          this.onPointerUp,
                          !0
                      )),
                this.supportsTouchEvents &&
                    (this.interactionDOMElement.removeEventListener(
                        "touchstart",
                        this.onPointerDown,
                        !0
                    ),
                    this.interactionDOMElement.removeEventListener(
                        "touchcancel",
                        this.onPointerCancel,
                        !0
                    ),
                    this.interactionDOMElement.removeEventListener(
                        "touchend",
                        this.onPointerUp,
                        !0
                    ),
                    this.interactionDOMElement.removeEventListener(
                        "touchmove",
                        this.onPointerMove,
                        !0
                    )),
                (this.interactionDOMElement = null),
                (this.eventsAdded = !1));
        }
        update({ snippet: t }) {
            if (
                this.isAble() &&
                ((this._deltaTime += t),
                !(this._deltaTime < this.interactionFrequency) &&
                    ((this._deltaTime = 0), this.interactionDOMElement))
            )
                if (this.didMove) this.didMove = !1;
                else {
                    this.cursor = null;
                    for (const i in this.activeInteractionData) {
                        var e;
                        !this.activeInteractionData.hasOwnProperty(i) ||
                            ((e = this.activeInteractionData[i])
                                .originalEvent &&
                                "touch" !== e.pointerType &&
                                ((e = this.configureInteractionEventForDOMEvent(
                                    this.eventData,
                                    e.originalEvent,
                                    e
                                )),
                                this.processInteractive(
                                    e,
                                    this.layer.scene,
                                    this.processPointerOverOut,
                                    !0
                                )));
                    }
                    this.setCursorMode(this.cursor);
                }
        }
        setCursorMode(t) {
            if (this.currentCursorMode !== (t = t || "default")) {
                this.currentCursorMode = t;
                const e = this.cursorStyles[t];
                if (e)
                    switch (typeof e) {
                        case "string":
                            this.interactionDOMElement.style.cursor = e;
                            break;
                        case "function":
                            e(t);
                            break;
                        case "object":
                            Object.assign(this.interactionDOMElement.style, e);
                    }
                else
                    "string" != typeof t ||
                        Object.prototype.hasOwnProperty.call(
                            this.cursorStyles,
                            t
                        ) ||
                        (this.interactionDOMElement.style.cursor = t);
            }
        }
        triggerEvent(t, e, i) {
            i.stopped ||
                ((i.currentTarget = t),
                (i.type = e),
                t.emit(e, i),
                t[e] && t[e](i));
        }
        processInteractive(e, t, i, n, o) {
            if (!t || !t.visible) return !1;
            let r = !1,
                s = (o = t.interactive || o);
            if (t.interactiveChildren && t.children) {
                var a = t.children;
                for (let t = a.length - 1; 0 <= t; t--) {
                    var h = a[t],
                        c = this.processInteractive(e, h, i, n, s);
                    c &&
                        h.parent &&
                        ((s = !1), c && (e.target && (n = !1), (r = !0)));
                }
            }
            return (
                o &&
                    (n &&
                        !e.target &&
                        e.intersects[0] &&
                        e.intersects[0].object === t &&
                        (r = !0),
                    t.interactive &&
                        (r && !e.target && (e.data.target = e.target = t),
                        i && i(e, t, !!r))),
                r
            );
        }
        onClick(t) {
            if (this.isAble() && "click" === t.type) {
                var e = this.normalizeToPointerData(t);
                this.autoPreventDefault &&
                    e[0].isNormalized &&
                    t.preventDefault();
                var i = this.getInteractionDataForPointerId(e[0]);
                const n = this.configureInteractionEventForDOMEvent(
                    this.eventData,
                    e[0],
                    i
                );
                (n.data.originalEvent = t),
                    this.processInteractive(
                        n,
                        this.layer.scene,
                        this.processClick,
                        !0
                    ),
                    this.emit("click", n);
            }
        }
        processClick(t, e, i) {
            i && this.triggerEvent(e, "click", t);
        }
        onPointerDown(e) {
            if (
                this.isAble() &&
                (!this.supportsTouchEvents || "touch" !== e.pointerType)
            ) {
                var i = this.normalizeToPointerData(e);
                this.autoPreventDefault &&
                    i[0].isNormalized &&
                    e.preventDefault();
                var n = i.length;
                for (let t = 0; t < n; t++) {
                    var o = i[t],
                        r = this.getInteractionDataForPointerId(o);
                    const s = this.configureInteractionEventForDOMEvent(
                        this.eventData,
                        o,
                        r
                    );
                    (s.data.originalEvent = e),
                        this.processInteractive(
                            s,
                            this.layer.scene,
                            this.processPointerDown,
                            !0
                        ),
                        this.emit("pointerdown", s),
                        "touch" === o.pointerType
                            ? this.emit("touchstart", s)
                            : ("mouse" !== o.pointerType &&
                                  "pen" !== o.pointerType) ||
                              ((o = 2 === o.button),
                              this.emit(
                                  o ? "rightdown" : "mousedown",
                                  this.eventData
                              ));
                }
            }
        }
        processPointerDown(t, e, i) {
            var n = t.data,
                o = t.data.identifier;
            i &&
                (e.trackedPointers[o] || (e.trackedPointers[o] = new h(o)),
                this.triggerEvent(e, "pointerdown", t),
                "touch" === n.pointerType
                    ? ((e.started = !0), this.triggerEvent(e, "touchstart", t))
                    : ("mouse" !== n.pointerType && "pen" !== n.pointerType) ||
                      ((n = 2 === n.button)
                          ? (e.trackedPointers[o].rightDown = !0)
                          : (e.trackedPointers[o].leftDown = !0),
                      this.triggerEvent(e, n ? "rightdown" : "mousedown", t)));
        }
        onPointerComplete(e, i, n) {
            var o = this.normalizeToPointerData(e),
                r = o.length,
                s = e.target !== this.interactionDOMElement ? "outside" : "";
            for (let t = 0; t < r; t++) {
                var a,
                    h = o[t],
                    c = this.getInteractionDataForPointerId(h);
                const l = this.configureInteractionEventForDOMEvent(
                    this.eventData,
                    h,
                    c
                );
                (l.data.originalEvent = e),
                    this.processInteractive(l, this.layer.scene, n, i || !s),
                    this.emit(i ? "pointercancel" : `pointerup${s}`, l),
                    "mouse" === h.pointerType || "pen" === h.pointerType
                        ? ((a = 2 === h.button),
                          this.emit(a ? `rightup${s}` : `mouseup${s}`, l))
                        : "touch" === h.pointerType &&
                          (this.emit(i ? "touchcancel" : `touchend${s}`, l),
                          this.releaseInteractionDataForPointerId(
                              h.pointerId,
                              c
                          ));
            }
        }
        onPointerCancel(t) {
            this.isAble() &&
                ((this.supportsTouchEvents && "touch" === t.pointerType) ||
                    this.onPointerComplete(t, !0, this.processPointerCancel));
        }
        processPointerCancel(t, e) {
            var i = t.data,
                n = t.data.identifier;
            void 0 !== e.trackedPointers[n] &&
                (delete e.trackedPointers[n],
                this.triggerEvent(e, "pointercancel", t),
                "touch" === i.pointerType &&
                    this.triggerEvent(e, "touchcancel", t));
        }
        onPointerUp(t) {
            this.isAble() &&
                ((this.supportsTouchEvents && "touch" === t.pointerType) ||
                    this.onPointerComplete(t, !1, this.processPointerUp));
        }
        processPointerUp(t, e, i) {
            var n = t.data,
                o = t.data.identifier;
            const r = e.trackedPointers[o];
            var s,
                a = "touch" === n.pointerType;
            ("mouse" !== n.pointerType && "pen" !== n.pointerType) ||
                ((s = 2 === n.button),
                (n = h.FLAGS),
                (n = s ? n.RIGHT_DOWN : n.LEFT_DOWN),
                (n = void 0 !== r && r.flags & n),
                i
                    ? (this.triggerEvent(e, s ? "rightup" : "mouseup", t),
                      n &&
                          this.triggerEvent(
                              e,
                              s ? "rightclick" : "leftclick",
                              t
                          ))
                    : n &&
                      this.triggerEvent(
                          e,
                          s ? "rightupoutside" : "mouseupoutside",
                          t
                      ),
                r && (s ? (r.rightDown = !1) : (r.leftDown = !1))),
                a &&
                    e.started &&
                    ((e.started = !1), this.triggerEvent(e, "touchend", t)),
                i
                    ? (this.triggerEvent(e, "pointerup", t),
                      r &&
                          (this.triggerEvent(e, "pointertap", t),
                          a && (this.triggerEvent(e, "tap", t), (r.over = !1))))
                    : r &&
                      (this.triggerEvent(e, "pointerupoutside", t),
                      a && this.triggerEvent(e, "touchendoutside", t)),
                r && r.none && delete e.trackedPointers[o];
        }
        onPointerMove(e) {
            if (
                this.isAble() &&
                (!this.supportsTouchEvents || "touch" !== e.pointerType)
            ) {
                var i = this.normalizeToPointerData(e);
                "mouse" === i[0].pointerType &&
                    ((this.didMove = !0), (this.cursor = null));
                var n = i.length;
                for (let t = 0; t < n; t++) {
                    var o = i[t],
                        r = this.getInteractionDataForPointerId(o);
                    const s = this.configureInteractionEventForDOMEvent(
                        this.eventData,
                        o,
                        r
                    );
                    s.data.originalEvent = e;
                    r = "touch" !== o.pointerType || this.moveWhenInside;
                    this.processInteractive(
                        s,
                        this.layer.scene,
                        this.processPointerMove,
                        r
                    ),
                        this.emit("pointermove", s),
                        "touch" === o.pointerType && this.emit("touchmove", s),
                        ("mouse" !== o.pointerType &&
                            "pen" !== o.pointerType) ||
                            this.emit("mousemove", s);
                }
                "mouse" === i[0].pointerType && this.setCursorMode(this.cursor);
            }
        }
        processPointerMove(t, e, i) {
            var n = t.data,
                o = "touch" === n.pointerType,
                n = "mouse" === n.pointerType || "pen" === n.pointerType;
            n && this.processPointerOverOut(t, e, i),
                o && e.started && this.triggerEvent(e, "touchmove", t),
                (this.moveWhenInside && !i) ||
                    (this.triggerEvent(e, "pointermove", t),
                    n && this.triggerEvent(e, "mousemove", t));
        }
        onPointerOut(t) {
            if (
                this.isAble() &&
                (!this.supportsTouchEvents || "touch" !== t.pointerType)
            ) {
                var e = this.normalizeToPointerData(t)[0];
                "mouse" === e.pointerType &&
                    ((this.mouseOverRenderer = !1), this.setCursorMode(null));
                t = this.getInteractionDataForPointerId(e);
                const i = this.configureInteractionEventForDOMEvent(
                    this.eventData,
                    e,
                    t
                );
                (i.data.originalEvent = e),
                    this.processInteractive(
                        i,
                        this.layer.scene,
                        this.processPointerOverOut,
                        !1
                    ),
                    this.emit("pointerout", i),
                    "mouse" === e.pointerType || "pen" === e.pointerType
                        ? this.emit("mouseout", i)
                        : this.releaseInteractionDataForPointerId(t.identifier);
            }
        }
        processPointerOverOut(t, e, i) {
            var n = t.data,
                o = t.data.identifier,
                n = "mouse" === n.pointerType || "pen" === n.pointerType;
            let r = e.trackedPointers[o];
            i && !r && (r = e.trackedPointers[o] = new h(o)),
                void 0 !== r &&
                    (i && this.mouseOverRenderer
                        ? (r.over ||
                              ((r.over = !0),
                              this.triggerEvent(e, "pointerover", t),
                              n && this.triggerEvent(e, "mouseover", t)),
                          n && null === this.cursor && (this.cursor = e.cursor))
                        : r.over &&
                          ((r.over = !1),
                          this.triggerEvent(e, "pointerout", this.eventData),
                          n && this.triggerEvent(e, "mouseout", t),
                          r.none && delete e.trackedPointers[o]));
        }
        onPointerOver(t) {
            if (this.isAble()) {
                var e = this.normalizeToPointerData(t)[0],
                    t = this.getInteractionDataForPointerId(e);
                const i = this.configureInteractionEventForDOMEvent(
                    this.eventData,
                    e,
                    t
                );
                "mouse" === (i.data.originalEvent = e).pointerType &&
                    (this.mouseOverRenderer = !0),
                    this.emit("pointerover", i),
                    ("mouse" !== e.pointerType && "pen" !== e.pointerType) ||
                        this.emit("mouseover", i);
            }
        }
        getInteractionDataForPointerId(t) {
            var e = t.pointerId;
            let i;
            return (
                e === l || "mouse" === t.pointerType
                    ? (i = this.mouse)
                    : this.activeInteractionData[e]
                    ? (i = this.activeInteractionData[e])
                    : ((i = this.interactionDataPool.pop() || new s()),
                      (i.identifier = e),
                      (this.activeInteractionData[e] = i)),
                i._copyEvent(t),
                i
            );
        }
        releaseInteractionDataForPointerId(t) {
            const e = this.activeInteractionData[t];
            e &&
                (delete this.activeInteractionData[t],
                e._reset(),
                this.interactionDataPool.push(e));
        }
        mapPositionToPoint(t, e, i) {
            let n;
            (n = this.interactionDOMElement.parentElement
                ? this.interactionDOMElement.getBoundingClientRect()
                : { x: 0, y: 0, left: 0, top: 0, width: 0, height: 0 }),
                (t.x = ((e - n.left) / n.width) * 2 - 1),
                (t.y = 2 * -((i - n.top) / n.height) + 1);
        }
        configureInteractionEventForDOMEvent(t, e, i) {
            return (
                (t.data = i),
                this.mapPositionToPoint(i.global, e.clientX, e.clientY),
                this.layer &&
                    this.layer.interactive &&
                    this.raycaster.setFromCamera(i.global, this.layer.camera),
                "touch" === e.pointerType &&
                    ((e.globalX = i.global.x), (e.globalY = i.global.y)),
                (i.originalEvent = e),
                t._reset(),
                (t.intersects = this.raycaster.intersectObjects(
                    this.scene.children,
                    !0
                )),
                t
            );
        }
        normalizeToPointerData(i) {
            const n = [];
            if (this.supportsTouchEvents && i instanceof TouchEvent)
                for (let t = 0, e = i.changedTouches.length; t < e; t++) {
                    const o = i.changedTouches[t];
                    void 0 === o.button &&
                        (o.button = i.touches.length ? 1 : 0),
                        void 0 === o.buttons &&
                            (o.buttons = i.touches.length ? 1 : 0),
                        void 0 === o.isPrimary &&
                            (o.isPrimary =
                                1 === i.touches.length &&
                                "touchstart" === i.type),
                        void 0 === o.width && (o.width = o.radiusX || 1),
                        void 0 === o.height && (o.height = o.radiusY || 1),
                        void 0 === o.tiltX && (o.tiltX = 0),
                        void 0 === o.tiltY && (o.tiltY = 0),
                        void 0 === o.pointerType && (o.pointerType = "touch"),
                        void 0 === o.pointerId &&
                            (o.pointerId = o.identifier || 0),
                        void 0 === o.pressure && (o.pressure = o.force || 0.5),
                        (o.twist = 0),
                        void (o.tangentialPressure = 0) === o.layerX &&
                            (o.layerX = o.offsetX = o.clientX),
                        void 0 === o.layerY &&
                            (o.layerY = o.offsetY = o.clientY),
                        (o.isNormalized = !0),
                        n.push(o);
                }
            else
                !(i instanceof MouseEvent) ||
                    (this.supportsPointerEvents &&
                        i instanceof window.PointerEvent) ||
                    (void 0 === i.isPrimary && (i.isPrimary = !0),
                    void 0 === i.width && (i.width = 1),
                    void 0 === i.height && (i.height = 1),
                    void 0 === i.tiltX && (i.tiltX = 0),
                    void 0 === i.tiltY && (i.tiltY = 0),
                    void 0 === i.pointerType && (i.pointerType = "mouse"),
                    void 0 === i.pointerId && (i.pointerId = l),
                    void 0 === i.pressure && (i.pressure = 0.5),
                    (i.twist = 0),
                    (i.tangentialPressure = 0),
                    (i.isNormalized = !0)),
                    n.push(i);
            return n;
        }
        destroy() {
            this.removeEvents(),
                this.removeAllListeners(),
                (this.renderer = null),
                (this.mouse = null),
                (this.eventData = null),
                (this.interactionDOMElement = null),
                (this.onPointerDown = null),
                (this.processPointerDown = null),
                (this.onPointerUp = null),
                (this.processPointerUp = null),
                (this.onPointerCancel = null),
                (this.processPointerCancel = null),
                (this.onPointerMove = null),
                (this.processPointerMove = null),
                (this.onPointerOut = null),
                (this.processPointerOverOut = null),
                (this.onPointerOver = null),
                (this._tempPoint = null);
        }
    }
    !(function () {
        let o = 0;
        var e = ["ms", "moz", "webkit", "o"];
        for (let t = 0; t < e.length && !window.requestAnimationFrame; ++t)
            (window.requestAnimationFrame =
                window[e[t] + "RequestAnimationFrame"]),
                (window.cancelAnimationFrame =
                    window[e[t] + "CancelAnimationFrame"] ||
                    window[e[t] + "CancelRequestAnimationFrame"]);
        window.requestAnimationFrame ||
            (window.requestAnimationFrame = function (t) {
                let e = new Date().getTime(),
                    i = Math.max(0, 16 - (e - o));
                var n = window.setTimeout(function () {
                    t(e + i);
                }, i);
                return (o = e + i), n;
            }),
            window.cancelAnimationFrame ||
                (window.cancelAnimationFrame = function (t) {
                    clearTimeout(t);
                }),
            (window.RAF = window.requestAnimationFrame),
            (window.CAF = window.cancelAnimationFrame);
    })();
    class v extends o.EventDispatcher {
        constructor() {
            super(),
                (this.timer = null),
                (this.started = !1),
                (this.pt = 0),
                (this.snippet = 0),
                this.start();
        }
        start() {
            if (!this.started) {
                const t = () => {
                    this.timeline(),
                        this.emit("tick", { snippet: this.snippet }),
                        (this.timer = RAF(t));
                };
                t();
            }
        }
        stop() {
            CAF(this.timer), (this.started = !1);
        }
        timeline() {
            (this.snippet = Date.now() - this.pt),
                (0 === this.pt || 200 < this.snippet) &&
                    ((this.pt = Date.now()),
                    (this.snippet = Date.now() - this.pt)),
                (this.pt += this.snippet);
        }
    }

    return (
        (THREE.InteractionManager = e),
        (THREE.InteractionLayer = p),
        (THREE.Interaction = class extends e {
            constructor(t, e, i, n) {
                super(t, e, i, (n = Object.assign({ autoAttach: !1 }, n))),
                    (this.ticker = new v()),
                    (this.update = this.update.bind(this)),
                    this.on("addevents", () => {
                        this.ticker.on("tick", this.update);
                    }),
                    this.on("removeevents", () => {
                        this.ticker.off("tick", this.update);
                    }),
                    this.setTargetElement(this.renderer.domElement);
            }
        }),
        t
    );
})({}, THREE);
