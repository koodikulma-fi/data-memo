/** Get cleaned index suitable for finding or inserting children items in an array.
 * - If you're adding a new kid, use kids.length + 1 for newCount. Normally use kids.length directly.
 * - This allows one cycle of negative. So has a range of: [-newCount + 1, newCount - 1], which it turns into [0, newCount - 1].
 * - Only returns -1 if the newCount is 0, otherwise integer of at least 0 and lower than newCount.
 *
 * ```
 *
 * // Examples with a count of 3.
 * cleanIndex(undefined, 3); // 2
 * cleanIndex(null, 3);      // 2
 * cleanIndex(3, 3);         // 2
 * cleanIndex(2, 3);         // 2
 * cleanIndex(1, 3);         // 1
 * cleanIndex(0, 3);         // 0
 * cleanIndex(-1, 3);        // 2
 * cleanIndex(-2, 3);        // 1
 * cleanIndex(-3, 3);        // 0
 * cleanIndex(-4, 3);        // 0
 *
 * ```
 *
 */
declare function cleanIndex(index: number | null | undefined, newCount: number): number;
/** Gets an index for insertion based on the concept of order in 3 categories: `>= 0`, `null|undefined`, `< 0`.
 * @param order The relative order in three categories.
 *      - If a number in `order` array is `>= 0`, then closer to 0, the more in the front it will be.
 *      - If a number in `order` array is `< 0`, then closer to 0, the later will be.
 *      - If a value in `order` array is `null | undefined`, then does not care: after >= 0, but before any < 0.
 *      - If encounters the same in order, adds after (all same).
 * @param orderBy Array representing the _already existing and sorted_ items by their `order`.
 *      - The count of the array implies how many currently exists. If should return after, returns -1.
 *      - Note. If orderBy represents objects or arrays whose property/index contains the order instead, defined `orderProp` (3rd arg).
 * @param orderProp Optional parameter to define a property / index to read the order from the `orderBy` array.
 * @returns The insertion index which is >= 0, or -1 if should add as the last one.
 *
 * ```
 *
 * // Get an insertion index using `order` in _pre-sorted_ `orderBy` array.
 * // .. Note. To re-order a whole array use `orderArray(arr, orderBy)`.
 *
 * // Directly.
 * orderedIndex(0, [0, 1, 2]);                  // 1
 * orderedIndex(0, [1, 2, null, -2, -1]);       // 0
 * orderedIndex(2, [1, 2, null, -2, -1]);       // 2
 * orderedIndex(-1, [1, 2, null, -2, -1]);      // -1
 * orderedIndex(-1.5, [1, 2, null, -2, -1]);    // 4
 * orderedIndex(null, [1, 2, null, -2, -1]);    // 3
 *
 * // From dictionaries.
 * const orderByObj: { name: string; order?: number | null; }[] = [
 *      { name: "1st", order: 0 },
 *      { name: "2nd" },
 *      { name: "3rd", order: -1 },
 * ];
 * orderedIndex(0, orderByObj, "order");         // 1
 * orderedIndex(null, orderByObj, "order");      // 2
 * orderedIndex(-1, orderByObj, "order");        // -1
 *
 * // From sub array objects.
 * const orderByArr = [
 *      ["1st", 0] as const,
 *      ["2nd"] as const,
 *      ["3rd", -1] as const,
 * ];
 * orderedIndex(0, orderByArr, 1);               // 1
 * orderedIndex(null, orderByArr, 1);            // 2
 * orderedIndex(-1, orderByArr, 1);              // -1
 *
 * // Test typeguard.
 * orderedIndex(null, orderByObj, "name");  // orderByObj is red-underlined (or the method).
 * orderedIndex(null, orderByArr, 0);       // 0 is red-underlined (or the method).
 *
 * ```
 */
declare function orderedIndex<Index extends number, T extends any[] | readonly any[]>(order: number | null | undefined, orderBy: T[], index: T[Index] extends number | null | undefined ? Index : never): number;
declare function orderedIndex<Key extends (string | number) & keyof T, T extends Partial<Record<Key, number | null>>>(order: number | null | undefined, orderBy: T[], property: Key): number;
declare function orderedIndex(order: number | null | undefined, orderBy: Array<number | null | undefined>, orderProp?: "" | undefined | never): number;
/** Order an array by matching `order` array consisting of numbers or null | undefined.
 * - Ordering happens in 3 categories: 1. near front (>= 0), 2. near end (< 0), 3. don't care (null | undefined).
 * @param arr The original array to sort.
 * @param orderOrPropIndex The relative order in three categories, or a property string or index number.
 *      - If a string or number, then uses it as a property/index of the item to ready data.
 *      - If an array:
 *          * For values `>= 0`, then closer to 0, the more in the front it will be.
 *          * For values `< 0`, then closer to 0, the later will be.
 *          * For values `null | undefined`, then does not care: after >= 0, but before any < 0.
 *      - For cases with matching order uses keeps the original order.
 * @returns A new sorted array.
 *
 * ```
 *
 * // Arrays.
 * orderArray(["a", "b", "c"], [20, 10, 0]);             // ["c", "b", "a"]
 * orderArray(["a", "b", "c"], [-1, -2, -3]);            // ["c", "b", "a"]
 * orderArray(["a", "b", "c"], [-1, null, 0]);           // ["c", "b", "a"]
 * orderArray(["a", "b", "c"], [null, 0]);               // ["b", "a", "c"]
 * orderArray(["a", "b", "c"], [undefined, 0, null]);    // ["b", "a", "c"]
 * orderArray(["a", "b", "c"], [-1, 0, null]);           // ["b", "c", "a"]
 * orderArray(["a", "b", "c", "d"], [null, 0, -.5, -1]); // ["b", "a", "d", "c"]
 *
 * // Dictionaries (with type support).
 * type Obj = { name: string; order?: number | null; };
 * const a: Obj = { name: "a", order: -1 };
 * const b: Obj = { name: "b", order: 0 };
 * const c: Obj = { name: "c" };
 * orderArray([a, b, c], "order"); // [b, c, a]
 *
 * // Sub array objects (with type support for specific index).
 * const d = ["d", -1] as const;
 * const e = ["e", 0] as const;
 * const f = ["f"] as const;
 * orderArray([d, e, f], 1); // [e, f, d]
 *
 * // Test typeguard.
 * orderArray([a, b, c], "name");   // name is red-underlined (or the method).
 * orderArray([d, e, f], 0);        // 0 is red-underlined (or the method).
 *
 * ```
 *
 */
declare function orderArray<Index extends number, T extends any[] | readonly any[]>(arr: T[], index: T[Index] extends number | null | undefined ? Index : never): T[];
declare function orderArray<Key extends string & keyof T, T extends Partial<Record<Key, number | null>>>(arr: T[], property: Key): T[];
declare function orderArray<T extends any>(arr: T[], orderBy: Array<number | null | undefined>): T[];
/** Creates a numeric range with whole or fractoral numbers.
 * @param startOrEnd Define where the range starting from 0 ends, or where the range starts if end (2nd arg) is not undefined nor null.
 * @param end Define wher the range ends, making the 1st argument represent start. Note that ends _before_ the end value by default.
 * @param stepSize How big each step. If 0 then 1. If negative, flips the order.
 * @param includeEnd If set to true, then the range includes the end value. By default ends _before_ the end is reached.
 *
 * ```
 *
 * // Create whole number ranges.
 * numberRange(3);                  // [0, 1, 2]
 * numberRange(-3);                 // [0, -1, -2]
 * numberRange(1, 3);               // [1, 2]
 * numberRange(3, 1);               // [3, 2]
 * numberRange(1, 3, 1, true);      // [1, 2, 3]
 * numberRange(3, 1, -1, true);     // [1, 2, 3]
 * numberRange(3, 1, null, true);   // [3, 2, 1]
 * numberRange(-1, 2);              // [-1, 0, 1]
 * numberRange(1, -2);              // [1, 0, -1]
 * numberRange(1, -2, -1);          // [-1, 0, 1]
 * numberRange(0, 3, -1);           // [2, 1, 0]
 * numberRange(3, null, -1);        // [2, 1, 0]
 * numberRange(-3, null, -1);       // [-2, -1, 0]
 *
 * // Create fractional ranges.
 * numberRange(1, 2, 0.25);         // [1, 1.25, 1.5, 1.75]
 * numberRange(1, 2, -0.25);        // [1.75, 1.5, 1.25, 1]
 * numberRange(2, 1, 0.25);         // [2, 1.75, 1.5, 1.25]
 * numberRange(1, 2, 0.25, true);   // [1, 1.25, 1.5, 1.75, 2]
 * numberRange(2, 1, 0.25, true);   // [2, 1.75, 1.5, 1.25, 1]
 * numberRange(2, 1, -0.25, true);  // [1, 1.25, 1.5, 1.75, 2]
 * numberRange(3, null, 0.5);       // [0, 0.5, 1, 1.5, 2, 2.5]
 * numberRange(3, null, -0.5);      // [0, -0.5, -1, -1.5, -2, -2.5]
 * numberRange(1, 2, 0.33);         // [1, 1.33, 1.66, 1.99] // Or what fracts do.
 * numberRange(1, 2, -0.33);        // [1.99, 1.66, 1.33, 1] // Or what fracts do.
 *
 * ```
 */
declare function numberRange(startOrEnd: number, end?: number | null, stepSize?: number | null, includeEnd?: boolean): number[];

/** For quick getting modes to depth for certain uses (Memo and DataPicker).
 * - Positive values can go however deep. Note that -1 means deep, but below -2 means will not check.
 * - Values are: "never" = -3, "always" = -2, "deep" = -1, "changed" = 0, "shallow" = 1, "double" = 2.
 */
declare enum CompareDepthEnum {
    never = -3,
    always = -2,
    deep = -1,
    changed = 0,
    shallow = 1,
    double = 2
}
/** Data comparison modes as string names.
 * - "always" means always changed - doesn't even compare the data.
 * - "changed" means if a !== b, then it's changed.
 * - "shallow" means comparing all values in an array or dictionary with identity check (!==). This is a common used default, compares 1 level.
 * - "double" is like "shallow" but any prop value that is object or array will do a further shallow comparison to determine if it has changed.
 * - "deep" compares all the way down recursively. Only use this if you it's really what you want - never use it with recursive objects (= with direct or indirect self references).
 */
type CompareDepthMode = keyof typeof CompareDepthEnum;
/** General data comparison function with level for deepness.
 * - Supports Object, Array, Set, Map complex types and recognizes classes vs. objects.
 * - About arguments:
 *      @param a First object for comparison. (Order of a and b makes no difference in the outcome.)
 *      @param b Second object for comparison. (Order of a and b makes no difference in the outcome.)
 *      @param nDepth Set the depth of comparison. Defaults to -1 (deep).
 *          - nDepth of -1 means no limit. 0 means no depth: simple identity check. 1 means shallow comparison, 2 double shallow comparison, and so on.
 * ```
 *
 * // Basic usage.
 * const test = { test: true };
 * areEqual(true, test); // false, clearly not equal.
 * areEqual(test, { test: true }); // true, contents are equal when deeply check.
 * areEqual(test, { test: true }, 1); // true, contents are equal when shallow checked.
 * areEqual(test, { test: true }, 0); // false, not identical objects.
 * areEqual(test, test, 0); // true, identical objects.
 *
 * ```
 */
declare function areEqual(a: any, b: any, nDepth?: number): boolean;
/** General copy function with level for deepness.
 * - Supports Object, Array, Set, Map complex types and recognizes classes vs. objects.
 * - About arguments:
 *      @param obj The value to copy, typically a complex object (but can of course be a simple value as well).
 *      @param nDepth Set the depth of copy level. Defaults to -1 (deep).
 *          - nDepth of -1 means no limit. 0 means no depth: simple identity check. 1 means shallow copy, 2 double shallow copy, and so on.
 * ```
 *
 * // Prepare.
 * const original = { deep: { blue: true }, simple: "yes" };
 *
 * // Basic usage.
 * const copy1 = deepCopy(original); // Copied deeply.
 * const copy2 = deepCopy(original, 1); // Copied one level, so original.blue === copy.blue.
 * const copy3 = deepCopy(original, 0); // Did not copy, so original === copy.
 *
 * // Let's check the claims about depth.
 * [copy1 === original, copy1.deep === original.deep] // [false, false]
 * [copy2 === original, copy2.deep === original.deep] // [false, true]
 * [copy3 === original, copy3.deep === original.deep] // [true, true]
 *
 * ```
 */
declare function deepCopy<T = any>(obj: T, nDepth?: number): T;
/** Helper to compare a dictionary/object against another using a compareBy dictionary for update modes - only compares the properties of the compareBy dictionary.
 * - For example, let's say a class instance has `{ props, state }` here, so compareBy would define the comparison modes for each: `{ props: 1, state: "always" }`.
 * - Returns false if had differences. Note that in "always" mode even identical values are considered different, so returns true for any.
 * - -2 always, -1 deep, 0 changed, 1 shallow, 2 double, ... See the CompareDepthMode type for details.
 *
 * ```
 *
 * // Basic usage.
 * // .. Let's test with two equal sets of data to show case the comparison depth.
 * const a = { props: { deep: { test: true }, simple: false }, state: undefined };
 * const b = { props: { deep: { test: true }, simple: false }, state: undefined };
 *
 * // Let's mirror what we do for props and state, but by using number vs. mode name.
 * areEqualBy(a, b, { props: 0, state: "changed" });   // false, since `a.props !== b.props`.
 * areEqualBy(a, b, { props: 1, state: "shallow" });   // false, since `a.props.deep !== b.props.deep` (not same obj. ref.).
 * areEqualBy(a, b, { props: 2, state: "double" });    // true, every nested value compared was equal.
 * areEqualBy(a, b, { props: -1, state: "deep" });     // true, every nested value was compared and was equal.
 * areEqualBy(a, b, { props: -2, state: "always" });   // false, both are "always" different - doesn't check.
 * areEqualBy(a, b, { props: -3, state: "never" });    // true, both are "never" different - doesn't check.
 *
 * // Some tests with "never": saying that the data never changes, don't even check.
 * areEqualBy(a, b, { props: "changed", state: "never" });     // false, since `a.props !== b.props`.
 * areEqualBy(a, b, { props: "never", state: "never" });       // true, did not check either, since they "never" change.
 *
 * // Of course, if one part says not equal, then doesn't matter what others say: not equal.
 * areEqualBy(a, b, { props: "never", state: "always" });      // false, since state is "always" different.
 *
 * ```
 */
declare function areEqualBy(from: Record<string, any> | null | undefined, to: Record<string, any> | null | undefined, compareBy: Record<string, CompareDepthMode | number | any>): boolean;

/** Type for a function whose job is to extract data from given arguments. */
type DataExtractor<P extends any[] = any[], R = any> = (...args: P) => R;
/** This helps to create a typed data selector by providing the types for the Params for extractor and Data for output of the selector.
 * - The type return is a function that can be used for triggering the effect (like in Redux).
 * - The extractor can return an array up to 20 typed members.
 */
type CreateDataSource<Params extends any[] = any[], Data = any> = <Extractor extends (...args: Params) => [any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?], Extracted extends ReturnType<Extractor> = ReturnType<Extractor>>(extractor: Extractor, producer: (...args: Extracted) => Data, depth?: number | CompareDepthMode) => (...args: Params) => Data;
/** This helps to create a typed cached data selector by providing the types for the Params for extractor and Data for output of the selector.
 * - The type return is a function that can be used for triggering the effect (like in Redux).
 * - The extractor can return an array up to 20 typed members.
 */
type CreateCachedSource<Params extends any[] = any[], Data = any> = <Extractor extends (...args: Params) => [any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?], Extracted extends ReturnType<Extractor> = ReturnType<Extractor>>(extractor: Extractor, producer: (...args: Extracted) => Data, cacher: (...args: [...args: Params, cached: Record<string, (...args: Params) => Data>]) => string, depth?: number | CompareDepthMode) => (...args: Params) => Data;
/** Callback to run when the DataTrigger memory has changed (according to the comparison mode).
 * - If the callback returns a new callback function, it will be run when unmounting the callback.
 */
type DataTriggerOnMount<Memory = any> = (newMem: Memory, prevMem: Memory | undefined) => void | DataTriggerOnUnmount;
/** Callback to run when specifically changes to use a new onMount callback - implies that memory was changed as well.
 * - The callback is called right before calling the new onMount counter part.
 * - Note that this is not called on every memory change, but only on memory changes where new onMount callback was defined.
 */
type DataTriggerOnUnmount<Memory = any> = (currentMem: Memory, nextMem: Memory) => void;
/** Create a data memo.
 * - Usage:
 *      1. First define the (optional but often used) onMount callback to be triggered on memory change.
 *      2. Then define create a trigger: `const myTrigger = createDataTrigger(onMount, memory)`.
 *      3. Then later in repeatable part of code call the trigger: `const didChange = myTrigger(newMemory);`
 * - Aboute triggering:
 *      - When calling the trigger you have actually 3 arguments: `(newMemory: Memory, forceRun?: boolean, newOnMountIfChanged?: DataTriggerOnMount<Memory>) => boolean`
 *      - The forceRun forces triggering, while the newOnMountIfChanged sets a new onMount callback, but only if memory was changed (or forced the trigger).
 * - About arguments:
 *      @param onMount Defines a callback to run when the memory has changed.
 *          - If the callback returns another callback, it will be called if the onMount callback gets replaced - see the 3rd arg upon triggering above.
 *      @param memory Defines the initial memory.
 *      @param depth Defines the comparison depth for comparing previous and new memory - to decide whether to run onMount callback.
 *          - Defaults to 1 meaning will perform a shallow comparison on the old and new memory. (By default assumes it's an object.)
 *
 * ```
 *
 * // Create a function that can be called to trigger a callback when the reference data is changed from the last time
 * type Memory = { id: number; text: string; };
 * const myTrigger = createDataTrigger<Memory>(
 *      // 1st arg is an optional (but often used) _mount_ callback.
 *      (newMem, oldMem) => {
 *          // Run upon change.
 *          if (newMem.id !== oldMem?.id)
 *              console.log("Id changed!");
 *          // Optionally return a callback to do _unmounting_.
 *          return (currentMem, nextMem) => { console.log("Unmounted!"); }
 *      },
 *      // 2nd arg is optional initial memory.
 *      // .. Use it to delay the first triggering of the mount callback (in case the same on first usages).
 *      { id: 1, text: "init" },
 *      // 3rd arg is optional depth, defaults to 1, meaning performs shallow comparison on the memory.
 *      1
 * );
 *
 * // Use the trigger.
 * let didChange = myTrigger({ id: 1, text: "init" }); // false, new memory and init memory have equal contents.
 * didChange = myTrigger({ id: 1, text: "thing" }); // true
 * didChange = myTrigger({ id: 2, text: "thing" }); // true, logs: "Id changed!"
 * didChange = myTrigger({ id: 2, text: "thing" }, true); // true
 *
 * // Change callback.
 * const newCallback = () => { console.log("Changes!"); };
 * didChange = myTrigger({ id: 2, text: "thing" }, false, newCallback); // false
 * didChange = myTrigger({ id: 3, text: "thing" }, false, newCallback); // true, logs: "Unmounted!" and then "Changes!".
 * didChange = myTrigger({ id: 3, text: "now?" }); // true, logs: "Changes!"
 *
 * ```
 */
declare function createDataTrigger<Memory extends any>(onMount?: DataTriggerOnMount<Memory>, memory?: Memory, depth?: number | CompareDepthMode): (newMemory: Memory, forceRun?: boolean, newOnMountIfChanged?: DataTriggerOnMount<Memory> | null) => boolean;
/** Create a data memo.
 * - First define a handler: `const onChange = createDataMemo((arg1, arg2) => { return "something"; });`.
 * - Then later in repeatable part of code get the value: `const myValue = onChange(arg1, arg2);`
 * - About arguments:
 *      @param producer Defines the callback to produce the final data given the custom arguments.
 *      @param depth Defines the comparison depth for comparing previous and new memory arguments - to decide whether to run onMount callback.
 *          - The depth defaults to 0 meaning identity check on args (or if count changed).
 *          - Note that the depth refers to _each_ item in the memory, not the memory argments array as a whole since it's new every time.
 *
 * ```
 *
 * // Types.
 * type Input = { name: string; score: number; };
 * type Output = { winner: string | null; loser: string | null; difference: number; };
 *
 * // Create a function that can be called to return updated data if arguments changed.
 * const onResults = createDataMemo(
 *     // 1st arg is the producer callback that should return the desired data.
 *     // .. It's only triggered when either (a, b) is changed from last time.
 *     (a: Input, b: Input): Output => {
 *         // Do something with the args.
 *         return a.score > b.score ? { winner: a.name, loser: b.name, difference: a.score - b.score } :
 *             a.score < b.score ? { winner: b.name, loser: a.name, difference: b.score - a.score } :
 *             { winner: null, loser: null, difference: 0 };
 *     },
 *     // 2nd arg is optional and defines the _level of comparison_ referring to each argument.
 *     // .. For DataMemo it defaults to 0, meaning identity comparison on each arg: oldArg[i] !== newArg[i].
 *     // .. To do a deep comparison set to -1. Setting of 1 means shallow comparison (on each arg), and from there up.
 *     1,
 * );
 *
 * // Use the memo.
 * const a = { score: 3, name: "alpha"};
 * const b = { score: 5, name: "beta"};
 * const result = onResults(a, b);         // { winner: "beta", loser: "alpha", difference: 2 }
 *
 * // Show case functionality.
 * const result2 = onResults(a, b);        // Identical to above. (Used same args.)
 * const result3 = onResults(a, {...b});   // Identical to above, because of comparison depth 1.
 * const result4 = onResults(b, a);        // Same as above - but a new object.
 * const result5 = onResults(b, a);        // Identical to above (result4).
 * const result6 = onResults(a, b);        // Same as above - but a new object.
 * const result7 = onResults(a, a);        // { winner: null, loser: null, difference: 0 }
 * const result8 = onResults(a, a);        // Same as above - identical to result7.
 *
 * // That the identity stays the same for consequent tries is useful in state based refresh flow.
 * result === result2      // true
 * result === result3      // true
 * result === result4      // false
 * result4 === result5     // true
 * result4 === result6     // false
 * result === result6      // false
 * result7 === result8     // true
 *
 * ```
 *
 */
declare function createDataMemo<Data extends any, MemoryArgs extends any[]>(producer: (...memory: MemoryArgs) => Data, depth?: number | CompareDepthMode): (...memory: MemoryArgs) => Data;
/** Create a data source (returns a function): Functions like createDataMemo but for data with an intermediary extractor.
 * - Give an extractor that extracts an array out of your customly defined arguments. Can return an array up to 20 typed members or more with `[...] as const` trick.
 * - Whenever the extracted output has changed, the producer callback is triggered.
 *      * To control the level of comparsion, pass in the optional last arg for "depth". Defaults to 0: identity check on each argument (+ checks argment count).
 * - The producer callback directly receives the arguments returned by the extractor, and it should return the output data solely based on them (other sources of data should be constant).
 * - The whole point of this abstraction, is to trigger the presumably expensive producer callback only when the cheap extractor func tells there's a change.
 *
 * ```
 *
 * // Prepare.
 * type MyParams = [ colorTheme: { mode?: "light" | "dark" }, specialMode?: boolean];
 * type MyData = { theme: "dark" | "light"; special: boolean; }
 *
 * // With pre-typing.
 * const mySource = (createDataSource as CreateDataSource<MyParams, MyData>)(
 *      // Extractor - showcases the usage for contexts.
 *      // .. For example, if has many usages with similar context data needs.
 *      (colorTheme, specialMode) => [
 *          colorTheme?.mode || "dark",
 *          specialMode || false,
 *      ],
 *      // Producer - it's only called if the extracted data items were changed from last time.
 *      (theme, special) => ({ theme, special }),
 *      // Optional depth of comparing each argument.
 *      // .. Defaults to 0: if any arg (or arg count) is changed, triggers the producer.
 *      0
 * );
 *
 * // With manual typing.
 * const mySource_MANUAL = createDataSource(
 *      // Extractor.
 *      (...[colorTheme, specialMode]: MyParams) => [
 *          colorTheme?.mode || "dark",
 *          specialMode || false,
 *      ],
 *      // Producer.
 *      (theme, special): MyData => ({ theme, special }),
 *      // Optional depth.
 *      0
 * );
 *
 * // Use.
 * const val = mySource({ mode: "dark" }, true);   // { theme: "dark", special: true }
 * const val2 = mySource({ mode: "dark" }, true);  // Identical to above.
 * val === val2; // true
 *
 * // Test typing.
 * const val_FAIL = mySource({ mode: "FAIL" }, true); // The "FAIL" is red-underlined.
 * const val_MANUAL = mySource_MANUAL({ mode: "dark" }, true);
 * const val_MANUAL_FAIL = mySource_MANUAL({ mode: "FAIL" }, true); // The "FAIL" is red-underlined.
 *
 * ```
 */
declare function createDataSource<Extracted extends [any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?] | readonly any[], Data extends any, Params extends any[]>(extractor: (...args: Params) => Extracted, producer: (...args: Extracted) => Data, depth?: number | CompareDepthMode): (...args: Params) => Data;
/** Create a cached data source (returns a function).
 * - Just like createDataSource but provides multiple sets of extraction and data memory.
 * - The key (string) for caching is derived by the 3rd argument which is a function that receives the source arguments: `(...origArgs, cached): string`.
 *      * The cached extra argument provides the dictionary of current caching. The function may also use it to mutate the cache manually, eg. to delete keys from it.
 * - The reason why you would use the "cached" variant is when you have multiple similar use cases for the same selector with different source datas.
 *      * For example, let's say you have 2 similar grids but with two different source data.
 *      * If you would use createDataSource they would be competing about it.
 *      * So in practice, the producer callback would be triggered every time the _asker changes_ - even if data in both sets would stay identical.
 *      * To solve this, you simply define unique keys for each use case. For example: "grid1" and "grid2" in our simple example here.
 * - Like in createDataSource the optional last argument "depth" can be used to define the level of comparison for each argument. Defaults to 0: identity check.
 *
 * ```
 *
 * // Let' use the same MyData as with createDataSource, but add cacheKey to args.
 * type MyData = { theme: "dark" | "light"; special: boolean; };
 * type MyCachedParams = [
 *      colorTheme: { mode?: "light" | "dark" },
 *      specialMode: boolean | undefined,
 *      cacheKey: string
 * ];
 *
 * // With pre-typing.
 * const mySource = (createCachedSource as CreateCachedSource<MyCachedParams, MyData>)(
 *      // Extractor.
 *      (colorTheme, specialMode) => [colorTheme?.mode || "dark", specialMode || false],
 *      // Producer.
 *      (theme, special) => ({ theme, special }),
 *      // Cache key generator.
 *      (_theme, _special, cacheKey) => cacheKey,
 *      // Optional depth. Defaults to 0: identity check on each extracted arg.
 *      0
 * );
 *
 * // With manual typing. The result works just the same.
 * const mySource_MANUAL = createCachedSource(
 *      // Extractor. Let's specify MyCachedParams here, will also be use for the cacher.
 *      (...[colorTheme, specialMode]: MyCachedParams) => [colorTheme?.mode || "dark", specialMode || false],
 *      // Producer.
 *      (theme, special): MyData => ({ theme, special }),
 *      // Cache key generator.
 *      (_theme, _special, cacheKey) => cacheKey,
 *      // Optional depth.
 *      0
 * );
 *
 * // Let's say state1 and state2 variants come from somewhere.
 * let settings1 = { mode: "dark" } as const;
 * let settings2 = { mode: "dark" } as const;
 * let special1 = true;
 * let special2 = false;
 *
 * // Use.
 * let val_someKey = mySource(settings1, special1, "someKey"); // In one place.
 * let val_anotherKey = mySource(settings2, special2, "anotherKey"); // In another place with similar data.
 * // We can do it again, and the producers won't be retriggered (unlike without caching).
 * let val2_someKey = mySource(settings1, special1, "someKey");
 * let val2_anotherKey = mySource(settings2, special2, "anotherKey");
 * // Validate claims.
 * val_someKey === val2_someKey // true.
 * val_anotherKey === val2_anotherKey // true.
 *
 * ```
 */
declare function createCachedSource<Extracted extends [any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?] | readonly any[], Data extends any, Params extends any[]>(extractor: (...args: Params) => Extracted, producer: (...args: Extracted) => Data, cacher: (...args: [...args: Params, cached: Record<string, (...args: Params) => Data>]) => string, depth?: number | CompareDepthMode): (...args: Params) => Data;

export { CompareDepthEnum, CompareDepthMode, CreateCachedSource, CreateDataSource, DataExtractor, DataTriggerOnMount, DataTriggerOnUnmount, areEqual, areEqualBy, cleanIndex, createCachedSource, createDataMemo, createDataSource, createDataTrigger, deepCopy, numberRange, orderArray, orderedIndex };
