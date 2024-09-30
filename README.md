
## WHAT

`data-memo` is a tiny library containing a few practical JS/TS tools for reusing data and handling array order.

The npm package can be found with: [data-memo](https://www.npmjs.com/package/data-memo). Contribute in GitHub: [koodikulma-fi/data-memo.git](https://github.com/koodikulma-fi/data-memo.git)

---

## CONTENTS

There are 3 kinds of tools available.

### [1. NUMERIC ARRAY HELPERS](#1-numeric-array-helpers-doc)
- `numberRange(start, end?, stepSize?)` helps to produce a range of numbers (whole or fractional).
- `cleanIndex(index, newCount)` helps to get a clean insertion index for adding/moving.
- `orderedIndex(order, orderOrPropIndex)` helps to get an ordered insertion index for adding.
- `orderArray(array, orderOrPropIndex)` re-orders an array in 3 categories: `>= 0`, `null|undefined`, `< 0`

### [2. DEEP DATA METHODS](#2-deep-data-methods-doc)
- Deep data methods `areEqual(a, b, level?)` and `deepCopy(anything, level?)` with custom level of depth (-1).
    * The methods support native JS Objects, Arrays, Maps, Sets and handling classes.
- And `areEqualBy(a, b, compareBy)` for objects specialized to utilizing the `CompareDataDepthEnum`.

### [3. DATA MEMO HELPERS](#3-data-memo-helpers-doc)
- `createDataTrigger` triggers a callback when reference data is changed from previous time.
- `createDataMemo` recomputes / reuses data based on arguments: if changed, calls the producer callback.
- `createDataSource` is like createDataMemo but with an extraction process before the producer callback.
- `createCachedSource` is like createDataSource but creates a new data source for each cacheKey.

---

## 1. NUMERIC ARRAY HELPERS (doc)

- The numeric array helpers (`numberRange`, `cleanIndex`, `orderedIndex`, `orderArray`) help with simple indexing needs.

### library - numeric: `numberRange`

- Creates a numeric array using start, end and stepSize.
- The form is: `numberRange(startOrEnd: number, end?: number | null, stepSize?: number | null, includeEnd?: boolean): number[]`
    * If `end` is not defined (or null), then `startOrEnd` is end and starts at 0. 
    * If `stepSize` is 0 uses 1, if negative flips the order.
    * If `includeEnd` is set to true includes it as the last value (if stepSize matches).

```typescript

// Create whole number ranges.
numberRange(3);                  // [0, 1, 2]
numberRange(-3);                 // [0, -1, -2]
numberRange(1, 3);               // [1, 2]
numberRange(3, 1);               // [3, 2]
numberRange(1, 3, 1, true);      // [1, 2, 3]
numberRange(3, 1, -1, true);     // [1, 2, 3]
numberRange(3, 1, null, true);   // [3, 2, 1]
numberRange(-1, 2);              // [-1, 0, 1]
numberRange(1, -2);              // [1, 0, -1]
numberRange(1, -2, -1);          // [-1, 0, 1]
numberRange(0, 3, -1);           // [2, 1, 0]
numberRange(3, null, -1);        // [2, 1, 0]
numberRange(-3, null, -1);       // [-2, -1, 0]

// Create fractional ranges.
numberRange(1, 2, 0.25);         // [1, 1.25, 1.5, 1.75]
numberRange(1, 2, -0.25);        // [1.75, 1.5, 1.25, 1]
numberRange(2, 1, 0.25);         // [2, 1.75, 1.5, 1.25]
numberRange(1, 2, 0.25, true);   // [1, 1.25, 1.5, 1.75, 2]
numberRange(2, 1, 0.25, true);   // [2, 1.75, 1.5, 1.25, 1]
numberRange(2, 1, -0.25, true);  // [1, 1.25, 1.5, 1.75, 2]
numberRange(1, 2, 0.33);         // [1, 1.33, 1.66, 1.99] // Or what fracts do.
numberRange(1, 2, -0.33);        // [1.99, 1.66, 1.33, 1] // Or what fracts do.
numberRange(3, null, 0.5);       // [0, 0.5, 1, 1.5, 2, 2.5]
numberRange(3, null, -0.5);      // [0, -0.5, -1, -1.5, -2, -2.5]

```

### library - numeric: `cleanIndex`

- `cleanIndex(index, newCount): number` helps to get a clean insertion index useful for moving/adding.
- The returned value is a whole number >= 0, unless newCount is 0 (or negative), then -1.
- Supports one cycle of negatives (and positives) and then clamps to the end.
- If index is `null | undefined`, then defaults to same as -1: insert as the last one.

```typescript

// Examples with a count of 3.
cleanIndex(undefined, 3); // 2
cleanIndex(null, 3);      // 2
cleanIndex(3, 3);         // 2
cleanIndex(2, 3);         // 2
cleanIndex(1, 3);         // 1
cleanIndex(0, 3);         // 0
cleanIndex(-1, 3);        // 2
cleanIndex(-2, 3);        // 1
cleanIndex(-3, 3);        // 0
cleanIndex(-4, 3);        // 0

```

### library - numeric: `orderedIndex`

- Get an insertion index using `order` in _pre-sorted_ `orderBy` array.
- The form is: `orderedIndex(order: NumberLike, orderBy: NumberLike[], orderProp?: string | number): number`, where `NumberLike` is `number | null | undefined`.
- Note. To instead re-order an array (with the same concept) use `orderArray(arr, orderOrPropIndex)`.

```typescript

// Directly.
orderedIndex(0, [0, 1, 2]);                  // 1
orderedIndex(0, [1, 2, null, -2, -1]);       // 0
orderedIndex(2, [1, 2, null, -2, -1]);       // 2
orderedIndex(-1, [1, 2, null, -2, -1]);      // -1
orderedIndex(-1.5, [1, 2, null, -2, -1]);    // 4
orderedIndex(null, [1, 2, null, -2, -1]);    // 3

// From dictionaries.
const orderByObj: { name: string; order?: number | null; }[] = [
    { name: "1st", order: 0 },
    { name: "2nd" },
    { name: "3rd", order: -1 },
];
orderedIndex(0, orderByObj, "order");         // 1
orderedIndex(null, orderByObj, "order");      // 2
orderedIndex(-1, orderByObj, "order");        // -1

// From sub array objects.
const orderByArr = [
    ["1st", 0] as const,
    ["2nd"] as const,
    ["3rd", -1] as const,
];
orderedIndex(0, orderByArr, 1);               // 1
orderedIndex(null, orderByArr, 1);            // 2
orderedIndex(-1, orderByArr, 1);              // -1

// Test typeguard.
orderedIndex(null, orderByObj, "name")  // orderByObj is red-underlined (or the method).
orderedIndex(null, orderByArr, 0)       // 0 is red-underlined (or the method).

```

### library - numeric: `orderArray`

- `orderArray` returns an ordered array using 3 level sorting: `>= 0`, `null|undefined`, `< 0`.
- The form is: `orderArray(arr: T[], orderOrPropIndex: Array<number | null | undefined> | string): T[]`
    * If orderOrPropIndex is a string or number, then reads the order from the item (in the `arr`) with it.

```typescript

// Arrays.
orderArray(["a", "b", "c"], [20, 10, 0]);             // ["c", "b", "a"]
orderArray(["a", "b", "c"], [-1, -2, -3]);            // ["c", "b", "a"]
orderArray(["a", "b", "c"], [-1, null, 0]);           // ["c", "b", "a"]
orderArray(["a", "b", "c"], [null, 0]);               // ["b", "a", "c"]
orderArray(["a", "b", "c"], [undefined, 0, null]);    // ["b", "a", "c"]
orderArray(["a", "b", "c"], [-1, 0, null]);           // ["b", "c", "a"]
orderArray(["a", "b", "c", "d"], [null, 0, -.5, -1]); // ["b", "a", "d", "c"]

// Dictionaries (with type support).
type Obj = { name: string; order?: number | null; };
const a: Obj = { name: "a", order: -1 };
const b: Obj = { name: "b", order: 0 };
const c: Obj = { name: "c" };
orderArray([a, b, c], "order") // [b, c, a]

// Sub array objects (with type support for specific index).
const d = ["d", -1] as const;
const e = ["e", 0] as const;
const f = ["f"] as const;
orderArray([d, e, f], 1) // [e, f, d]

// Test typeguard.
orderArray([a, b, c], "name")   // name is red-underlined (or the method).
orderArray([d, e, f], 0)        // 0 is red-underlined (or the method).

```

---

## 2. DEEP DATA METHODS (doc)

- The `areEqual(a, b, depth?)` and `deepCopy(anything, depth?)` compare or copy data to a level of depth.
- The `areEqualBy(a, b, compareBy)` is a helper for objects that have various sets of data to compare (with different levels of comparison).

### library - deep: `deepCopy`

- The `deepCopy(anything, depth?)` copies the data with custom level of depth.
- If depth is under 0, copies deeply. Defaults to -1.

```typescript

// Prepare.
const original = { deep: { blue: true }, simple: "yes" };

// Basic usage.
const copy1 = deepCopy(original); // Copied deeply.
const copy2 = deepCopy(original, 1); // Copied one level, so original.blue === copy.blue.
const copy3 = deepCopy(original, 0); // Did not copy, so original === copy.

// Let's check the claims about depth.
[copy1 === original, copy1.deep === original.deep] // [false, false]
[copy2 === original, copy2.deep === original.deep] // [false, true]
[copy3 === original, copy3.deep === original.deep] // [true, true]

```

### library - deep: `areEqual`

- The `areEqual(a, b, depth?)` compares data with custom level of depth.
- If depth is under 0, checks deeply. Defaults to -1.

```typescript

// Basic usage.
const test = { test: true };
areEqual(true, test); // false, clearly not equal.
areEqual(test, { test: true }); // true, contents are equal when deeply check.
areEqual(test, { test: true }, 1); // true, contents are equal when shallow checked.
areEqual(test, { test: true }, 0); // false, not identical objects.
areEqual(test, test, 0); // true, identical objects.

```

### library - deep: `areEqualBy`

- The `areEqual(a, b, compareBy)` compares data in two objects/dictionaries according to compareBy dictionary.
- The compareBy dictionary defines which properties to compare and how (using CompareDataDepthEnum).

```typescript

// Basic usage.
// .. Let's test with two equal sets of data to show case the comparison depth.
const a = { props: { deep: { test: true }, simple: false }, state: undefined };
const b = { props: { deep: { test: true }, simple: false }, state: undefined };

// Let's mirror what we do for props and state, but by using number vs. mode name.
areEqualBy(a, b, { props: 0, state: "changed" });   // false, since `a.props !== b.props`.
areEqualBy(a, b, { props: 1, state: "shallow" });   // false, since `a.props.deep !== b.props.deep` (not same obj. ref.).
areEqualBy(a, b, { props: 2, state: "double" });    // true, every nested value compared was equal.
areEqualBy(a, b, { props: -1, state: "deep" });     // true, every nested value was compared and was equal.
areEqualBy(a, b, { props: -2, state: "always" });   // false, both are "always" different - doesn't check.
areEqualBy(a, b, { props: -3, state: "never" });    // true, both are "never" different - doesn't check.

// Some tests with "never": saying that the data never changes, don't even check.
areEqualBy(a, b, { props: "changed", state: "never" });     // false, since `a.props !== b.props`.
areEqualBy(a, b, { props: "never", state: "never" });       // true, did not check either, since they "never" change.

// Of course, if one part says not equal, then doesn't matter what others say: not equal.
areEqualBy(a, b, { props: "never", state: "always" });      // false, since state is "always" different.

```

---

## 3. DATA MEMO HELPERS (doc)

- Memos, triggers and data sources are especially useful in state based refreshing systems that compare previous and next state to determine refreshing needs.
- The basic concept is to feed argument(s) to a function, who performs a comparison on them to determine whether to trigger change (= a custom callback).

### library - data: `createDataMemo`

- `createDataMemo` helps to reuse data in simple local usages. By default, it only computes the data if any of the arguments have changed.

```typescript

// Types.
type Input = { name: string; score: number; };
type Output = { winner: string | null; loser: string | null; difference: number; };

// Create a function that can be called to return updated data if arguments changed.
const onResults = createDataMemo(
    // 1st arg is the producer callback that should return the desired data.
    // .. It's only triggered when either (a, b) is changed from last time.
    (a: Input, b: Input): Output => {
        // Do something with the args.
        return a.score > b.score ? { winner: a.name, loser: b.name, difference: a.score - b.score } :
            a.score < b.score ? { winner: b.name, loser: a.name, difference: b.score - a.score } : 
            { winner: null, loser: null, difference: 0 };
    },
    // 2nd arg is optional and defines the _level of comparison_ referring to each argument.
    // .. For DataMemo it defaults to 0, meaning identity comparison on each arg: oldArg[i] !== newArg[i].
    // .. To do a deep comparison set to -1. Setting of 1 means shallow comparison (on each arg), and from there up.
    1,
);

// Use the memo.
const a = { score: 3, name: "alpha"};
const b = { score: 5, name: "beta"};
const result = onResults(a, b);         // { winner: "beta", loser: "alpha", difference: 2 }

// Show case functionality.
const result2 = onResults(a, b);        // Identical to above. (Used same args.)
const result3 = onResults(a, {...b});   // Identical to above, because of comparison depth 1.
const result4 = onResults(b, a);        // Same as above - but a new object.
const result5 = onResults(b, a);        // Identical to above (result4).
const result6 = onResults(a, b);        // Same as above - but a new object.
const result7 = onResults(a, a);        // { winner: null, loser: null, difference: 0 }
const result8 = onResults(a, a);        // Same as above - identical to result7.

// That the identity stays the same for consequent tries is useful in state based refresh flow.
result === result2      // true
result === result3      // true
result === result4      // false
result4 === result5     // true
result4 === result6     // false
result === result6      // false
result7 === result8     // true

```

### library - data: `createDataTrigger`

- `createDataTrigger` is similar to DataMemo, but its purpose is to trigger a callback on mount.
- In addition, the mount callback can return another callback for unmounting, which is called if the mount callback gets overridden upon usage (= when memory changed and a new callback was provided).

```typescript

// Create a function that can be called to trigger a callback when the reference data is changed from the last time
type Memory = { id: number; text: string; };
const myTrigger = createDataTrigger<Memory>(
    // 1st arg is an optional (but often used) _mount_ callback.
    (newMem, oldMem) => {
        // Run upon change.
        if (newMem.id !== oldMem?.id)
            console.log("Id changed!");
        // Optionally return a callback to do _unmounting_.
        return (currentMem, nextMem) => { console.log("Unmounted!"); }
    },
    // 2nd arg is optional initial memory.
    // .. Use it to delay the first triggering of the mount callback (in case the same on first usages).
    { id: 1, text: "init" },
    // 3rd arg is optional depth, defaults to 1, meaning performs shallow comparison on the memory.
    1
);

// Use the trigger.
let didChange = myTrigger({ id: 1, text: "init" });     // false, new memory and init memory have equal contents.
didChange = myTrigger({ id: 1, text: "thing" });        // true
didChange = myTrigger({ id: 2, text: "thing" });        // true, logs: "Id changed!"
didChange = myTrigger({ id: 2, text: "thing" }, true);  // true

// Change callback.
const newCallback = () => { console.log("Changes!"); };
didChange = myTrigger({ id: 2, text: "thing" }, false, newCallback); // false
didChange = myTrigger({ id: 3, text: "thing" }, false, newCallback); // true, logs: "Unmounted!" and then "Changes!".
didChange = myTrigger({ id: 3, text: "now?" });         // true, logs: "Changes!"

```

### library - data: `createDataSource`

- `createDataSource` returns a function for reusing/recomputing data.
- The function receives custom arguments and uses an extractor to produce final arguments for the producer.
- The producer is triggered if the args count or any arg has changed: `newArgs.some((v, i) !== oldArgs[i])`.
- The level of comparison can be customized by the optional 3rd argument. Defaults to 0: if any arg not identical.

```typescript

// Prepare.
type MyParams = [ colorTheme: { mode?: "light" | "dark" }, specialMode?: boolean];
type MyData = { theme: "dark" | "light"; special: boolean; }

// With pre-typing.
const mySource = (createDataSource as CreateDataSource<MyParams, MyData>)(
    // Extractor - showcases the usage for contexts.
    // .. For example, if has many usages with similar context data needs.
    (colorTheme, specialMode) => [
        colorTheme?.mode || "dark",
        specialMode || false,
    ],
    // Producer - it's only called if the extracted data items were changed from last time.
    (theme, special) => ({ theme, special }),
    // Optional depth of comparing each argument.
    // .. Defaults to 0: if any arg (or arg count) is changed, triggers the producer.
    0
);

// With manual typing.
const mySource_MANUAL = createDataSource(
    // Extractor.
    (...[colorTheme, specialMode]: MyParams) => [
        colorTheme?.mode || "dark",
        specialMode || false,
    ],
    // Producer.
    (theme, special): MyData => ({ theme, special }),
    // Optional depth.
    0
);

// Use.
const val = mySource({ mode: "dark" }, true);   // { theme: "dark", special: true }
const val2 = mySource({ mode: "dark" }, true);  // Identical to above.
console.log(val === val2); // true

// Test typing.
const val_FAIL = mySource({ mode: "FAIL" }, true); // The "FAIL" is red-underlined.
const val_MANUAL = mySource_MANUAL({ mode: "dark" }, true);
const val_MANUAL_FAIL = mySource_MANUAL({ mode: "FAIL" }, true); // The "FAIL" is red-underlined.

```

### library - data: `createCachedSource`

- `createCachedSource` is like multiple `createDataSource`s together separated by the unique cache key.
- The key key for caching is derived from an extra "cacher" function dedicated to this purpose - it should return the cache key (string).
- The cacher receives the same args as the extractor, but also the cached dictionary as an extra arg `(...args, cached) => string`.

```typescript

// Let' use the same MyData as above, but add cacheKey to args.
type MyData = { theme: "dark" | "light"; special: boolean; }
type MyCachedParams = [
    colorTheme: { mode?: "light" | "dark" },
    specialMode: boolean | undefined,
    cacheKey: string
];

// With pre-typing.
const mySource = (createCachedSource as CreateCachedSource<MyCachedParams, MyData>)(
    // Extractor.
    (colorTheme, specialMode) => [colorTheme?.mode || "dark", specialMode || false],
    // Producer.
    (theme, special) => ({ theme, special }),
    // Cache key generator.
    (_theme, _special, cacheKey) => cacheKey,
    // Optional depth. Defaults to 0: identity check on each extracted arg.
    0
);

// With manual typing. The result works just the same.
const mySource_MANUAL = createCachedSource(
    // Extractor. Let's specify MyCachedParams here, will also be use for the cacher.
    (...[colorTheme, specialMode]: MyCachedParams) => [colorTheme?.mode || "dark", specialMode || false],
    // Producer.
    (theme, special): MyData => ({ theme, special }),
    // Cache key generator.
    (_theme, _special, cacheKey) => cacheKey,
    // Optional depth.
    0
);

// Let's say state1 and state2 variants come from somewhere.
let settings1 = { mode: "dark" } as const;
let settings2 = { mode: "dark" } as const;
let special1 = true;
let special2 = false;

// Use.
let val_someKey = mySource(settings1, special1, "someKey"); // In one place.
let val_anotherKey = mySource(settings2, special2, "anotherKey"); // In another place with similar data.
// We can do it again, and the producers won't be retriggered (unlike without caching).
let val2_someKey = mySource(settings1, special1, "someKey");
let val2_anotherKey = mySource(settings2, special2, "anotherKey");
// Validate claims.
val_someKey === val2_someKey // true.
val_anotherKey === val2_anotherKey // true.

```

---

[Back to top](#what)
