import {expect} from 'chai';
import {describe, it, beforeEach} from 'mocha';
import {setupTest} from 'ember-mocha';
import sinon from 'sinon';
import Channels from 'adaptone-front/constants/channels';

describe('Unit | Component | aa-eq', function() {
  setupTest();

  let component;
  const onEqChangeSpy = sinon.spy();
  const updateEqGainsConfigSpy = sinon.spy();
  const originalDebounce = Ember.run.debounce;

  beforeEach(function() {
    const parametricFilters = [
      {
        id: 0,
        on: true,
        freq: 100,
        q: 1,
        gain: 0
      },
      {
        id: 1,
        on: true,
        freq: 300,
        q: 5,
        gain: 1
      },
      {
        id: 2,
        on: true,
        freq: 800,
        q: 5,
        gain: 2
      },
      {
        id: 3,
        on: true,
        freq: 1500,
        q: 5,
        gain: 3
      },
      {
        id: 4,
        on: true,
        freq: 8000,
        q: 1,
        gain: 4
      }
    ];

    const graphicFilters = [
      {
        id: 0,
        value: 0
      },
      {
        id: 0,
        value: 1
      },
      {
        id: 0,
        value: 2
      },
      {
        id: 0,
        value: 3
      },
      {
        id: 0,
        value: 4
      }
    ];

    const parametricEqGraphValues = [
      [0, 0],
      [100, 1],
      [1000, 2],
      [10000, 3],
    ];

    const graphicEqGraphValues = [
      [0, 4],
      [100, 5],
      [1000, 6],
      [10000, 7],
    ];

    component = this.owner.factoryFor('component:aa-eq').create({
      auxiliaryChannelId: 5,
      channelId: 1,
      parametricFilters,
      graphicFilters,
      parametricEqGraphValues,
      graphicEqGraphValues,
      isMasterOutput: false,
      isAuxiliaryOutput: false,
      onEqChange: onEqChangeSpy
    });

    component.updateEqGainsConfig = updateEqGainsConfigSpy;

    Ember.run.debounce = function(target, func, arg, _) {
      func.call(target, arg);
    }
  });

  afterEach(function() {
    Ember.run.debounce = originalDebounce;
  });

  describe('computed', () => {
    describe('biquadCoefficients', () => {
      it('should return an array of empty objects of graphicFilter`s length', () => {
        expect(component.get('biquadCoefficients').length).to.equal(5);
      });
    });
  });

  describe('observers', () => {
    describe('currentFilterChanged', () => {
      describe('when the selected filter changes', () => {
        describe('when the filter is not an extrema', () => {
          it('should correctly set the max, mid and min frequencies of the current filter', () => {
            component.set('currentFilter', {
              id: 3,
              on: true,
              freq: 1500,
              q: 5,
              gain: 3
            });

            expect(component.get('currentFilter').maxFrequency).to.equal(8000);
            expect(component.get('currentFilter').midFrequency).to.equal(3600);
            expect(component.get('currentFilter').minFrequency).to.equal(800);
          });
        });

        describe('when the filter is the first filter of the array', () => {
          it('should correctly set the max, mid and min frequencies of the current filter', () => {
            component.set('currentFilter', {
              id: 0,
              on: true,
              freq: 100,
              q: 1,
              gain: 0
            });

            expect(component.get('currentFilter').maxFrequency).to.equal(300);
            expect(component.get('currentFilter').midFrequency).to.equal(140);
            expect(component.get('currentFilter').minFrequency).to.equal(20);
          });
        });

        describe('when the filter is the last filter of the array', () => {
          it('should correctly set the max, mid and min frequencies of the current filter', () => {
            component.set('currentFilter', {
              id: 4,
              on: true,
              freq: 8000,
              q: 1,
              gain: 4
            });

            expect(component.get('currentFilter').maxFrequency).to.equal(20000);
            expect(component.get('currentFilter').midFrequency).to.equal(9250);
            expect(component.get('currentFilter').minFrequency).to.equal(1500);
          });
        });
      });
    });
  });

  describe('onInit', () => {
    it('should correctly initialize and max, mid and min frequencies of the current filter of the first filter', () => {
      expect(component.get('currentFilter').maxFrequency).to.equal(300);
      expect(component.get('currentFilter').midFrequency).to.equal(140);
      expect(component.get('currentFilter').minFrequency).to.equal(20);
    });
  });

  describe('updateSelectedFilter', () => {
    it('should update the selected filter, set the current filter selected attribute to true and the previous to false', () => {
      component.updateSelectedFilter({
        id: 0,
        on: true,
        freq: 100,
        q: 1,
        gain: 0
      });

      component.updateSelectedFilter({
        id: 4,
        on: true,
        freq: 8000,
        q: 1,
        gain: 4
      });

      expect(component.get('parametricFilters')[0].isSelected).to.be.false;
      expect(component.get('currentFilter').id).to.equal(4);
      expect(component.get('currentFilter').isSelected).to.be.true;
    });
  });

  describe('updateParametricEqDesigner', () => {
    it('should get the biquadCoefficients, send the correct eq gains to the connection and send the correct eq gains to the graph', () => {
      const connectionSpy = sinon.spy();
      component.connection.sendMessage = connectionSpy;

      component.updateParametricEqDesigner(component.get('parametricFilters'));

      const expectedMessage = {
        seqId: 12,
        data: {
          auxiliaryChannelId: 5,
          channelId: 1,
          gains: [1.0001138498297046, 1.000178518631525, 1.0002850578865543, 1.0004640966471703, 1.0007356512699104, 1.0011960699251192, 1.0020081586651288, 1.0033389111132027, 1.0057826350211236, 1.0115864927865514, 1.0252952995294304, 1.0705524316998496, 1.125937127094078, 1.05748037097853, 1.0553311234979985, 1.1186397250513802, 1.2961049071341295, 1.177372733982291, 1.2423630507720227, 1.374741581198519, 1.1086688627596593, 1.0264320885777678, 0.9929844799098513, 0.9766724113216847, 0.9898155936092002, 1.1000078887402982, 1.3908809594859064, 1.6082831088835425, 1.6397608382019162, 1.60865498293929, 1.5875007619048556]
        }
      }

      const expectedBiquadCoefficients = [
        {b0: 1, b1: 0, b2: 0, a1: 0, a2: 0},
        {b0: 1.0009752510386531, b1: -1.982202630801318, b2: 0.9830394450295399, a1: -1.9822026308013179, a2: 0.9840146960681929},
        {b0: 1.0051227636956637, b1: -1.9477098028643884, b2: 0.9553078200761923, a1: -1.947709802864388, a2: 0.9604305837718558},
        {b0: 1.0141196336601448, b1: -1.8876046903031483, b2: 0.9174277668410323, a1: -1.8876046903031483, a2: 0.9315474005011769},
        {b0: 1.3659866245222563, b1: -1.1447507395663872, b2: 0.5794784827912579, a1: -0.5745400084354133, a2: 0.3752543761825408}
      ];

      const expectedParametricEqGraphValues = [
        [20, 0.0009888307680877267],
        [25.178508235883346, 0.0015728943444899058],
        [31.697863849222273, 0.0025073166221537815],
        [39.905246299377595, 0.004010608327544511],
        [50.23772863019161, 0.006450765715215946],
        [63.2455532033676, 0.010469076090565637],
        [79.62143411069947, 0.017243229033332783],
        [100.23744672545449, 0.02911493149479078],
        [126.1914688960387, 0.05132919574296127],
        [158.86564694485637, 0.0978989074594473],
        [200.00000000000009, 0.21697932707252485],
        [251.78508235883356, 0.6128536318709157],
        [316.97863849222284, 1.0173266383028468],
        [399.05246299377615, 0.48799408012866313],
        [502.37728630191634, 0.4716862851837427],
        [632.4555320336763, 0.9904218202508668],
        [796.214341106995, 2.248450798086252],
        [1002.3744672545453, 1.4130888922253733],
        [1261.9146889603874, 1.9514908023528987],
        [1588.6564694485642, 2.825095202468435],
        [2000.0000000000016, 0.8960370086307832],
        [2517.8508235883364, 0.2142740787257019],
        [3169.78638492223, -0.0666876931915446],
        [3990.524629937763, -0.20444618370140888],
        [5023.772863019166, -0.08086538725245843],
        [6324.555320336766, 0.8543193037160256],
        [7962.143411069955, 2.825265031704116],
        [10023.74467254546, 4.133380950991905],
        [12619.146889603882, 4.29159371648926],
        [20000, 4.014278847985716]
      ]

      expect(connectionSpy.calledWith(expectedMessage)).to.be.true;
      expect(component.get('biquadCoefficients')).to.deep.equal(expectedBiquadCoefficients);
      expect(component.get('parametricEqGraphValues')).to.deep.equal(expectedParametricEqGraphValues);
    });
  });

  describe('processInterpolatedData', () => {
    it('should send the correctly interpolated gains to the connection and send the correct eq gains to the graph', () => {
        const connectionSpy = sinon.spy();
        component.connection.sendMessage = connectionSpy;

        const expectedMessage = {
          seqId: 12,
          data: {
            auxiliaryChannelId: 5,
            channelId: 1,
            gains: [1, 1, 1, 1, 1, 1.0020337580152239, 1.0136367620830353, 1.0274594854461803, 1.0450032642862224, 1.0700689556931748, 1.0994524986084409, 1.1258242220169277, 1.138282345254032, 1.1547819846894583, 1.1744997838190843, 1.2006371156633722, 1.2356963524099402, 1.2651823075033883, 1.2827262173978928, 1.3076971493921024, 1.336831144962215, 1.3741630846010062, 1.4147568916745927, 1.4273992181725854, 1.4424172552410661, 1.462177174456718, 1.4884260856962914, 1.5199110829529336, 1.5602055490341393, 1.5848931924611136, 1.5848931924611136]
          }
        };

        const expectedGraphicEqGraphValues = [
          [20,0],
          [25.178508235883346,0],
          [31.697863849222273,0],
          [39.905246299377595,0],
          [50.23772863019161,0],
          [63.2455532033676,0.019091489431574113],
          [79.62143411069947,0.11542020065117334],
          [100.23744672545449,0.23669086309090875],
          [126.1914688960387,0.3893615817414041],
          [158.86564694485637,0.5815626290873904],
          [200.00000000000009,0.8235294117647064],
          [251.78508235883356,1.032036885821814],
          [316.97863849222284,1.127909762488563],
          [399.05246299377615,1.2486065632261414],
          [502.37728630191634,1.4005548327969357],
          [632.4555320336763,1.5918463706377592],
          [796.214341106995,1.8326681486867573],
          [1002.3744672545453,2.04419830969117],
          [1261.9146889603874,2.1683802339523384],
          [1588.6564694485642,2.324716014090222],
          [2000.0000000000016,2.5215311004784695],
          [2517.8508235883364,2.769306614157099],
          [3169.78638492223,3.015435125902021],
          [3990.524629937763,3.0900476936307055],
          [5023.772863019166,3.1839793511835603],
          [6324.555320336766,3.3022323018487967],
          [7962.143411069955,3.451103946460905],
          [10023.74467254546,3.638522242958678],
          [12619.146889603882,3.874467899054898],
          [20000,4]];

        component.processInterpolatedData();

        expect(connectionSpy.calledWith(expectedMessage)).to.be.true;
        expect(component.get('graphicEqGraphValues')).to.deep.equal(expectedGraphicEqGraphValues);
    });
  });
});
