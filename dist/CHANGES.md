## v1.0.3 (2024-10-31)

### Support for clearing data/cached source
- Added support for `createDataSource` and `createCachedSource` for clearing old memory / cache using an attached function (on the function).
    * For example: `const mySource = createDataSource(...); mySource.clear();`

---

## v1.0.2 (2024-10-13)

### Added aliases
- Added alias `createMemo` for `createDataMemo` and likewise `createTrigger` for `createDataTrigger`. (They are now the preferred names.)

---

## v1.0.1 (2024-10-11)

### Updated bundling
- Simply updated the bundling output JS code to be slightly more descriptive, though this also increases the compiled size a bit.
- Shorted the name of `CompareDataDepth` (`Enum` and `Type`) to `CompareDepth` base.
