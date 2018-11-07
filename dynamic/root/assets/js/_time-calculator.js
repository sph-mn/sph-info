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

!function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : e.moment = t();
}(this, function() {
    "use strict";
    var e, i;
    function c() {
        return e.apply(null, arguments);
    }
    function o(e) {
        return e instanceof Array || "[object Array]" === Object.prototype.toString.call(e);
    }
    function u(e) {
        return null != e && "[object Object]" === Object.prototype.toString.call(e);
    }
    function l(e) {
        return void 0 === e;
    }
    function d(e) {
        return "number" == typeof e || "[object Number]" === Object.prototype.toString.call(e);
    }
    function h(e) {
        return e instanceof Date || "[object Date]" === Object.prototype.toString.call(e);
    }
    function f(e, t) {
        var n, s = [];
        for (n = 0; n < e.length; ++n) s.push(t(e[n], n));
        return s;
    }
    function m(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
    }
    function _(e, t) {
        for (var n in t) m(t, n) && (e[n] = t[n]);
        return m(t, "toString") && (e.toString = t.toString), m(t, "valueOf") && (e.valueOf = t.valueOf), 
        e;
    }
    function y(e, t, n, s) {
        return Ot(e, t, n, s, !0).utc();
    }
    function g(e) {
        return null == e._pf && (e._pf = {
            empty: !1,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: !1,
            invalidMonth: null,
            invalidFormat: !1,
            userInvalidated: !1,
            iso: !1,
            parsedDateParts: [],
            meridiem: null,
            rfc2822: !1,
            weekdayMismatch: !1
        }), e._pf;
    }
    function p(e) {
        if (null == e._isValid) {
            var t = g(e), n = i.call(t.parsedDateParts, function(e) {
                return null != e;
            }), s = !isNaN(e._d.getTime()) && t.overflow < 0 && !t.empty && !t.invalidMonth && !t.invalidWeekday && !t.weekdayMismatch && !t.nullInput && !t.invalidFormat && !t.userInvalidated && (!t.meridiem || t.meridiem && n);
            if (e._strict && (s = s && 0 === t.charsLeftOver && 0 === t.unusedTokens.length && void 0 === t.bigHour), 
            null != Object.isFrozen && Object.isFrozen(e)) return s;
            e._isValid = s;
        }
        return e._isValid;
    }
    function v(e) {
        var t = y(NaN);
        return null != e ? _(g(t), e) : g(t).userInvalidated = !0, t;
    }
    i = Array.prototype.some ? Array.prototype.some : function(e) {
        for (var t = Object(this), n = t.length >>> 0, s = 0; s < n; s++) if (s in t && e.call(this, t[s], s, t)) return !0;
        return !1;
    };
    var r = c.momentProperties = [];
    function w(e, t) {
        var n, s, i;
        if (l(t._isAMomentObject) || (e._isAMomentObject = t._isAMomentObject), l(t._i) || (e._i = t._i), 
        l(t._f) || (e._f = t._f), l(t._l) || (e._l = t._l), l(t._strict) || (e._strict = t._strict), 
        l(t._tzm) || (e._tzm = t._tzm), l(t._isUTC) || (e._isUTC = t._isUTC), l(t._offset) || (e._offset = t._offset), 
        l(t._pf) || (e._pf = g(t)), l(t._locale) || (e._locale = t._locale), 0 < r.length) for (n = 0; n < r.length; n++) l(i = t[s = r[n]]) || (e[s] = i);
        return e;
    }
    var t = !1;
    function M(e) {
        w(this, e), this._d = new Date(null != e._d ? e._d.getTime() : NaN), this.isValid() || (this._d = new Date(NaN)), 
        !1 === t && (t = !0, c.updateOffset(this), t = !1);
    }
    function S(e) {
        return e instanceof M || null != e && null != e._isAMomentObject;
    }
    function D(e) {
        return e < 0 ? Math.ceil(e) || 0 : Math.floor(e);
    }
    function k(e) {
        var t = +e, n = 0;
        return 0 !== t && isFinite(t) && (n = D(t)), n;
    }
    function a(e, t, n) {
        var s, i = Math.min(e.length, t.length), r = Math.abs(e.length - t.length), a = 0;
        for (s = 0; s < i; s++) (n && e[s] !== t[s] || !n && k(e[s]) !== k(t[s])) && a++;
        return a + r;
    }
    function Y(e) {
        !1 === c.suppressDeprecationWarnings && "undefined" != typeof console && console.warn && console.warn("Deprecation warning: " + e);
    }
    function n(i, r) {
        var a = !0;
        return _(function() {
            if (null != c.deprecationHandler && c.deprecationHandler(null, i), a) {
                for (var e, t = [], n = 0; n < arguments.length; n++) {
                    if (e = "", "object" == typeof arguments[n]) {
                        for (var s in e += "\n[" + n + "] ", arguments[0]) e += s + ": " + arguments[0][s] + ", ";
                        e = e.slice(0, -2);
                    } else e = arguments[n];
                    t.push(e);
                }
                Y(i + "\nArguments: " + Array.prototype.slice.call(t).join("") + "\n" + new Error().stack), 
                a = !1;
            }
            return r.apply(this, arguments);
        }, r);
    }
    var s, O = {};
    function T(e, t) {
        null != c.deprecationHandler && c.deprecationHandler(e, t), O[e] || (Y(t), O[e] = !0);
    }
    function x(e) {
        return e instanceof Function || "[object Function]" === Object.prototype.toString.call(e);
    }
    function b(e, t) {
        var n, s = _({}, e);
        for (n in t) m(t, n) && (u(e[n]) && u(t[n]) ? (s[n] = {}, _(s[n], e[n]), _(s[n], t[n])) : null != t[n] ? s[n] = t[n] : delete s[n]);
        for (n in e) m(e, n) && !m(t, n) && u(e[n]) && (s[n] = _({}, s[n]));
        return s;
    }
    function P(e) {
        null != e && this.set(e);
    }
    c.suppressDeprecationWarnings = !1, c.deprecationHandler = null, s = Object.keys ? Object.keys : function(e) {
        var t, n = [];
        for (t in e) m(e, t) && n.push(t);
        return n;
    };
    var W = {};
    function H(e, t) {
        var n = e.toLowerCase();
        W[n] = W[n + "s"] = W[t] = e;
    }
    function R(e) {
        return "string" == typeof e ? W[e] || W[e.toLowerCase()] : void 0;
    }
    function C(e) {
        var t, n, s = {};
        for (n in e) m(e, n) && (t = R(n)) && (s[t] = e[n]);
        return s;
    }
    var F = {};
    function L(e, t) {
        F[e] = t;
    }
    function U(e, t, n) {
        var s = "" + Math.abs(e), i = t - s.length;
        return (0 <= e ? n ? "+" : "" : "-") + Math.pow(10, Math.max(0, i)).toString().substr(1) + s;
    }
    var N = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g, G = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, V = {}, E = {};
    function I(e, t, n, s) {
        var i = s;
        "string" == typeof s && (i = function() {
            return this[s]();
        }), e && (E[e] = i), t && (E[t[0]] = function() {
            return U(i.apply(this, arguments), t[1], t[2]);
        }), n && (E[n] = function() {
            return this.localeData().ordinal(i.apply(this, arguments), e);
        });
    }
    function A(e, t) {
        return e.isValid() ? (t = j(t, e.localeData()), V[t] = V[t] || function(s) {
            var e, i, t, r = s.match(N);
            for (e = 0, i = r.length; e < i; e++) E[r[e]] ? r[e] = E[r[e]] : r[e] = (t = r[e]).match(/\[[\s\S]/) ? t.replace(/^\[|\]$/g, "") : t.replace(/\\/g, "");
            return function(e) {
                var t, n = "";
                for (t = 0; t < i; t++) n += x(r[t]) ? r[t].call(e, s) : r[t];
                return n;
            };
        }(t), V[t](e)) : e.localeData().invalidDate();
    }
    function j(e, t) {
        var n = 5;
        function s(e) {
            return t.longDateFormat(e) || e;
        }
        for (G.lastIndex = 0; 0 <= n && G.test(e); ) e = e.replace(G, s), G.lastIndex = 0, 
        n -= 1;
        return e;
    }
    var Z = /\d/, z = /\d\d/, $ = /\d{3}/, q = /\d{4}/, J = /[+-]?\d{6}/, B = /\d\d?/, Q = /\d\d\d\d?/, X = /\d\d\d\d\d\d?/, K = /\d{1,3}/, ee = /\d{1,4}/, te = /[+-]?\d{1,6}/, ne = /\d+/, se = /[+-]?\d+/, ie = /Z|[+-]\d\d:?\d\d/gi, re = /Z|[+-]\d\d(?::?\d\d)?/gi, ae = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i, oe = {};
    function ue(e, n, s) {
        oe[e] = x(n) ? n : function(e, t) {
            return e && s ? s : n;
        };
    }
    function le(e, t) {
        return m(oe, e) ? oe[e](t._strict, t._locale) : new RegExp(de(e.replace("\\", "").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(e, t, n, s, i) {
            return t || n || s || i;
        })));
    }
    function de(e) {
        return e.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    }
    var he = {};
    function ce(e, n) {
        var t, s = n;
        for ("string" == typeof e && (e = [ e ]), d(n) && (s = function(e, t) {
            t[n] = k(e);
        }), t = 0; t < e.length; t++) he[e[t]] = s;
    }
    function fe(e, i) {
        ce(e, function(e, t, n, s) {
            n._w = n._w || {}, i(e, n._w, n, s);
        });
    }
    var me = 0, _e = 1, ye = 2, ge = 3, pe = 4, ve = 5, we = 6, Me = 7, Se = 8;
    function De(e) {
        return ke(e) ? 366 : 365;
    }
    function ke(e) {
        return e % 4 == 0 && e % 100 != 0 || e % 400 == 0;
    }
    I("Y", 0, 0, function() {
        var e = this.year();
        return e <= 9999 ? "" + e : "+" + e;
    }), I(0, [ "YY", 2 ], 0, function() {
        return this.year() % 100;
    }), I(0, [ "YYYY", 4 ], 0, "year"), I(0, [ "YYYYY", 5 ], 0, "year"), I(0, [ "YYYYYY", 6, !0 ], 0, "year"), 
    H("year", "y"), L("year", 1), ue("Y", se), ue("YY", B, z), ue("YYYY", ee, q), ue("YYYYY", te, J), 
    ue("YYYYYY", te, J), ce([ "YYYYY", "YYYYYY" ], me), ce("YYYY", function(e, t) {
        t[me] = 2 === e.length ? c.parseTwoDigitYear(e) : k(e);
    }), ce("YY", function(e, t) {
        t[me] = c.parseTwoDigitYear(e);
    }), ce("Y", function(e, t) {
        t[me] = parseInt(e, 10);
    }), c.parseTwoDigitYear = function(e) {
        return k(e) + (68 < k(e) ? 1900 : 2e3);
    };
    var Ye, Oe = Te("FullYear", !0);
    function Te(t, n) {
        return function(e) {
            return null != e ? (be(this, t, e), c.updateOffset(this, n), this) : xe(this, t);
        };
    }
    function xe(e, t) {
        return e.isValid() ? e._d["get" + (e._isUTC ? "UTC" : "") + t]() : NaN;
    }
    function be(e, t, n) {
        e.isValid() && !isNaN(n) && ("FullYear" === t && ke(e.year()) && 1 === e.month() && 29 === e.date() ? e._d["set" + (e._isUTC ? "UTC" : "") + t](n, e.month(), Pe(n, e.month())) : e._d["set" + (e._isUTC ? "UTC" : "") + t](n));
    }
    function Pe(e, t) {
        if (isNaN(e) || isNaN(t)) return NaN;
        var n, s = (t % (n = 12) + n) % n;
        return e += (t - s) / 12, 1 === s ? ke(e) ? 29 : 28 : 31 - s % 7 % 2;
    }
    Ye = Array.prototype.indexOf ? Array.prototype.indexOf : function(e) {
        var t;
        for (t = 0; t < this.length; ++t) if (this[t] === e) return t;
        return -1;
    }, I("M", [ "MM", 2 ], "Mo", function() {
        return this.month() + 1;
    }), I("MMM", 0, 0, function(e) {
        return this.localeData().monthsShort(this, e);
    }), I("MMMM", 0, 0, function(e) {
        return this.localeData().months(this, e);
    }), H("month", "M"), L("month", 8), ue("M", B), ue("MM", B, z), ue("MMM", function(e, t) {
        return t.monthsShortRegex(e);
    }), ue("MMMM", function(e, t) {
        return t.monthsRegex(e);
    }), ce([ "M", "MM" ], function(e, t) {
        t[_e] = k(e) - 1;
    }), ce([ "MMM", "MMMM" ], function(e, t, n, s) {
        var i = n._locale.monthsParse(e, s, n._strict);
        null != i ? t[_e] = i : g(n).invalidMonth = e;
    });
    var We = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/, He = "January_February_March_April_May_June_July_August_September_October_November_December".split("_");
    var Re = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_");
    function Ce(e, t) {
        var n;
        if (!e.isValid()) return e;
        if ("string" == typeof t) if (/^\d+$/.test(t)) t = k(t); else if (!d(t = e.localeData().monthsParse(t))) return e;
        return n = Math.min(e.date(), Pe(e.year(), t)), e._d["set" + (e._isUTC ? "UTC" : "") + "Month"](t, n), 
        e;
    }
    function Fe(e) {
        return null != e ? (Ce(this, e), c.updateOffset(this, !0), this) : xe(this, "Month");
    }
    var Le = ae;
    var Ue = ae;
    function Ne() {
        function e(e, t) {
            return t.length - e.length;
        }
        var t, n, s = [], i = [], r = [];
        for (t = 0; t < 12; t++) n = y([ 2e3, t ]), s.push(this.monthsShort(n, "")), i.push(this.months(n, "")), 
        r.push(this.months(n, "")), r.push(this.monthsShort(n, ""));
        for (s.sort(e), i.sort(e), r.sort(e), t = 0; t < 12; t++) s[t] = de(s[t]), i[t] = de(i[t]);
        for (t = 0; t < 24; t++) r[t] = de(r[t]);
        this._monthsRegex = new RegExp("^(" + r.join("|") + ")", "i"), this._monthsShortRegex = this._monthsRegex, 
        this._monthsStrictRegex = new RegExp("^(" + i.join("|") + ")", "i"), this._monthsShortStrictRegex = new RegExp("^(" + s.join("|") + ")", "i");
    }
    function Ge(e) {
        var t = new Date(Date.UTC.apply(null, arguments));
        return e < 100 && 0 <= e && isFinite(t.getUTCFullYear()) && t.setUTCFullYear(e), 
        t;
    }
    function Ve(e, t, n) {
        var s = 7 + t - n;
        return -((7 + Ge(e, 0, s).getUTCDay() - t) % 7) + s - 1;
    }
    function Ee(e, t, n, s, i) {
        var r, a, o = 1 + 7 * (t - 1) + (7 + n - s) % 7 + Ve(e, s, i);
        return o <= 0 ? a = De(r = e - 1) + o : o > De(e) ? (r = e + 1, a = o - De(e)) : (r = e, 
        a = o), {
            year: r,
            dayOfYear: a
        };
    }
    function Ie(e, t, n) {
        var s, i, r = Ve(e.year(), t, n), a = Math.floor((e.dayOfYear() - r - 1) / 7) + 1;
        return a < 1 ? s = a + Ae(i = e.year() - 1, t, n) : a > Ae(e.year(), t, n) ? (s = a - Ae(e.year(), t, n), 
        i = e.year() + 1) : (i = e.year(), s = a), {
            week: s,
            year: i
        };
    }
    function Ae(e, t, n) {
        var s = Ve(e, t, n), i = Ve(e + 1, t, n);
        return (De(e) - s + i) / 7;
    }
    I("w", [ "ww", 2 ], "wo", "week"), I("W", [ "WW", 2 ], "Wo", "isoWeek"), H("week", "w"), 
    H("isoWeek", "W"), L("week", 5), L("isoWeek", 5), ue("w", B), ue("ww", B, z), ue("W", B), 
    ue("WW", B, z), fe([ "w", "ww", "W", "WW" ], function(e, t, n, s) {
        t[s.substr(0, 1)] = k(e);
    });
    I("d", 0, "do", "day"), I("dd", 0, 0, function(e) {
        return this.localeData().weekdaysMin(this, e);
    }), I("ddd", 0, 0, function(e) {
        return this.localeData().weekdaysShort(this, e);
    }), I("dddd", 0, 0, function(e) {
        return this.localeData().weekdays(this, e);
    }), I("e", 0, 0, "weekday"), I("E", 0, 0, "isoWeekday"), H("day", "d"), H("weekday", "e"), 
    H("isoWeekday", "E"), L("day", 11), L("weekday", 11), L("isoWeekday", 11), ue("d", B), 
    ue("e", B), ue("E", B), ue("dd", function(e, t) {
        return t.weekdaysMinRegex(e);
    }), ue("ddd", function(e, t) {
        return t.weekdaysShortRegex(e);
    }), ue("dddd", function(e, t) {
        return t.weekdaysRegex(e);
    }), fe([ "dd", "ddd", "dddd" ], function(e, t, n, s) {
        var i = n._locale.weekdaysParse(e, s, n._strict);
        null != i ? t.d = i : g(n).invalidWeekday = e;
    }), fe([ "d", "e", "E" ], function(e, t, n, s) {
        t[s] = k(e);
    });
    var je = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_");
    var Ze = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_");
    var ze = "Su_Mo_Tu_We_Th_Fr_Sa".split("_");
    var $e = ae;
    var qe = ae;
    var Je = ae;
    function Be() {
        function e(e, t) {
            return t.length - e.length;
        }
        var t, n, s, i, r, a = [], o = [], u = [], l = [];
        for (t = 0; t < 7; t++) n = y([ 2e3, 1 ]).day(t), s = this.weekdaysMin(n, ""), i = this.weekdaysShort(n, ""), 
        r = this.weekdays(n, ""), a.push(s), o.push(i), u.push(r), l.push(s), l.push(i), 
        l.push(r);
        for (a.sort(e), o.sort(e), u.sort(e), l.sort(e), t = 0; t < 7; t++) o[t] = de(o[t]), 
        u[t] = de(u[t]), l[t] = de(l[t]);
        this._weekdaysRegex = new RegExp("^(" + l.join("|") + ")", "i"), this._weekdaysShortRegex = this._weekdaysRegex, 
        this._weekdaysMinRegex = this._weekdaysRegex, this._weekdaysStrictRegex = new RegExp("^(" + u.join("|") + ")", "i"), 
        this._weekdaysShortStrictRegex = new RegExp("^(" + o.join("|") + ")", "i"), this._weekdaysMinStrictRegex = new RegExp("^(" + a.join("|") + ")", "i");
    }
    function Qe() {
        return this.hours() % 12 || 12;
    }
    function Xe(e, t) {
        I(e, 0, 0, function() {
            return this.localeData().meridiem(this.hours(), this.minutes(), t);
        });
    }
    function Ke(e, t) {
        return t._meridiemParse;
    }
    I("H", [ "HH", 2 ], 0, "hour"), I("h", [ "hh", 2 ], 0, Qe), I("k", [ "kk", 2 ], 0, function() {
        return this.hours() || 24;
    }), I("hmm", 0, 0, function() {
        return "" + Qe.apply(this) + U(this.minutes(), 2);
    }), I("hmmss", 0, 0, function() {
        return "" + Qe.apply(this) + U(this.minutes(), 2) + U(this.seconds(), 2);
    }), I("Hmm", 0, 0, function() {
        return "" + this.hours() + U(this.minutes(), 2);
    }), I("Hmmss", 0, 0, function() {
        return "" + this.hours() + U(this.minutes(), 2) + U(this.seconds(), 2);
    }), Xe("a", !0), Xe("A", !1), H("hour", "h"), L("hour", 13), ue("a", Ke), ue("A", Ke), 
    ue("H", B), ue("h", B), ue("k", B), ue("HH", B, z), ue("hh", B, z), ue("kk", B, z), 
    ue("hmm", Q), ue("hmmss", X), ue("Hmm", Q), ue("Hmmss", X), ce([ "H", "HH" ], ge), 
    ce([ "k", "kk" ], function(e, t, n) {
        var s = k(e);
        t[ge] = 24 === s ? 0 : s;
    }), ce([ "a", "A" ], function(e, t, n) {
        n._isPm = n._locale.isPM(e), n._meridiem = e;
    }), ce([ "h", "hh" ], function(e, t, n) {
        t[ge] = k(e), g(n).bigHour = !0;
    }), ce("hmm", function(e, t, n) {
        var s = e.length - 2;
        t[ge] = k(e.substr(0, s)), t[pe] = k(e.substr(s)), g(n).bigHour = !0;
    }), ce("hmmss", function(e, t, n) {
        var s = e.length - 4, i = e.length - 2;
        t[ge] = k(e.substr(0, s)), t[pe] = k(e.substr(s, 2)), t[ve] = k(e.substr(i)), g(n).bigHour = !0;
    }), ce("Hmm", function(e, t, n) {
        var s = e.length - 2;
        t[ge] = k(e.substr(0, s)), t[pe] = k(e.substr(s));
    }), ce("Hmmss", function(e, t, n) {
        var s = e.length - 4, i = e.length - 2;
        t[ge] = k(e.substr(0, s)), t[pe] = k(e.substr(s, 2)), t[ve] = k(e.substr(i));
    });
    var et, tt = Te("Hours", !0), nt = {
        calendar: {
            sameDay: "[Today at] LT",
            nextDay: "[Tomorrow at] LT",
            nextWeek: "dddd [at] LT",
            lastDay: "[Yesterday at] LT",
            lastWeek: "[Last] dddd [at] LT",
            sameElse: "L"
        },
        longDateFormat: {
            LTS: "h:mm:ss A",
            LT: "h:mm A",
            L: "MM/DD/YYYY",
            LL: "MMMM D, YYYY",
            LLL: "MMMM D, YYYY h:mm A",
            LLLL: "dddd, MMMM D, YYYY h:mm A"
        },
        invalidDate: "Invalid date",
        ordinal: "%d",
        dayOfMonthOrdinalParse: /\d{1,2}/,
        relativeTime: {
            future: "in %s",
            past: "%s ago",
            s: "a few seconds",
            ss: "%d seconds",
            m: "a minute",
            mm: "%d minutes",
            h: "an hour",
            hh: "%d hours",
            d: "a day",
            dd: "%d days",
            M: "a month",
            MM: "%d months",
            y: "a year",
            yy: "%d years"
        },
        months: He,
        monthsShort: Re,
        week: {
            dow: 0,
            doy: 6
        },
        weekdays: je,
        weekdaysMin: ze,
        weekdaysShort: Ze,
        meridiemParse: /[ap]\.?m?\.?/i
    }, st = {}, it = {};
    function rt(e) {
        return e ? e.toLowerCase().replace("_", "-") : e;
    }
    function at(e) {
        var t = null;
        if (!st[e] && "undefined" != typeof module && module && module.exports) try {
            t = et._abbr, require("./locale/" + e), ot(t);
        } catch (e) {}
        return st[e];
    }
    function ot(e, t) {
        var n;
        return e && ((n = l(t) ? lt(e) : ut(e, t)) ? et = n : "undefined" != typeof console && console.warn && console.warn("Locale " + e + " not found. Did you forget to load it?")), 
        et._abbr;
    }
    function ut(e, t) {
        if (null !== t) {
            var n, s = nt;
            if (t.abbr = e, null != st[e]) T("defineLocaleOverride", "use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."), 
            s = st[e]._config; else if (null != t.parentLocale) if (null != st[t.parentLocale]) s = st[t.parentLocale]._config; else {
                if (null == (n = at(t.parentLocale))) return it[t.parentLocale] || (it[t.parentLocale] = []), 
                it[t.parentLocale].push({
                    name: e,
                    config: t
                }), null;
                s = n._config;
            }
            return st[e] = new P(b(s, t)), it[e] && it[e].forEach(function(e) {
                ut(e.name, e.config);
            }), ot(e), st[e];
        }
        return delete st[e], null;
    }
    function lt(e) {
        var t;
        if (e && e._locale && e._locale._abbr && (e = e._locale._abbr), !e) return et;
        if (!o(e)) {
            if (t = at(e)) return t;
            e = [ e ];
        }
        return function(e) {
            for (var t, n, s, i, r = 0; r < e.length; ) {
                for (t = (i = rt(e[r]).split("-")).length, n = (n = rt(e[r + 1])) ? n.split("-") : null; 0 < t; ) {
                    if (s = at(i.slice(0, t).join("-"))) return s;
                    if (n && n.length >= t && a(i, n, !0) >= t - 1) break;
                    t--;
                }
                r++;
            }
            return et;
        }(e);
    }
    function dt(e) {
        var t, n = e._a;
        return n && -2 === g(e).overflow && (t = n[_e] < 0 || 11 < n[_e] ? _e : n[ye] < 1 || n[ye] > Pe(n[me], n[_e]) ? ye : n[ge] < 0 || 24 < n[ge] || 24 === n[ge] && (0 !== n[pe] || 0 !== n[ve] || 0 !== n[we]) ? ge : n[pe] < 0 || 59 < n[pe] ? pe : n[ve] < 0 || 59 < n[ve] ? ve : n[we] < 0 || 999 < n[we] ? we : -1, 
        g(e)._overflowDayOfYear && (t < me || ye < t) && (t = ye), g(e)._overflowWeeks && -1 === t && (t = Me), 
        g(e)._overflowWeekday && -1 === t && (t = Se), g(e).overflow = t), e;
    }
    function ht(e, t, n) {
        return null != e ? e : null != t ? t : n;
    }
    function ct(e) {
        var t, n, s, i, r, a = [];
        if (!e._d) {
            var o, u;
            for (o = e, u = new Date(c.now()), s = o._useUTC ? [ u.getUTCFullYear(), u.getUTCMonth(), u.getUTCDate() ] : [ u.getFullYear(), u.getMonth(), u.getDate() ], 
            e._w && null == e._a[ye] && null == e._a[_e] && function(e) {
                var t, n, s, i, r, a, o, u;
                if (null != (t = e._w).GG || null != t.W || null != t.E) r = 1, a = 4, n = ht(t.GG, e._a[me], Ie(Tt(), 1, 4).year), 
                s = ht(t.W, 1), ((i = ht(t.E, 1)) < 1 || 7 < i) && (u = !0); else {
                    r = e._locale._week.dow, a = e._locale._week.doy;
                    var l = Ie(Tt(), r, a);
                    n = ht(t.gg, e._a[me], l.year), s = ht(t.w, l.week), null != t.d ? ((i = t.d) < 0 || 6 < i) && (u = !0) : null != t.e ? (i = t.e + r, 
                    (t.e < 0 || 6 < t.e) && (u = !0)) : i = r;
                }
                s < 1 || s > Ae(n, r, a) ? g(e)._overflowWeeks = !0 : null != u ? g(e)._overflowWeekday = !0 : (o = Ee(n, s, i, r, a), 
                e._a[me] = o.year, e._dayOfYear = o.dayOfYear);
            }(e), null != e._dayOfYear && (r = ht(e._a[me], s[me]), (e._dayOfYear > De(r) || 0 === e._dayOfYear) && (g(e)._overflowDayOfYear = !0), 
            n = Ge(r, 0, e._dayOfYear), e._a[_e] = n.getUTCMonth(), e._a[ye] = n.getUTCDate()), 
            t = 0; t < 3 && null == e._a[t]; ++t) e._a[t] = a[t] = s[t];
            for (;t < 7; t++) e._a[t] = a[t] = null == e._a[t] ? 2 === t ? 1 : 0 : e._a[t];
            24 === e._a[ge] && 0 === e._a[pe] && 0 === e._a[ve] && 0 === e._a[we] && (e._nextDay = !0, 
            e._a[ge] = 0), e._d = (e._useUTC ? Ge : function(e, t, n, s, i, r, a) {
                var o = new Date(e, t, n, s, i, r, a);
                return e < 100 && 0 <= e && isFinite(o.getFullYear()) && o.setFullYear(e), o;
            }).apply(null, a), i = e._useUTC ? e._d.getUTCDay() : e._d.getDay(), null != e._tzm && e._d.setUTCMinutes(e._d.getUTCMinutes() - e._tzm), 
            e._nextDay && (e._a[ge] = 24), e._w && void 0 !== e._w.d && e._w.d !== i && (g(e).weekdayMismatch = !0);
        }
    }
    var ft = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/, mt = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/, _t = /Z|[+-]\d\d(?::?\d\d)?/, yt = [ [ "YYYYYY-MM-DD", /[+-]\d{6}-\d\d-\d\d/ ], [ "YYYY-MM-DD", /\d{4}-\d\d-\d\d/ ], [ "GGGG-[W]WW-E", /\d{4}-W\d\d-\d/ ], [ "GGGG-[W]WW", /\d{4}-W\d\d/, !1 ], [ "YYYY-DDD", /\d{4}-\d{3}/ ], [ "YYYY-MM", /\d{4}-\d\d/, !1 ], [ "YYYYYYMMDD", /[+-]\d{10}/ ], [ "YYYYMMDD", /\d{8}/ ], [ "GGGG[W]WWE", /\d{4}W\d{3}/ ], [ "GGGG[W]WW", /\d{4}W\d{2}/, !1 ], [ "YYYYDDD", /\d{7}/ ] ], gt = [ [ "HH:mm:ss.SSSS", /\d\d:\d\d:\d\d\.\d+/ ], [ "HH:mm:ss,SSSS", /\d\d:\d\d:\d\d,\d+/ ], [ "HH:mm:ss", /\d\d:\d\d:\d\d/ ], [ "HH:mm", /\d\d:\d\d/ ], [ "HHmmss.SSSS", /\d\d\d\d\d\d\.\d+/ ], [ "HHmmss,SSSS", /\d\d\d\d\d\d,\d+/ ], [ "HHmmss", /\d\d\d\d\d\d/ ], [ "HHmm", /\d\d\d\d/ ], [ "HH", /\d\d/ ] ], pt = /^\/?Date\((\-?\d+)/i;
    function vt(e) {
        var t, n, s, i, r, a, o = e._i, u = ft.exec(o) || mt.exec(o);
        if (u) {
            for (g(e).iso = !0, t = 0, n = yt.length; t < n; t++) if (yt[t][1].exec(u[1])) {
                i = yt[t][0], s = !1 !== yt[t][2];
                break;
            }
            if (null == i) return void (e._isValid = !1);
            if (u[3]) {
                for (t = 0, n = gt.length; t < n; t++) if (gt[t][1].exec(u[3])) {
                    r = (u[2] || " ") + gt[t][0];
                    break;
                }
                if (null == r) return void (e._isValid = !1);
            }
            if (!s && null != r) return void (e._isValid = !1);
            if (u[4]) {
                if (!_t.exec(u[4])) return void (e._isValid = !1);
                a = "Z";
            }
            e._f = i + (r || "") + (a || ""), kt(e);
        } else e._isValid = !1;
    }
    var wt = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/;
    function Mt(e, t, n, s, i, r) {
        var a = [ function(e) {
            var t = parseInt(e, 10);
            {
                if (t <= 49) return 2e3 + t;
                if (t <= 999) return 1900 + t;
            }
            return t;
        }(e), Re.indexOf(t), parseInt(n, 10), parseInt(s, 10), parseInt(i, 10) ];
        return r && a.push(parseInt(r, 10)), a;
    }
    var St = {
        UT: 0,
        GMT: 0,
        EDT: -240,
        EST: -300,
        CDT: -300,
        CST: -360,
        MDT: -360,
        MST: -420,
        PDT: -420,
        PST: -480
    };
    function Dt(e) {
        var t, n, s, i = wt.exec(e._i.replace(/\([^)]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").replace(/^\s\s*/, "").replace(/\s\s*$/, ""));
        if (i) {
            var r = Mt(i[4], i[3], i[2], i[5], i[6], i[7]);
            if (t = i[1], n = r, s = e, t && Ze.indexOf(t) !== new Date(n[0], n[1], n[2]).getDay() && (g(s).weekdayMismatch = !0, 
            !(s._isValid = !1))) return;
            e._a = r, e._tzm = function(e, t, n) {
                if (e) return St[e];
                if (t) return 0;
                var s = parseInt(n, 10), i = s % 100;
                return (s - i) / 100 * 60 + i;
            }(i[8], i[9], i[10]), e._d = Ge.apply(null, e._a), e._d.setUTCMinutes(e._d.getUTCMinutes() - e._tzm), 
            g(e).rfc2822 = !0;
        } else e._isValid = !1;
    }
    function kt(e) {
        if (e._f !== c.ISO_8601) if (e._f !== c.RFC_2822) {
            e._a = [], g(e).empty = !0;
            var t, n, s, i, r, a, o, u, l = "" + e._i, d = l.length, h = 0;
            for (s = j(e._f, e._locale).match(N) || [], t = 0; t < s.length; t++) i = s[t], 
            (n = (l.match(le(i, e)) || [])[0]) && (0 < (r = l.substr(0, l.indexOf(n))).length && g(e).unusedInput.push(r), 
            l = l.slice(l.indexOf(n) + n.length), h += n.length), E[i] ? (n ? g(e).empty = !1 : g(e).unusedTokens.push(i), 
            a = i, u = e, null != (o = n) && m(he, a) && he[a](o, u._a, u, a)) : e._strict && !n && g(e).unusedTokens.push(i);
            g(e).charsLeftOver = d - h, 0 < l.length && g(e).unusedInput.push(l), e._a[ge] <= 12 && !0 === g(e).bigHour && 0 < e._a[ge] && (g(e).bigHour = void 0), 
            g(e).parsedDateParts = e._a.slice(0), g(e).meridiem = e._meridiem, e._a[ge] = function(e, t, n) {
                var s;
                if (null == n) return t;
                return null != e.meridiemHour ? e.meridiemHour(t, n) : (null != e.isPM && ((s = e.isPM(n)) && t < 12 && (t += 12), 
                s || 12 !== t || (t = 0)), t);
            }(e._locale, e._a[ge], e._meridiem), ct(e), dt(e);
        } else Dt(e); else vt(e);
    }
    function Yt(e) {
        var t, n, s, i, r = e._i, a = e._f;
        return e._locale = e._locale || lt(e._l), null === r || void 0 === a && "" === r ? v({
            nullInput: !0
        }) : ("string" == typeof r && (e._i = r = e._locale.preparse(r)), S(r) ? new M(dt(r)) : (h(r) ? e._d = r : o(a) ? function(e) {
            var t, n, s, i, r;
            if (0 === e._f.length) return g(e).invalidFormat = !0, e._d = new Date(NaN);
            for (i = 0; i < e._f.length; i++) r = 0, t = w({}, e), null != e._useUTC && (t._useUTC = e._useUTC), 
            t._f = e._f[i], kt(t), p(t) && (r += g(t).charsLeftOver, r += 10 * g(t).unusedTokens.length, 
            g(t).score = r, (null == s || r < s) && (s = r, n = t));
            _(e, n || t);
        }(e) : a ? kt(e) : l(n = (t = e)._i) ? t._d = new Date(c.now()) : h(n) ? t._d = new Date(n.valueOf()) : "string" == typeof n ? (s = t, 
        null === (i = pt.exec(s._i)) ? (vt(s), !1 === s._isValid && (delete s._isValid, 
        Dt(s), !1 === s._isValid && (delete s._isValid, c.createFromInputFallback(s)))) : s._d = new Date(+i[1])) : o(n) ? (t._a = f(n.slice(0), function(e) {
            return parseInt(e, 10);
        }), ct(t)) : u(n) ? function(e) {
            if (!e._d) {
                var t = C(e._i);
                e._a = f([ t.year, t.month, t.day || t.date, t.hour, t.minute, t.second, t.millisecond ], function(e) {
                    return e && parseInt(e, 10);
                }), ct(e);
            }
        }(t) : d(n) ? t._d = new Date(n) : c.createFromInputFallback(t), p(e) || (e._d = null), 
        e));
    }
    function Ot(e, t, n, s, i) {
        var r, a = {};
        return !0 !== n && !1 !== n || (s = n, n = void 0), (u(e) && function(e) {
            if (Object.getOwnPropertyNames) return 0 === Object.getOwnPropertyNames(e).length;
            var t;
            for (t in e) if (e.hasOwnProperty(t)) return !1;
            return !0;
        }(e) || o(e) && 0 === e.length) && (e = void 0), a._isAMomentObject = !0, a._useUTC = a._isUTC = i, 
        a._l = n, a._i = e, a._f = t, a._strict = s, (r = new M(dt(Yt(a))))._nextDay && (r.add(1, "d"), 
        r._nextDay = void 0), r;
    }
    function Tt(e, t, n, s) {
        return Ot(e, t, n, s, !1);
    }
    c.createFromInputFallback = n("value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged and will be removed in an upcoming major release. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.", function(e) {
        e._d = new Date(e._i + (e._useUTC ? " UTC" : ""));
    }), c.ISO_8601 = function() {}, c.RFC_2822 = function() {};
    var xt = n("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/", function() {
        var e = Tt.apply(null, arguments);
        return this.isValid() && e.isValid() ? e < this ? this : e : v();
    }), bt = n("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/", function() {
        var e = Tt.apply(null, arguments);
        return this.isValid() && e.isValid() ? this < e ? this : e : v();
    });
    function Pt(e, t) {
        var n, s;
        if (1 === t.length && o(t[0]) && (t = t[0]), !t.length) return Tt();
        for (n = t[0], s = 1; s < t.length; ++s) t[s].isValid() && !t[s][e](n) || (n = t[s]);
        return n;
    }
    var Wt = [ "year", "quarter", "month", "week", "day", "hour", "minute", "second", "millisecond" ];
    function Ht(e) {
        var t = C(e), n = t.year || 0, s = t.quarter || 0, i = t.month || 0, r = t.week || 0, a = t.day || 0, o = t.hour || 0, u = t.minute || 0, l = t.second || 0, d = t.millisecond || 0;
        this._isValid = function(e) {
            for (var t in e) if (-1 === Ye.call(Wt, t) || null != e[t] && isNaN(e[t])) return !1;
            for (var n = !1, s = 0; s < Wt.length; ++s) if (e[Wt[s]]) {
                if (n) return !1;
                parseFloat(e[Wt[s]]) !== k(e[Wt[s]]) && (n = !0);
            }
            return !0;
        }(t), this._milliseconds = +d + 1e3 * l + 6e4 * u + 1e3 * o * 60 * 60, this._days = +a + 7 * r, 
        this._months = +i + 3 * s + 12 * n, this._data = {}, this._locale = lt(), this._bubble();
    }
    function Rt(e) {
        return e instanceof Ht;
    }
    function Ct(e) {
        return e < 0 ? -1 * Math.round(-1 * e) : Math.round(e);
    }
    function Ft(e, n) {
        I(e, 0, 0, function() {
            var e = this.utcOffset(), t = "+";
            return e < 0 && (e = -e, t = "-"), t + U(~~(e / 60), 2) + n + U(~~e % 60, 2);
        });
    }
    Ft("Z", ":"), Ft("ZZ", ""), ue("Z", re), ue("ZZ", re), ce([ "Z", "ZZ" ], function(e, t, n) {
        n._useUTC = !0, n._tzm = Ut(re, e);
    });
    var Lt = /([\+\-]|\d\d)/gi;
    function Ut(e, t) {
        var n = (t || "").match(e);
        if (null === n) return null;
        var s = ((n[n.length - 1] || []) + "").match(Lt) || [ "-", 0, 0 ], i = 60 * s[1] + k(s[2]);
        return 0 === i ? 0 : "+" === s[0] ? i : -i;
    }
    function Nt(e, t) {
        var n, s;
        return t._isUTC ? (n = t.clone(), s = (S(e) || h(e) ? e.valueOf() : Tt(e).valueOf()) - n.valueOf(), 
        n._d.setTime(n._d.valueOf() + s), c.updateOffset(n, !1), n) : Tt(e).local();
    }
    function Gt(e) {
        return 15 * -Math.round(e._d.getTimezoneOffset() / 15);
    }
    function Vt() {
        return !!this.isValid() && (this._isUTC && 0 === this._offset);
    }
    c.updateOffset = function() {};
    var Et = /^(\-|\+)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/, It = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
    function At(e, t) {
        var n, s, i, r = e, a = null;
        return Rt(e) ? r = {
            ms: e._milliseconds,
            d: e._days,
            M: e._months
        } : d(e) ? (r = {}, t ? r[t] = e : r.milliseconds = e) : (a = Et.exec(e)) ? (n = "-" === a[1] ? -1 : 1, 
        r = {
            y: 0,
            d: k(a[ye]) * n,
            h: k(a[ge]) * n,
            m: k(a[pe]) * n,
            s: k(a[ve]) * n,
            ms: k(Ct(1e3 * a[we])) * n
        }) : (a = It.exec(e)) ? (n = "-" === a[1] ? -1 : (a[1], 1), r = {
            y: jt(a[2], n),
            M: jt(a[3], n),
            w: jt(a[4], n),
            d: jt(a[5], n),
            h: jt(a[6], n),
            m: jt(a[7], n),
            s: jt(a[8], n)
        }) : null == r ? r = {} : "object" == typeof r && ("from" in r || "to" in r) && (i = function(e, t) {
            var n;
            if (!e.isValid() || !t.isValid()) return {
                milliseconds: 0,
                months: 0
            };
            t = Nt(t, e), e.isBefore(t) ? n = Zt(e, t) : ((n = Zt(t, e)).milliseconds = -n.milliseconds, 
            n.months = -n.months);
            return n;
        }(Tt(r.from), Tt(r.to)), (r = {}).ms = i.milliseconds, r.M = i.months), s = new Ht(r), 
        Rt(e) && m(e, "_locale") && (s._locale = e._locale), s;
    }
    function jt(e, t) {
        var n = e && parseFloat(e.replace(",", "."));
        return (isNaN(n) ? 0 : n) * t;
    }
    function Zt(e, t) {
        var n = {
            milliseconds: 0,
            months: 0
        };
        return n.months = t.month() - e.month() + 12 * (t.year() - e.year()), e.clone().add(n.months, "M").isAfter(t) && --n.months, 
        n.milliseconds = +t - +e.clone().add(n.months, "M"), n;
    }
    function zt(s, i) {
        return function(e, t) {
            var n;
            return null === t || isNaN(+t) || (T(i, "moment()." + i + "(period, number) is deprecated. Please use moment()." + i + "(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."), 
            n = e, e = t, t = n), $t(this, At(e = "string" == typeof e ? +e : e, t), s), this;
        };
    }
    function $t(e, t, n, s) {
        var i = t._milliseconds, r = Ct(t._days), a = Ct(t._months);
        e.isValid() && (s = null == s || s, a && Ce(e, xe(e, "Month") + a * n), r && be(e, "Date", xe(e, "Date") + r * n), 
        i && e._d.setTime(e._d.valueOf() + i * n), s && c.updateOffset(e, r || a));
    }
    At.fn = Ht.prototype, At.invalid = function() {
        return At(NaN);
    };
    var qt = zt(1, "add"), Jt = zt(-1, "subtract");
    function Bt(e, t) {
        var n = 12 * (t.year() - e.year()) + (t.month() - e.month()), s = e.clone().add(n, "months");
        return -(n + (t - s < 0 ? (t - s) / (s - e.clone().add(n - 1, "months")) : (t - s) / (e.clone().add(n + 1, "months") - s))) || 0;
    }
    function Qt(e) {
        var t;
        return void 0 === e ? this._locale._abbr : (null != (t = lt(e)) && (this._locale = t), 
        this);
    }
    c.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ", c.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss[Z]";
    var Xt = n("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function(e) {
        return void 0 === e ? this.localeData() : this.locale(e);
    });
    function Kt() {
        return this._locale;
    }
    function en(e, t) {
        I(0, [ e, e.length ], 0, t);
    }
    function tn(e, t, n, s, i) {
        var r;
        return null == e ? Ie(this, s, i).year : ((r = Ae(e, s, i)) < t && (t = r), function(e, t, n, s, i) {
            var r = Ee(e, t, n, s, i), a = Ge(r.year, 0, r.dayOfYear);
            return this.year(a.getUTCFullYear()), this.month(a.getUTCMonth()), this.date(a.getUTCDate()), 
            this;
        }.call(this, e, t, n, s, i));
    }
    I(0, [ "gg", 2 ], 0, function() {
        return this.weekYear() % 100;
    }), I(0, [ "GG", 2 ], 0, function() {
        return this.isoWeekYear() % 100;
    }), en("gggg", "weekYear"), en("ggggg", "weekYear"), en("GGGG", "isoWeekYear"), 
    en("GGGGG", "isoWeekYear"), H("weekYear", "gg"), H("isoWeekYear", "GG"), L("weekYear", 1), 
    L("isoWeekYear", 1), ue("G", se), ue("g", se), ue("GG", B, z), ue("gg", B, z), ue("GGGG", ee, q), 
    ue("gggg", ee, q), ue("GGGGG", te, J), ue("ggggg", te, J), fe([ "gggg", "ggggg", "GGGG", "GGGGG" ], function(e, t, n, s) {
        t[s.substr(0, 2)] = k(e);
    }), fe([ "gg", "GG" ], function(e, t, n, s) {
        t[s] = c.parseTwoDigitYear(e);
    }), I("Q", 0, "Qo", "quarter"), H("quarter", "Q"), L("quarter", 7), ue("Q", Z), 
    ce("Q", function(e, t) {
        t[_e] = 3 * (k(e) - 1);
    }), I("D", [ "DD", 2 ], "Do", "date"), H("date", "D"), L("date", 9), ue("D", B), 
    ue("DD", B, z), ue("Do", function(e, t) {
        return e ? t._dayOfMonthOrdinalParse || t._ordinalParse : t._dayOfMonthOrdinalParseLenient;
    }), ce([ "D", "DD" ], ye), ce("Do", function(e, t) {
        t[ye] = k(e.match(B)[0]);
    });
    var nn = Te("Date", !0);
    I("DDD", [ "DDDD", 3 ], "DDDo", "dayOfYear"), H("dayOfYear", "DDD"), L("dayOfYear", 4), 
    ue("DDD", K), ue("DDDD", $), ce([ "DDD", "DDDD" ], function(e, t, n) {
        n._dayOfYear = k(e);
    }), I("m", [ "mm", 2 ], 0, "minute"), H("minute", "m"), L("minute", 14), ue("m", B), 
    ue("mm", B, z), ce([ "m", "mm" ], pe);
    var sn = Te("Minutes", !1);
    I("s", [ "ss", 2 ], 0, "second"), H("second", "s"), L("second", 15), ue("s", B), 
    ue("ss", B, z), ce([ "s", "ss" ], ve);
    var rn, an = Te("Seconds", !1);
    for (I("S", 0, 0, function() {
        return ~~(this.millisecond() / 100);
    }), I(0, [ "SS", 2 ], 0, function() {
        return ~~(this.millisecond() / 10);
    }), I(0, [ "SSS", 3 ], 0, "millisecond"), I(0, [ "SSSS", 4 ], 0, function() {
        return 10 * this.millisecond();
    }), I(0, [ "SSSSS", 5 ], 0, function() {
        return 100 * this.millisecond();
    }), I(0, [ "SSSSSS", 6 ], 0, function() {
        return 1e3 * this.millisecond();
    }), I(0, [ "SSSSSSS", 7 ], 0, function() {
        return 1e4 * this.millisecond();
    }), I(0, [ "SSSSSSSS", 8 ], 0, function() {
        return 1e5 * this.millisecond();
    }), I(0, [ "SSSSSSSSS", 9 ], 0, function() {
        return 1e6 * this.millisecond();
    }), H("millisecond", "ms"), L("millisecond", 16), ue("S", K, Z), ue("SS", K, z), 
    ue("SSS", K, $), rn = "SSSS"; rn.length <= 9; rn += "S") ue(rn, ne);
    function on(e, t) {
        t[we] = k(1e3 * ("0." + e));
    }
    for (rn = "S"; rn.length <= 9; rn += "S") ce(rn, on);
    var un = Te("Milliseconds", !1);
    I("z", 0, 0, "zoneAbbr"), I("zz", 0, 0, "zoneName");
    var ln = M.prototype;
    function dn(e) {
        return e;
    }
    ln.add = qt, ln.calendar = function(e, t) {
        var n = e || Tt(), s = Nt(n, this).startOf("day"), i = c.calendarFormat(this, s) || "sameElse", r = t && (x(t[i]) ? t[i].call(this, n) : t[i]);
        return this.format(r || this.localeData().calendar(i, this, Tt(n)));
    }, ln.clone = function() {
        return new M(this);
    }, ln.diff = function(e, t, n) {
        var s, i, r;
        if (!this.isValid()) return NaN;
        if (!(s = Nt(e, this)).isValid()) return NaN;
        switch (i = 6e4 * (s.utcOffset() - this.utcOffset()), t = R(t)) {
          case "year":
            r = Bt(this, s) / 12;
            break;

          case "month":
            r = Bt(this, s);
            break;

          case "quarter":
            r = Bt(this, s) / 3;
            break;

          case "second":
            r = (this - s) / 1e3;
            break;

          case "minute":
            r = (this - s) / 6e4;
            break;

          case "hour":
            r = (this - s) / 36e5;
            break;

          case "day":
            r = (this - s - i) / 864e5;
            break;

          case "week":
            r = (this - s - i) / 6048e5;
            break;

          default:
            r = this - s;
        }
        return n ? r : D(r);
    }, ln.endOf = function(e) {
        return void 0 === (e = R(e)) || "millisecond" === e ? this : ("date" === e && (e = "day"), 
        this.startOf(e).add(1, "isoWeek" === e ? "week" : e).subtract(1, "ms"));
    }, ln.format = function(e) {
        e || (e = this.isUtc() ? c.defaultFormatUtc : c.defaultFormat);
        var t = A(this, e);
        return this.localeData().postformat(t);
    }, ln.from = function(e, t) {
        return this.isValid() && (S(e) && e.isValid() || Tt(e).isValid()) ? At({
            to: this,
            from: e
        }).locale(this.locale()).humanize(!t) : this.localeData().invalidDate();
    }, ln.fromNow = function(e) {
        return this.from(Tt(), e);
    }, ln.to = function(e, t) {
        return this.isValid() && (S(e) && e.isValid() || Tt(e).isValid()) ? At({
            from: this,
            to: e
        }).locale(this.locale()).humanize(!t) : this.localeData().invalidDate();
    }, ln.toNow = function(e) {
        return this.to(Tt(), e);
    }, ln.get = function(e) {
        return x(this[e = R(e)]) ? this[e]() : this;
    }, ln.invalidAt = function() {
        return g(this).overflow;
    }, ln.isAfter = function(e, t) {
        var n = S(e) ? e : Tt(e);
        return !(!this.isValid() || !n.isValid()) && ("millisecond" === (t = R(l(t) ? "millisecond" : t)) ? this.valueOf() > n.valueOf() : n.valueOf() < this.clone().startOf(t).valueOf());
    }, ln.isBefore = function(e, t) {
        var n = S(e) ? e : Tt(e);
        return !(!this.isValid() || !n.isValid()) && ("millisecond" === (t = R(l(t) ? "millisecond" : t)) ? this.valueOf() < n.valueOf() : this.clone().endOf(t).valueOf() < n.valueOf());
    }, ln.isBetween = function(e, t, n, s) {
        return ("(" === (s = s || "()")[0] ? this.isAfter(e, n) : !this.isBefore(e, n)) && (")" === s[1] ? this.isBefore(t, n) : !this.isAfter(t, n));
    }, ln.isSame = function(e, t) {
        var n, s = S(e) ? e : Tt(e);
        return !(!this.isValid() || !s.isValid()) && ("millisecond" === (t = R(t || "millisecond")) ? this.valueOf() === s.valueOf() : (n = s.valueOf(), 
        this.clone().startOf(t).valueOf() <= n && n <= this.clone().endOf(t).valueOf()));
    }, ln.isSameOrAfter = function(e, t) {
        return this.isSame(e, t) || this.isAfter(e, t);
    }, ln.isSameOrBefore = function(e, t) {
        return this.isSame(e, t) || this.isBefore(e, t);
    }, ln.isValid = function() {
        return p(this);
    }, ln.lang = Xt, ln.locale = Qt, ln.localeData = Kt, ln.max = bt, ln.min = xt, ln.parsingFlags = function() {
        return _({}, g(this));
    }, ln.set = function(e, t) {
        if ("object" == typeof e) for (var n = function(e) {
            var t = [];
            for (var n in e) t.push({
                unit: n,
                priority: F[n]
            });
            return t.sort(function(e, t) {
                return e.priority - t.priority;
            }), t;
        }(e = C(e)), s = 0; s < n.length; s++) this[n[s].unit](e[n[s].unit]); else if (x(this[e = R(e)])) return this[e](t);
        return this;
    }, ln.startOf = function(e) {
        switch (e = R(e)) {
          case "year":
            this.month(0);

          case "quarter":
          case "month":
            this.date(1);

          case "week":
          case "isoWeek":
          case "day":
          case "date":
            this.hours(0);

          case "hour":
            this.minutes(0);

          case "minute":
            this.seconds(0);

          case "second":
            this.milliseconds(0);
        }
        return "week" === e && this.weekday(0), "isoWeek" === e && this.isoWeekday(1), "quarter" === e && this.month(3 * Math.floor(this.month() / 3)), 
        this;
    }, ln.subtract = Jt, ln.toArray = function() {
        var e = this;
        return [ e.year(), e.month(), e.date(), e.hour(), e.minute(), e.second(), e.millisecond() ];
    }, ln.toObject = function() {
        var e = this;
        return {
            years: e.year(),
            months: e.month(),
            date: e.date(),
            hours: e.hours(),
            minutes: e.minutes(),
            seconds: e.seconds(),
            milliseconds: e.milliseconds()
        };
    }, ln.toDate = function() {
        return new Date(this.valueOf());
    }, ln.toISOString = function(e) {
        if (!this.isValid()) return null;
        var t = !0 !== e, n = t ? this.clone().utc() : this;
        return n.year() < 0 || 9999 < n.year() ? A(n, t ? "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYYYY-MM-DD[T]HH:mm:ss.SSSZ") : x(Date.prototype.toISOString) ? t ? this.toDate().toISOString() : new Date(this.valueOf() + 60 * this.utcOffset() * 1e3).toISOString().replace("Z", A(n, "Z")) : A(n, t ? "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYY-MM-DD[T]HH:mm:ss.SSSZ");
    }, ln.inspect = function() {
        if (!this.isValid()) return "moment.invalid(/* " + this._i + " */)";
        var e = "moment", t = "";
        this.isLocal() || (e = 0 === this.utcOffset() ? "moment.utc" : "moment.parseZone", 
        t = "Z");
        var n = "[" + e + '("]', s = 0 <= this.year() && this.year() <= 9999 ? "YYYY" : "YYYYYY", i = t + '[")]';
        return this.format(n + s + "-MM-DD[T]HH:mm:ss.SSS" + i);
    }, ln.toJSON = function() {
        return this.isValid() ? this.toISOString() : null;
    }, ln.toString = function() {
        return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
    }, ln.unix = function() {
        return Math.floor(this.valueOf() / 1e3);
    }, ln.valueOf = function() {
        return this._d.valueOf() - 6e4 * (this._offset || 0);
    }, ln.creationData = function() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        };
    }, ln.year = Oe, ln.isLeapYear = function() {
        return ke(this.year());
    }, ln.weekYear = function(e) {
        return tn.call(this, e, this.week(), this.weekday(), this.localeData()._week.dow, this.localeData()._week.doy);
    }, ln.isoWeekYear = function(e) {
        return tn.call(this, e, this.isoWeek(), this.isoWeekday(), 1, 4);
    }, ln.quarter = ln.quarters = function(e) {
        return null == e ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (e - 1) + this.month() % 3);
    }, ln.month = Fe, ln.daysInMonth = function() {
        return Pe(this.year(), this.month());
    }, ln.week = ln.weeks = function(e) {
        var t = this.localeData().week(this);
        return null == e ? t : this.add(7 * (e - t), "d");
    }, ln.isoWeek = ln.isoWeeks = function(e) {
        var t = Ie(this, 1, 4).week;
        return null == e ? t : this.add(7 * (e - t), "d");
    }, ln.weeksInYear = function() {
        var e = this.localeData()._week;
        return Ae(this.year(), e.dow, e.doy);
    }, ln.isoWeeksInYear = function() {
        return Ae(this.year(), 1, 4);
    }, ln.date = nn, ln.day = ln.days = function(e) {
        if (!this.isValid()) return null != e ? this : NaN;
        var t, n, s = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        return null != e ? (t = e, n = this.localeData(), e = "string" != typeof t ? t : isNaN(t) ? "number" == typeof (t = n.weekdaysParse(t)) ? t : null : parseInt(t, 10), 
        this.add(e - s, "d")) : s;
    }, ln.weekday = function(e) {
        if (!this.isValid()) return null != e ? this : NaN;
        var t = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return null == e ? t : this.add(e - t, "d");
    }, ln.isoWeekday = function(e) {
        if (!this.isValid()) return null != e ? this : NaN;
        if (null != e) {
            var t = (n = e, s = this.localeData(), "string" == typeof n ? s.weekdaysParse(n) % 7 || 7 : isNaN(n) ? null : n);
            return this.day(this.day() % 7 ? t : t - 7);
        }
        return this.day() || 7;
        var n, s;
    }, ln.dayOfYear = function(e) {
        var t = Math.round((this.clone().startOf("day") - this.clone().startOf("year")) / 864e5) + 1;
        return null == e ? t : this.add(e - t, "d");
    }, ln.hour = ln.hours = tt, ln.minute = ln.minutes = sn, ln.second = ln.seconds = an, 
    ln.millisecond = ln.milliseconds = un, ln.utcOffset = function(e, t, n) {
        var s, i = this._offset || 0;
        if (!this.isValid()) return null != e ? this : NaN;
        if (null != e) {
            if ("string" == typeof e) {
                if (null === (e = Ut(re, e))) return this;
            } else Math.abs(e) < 16 && !n && (e *= 60);
            return !this._isUTC && t && (s = Gt(this)), this._offset = e, this._isUTC = !0, 
            null != s && this.add(s, "m"), i !== e && (!t || this._changeInProgress ? $t(this, At(e - i, "m"), 1, !1) : this._changeInProgress || (this._changeInProgress = !0, 
            c.updateOffset(this, !0), this._changeInProgress = null)), this;
        }
        return this._isUTC ? i : Gt(this);
    }, ln.utc = function(e) {
        return this.utcOffset(0, e);
    }, ln.local = function(e) {
        return this._isUTC && (this.utcOffset(0, e), this._isUTC = !1, e && this.subtract(Gt(this), "m")), 
        this;
    }, ln.parseZone = function() {
        if (null != this._tzm) this.utcOffset(this._tzm, !1, !0); else if ("string" == typeof this._i) {
            var e = Ut(ie, this._i);
            null != e ? this.utcOffset(e) : this.utcOffset(0, !0);
        }
        return this;
    }, ln.hasAlignedHourOffset = function(e) {
        return !!this.isValid() && (e = e ? Tt(e).utcOffset() : 0, (this.utcOffset() - e) % 60 == 0);
    }, ln.isDST = function() {
        return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
    }, ln.isLocal = function() {
        return !!this.isValid() && !this._isUTC;
    }, ln.isUtcOffset = function() {
        return !!this.isValid() && this._isUTC;
    }, ln.isUtc = Vt, ln.isUTC = Vt, ln.zoneAbbr = function() {
        return this._isUTC ? "UTC" : "";
    }, ln.zoneName = function() {
        return this._isUTC ? "Coordinated Universal Time" : "";
    }, ln.dates = n("dates accessor is deprecated. Use date instead.", nn), ln.months = n("months accessor is deprecated. Use month instead", Fe), 
    ln.years = n("years accessor is deprecated. Use year instead", Oe), ln.zone = n("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/", function(e, t) {
        return null != e ? ("string" != typeof e && (e = -e), this.utcOffset(e, t), this) : -this.utcOffset();
    }), ln.isDSTShifted = n("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information", function() {
        if (!l(this._isDSTShifted)) return this._isDSTShifted;
        var e = {};
        if (w(e, this), (e = Yt(e))._a) {
            var t = e._isUTC ? y(e._a) : Tt(e._a);
            this._isDSTShifted = this.isValid() && 0 < a(e._a, t.toArray());
        } else this._isDSTShifted = !1;
        return this._isDSTShifted;
    });
    var hn = P.prototype;
    function cn(e, t, n, s) {
        var i = lt(), r = y().set(s, t);
        return i[n](r, e);
    }
    function fn(e, t, n) {
        if (d(e) && (t = e, e = void 0), e = e || "", null != t) return cn(e, t, n, "month");
        var s, i = [];
        for (s = 0; s < 12; s++) i[s] = cn(e, s, n, "month");
        return i;
    }
    function mn(e, t, n, s) {
        "boolean" == typeof e ? d(t) && (n = t, t = void 0) : (t = e, e = !1, d(n = t) && (n = t, 
        t = void 0)), t = t || "";
        var i, r = lt(), a = e ? r._week.dow : 0;
        if (null != n) return cn(t, (n + a) % 7, s, "day");
        var o = [];
        for (i = 0; i < 7; i++) o[i] = cn(t, (i + a) % 7, s, "day");
        return o;
    }
    hn.calendar = function(e, t, n) {
        var s = this._calendar[e] || this._calendar.sameElse;
        return x(s) ? s.call(t, n) : s;
    }, hn.longDateFormat = function(e) {
        var t = this._longDateFormat[e], n = this._longDateFormat[e.toUpperCase()];
        return t || !n ? t : (this._longDateFormat[e] = n.replace(/MMMM|MM|DD|dddd/g, function(e) {
            return e.slice(1);
        }), this._longDateFormat[e]);
    }, hn.invalidDate = function() {
        return this._invalidDate;
    }, hn.ordinal = function(e) {
        return this._ordinal.replace("%d", e);
    }, hn.preparse = dn, hn.postformat = dn, hn.relativeTime = function(e, t, n, s) {
        var i = this._relativeTime[n];
        return x(i) ? i(e, t, n, s) : i.replace(/%d/i, e);
    }, hn.pastFuture = function(e, t) {
        var n = this._relativeTime[0 < e ? "future" : "past"];
        return x(n) ? n(t) : n.replace(/%s/i, t);
    }, hn.set = function(e) {
        var t, n;
        for (n in e) x(t = e[n]) ? this[n] = t : this["_" + n] = t;
        this._config = e, this._dayOfMonthOrdinalParseLenient = new RegExp((this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + "|" + /\d{1,2}/.source);
    }, hn.months = function(e, t) {
        return e ? o(this._months) ? this._months[e.month()] : this._months[(this._months.isFormat || We).test(t) ? "format" : "standalone"][e.month()] : o(this._months) ? this._months : this._months.standalone;
    }, hn.monthsShort = function(e, t) {
        return e ? o(this._monthsShort) ? this._monthsShort[e.month()] : this._monthsShort[We.test(t) ? "format" : "standalone"][e.month()] : o(this._monthsShort) ? this._monthsShort : this._monthsShort.standalone;
    }, hn.monthsParse = function(e, t, n) {
        var s, i, r;
        if (this._monthsParseExact) return function(e, t, n) {
            var s, i, r, a = e.toLocaleLowerCase();
            if (!this._monthsParse) for (this._monthsParse = [], this._longMonthsParse = [], 
            this._shortMonthsParse = [], s = 0; s < 12; ++s) r = y([ 2e3, s ]), this._shortMonthsParse[s] = this.monthsShort(r, "").toLocaleLowerCase(), 
            this._longMonthsParse[s] = this.months(r, "").toLocaleLowerCase();
            return n ? "MMM" === t ? -1 !== (i = Ye.call(this._shortMonthsParse, a)) ? i : null : -1 !== (i = Ye.call(this._longMonthsParse, a)) ? i : null : "MMM" === t ? -1 !== (i = Ye.call(this._shortMonthsParse, a)) ? i : -1 !== (i = Ye.call(this._longMonthsParse, a)) ? i : null : -1 !== (i = Ye.call(this._longMonthsParse, a)) ? i : -1 !== (i = Ye.call(this._shortMonthsParse, a)) ? i : null;
        }.call(this, e, t, n);
        for (this._monthsParse || (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = []), 
        s = 0; s < 12; s++) {
            if (i = y([ 2e3, s ]), n && !this._longMonthsParse[s] && (this._longMonthsParse[s] = new RegExp("^" + this.months(i, "").replace(".", "") + "$", "i"), 
            this._shortMonthsParse[s] = new RegExp("^" + this.monthsShort(i, "").replace(".", "") + "$", "i")), 
            n || this._monthsParse[s] || (r = "^" + this.months(i, "") + "|^" + this.monthsShort(i, ""), 
            this._monthsParse[s] = new RegExp(r.replace(".", ""), "i")), n && "MMMM" === t && this._longMonthsParse[s].test(e)) return s;
            if (n && "MMM" === t && this._shortMonthsParse[s].test(e)) return s;
            if (!n && this._monthsParse[s].test(e)) return s;
        }
    }, hn.monthsRegex = function(e) {
        return this._monthsParseExact ? (m(this, "_monthsRegex") || Ne.call(this), e ? this._monthsStrictRegex : this._monthsRegex) : (m(this, "_monthsRegex") || (this._monthsRegex = Ue), 
        this._monthsStrictRegex && e ? this._monthsStrictRegex : this._monthsRegex);
    }, hn.monthsShortRegex = function(e) {
        return this._monthsParseExact ? (m(this, "_monthsRegex") || Ne.call(this), e ? this._monthsShortStrictRegex : this._monthsShortRegex) : (m(this, "_monthsShortRegex") || (this._monthsShortRegex = Le), 
        this._monthsShortStrictRegex && e ? this._monthsShortStrictRegex : this._monthsShortRegex);
    }, hn.week = function(e) {
        return Ie(e, this._week.dow, this._week.doy).week;
    }, hn.firstDayOfYear = function() {
        return this._week.doy;
    }, hn.firstDayOfWeek = function() {
        return this._week.dow;
    }, hn.weekdays = function(e, t) {
        return e ? o(this._weekdays) ? this._weekdays[e.day()] : this._weekdays[this._weekdays.isFormat.test(t) ? "format" : "standalone"][e.day()] : o(this._weekdays) ? this._weekdays : this._weekdays.standalone;
    }, hn.weekdaysMin = function(e) {
        return e ? this._weekdaysMin[e.day()] : this._weekdaysMin;
    }, hn.weekdaysShort = function(e) {
        return e ? this._weekdaysShort[e.day()] : this._weekdaysShort;
    }, hn.weekdaysParse = function(e, t, n) {
        var s, i, r;
        if (this._weekdaysParseExact) return function(e, t, n) {
            var s, i, r, a = e.toLocaleLowerCase();
            if (!this._weekdaysParse) for (this._weekdaysParse = [], this._shortWeekdaysParse = [], 
            this._minWeekdaysParse = [], s = 0; s < 7; ++s) r = y([ 2e3, 1 ]).day(s), this._minWeekdaysParse[s] = this.weekdaysMin(r, "").toLocaleLowerCase(), 
            this._shortWeekdaysParse[s] = this.weekdaysShort(r, "").toLocaleLowerCase(), this._weekdaysParse[s] = this.weekdays(r, "").toLocaleLowerCase();
            return n ? "dddd" === t ? -1 !== (i = Ye.call(this._weekdaysParse, a)) ? i : null : "ddd" === t ? -1 !== (i = Ye.call(this._shortWeekdaysParse, a)) ? i : null : -1 !== (i = Ye.call(this._minWeekdaysParse, a)) ? i : null : "dddd" === t ? -1 !== (i = Ye.call(this._weekdaysParse, a)) ? i : -1 !== (i = Ye.call(this._shortWeekdaysParse, a)) ? i : -1 !== (i = Ye.call(this._minWeekdaysParse, a)) ? i : null : "ddd" === t ? -1 !== (i = Ye.call(this._shortWeekdaysParse, a)) ? i : -1 !== (i = Ye.call(this._weekdaysParse, a)) ? i : -1 !== (i = Ye.call(this._minWeekdaysParse, a)) ? i : null : -1 !== (i = Ye.call(this._minWeekdaysParse, a)) ? i : -1 !== (i = Ye.call(this._weekdaysParse, a)) ? i : -1 !== (i = Ye.call(this._shortWeekdaysParse, a)) ? i : null;
        }.call(this, e, t, n);
        for (this._weekdaysParse || (this._weekdaysParse = [], this._minWeekdaysParse = [], 
        this._shortWeekdaysParse = [], this._fullWeekdaysParse = []), s = 0; s < 7; s++) {
            if (i = y([ 2e3, 1 ]).day(s), n && !this._fullWeekdaysParse[s] && (this._fullWeekdaysParse[s] = new RegExp("^" + this.weekdays(i, "").replace(".", "\\.?") + "$", "i"), 
            this._shortWeekdaysParse[s] = new RegExp("^" + this.weekdaysShort(i, "").replace(".", "\\.?") + "$", "i"), 
            this._minWeekdaysParse[s] = new RegExp("^" + this.weekdaysMin(i, "").replace(".", "\\.?") + "$", "i")), 
            this._weekdaysParse[s] || (r = "^" + this.weekdays(i, "") + "|^" + this.weekdaysShort(i, "") + "|^" + this.weekdaysMin(i, ""), 
            this._weekdaysParse[s] = new RegExp(r.replace(".", ""), "i")), n && "dddd" === t && this._fullWeekdaysParse[s].test(e)) return s;
            if (n && "ddd" === t && this._shortWeekdaysParse[s].test(e)) return s;
            if (n && "dd" === t && this._minWeekdaysParse[s].test(e)) return s;
            if (!n && this._weekdaysParse[s].test(e)) return s;
        }
    }, hn.weekdaysRegex = function(e) {
        return this._weekdaysParseExact ? (m(this, "_weekdaysRegex") || Be.call(this), e ? this._weekdaysStrictRegex : this._weekdaysRegex) : (m(this, "_weekdaysRegex") || (this._weekdaysRegex = $e), 
        this._weekdaysStrictRegex && e ? this._weekdaysStrictRegex : this._weekdaysRegex);
    }, hn.weekdaysShortRegex = function(e) {
        return this._weekdaysParseExact ? (m(this, "_weekdaysRegex") || Be.call(this), e ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex) : (m(this, "_weekdaysShortRegex") || (this._weekdaysShortRegex = qe), 
        this._weekdaysShortStrictRegex && e ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex);
    }, hn.weekdaysMinRegex = function(e) {
        return this._weekdaysParseExact ? (m(this, "_weekdaysRegex") || Be.call(this), e ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex) : (m(this, "_weekdaysMinRegex") || (this._weekdaysMinRegex = Je), 
        this._weekdaysMinStrictRegex && e ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex);
    }, hn.isPM = function(e) {
        return "p" === (e + "").toLowerCase().charAt(0);
    }, hn.meridiem = function(e, t, n) {
        return 11 < e ? n ? "pm" : "PM" : n ? "am" : "AM";
    }, ot("en", {
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function(e) {
            var t = e % 10;
            return e + (1 === k(e % 100 / 10) ? "th" : 1 === t ? "st" : 2 === t ? "nd" : 3 === t ? "rd" : "th");
        }
    }), c.lang = n("moment.lang is deprecated. Use moment.locale instead.", ot), c.langData = n("moment.langData is deprecated. Use moment.localeData instead.", lt);
    var _n = Math.abs;
    function yn(e, t, n, s) {
        var i = At(t, n);
        return e._milliseconds += s * i._milliseconds, e._days += s * i._days, e._months += s * i._months, 
        e._bubble();
    }
    function gn(e) {
        return e < 0 ? Math.floor(e) : Math.ceil(e);
    }
    function pn(e) {
        return 4800 * e / 146097;
    }
    function vn(e) {
        return 146097 * e / 4800;
    }
    function wn(e) {
        return function() {
            return this.as(e);
        };
    }
    var Mn = wn("ms"), Sn = wn("s"), Dn = wn("m"), kn = wn("h"), Yn = wn("d"), On = wn("w"), Tn = wn("M"), xn = wn("y");
    function bn(e) {
        return function() {
            return this.isValid() ? this._data[e] : NaN;
        };
    }
    var Pn = bn("milliseconds"), Wn = bn("seconds"), Hn = bn("minutes"), Rn = bn("hours"), Cn = bn("days"), Fn = bn("months"), Ln = bn("years");
    var Un = Math.round, Nn = {
        ss: 44,
        s: 45,
        m: 45,
        h: 22,
        d: 26,
        M: 11
    };
    var Gn = Math.abs;
    function Vn(e) {
        return (0 < e) - (e < 0) || +e;
    }
    function En() {
        if (!this.isValid()) return this.localeData().invalidDate();
        var e, t, n = Gn(this._milliseconds) / 1e3, s = Gn(this._days), i = Gn(this._months);
        t = D((e = D(n / 60)) / 60), n %= 60, e %= 60;
        var r = D(i / 12), a = i %= 12, o = s, u = t, l = e, d = n ? n.toFixed(3).replace(/\.?0+$/, "") : "", h = this.asSeconds();
        if (!h) return "P0D";
        var c = h < 0 ? "-" : "", f = Vn(this._months) !== Vn(h) ? "-" : "", m = Vn(this._days) !== Vn(h) ? "-" : "", _ = Vn(this._milliseconds) !== Vn(h) ? "-" : "";
        return c + "P" + (r ? f + r + "Y" : "") + (a ? f + a + "M" : "") + (o ? m + o + "D" : "") + (u || l || d ? "T" : "") + (u ? _ + u + "H" : "") + (l ? _ + l + "M" : "") + (d ? _ + d + "S" : "");
    }
    var In = Ht.prototype;
    return In.isValid = function() {
        return this._isValid;
    }, In.abs = function() {
        var e = this._data;
        return this._milliseconds = _n(this._milliseconds), this._days = _n(this._days), 
        this._months = _n(this._months), e.milliseconds = _n(e.milliseconds), e.seconds = _n(e.seconds), 
        e.minutes = _n(e.minutes), e.hours = _n(e.hours), e.months = _n(e.months), e.years = _n(e.years), 
        this;
    }, In.add = function(e, t) {
        return yn(this, e, t, 1);
    }, In.subtract = function(e, t) {
        return yn(this, e, t, -1);
    }, In.as = function(e) {
        if (!this.isValid()) return NaN;
        var t, n, s = this._milliseconds;
        if ("month" === (e = R(e)) || "year" === e) return t = this._days + s / 864e5, n = this._months + pn(t), 
        "month" === e ? n : n / 12;
        switch (t = this._days + Math.round(vn(this._months)), e) {
          case "week":
            return t / 7 + s / 6048e5;

          case "day":
            return t + s / 864e5;

          case "hour":
            return 24 * t + s / 36e5;

          case "minute":
            return 1440 * t + s / 6e4;

          case "second":
            return 86400 * t + s / 1e3;

          case "millisecond":
            return Math.floor(864e5 * t) + s;

          default:
            throw new Error("Unknown unit " + e);
        }
    }, In.asMilliseconds = Mn, In.asSeconds = Sn, In.asMinutes = Dn, In.asHours = kn, 
    In.asDays = Yn, In.asWeeks = On, In.asMonths = Tn, In.asYears = xn, In.valueOf = function() {
        return this.isValid() ? this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * k(this._months / 12) : NaN;
    }, In._bubble = function() {
        var e, t, n, s, i, r = this._milliseconds, a = this._days, o = this._months, u = this._data;
        return 0 <= r && 0 <= a && 0 <= o || r <= 0 && a <= 0 && o <= 0 || (r += 864e5 * gn(vn(o) + a), 
        o = a = 0), u.milliseconds = r % 1e3, e = D(r / 1e3), u.seconds = e % 60, t = D(e / 60), 
        u.minutes = t % 60, n = D(t / 60), u.hours = n % 24, o += i = D(pn(a += D(n / 24))), 
        a -= gn(vn(i)), s = D(o / 12), o %= 12, u.days = a, u.months = o, u.years = s, this;
    }, In.clone = function() {
        return At(this);
    }, In.get = function(e) {
        return e = R(e), this.isValid() ? this[e + "s"]() : NaN;
    }, In.milliseconds = Pn, In.seconds = Wn, In.minutes = Hn, In.hours = Rn, In.days = Cn, 
    In.weeks = function() {
        return D(this.days() / 7);
    }, In.months = Fn, In.years = Ln, In.humanize = function(e) {
        if (!this.isValid()) return this.localeData().invalidDate();
        var t, n, s, i, r, a, o, u, l, d, h, c = this.localeData(), f = (n = !e, s = c, 
        i = At(t = this).abs(), r = Un(i.as("s")), a = Un(i.as("m")), o = Un(i.as("h")), 
        u = Un(i.as("d")), l = Un(i.as("M")), d = Un(i.as("y")), (h = r <= Nn.ss && [ "s", r ] || r < Nn.s && [ "ss", r ] || a <= 1 && [ "m" ] || a < Nn.m && [ "mm", a ] || o <= 1 && [ "h" ] || o < Nn.h && [ "hh", o ] || u <= 1 && [ "d" ] || u < Nn.d && [ "dd", u ] || l <= 1 && [ "M" ] || l < Nn.M && [ "MM", l ] || d <= 1 && [ "y" ] || [ "yy", d ])[2] = n, 
        h[3] = 0 < +t, h[4] = s, function(e, t, n, s, i) {
            return i.relativeTime(t || 1, !!n, e, s);
        }.apply(null, h));
        return e && (f = c.pastFuture(+this, f)), c.postformat(f);
    }, In.toISOString = En, In.toString = En, In.toJSON = En, In.locale = Qt, In.localeData = Kt, 
    In.toIsoString = n("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", En), 
    In.lang = Xt, I("X", 0, 0, "unix"), I("x", 0, 0, "valueOf"), ue("x", se), ue("X", /[+-]?\d+(\.\d{1,3})?/), 
    ce("X", function(e, t, n) {
        n._d = new Date(1e3 * parseFloat(e, 10));
    }), ce("x", function(e, t, n) {
        n._d = new Date(k(e));
    }), c.version = "2.22.2", e = Tt, c.fn = ln, c.min = function() {
        return Pt("isBefore", [].slice.call(arguments, 0));
    }, c.max = function() {
        return Pt("isAfter", [].slice.call(arguments, 0));
    }, c.now = function() {
        return Date.now ? Date.now() : +new Date();
    }, c.utc = y, c.unix = function(e) {
        return Tt(1e3 * e);
    }, c.months = function(e, t) {
        return fn(e, t, "months");
    }, c.isDate = h, c.locale = ot, c.invalid = v, c.duration = At, c.isMoment = S, 
    c.weekdays = function(e, t, n) {
        return mn(e, t, n, "weekdays");
    }, c.parseZone = function() {
        return Tt.apply(null, arguments).parseZone();
    }, c.localeData = lt, c.isDuration = Rt, c.monthsShort = function(e, t) {
        return fn(e, t, "monthsShort");
    }, c.weekdaysMin = function(e, t, n) {
        return mn(e, t, n, "weekdaysMin");
    }, c.defineLocale = ut, c.updateLocale = function(e, t) {
        if (null != t) {
            var n, s, i = nt;
            null != (s = at(e)) && (i = s._config), (n = new P(t = b(i, t))).parentLocale = st[e], 
            st[e] = n, ot(e);
        } else null != st[e] && (null != st[e].parentLocale ? st[e] = st[e].parentLocale : null != st[e] && delete st[e]);
        return st[e];
    }, c.locales = function() {
        return s(st);
    }, c.weekdaysShort = function(e, t, n) {
        return mn(e, t, n, "weekdaysShort");
    }, c.normalizeUnits = R, c.relativeTimeRounding = function(e) {
        return void 0 === e ? Un : "function" == typeof e && (Un = e, !0);
    }, c.relativeTimeThreshold = function(e, t) {
        return void 0 !== Nn[e] && (void 0 === t ? Nn[e] : (Nn[e] = t, "s" === e && (Nn.ss = t - 1), 
        !0));
    }, c.calendarFormat = function(e, t) {
        var n = e.diff(t, "days", !0);
        return n < -6 ? "sameElse" : n < -1 ? "lastWeek" : n < 0 ? "lastDay" : n < 1 ? "sameDay" : n < 2 ? "nextDay" : n < 7 ? "nextWeek" : "sameElse";
    }, c.prototype = ln, c.HTML5_FMT = {
        DATETIME_LOCAL: "YYYY-MM-DDTHH:mm",
        DATETIME_LOCAL_SECONDS: "YYYY-MM-DDTHH:mm:ss",
        DATETIME_LOCAL_MS: "YYYY-MM-DDTHH:mm:ss.SSS",
        DATE: "YYYY-MM-DD",
        TIME: "HH:mm",
        TIME_SECONDS: "HH:mm:ss",
        TIME_MS: "HH:mm:ss.SSS",
        WEEK: "YYYY-[W]WW",
        MONTH: "YYYY-MM"
    }, c;
});

"use strict";

module.define("ytilitu.time.calculator", function() {
    var seconds_day = 86400, utc_leap_second_table = [ [ 1435708800, 36 ], [ 1341100800, 35 ], [ 1230768e3, 34 ], [ 1136073600, 33 ], [ 915148800, 32 ], [ 867715200, 31 ], [ 820454400, 30 ], [ 773020800, 29 ], [ 741484800, 28 ], [ 709948800, 27 ], [ 662688e3, 26 ], [ 631152e3, 25 ], [ 567993600, 24 ], [ 489024e3, 23 ], [ 425865600, 22 ], [ 394329600, 21 ], [ 362793600, 20 ], [ 315532800, 19 ], [ 283996800, 18 ], [ 252460800, 17 ], [ 220924800, 16 ], [ 189302400, 15 ], [ 157766400, 14 ], [ 126230400, 13 ], [ 94694400, 12 ], [ 78796800, 11 ], [ 63072e3, 10 ] ];
    function truncate_to_decimal_places(a, n) {
        if (!n) {
            return Math.trunc(a);
        }
        var factor = Math.pow(10, n);
        return Math.trunc(a * factor) / factor;
    }
    function leap_second_delta(utc_seconds) {
        function find_leap_seconds(index) {
            if (index < utc_leap_second_table.length) {
                if (utc_seconds >= utc_leap_second_table[index][0]) {
                    return utc_leap_second_table[index][1];
                } else {
                    return find_leap_seconds(1 + index);
                }
            } else {
                return 0;
            }
        }
        if (utc_seconds < (1972 - 1970) * 365 * seconds_day) {
            return 0;
        } else {
            return find_leap_seconds(0);
        }
    }
    function empty_if_nan(a) {
        if (isNaN(a)) {
            return "";
        } else {
            return a;
        }
    }
    var iso_format_pattern = "YYYY-MM-DD HH:mm:ss";
    function unix_to_time(a) {
        return moment.utc(1e3 * a);
    }
    function difference_initialise() {
        var state = {
            input_block_first: null,
            input_block_second: null
        };
        var fields = {
            separate: {
                se: {
                    set: function(a) {
                        return truncate_to_decimal_places(a.asSeconds(), 2);
                    }
                },
                mi: {
                    set: function(a) {
                        return truncate_to_decimal_places(a.asMinutes(), 2);
                    }
                },
                ho: {
                    set: function(a) {
                        return truncate_to_decimal_places(a.asHours(), 2);
                    }
                },
                da: {
                    set: function(a) {
                        return truncate_to_decimal_places(a.asDays(), 2);
                    }
                },
                mo: {
                    set: function(a) {
                        return truncate_to_decimal_places(a.asMonths(), 2);
                    }
                },
                we: {
                    set: function(a) {
                        return truncate_to_decimal_places(a.asWeeks(), 2);
                    }
                },
                ye: {
                    set: function(a) {
                        return truncate_to_decimal_places(a.asYears(), 2);
                    }
                }
            },
            combined: {
                se: {
                    set: function(a) {
                        return a.seconds();
                    }
                },
                mi: {
                    set: function(a) {
                        return a.minutes();
                    }
                },
                ho: {
                    set: function(a) {
                        return a.hours();
                    }
                },
                da: {
                    set: function(a) {
                        return a.days();
                    }
                },
                mo: {
                    set: function(a) {
                        return a.months();
                    }
                },
                we: {
                    set: function(a) {
                        return a.weeks();
                    }
                },
                ye: {
                    set: function(a) {
                        return a.years();
                    }
                }
            }
        };
        function update() {
            if (!state.input_block_second) {
                return;
            }
            var time_a = state.input_block_first.current_time, time_b = state.input_block_second.current_time;
            return _.each(fields, function(fields, type) {
                return _.each(fields, function(data, name) {
                    return data.element.innerHTML = data.set(moment.duration(time_b.diff(time_a, "milliseconds")));
                });
            });
        }
        function initialise() {
            return _.each(fields, function(fields, type) {
                return _.each(fields, function(data, name) {
                    return data.element = document.querySelector("." + type + " ." + name);
                });
            });
        }
        initialise();
        state.update = update;
        return state;
    }
    function input_block_initialise(difference, selector) {
        var state = {
            current_time: null
        };
        var inputs = {
            input_unix: {
                get: function(a) {
                    return unix_to_time(a);
                },
                set: function(a) {
                    return a.unix();
                }
            },
            input_tai_unix: {
                get: function(a) {
                    return function(a_tai) {
                        return unix_to_time(a_tai - leap_second_delta(a_tai));
                    }(parseInt(a, 10));
                },
                set: function(a) {
                    return function(a_unix) {
                        return a_unix + leap_second_delta(a_unix);
                    }(a.unix());
                }
            },
            input_year: {
                get: function(a) {
                    return state.current_time.year(a);
                },
                set: function(a) {
                    inputs.input_week.element.setAttribute("max", a.isoWeeksInYear());
                    return a.year();
                }
            },
            input_week: {
                get: function(a) {
                    return state.current_time.isoWeekday(1).isoWeek(a);
                },
                set: function(a) {
                    var last_week = a.isoWeeksInYear(), week_number = a.isoWeek();
                    if (week_number > last_week) {
                        week_number = last_week;
                    }
                    return week_number;
                }
            },
            input_iso: {
                get: function(a) {
                    return moment.utc(a, iso_format_pattern);
                },
                set: function(a) {
                    return a.format(iso_format_pattern);
                }
            },
            input_month: {
                get: function(a) {
                    return state.current_time.month(parseInt(a, 10) - 1);
                },
                set: function(a) {
                    return 1 + a.month();
                }
            },
            input_day: {
                get: function(a) {
                    return state.current_time.date(a);
                },
                set: function(a) {
                    return a.date();
                }
            },
            input_hour: {
                get: function(a) {
                    return state.current_time.hour(a);
                },
                set: function(a) {
                    return a.hour();
                }
            },
            input_minute: {
                get: function(a) {
                    return state.current_time.minute(a);
                },
                set: function(a) {
                    return a.minute();
                }
            },
            input_second: {
                get: function(a) {
                    return state.current_time.second(a);
                },
                set: function(a) {
                    return a.second();
                }
            },
            input_kilosecond: {
                get: function(a) {
                    return unix_to_time(state.current_time.clone().startOf("day").unix() + 1e3 * a);
                },
                set: function(a) {
                    return truncate_to_decimal_places((a.unix() - a.clone().startOf("day").unix()) / 1e3, 2);
                }
            }
        };
        function update(leading) {
            if (!leading) {
                leading = inputs.input_tai_unix.element;
            }
            var input = inputs[leading.name];
            state.current_time = input.get(leading.value);
            _.each(inputs, function(value, key) {
                if (!(leading.name === key)) {
                    return function(input) {
                        return input.element.value = input.set(state.current_time);
                    }(inputs[key]);
                }
            });
            return difference.update();
        }
        function update_event_handler(event) {
            return update(event.target);
        }
        function initialise(selector) {
            _.map(inputs, function(value, key) {
                var element_selector = selector + " input[name=" + key + "]", element = document.querySelector(element_selector);
                inputs[key]["element"] = element;
                if (!("input_week" === key)) {
                    element.addEventListener("keyup", update_event_handler);
                }
                return element.addEventListener("change", update_event_handler);
            });
            return update();
        }
        initialise(selector);
        return state;
    }
    function initialise() {
        var difference = difference_initialise();
        difference.input_block_first = input_block_initialise(difference, ".time-entry.first");
        difference.input_block_second = input_block_initialise(difference, ".time-entry.second");
        return difference.update();
    }
    return initialise();
});
