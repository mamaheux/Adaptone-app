# adaptone-front

Adaptone front-end application.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone <repository-url>` this repository
* `cd adaptone-front`
* `npm install`

## Running / Development
For development and test purposes, this application can be run in the browser:

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

You can also launch the app in desktop mode:

* `ember electron`

The developer tools and ember console are available in desktop mode by pression Ctrl+Shift+i.

### Running Tests
The ember application can be tested for using these commands:

* `ember test`
* `ember test --server`

The application can also be tested in Electron using this command:

* `ember electron:test`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Building
#### Binaries

* `ember electron:package`

#### Installer

* `ember electron:make`

##### Assemble

* `ember electron:assemble`
