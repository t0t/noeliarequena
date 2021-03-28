
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    function create_animation(node, from, fn, params) {
        if (!from)
            return noop;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = now() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop, css } = fn(node, { from, to }, params);
        let running = true;
        let started = false;
        let name;
        function start() {
            if (css) {
                name = create_rule(node, 0, 1, duration, delay, easing, css);
            }
            if (!delay) {
                started = true;
            }
        }
        function stop() {
            if (css)
                delete_rule(node, name);
            running = false;
        }
        loop(now => {
            if (!started && now >= start_time) {
                started = true;
            }
            if (started && now >= end) {
                tick(1, 0);
                stop();
            }
            if (!running) {
                return false;
            }
            if (started) {
                const p = now - start_time;
                const t = 0 + 1 * easing(p / duration);
                tick(t, 1 - t);
            }
            return true;
        });
        start();
        tick(0, 1);
        return stop;
    }
    function fix_position(node) {
        const style = getComputedStyle(node);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            const { width, height } = style;
            const a = node.getBoundingClientRect();
            node.style.position = 'absolute';
            node.style.width = width;
            node.style.height = height;
            add_transform(node, a);
        }
    }
    function add_transform(node, a) {
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function fix_and_destroy_block(block, lookup) {
        block.f();
        destroy_block(block, lookup);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.32.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /**
     * @typedef {Object} WrappedComponent Object returned by the `wrap` method
     * @property {SvelteComponent} component - Component to load (this is always asynchronous)
     * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
     * @property {Object} [props] - Optional dictionary of static props
     * @property {Object} [userData] - Optional user data dictionary
     * @property {bool} _sveltesparouter - Internal flag; always set to true
     */

    /**
     * @callback AsyncSvelteComponent
     * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
     */

    /**
     * @callback RoutePrecondition
     * @param {RouteDetail} detail - Route detail object
     * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
     */

    /**
     * @typedef {Object} WrapOptions Options object for the call to `wrap`
     * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
     * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
     * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
     * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
     * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
     * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
     * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
     */

    /**
     * Wraps a component to enable multiple capabilities:
     * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
     * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
     * 3. Adding static props that are passed to the component
     * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
     * 
     * @param {WrapOptions} args - Arguments object
     * @returns {WrappedComponent} Wrapped component
     */
    function wrap(args) {
        if (!args) {
            throw Error('Parameter args is required')
        }

        // We need to have one and only one of component and asyncComponent
        // This does a "XNOR"
        if (!args.component == !args.asyncComponent) {
            throw Error('One and only one of component and asyncComponent is required')
        }

        // If the component is not async, wrap it into a function returning a Promise
        if (args.component) {
            args.asyncComponent = () => Promise.resolve(args.component);
        }

        // Parameter asyncComponent and each item of conditions must be functions
        if (typeof args.asyncComponent != 'function') {
            throw Error('Parameter asyncComponent must be a function')
        }
        if (args.conditions) {
            // Ensure it's an array
            if (!Array.isArray(args.conditions)) {
                args.conditions = [args.conditions];
            }
            for (let i = 0; i < args.conditions.length; i++) {
                if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                    throw Error('Invalid parameter conditions[' + i + ']')
                }
            }
        }

        // Check if we have a placeholder component
        if (args.loadingComponent) {
            args.asyncComponent.loading = args.loadingComponent;
            args.asyncComponent.loadingParams = args.loadingParams || undefined;
        }

        // Returns an object that contains all the functions to execute too
        // The _sveltesparouter flag is to confirm the object was created by this router
        const obj = {
            component: args.asyncComponent,
            userData: args.userData,
            conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
            props: (args.props && Object.keys(args.props).length) ? args.props : {},
            _sveltesparouter: true
        };

        return obj
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function regexparam (str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules/svelte-spa-router/Router.svelte generated by Svelte v3.32.1 */

    const { Error: Error_1, Object: Object_1, console: console_1 } = globals;

    // (209:0) {:else}
    function create_else_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(209:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (202:0) {#if componentParams}
    function create_if_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(202:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap$1(component, userData, ...conditions) {
    	// Use the new wrap method and show a deprecation warning
    	// eslint-disable-next-line no-console
    	console.warn("Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading");

    	return wrap({ component, userData, conditions });
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf("#/");

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: "/";

    	// Check if there's a querystring
    	const qsPosition = location.indexOf("?");

    	let querystring = "";

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener("hashchange", update, false);

    	return function stop() {
    		window.removeEventListener("hashchange", update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			scrollX: window.scrollX,
    			scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == "#" ? "" : "#") + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == "#" ? "" : "#") + location;

    	try {
    		window.history.replaceState(undefined, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn("Caught exception while replacing the current page. If you're running this in the Svelte REPL, please note that the `replace` method might not work in this environment.");
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event("hashchange"));
    }

    function link(node, hrefVar) {
    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != "a") {
    		throw Error("Action \"link\" can only be used with <a> tags");
    	}

    	updateLink(node, hrefVar || node.getAttribute("href"));

    	return {
    		update(updated) {
    			updateLink(node, updated);
    		}
    	};
    }

    // Internal function used by the link function
    function updateLink(node, href) {
    	// Destination must start with '/'
    	if (!href || href.length < 1 || href.charAt(0) != "/") {
    		throw Error("Invalid value for \"href\" attribute: " + href);
    	}

    	// Add # to the href attribute
    	node.setAttribute("href", "#" + href);

    	node.addEventListener("click", scrollstateHistoryHandler);
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {HTMLElementEventMap} event - an onclick event attached to an anchor tag
     */
    function scrollstateHistoryHandler(event) {
    	// Prevent default anchor onclick behaviour
    	event.preventDefault();

    	const href = event.currentTarget.getAttribute("href");

    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			scrollX: window.scrollX,
    			scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Router", slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = "" } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != "function" && (typeof component != "object" || component._sveltesparouter !== true)) {
    				throw Error("Invalid component object");
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == "string" && (path.length < 1 || path.charAt(0) != "/" && path.charAt(0) != "*") || typeof path == "object" && !(path instanceof RegExp)) {
    				throw Error("Invalid value for \"path\" argument - strings must start with / or *");
    			}

    			const { pattern, keys } = regexparam(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == "object" && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == "string") {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || "/";
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || "/";
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || "") || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {bool} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	if (restoreScrollState) {
    		window.addEventListener("popstate", event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && event.state.scrollY) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		});

    		afterUpdate(() => {
    			// If this exists, then this is a back navigation: restore the scroll position
    			if (previousScrollState) {
    				window.scrollTo(previousScrollState.scrollX, previousScrollState.scrollY);
    			} else {
    				// Otherwise this is a forward navigation: scroll to top
    				window.scrollTo(0, 0);
    			}
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick("conditionsFailed", detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick("routeLoading", Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick("routeLoaded", Object.assign({}, detail, { component, name: component.name }));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == "object" && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick("routeLoaded", Object.assign({}, detail, { component, name: component.name }));

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    	});

    	const writable_props = ["routes", "prefix", "restoreScrollState"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble($$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ("routes" in $$props) $$invalidate(3, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ("restoreScrollState" in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		derived,
    		tick,
    		_wrap: wrap,
    		wrap: wrap$1,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		push,
    		pop,
    		replace,
    		link,
    		updateLink,
    		scrollstateHistoryHandler,
    		createEventDispatcher,
    		afterUpdate,
    		regexparam,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		lastLoc,
    		componentObj
    	});

    	$$self.$inject_state = $$props => {
    		if ("routes" in $$props) $$invalidate(3, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ("restoreScrollState" in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ("component" in $$props) $$invalidate(0, component = $$props.component);
    		if ("componentParams" in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ("props" in $$props) $$invalidate(2, props = $$props.props);
    		if ("previousScrollState" in $$props) previousScrollState = $$props.previousScrollState;
    		if ("lastLoc" in $$props) lastLoc = $$props.lastLoc;
    		if ("componentObj" in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? "manual" : "auto";
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance, create_fragment, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const data = [
        {
          id: "0",
          block: "Cover",
          title: "Noelia Requena",
          subtitle: "Paintings",
          text: "aqui el texto...",
          img: "../img/bg4.jpg"
        },
        {
          id: "1",
          block: "Banner text",
          title: "+0+1234",
          subtitle: "El fundamento de la Creación radica en un orden arquetípico universal. ...Percibir ese orden conforma un tipo de conexión trascendental.",
          img: "02234-14.jpg"
        },
        {
          id: "2",
          block: "Video",
          title: "Desde la poesía de la materia",
          subtitle: "Todo son formas de arte simbólicas en si mismas y, como tales, cumplen una <strong>función mediadora capaz de abrirle lo real a la conciencia.</strong>",
        },
        {
          id: "3",
          block: "Product Gallery",
          title: "Review ",
          author_review: "Román Bayarri",
        },
        {
          id: "4",
          block: "",
          title: "More info",
          subtitle: "Información adicional, descargar Currículum en PDF, dirección, Showroom...",
          buttontext: "Download Resume",
          buttonurl: "#",
          img: "../img/bg2.jpg"
        },
        {
          id: "5",
          block: "Meta-Mapa",
          title: "Meta-Mapa +0+1234",
          subtitle: "+0+1234 consiste en una hermenéutica de la Creación que observa experiencialmente sus principios universales. Ancestralmente 5 símbolos numéricos representan las partes de Todo. Cualquier palabra que escribas se ordena naturalmente en una de estas zonas."
        },
        {
          id: "6",
          block: "impresion datos",
          title: "Impresión 3D de datos.",
          subtitle: "<strong>¿Podemos tocar los datos?</strong> En este proyecto me interesa explorar la mejor manera de traducir datos <code>JSON</code> a mallas 3D para poder ser impresos en el mundo real. Por medio de Three.js topografiamos los datos como coordenadas sobre un plano que luego se exporta a un archivo 3D"
        },
        {
          id: "7",
          block: "gematria",
          title: "Gematria App",
          subtitle: "He desarrollado una sencilla aplicación que traduce palabras en hebreo a su equivalente numérico. Creado en JS, Html, Sass y Svelte",
          img: "../img/gematria.gif",
          button: "Abrir App",
          buttonurl: "https://gematriaapp.vercel.app/"
        },
        {
          id: "8",
          block: "phi",
          title: "bla, bla, bla",
          subtitle: ""
        },
        {
          id: "9",
          block: "youtube",
          title: "Videos",
          subtitle: "bla, bla, bla",
          buttontext: "Visitar Canal",
          buttonurl: "https://www.youtube.com/channel/UC9C6HRn2RDG3bmWC4Soxtcw"
        },
        {
          id: "10",
          block: "aboutme",
          title: "Noelia Requena",
          subtitle: "'Cuando uno toma conciencia del misterio de la existencia y no lo entiende, pero por pura sinceridad y coherencia interior necesita respuestas hasta el dolor, entonces uno encuentra su dorado y maravilloso hilo de Ariadna'<br><i>Cyrano</i>",
          img: "../img/avatar.jpg"
        },
        {
          id: "11",
          block: "playground",
          title: "Playground",
          subtitle: "",
          text: "",
          img: "../img/bg1.jpg"
        },
        {
          id: "12",
          block: "artwork",
          title: "Artwork",
          subtitle: "Paintings",
          text: "Obra plástica",
          img: "../img/bg5.jpg"
        },
        {
          id: "13",
          block: "about",
          title: "Noelia Requena",
          subtitle: "pagina about me...",
          text: "xxxx",
          img: "../img/bg4.jpg"
        }
      ];

    const slides = [
      {
        id: 0,
        href: "../img/bg6.jpg",
        text:
          "'cuando uno toma conciencia del misterio de la existencia y no lo entiende, pero por pura sinceridad y coherencia interior necesita respuestas hasta el dolor, entonces uno encuentra su dorado y maravilloso hilo de Ariadna' <br> __Cyrano"
      },
      {
        id: 1,
        href: "../img/bg2.jpg",
        text:
          "El cuerpo es un templo de tensiones. Un templo hermético, abierto y cerrado al mismo tiempo."
      },
      {
        id: 2,
        href: "../img/bg3.jpg",
        text:
          "La orfebrería del óleo lo captura como a un insecto la resina. Congelado pero todavía palpitando. Anhelo cifrado como un enigma de muchas dimensiones."
      },
      {
        id: 3,
        href: "../img/bg4.jpg",
        text:
          "La existencia se desnuda como una pregunta en el vacío, derramándose sobre el aire de la mañana, reflejándose en la luz que entra por la ventana. Y en este marco, en este espacio, celebramos el misterio de la vida."
      }
    ];

    /* src/components/generic/Cover.svelte generated by Svelte v3.32.1 */

    const file = "src/components/generic/Cover.svelte";

    function create_fragment$1(ctx) {
    	let scrolling = false;

    	let clear_scrolling = () => {
    		scrolling = false;
    	};

    	let scrolling_timeout;
    	let header;
    	let h1;
    	let t0;
    	let t1;
    	let br;
    	let t2;
    	let span;
    	let h2;
    	let t3;
    	let t4;
    	let p;
    	let t5;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[8]);
    	add_render_callback(/*onwindowscroll*/ ctx[9]);

    	const block = {
    		c: function create() {
    			header = element("header");
    			h1 = element("h1");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			span = element("span");
    			h2 = element("h2");
    			t3 = text(/*subtitle*/ ctx[1]);
    			t4 = space();
    			p = element("p");
    			t5 = text(/*text*/ ctx[2]);
    			attr_dev(br, "class", "svelte-tk2eis");
    			add_location(br, file, 378, 16, 6358);
    			attr_dev(h2, "class", "CoverSubTitle svelte-tk2eis");
    			add_location(h2, file, 380, 12, 6390);
    			attr_dev(span, "class", "svelte-tk2eis");
    			add_location(span, file, 379, 8, 6371);
    			attr_dev(h1, "class", "CoverTitle svelte-tk2eis");
    			add_location(h1, file, 377, 4, 6318);
    			attr_dev(p, "class", "CoverText svelte-tk2eis");
    			add_location(p, file, 383, 4, 6464);
    			attr_dev(header, "class", "Cover svelte-tk2eis");
    			set_style(header, "background-image", "url(" + /*img*/ ctx[3] + ")");
    			set_style(header, "background-size", /*topescroll*/ ctx[7] + "vw");
    			set_style(header, "opacity", 1 - Math.max(0, /*scrollY*/ ctx[5] / (/*innerHeight*/ ctx[4] / 2)));
    			add_location(header, file, 373, 0, 6104);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(h1, br);
    			append_dev(h1, t2);
    			append_dev(h1, span);
    			append_dev(span, h2);
    			append_dev(h2, t3);
    			append_dev(header, t4);
    			append_dev(header, p);
    			append_dev(p, t5);

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "resize", /*onwindowresize*/ ctx[8]),
    					listen_dev(window, "scroll", () => {
    						scrolling = true;
    						clearTimeout(scrolling_timeout);
    						scrolling_timeout = setTimeout(clear_scrolling, 100);
    						/*onwindowscroll*/ ctx[9]();
    					})
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*scrollY*/ 32 && !scrolling) {
    				scrolling = true;
    				clearTimeout(scrolling_timeout);
    				scrollTo(window.pageXOffset, /*scrollY*/ ctx[5]);
    				scrolling_timeout = setTimeout(clear_scrolling, 100);
    			}

    			if (dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);
    			if (dirty & /*subtitle*/ 2) set_data_dev(t3, /*subtitle*/ ctx[1]);
    			if (dirty & /*text*/ 4) set_data_dev(t5, /*text*/ ctx[2]);

    			if (dirty & /*img*/ 8) {
    				set_style(header, "background-image", "url(" + /*img*/ ctx[3] + ")");
    			}

    			if (dirty & /*topescroll*/ 128) {
    				set_style(header, "background-size", /*topescroll*/ ctx[7] + "vw");
    			}

    			if (dirty & /*scrollY, innerHeight*/ 48) {
    				set_style(header, "opacity", 1 - Math.max(0, /*scrollY*/ ctx[5] / (/*innerHeight*/ ctx[4] / 2)));
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Cover", slots, []);
    	let { title = "" } = $$props;
    	let { subtitle = "" } = $$props;
    	let { text = "" } = $$props;
    	let { img = "" } = $$props;
    	let innerWidth, innerHeight, scrollY, alphascroll, topescroll;
    	const writable_props = ["title", "subtitle", "text", "img"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Cover> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(6, innerWidth = window.innerWidth);
    		$$invalidate(4, innerHeight = window.innerHeight);
    	}

    	function onwindowscroll() {
    		$$invalidate(5, scrollY = window.pageYOffset);
    	}

    	$$self.$$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("subtitle" in $$props) $$invalidate(1, subtitle = $$props.subtitle);
    		if ("text" in $$props) $$invalidate(2, text = $$props.text);
    		if ("img" in $$props) $$invalidate(3, img = $$props.img);
    	};

    	$$self.$capture_state = () => ({
    		title,
    		subtitle,
    		text,
    		img,
    		innerWidth,
    		innerHeight,
    		scrollY,
    		alphascroll,
    		topescroll
    	});

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("subtitle" in $$props) $$invalidate(1, subtitle = $$props.subtitle);
    		if ("text" in $$props) $$invalidate(2, text = $$props.text);
    		if ("img" in $$props) $$invalidate(3, img = $$props.img);
    		if ("innerWidth" in $$props) $$invalidate(6, innerWidth = $$props.innerWidth);
    		if ("innerHeight" in $$props) $$invalidate(4, innerHeight = $$props.innerHeight);
    		if ("scrollY" in $$props) $$invalidate(5, scrollY = $$props.scrollY);
    		if ("alphascroll" in $$props) alphascroll = $$props.alphascroll;
    		if ("topescroll" in $$props) $$invalidate(7, topescroll = $$props.topescroll);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*scrollY, innerHeight*/ 48) {
    			if (scrollY < innerHeight / 2) {
    				$$invalidate(7, topescroll = scrollY + 150);
    			}
    		}
    	};

    	return [
    		title,
    		subtitle,
    		text,
    		img,
    		innerHeight,
    		scrollY,
    		innerWidth,
    		topescroll,
    		onwindowresize,
    		onwindowscroll
    	];
    }

    class Cover extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { title: 0, subtitle: 1, text: 2, img: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cover",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get title() {
    		throw new Error("<Cover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Cover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get subtitle() {
    		throw new Error("<Cover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subtitle(value) {
    		throw new Error("<Cover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Cover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Cover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get img() {
    		throw new Error("<Cover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set img(value) {
    		throw new Error("<Cover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function flip(node, animation, params = {}) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const scaleX = animation.from.width / node.clientWidth;
        const scaleY = animation.from.height / node.clientHeight;
        const dx = (animation.from.left - animation.to.left) / scaleX;
        const dy = (animation.from.top - animation.to.top) / scaleY;
        const d = Math.sqrt(dx * dx + dy * dy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(d) : duration,
            easing,
            css: (_t, u) => `transform: ${transform} translate(${u * dx}px, ${u * dy}px);`
        };
    }

    /* src/components/generic/Button.svelte generated by Svelte v3.32.1 */

    const file$1 = "src/components/generic/Button.svelte";

    // (414:0) {:else}
    function create_else_block$1(ctx) {
    	let button;
    	let t;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(/*text*/ ctx[0]);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*modificador*/ ctx[4][/*variante*/ ctx[3]]) + " svelte-1gpgrlf"));
    			add_location(button, file$1, 414, 4, 6503);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*text*/ 1) set_data_dev(t, /*text*/ ctx[0]);

    			if (dirty & /*variante*/ 8 && button_class_value !== (button_class_value = "" + (null_to_empty(/*modificador*/ ctx[4][/*variante*/ ctx[3]]) + " svelte-1gpgrlf"))) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(414:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (410:0) {#if url}
    function create_if_block$1(ctx) {
    	let a;
    	let t;
    	let a_class_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(/*text*/ ctx[0]);
    			attr_dev(a, "href", /*url*/ ctx[1]);
    			attr_dev(a, "target", /*target*/ ctx[2]);
    			attr_dev(a, "class", a_class_value = "" + (null_to_empty(/*modificador*/ ctx[4][/*variante*/ ctx[3]]) + " svelte-1gpgrlf"));
    			add_location(a, file$1, 410, 4, 6400);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*text*/ 1) set_data_dev(t, /*text*/ ctx[0]);

    			if (dirty & /*url*/ 2) {
    				attr_dev(a, "href", /*url*/ ctx[1]);
    			}

    			if (dirty & /*target*/ 4) {
    				attr_dev(a, "target", /*target*/ ctx[2]);
    			}

    			if (dirty & /*variante*/ 8 && a_class_value !== (a_class_value = "" + (null_to_empty(/*modificador*/ ctx[4][/*variante*/ ctx[3]]) + " svelte-1gpgrlf"))) {
    				attr_dev(a, "class", a_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(410:0) {#if url}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*url*/ ctx[1]) return create_if_block$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Button", slots, []);
    	let { text = "" } = $$props;
    	let { url = "" } = $$props;
    	let { target = "_blank" } = $$props;
    	let { variante = 0 } = $$props;
    	let modificador = ["Light", "Dark", "Colored", "ColoredInvert", "UnicodeIcon"];
    	const writable_props = ["text", "url", "target", "variante"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ("text" in $$props) $$invalidate(0, text = $$props.text);
    		if ("url" in $$props) $$invalidate(1, url = $$props.url);
    		if ("target" in $$props) $$invalidate(2, target = $$props.target);
    		if ("variante" in $$props) $$invalidate(3, variante = $$props.variante);
    	};

    	$$self.$capture_state = () => ({ text, url, target, variante, modificador });

    	$$self.$inject_state = $$props => {
    		if ("text" in $$props) $$invalidate(0, text = $$props.text);
    		if ("url" in $$props) $$invalidate(1, url = $$props.url);
    		if ("target" in $$props) $$invalidate(2, target = $$props.target);
    		if ("variante" in $$props) $$invalidate(3, variante = $$props.variante);
    		if ("modificador" in $$props) $$invalidate(4, modificador = $$props.modificador);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text, url, target, variante, modificador, click_handler];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { text: 0, url: 1, target: 2, variante: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get text() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get target() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set target(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get variante() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set variante(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/generic/Slider/Slider.svelte generated by Svelte v3.32.1 */

    const file$2 = "src/components/generic/Slider/Slider.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (37:8) {#each slides as slide (slide.id)}
    function create_each_block(key_1, ctx) {
    	let article;
    	let h2;
    	let raw_value = /*slide*/ ctx[5].text + "";
    	let t;
    	let article_id_value;
    	let rect;
    	let stop_animation = noop;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			article = element("article");
    			h2 = element("h2");
    			t = space();
    			attr_dev(h2, "class", "Caption svelte-1crsyrj");
    			add_location(h2, file$2, 46, 16, 1582);
    			attr_dev(article, "class", "Slide svelte-1crsyrj");
    			attr_dev(article, "id", article_id_value = /*slide*/ ctx[5].id);
    			set_style(article, "background-image", "url(" + /*slide*/ ctx[5].href + ")");
    			set_style(article, "width", /*ancho_slides*/ ctx[1] + "px");
    			add_location(article, file$2, 37, 12, 1320);
    			this.first = article;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, h2);
    			h2.innerHTML = raw_value;
    			append_dev(article, t);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*slides*/ 1 && raw_value !== (raw_value = /*slide*/ ctx[5].text + "")) h2.innerHTML = raw_value;
    			if (dirty & /*slides*/ 1 && article_id_value !== (article_id_value = /*slide*/ ctx[5].id)) {
    				attr_dev(article, "id", article_id_value);
    			}

    			if (dirty & /*slides*/ 1) {
    				set_style(article, "background-image", "url(" + /*slide*/ ctx[5].href + ")");
    			}

    			if (dirty & /*ancho_slides*/ 2) {
    				set_style(article, "width", /*ancho_slides*/ ctx[1] + "px");
    			}
    		},
    		r: function measure() {
    			rect = article.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(article);
    			stop_animation();
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(article, rect, flip, { duration: /*speed*/ ctx[2] });
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(37:8) {#each slides as slide (slide.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let main;
    	let section;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t;
    	let nav;
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[4]);
    	let each_value = /*slides*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*slide*/ ctx[5].id;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	button = new Button({
    			props: { variante: 4, text: "➥" },
    			$$inline: true
    		});

    	button.$on("click", /*rotateLeft*/ ctx[3]);

    	const block = {
    		c: function create() {
    			main = element("main");
    			section = element("section");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			nav = element("nav");
    			create_component(button.$$.fragment);
    			attr_dev(section, "class", "SlidesGroup svelte-1crsyrj");
    			add_location(section, file$2, 35, 4, 1235);
    			attr_dev(nav, "class", "SliderNav svelte-1crsyrj");
    			add_location(nav, file$2, 52, 4, 1722);
    			attr_dev(main, "class", "SliderContainer svelte-1crsyrj");
    			add_location(main, file$2, 34, 0, 1200);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, section);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section, null);
    			}

    			append_dev(main, t);
    			append_dev(main, nav);
    			mount_component(button, nav, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "resize", /*onwindowresize*/ ctx[4]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*slides, ancho_slides*/ 3) {
    				each_value = /*slides*/ ctx[0];
    				validate_each_argument(each_value);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, section, fix_and_destroy_block, create_each_block, null, get_each_context);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			destroy_component(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Slider", slots, []);
    	let { slides } = $$props;
    	let speed = 500;
    	let ancho_slides;

    	const rotateLeft = () => {
    		// const elemento_movido = slides[slides.length - 1]; // coge ultimo elemento
    		// document.getElementById(elemento_movido.id).style.opacity = "0";
    		$$invalidate(0, slides = [slides[slides.length - 1], ...slides.slice(0, slides.length - 1)]);
    	}; // setTimeout( () => {
    	//     document.getElementById(elemento_movido.id).style.opacity = "1"
    	// }, speed);

    	const writable_props = ["slides"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Slider> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(1, ancho_slides = window.innerWidth);
    	}

    	$$self.$$set = $$props => {
    		if ("slides" in $$props) $$invalidate(0, slides = $$props.slides);
    	};

    	$$self.$capture_state = () => ({
    		flip,
    		Button,
    		slides,
    		speed,
    		ancho_slides,
    		rotateLeft
    	});

    	$$self.$inject_state = $$props => {
    		if ("slides" in $$props) $$invalidate(0, slides = $$props.slides);
    		if ("speed" in $$props) $$invalidate(2, speed = $$props.speed);
    		if ("ancho_slides" in $$props) $$invalidate(1, ancho_slides = $$props.ancho_slides);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [slides, ancho_slides, speed, rotateLeft, onwindowresize];
    }

    class Slider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { slides: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Slider",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*slides*/ ctx[0] === undefined && !("slides" in props)) {
    			console.warn("<Slider> was created without expected prop 'slides'");
    		}
    	}

    	get slides() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set slides(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* src/_Layout.svelte generated by Svelte v3.32.1 */
    const file$3 = "src/_Layout.svelte";

    function create_fragment$4(ctx) {
    	let main;
    	let main_intro;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (default_slot) default_slot.c();
    			attr_dev(main, "id", /*id*/ ctx[0]);
    			add_location(main, file$3, 9, 0, 155);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);

    			if (default_slot) {
    				default_slot.m(main, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 2) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[1], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*id*/ 1) {
    				attr_dev(main, "id", /*id*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			if (!main_intro) {
    				add_render_callback(() => {
    					main_intro = create_in_transition(main, fade, { duration: 500 });
    					main_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Layout", slots, ['default']);
    	let { id } = $$props;
    	const writable_props = ["id"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Layout> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("id" in $$props) $$invalidate(0, id = $$props.id);
    		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ fade, id });

    	$$self.$inject_state = $$props => {
    		if ("id" in $$props) $$invalidate(0, id = $$props.id);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, $$scope, slots];
    }

    class Layout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { id: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Layout",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[0] === undefined && !("id" in props)) {
    			console.warn("<Layout> was created without expected prop 'id'");
    		}
    	}

    	get id() {
    		throw new Error("<Layout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Layout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // List of nodes to update
    const nodes = [];

    // Current location
    let location$1;

    // Function that updates all nodes marking the active ones
    function checkActive(el) {
        const matchesLocation = el.pattern.test(location$1);
        toggleClasses(el, el.className, matchesLocation);
        toggleClasses(el, el.inactiveClassName, !matchesLocation);
    }

    function toggleClasses(el, className, shouldAdd) {
        (className || '').split(' ').forEach((cls) => {
            if (!cls) {
                return
            }
            // Remove the class firsts
            el.node.classList.remove(cls);

            // If the pattern doesn't match, then set the class
            if (shouldAdd) {
                el.node.classList.add(cls);
            }
        });
    }

    // Listen to changes in the location
    loc.subscribe((value) => {
        // Update the location
        location$1 = value.location + (value.querystring ? '?' + value.querystring : '');

        // Update all nodes
        nodes.map(checkActive);
    });

    /**
     * @typedef {Object} ActiveOptions
     * @property {string|RegExp} [path] - Path expression that makes the link active when matched (must start with '/' or '*'); default is the link's href
     * @property {string} [className] - CSS class to apply to the element when active; default value is "active"
     */

    /**
     * Svelte Action for automatically adding the "active" class to elements (links, or any other DOM element) when the current location matches a certain path.
     * 
     * @param {HTMLElement} node - The target node (automatically set by Svelte)
     * @param {ActiveOptions|string|RegExp} [opts] - Can be an object of type ActiveOptions, or a string (or regular expressions) representing ActiveOptions.path.
     * @returns {{destroy: function(): void}} Destroy function
     */
    function active$1(node, opts) {
        // Check options
        if (opts && (typeof opts == 'string' || (typeof opts == 'object' && opts instanceof RegExp))) {
            // Interpret strings and regular expressions as opts.path
            opts = {
                path: opts
            };
        }
        else {
            // Ensure opts is a dictionary
            opts = opts || {};
        }

        // Path defaults to link target
        if (!opts.path && node.hasAttribute('href')) {
            opts.path = node.getAttribute('href');
            if (opts.path && opts.path.length > 1 && opts.path.charAt(0) == '#') {
                opts.path = opts.path.substring(1);
            }
        }

        // Default class name
        if (!opts.className) {
            opts.className = 'active';
        }

        // If path is a string, it must start with '/' or '*'
        if (!opts.path || 
            typeof opts.path == 'string' && (opts.path.length < 1 || (opts.path.charAt(0) != '/' && opts.path.charAt(0) != '*'))
        ) {
            throw Error('Invalid value for "path" argument')
        }

        // If path is not a regular expression already, make it
        const {pattern} = typeof opts.path == 'string' ?
            regexparam(opts.path) :
            {pattern: opts.path};

        // Add the node to the list
        const el = {
            node,
            className: opts.className,
            inactiveClassName: opts.inactiveClassName,
            pattern
        };
        nodes.push(el);

        // Trigger the action right away
        checkActive(el);

        return {
            // When the element is destroyed, remove it from the list
            destroy() {
                nodes.splice(nodes.indexOf(el), 1);
            }
        }
    }

    /* src/components/generic/navsecondary/NavSecondary.svelte generated by Svelte v3.32.1 */
    const file$4 = "src/components/generic/navsecondary/NavSecondary.svelte";

    function create_fragment$5(ctx) {
    	let nav;
    	let a0;
    	let h20;
    	let t1;
    	let p0;
    	let t3;
    	let a1;
    	let h21;
    	let t5;
    	let p1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			a0 = element("a");
    			h20 = element("h2");
    			h20.textContent = "Obra plástica";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Artwork";
    			t3 = space();
    			a1 = element("a");
    			h21 = element("h2");
    			h21.textContent = "Biografía";
    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "Biography";
    			attr_dev(h20, "class", "svelte-o96gjh");
    			add_location(h20, file$4, 9, 8, 293);
    			attr_dev(p0, "class", "svelte-o96gjh");
    			add_location(p0, file$4, 10, 8, 324);
    			attr_dev(a0, "href", "/artwork");
    			attr_dev(a0, "class", "svelte-o96gjh");
    			add_location(a0, file$4, 8, 4, 245);
    			attr_dev(h21, "class", "svelte-o96gjh");
    			add_location(h21, file$4, 13, 8, 398);
    			attr_dev(p1, "class", "svelte-o96gjh");
    			add_location(p1, file$4, 14, 8, 425);
    			attr_dev(a1, "href", "/about");
    			attr_dev(a1, "class", "svelte-o96gjh");
    			add_location(a1, file$4, 12, 4, 352);
    			attr_dev(nav, "class", "svelte-o96gjh");
    			add_location(nav, file$4, 6, 0, 158);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, a0);
    			append_dev(a0, h20);
    			append_dev(a0, t1);
    			append_dev(a0, p0);
    			append_dev(nav, t3);
    			append_dev(nav, a1);
    			append_dev(a1, h21);
    			append_dev(a1, t5);
    			append_dev(a1, p1);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(link.call(null, a0)),
    					action_destroyer(active$1.call(null, a0)),
    					action_destroyer(link.call(null, a1)),
    					action_destroyer(active$1.call(null, a1))
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("NavSecondary", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<NavSecondary> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ link, active: active$1 });
    	return [];
    }

    class NavSecondary extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavSecondary",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/components/generic/BannerTexto.svelte generated by Svelte v3.32.1 */

    const file$5 = "src/components/generic/BannerTexto.svelte";

    function create_fragment$6(ctx) {
    	let section;
    	let img_1;
    	let img_1_src_value;
    	let t0;
    	let h2;
    	let t1;
    	let t2;
    	let br;
    	let t3;
    	let span;
    	let t4;
    	let p0;
    	let t6;
    	let h30;
    	let t8;
    	let p1;
    	let t10;
    	let h31;
    	let t12;
    	let p2;
    	let t14;
    	let h32;
    	let t16;
    	let p3;
    	let t18;
    	let h33;
    	let t20;
    	let p4;
    	let t22;
    	let h34;
    	let t24;
    	let p5;
    	let t26;
    	let p6;
    	let t28;
    	let h35;
    	let t30;
    	let p7;
    	let t32;
    	let h36;
    	let t34;
    	let p8;
    	let t36;
    	let h37;
    	let t38;
    	let p9;
    	let t40;
    	let p10;
    	let t42;
    	let p11;

    	const block = {
    		c: function create() {
    			section = element("section");
    			img_1 = element("img");
    			t0 = space();
    			h2 = element("h2");
    			t1 = text(/*header*/ ctx[0]);
    			t2 = space();
    			br = element("br");
    			t3 = space();
    			span = element("span");
    			t4 = space();
    			p0 = element("p");
    			p0.textContent = "Nací en Vic (Barcelona) en 1976.";
    			t6 = space();
    			h30 = element("h3");
    			h30.textContent = "1985-1991";
    			t8 = space();
    			p1 = element("p");
    			p1.textContent = "Durante mi infancia me formé en la Escola de dibuix i art Masferrer de Vic con los profesores Pere Isern Puntí, Eduard Xandri Calvet, Lluis Bres Oliva, Lluis Gros Pujol…";
    			t10 = space();
    			h31 = element("h3");
    			h31.textContent = "1994-1995";
    			t12 = space();
    			p2 = element("p");
    			p2.textContent = "Estudié en Escola d´arts aplicades i oficis artistics de Vic.";
    			t14 = space();
    			h32 = element("h3");
    			h32.textContent = "1997-2001";
    			t16 = space();
    			p3 = element("p");
    			p3.textContent = "Estudié el grado de Diseño de Moda en Escola Superior de Disseny Bau de Barcelona.";
    			t18 = text(" \n\n    ");
    			h33 = element("h3");
    			h33.textContent = "2000-2001";
    			t20 = space();
    			p4 = element("p");
    			p4.textContent = "Taller de sombrerería  en Barcelona  con Nina Pawloswsky.";
    			t22 = space();
    			h34 = element("h3");
    			h34.textContent = "1999 -2004";
    			t24 = space();
    			p5 = element("p");
    			p5.textContent = "Empiezo a trabajar para la marca de moda para mujer Gimenez&Zuazo y su otra marca Boba by G&Z, con distribución en el mercado nacional e internacional en 250 puntos de venta canal multi marca en España, Francia, Italia, Japón...";
    			t26 = space();
    			p6 = element("p");
    			p6.textContent = "Bajo la dirección de los socios, co-dirijo el departamento de diseño. Me encargaba de todo el proceso de diseño y las ilustraciones, desarrollo de las colecciones, búsqueda de referencias y tendencias, diseño, elaboración y supervisión de fichas técnicas, coordinación con el equipo de patronaje, manejo de fornituras y materiales, coordinación con las empresas de estampación y producción.";
    			t28 = text("  \n\n    ");
    			h35 = element("h3");
    			h35.textContent = "2004-2010";
    			t30 = space();
    			p7 = element("p");
    			p7.textContent = "Directora creativa y socia fundadora de la marca de moda para mujer Obvia: desarrollo de la idea de negocio, dirección de la compañía con un equipo de personas, codirección del departamento de diseño, directora de producción, dirección de ventas. Distribución en el mercado nacional con puntos de venta canal multi marca en España. Fabricación de proximidad.";
    			t32 = space();
    			h36 = element("h3");
    			h36.textContent = "2010-2018";
    			t34 = space();
    			p8 = element("p");
    			p8.textContent = "Freelance Textile Graphic Designer. Diseñadora de estampados para mujer, hombre, niñ@s  en Padma Diseño S.L., Zara, Pull&Bear, Bershka, Mango, Replay, Springfield, Blue Inc., Studio F Women / STF Group Colombia…";
    			t36 = space();
    			h37 = element("h3");
    			h37.textContent = "2019";
    			t38 = space();
    			p9 = element("p");
    			p9.textContent = "Decido dejar el mundo de la moda y de la ilustración para empezar a buscar una expresión más íntima.";
    			t40 = space();
    			p10 = element("p");
    			p10.textContent = "Paralelamente a mi actividad profesional mantengo una formación continua en el mundo del arte, con incursiones en diversas técnicas como esmalte, cerámica, escultura, pintura al óleo, arte para niños, libros de artista, así como astrología y educación activa.";
    			t42 = space();
    			p11 = element("p");
    			p11.textContent = "Actualmente soy madre de dos hijos y, buscando formas alternativas de vida y educación, me trasladé en 2014 a un pequeño pueblo del Alt Penedès rodeado de viñedos y naturaleza.";
    			attr_dev(img_1, "class", "Avatar svelte-db3zld");
    			if (img_1.src !== (img_1_src_value = /*img*/ ctx[2])) attr_dev(img_1, "src", img_1_src_value);
    			attr_dev(img_1, "alt", "");
    			add_location(img_1, file$5, 345, 4, 5410);
    			attr_dev(br, "class", "svelte-db3zld");
    			add_location(br, file$5, 347, 17, 5500);
    			attr_dev(span, "class", "BannerTextoText svelte-db3zld");
    			add_location(span, file$5, 348, 8, 5513);
    			attr_dev(h2, "class", "BannerTextoHeader svelte-db3zld");
    			add_location(h2, file$5, 346, 4, 5452);
    			attr_dev(p0, "class", "svelte-db3zld");
    			add_location(p0, file$5, 350, 4, 5578);
    			attr_dev(h30, "class", "svelte-db3zld");
    			add_location(h30, file$5, 354, 4, 5637);
    			attr_dev(p1, "class", "svelte-db3zld");
    			add_location(p1, file$5, 355, 4, 5661);
    			attr_dev(h31, "class", "svelte-db3zld");
    			add_location(h31, file$5, 357, 4, 5843);
    			attr_dev(p2, "class", "svelte-db3zld");
    			add_location(p2, file$5, 357, 23, 5862);
    			attr_dev(h32, "class", "svelte-db3zld");
    			add_location(h32, file$5, 359, 4, 5936);
    			attr_dev(p3, "class", "svelte-db3zld");
    			add_location(p3, file$5, 359, 23, 5955);
    			attr_dev(h33, "class", "svelte-db3zld");
    			add_location(h33, file$5, 361, 4, 6051);
    			attr_dev(p4, "class", "svelte-db3zld");
    			add_location(p4, file$5, 361, 23, 6070);
    			attr_dev(h34, "class", "svelte-db3zld");
    			add_location(h34, file$5, 363, 4, 6140);
    			attr_dev(p5, "class", "svelte-db3zld");
    			add_location(p5, file$5, 363, 24, 6160);
    			attr_dev(p6, "class", "svelte-db3zld");
    			add_location(p6, file$5, 364, 4, 6400);
    			attr_dev(h35, "class", "svelte-db3zld");
    			add_location(h35, file$5, 366, 4, 6805);
    			attr_dev(p7, "class", "svelte-db3zld");
    			add_location(p7, file$5, 366, 23, 6824);
    			attr_dev(h36, "class", "svelte-db3zld");
    			add_location(h36, file$5, 368, 4, 7195);
    			attr_dev(p8, "class", "svelte-db3zld");
    			add_location(p8, file$5, 368, 23, 7214);
    			attr_dev(h37, "class", "svelte-db3zld");
    			add_location(h37, file$5, 370, 4, 7438);
    			attr_dev(p9, "class", "svelte-db3zld");
    			add_location(p9, file$5, 370, 18, 7452);
    			attr_dev(p10, "class", "svelte-db3zld");
    			add_location(p10, file$5, 372, 4, 7565);
    			attr_dev(p11, "class", "svelte-db3zld");
    			add_location(p11, file$5, 374, 4, 7837);
    			attr_dev(section, "class", "BannerTexto svelte-db3zld");
    			add_location(section, file$5, 344, 0, 5376);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, img_1);
    			append_dev(section, t0);
    			append_dev(section, h2);
    			append_dev(h2, t1);
    			append_dev(h2, t2);
    			append_dev(h2, br);
    			append_dev(h2, t3);
    			append_dev(h2, span);
    			span.innerHTML = /*texto*/ ctx[1];
    			append_dev(section, t4);
    			append_dev(section, p0);
    			append_dev(section, t6);
    			append_dev(section, h30);
    			append_dev(section, t8);
    			append_dev(section, p1);
    			append_dev(section, t10);
    			append_dev(section, h31);
    			append_dev(section, t12);
    			append_dev(section, p2);
    			append_dev(section, t14);
    			append_dev(section, h32);
    			append_dev(section, t16);
    			append_dev(section, p3);
    			append_dev(section, t18);
    			append_dev(section, h33);
    			append_dev(section, t20);
    			append_dev(section, p4);
    			append_dev(section, t22);
    			append_dev(section, h34);
    			append_dev(section, t24);
    			append_dev(section, p5);
    			append_dev(section, t26);
    			append_dev(section, p6);
    			append_dev(section, t28);
    			append_dev(section, h35);
    			append_dev(section, t30);
    			append_dev(section, p7);
    			append_dev(section, t32);
    			append_dev(section, h36);
    			append_dev(section, t34);
    			append_dev(section, p8);
    			append_dev(section, t36);
    			append_dev(section, h37);
    			append_dev(section, t38);
    			append_dev(section, p9);
    			append_dev(section, t40);
    			append_dev(section, p10);
    			append_dev(section, t42);
    			append_dev(section, p11);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*img*/ 4 && img_1.src !== (img_1_src_value = /*img*/ ctx[2])) {
    				attr_dev(img_1, "src", img_1_src_value);
    			}

    			if (dirty & /*header*/ 1) set_data_dev(t1, /*header*/ ctx[0]);
    			if (dirty & /*texto*/ 2) span.innerHTML = /*texto*/ ctx[1];		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("BannerTexto", slots, []);
    	let { header = "" } = $$props;
    	let { texto = "" } = $$props;
    	let { img = "" } = $$props;
    	const writable_props = ["header", "texto", "img"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<BannerTexto> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("header" in $$props) $$invalidate(0, header = $$props.header);
    		if ("texto" in $$props) $$invalidate(1, texto = $$props.texto);
    		if ("img" in $$props) $$invalidate(2, img = $$props.img);
    	};

    	$$self.$capture_state = () => ({ header, texto, img });

    	$$self.$inject_state = $$props => {
    		if ("header" in $$props) $$invalidate(0, header = $$props.header);
    		if ("texto" in $$props) $$invalidate(1, texto = $$props.texto);
    		if ("img" in $$props) $$invalidate(2, img = $$props.img);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [header, texto, img];
    }

    class BannerTexto extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { header: 0, texto: 1, img: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BannerTexto",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get header() {
    		throw new Error("<BannerTexto>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set header(value) {
    		throw new Error("<BannerTexto>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get texto() {
    		throw new Error("<BannerTexto>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set texto(value) {
    		throw new Error("<BannerTexto>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get img() {
    		throw new Error("<BannerTexto>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set img(value) {
    		throw new Error("<BannerTexto>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/Home.svelte generated by Svelte v3.32.1 */

    // (18:0) <Layout id={current_page_name}>
    function create_default_slot(ctx) {
    	let cover;
    	let t0;
    	let navsecondary;
    	let t1;
    	let slider;
    	let current;

    	cover = new Cover({
    			props: {
    				title: data[0].title,
    				subtitle: data[0].subtitle,
    				text: data[0].text,
    				img: data[0].img
    			},
    			$$inline: true
    		});

    	navsecondary = new NavSecondary({ $$inline: true });
    	slider = new Slider({ props: { slides }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(cover.$$.fragment);
    			t0 = space();
    			create_component(navsecondary.$$.fragment);
    			t1 = space();
    			create_component(slider.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cover, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(navsecondary, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(slider, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cover.$$.fragment, local);
    			transition_in(navsecondary.$$.fragment, local);
    			transition_in(slider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cover.$$.fragment, local);
    			transition_out(navsecondary.$$.fragment, local);
    			transition_out(slider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cover, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(navsecondary, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(slider, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(18:0) <Layout id={current_page_name}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let title_value;
    	let t;
    	let layout;
    	let current;
    	document.title = title_value = "Noelia Requena - " + /*current_page_name*/ ctx[0];

    	layout = new Layout({
    			props: {
    				id: /*current_page_name*/ ctx[0],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t = space();
    			create_component(layout.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			mount_component(layout, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*current_page_name*/ 1) && title_value !== (title_value = "Noelia Requena - " + /*current_page_name*/ ctx[0])) {
    				document.title = title_value;
    			}

    			const layout_changes = {};
    			if (dirty & /*current_page_name*/ 1) layout_changes.id = /*current_page_name*/ ctx[0];

    			if (dirty & /*$$scope*/ 2) {
    				layout_changes.$$scope = { dirty, ctx };
    			}

    			layout.$set(layout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			destroy_component(layout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Home", slots, []);
    	let { current_page_name = "home" } = $$props;
    	const writable_props = ["current_page_name"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("current_page_name" in $$props) $$invalidate(0, current_page_name = $$props.current_page_name);
    	};

    	$$self.$capture_state = () => ({
    		data,
    		slides,
    		Cover,
    		Slider,
    		Layout,
    		NavSecondary,
    		BannerTexto,
    		Button,
    		current_page_name
    	});

    	$$self.$inject_state = $$props => {
    		if ("current_page_name" in $$props) $$invalidate(0, current_page_name = $$props.current_page_name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [current_page_name];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { current_page_name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get current_page_name() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set current_page_name(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/generic/SectionHalf.svelte generated by Svelte v3.32.1 */

    const file$6 = "src/components/generic/SectionHalf.svelte";
    const get_hasSVG_slot_changes = dirty => ({});
    const get_hasSVG_slot_context = ctx => ({});
    const get_hasvideo_slot_changes = dirty => ({});
    const get_hasvideo_slot_context = ctx => ({});
    const get_hasimage_slot_changes = dirty => ({});
    const get_hasimage_slot_context = ctx => ({});

    // (11:8) {#if img}
    function create_if_block$2(ctx) {
    	let current;
    	const hasimage_slot_template = /*#slots*/ ctx[6].hasimage;
    	const hasimage_slot = create_slot(hasimage_slot_template, ctx, /*$$scope*/ ctx[5], get_hasimage_slot_context);
    	const hasimage_slot_or_fallback = hasimage_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			if (hasimage_slot_or_fallback) hasimage_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (hasimage_slot_or_fallback) {
    				hasimage_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (hasimage_slot) {
    				if (hasimage_slot.p && dirty & /*$$scope*/ 32) {
    					update_slot(hasimage_slot, hasimage_slot_template, ctx, /*$$scope*/ ctx[5], dirty, get_hasimage_slot_changes, get_hasimage_slot_context);
    				}
    			} else {
    				if (hasimage_slot_or_fallback && hasimage_slot_or_fallback.p && dirty & /*img*/ 4) {
    					hasimage_slot_or_fallback.p(ctx, dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(hasimage_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hasimage_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (hasimage_slot_or_fallback) hasimage_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(11:8) {#if img}",
    		ctx
    	});

    	return block;
    }

    // (12:34)                  
    function fallback_block(ctx) {
    	let img_1;
    	let img_1_src_value;

    	const block = {
    		c: function create() {
    			img_1 = element("img");
    			if (img_1.src !== (img_1_src_value = /*img*/ ctx[2])) attr_dev(img_1, "src", img_1_src_value);
    			attr_dev(img_1, "alt", "Imagen");
    			attr_dev(img_1, "class", "svelte-1mp771b");
    			add_location(img_1, file$6, 12, 16, 342);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img_1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*img*/ 4 && img_1.src !== (img_1_src_value = /*img*/ ctx[2])) {
    				attr_dev(img_1, "src", img_1_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(12:34)                  ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let section;
    	let div0;
    	let t0;
    	let t1;
    	let t2;
    	let div1;
    	let h2;
    	let t3;
    	let t4;
    	let p;
    	let t5;
    	let section_class_value;
    	let current;
    	let if_block = /*img*/ ctx[2] && create_if_block$2(ctx);
    	const hasvideo_slot_template = /*#slots*/ ctx[6].hasvideo;
    	const hasvideo_slot = create_slot(hasvideo_slot_template, ctx, /*$$scope*/ ctx[5], get_hasvideo_slot_context);
    	const hasSVG_slot_template = /*#slots*/ ctx[6].hasSVG;
    	const hasSVG_slot = create_slot(hasSVG_slot_template, ctx, /*$$scope*/ ctx[5], get_hasSVG_slot_context);
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			section = element("section");
    			div0 = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			if (hasvideo_slot) hasvideo_slot.c();
    			t1 = space();
    			if (hasSVG_slot) hasSVG_slot.c();
    			t2 = space();
    			div1 = element("div");
    			h2 = element("h2");
    			t3 = text(/*title*/ ctx[0]);
    			t4 = space();
    			p = element("p");
    			t5 = space();
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "BannerMedia svelte-1mp771b");
    			add_location(div0, file$6, 9, 4, 247);
    			attr_dev(h2, "class", "svelte-1mp771b");
    			add_location(h2, file$6, 20, 8, 535);
    			attr_dev(p, "class", "svelte-1mp771b");
    			add_location(p, file$6, 21, 8, 560);
    			attr_dev(div1, "class", "SectionHalfText svelte-1mp771b");
    			add_location(div1, file$6, 19, 4, 497);
    			attr_dev(section, "class", section_class_value = "SectionHalf " + /*modificador*/ ctx[4][/*variante*/ ctx[3]] + " svelte-1mp771b");
    			add_location(section, file$6, 8, 0, 189);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			if (if_block) if_block.m(div0, null);
    			append_dev(div0, t0);

    			if (hasvideo_slot) {
    				hasvideo_slot.m(div0, null);
    			}

    			append_dev(div0, t1);

    			if (hasSVG_slot) {
    				hasSVG_slot.m(div0, null);
    			}

    			append_dev(section, t2);
    			append_dev(section, div1);
    			append_dev(div1, h2);
    			append_dev(h2, t3);
    			append_dev(div1, t4);
    			append_dev(div1, p);
    			p.innerHTML = /*text*/ ctx[1];
    			append_dev(div1, t5);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*img*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*img*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div0, t0);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (hasvideo_slot) {
    				if (hasvideo_slot.p && dirty & /*$$scope*/ 32) {
    					update_slot(hasvideo_slot, hasvideo_slot_template, ctx, /*$$scope*/ ctx[5], dirty, get_hasvideo_slot_changes, get_hasvideo_slot_context);
    				}
    			}

    			if (hasSVG_slot) {
    				if (hasSVG_slot.p && dirty & /*$$scope*/ 32) {
    					update_slot(hasSVG_slot, hasSVG_slot_template, ctx, /*$$scope*/ ctx[5], dirty, get_hasSVG_slot_changes, get_hasSVG_slot_context);
    				}
    			}

    			if (!current || dirty & /*title*/ 1) set_data_dev(t3, /*title*/ ctx[0]);
    			if (!current || dirty & /*text*/ 2) p.innerHTML = /*text*/ ctx[1];
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 32) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[5], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*variante*/ 8 && section_class_value !== (section_class_value = "SectionHalf " + /*modificador*/ ctx[4][/*variante*/ ctx[3]] + " svelte-1mp771b")) {
    				attr_dev(section, "class", section_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(hasvideo_slot, local);
    			transition_in(hasSVG_slot, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(hasvideo_slot, local);
    			transition_out(hasSVG_slot, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (if_block) if_block.d();
    			if (hasvideo_slot) hasvideo_slot.d(detaching);
    			if (hasSVG_slot) hasSVG_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SectionHalf", slots, ['hasimage','hasvideo','hasSVG','default']);
    	let { title = "" } = $$props;
    	let { text = "" } = $$props;
    	let { img = "" } = $$props;
    	let { variante = 0 } = $$props;
    	let modificador = ["Light", "Dark", "Colored", "Light2"];
    	const writable_props = ["title", "text", "img", "variante"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SectionHalf> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("text" in $$props) $$invalidate(1, text = $$props.text);
    		if ("img" in $$props) $$invalidate(2, img = $$props.img);
    		if ("variante" in $$props) $$invalidate(3, variante = $$props.variante);
    		if ("$$scope" in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ title, text, img, variante, modificador });

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("text" in $$props) $$invalidate(1, text = $$props.text);
    		if ("img" in $$props) $$invalidate(2, img = $$props.img);
    		if ("variante" in $$props) $$invalidate(3, variante = $$props.variante);
    		if ("modificador" in $$props) $$invalidate(4, modificador = $$props.modificador);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, text, img, variante, modificador, $$scope, slots];
    }

    class SectionHalf extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { title: 0, text: 1, img: 2, variante: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SectionHalf",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get title() {
    		throw new Error("<SectionHalf>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<SectionHalf>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<SectionHalf>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<SectionHalf>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get img() {
    		throw new Error("<SectionHalf>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set img(value) {
    		throw new Error("<SectionHalf>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get variante() {
    		throw new Error("<SectionHalf>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set variante(value) {
    		throw new Error("<SectionHalf>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/About.svelte generated by Svelte v3.32.1 */

    // (24:4) <SectionHalf         variante={1}         title={data[4].title}         text={data[4].subtitle}         img={data[4].img}     >
    function create_default_slot_1(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				variante: 0,
    				text: data[4].buttontext,
    				url: data[4].buttonurl
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(24:4) <SectionHalf         variante={1}         title={data[4].title}         text={data[4].subtitle}         img={data[4].img}     >",
    		ctx
    	});

    	return block;
    }

    // (18:0) <Layout id={current_page_name}>
    function create_default_slot$1(ctx) {
    	let bannertexto;
    	let t;
    	let sectionhalf;
    	let current;

    	bannertexto = new BannerTexto({
    			props: {
    				header: data[10].title,
    				texto: data[10].subtitle,
    				img: data[10].img
    			},
    			$$inline: true
    		});

    	sectionhalf = new SectionHalf({
    			props: {
    				variante: 1,
    				title: data[4].title,
    				text: data[4].subtitle,
    				img: data[4].img,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(bannertexto.$$.fragment);
    			t = space();
    			create_component(sectionhalf.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(bannertexto, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(sectionhalf, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sectionhalf_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				sectionhalf_changes.$$scope = { dirty, ctx };
    			}

    			sectionhalf.$set(sectionhalf_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(bannertexto.$$.fragment, local);
    			transition_in(sectionhalf.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(bannertexto.$$.fragment, local);
    			transition_out(sectionhalf.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(bannertexto, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(sectionhalf, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(18:0) <Layout id={current_page_name}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let title_value;
    	let t;
    	let layout;
    	let current;
    	document.title = title_value = "Noelia Requena - " + /*current_page_name*/ ctx[0];

    	layout = new Layout({
    			props: {
    				id: /*current_page_name*/ ctx[0],
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t = space();
    			create_component(layout.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			mount_component(layout, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*current_page_name*/ 1) && title_value !== (title_value = "Noelia Requena - " + /*current_page_name*/ ctx[0])) {
    				document.title = title_value;
    			}

    			const layout_changes = {};
    			if (dirty & /*current_page_name*/ 1) layout_changes.id = /*current_page_name*/ ctx[0];

    			if (dirty & /*$$scope*/ 2) {
    				layout_changes.$$scope = { dirty, ctx };
    			}

    			layout.$set(layout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			destroy_component(layout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("About", slots, []);
    	let { current_page_name = "about" } = $$props;
    	const writable_props = ["current_page_name"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("current_page_name" in $$props) $$invalidate(0, current_page_name = $$props.current_page_name);
    	};

    	$$self.$capture_state = () => ({
    		data,
    		BannerTexto,
    		Button,
    		SectionHalf,
    		Layout,
    		current_page_name
    	});

    	$$self.$inject_state = $$props => {
    		if ("current_page_name" in $$props) $$invalidate(0, current_page_name = $$props.current_page_name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [current_page_name];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { current_page_name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get current_page_name() {
    		throw new Error("<About>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set current_page_name(value) {
    		throw new Error("<About>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    let productos = [
        {
          "id": 1,
          "referencia": "042019",
          "title": "Sin título",
          "description": "42x29.5cm",
          "imagen": "img/obra/img1.jpg",
          "thumb": "img/obra/img1.jpg"
        },
        {
          "id": 2,
          "referencia": "042020",
          "title": "Sin título",
          "description": "31x23cm",
          "imagen": "img/obra/img2.jpg",
          "thumb": "img/obra/img2.jpg"
        },
        {
          "id": 3,
          "referencia": "042021",
          "title": "Sin título",
          "description": "31x23cm",
          "imagen": "img/obra/img3.jpg",
          "thumb": "img/obra/img3.jpg"
        },
        {
          "id": 4,
          "referencia": "042022(repetido???)",
          "title": "Sin título",
          "description": "31x21cm",
          "imagen": "img/obra/img4.jpg",
          "thumb": "img/obra/img4.jpg"
        },
        {
          "id": 5,
          "referencia": "042022",
          "title": "Sin título",
          "description": "61x50cm",
          "imagen": "img/obra/img5.jpg",
          "thumb": "img/obra/img5.jpg"
        },
        {
          "id": 6,
          "referencia": "042023",
          "title": "Sin título",
          "description": "41x33cm",
          "imagen": "img/obra/img6.jpg",
          "thumb": "img/obra/img6.jpg"
        },
        {
          "id": 7,
          "referencia": "????????",
          "title": "Sin título",
          "description": "--",
          "imagen": "img/obra/img7.jpg",
          "thumb": "img/obra/img7.jpg"
        },
        {
          "id": 8,
          "referencia": "042024",
          "title": "Sin título",
          "description": "50x50cm",
          "imagen": "img/obra/img8.jpg",
          "thumb": "img/obra/img8.jpg"
        },
        {
          "id": 9,
          "referencia": "042025",
          "title": "Sin título",
          "description": "100x100cm",
          "imagen": "img/obra/img9.jpg",
          "thumb": "img/obra/img9.jpg"
        },
        {
          "id": 10,
          "referencia": "042026",
          "title": "Sin título",
          "description": "no tengo el dato????",
          "imagen": "img/obra/img10.jpg",
          "thumb": "img/obra/img10.jpg"
        },
        {
          "id": 11,
          "referencia": "042027",
          "title": "Sin título",
          "description": "??????????",
          "imagen": "img/obra/img11.jpg",
          "thumb": "img/obra/img11.jpg"
        },
        {
          "id": 12,
          "referencia": "042028",
          "title": "Sin título",
          "description": "80x65cm",
          "imagen": "img/obra/img12.jpg",
          "thumb": "img/obra/img12.jpg"
        },
        {
          "id": 13,
          "referencia": "042029",
          "title": "Sin título",
          "description": "73x55cm",
          "imagen": "img/obra/img13.jpg",
          "thumb": "img/obra/img13.jpg"
        },
        {
          "id": 14,
          "referencia": "042030",
          "title": "Sin título",
          "description": "92x73cm",
          "imagen": "img/obra/img14.jpg",
          "thumb": "img/obra/img14.jpg"
        },
        {
          "id": 15,
          "referencia": "042031",
          "title": "Sin título",
          "description": "92x73cm",
          "imagen": "img/obra/img15.jpg",
          "thumb": "img/obra/img15.jpg"
        },
        {
          "id": 16,
          "referencia": "042032",
          "title": "Sin título",
          "description": "81x116cm",
          "imagen": "img/obra/img16.jpg",
          "thumb": "img/obra/img16.jpg"
        },
        {
          "id": 17,
          "referencia": "??????????",
          "title": "Sin título",
          "description": "???????",
          "imagen": "img/obra/img17.jpg",
          "thumb": "img/obra/img17.jpg"
        },
        {
          "id": 18,
          "referencia": "042033",
          "title": "Sin título",
          "description": "116x81cm",
          "imagen": "img/obra/img18.jpg",
          "thumb": "img/obra/img18.jpg"
        },
        {
          "id": 19,
          "referencia": "042034",
          "title": "Sin título",
          "description": "100x100cm",
          "imagen": "img/obra/img19.jpg",
          "thumb": "img/obra/img19.jpg"
        },
        {
          "id": 20,
          "referencia": "042035",
          "title": "Sin título",
          "description": "100x100cm",
          "imagen": "img/obra/img20.jpg",
          "thumb": "img/obra/img20.jpg"
        },
        {
          "id": 21,
          "referencia": "042036",
          "title": "Sin título",
          "description": "????????",
          "imagen": "img/obra/img21.jpg",
          "thumb": "img/obra/img21.jpg"
        },
        {
          "id": 22,
          "referencia": "042038",
          "title": "Sin título",
          "description": "100x40cm.",
          "imagen": "img/obra/img22.jpg",
          "thumb": "img/obra/img22.jpg"
        },
        {
          "id": 23,
          "referencia": "042039",
          "title": "Sin título",
          "description": "58x44cm.",
          "imagen": "img/obra/img23.jpg",
          "thumb": "img/obra/img23.jpg"
        },
        {
          "id": 24,
          "referencia": "042040",
          "title": "Sin título",
          "description": "122x60.5cm.",
          "imagen": "img/obra/img24.jpg",
          "thumb": "img/obra/img24.jpg"
        },
        {
          "id": 25,
          "referencia": "042041",
          "title": "Sin título",
          "description": "90x73cm.",
          "imagen": "img/obra/img25.jpg",
          "thumb": "img/obra/img25.jpg"
        },
        {
          "id": 26,
          "referencia": "042042",
          "title": "Sin título",
          "description": "100x100cm.",
          "imagen": "img/obra/img26.jpg",
          "thumb": "img/obra/img26.jpg"
        },
        {
          "id": 27,
          "referencia": "042043",
          "title": "Sin título",
          "description": "120x80cm.",
          "imagen": "img/obra/img27.jpg",
          "thumb": "img/obra/img27.jpg"
        },
        {
          "id": 28,
          "referencia": "042044",
          "title": "Sin título",
          "description": "120x80cm.",
          "imagen": "img/obra/img28.jpg",
          "thumb": "img/obra/img28.jpg"
        },
        {
          "id": 29,
          "referencia": "042037",
          "title": "Sin título",
          "description": "122x60.5cm",
          "imagen": "img/obra/img29.jpg",
          "thumb": "img/obra/img29.jpg"
        }
    ];

    const intersectionObserver = new IntersectionObserver( (entries) => {
            entries.forEach( entry => {
                const eventName = entry.isIntersecting ? "enterViewport" : "exitViewport";
                entry.target.dispatchEvent( new CustomEvent(eventName));
            });
        }
    );
    function viewport(element) {
        intersectionObserver.observe(element);
        return {
            destroy() {
                intersectionObserver.unobserve(element);
            }
        }
    }

    /* src/components/particular/ProductGallery/ProductItem.svelte generated by Svelte v3.32.1 */

    const { console: console_1$1 } = globals;
    const file$7 = "src/components/particular/ProductGallery/ProductItem.svelte";

    // (31:8) {#if active}
    function create_if_block$3(ctx) {
    	let figcaption;
    	let h3;
    	let t0;
    	let t1;
    	let p;
    	let t2;
    	let t3;
    	let br;
    	let span;
    	let t4;
    	let t5;

    	const block = {
    		c: function create() {
    			figcaption = element("figcaption");
    			h3 = element("h3");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			p = element("p");
    			t2 = text(/*description*/ ctx[1]);
    			t3 = space();
    			br = element("br");
    			span = element("span");
    			t4 = text("Ref: ");
    			t5 = text(/*referencia*/ ctx[3]);
    			attr_dev(h3, "class", "svelte-2ia692");
    			add_location(h3, file$7, 32, 16, 975);
    			attr_dev(br, "class", "svelte-2ia692");
    			add_location(br, file$7, 33, 33, 1025);
    			attr_dev(span, "class", "svelte-2ia692");
    			add_location(span, file$7, 33, 39, 1031);
    			attr_dev(p, "class", "svelte-2ia692");
    			add_location(p, file$7, 33, 16, 1008);
    			attr_dev(figcaption, "class", "svelte-2ia692");
    			add_location(figcaption, file$7, 31, 12, 946);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, figcaption, anchor);
    			append_dev(figcaption, h3);
    			append_dev(h3, t0);
    			append_dev(figcaption, t1);
    			append_dev(figcaption, p);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(p, br);
    			append_dev(p, span);
    			append_dev(span, t4);
    			append_dev(span, t5);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);
    			if (dirty & /*description*/ 2) set_data_dev(t2, /*description*/ ctx[1]);
    			if (dirty & /*referencia*/ 8) set_data_dev(t5, /*referencia*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(figcaption);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(31:8) {#if active}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let article;
    	let figure;
    	let img;
    	let img_src_value;
    	let t0;
    	let h2;
    	let t1_value = (/*active*/ ctx[5] ? "-" : "+") + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;
    	let if_block = /*active*/ ctx[5] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			article = element("article");
    			figure = element("figure");
    			img = element("img");
    			t0 = space();
    			h2 = element("h2");
    			t1 = text(t1_value);
    			t2 = space();
    			if (if_block) if_block.c();
    			if (img.src !== (img_src_value = "../" + /*imagen*/ ctx[2])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*title*/ ctx[0]);
    			attr_dev(img, "class", "Obra svelte-2ia692");
    			attr_dev(img, "id", /*id*/ ctx[4]);
    			add_location(img, file$7, 28, 8, 819);
    			attr_dev(h2, "class", "svelte-2ia692");
    			add_location(h2, file$7, 29, 8, 883);
    			attr_dev(figure, "class", "svelte-2ia692");
    			add_location(figure, file$7, 27, 4, 775);
    			set_style(article, "opacity", /*opacity_effect*/ ctx[6]);
    			set_style(article, "transition", "all 0.3s ease-out");
    			set_style(article, "transform", "translateX(" + /*transform_effect*/ ctx[7] + "rem)");
    			attr_dev(article, "class", "svelte-2ia692");
    			add_location(article, file$7, 18, 0, 447);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, figure);
    			append_dev(figure, img);
    			append_dev(figure, t0);
    			append_dev(figure, h2);
    			append_dev(h2, t1);
    			append_dev(figure, t2);
    			if (if_block) if_block.m(figure, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(figure, "click", /*showDescription*/ ctx[8], false, false, false),
    					action_destroyer(viewport.call(null, article)),
    					listen_dev(article, "enterViewport", /*enterViewport_handler*/ ctx[9], false, false, false),
    					listen_dev(article, "exitViewport", /*exitViewport_handler*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*imagen*/ 4 && img.src !== (img_src_value = "../" + /*imagen*/ ctx[2])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*title*/ 1) {
    				attr_dev(img, "alt", /*title*/ ctx[0]);
    			}

    			if (dirty & /*id*/ 16) {
    				attr_dev(img, "id", /*id*/ ctx[4]);
    			}

    			if (dirty & /*active*/ 32 && t1_value !== (t1_value = (/*active*/ ctx[5] ? "-" : "+") + "")) set_data_dev(t1, t1_value);

    			if (/*active*/ ctx[5]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(figure, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*opacity_effect*/ 64) {
    				set_style(article, "opacity", /*opacity_effect*/ ctx[6]);
    			}

    			if (dirty & /*transform_effect*/ 128) {
    				set_style(article, "transform", "translateX(" + /*transform_effect*/ ctx[7] + "rem)");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ProductItem", slots, []);
    	let { title } = $$props;
    	let { description } = $$props;
    	let { imagen } = $$props;
    	let { referencia } = $$props;
    	let { id } = $$props;
    	let active = false;
    	let opacity_effect; //efecto de use function on enter viewport
    	let transform_effect; //efecto de use function on enter viewport

    	const showDescription = e => {
    		$$invalidate(5, active = !active);
    		console.log(e.target);
    	};

    	const writable_props = ["title", "description", "imagen", "referencia", "id"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<ProductItem> was created with unknown prop '${key}'`);
    	});

    	const enterViewport_handler = () => {
    		$$invalidate(6, opacity_effect = 1);
    		$$invalidate(7, transform_effect = 0);
    	};

    	const exitViewport_handler = () => {
    		$$invalidate(6, opacity_effect = 0);
    		$$invalidate(7, transform_effect = -10);
    	};

    	$$self.$$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("description" in $$props) $$invalidate(1, description = $$props.description);
    		if ("imagen" in $$props) $$invalidate(2, imagen = $$props.imagen);
    		if ("referencia" in $$props) $$invalidate(3, referencia = $$props.referencia);
    		if ("id" in $$props) $$invalidate(4, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({
    		viewport,
    		title,
    		description,
    		imagen,
    		referencia,
    		id,
    		active,
    		opacity_effect,
    		transform_effect,
    		showDescription
    	});

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("description" in $$props) $$invalidate(1, description = $$props.description);
    		if ("imagen" in $$props) $$invalidate(2, imagen = $$props.imagen);
    		if ("referencia" in $$props) $$invalidate(3, referencia = $$props.referencia);
    		if ("id" in $$props) $$invalidate(4, id = $$props.id);
    		if ("active" in $$props) $$invalidate(5, active = $$props.active);
    		if ("opacity_effect" in $$props) $$invalidate(6, opacity_effect = $$props.opacity_effect);
    		if ("transform_effect" in $$props) $$invalidate(7, transform_effect = $$props.transform_effect);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		title,
    		description,
    		imagen,
    		referencia,
    		id,
    		active,
    		opacity_effect,
    		transform_effect,
    		showDescription,
    		enterViewport_handler,
    		exitViewport_handler
    	];
    }

    class ProductItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			title: 0,
    			description: 1,
    			imagen: 2,
    			referencia: 3,
    			id: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProductItem",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !("title" in props)) {
    			console_1$1.warn("<ProductItem> was created without expected prop 'title'");
    		}

    		if (/*description*/ ctx[1] === undefined && !("description" in props)) {
    			console_1$1.warn("<ProductItem> was created without expected prop 'description'");
    		}

    		if (/*imagen*/ ctx[2] === undefined && !("imagen" in props)) {
    			console_1$1.warn("<ProductItem> was created without expected prop 'imagen'");
    		}

    		if (/*referencia*/ ctx[3] === undefined && !("referencia" in props)) {
    			console_1$1.warn("<ProductItem> was created without expected prop 'referencia'");
    		}

    		if (/*id*/ ctx[4] === undefined && !("id" in props)) {
    			console_1$1.warn("<ProductItem> was created without expected prop 'id'");
    		}
    	}

    	get title() {
    		throw new Error("<ProductItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ProductItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<ProductItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<ProductItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imagen() {
    		throw new Error("<ProductItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imagen(value) {
    		throw new Error("<ProductItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get referencia() {
    		throw new Error("<ProductItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set referencia(value) {
    		throw new Error("<ProductItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<ProductItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<ProductItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/particular/ProductGallery/ProductGallery.svelte generated by Svelte v3.32.1 */
    const file$8 = "src/components/particular/ProductGallery/ProductGallery.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (365:4) {#each productos as producto, i}
    function create_each_block$1(ctx) {
    	let productitem;
    	let current;

    	productitem = new ProductItem({
    			props: {
    				title: /*producto*/ ctx[4].title,
    				description: /*producto*/ ctx[4].description,
    				imagen: /*producto*/ ctx[4].imagen,
    				referencia: /*producto*/ ctx[4].referencia,
    				id: /*i*/ ctx[6]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(productitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(productitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const productitem_changes = {};
    			if (dirty & /*productos*/ 1) productitem_changes.title = /*producto*/ ctx[4].title;
    			if (dirty & /*productos*/ 1) productitem_changes.description = /*producto*/ ctx[4].description;
    			if (dirty & /*productos*/ 1) productitem_changes.imagen = /*producto*/ ctx[4].imagen;
    			if (dirty & /*productos*/ 1) productitem_changes.referencia = /*producto*/ ctx[4].referencia;
    			productitem.$set(productitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(productitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(productitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(productitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(365:4) {#each productos as producto, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let section;
    	let h2;
    	let t0;
    	let t1;
    	let p;
    	let t2;
    	let br0;
    	let t3;
    	let br1;
    	let t4;
    	let i;
    	let t5;
    	let t6;
    	let t7;
    	let div;
    	let current;
    	let each_value = /*productos*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			section = element("section");
    			h2 = element("h2");
    			t0 = text(/*titulo*/ ctx[1]);
    			t1 = space();
    			p = element("p");
    			t2 = text("\"Un cuerpo en el espacio. Un temblor en el tiempo. Un proceso de luz y sombra. El cuerpo se desvela deconstruyéndose, desmoronándose. La cristalización espontánea de una dinámica de contrastes. Claroscuro de fragilidad y fortaleza, de frío y calor. El cuerpo es un templo de tensiones. Un templo hermético, abierto y cerrado al mismo tiempo. Tan sólo puede existir en una lógica de membranas. Atravesado por la luz, reflejado como la sombra nerviosa de algo más. La orfebrería del óleo lo captura como a un insecto la resina. Congelado pero todavía palpitando. Anhelo cifrado como un enigma de muchas dimensiones. El trazo, grácil y preciso (caligrafía de misterios), deshilvana el misterio inagotable de la belleza. Hilo de Ariadna enredado. Oficio de tinieblas. Belleza del horror y horror de la belleza. Necesitamos el contraste. El equilibrio en la contradicción. Siempre el claroscuro...");
    			br0 = element("br");
    			t3 = text("\n\n        Como en la técnica japonesa kintsugi, el barniz de la pintura repara las fracturas de la cerámica rota que es el cuerpo. Hay una belleza en la fractura, como un signo latente de su vida interior: vórtice de una herida que se despliega en el exterior. La tela recubre la forma como a una gasa el molde. La piel como impasto. La vida como un continuo instante de incertidumbre. ¿Somos libres o estamos encerrados, confinados en las coordenadas del azar? Este es el misterio de un cuerpo en una habitación, de un cuerpo habitando el espacio, de un cuerpo siendo espacio. La existencia se desnuda como una pregunta en el vacío, derramándose sobre el aire de la mañana, reflejándose en la luz que entra por la ventana. Y en este marco, en este espacio, celebramos el misterio de la vida.\"");
    			br1 = element("br");
    			t4 = space();
    			i = element("i");
    			t5 = text("-- ");
    			t6 = text(/*author_review*/ ctx[2]);
    			t7 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h2, "class", "svelte-1reu6kh");
    			add_location(h2, file$8, 354, 4, 5616);
    			attr_dev(br0, "class", "svelte-1reu6kh");
    			add_location(br0, file$8, 356, 900, 6542);
    			attr_dev(br1, "class", "svelte-1reu6kh");
    			add_location(br1, file$8, 358, 791, 7339);
    			attr_dev(i, "class", "svelte-1reu6kh");
    			add_location(i, file$8, 359, 8, 7352);
    			attr_dev(p, "class", "svelte-1reu6kh");
    			add_location(p, file$8, 355, 4, 5638);
    			attr_dev(div, "class", "ObrasContainer svelte-1reu6kh");
    			add_location(div, file$8, 363, 4, 7426);
    			attr_dev(section, "class", "LayoutObras svelte-1reu6kh");
    			add_location(section, file$8, 352, 0, 5577);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h2);
    			append_dev(h2, t0);
    			append_dev(section, t1);
    			append_dev(section, p);
    			append_dev(p, t2);
    			append_dev(p, br0);
    			append_dev(p, t3);
    			append_dev(p, br1);
    			append_dev(p, t4);
    			append_dev(p, i);
    			append_dev(i, t5);
    			append_dev(i, t6);
    			append_dev(section, t7);
    			append_dev(section, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*titulo*/ 2) set_data_dev(t0, /*titulo*/ ctx[1]);
    			if (!current || dirty & /*author_review*/ 4) set_data_dev(t6, /*author_review*/ ctx[2]);

    			if (dirty & /*productos*/ 1) {
    				each_value = /*productos*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ProductGallery", slots, []);
    	let { productos = [] } = $$props;
    	let { titulo = "" } = $$props;
    	let { texto = "" } = $$props;
    	let { author_review = "" } = $$props;
    	const writable_props = ["productos", "titulo", "texto", "author_review"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ProductGallery> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("productos" in $$props) $$invalidate(0, productos = $$props.productos);
    		if ("titulo" in $$props) $$invalidate(1, titulo = $$props.titulo);
    		if ("texto" in $$props) $$invalidate(3, texto = $$props.texto);
    		if ("author_review" in $$props) $$invalidate(2, author_review = $$props.author_review);
    	};

    	$$self.$capture_state = () => ({
    		ProductItem,
    		productos,
    		titulo,
    		texto,
    		author_review
    	});

    	$$self.$inject_state = $$props => {
    		if ("productos" in $$props) $$invalidate(0, productos = $$props.productos);
    		if ("titulo" in $$props) $$invalidate(1, titulo = $$props.titulo);
    		if ("texto" in $$props) $$invalidate(3, texto = $$props.texto);
    		if ("author_review" in $$props) $$invalidate(2, author_review = $$props.author_review);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [productos, titulo, author_review, texto];
    }

    class ProductGallery extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			productos: 0,
    			titulo: 1,
    			texto: 3,
    			author_review: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProductGallery",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get productos() {
    		throw new Error("<ProductGallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set productos(value) {
    		throw new Error("<ProductGallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titulo() {
    		throw new Error("<ProductGallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titulo(value) {
    		throw new Error("<ProductGallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get texto() {
    		throw new Error("<ProductGallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set texto(value) {
    		throw new Error("<ProductGallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get author_review() {
    		throw new Error("<ProductGallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set author_review(value) {
    		throw new Error("<ProductGallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/Artwork.svelte generated by Svelte v3.32.1 */

    const { console: console_1$2 } = globals;

    // (42:4) <SectionHalf         variante={1}         title={data[4].title}         text={data[4].subtitle}         img={data[4].img}     >
    function create_default_slot_1$1(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				variante: 0,
    				text: data[4].buttontext,
    				url: data[4].buttonurl
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(42:4) <SectionHalf         variante={1}         title={data[4].title}         text={data[4].subtitle}         img={data[4].img}     >",
    		ctx
    	});

    	return block;
    }

    // (26:0) <Layout id={current_page_name}>
    function create_default_slot$2(ctx) {
    	let cover;
    	let t0;
    	let productgallery;
    	let t1;
    	let sectionhalf;
    	let current;

    	cover = new Cover({
    			props: {
    				title: data[12].title,
    				subtitle: data[12].subtitle,
    				text: data[12].text,
    				img: data[12].img
    			},
    			$$inline: true
    		});

    	productgallery = new ProductGallery({
    			props: {
    				titulo: data[3].title,
    				texto: data[3].subtitle,
    				author_review: data[3].author_review,
    				productos
    			},
    			$$inline: true
    		});

    	sectionhalf = new SectionHalf({
    			props: {
    				variante: 1,
    				title: data[4].title,
    				text: data[4].subtitle,
    				img: data[4].img,
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cover.$$.fragment);
    			t0 = space();
    			create_component(productgallery.$$.fragment);
    			t1 = space();
    			create_component(sectionhalf.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cover, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(productgallery, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(sectionhalf, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sectionhalf_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				sectionhalf_changes.$$scope = { dirty, ctx };
    			}

    			sectionhalf.$set(sectionhalf_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cover.$$.fragment, local);
    			transition_in(productgallery.$$.fragment, local);
    			transition_in(sectionhalf.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cover.$$.fragment, local);
    			transition_out(productgallery.$$.fragment, local);
    			transition_out(sectionhalf.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cover, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(productgallery, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(sectionhalf, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(26:0) <Layout id={current_page_name}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let title_value;
    	let t0;
    	let layout;
    	let t1;
    	let current;
    	document.title = title_value = "Noelia Requena - " + /*current_page_name*/ ctx[0];

    	layout = new Layout({
    			props: {
    				id: /*current_page_name*/ ctx[0],
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			t0 = space();
    			create_component(layout.$$.fragment);
    			t1 = space();
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			mount_component(layout, target, anchor);
    			insert_dev(target, t1, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*current_page_name*/ 1) && title_value !== (title_value = "Noelia Requena - " + /*current_page_name*/ ctx[0])) {
    				document.title = title_value;
    			}

    			const layout_changes = {};
    			if (dirty & /*current_page_name*/ 1) layout_changes.id = /*current_page_name*/ ctx[0];

    			if (dirty & /*$$scope*/ 4) {
    				layout_changes.$$scope = { dirty, ctx };
    			}

    			layout.$set(layout_changes);

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[2], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layout.$$.fragment, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layout.$$.fragment, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			destroy_component(layout, detaching);
    			if (detaching) detach_dev(t1);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Artwork", slots, ['default']);
    	let { current_page_name = "artwork" } = $$props;

    	onMount(() => {
    		console.log("MOUNTED COMPONENT");
    	});

    	onDestroy(() => {
    		console.log("DESTROYED COMPONENT");
    	});

    	const writable_props = ["current_page_name"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<Artwork> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("current_page_name" in $$props) $$invalidate(0, current_page_name = $$props.current_page_name);
    		if ("$$scope" in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		data,
    		productos,
    		Layout,
    		ProductGallery,
    		Cover,
    		SectionHalf,
    		Button,
    		current_page_name
    	});

    	$$self.$inject_state = $$props => {
    		if ("current_page_name" in $$props) $$invalidate(0, current_page_name = $$props.current_page_name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [current_page_name, slots, $$scope];
    }

    class Artwork extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { current_page_name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Artwork",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get current_page_name() {
    		throw new Error("<Artwork>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set current_page_name(value) {
    		throw new Error("<Artwork>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/PageNotExists.svelte generated by Svelte v3.32.1 */

    const file$9 = "src/pages/PageNotExists.svelte";

    function create_fragment$d(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Page not found!!";
    			add_location(h1, file$9, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("PageNotExists", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<PageNotExists> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class PageNotExists extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PageNotExists",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    // Import the wrap method

    const routes = {
    	'/': Home,
    	'/about': About,
    	'/artwork': Artwork,
    	// '/artwork/:id': Artwork,
    	'*': PageNotExists
    };

    /** Dispatch event on click outside of node */
    function clickOutside(node) {
      
        const handleClick = event => {
          if (node && !node.contains(event.target) && !event.defaultPrevented) {
            node.dispatchEvent(
              new CustomEvent('click_outside', node)
            );
          }
        };
      
          document.addEventListener('click', handleClick, true);
        
        return {
          destroy() {
            document.removeEventListener('click', handleClick, true);
          }
          }
      }

    /* src/components/generic/SiteLogo.svelte generated by Svelte v3.32.1 */

    const file$a = "src/components/generic/SiteLogo.svelte";

    function create_fragment$e(ctx) {
    	let svg;
    	let g2;
    	let circle0;
    	let g0;
    	let circle1;
    	let circle2;
    	let g1;
    	let circle3;
    	let circle4;
    	let circle5;
    	let circle6;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g2 = svg_element("g");
    			circle0 = svg_element("circle");
    			g0 = svg_element("g");
    			circle1 = svg_element("circle");
    			circle2 = svg_element("circle");
    			g1 = svg_element("g");
    			circle3 = svg_element("circle");
    			circle4 = svg_element("circle");
    			circle5 = svg_element("circle");
    			circle6 = svg_element("circle");
    			attr_dev(circle0, "cx", "25");
    			attr_dev(circle0, "cy", "25");
    			attr_dev(circle0, "r", "25");
    			attr_dev(circle0, "class", "svelte-rzt5ab");
    			add_location(circle0, file$a, 327, 8, 4989);
    			attr_dev(circle1, "cx", "12.5");
    			attr_dev(circle1, "cy", "25");
    			attr_dev(circle1, "r", "12.5");
    			attr_dev(circle1, "class", "svelte-rzt5ab");
    			add_location(circle1, file$a, 329, 12, 5047);
    			attr_dev(circle2, "cx", "38");
    			attr_dev(circle2, "cy", "25");
    			attr_dev(circle2, "r", "12.5");
    			attr_dev(circle2, "class", "svelte-rzt5ab");
    			add_location(circle2, file$a, 330, 12, 5097);
    			attr_dev(g0, "class", "svelte-rzt5ab");
    			add_location(g0, file$a, 328, 8, 5031);
    			attr_dev(circle3, "cx", "6.5");
    			attr_dev(circle3, "cy", "25");
    			attr_dev(circle3, "r", "6.25");
    			attr_dev(circle3, "class", "svelte-rzt5ab");
    			add_location(circle3, file$a, 333, 12, 5170);
    			attr_dev(circle4, "cx", "19");
    			attr_dev(circle4, "cy", "25");
    			attr_dev(circle4, "r", "6.25");
    			attr_dev(circle4, "class", "svelte-rzt5ab");
    			add_location(circle4, file$a, 334, 12, 5219);
    			attr_dev(circle5, "cx", "31.5");
    			attr_dev(circle5, "cy", "25");
    			attr_dev(circle5, "r", "6.25");
    			attr_dev(circle5, "class", "svelte-rzt5ab");
    			add_location(circle5, file$a, 335, 12, 5267);
    			attr_dev(circle6, "cx", "44");
    			attr_dev(circle6, "cy", "25");
    			attr_dev(circle6, "r", "6.25");
    			attr_dev(circle6, "class", "svelte-rzt5ab");
    			add_location(circle6, file$a, 336, 12, 5317);
    			attr_dev(g1, "class", "svelte-rzt5ab");
    			add_location(g1, file$a, 332, 8, 5154);
    			attr_dev(g2, "class", "svelte-rzt5ab");
    			add_location(g2, file$a, 326, 4, 4977);
    			attr_dev(svg, "class", "logo svelte-rzt5ab");
    			attr_dev(svg, "width", "51");
    			attr_dev(svg, "height", "51");
    			add_location(svg, file$a, 325, 0, 4931);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g2);
    			append_dev(g2, circle0);
    			append_dev(g2, g0);
    			append_dev(g0, circle1);
    			append_dev(g0, circle2);
    			append_dev(g2, g1);
    			append_dev(g1, circle3);
    			append_dev(g1, circle4);
    			append_dev(g1, circle5);
    			append_dev(g1, circle6);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SiteLogo", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SiteLogo> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class SiteLogo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SiteLogo",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src/components/generic/nav/Nav.svelte generated by Svelte v3.32.1 */
    const file$b = "src/components/generic/nav/Nav.svelte";

    function create_fragment$f(ctx) {
    	let scrolling = false;

    	let clear_scrolling = () => {
    		scrolling = false;
    	};

    	let scrolling_timeout;
    	let div1;
    	let div0;
    	let sitelogo;
    	let t0;
    	let nav;
    	let a0;
    	let t2;
    	let a1;
    	let t4;
    	let a2;
    	let nav_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowscroll*/ ctx[3]);
    	sitelogo = new SiteLogo({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(sitelogo.$$.fragment);
    			t0 = space();
    			nav = element("nav");
    			a0 = element("a");
    			a0.textContent = "Home";
    			t2 = space();
    			a1 = element("a");
    			a1.textContent = "Artwork";
    			t4 = space();
    			a2 = element("a");
    			a2.textContent = "About";
    			attr_dev(div0, "class", "ButtonNav svelte-1587f2y");
    			add_location(div0, file$b, 398, 4, 6348);
    			attr_dev(a0, "class", "NavItem svelte-1587f2y");
    			attr_dev(a0, "id", "0");
    			attr_dev(a0, "role", "navigation");
    			attr_dev(a0, "href", "/");
    			toggle_class(a0, "active", active$1);
    			add_location(a0, file$b, 403, 8, 6528);
    			attr_dev(a1, "class", "NavItem svelte-1587f2y");
    			attr_dev(a1, "id", "1");
    			attr_dev(a1, "role", "navigation");
    			attr_dev(a1, "href", "/artwork");
    			add_location(a1, file$b, 413, 8, 6705);
    			attr_dev(a2, "class", "NavItem svelte-1587f2y");
    			attr_dev(a2, "id", "3");
    			attr_dev(a2, "role", "navigation");
    			attr_dev(a2, "href", "/about");
    			add_location(a2, file$b, 416, 8, 6825);

    			attr_dev(nav, "class", nav_class_value = "" + (null_to_empty(/*activemenu*/ ctx[1]
    			? "MainNav MainNavVisible"
    			: "MainNav") + " svelte-1587f2y"));

    			add_location(nav, file$b, 402, 4, 6454);
    			attr_dev(div1, "class", "svelte-1587f2y");
    			add_location(div1, file$b, 396, 0, 6285);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(sitelogo, div0, null);
    			append_dev(div1, t0);
    			append_dev(div1, nav);
    			append_dev(nav, a0);
    			append_dev(nav, t2);
    			append_dev(nav, a1);
    			append_dev(nav, t4);
    			append_dev(nav, a2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "scroll", () => {
    						scrolling = true;
    						clearTimeout(scrolling_timeout);
    						scrolling_timeout = setTimeout(clear_scrolling, 100);
    						/*onwindowscroll*/ ctx[3]();
    					}),
    					listen_dev(div0, "click", /*click_handler*/ ctx[4], false, false, false),
    					action_destroyer(link.call(null, a0)),
    					action_destroyer(active$1.call(null, a0)),
    					action_destroyer(link.call(null, a1)),
    					action_destroyer(active$1.call(null, a1)),
    					action_destroyer(link.call(null, a2)),
    					action_destroyer(active$1.call(null, a2)),
    					action_destroyer(clickOutside.call(null, div1)),
    					listen_dev(div1, "click_outside", /*contraeMainMenu*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*y*/ 1 && !scrolling) {
    				scrolling = true;
    				clearTimeout(scrolling_timeout);
    				scrollTo(window.pageXOffset, /*y*/ ctx[0]);
    				scrolling_timeout = setTimeout(clear_scrolling, 100);
    			}

    			if (!current || dirty & /*activemenu*/ 2 && nav_class_value !== (nav_class_value = "" + (null_to_empty(/*activemenu*/ ctx[1]
    			? "MainNav MainNavVisible"
    			: "MainNav") + " svelte-1587f2y"))) {
    				attr_dev(nav, "class", nav_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sitelogo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sitelogo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(sitelogo);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Nav", slots, []);
    	let currentitem, y;
    	let activemenu = false;

    	afterUpdate(() => {
    		if (y > 100 && y < 500) {
    			currentitem = "";
    		}
    	});

    	function cuandoClick(event) {
    		currentitem = event.path[0].hash;
    	}

    	function contraeMainMenu() {
    		$$invalidate(1, activemenu = false);
    	}

    	let current_page_name;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Nav> was created with unknown prop '${key}'`);
    	});

    	function onwindowscroll() {
    		$$invalidate(0, y = window.pageYOffset);
    	}

    	const click_handler = () => {
    		$$invalidate(1, activemenu = !activemenu);
    	};

    	$$self.$capture_state = () => ({
    		link,
    		active: active$1,
    		afterUpdate,
    		clickOutside,
    		SiteLogo,
    		currentitem,
    		y,
    		activemenu,
    		cuandoClick,
    		contraeMainMenu,
    		current_page_name
    	});

    	$$self.$inject_state = $$props => {
    		if ("currentitem" in $$props) currentitem = $$props.currentitem;
    		if ("y" in $$props) $$invalidate(0, y = $$props.y);
    		if ("activemenu" in $$props) $$invalidate(1, activemenu = $$props.activemenu);
    		if ("current_page_name" in $$props) current_page_name = $$props.current_page_name;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [y, activemenu, contraeMainMenu, onwindowscroll, click_handler];
    }

    class Nav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src/components/generic/Links.svelte generated by Svelte v3.32.1 */

    const file$c = "src/components/generic/Links.svelte";

    function create_fragment$g(ctx) {
    	let aside;
    	let small;
    	let t1;
    	let ul;
    	let li;
    	let a;
    	let svg;
    	let title;
    	let t2;
    	let circle;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			aside = element("aside");
    			small = element("small");
    			small.textContent = "Follow me at:";
    			t1 = space();
    			ul = element("ul");
    			li = element("li");
    			a = element("a");
    			svg = svg_element("svg");
    			title = svg_element("title");
    			t2 = text("Instagram");
    			circle = svg_element("circle");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(small, "class", "svelte-pzpkyi");
    			add_location(small, file$c, 345, 4, 5373);
    			attr_dev(title, "class", "svelte-pzpkyi");
    			add_location(title, file$c, 350, 12, 5598);
    			attr_dev(circle, "cx", "12.145");
    			attr_dev(circle, "cy", "3.892");
    			attr_dev(circle, "r", "0.96");
    			attr_dev(circle, "class", "svelte-pzpkyi");
    			add_location(circle, file$c, 351, 12, 5635);
    			attr_dev(path0, "d", "M8,12c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4S10.206,12,8,12zM8,6C6.897,6,6,6.897,6,8s0.897,2,2,2s2-0.897,2-2S9.103,6,8,6z");
    			attr_dev(path0, "class", "svelte-pzpkyi");
    			add_location(path0, file$c, 352, 12, 5690);
    			attr_dev(path1, "d", "M12,16H4c-2.056,0-4-1.944-4-4V4c0-2.056,1.944-4,4-4h8c2.056,0,4,1.944,4,4v8C16,14.056,14.056,16,12,16zM4,2C3.065,2,2,3.065,2,4v8c0,0.953,1.047,2,2,2h8c0.935,0,2-1.065,2-2V4c0-0.935-1.065-2-2-2H4z");
    			attr_dev(path1, "class", "svelte-pzpkyi");
    			add_location(path1, file$c, 353, 12, 5843);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 16 16");
    			attr_dev(svg, "class", "svelte-pzpkyi");
    			add_location(svg, file$c, 349, 10, 5525);
    			attr_dev(a, "href", "https://www.instagram.com/noelia__requena/");
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener");
    			attr_dev(a, "class", "svelte-pzpkyi");
    			add_location(a, file$c, 348, 8, 5430);
    			attr_dev(li, "class", "svelte-pzpkyi");
    			add_location(li, file$c, 347, 6, 5417);
    			attr_dev(ul, "class", "svelte-pzpkyi");
    			add_location(ul, file$c, 346, 4, 5406);
    			attr_dev(aside, "class", "Links svelte-pzpkyi");
    			add_location(aside, file$c, 344, 0, 5347);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, aside, anchor);
    			append_dev(aside, small);
    			append_dev(aside, t1);
    			append_dev(aside, ul);
    			append_dev(ul, li);
    			append_dev(li, a);
    			append_dev(a, svg);
    			append_dev(svg, title);
    			append_dev(title, t2);
    			append_dev(svg, circle);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(aside);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Links", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Links> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Links extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Links",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src/components/generic/Loading.svelte generated by Svelte v3.32.1 */

    const file$d = "src/components/generic/Loading.svelte";

    function create_fragment$h(ctx) {
    	let div;
    	let svg;
    	let circle0;
    	let circle1;
    	let circle2;
    	let circle3;
    	let circle4;
    	let circle5;
    	let circle6;
    	let text_1;
    	let t0;
    	let t1;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			circle0 = svg_element("circle");
    			circle1 = svg_element("circle");
    			circle2 = svg_element("circle");
    			circle3 = svg_element("circle");
    			circle4 = svg_element("circle");
    			circle5 = svg_element("circle");
    			circle6 = svg_element("circle");
    			text_1 = svg_element("text");
    			t0 = text("receiving data...");
    			t1 = space();
    			if (default_slot) default_slot.c();
    			attr_dev(circle0, "cx", "100");
    			attr_dev(circle0, "cy", "100");
    			attr_dev(circle0, "r", "50");
    			attr_dev(circle0, "class", "svelte-techbs");
    			add_location(circle0, file$d, 353, 8, 5514);
    			attr_dev(circle1, "cx", "62.5");
    			attr_dev(circle1, "cy", "100");
    			attr_dev(circle1, "r", "12.5");
    			attr_dev(circle1, "class", "svelte-techbs");
    			add_location(circle1, file$d, 355, 8, 5559);
    			attr_dev(circle2, "cx", "88");
    			attr_dev(circle2, "cy", "100");
    			attr_dev(circle2, "r", "12.5");
    			attr_dev(circle2, "class", "svelte-techbs");
    			add_location(circle2, file$d, 356, 8, 5606);
    			attr_dev(circle3, "cx", "112.5");
    			attr_dev(circle3, "cy", "100");
    			attr_dev(circle3, "r", "12.5");
    			attr_dev(circle3, "class", "svelte-techbs");
    			add_location(circle3, file$d, 357, 8, 5651);
    			attr_dev(circle4, "cx", "138");
    			attr_dev(circle4, "cy", "100");
    			attr_dev(circle4, "r", "12.5");
    			attr_dev(circle4, "class", "svelte-techbs");
    			add_location(circle4, file$d, 358, 8, 5699);
    			attr_dev(circle5, "cx", "75");
    			attr_dev(circle5, "cy", "100");
    			attr_dev(circle5, "r", "25");
    			attr_dev(circle5, "class", "svelte-techbs");
    			add_location(circle5, file$d, 360, 8, 5754);
    			attr_dev(circle6, "cx", "125");
    			attr_dev(circle6, "cy", "100");
    			attr_dev(circle6, "r", "25");
    			attr_dev(circle6, "class", "svelte-techbs");
    			add_location(circle6, file$d, 361, 8, 5797);
    			attr_dev(text_1, "x", "85");
    			attr_dev(text_1, "y", "230");
    			attr_dev(text_1, "class", "svelte-techbs");
    			add_location(text_1, file$d, 363, 8, 5842);
    			attr_dev(svg, "viewBox", "0 0 300 300");
    			attr_dev(svg, "class", "svelte-techbs");
    			add_location(svg, file$d, 352, 4, 5478);
    			attr_dev(div, "class", "Loading svelte-techbs");
    			add_location(div, file$d, 351, 0, 5452);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, circle0);
    			append_dev(svg, circle1);
    			append_dev(svg, circle2);
    			append_dev(svg, circle3);
    			append_dev(svg, circle4);
    			append_dev(svg, circle5);
    			append_dev(svg, circle6);
    			append_dev(svg, text_1);
    			append_dev(text_1, t0);
    			insert_dev(target, t1, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t1);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Loading", slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Loading> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Loading extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loading",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.32.1 */

    const { console: console_1$3 } = globals;
    const file$e = "src/App.svelte";

    // (363:1) {:else}
    function create_else_block$2(ctx) {
    	let loading_1;
    	let current;
    	loading_1 = new Loading({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loading_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loading_1, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loading_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(363:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (356:1) {#if loaded}
    function create_if_block$4(ctx) {
    	let nav;
    	let t0;
    	let router;
    	let t1;
    	let links;
    	let current;
    	nav = new Nav({ $$inline: true });

    	router = new Router({
    			props: { routes, restoreScrollState: true },
    			$$inline: true
    		});

    	links = new Links({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(nav.$$.fragment);
    			t0 = space();
    			create_component(router.$$.fragment);
    			t1 = space();
    			create_component(links.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(nav, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(router, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(links, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(router.$$.fragment, local);
    			transition_in(links.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(router.$$.fragment, local);
    			transition_out(links.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(nav, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(router, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(links, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(356:1) {#if loaded}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let meta0;
    	let meta1;
    	let meta2;
    	let t;
    	let main;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$4, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loaded*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			meta0 = element("meta");
    			meta1 = element("meta");
    			meta2 = element("meta");
    			t = space();
    			main = element("main");
    			if_block.c();
    			attr_dev(meta0, "property", "og:title");
    			attr_dev(meta0, "content", "Sergio Forés");
    			attr_dev(meta0, "class", "svelte-th6ip8");
    			add_location(meta0, file$e, 348, 2, 5514);
    			attr_dev(meta1, "property", "og:type");
    			attr_dev(meta1, "content", "website");
    			attr_dev(meta1, "class", "svelte-th6ip8");
    			add_location(meta1, file$e, 349, 2, 5568);
    			attr_dev(meta2, "property", "og:url");
    			attr_dev(meta2, "content", "sergiofores.es");
    			attr_dev(meta2, "class", "svelte-th6ip8");
    			add_location(meta2, file$e, 350, 2, 5616);
    			attr_dev(main, "class", "svelte-th6ip8");
    			add_location(main, file$e, 354, 0, 5720);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, meta0);
    			append_dev(document.head, meta1);
    			append_dev(document.head, meta2);
    			insert_dev(target, t, anchor);
    			insert_dev(target, main, anchor);
    			if_blocks[current_block_type_index].m(main, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "load", /*loading*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(main, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(meta0);
    			detach_dev(meta1);
    			detach_dev(meta2);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let loaded;

    	const loading = () => {
    		$$invalidate(0, loaded = true);
    	};

    	onMount(() => {
    		$$invalidate(0, loaded = false);
    	});

    	onDestroy(() => {
    		console.log("DESTROYED");
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$3.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router,
    		routes,
    		Nav,
    		Links,
    		Loading,
    		onMount,
    		onDestroy,
    		loaded,
    		loading
    	});

    	$$self.$inject_state = $$props => {
    		if ("loaded" in $$props) $$invalidate(0, loaded = $$props.loaded);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [loaded, loading];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
