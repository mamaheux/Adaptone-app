import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | aa-initial-parameters-form', function() {
  setupComponentTest('aa-initial-parameters-form', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#aa-initial-parameters-form}}
    //     template content
    //   {{/aa-initial-parameters-form}}
    // `);

    this.render(hbs`{{aa-initial-parameters-form}}`);
    expect(this.$()).to.have.length(1);
  });
});
