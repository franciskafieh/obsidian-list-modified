# Contributing to OLM

Thank you so much for your interest in contributing! If you are not a developer, please [open an issue](https://github.com/franciskafieh/obsidian-list-modified/issues/new/choose) for feature requests and bug reports. Otherwise, continue reading below for helpful information on the project.

## How to Build

-   Clone project
-   `bun install`

## Project Structure

The main source code of the project resides in the `src/` directory. Within, there are the following sub-directories:

-   `interfaces/` - interfaces for abstracting out Obsidian types so that the plugin can be tested independent of Obsidian. This should never really need to be edited.
-   `logic/` - code logic which runs exclusive of Obsidian. Nothing in this directory should import from Obsidian. This would cause the tests to fail. Exception: Obsidian's "moment" is mocked in testing so it can and should be used here.
-   `obsidian/` - Obsidian-specific code like event listeners and settings panes. Code in this directory should be kept relatively simple as it is not tested. When possible, logic should be placed in other directories.
-   `utils/` - Miscelaneous utility functions, mostly for formatting and code reusability. Utilities should be tested if they are complex enough to allow error.

## Testing

Tests are all done with `bun test` and reside in the `tests/` directory. The subdirectories mirror the `src/` folder structure. Read above for more info on what should be tested. Tests will automatically be ran on every PR submission.

## Code Formatting

Please ensure you are using Prettier and ESLint for code formatting/linting.
