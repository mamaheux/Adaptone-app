import {assert} from 'chai';
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

  beforeEach(function() {
    service = this.subject();

    filePathStub = sinon.stub(service, '_getFilePath').callsFake((fileName) => {
      return `someFake/path/${fileName}`;
    });

    fs = requireNode('fs');

    writeFileSyncStub = sinon.stub(fs, 'writeFileSync');

    readFileSyncStub = sinon.stub(fs, 'readFileSync').callsFake(() => {
      return {
        name: 'Sagati dsa mere'
      };
    });
  });

  afterEach(() => {
    filePathStub.restore();
    writeFileSyncStub.restore();
    readFileSyncStub.restore();
  })

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

  describe('readFile', () => {
    describe('when a valid file is specified', () => {
      it('should return the data that the file contains', () => {
        const fileName = 'some-file.json';

        const data = service.readFile(fileName);

        assert(readFileSyncStub.calledOnce);
        assert(filePathStub.calledOnce);

        expect(data).to.equal({
          name: 'Sagati dsa mere'
        });
      });
    });
  });

  describe('deleteFile', () => {
    describe('when a valid file is specified', () => {
      it('should delete the specified file', () => {

      });
    });
  })
});
