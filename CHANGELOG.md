# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [3.0.0] - 2017-03-24

### Changed

- **Breaking!** Prefix localStorage keys in the browser with `resin-`. This will lose all existing stored values.

## [2.0.0] - 2016-10-09

### Changed

- **Breaking!** Disconnect this module from `resin-settings-client`. Now exports a factory method that accepts a `{ dataDirectory }` options in Node.js.
- Update `lodash` to v4

## [1.1.0] - 2016-09-09

### Changed

- Update `resin-settings-client` to make the package browser-compatible.
- Run test suite in the browser

## [1.0.4] - 2016-03-21

### Changed

- Set an infinite quota.

## [1.0.3] - 2016-01-12

### Changed

- Detect external changes to data directory.

## [1.0.2] - 2015-11-04

### Changed

- Omit tests from NPM package.

## [1.0.1] - 2015-09-07

### Changed

- Upgrade Resin Settings Client to v3.0.0.

[3.0.0]: https://github.com/resin-io-modules/resin-settings-storage/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/resin-io-modules/resin-settings-storage/compare/v1.1.0...v2.0.0
[1.1.0]: https://github.com/resin-io-modules/resin-settings-storage/compare/v1.0.4...v1.1.0
[1.0.4]: https://github.com/resin-io-modules/resin-settings-storage/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/resin-io-modules/resin-settings-storage/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/resin-io-modules/resin-settings-storage/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/resin-io-modules/resin-settings-storage/compare/v1.0.0...v1.0.1
