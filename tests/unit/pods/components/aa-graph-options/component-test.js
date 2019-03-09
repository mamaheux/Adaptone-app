import {expect} from 'chai';
import {describe, it, beforeEach} from 'mocha';
import {setupComponentTest} from 'ember-mocha';

describe('Unit | Component | aa-graph-options', function() {
  setupComponentTest('aa-graph-options', {
    unit: true
  });

  let component;

  beforeEach(function() {
    const options = [
      {name: '1', checked: false},
      {name: '2', checked: true},
      {name: '3', checked: false},
      {name: '4', checked: true},
      {name: '5', checked: false},
      {name: '6', checked: true},
      {name: '7', checked: false}
    ];

    component = this.subject();
    component.set('options', options);
  });

  describe('functions', () => {
    describe('splitIntoColumns', () => {
      it('should split the options into columns with 3 items per row', () => {
        component.set('columns', component.splitIntoColumns());

        expect(Object.keys(component.get('columns')).length).to.equal(3);
        expect(component.get('columns')[0].length).to.equal(3);
        expect(component.get('columns')[1].length).to.equal(3);
        expect(component.get('columns')[2].length).to.equal(1);
      });
    });
  });
});
