# Adaptone-App
Adaptone front-end application build using EmberJS and Electron. This application acts as a replacement for a mixing console. 

## Prerequisites
You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone <repository-url>` this repository
* `cd adaptone-app`
* `npm install`

## Running / Development
For development and test purposes, this application can be run in the browser:

* `ember serve` or `npm start` 
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

You can also launch the app in desktop mode:

* `ember electron`

The developer tools and ember console are available in desktop mode by pressing Ctrl+Shift+i. It is strongly recommended to run with electron in desktop mode before pushing any feature. 

### Running Tests
The tests are made using [https://github.com/emberjs/ember-mocha](Mocha) and [https://github.com/ember-cli/ember-cli-chai](Chai). The ember application can be tested for using these commands:

* `ember test`
* `ember test --server`

The application can also be tested in Electron using this command:

* `ember electron:test`

### Linting
Linting is done with [https://eslint.org/](ESLint). New rules and customizations can be added in the `.eslintrc.js` file at the root of the project.

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Building
#### Binaries
Creates binaries or your app using electron-forge and electron-packager in the background. Options can be specified in `ember-electron/electron-forge-config.js`.

* `ember electron:package`

#### Installer
Creates installers and distribution bundles. For Windows, that means a Squirrel Installer and a Windows Store Package; for macOS, zip/dmg files and a Mac App Store Package, while Linux users enjoy the creation of deb, rpm, and flatpak files. Again, options can be specified in ember-electron/electron-forge-config.js.

* `ember electron:make`

##### Assemble
Assemble Electron application project (useful for debugging builds). For more information, check out the guide on the build pipeline.

* `ember electron:assemble`
