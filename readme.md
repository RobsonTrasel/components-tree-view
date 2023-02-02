# Typecript: components-tree-viewer

A library for parsing file trees and generating markdown documents.

## Usage
To use the library, simply run the following command in your terminal:

```
npm run map <filePath>
```
where filePath is the path to the file you want to parse. The file will be parsed by the FileParser module and returned as a markdown (.md) file.

## Features

* Parses file trees and generates markdown documents.
* Easy to use, simply run ```npm run map <filePath>```.

## Requirements

* Node.JS
* npm

## Installation

To install the library, run the following command in your terminal:

```
npm install components-tree-viewer
```

Add for you package.json:

```
"scripts": {
    "map": "node dist/index.js --file="
}
```

## Contributions
Contributions are welcome. Feel free to submit a pull request with any improvements or bug fixes.