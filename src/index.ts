
// - Export all - //

// Static helpers.
export * from "./library/numeric";
export * from "./library/deep";
export * from "./library/selectors"; // Dependent on "deep".
// Add aliases for old names - to not break version support.
export { createMemo as createDataMemo } from "./library/selectors";
export { createTrigger as createDataTrigger } from "./library/selectors";
