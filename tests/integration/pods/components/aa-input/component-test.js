import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | aa-input', function() {
  setupComponentTest('aa-input', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#aa-input}}
    //     template content
    //   {{/aa-input}}
    // `);

    this.render(hbs`{{aa-input}}`);
    expect(this.$()).to.have.length(1);
  });
});
