import {expect, assert} from 'chai';
import {describe, it, beforeEach, afterEach} from 'mocha';
import {setupTest} from 'ember-mocha';
import sinon from 'sinon';

describe('Unit | Services | file system', () => {
  setupTest('service:file-system');

  let service;

  let fs;
  let filePathStub;
  let writeFileSyncStub;
  let readFileSyncStub;
  let deleteFileSyncStub;
  let jsonParseStub;

  beforeEach(function() {
    service = this.subject();

    filePathStub = sinon.stub(service, '_getFilePath').callsFake((fileName) => {
      return `someFake/path/${fileName}`;
    });

    fs = requireNode('fs');

    writeFileSyncStub = sinon.stub(fs, 'writeFileSync');

    readFileSyncStub = sinon.stub(fs, 'readFileSync').callsFake(() => {
      return {
        success: true,
        data: {
          name: 'Sagati dsa mere'
        }
      };
    });

    deleteFileSyncStub = sinon.stub(fs, 'unlinkSync');

    jsonParseStub = sinon.stub(JSON, 'parse').callsFake(() => {
      return {
        name: 'Sagati dsa mere'
      };
    });
  });

  afterEach(() => {
    filePathStub.restore();
    writeFileSyncStub.restore();
    readFileSyncStub.restore();
    deleteFileSyncStub.restore();
    jsonParseStub.restore();
  });

  describe('writeFile', () => {
    it('should write a file containing the specified data', () => {
      const fileName = 'some-file.json';
      const fileData = {
        name: 'Jean Bon'
      };

      service.writeFile(fileName, fileData);

      assert(writeFileSyncStub.calledOnce);
      assert(filePathStub.calledOnce);
      sinon.assert.calledWith(writeFileSyncStub, `someFake/path/${fileName}`, JSON.stringify(fileData));
    });
  });

  describe('writeNewConfiguration', () => {
    it('should append a new configuration to the file with a correct id', () => {
      const oldConfiguration = {
        id: 1,
        name: 'Old config',
        monitorsNumber: 1,
        speakersNumber: 2,
        probesNumber: 3,
        positions: []
      };

      const newConfiguration = {
        id: null,
        name: 'New config',
        monitorsNumber: 5,
        speakersNumber: 6,
        probesNumber: 7,
        positions: []
      };

      const serviceReadFileStub = sinon.stub(service, 'readFile').callsFake(() => {
        return {
          success: true,
          data: [
            oldConfiguration
          ]
        }
      });

      service.writeNewConfiguration(newConfiguration);

      assert(writeFileSyncStub.calledOnce);
      sinon.assert.calledWith(writeFileSyncStub, 'someFake/path/some-file.json', JSON.stringify([oldConfiguration, newConfiguration]));
      expect(newConfiguration.id).to.equal(2);

      serviceReadFileStub.restore();
    });
  });

  describe('editConfiguration', () => {
    it('should edit the specified configuration', () => {
      const firstConfiguration = {
        id: 1,
        name: 'First config',
        monitorsNumber: 1,
        speakersNumber: 2,
        probesNumber: 3,
        positions: []
      };

      const modifiedFirstConfiguration = {
        id: 1,
        name: 'First config new name',
        monitorsNumber: 11,
        speakersNumber: 22,
        probesNumber: 33,
        positions: []
      };

      const secondConfiguration = {
        id: 2,
        name: 'Second config',
        monitorsNumber: 5,
        speakersNumber: 6,
        probesNumber: 7,
        positions: []
      };

      const serviceReadFileStub = sinon.stub(service, 'readFile').callsFake(() => {
        return {
          success: true,
          data: [
            firstConfiguration,
            secondConfiguration
          ]
        }
      });

      service.editConfiguration(modifiedFirstConfiguration);

      assert(writeFileSyncStub.calledOnce);
      sinon.assert.calledWith(writeFileSyncStub, 'someFake/path/some-file.json', JSON.stringify([modifiedFirstConfiguration, secondConfiguration]));

      serviceReadFileStub.restore();
    });
  });

  describe('removeConfiguration', () => {
    it('should remove the specified configuration', () => {
      const firstConfiguration = {
        id: 1,
        name: 'First config',
        monitorsNumber: 1,
        speakersNumber: 2,
        probesNumber: 3,
        positions: []
      };

      const secondConfiguration = {
        id: 2,
        name: 'Second config',
        monitorsNumber: 5,
        speakersNumber: 6,
        probesNumber: 7,
        positions: []
      };

      const serviceReadFileStub = sinon.stub(service, 'readFile').callsFake(() => {
        return {
          success: true,
          data: [
            firstConfiguration,
            secondConfiguration
          ]
        }
      });

      service.removeConfiguration(1);

      assert(writeFileSyncStub.calledOnce);
      sinon.assert.calledWith(writeFileSyncStub, 'someFake/path/some-file.json', JSON.stringify([secondConfiguration]));

      serviceReadFileStub.restore();
    });
  });

  describe('readFile', () => {
    describe('when a valid file is specified', () => {
      it('should return the data that the file contains', () => {
        const fileName = 'some-file.json';

        const response = service.readFile(fileName);

        assert(readFileSyncStub.calledOnce);
        assert(filePathStub.calledOnce);

        expect(response.data).to.deep.equal({
          name: 'Sagati dsa mere'
        });
      });
    });
  });

  describe('deleteFile', () => {
    describe('when a valid file is specified', () => {
      it('should delete the specified file', () => {
        const fileName = 'some-file.json';

        service.deleteFile(fileName);

        assert(deleteFileSyncStub.calledOnce);
        assert(filePathStub.calledOnce);
        sinon.assert.calledWith(deleteFileSyncStub, `someFake/path/${fileName}`);
      });
    });
  })
});
