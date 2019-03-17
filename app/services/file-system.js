import Service from '@ember/service';
import config from 'adaptone-front/config/environment';

// Constants
const FILE_FORMAT = 'utf-8';

// Node requires
const electron = requireNode('electron');
const fs = requireNode('fs');

/* In order to save the file in the right folder regardless of the OS
   we use the path found by Electron */
const userDataPath = (electron.app || electron.remote.app).getPath('userData');
const basePath = requireNode('path').join(userDataPath);

export default Service.extend({
  writeFile(fileName, data) {
    try {
      const filePath = this._getFilePath(fileName);
      fs.writeFileSync(filePath, JSON.stringify(data));
    } catch (error) {
      return `An error occured while trying to write the file. \n ${error.message}`;
    }
  },

  writeNewConfiguration(configuration) {
    const configurationFile = config.APP.CONFIGURATION_FILE.FILENAME;
    const fileContent = this.readFile(configurationFile);
    const configurations = fileContent.success ? fileContent.data : [];

    let biggestId = -1;
    configurations.map(config => {
      if (config.id > biggestId) biggestId = config.id;
    });

    configuration.id = biggestId + 1;
    configurations.push(configuration);

    this.writeFile(configurationFile, configurations);
  },

  editConfiguration(configuration) {
    const configurationFile = config.APP.CONFIGURATION_FILE.FILENAME;
    const fileContent = this.readFile(configurationFile);
    const configurations = fileContent.success ? fileContent.data : [];

    const configurationIndex = configurations.findIndex(config => config.id === configuration.id);
    configurations[configurationIndex] = configuration;

    this.writeFile(configurationFile, configurations);
  },

  removeConfiguration(configurationId) {
    const configurationFile = config.APP.CONFIGURATION_FILE.FILENAME;
    const fileContent = this.readFile(configurationFile);
    let configurations = fileContent ? fileContent.data : [];

    configurations = configurations.filter(configuration => configuration.id !== configurationId);

    this.writeFile(configurationFile, configurations);

    return configurations;
  },

  readFile(fileName) {
    try {
      const filePath = this._getFilePath(fileName);
      const data = JSON.parse(fs.readFileSync(filePath, FILE_FORMAT));

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        data: `An error occured while trying to access the file. \n ${error.message}`
      };
    }
  },

  deleteFile(fileName) {
    try {
      const filePath = this._getFilePath(fileName);
      fs.unlinkSync(filePath);
    } catch (error) {
      return `An error occured while trying to delete the file. \n ${error.message}`;
    }
  },

  _getFilePath(fileName) {
    return `${basePath}/${fileName}`;
  }
});
