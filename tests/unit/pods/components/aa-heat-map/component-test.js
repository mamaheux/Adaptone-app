import {expect} from 'chai';
import {describe, it, beforeEach} from 'mocha';
import {setupTest} from 'ember-mocha';
import sinon from 'sinon';
import h337 from 'heatmap.js';

describe('Unit | Component | aa-heat-map', function() {
  setupTest();

  let component;
  
  beforeEach(function() {
    const positions = [
      {
        x: 5,
        y: 5,
        type: 's'
      },
      {
        x: 90,
        y: 5,
        type: 's'
      },
      {
        x: 45,
        y: 10,
        type: 's'
      },
      {
        x: 5,
        y: 10,
        type: 'm',
        errorRate: 0.12
      },
      {
        x: 10,
        y: 15,
        type: 'm',
        errorRate: 0.09
      },
      {
        x: 30,
        y: 30,
        type: 'm',
        errorRate: 0.07
      },
      {
        x: 50,
        y: 15,
        type: 'm',
        errorRate: 0.09
      },
      {
        x: 80,
        y: 30,
        type: 'm',
        errorRate: 0.13
      }
    ];

    const micPositions = positions.filter(position => position.type === 'm');
    const speakerPositions = positions.filter(position => position.type === 's');

    component = this.owner.factoryFor('component:aa-heat-map').create({
      max: 0.15,
      min: 0,
      radius: 250,
      micPositions,
      speakerPositions
    });
  });

  describe('generateHeatMap', () => {
    it('should correctly generate the heat map with the correct data', () => {
      const setDataSpy = sinon.spy();
      const addDataSpy = sinon.spy();

      const heatMap = {
        setData: setDataSpy,
        addData: addDataSpy
      };

      sinon.stub(h337, 'create').returns(heatMap);

      component.generateHeatMap(null);

      const expectedSetDataArgument = {
        max: 0.15,
        min: 0,
        data: []
      }

      expect(setDataSpy.calledWith(expectedSetDataArgument)).to.be.true;
      expect(addDataSpy.calledWith({x: 20, y: 30, value: 0.12})).to.be.true;
      expect(addDataSpy.calledWith({x: 25, y: 35, value: 0.09})).to.be.true;
      expect(addDataSpy.calledWith({x: 45, y: 50, value: 0.07})).to.be.true;
      expect(addDataSpy.calledWith({x: 65, y: 35, value: 0.09})).to.be.true;
      expect(addDataSpy.calledWith({x: 95, y: 50, value: 0.13})).to.be.true;
    });
  });
});
