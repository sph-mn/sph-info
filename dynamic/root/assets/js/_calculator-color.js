(function() {
    function n(n) {
        function t(t, r, e, u, i, o) {
            for (;i >= 0 && o > i; i += n) {
                var a = u ? u[i] : i;
                e = r(e, t[a], a, t);
            }
            return e;
        }
        return function(r, e, u, i) {
            e = b(e, i, 4);
            var o = !k(r) && m.keys(r), a = (o || r).length, c = n > 0 ? 0 : a - 1;
            return arguments.length < 3 && (u = r[o ? o[c] : c], c += n), t(r, e, u, o, c, a);
        };
    }
    function t(n) {
        return function(t, r, e) {
            r = x(r, e);
            for (var u = O(t), i = n > 0 ? 0 : u - 1; i >= 0 && u > i; i += n) if (r(t[i], i, t)) return i;
            return -1;
        };
    }
    function r(n, t, r) {
        return function(e, u, i) {
            var o = 0, a = O(e);
            if ("number" == typeof i) n > 0 ? o = i >= 0 ? i : Math.max(i + a, o) : a = i >= 0 ? Math.min(i + 1, a) : i + a + 1; else if (r && i && a) return i = r(e, u), 
            e[i] === u ? i : -1;
            if (u !== u) return i = t(l.call(e, o, a), m.isNaN), i >= 0 ? i + o : -1;
            for (i = n > 0 ? o : a - 1; i >= 0 && a > i; i += n) if (e[i] === u) return i;
            return -1;
        };
    }
    function e(n, t) {
        var r = I.length, e = n.constructor, u = m.isFunction(e) && e.prototype || a, i = "constructor";
        for (m.has(n, i) && !m.contains(t, i) && t.push(i); r--; ) i = I[r], i in n && n[i] !== u[i] && !m.contains(t, i) && t.push(i);
    }
    var u = this, i = u._, o = Array.prototype, a = Object.prototype, c = Function.prototype, f = o.push, l = o.slice, s = a.toString, p = a.hasOwnProperty, h = Array.isArray, v = Object.keys, g = c.bind, y = Object.create, d = function() {}, m = function(n) {
        return n instanceof m ? n : this instanceof m ? void (this._wrapped = n) : new m(n);
    };
    "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = m), 
    exports._ = m) : u._ = m, m.VERSION = "1.8.3";
    var b = function(n, t, r) {
        if (t === void 0) return n;
        switch (null == r ? 3 : r) {
          case 1:
            return function(r) {
                return n.call(t, r);
            };

          case 2:
            return function(r, e) {
                return n.call(t, r, e);
            };

          case 3:
            return function(r, e, u) {
                return n.call(t, r, e, u);
            };

          case 4:
            return function(r, e, u, i) {
                return n.call(t, r, e, u, i);
            };
        }
        return function() {
            return n.apply(t, arguments);
        };
    }, x = function(n, t, r) {
        return null == n ? m.identity : m.isFunction(n) ? b(n, t, r) : m.isObject(n) ? m.matcher(n) : m.property(n);
    };
    m.iteratee = function(n, t) {
        return x(n, t, 1 / 0);
    };
    var _ = function(n, t) {
        return function(r) {
            var e = arguments.length;
            if (2 > e || null == r) return r;
            for (var u = 1; e > u; u++) for (var i = arguments[u], o = n(i), a = o.length, c = 0; a > c; c++) {
                var f = o[c];
                t && r[f] !== void 0 || (r[f] = i[f]);
            }
            return r;
        };
    }, j = function(n) {
        if (!m.isObject(n)) return {};
        if (y) return y(n);
        d.prototype = n;
        var t = new d();
        return d.prototype = null, t;
    }, w = function(n) {
        return function(t) {
            return null == t ? void 0 : t[n];
        };
    }, A = Math.pow(2, 53) - 1, O = w("length"), k = function(n) {
        var t = O(n);
        return "number" == typeof t && t >= 0 && A >= t;
    };
    m.each = m.forEach = function(n, t, r) {
        t = b(t, r);
        var e, u;
        if (k(n)) for (e = 0, u = n.length; u > e; e++) t(n[e], e, n); else {
            var i = m.keys(n);
            for (e = 0, u = i.length; u > e; e++) t(n[i[e]], i[e], n);
        }
        return n;
    }, m.map = m.collect = function(n, t, r) {
        t = x(t, r);
        for (var e = !k(n) && m.keys(n), u = (e || n).length, i = Array(u), o = 0; u > o; o++) {
            var a = e ? e[o] : o;
            i[o] = t(n[a], a, n);
        }
        return i;
    }, m.reduce = m.foldl = m.inject = n(1), m.reduceRight = m.foldr = n(-1), m.find = m.detect = function(n, t, r) {
        var e;
        return e = k(n) ? m.findIndex(n, t, r) : m.findKey(n, t, r), e !== void 0 && e !== -1 ? n[e] : void 0;
    }, m.filter = m.select = function(n, t, r) {
        var e = [];
        return t = x(t, r), m.each(n, function(n, r, u) {
            t(n, r, u) && e.push(n);
        }), e;
    }, m.reject = function(n, t, r) {
        return m.filter(n, m.negate(x(t)), r);
    }, m.every = m.all = function(n, t, r) {
        t = x(t, r);
        for (var e = !k(n) && m.keys(n), u = (e || n).length, i = 0; u > i; i++) {
            var o = e ? e[i] : i;
            if (!t(n[o], o, n)) return !1;
        }
        return !0;
    }, m.some = m.any = function(n, t, r) {
        t = x(t, r);
        for (var e = !k(n) && m.keys(n), u = (e || n).length, i = 0; u > i; i++) {
            var o = e ? e[i] : i;
            if (t(n[o], o, n)) return !0;
        }
        return !1;
    }, m.contains = m.includes = m.include = function(n, t, r, e) {
        return k(n) || (n = m.values(n)), ("number" != typeof r || e) && (r = 0), m.indexOf(n, t, r) >= 0;
    }, m.invoke = function(n, t) {
        var r = l.call(arguments, 2), e = m.isFunction(t);
        return m.map(n, function(n) {
            var u = e ? t : n[t];
            return null == u ? u : u.apply(n, r);
        });
    }, m.pluck = function(n, t) {
        return m.map(n, m.property(t));
    }, m.where = function(n, t) {
        return m.filter(n, m.matcher(t));
    }, m.findWhere = function(n, t) {
        return m.find(n, m.matcher(t));
    }, m.max = function(n, t, r) {
        var e, u, i = -1 / 0, o = -1 / 0;
        if (null == t && null != n) {
            n = k(n) ? n : m.values(n);
            for (var a = 0, c = n.length; c > a; a++) e = n[a], e > i && (i = e);
        } else t = x(t, r), m.each(n, function(n, r, e) {
            u = t(n, r, e), (u > o || u === -1 / 0 && i === -1 / 0) && (i = n, o = u);
        });
        return i;
    }, m.min = function(n, t, r) {
        var e, u, i = 1 / 0, o = 1 / 0;
        if (null == t && null != n) {
            n = k(n) ? n : m.values(n);
            for (var a = 0, c = n.length; c > a; a++) e = n[a], i > e && (i = e);
        } else t = x(t, r), m.each(n, function(n, r, e) {
            u = t(n, r, e), (o > u || 1 / 0 === u && 1 / 0 === i) && (i = n, o = u);
        });
        return i;
    }, m.shuffle = function(n) {
        for (var t, r = k(n) ? n : m.values(n), e = r.length, u = Array(e), i = 0; e > i; i++) t = m.random(0, i), 
        t !== i && (u[i] = u[t]), u[t] = r[i];
        return u;
    }, m.sample = function(n, t, r) {
        return null == t || r ? (k(n) || (n = m.values(n)), n[m.random(n.length - 1)]) : m.shuffle(n).slice(0, Math.max(0, t));
    }, m.sortBy = function(n, t, r) {
        return t = x(t, r), m.pluck(m.map(n, function(n, r, e) {
            return {
                value: n,
                index: r,
                criteria: t(n, r, e)
            };
        }).sort(function(n, t) {
            var r = n.criteria, e = t.criteria;
            if (r !== e) {
                if (r > e || r === void 0) return 1;
                if (e > r || e === void 0) return -1;
            }
            return n.index - t.index;
        }), "value");
    };
    var F = function(n) {
        return function(t, r, e) {
            var u = {};
            return r = x(r, e), m.each(t, function(e, i) {
                var o = r(e, i, t);
                n(u, e, o);
            }), u;
        };
    };
    m.groupBy = F(function(n, t, r) {
        m.has(n, r) ? n[r].push(t) : n[r] = [ t ];
    }), m.indexBy = F(function(n, t, r) {
        n[r] = t;
    }), m.countBy = F(function(n, t, r) {
        m.has(n, r) ? n[r]++ : n[r] = 1;
    }), m.toArray = function(n) {
        return n ? m.isArray(n) ? l.call(n) : k(n) ? m.map(n, m.identity) : m.values(n) : [];
    }, m.size = function(n) {
        return null == n ? 0 : k(n) ? n.length : m.keys(n).length;
    }, m.partition = function(n, t, r) {
        t = x(t, r);
        var e = [], u = [];
        return m.each(n, function(n, r, i) {
            (t(n, r, i) ? e : u).push(n);
        }), [ e, u ];
    }, m.first = m.head = m.take = function(n, t, r) {
        return null == n ? void 0 : null == t || r ? n[0] : m.initial(n, n.length - t);
    }, m.initial = function(n, t, r) {
        return l.call(n, 0, Math.max(0, n.length - (null == t || r ? 1 : t)));
    }, m.last = function(n, t, r) {
        return null == n ? void 0 : null == t || r ? n[n.length - 1] : m.rest(n, Math.max(0, n.length - t));
    }, m.rest = m.tail = m.drop = function(n, t, r) {
        return l.call(n, null == t || r ? 1 : t);
    }, m.compact = function(n) {
        return m.filter(n, m.identity);
    };
    var S = function(n, t, r, e) {
        for (var u = [], i = 0, o = e || 0, a = O(n); a > o; o++) {
            var c = n[o];
            if (k(c) && (m.isArray(c) || m.isArguments(c))) {
                t || (c = S(c, t, r));
                var f = 0, l = c.length;
                for (u.length += l; l > f; ) u[i++] = c[f++];
            } else r || (u[i++] = c);
        }
        return u;
    };
    m.flatten = function(n, t) {
        return S(n, t, !1);
    }, m.without = function(n) {
        return m.difference(n, l.call(arguments, 1));
    }, m.uniq = m.unique = function(n, t, r, e) {
        m.isBoolean(t) || (e = r, r = t, t = !1), null != r && (r = x(r, e));
        for (var u = [], i = [], o = 0, a = O(n); a > o; o++) {
            var c = n[o], f = r ? r(c, o, n) : c;
            t ? (o && i === f || u.push(c), i = f) : r ? m.contains(i, f) || (i.push(f), u.push(c)) : m.contains(u, c) || u.push(c);
        }
        return u;
    }, m.union = function() {
        return m.uniq(S(arguments, !0, !0));
    }, m.intersection = function(n) {
        for (var t = [], r = arguments.length, e = 0, u = O(n); u > e; e++) {
            var i = n[e];
            if (!m.contains(t, i)) {
                for (var o = 1; r > o && m.contains(arguments[o], i); o++) ;
                o === r && t.push(i);
            }
        }
        return t;
    }, m.difference = function(n) {
        var t = S(arguments, !0, !0, 1);
        return m.filter(n, function(n) {
            return !m.contains(t, n);
        });
    }, m.zip = function() {
        return m.unzip(arguments);
    }, m.unzip = function(n) {
        for (var t = n && m.max(n, O).length || 0, r = Array(t), e = 0; t > e; e++) r[e] = m.pluck(n, e);
        return r;
    }, m.object = function(n, t) {
        for (var r = {}, e = 0, u = O(n); u > e; e++) t ? r[n[e]] = t[e] : r[n[e][0]] = n[e][1];
        return r;
    }, m.findIndex = t(1), m.findLastIndex = t(-1), m.sortedIndex = function(n, t, r, e) {
        r = x(r, e, 1);
        for (var u = r(t), i = 0, o = O(n); o > i; ) {
            var a = Math.floor((i + o) / 2);
            r(n[a]) < u ? i = a + 1 : o = a;
        }
        return i;
    }, m.indexOf = r(1, m.findIndex, m.sortedIndex), m.lastIndexOf = r(-1, m.findLastIndex), 
    m.range = function(n, t, r) {
        null == t && (t = n || 0, n = 0), r = r || 1;
        for (var e = Math.max(Math.ceil((t - n) / r), 0), u = Array(e), i = 0; e > i; i++, 
        n += r) u[i] = n;
        return u;
    };
    var E = function(n, t, r, e, u) {
        if (!(e instanceof t)) return n.apply(r, u);
        var i = j(n.prototype), o = n.apply(i, u);
        return m.isObject(o) ? o : i;
    };
    m.bind = function(n, t) {
        if (g && n.bind === g) return g.apply(n, l.call(arguments, 1));
        if (!m.isFunction(n)) throw new TypeError("Bind must be called on a function");
        var r = l.call(arguments, 2), e = function() {
            return E(n, e, t, this, r.concat(l.call(arguments)));
        };
        return e;
    }, m.partial = function(n) {
        var t = l.call(arguments, 1), r = function() {
            for (var e = 0, u = t.length, i = Array(u), o = 0; u > o; o++) i[o] = t[o] === m ? arguments[e++] : t[o];
            for (;e < arguments.length; ) i.push(arguments[e++]);
            return E(n, r, this, this, i);
        };
        return r;
    }, m.bindAll = function(n) {
        var t, r, e = arguments.length;
        if (1 >= e) throw new Error("bindAll must be passed function names");
        for (t = 1; e > t; t++) r = arguments[t], n[r] = m.bind(n[r], n);
        return n;
    }, m.memoize = function(n, t) {
        var r = function(e) {
            var u = r.cache, i = "" + (t ? t.apply(this, arguments) : e);
            return m.has(u, i) || (u[i] = n.apply(this, arguments)), u[i];
        };
        return r.cache = {}, r;
    }, m.delay = function(n, t) {
        var r = l.call(arguments, 2);
        return setTimeout(function() {
            return n.apply(null, r);
        }, t);
    }, m.defer = m.partial(m.delay, m, 1), m.throttle = function(n, t, r) {
        var e, u, i, o = null, a = 0;
        r || (r = {});
        var c = function() {
            a = r.leading === !1 ? 0 : m.now(), o = null, i = n.apply(e, u), o || (e = u = null);
        };
        return function() {
            var f = m.now();
            a || r.leading !== !1 || (a = f);
            var l = t - (f - a);
            return e = this, u = arguments, 0 >= l || l > t ? (o && (clearTimeout(o), o = null), 
            a = f, i = n.apply(e, u), o || (e = u = null)) : o || r.trailing === !1 || (o = setTimeout(c, l)), 
            i;
        };
    }, m.debounce = function(n, t, r) {
        var e, u, i, o, a, c = function() {
            var f = m.now() - o;
            t > f && f >= 0 ? e = setTimeout(c, t - f) : (e = null, r || (a = n.apply(i, u), 
            e || (i = u = null)));
        };
        return function() {
            i = this, u = arguments, o = m.now();
            var f = r && !e;
            return e || (e = setTimeout(c, t)), f && (a = n.apply(i, u), i = u = null), a;
        };
    }, m.wrap = function(n, t) {
        return m.partial(t, n);
    }, m.negate = function(n) {
        return function() {
            return !n.apply(this, arguments);
        };
    }, m.compose = function() {
        var n = arguments, t = n.length - 1;
        return function() {
            for (var r = t, e = n[t].apply(this, arguments); r--; ) e = n[r].call(this, e);
            return e;
        };
    }, m.after = function(n, t) {
        return function() {
            return --n < 1 ? t.apply(this, arguments) : void 0;
        };
    }, m.before = function(n, t) {
        var r;
        return function() {
            return --n > 0 && (r = t.apply(this, arguments)), 1 >= n && (t = null), r;
        };
    }, m.once = m.partial(m.before, 2);
    var M = !{
        toString: null
    }.propertyIsEnumerable("toString"), I = [ "valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString" ];
    m.keys = function(n) {
        if (!m.isObject(n)) return [];
        if (v) return v(n);
        var t = [];
        for (var r in n) m.has(n, r) && t.push(r);
        return M && e(n, t), t;
    }, m.allKeys = function(n) {
        if (!m.isObject(n)) return [];
        var t = [];
        for (var r in n) t.push(r);
        return M && e(n, t), t;
    }, m.values = function(n) {
        for (var t = m.keys(n), r = t.length, e = Array(r), u = 0; r > u; u++) e[u] = n[t[u]];
        return e;
    }, m.mapObject = function(n, t, r) {
        t = x(t, r);
        for (var e, u = m.keys(n), i = u.length, o = {}, a = 0; i > a; a++) e = u[a], o[e] = t(n[e], e, n);
        return o;
    }, m.pairs = function(n) {
        for (var t = m.keys(n), r = t.length, e = Array(r), u = 0; r > u; u++) e[u] = [ t[u], n[t[u]] ];
        return e;
    }, m.invert = function(n) {
        for (var t = {}, r = m.keys(n), e = 0, u = r.length; u > e; e++) t[n[r[e]]] = r[e];
        return t;
    }, m.functions = m.methods = function(n) {
        var t = [];
        for (var r in n) m.isFunction(n[r]) && t.push(r);
        return t.sort();
    }, m.extend = _(m.allKeys), m.extendOwn = m.assign = _(m.keys), m.findKey = function(n, t, r) {
        t = x(t, r);
        for (var e, u = m.keys(n), i = 0, o = u.length; o > i; i++) if (e = u[i], t(n[e], e, n)) return e;
    }, m.pick = function(n, t, r) {
        var e, u, i = {}, o = n;
        if (null == o) return i;
        m.isFunction(t) ? (u = m.allKeys(o), e = b(t, r)) : (u = S(arguments, !1, !1, 1), 
        e = function(n, t, r) {
            return t in r;
        }, o = Object(o));
        for (var a = 0, c = u.length; c > a; a++) {
            var f = u[a], l = o[f];
            e(l, f, o) && (i[f] = l);
        }
        return i;
    }, m.omit = function(n, t, r) {
        if (m.isFunction(t)) t = m.negate(t); else {
            var e = m.map(S(arguments, !1, !1, 1), String);
            t = function(n, t) {
                return !m.contains(e, t);
            };
        }
        return m.pick(n, t, r);
    }, m.defaults = _(m.allKeys, !0), m.create = function(n, t) {
        var r = j(n);
        return t && m.extendOwn(r, t), r;
    }, m.clone = function(n) {
        return m.isObject(n) ? m.isArray(n) ? n.slice() : m.extend({}, n) : n;
    }, m.tap = function(n, t) {
        return t(n), n;
    }, m.isMatch = function(n, t) {
        var r = m.keys(t), e = r.length;
        if (null == n) return !e;
        for (var u = Object(n), i = 0; e > i; i++) {
            var o = r[i];
            if (t[o] !== u[o] || !(o in u)) return !1;
        }
        return !0;
    };
    var N = function(n, t, r, e) {
        if (n === t) return 0 !== n || 1 / n === 1 / t;
        if (null == n || null == t) return n === t;
        n instanceof m && (n = n._wrapped), t instanceof m && (t = t._wrapped);
        var u = s.call(n);
        if (u !== s.call(t)) return !1;
        switch (u) {
          case "[object RegExp]":
          case "[object String]":
            return "" + n == "" + t;

          case "[object Number]":
            return +n !== +n ? +t !== +t : 0 === +n ? 1 / +n === 1 / t : +n === +t;

          case "[object Date]":
          case "[object Boolean]":
            return +n === +t;
        }
        var i = "[object Array]" === u;
        if (!i) {
            if ("object" != typeof n || "object" != typeof t) return !1;
            var o = n.constructor, a = t.constructor;
            if (o !== a && !(m.isFunction(o) && o instanceof o && m.isFunction(a) && a instanceof a) && "constructor" in n && "constructor" in t) return !1;
        }
        r = r || [], e = e || [];
        for (var c = r.length; c--; ) if (r[c] === n) return e[c] === t;
        if (r.push(n), e.push(t), i) {
            if (c = n.length, c !== t.length) return !1;
            for (;c--; ) if (!N(n[c], t[c], r, e)) return !1;
        } else {
            var f, l = m.keys(n);
            if (c = l.length, m.keys(t).length !== c) return !1;
            for (;c--; ) if (f = l[c], !m.has(t, f) || !N(n[f], t[f], r, e)) return !1;
        }
        return r.pop(), e.pop(), !0;
    };
    m.isEqual = function(n, t) {
        return N(n, t);
    }, m.isEmpty = function(n) {
        return null == n ? !0 : k(n) && (m.isArray(n) || m.isString(n) || m.isArguments(n)) ? 0 === n.length : 0 === m.keys(n).length;
    }, m.isElement = function(n) {
        return !(!n || 1 !== n.nodeType);
    }, m.isArray = h || function(n) {
        return "[object Array]" === s.call(n);
    }, m.isObject = function(n) {
        var t = typeof n;
        return "function" === t || "object" === t && !!n;
    }, m.each([ "Arguments", "Function", "String", "Number", "Date", "RegExp", "Error" ], function(n) {
        m["is" + n] = function(t) {
            return s.call(t) === "[object " + n + "]";
        };
    }), m.isArguments(arguments) || (m.isArguments = function(n) {
        return m.has(n, "callee");
    }), "function" != typeof /./ && "object" != typeof Int8Array && (m.isFunction = function(n) {
        return "function" == typeof n || !1;
    }), m.isFinite = function(n) {
        return isFinite(n) && !isNaN(parseFloat(n));
    }, m.isNaN = function(n) {
        return m.isNumber(n) && n !== +n;
    }, m.isBoolean = function(n) {
        return n === !0 || n === !1 || "[object Boolean]" === s.call(n);
    }, m.isNull = function(n) {
        return null === n;
    }, m.isUndefined = function(n) {
        return n === void 0;
    }, m.has = function(n, t) {
        return null != n && p.call(n, t);
    }, m.noConflict = function() {
        return u._ = i, this;
    }, m.identity = function(n) {
        return n;
    }, m.constant = function(n) {
        return function() {
            return n;
        };
    }, m.noop = function() {}, m.property = w, m.propertyOf = function(n) {
        return null == n ? function() {} : function(t) {
            return n[t];
        };
    }, m.matcher = m.matches = function(n) {
        return n = m.extendOwn({}, n), function(t) {
            return m.isMatch(t, n);
        };
    }, m.times = function(n, t, r) {
        var e = Array(Math.max(0, n));
        t = b(t, r, 1);
        for (var u = 0; n > u; u++) e[u] = t(u);
        return e;
    }, m.random = function(n, t) {
        return null == t && (t = n, n = 0), n + Math.floor(Math.random() * (t - n + 1));
    }, m.now = Date.now || function() {
        return new Date().getTime();
    };
    var B = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "`": "&#x60;"
    }, T = m.invert(B), R = function(n) {
        var t = function(t) {
            return n[t];
        }, r = "(?:" + m.keys(n).join("|") + ")", e = RegExp(r), u = RegExp(r, "g");
        return function(n) {
            return n = null == n ? "" : "" + n, e.test(n) ? n.replace(u, t) : n;
        };
    };
    m.escape = R(B), m.unescape = R(T), m.result = function(n, t, r) {
        var e = null == n ? void 0 : n[t];
        return e === void 0 && (e = r), m.isFunction(e) ? e.call(n) : e;
    };
    var q = 0;
    m.uniqueId = function(n) {
        var t = ++q + "";
        return n ? n + t : t;
    }, m.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };
    var K = /(.)^/, z = {
        "'": "'",
        "\\": "\\",
        "\r": "r",
        "\n": "n",
        "\u2028": "u2028",
        "\u2029": "u2029"
    }, D = /\\|'|\r|\n|\u2028|\u2029/g, L = function(n) {
        return "\\" + z[n];
    };
    m.template = function(n, t, r) {
        !t && r && (t = r), t = m.defaults({}, t, m.templateSettings);
        var e = RegExp([ (t.escape || K).source, (t.interpolate || K).source, (t.evaluate || K).source ].join("|") + "|$", "g"), u = 0, i = "__p+='";
        n.replace(e, function(t, r, e, o, a) {
            return i += n.slice(u, a).replace(D, L), u = a + t.length, r ? i += "'+\n((__t=(" + r + "))==null?'':_.escape(__t))+\n'" : e ? i += "'+\n((__t=(" + e + "))==null?'':__t)+\n'" : o && (i += "';\n" + o + "\n__p+='"), 
            t;
        }), i += "';\n", t.variable || (i = "with(obj||{}){\n" + i + "}\n"), i = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + i + "return __p;\n";
        try {
            var o = new Function(t.variable || "obj", "_", i);
        } catch (a) {
            throw a.source = i, a;
        }
        var c = function(n) {
            return o.call(this, n, m);
        }, f = t.variable || "obj";
        return c.source = "function(" + f + "){\n" + i + "}", c;
    }, m.chain = function(n) {
        var t = m(n);
        return t._chain = !0, t;
    };
    var P = function(n, t) {
        return n._chain ? m(t).chain() : t;
    };
    m.mixin = function(n) {
        m.each(m.functions(n), function(t) {
            var r = m[t] = n[t];
            m.prototype[t] = function() {
                var n = [ this._wrapped ];
                return f.apply(n, arguments), P(this, r.apply(m, n));
            };
        });
    }, m.mixin(m), m.each([ "pop", "push", "reverse", "shift", "sort", "splice", "unshift" ], function(n) {
        var t = o[n];
        m.prototype[n] = function() {
            var r = this._wrapped;
            return t.apply(r, arguments), "shift" !== n && "splice" !== n || 0 !== r.length || delete r[0], 
            P(this, r);
        };
    }), m.each([ "concat", "join", "slice" ], function(n) {
        var t = o[n];
        m.prototype[n] = function() {
            return P(this, t.apply(this._wrapped, arguments));
        };
    }), m.prototype.value = function() {
        return this._wrapped;
    }, m.prototype.valueOf = m.prototype.toJSON = m.prototype.value, m.prototype.toString = function() {
        return "" + this._wrapped;
    }, "function" == typeof define && define.amd && define("underscore", [], function() {
        return m;
    });
}).call(this);

!function() {
    function tinycolor(color, opts) {
        if (color = color ? color : "", opts = opts || {}, color instanceof tinycolor) return color;
        if (!(this instanceof tinycolor)) return new tinycolor(color, opts);
        var rgb = inputToRGB(color);
        this._originalInput = color, this._r = rgb.r, this._g = rgb.g, this._b = rgb.b, 
        this._a = rgb.a, this._roundA = mathRound(100 * this._a) / 100, this._format = opts.format || rgb.format, 
        this._gradientType = opts.gradientType, this._r < 1 && (this._r = mathRound(this._r)), 
        this._g < 1 && (this._g = mathRound(this._g)), this._b < 1 && (this._b = mathRound(this._b)), 
        this._ok = rgb.ok, this._tc_id = tinyCounter++;
    }
    function inputToRGB(color) {
        var rgb = {
            r: 0,
            g: 0,
            b: 0
        }, a = 1, ok = !1, format = !1;
        return "string" == typeof color && (color = stringInputToObject(color)), "object" == typeof color && (color.hasOwnProperty("r") && color.hasOwnProperty("g") && color.hasOwnProperty("b") ? (rgb = rgbToRgb(color.r, color.g, color.b), 
        ok = !0, format = "%" === String(color.r).substr(-1) ? "prgb" : "rgb") : color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("v") ? (color.s = convertToPercentage(color.s), 
        color.v = convertToPercentage(color.v), rgb = hsvToRgb(color.h, color.s, color.v), 
        ok = !0, format = "hsv") : color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("l") && (color.s = convertToPercentage(color.s), 
        color.l = convertToPercentage(color.l), rgb = hslToRgb(color.h, color.s, color.l), 
        ok = !0, format = "hsl"), color.hasOwnProperty("a") && (a = color.a)), a = boundAlpha(a), 
        {
            ok: ok,
            format: color.format || format,
            r: mathMin(255, mathMax(rgb.r, 0)),
            g: mathMin(255, mathMax(rgb.g, 0)),
            b: mathMin(255, mathMax(rgb.b, 0)),
            a: a
        };
    }
    function rgbToRgb(r, g, b) {
        return {
            r: 255 * bound01(r, 255),
            g: 255 * bound01(g, 255),
            b: 255 * bound01(b, 255)
        };
    }
    function rgbToHsl(r, g, b) {
        r = bound01(r, 255), g = bound01(g, 255), b = bound01(b, 255);
        var h, s, max = mathMax(r, g, b), min = mathMin(r, g, b), l = (max + min) / 2;
        if (max == min) h = s = 0; else {
            var d = max - min;
            switch (s = l > .5 ? d / (2 - max - min) : d / (max + min), max) {
              case r:
                h = (g - b) / d + (b > g ? 6 : 0);
                break;

              case g:
                h = (b - r) / d + 2;
                break;

              case b:
                h = (r - g) / d + 4;
            }
            h /= 6;
        }
        return {
            h: h,
            s: s,
            l: l
        };
    }
    function hslToRgb(h, s, l) {
        function hue2rgb(p, q, t) {
            return 0 > t && (t += 1), t > 1 && (t -= 1), 1 / 6 > t ? p + 6 * (q - p) * t : .5 > t ? q : 2 / 3 > t ? p + 6 * (q - p) * (2 / 3 - t) : p;
        }
        var r, g, b;
        if (h = bound01(h, 360), s = bound01(s, 100), l = bound01(l, 100), 0 === s) r = g = b = l; else {
            var q = .5 > l ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3), g = hue2rgb(p, q, h), b = hue2rgb(p, q, h - 1 / 3);
        }
        return {
            r: 255 * r,
            g: 255 * g,
            b: 255 * b
        };
    }
    function rgbToHsv(r, g, b) {
        r = bound01(r, 255), g = bound01(g, 255), b = bound01(b, 255);
        var h, s, max = mathMax(r, g, b), min = mathMin(r, g, b), v = max, d = max - min;
        if (s = 0 === max ? 0 : d / max, max == min) h = 0; else {
            switch (max) {
              case r:
                h = (g - b) / d + (b > g ? 6 : 0);
                break;

              case g:
                h = (b - r) / d + 2;
                break;

              case b:
                h = (r - g) / d + 4;
            }
            h /= 6;
        }
        return {
            h: h,
            s: s,
            v: v
        };
    }
    function hsvToRgb(h, s, v) {
        h = 6 * bound01(h, 360), s = bound01(s, 100), v = bound01(v, 100);
        var i = math.floor(h), f = h - i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s), mod = i % 6, r = [ v, q, p, p, t, v ][mod], g = [ t, v, v, q, p, p ][mod], b = [ p, p, t, v, v, q ][mod];
        return {
            r: 255 * r,
            g: 255 * g,
            b: 255 * b
        };
    }
    function rgbToHex(r, g, b, allow3Char) {
        var hex = [ pad2(mathRound(r).toString(16)), pad2(mathRound(g).toString(16)), pad2(mathRound(b).toString(16)) ];
        return allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1) ? hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) : hex.join("");
    }
    function rgbaToHex(r, g, b, a) {
        var hex = [ pad2(convertDecimalToHex(a)), pad2(mathRound(r).toString(16)), pad2(mathRound(g).toString(16)), pad2(mathRound(b).toString(16)) ];
        return hex.join("");
    }
    function desaturate(color, amount) {
        amount = 0 === amount ? 0 : amount || 10;
        var hsl = tinycolor(color).toHsl();
        return hsl.s -= amount / 100, hsl.s = clamp01(hsl.s), tinycolor(hsl);
    }
    function saturate(color, amount) {
        amount = 0 === amount ? 0 : amount || 10;
        var hsl = tinycolor(color).toHsl();
        return hsl.s += amount / 100, hsl.s = clamp01(hsl.s), tinycolor(hsl);
    }
    function greyscale(color) {
        return tinycolor(color).desaturate(100);
    }
    function lighten(color, amount) {
        amount = 0 === amount ? 0 : amount || 10;
        var hsl = tinycolor(color).toHsl();
        return hsl.l += amount / 100, hsl.l = clamp01(hsl.l), tinycolor(hsl);
    }
    function brighten(color, amount) {
        amount = 0 === amount ? 0 : amount || 10;
        var rgb = tinycolor(color).toRgb();
        return rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * -(amount / 100)))), 
        rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * -(amount / 100)))), rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * -(amount / 100)))), 
        tinycolor(rgb);
    }
    function darken(color, amount) {
        amount = 0 === amount ? 0 : amount || 10;
        var hsl = tinycolor(color).toHsl();
        return hsl.l -= amount / 100, hsl.l = clamp01(hsl.l), tinycolor(hsl);
    }
    function spin(color, amount) {
        var hsl = tinycolor(color).toHsl(), hue = (mathRound(hsl.h) + amount) % 360;
        return hsl.h = 0 > hue ? 360 + hue : hue, tinycolor(hsl);
    }
    function complement(color) {
        var hsl = tinycolor(color).toHsl();
        return hsl.h = (hsl.h + 180) % 360, tinycolor(hsl);
    }
    function triad(color) {
        var hsl = tinycolor(color).toHsl(), h = hsl.h;
        return [ tinycolor(color), tinycolor({
            h: (h + 120) % 360,
            s: hsl.s,
            l: hsl.l
        }), tinycolor({
            h: (h + 240) % 360,
            s: hsl.s,
            l: hsl.l
        }) ];
    }
    function tetrad(color) {
        var hsl = tinycolor(color).toHsl(), h = hsl.h;
        return [ tinycolor(color), tinycolor({
            h: (h + 90) % 360,
            s: hsl.s,
            l: hsl.l
        }), tinycolor({
            h: (h + 180) % 360,
            s: hsl.s,
            l: hsl.l
        }), tinycolor({
            h: (h + 270) % 360,
            s: hsl.s,
            l: hsl.l
        }) ];
    }
    function splitcomplement(color) {
        var hsl = tinycolor(color).toHsl(), h = hsl.h;
        return [ tinycolor(color), tinycolor({
            h: (h + 72) % 360,
            s: hsl.s,
            l: hsl.l
        }), tinycolor({
            h: (h + 216) % 360,
            s: hsl.s,
            l: hsl.l
        }) ];
    }
    function analogous(color, results, slices) {
        results = results || 6, slices = slices || 30;
        var hsl = tinycolor(color).toHsl(), part = 360 / slices, ret = [ tinycolor(color) ];
        for (hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results; ) hsl.h = (hsl.h + part) % 360, 
        ret.push(tinycolor(hsl));
        return ret;
    }
    function monochromatic(color, results) {
        results = results || 6;
        for (var hsv = tinycolor(color).toHsv(), h = hsv.h, s = hsv.s, v = hsv.v, ret = [], modification = 1 / results; results--; ) ret.push(tinycolor({
            h: h,
            s: s,
            v: v
        })), v = (v + modification) % 1;
        return ret;
    }
    function flip(o) {
        var flipped = {};
        for (var i in o) o.hasOwnProperty(i) && (flipped[o[i]] = i);
        return flipped;
    }
    function boundAlpha(a) {
        return a = parseFloat(a), (isNaN(a) || 0 > a || a > 1) && (a = 1), a;
    }
    function bound01(n, max) {
        isOnePointZero(n) && (n = "100%");
        var processPercent = isPercentage(n);
        return n = mathMin(max, mathMax(0, parseFloat(n))), processPercent && (n = parseInt(n * max, 10) / 100), 
        math.abs(n - max) < 1e-6 ? 1 : n % max / parseFloat(max);
    }
    function clamp01(val) {
        return mathMin(1, mathMax(0, val));
    }
    function parseIntFromHex(val) {
        return parseInt(val, 16);
    }
    function isOnePointZero(n) {
        return "string" == typeof n && -1 != n.indexOf(".") && 1 === parseFloat(n);
    }
    function isPercentage(n) {
        return "string" == typeof n && -1 != n.indexOf("%");
    }
    function pad2(c) {
        return 1 == c.length ? "0" + c : "" + c;
    }
    function convertToPercentage(n) {
        return 1 >= n && (n = 100 * n + "%"), n;
    }
    function convertDecimalToHex(d) {
        return Math.round(255 * parseFloat(d)).toString(16);
    }
    function convertHexToDecimal(h) {
        return parseIntFromHex(h) / 255;
    }
    function stringInputToObject(color) {
        color = color.replace(trimLeft, "").replace(trimRight, "").toLowerCase();
        var named = !1;
        if (names[color]) color = names[color], named = !0; else if ("transparent" == color) return {
            r: 0,
            g: 0,
            b: 0,
            a: 0,
            format: "name"
        };
        var match;
        return (match = matchers.rgb.exec(color)) ? {
            r: match[1],
            g: match[2],
            b: match[3]
        } : (match = matchers.rgba.exec(color)) ? {
            r: match[1],
            g: match[2],
            b: match[3],
            a: match[4]
        } : (match = matchers.hsl.exec(color)) ? {
            h: match[1],
            s: match[2],
            l: match[3]
        } : (match = matchers.hsla.exec(color)) ? {
            h: match[1],
            s: match[2],
            l: match[3],
            a: match[4]
        } : (match = matchers.hsv.exec(color)) ? {
            h: match[1],
            s: match[2],
            v: match[3]
        } : (match = matchers.hsva.exec(color)) ? {
            h: match[1],
            s: match[2],
            v: match[3],
            a: match[4]
        } : (match = matchers.hex8.exec(color)) ? {
            a: convertHexToDecimal(match[1]),
            r: parseIntFromHex(match[2]),
            g: parseIntFromHex(match[3]),
            b: parseIntFromHex(match[4]),
            format: named ? "name" : "hex8"
        } : (match = matchers.hex6.exec(color)) ? {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            format: named ? "name" : "hex"
        } : (match = matchers.hex3.exec(color)) ? {
            r: parseIntFromHex(match[1] + "" + match[1]),
            g: parseIntFromHex(match[2] + "" + match[2]),
            b: parseIntFromHex(match[3] + "" + match[3]),
            format: named ? "name" : "hex"
        } : !1;
    }
    function validateWCAG2Parms(parms) {
        var level, size;
        return parms = parms || {
            level: "AA",
            size: "small"
        }, level = (parms.level || "AA").toUpperCase(), size = (parms.size || "small").toLowerCase(), 
        "AA" !== level && "AAA" !== level && (level = "AA"), "small" !== size && "large" !== size && (size = "small"), 
        {
            level: level,
            size: size
        };
    }
    var trimLeft = /^\s+/, trimRight = /\s+$/, tinyCounter = 0, math = Math, mathRound = math.round, mathMin = math.min, mathMax = math.max, mathRandom = math.random;
    tinycolor.prototype = {
        isDark: function() {
            return this.getBrightness() < 128;
        },
        isLight: function() {
            return !this.isDark();
        },
        isValid: function() {
            return this._ok;
        },
        getOriginalInput: function() {
            return this._originalInput;
        },
        getFormat: function() {
            return this._format;
        },
        getAlpha: function() {
            return this._a;
        },
        getBrightness: function() {
            var rgb = this.toRgb();
            return (299 * rgb.r + 587 * rgb.g + 114 * rgb.b) / 1e3;
        },
        getLuminance: function() {
            var RsRGB, GsRGB, BsRGB, R, G, B, rgb = this.toRgb();
            return RsRGB = rgb.r / 255, GsRGB = rgb.g / 255, BsRGB = rgb.b / 255, R = .03928 >= RsRGB ? RsRGB / 12.92 : Math.pow((RsRGB + .055) / 1.055, 2.4), 
            G = .03928 >= GsRGB ? GsRGB / 12.92 : Math.pow((GsRGB + .055) / 1.055, 2.4), B = .03928 >= BsRGB ? BsRGB / 12.92 : Math.pow((BsRGB + .055) / 1.055, 2.4), 
            .2126 * R + .7152 * G + .0722 * B;
        },
        setAlpha: function(value) {
            return this._a = boundAlpha(value), this._roundA = mathRound(100 * this._a) / 100, 
            this;
        },
        toHsv: function() {
            var hsv = rgbToHsv(this._r, this._g, this._b);
            return {
                h: 360 * hsv.h,
                s: hsv.s,
                v: hsv.v,
                a: this._a
            };
        },
        toHsvString: function() {
            var hsv = rgbToHsv(this._r, this._g, this._b), h = mathRound(360 * hsv.h), s = mathRound(100 * hsv.s), v = mathRound(100 * hsv.v);
            return 1 == this._a ? "hsv(" + h + ", " + s + "%, " + v + "%)" : "hsva(" + h + ", " + s + "%, " + v + "%, " + this._roundA + ")";
        },
        toHsl: function() {
            var hsl = rgbToHsl(this._r, this._g, this._b);
            return {
                h: 360 * hsl.h,
                s: hsl.s,
                l: hsl.l,
                a: this._a
            };
        },
        toHslString: function() {
            var hsl = rgbToHsl(this._r, this._g, this._b), h = mathRound(360 * hsl.h), s = mathRound(100 * hsl.s), l = mathRound(100 * hsl.l);
            return 1 == this._a ? "hsl(" + h + ", " + s + "%, " + l + "%)" : "hsla(" + h + ", " + s + "%, " + l + "%, " + this._roundA + ")";
        },
        toHex: function(allow3Char) {
            return rgbToHex(this._r, this._g, this._b, allow3Char);
        },
        toHexString: function(allow3Char) {
            return "#" + this.toHex(allow3Char);
        },
        toHex8: function() {
            return rgbaToHex(this._r, this._g, this._b, this._a);
        },
        toHex8String: function() {
            return "#" + this.toHex8();
        },
        toRgb: function() {
            return {
                r: mathRound(this._r),
                g: mathRound(this._g),
                b: mathRound(this._b),
                a: this._a
            };
        },
        toRgbString: function() {
            return 1 == this._a ? "rgb(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" : "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
        },
        toPercentageRgb: function() {
            return {
                r: mathRound(100 * bound01(this._r, 255)) + "%",
                g: mathRound(100 * bound01(this._g, 255)) + "%",
                b: mathRound(100 * bound01(this._b, 255)) + "%",
                a: this._a
            };
        },
        toPercentageRgbString: function() {
            return 1 == this._a ? "rgb(" + mathRound(100 * bound01(this._r, 255)) + "%, " + mathRound(100 * bound01(this._g, 255)) + "%, " + mathRound(100 * bound01(this._b, 255)) + "%)" : "rgba(" + mathRound(100 * bound01(this._r, 255)) + "%, " + mathRound(100 * bound01(this._g, 255)) + "%, " + mathRound(100 * bound01(this._b, 255)) + "%, " + this._roundA + ")";
        },
        toName: function() {
            return 0 === this._a ? "transparent" : this._a < 1 ? !1 : hexNames[rgbToHex(this._r, this._g, this._b, !0)] || !1;
        },
        toFilter: function(secondColor) {
            var hex8String = "#" + rgbaToHex(this._r, this._g, this._b, this._a), secondHex8String = hex8String, gradientType = this._gradientType ? "GradientType = 1, " : "";
            if (secondColor) {
                var s = tinycolor(secondColor);
                secondHex8String = s.toHex8String();
            }
            return "progid:DXImageTransform.Microsoft.gradient(" + gradientType + "startColorstr=" + hex8String + ",endColorstr=" + secondHex8String + ")";
        },
        toString: function(format) {
            var formatSet = !!format;
            format = format || this._format;
            var formattedString = !1, hasAlpha = this._a < 1 && this._a >= 0, needsAlphaFormat = !formatSet && hasAlpha && ("hex" === format || "hex6" === format || "hex3" === format || "name" === format);
            return needsAlphaFormat ? "name" === format && 0 === this._a ? this.toName() : this.toRgbString() : ("rgb" === format && (formattedString = this.toRgbString()), 
            "prgb" === format && (formattedString = this.toPercentageRgbString()), ("hex" === format || "hex6" === format) && (formattedString = this.toHexString()), 
            "hex3" === format && (formattedString = this.toHexString(!0)), "hex8" === format && (formattedString = this.toHex8String()), 
            "name" === format && (formattedString = this.toName()), "hsl" === format && (formattedString = this.toHslString()), 
            "hsv" === format && (formattedString = this.toHsvString()), formattedString || this.toHexString());
        },
        clone: function() {
            return tinycolor(this.toString());
        },
        _applyModification: function(fn, args) {
            var color = fn.apply(null, [ this ].concat([].slice.call(args)));
            return this._r = color._r, this._g = color._g, this._b = color._b, this.setAlpha(color._a), 
            this;
        },
        lighten: function() {
            return this._applyModification(lighten, arguments);
        },
        brighten: function() {
            return this._applyModification(brighten, arguments);
        },
        darken: function() {
            return this._applyModification(darken, arguments);
        },
        desaturate: function() {
            return this._applyModification(desaturate, arguments);
        },
        saturate: function() {
            return this._applyModification(saturate, arguments);
        },
        greyscale: function() {
            return this._applyModification(greyscale, arguments);
        },
        spin: function() {
            return this._applyModification(spin, arguments);
        },
        _applyCombination: function(fn, args) {
            return fn.apply(null, [ this ].concat([].slice.call(args)));
        },
        analogous: function() {
            return this._applyCombination(analogous, arguments);
        },
        complement: function() {
            return this._applyCombination(complement, arguments);
        },
        monochromatic: function() {
            return this._applyCombination(monochromatic, arguments);
        },
        splitcomplement: function() {
            return this._applyCombination(splitcomplement, arguments);
        },
        triad: function() {
            return this._applyCombination(triad, arguments);
        },
        tetrad: function() {
            return this._applyCombination(tetrad, arguments);
        }
    }, tinycolor.fromRatio = function(color, opts) {
        if ("object" == typeof color) {
            var newColor = {};
            for (var i in color) color.hasOwnProperty(i) && (newColor[i] = "a" === i ? color[i] : convertToPercentage(color[i]));
            color = newColor;
        }
        return tinycolor(color, opts);
    }, tinycolor.equals = function(color1, color2) {
        return color1 && color2 ? tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString() : !1;
    }, tinycolor.random = function() {
        return tinycolor.fromRatio({
            r: mathRandom(),
            g: mathRandom(),
            b: mathRandom()
        });
    }, tinycolor.mix = function(color1, color2, amount) {
        amount = 0 === amount ? 0 : amount || 50;
        var w1, rgb1 = tinycolor(color1).toRgb(), rgb2 = tinycolor(color2).toRgb(), p = amount / 100, w = 2 * p - 1, a = rgb2.a - rgb1.a;
        w1 = -1 == w * a ? w : (w + a) / (1 + w * a), w1 = (w1 + 1) / 2;
        var w2 = 1 - w1, rgba = {
            r: rgb2.r * w1 + rgb1.r * w2,
            g: rgb2.g * w1 + rgb1.g * w2,
            b: rgb2.b * w1 + rgb1.b * w2,
            a: rgb2.a * p + rgb1.a * (1 - p)
        };
        return tinycolor(rgba);
    }, tinycolor.readability = function(color1, color2) {
        var c1 = tinycolor(color1), c2 = tinycolor(color2);
        return (Math.max(c1.getLuminance(), c2.getLuminance()) + .05) / (Math.min(c1.getLuminance(), c2.getLuminance()) + .05);
    }, tinycolor.isReadable = function(color1, color2, wcag2) {
        var wcag2Parms, out, readability = tinycolor.readability(color1, color2);
        switch (out = !1, wcag2Parms = validateWCAG2Parms(wcag2), wcag2Parms.level + wcag2Parms.size) {
          case "AAsmall":
          case "AAAlarge":
            out = readability >= 4.5;
            break;

          case "AAlarge":
            out = readability >= 3;
            break;

          case "AAAsmall":
            out = readability >= 7;
        }
        return out;
    }, tinycolor.mostReadable = function(baseColor, colorList, args) {
        var readability, includeFallbackColors, level, size, bestColor = null, bestScore = 0;
        args = args || {}, includeFallbackColors = args.includeFallbackColors, level = args.level, 
        size = args.size;
        for (var i = 0; i < colorList.length; i++) readability = tinycolor.readability(baseColor, colorList[i]), 
        readability > bestScore && (bestScore = readability, bestColor = tinycolor(colorList[i]));
        return tinycolor.isReadable(baseColor, bestColor, {
            level: level,
            size: size
        }) || !includeFallbackColors ? bestColor : (args.includeFallbackColors = !1, tinycolor.mostReadable(baseColor, [ "#fff", "#000" ], args));
    };
    var names = tinycolor.names = {
        aliceblue: "f0f8ff",
        antiquewhite: "faebd7",
        aqua: "0ff",
        aquamarine: "7fffd4",
        azure: "f0ffff",
        beige: "f5f5dc",
        bisque: "ffe4c4",
        black: "000",
        blanchedalmond: "ffebcd",
        blue: "00f",
        blueviolet: "8a2be2",
        brown: "a52a2a",
        burlywood: "deb887",
        burntsienna: "ea7e5d",
        cadetblue: "5f9ea0",
        chartreuse: "7fff00",
        chocolate: "d2691e",
        coral: "ff7f50",
        cornflowerblue: "6495ed",
        cornsilk: "fff8dc",
        crimson: "dc143c",
        cyan: "0ff",
        darkblue: "00008b",
        darkcyan: "008b8b",
        darkgoldenrod: "b8860b",
        darkgray: "a9a9a9",
        darkgreen: "006400",
        darkgrey: "a9a9a9",
        darkkhaki: "bdb76b",
        darkmagenta: "8b008b",
        darkolivegreen: "556b2f",
        darkorange: "ff8c00",
        darkorchid: "9932cc",
        darkred: "8b0000",
        darksalmon: "e9967a",
        darkseagreen: "8fbc8f",
        darkslateblue: "483d8b",
        darkslategray: "2f4f4f",
        darkslategrey: "2f4f4f",
        darkturquoise: "00ced1",
        darkviolet: "9400d3",
        deeppink: "ff1493",
        deepskyblue: "00bfff",
        dimgray: "696969",
        dimgrey: "696969",
        dodgerblue: "1e90ff",
        firebrick: "b22222",
        floralwhite: "fffaf0",
        forestgreen: "228b22",
        fuchsia: "f0f",
        gainsboro: "dcdcdc",
        ghostwhite: "f8f8ff",
        gold: "ffd700",
        goldenrod: "daa520",
        gray: "808080",
        green: "008000",
        greenyellow: "adff2f",
        grey: "808080",
        honeydew: "f0fff0",
        hotpink: "ff69b4",
        indianred: "cd5c5c",
        indigo: "4b0082",
        ivory: "fffff0",
        khaki: "f0e68c",
        lavender: "e6e6fa",
        lavenderblush: "fff0f5",
        lawngreen: "7cfc00",
        lemonchiffon: "fffacd",
        lightblue: "add8e6",
        lightcoral: "f08080",
        lightcyan: "e0ffff",
        lightgoldenrodyellow: "fafad2",
        lightgray: "d3d3d3",
        lightgreen: "90ee90",
        lightgrey: "d3d3d3",
        lightpink: "ffb6c1",
        lightsalmon: "ffa07a",
        lightseagreen: "20b2aa",
        lightskyblue: "87cefa",
        lightslategray: "789",
        lightslategrey: "789",
        lightsteelblue: "b0c4de",
        lightyellow: "ffffe0",
        lime: "0f0",
        limegreen: "32cd32",
        linen: "faf0e6",
        magenta: "f0f",
        maroon: "800000",
        mediumaquamarine: "66cdaa",
        mediumblue: "0000cd",
        mediumorchid: "ba55d3",
        mediumpurple: "9370db",
        mediumseagreen: "3cb371",
        mediumslateblue: "7b68ee",
        mediumspringgreen: "00fa9a",
        mediumturquoise: "48d1cc",
        mediumvioletred: "c71585",
        midnightblue: "191970",
        mintcream: "f5fffa",
        mistyrose: "ffe4e1",
        moccasin: "ffe4b5",
        navajowhite: "ffdead",
        navy: "000080",
        oldlace: "fdf5e6",
        olive: "808000",
        olivedrab: "6b8e23",
        orange: "ffa500",
        orangered: "ff4500",
        orchid: "da70d6",
        palegoldenrod: "eee8aa",
        palegreen: "98fb98",
        paleturquoise: "afeeee",
        palevioletred: "db7093",
        papayawhip: "ffefd5",
        peachpuff: "ffdab9",
        peru: "cd853f",
        pink: "ffc0cb",
        plum: "dda0dd",
        powderblue: "b0e0e6",
        purple: "800080",
        rebeccapurple: "663399",
        red: "f00",
        rosybrown: "bc8f8f",
        royalblue: "4169e1",
        saddlebrown: "8b4513",
        salmon: "fa8072",
        sandybrown: "f4a460",
        seagreen: "2e8b57",
        seashell: "fff5ee",
        sienna: "a0522d",
        silver: "c0c0c0",
        skyblue: "87ceeb",
        slateblue: "6a5acd",
        slategray: "708090",
        slategrey: "708090",
        snow: "fffafa",
        springgreen: "00ff7f",
        steelblue: "4682b4",
        tan: "d2b48c",
        teal: "008080",
        thistle: "d8bfd8",
        tomato: "ff6347",
        turquoise: "40e0d0",
        violet: "ee82ee",
        wheat: "f5deb3",
        white: "fff",
        whitesmoke: "f5f5f5",
        yellow: "ff0",
        yellowgreen: "9acd32"
    }, hexNames = tinycolor.hexNames = flip(names), matchers = function() {
        var CSS_INTEGER = "[-\\+]?\\d+%?", CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?", CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")", PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?", PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
        return {
            rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
            rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
            hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
            hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
            hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
            hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
            hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
            hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
            hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
        };
    }();
    "undefined" != typeof module && module.exports ? module.exports = tinycolor : "function" == typeof define && define.amd ? define(function() {
        return tinycolor;
    }) : window.tinycolor = tinycolor;
}();

"use strict";

module.define("ytilitu.calculator.color", function() {
    function string_space_to_comma(a) {
        return a.replace(/\s+/g, ",");
    }
    var inputs = {
        input_rgb: {
            value_to_color: function(a) {
                return tinycolor("rgb(" + string_space_to_comma(a) + ")");
            },
            color_to_value: function(a) {
                return function(rgb) {
                    return [ rgb.r, rgb.g, rgb.b ].join(" ");
                }(a.toRgb());
            }
        },
        input_hex: {
            value_to_color: function(a) {
                return tinycolor(a);
            },
            color_to_value: function(a) {
                return a.toHex();
            }
        },
        input_hsl: {
            value_to_color: function(a) {
                return tinycolor("hsl(" + string_space_to_comma(a) + ")");
            },
            color_to_value: function(a) {
                return function(a) {
                    return [ Math.round(a.h), Math.round(100 * a.s), Math.round(100 * a.l) ].join(" ");
                }(a.toHsl());
            }
        },
        input_rgb_css: {
            value_to_color: function(a) {
                return tinycolor(a);
            },
            color_to_value: function(a) {
                return a.toRgbString();
            }
        },
        input_hex_css: {
            value_to_color: function(a) {
                return tinycolor(a);
            },
            color_to_value: function(a) {
                return a.toHexString();
            }
        },
        input_hsl_css: {
            value_to_color: function(a) {
                return tinycolor(a);
            },
            color_to_value: function(a) {
                return a.toHslString();
            }
        }
    };
    function color_to_rgb_comma_string(a) {
        return function(rgb) {
            return [ rgb.r, rgb.g, rgb.b ].join(" ");
        }(a.toRgb());
    }
    var current_color, text_display_lines, current_color_modified;
    function update_single_preview(name, method) {
        if (!method) {
            method = name;
        }
        text_display_lines.push("", name);
        var color = current_color.clone()[method]();
        var preview = document.querySelector("." + name + " .preview .area");
        var value = document.getElementById("input_" + name + "_value");
        text_display_lines.push(color.toRgbString());
        value.value = color_to_rgb_comma_string(color);
        return preview.style.backgroundColor = color.toHexString();
    }
    function update_multi_preview(create_colors, name) {
        var colors = create_colors();
        colors.shift();
        text_display_lines.push("", name);
        return _.times(colors.length, function(index) {
            var color = colors[index];
            var input_id = "input_" + name + "_value_" + index;
            var preview = document.querySelector("." + name + " .preview[for=" + input_id + "] .area");
            var value = document.getElementById(input_id);
            text_display_lines.push(color.toRgbString());
            value.value = color_to_rgb_comma_string(color);
            return preview.style.backgroundColor = color.toHexString();
        });
    }
    var names_modifications = [ "hue", "brightness", "lightness", "saturation" ];
    function initialise_modifications() {
        return _.each(names_modifications, function(name) {
            var control = document.getElementById("input_" + name);
            return control.addEventListener("change", function(event) {
                return update();
            });
        });
    }
    function update_modifications() {
        current_color_modified = current_color.clone();
        _.each(names_modifications, function(name) {
            var control = document.getElementById("input_" + name);
            var value = document.getElementById("input_" + name + "_value"), preview = document.querySelector(".control." + name + " .preview .area"), control_value = parseInt(control.value, 10);
            var method_and_value;
            switch (name) {
              case "hue":
                method_and_value = [ "spin", control_value ];
                break;

              case "lightness":
                method_and_value = [ 0 <= control_value ? "lighten" : "darken", Math.abs(control_value) ];
                break;

              case "brightness":
                method_and_value = [ "brighten", control_value ];
                break;

              case "saturation":
                method_and_value = [ 0 <= control_value ? "saturate" : "desaturate", Math.abs(control_value) ];
                break;
            }
            current_color_modified[method_and_value[0]](method_and_value[1]);
            var color = current_color.clone()[method_and_value[0]](method_and_value[1]);
            value.value = color_to_rgb_comma_string(color);
            return preview.style.backgroundColor = color.toHexString();
        });
        var preview_current_color = document.querySelector(".modification > .preview .area");
        preview_current_color.style.backgroundColor = current_color_modified.toHexString();
        var preview_current_color_modified = document.getElementById("input_modified_preview_value");
        preview_current_color_modified.value = color_to_rgb_comma_string(current_color_modified);
        return text_display_lines.push("", "modified", current_color_modified.toRgbString());
    }
    var names_multi_preview = [ "triad", "splitcomplement", "tetrad", "analogous", "monochromatic" ];
    function update_alternatives() {
        update_single_preview("complement");
        update_single_preview("greyscale");
        return _.each(names_multi_preview, function(name) {
            return update_multi_preview(function() {
                return current_color_modified[name]();
            }, name);
        });
    }
    function update(current_input) {
        if (!current_input) {
            current_input = inputs.input_rgb.element;
        }
        text_display_lines = [];
        update_inputs(current_input);
        update_preview();
        update_modifications();
        update_alternatives();
        var text_display_area = document.getElementById("text_display_area");
        return text_display_area.innerHTML = text_display_lines.join("\n");
    }
    function update_event_handler(event) {
        return update(event.target);
    }
    function update_preview() {
        var element = document.querySelector(".conversion .preview .area");
        return element.style.backgroundColor = inputs.input_hex_css.element.value;
    }
    function inputs_initialise_select_on_click() {
        var inputs_all = document.querySelectorAll(".modification input:not([type=number]), .alternatives input");
        return _.each(inputs_all, function(input) {
            return input.addEventListener("click", input.select);
        });
    }
    function inputs_initialise() {
        inputs_initialise_select_on_click();
        _.map(inputs, function(value, key) {
            var element = document.getElementById(key);
            inputs[key]["element"] = element;
            element.addEventListener("keyup", update_event_handler);
            return element.addEventListener("change", update_event_handler);
        });
        initialise_modifications();
        inputs.input_hex.element.value = tinycolor("#538cc6").toHex();
        return update(inputs.input_hex.element);
    }
    function update_inputs(leading) {
        var input = inputs[leading.id];
        current_color = input.value_to_color(leading.value);
        current_color_modified = current_color.clone();
        text_display_lines.push("color", current_color.toRgbString());
        return _.each(inputs, function(value, key) {
            if (!(leading.id === key)) {
                return function(input) {
                    return input.element.value = input.color_to_value(current_color);
                }(inputs[key]);
            }
        });
    }
    return inputs_initialise();
});
