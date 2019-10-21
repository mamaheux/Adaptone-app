import Service from '@ember/service';
import {computed} from '@ember/object';

export default Service.extend({
  probes: null,

  state: computed({
    get() {
      return this.get('probes');
    },

    set(_, probes) {
      const probesState = probes.map(probe => {
        return {
          id: probe.id,
          selected: probe.selected
        };
      });

      this.set('probes', probesState);

      return probesState;
    }
  })
});
