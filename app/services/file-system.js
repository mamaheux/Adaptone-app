import Service from '@ember/service';

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
      alert('An error occured while tr')
    }
  },

  readFile(fileName) {
    try {
      const filePath = this._getFilePath(fileName);
      return JSON.parse(fs.readFileSync(filePath, FILE_FORMAT));
    } catch (error) {
      alert('An error occured while trying to access the file. \n' + error.message);
    }
  },

  deleteFile(fileName) {
    try {
      const filePath = this._getFilePath(fileName);
      fs.unlinkSync(filePath);
    } catch (error) {
      alert('An error occured while trying to delete the file. \n' + error.message);
    }
  },

  _getFilePath(fileName) {
    return `${basePath}/${fileName}`;
  }
});
