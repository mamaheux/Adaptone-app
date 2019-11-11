import steps from './steps';

export default class Configuration {
  constructor() {
    this.id = null;
    this.name = null;
    this.monitorsNumber = null;
    this.speakersNumber = null;
    this.positions = [];
    this.step = steps['initial-parameters'];
    this.isUniformizationOn = true;
  }
}
