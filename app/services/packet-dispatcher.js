import Service from '@ember/service';
import Evented from '@ember/object/evented';
import SequenceIds from 'adaptone-front/constants/sequence-ids'

export default Service.extend(Evented, {
  dispatch(rawMessage) {
    const message = JSON.parse(rawMessage);

    switch(message.seqId) {
      case SequenceIds.ERROR_RATES:
        this.trigger('error-rates', message.data);
        break;
      case SequenceIds.INPUT_SPECTRUM:
        this.trigger('input-spectrum', message.data);
        break;
      case SequenceIds.CONFIRM_POS:
        this.trigger('positions', message.data);
        break;
      case SequenceIds.OPTIMIZED_POS:
        this.trigger('optimized-positions', message.data);
        break;
    }
  }
});
