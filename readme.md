# The Chart Chunker

it chunks charts

## Version 2

This is a React + Vite + Typescript + Tailwind rewrite of the [old version](https://github.com/rbuchberger/chart_chunker), which is a Nuxt + Vue2 + Vuetify site (plain JS).

Its purpose is taking result data from a particular couple of battery testers and wrangling it into a much more convenient format, as well as performing some simple analysis. For demo purposes, some sample data can be found in the test_data directory.

These files are big CSV tables, on the order of 30 MB. The new version does much of the processing using background workers, which avoids blocking the main thread and greatly improves overall responsiveness.

Application state is handled by zustand, and there are a few tests of the chunker written in vitest. It's entirely a static SPA; there are no API endpoints, nor do I anticipate a need for them in the future.

## License

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
