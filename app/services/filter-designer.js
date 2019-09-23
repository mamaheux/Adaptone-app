/* eslint-disable no-magic-numbers */

import Service from '@ember/service';
import {set} from '@ember/object';

import mathjs from 'mathjs';

const SAMPLE_FREQUENCY = 44100;

export default Service.extend({
  designLowShelvingFilter(biquadCoefficients, parameter) {
    const k = Math.tan((Math.PI * parameter.freq) / SAMPLE_FREQUENCY);
    let v0 = Math.pow(10, parameter.gain / 20);
    const root2 = 1 / parameter.q;

    if (v0 < 1) {
      v0 = 1 / v0;
    }

    if (parameter.gain > 0) {
      set(biquadCoefficients, 'b0', (1 + Math.sqrt(v0) * root2 * k + v0 * k * k) / (1 + root2 * k + k * k));
      set(biquadCoefficients, 'b1', (2 * (v0 * k * k - 1)) / (1 + root2 * k + k * k));
      set(biquadCoefficients, 'b2', (1 - Math.sqrt(v0) * root2 * k + v0 * k * k) / (1 + root2 * k + k * k));
      set(biquadCoefficients, 'a1', (2 * (k * k - 1)) / (1 + root2 * k + k * k));
      set(biquadCoefficients, 'a2', (1 - root2 * k + k * k) / (1 + root2 * k + k * k));
    } else if (parameter.gain < 0) {
      set(biquadCoefficients, 'b0', (1 + root2 * k + k * k) / (1 + root2 * Math.sqrt(v0) * k + v0 * k * k));
      set(biquadCoefficients, 'b1', (2 * (k * k - 1)) / (1 + root2 * Math.sqrt(v0) * k + v0 * k * k));
      set(biquadCoefficients, 'b2', (1 - root2 * k + k * k) / (1 + root2 * Math.sqrt(v0) * k + v0 * k * k));
      set(biquadCoefficients, 'a1', (2 * (v0 * k * k - 1)) / (1 + root2 * Math.sqrt(v0) * k + v0 * k * k));
      set(biquadCoefficients, 'a2', (1 - root2 * Math.sqrt(v0) * k + v0 * k * k) / (1 + root2 * Math.sqrt(v0) * k + v0 * k * k));
    } else {
      set(biquadCoefficients, 'b0', v0);
      set(biquadCoefficients, 'b1', 0);
      set(biquadCoefficients, 'b2', 0);
      set(biquadCoefficients, 'a1', 0);
      set(biquadCoefficients, 'a2', 0);
    }
  },

  designHighShelvingFilter(biquadCoefficients, parameter) {
    const k = Math.tan((Math.PI * parameter.freq) / SAMPLE_FREQUENCY);
    let v0 = Math.pow(10, parameter.gain / 20);
    const root2 = 1 / parameter.q;

    if (v0 < 1) {
      v0 = 1 / v0;
    }

    if (parameter.gain > 0) {
      set(biquadCoefficients, 'b0', (v0 + root2 * Math.sqrt(v0) * k + k * k) / (1 + root2 * k + k * k));
      set(biquadCoefficients, 'b1', (2 * (k * k - v0)) / (1 + root2 * k + k * k));
      set(biquadCoefficients, 'b2', (v0 - root2 * Math.sqrt(v0) * k + k * k) / (1 + root2 * k + k * k));
      set(biquadCoefficients, 'a1', (2 * (k * k - 1)) / (1 + root2 * k + k * k));
      set(biquadCoefficients, 'a2', (1 - root2 * k + k * k) / (1 + root2 * k + k * k));
    } else if (parameter.gain < 0) {
      set(biquadCoefficients, 'b0', (1 + root2 * k + k * k) / (v0 + root2 * Math.sqrt(v0) * k + k * k));
      set(biquadCoefficients, 'b1', (2 * (k * k - 1)) / (v0 + root2 * Math.sqrt(v0) * k + k * k));
      set(biquadCoefficients, 'b2', (1 - root2 * k + k * k) / (v0 + root2 * Math.sqrt(v0) * k + k * k));
      set(biquadCoefficients, 'a1', (2 * ((k * k) / v0 - 1)) / (1 + root2 / Math.sqrt(v0) * k + (k * k) / v0));
      set(biquadCoefficients, 'a2', (1 - root2 / Math.sqrt(v0) * k + (k * k) / v0) / (1 + root2 / Math.sqrt(v0) * k + (k * k) / v0));
    } else {
      set(biquadCoefficients, 'b0', v0);
      set(biquadCoefficients, 'b1', 0);
      set(biquadCoefficients, 'b2', 0);
      set(biquadCoefficients, 'a1', 0);
      set(biquadCoefficients, 'a2', 0);
    }
  },

  designPeakFilter(biquadCoefficients, parameter) {
    const wC = 2 * Math.PI * parameter.freq / SAMPLE_FREQUENCY;
    const mu = Math.pow(10, parameter.gain / 20);
    const kQ = 4 / (1 + mu) * Math.tan(wC / (2 * parameter.q));
    const cPk = (1 + kQ * mu) / (1 + kQ);

    set(biquadCoefficients, 'b0', cPk);
    set(biquadCoefficients, 'b1', cPk * (-2 * Math.cos(wC) / (1 + kQ * mu)));
    set(biquadCoefficients, 'b2', cPk * (1 - kQ * mu) / (1 + kQ * mu));

    set(biquadCoefficients, 'a1', -2 * Math.cos(wC) / (1 + kQ));
    set(biquadCoefficients, 'a2', (1 - kQ) / (1 + kQ));
  },

  parametricEqDesignGainsDb(biquadCoefficients, frequencies) {
    const w = mathjs.divide(mathjs.multiply(2 * Math.PI, mathjs.matrix(frequencies)), SAMPLE_FREQUENCY);

    const j = mathjs.complex(0, -1);

    const jw = mathjs.multiply(j, w);
    const jw2 = mathjs.multiply(2, jw);

    let h = mathjs.ones(frequencies.length);

    biquadCoefficients.forEach(coefficient => {
      const a = mathjs.add(
        mathjs.add(
          coefficient.b0,
          mathjs.multiply(
            coefficient.b1,
            mathjs.exp(jw)
          )
        ),
        mathjs.multiply(coefficient.b2, mathjs.exp(jw2))
      );

      const b = mathjs.add(
        mathjs.add(1, mathjs.multiply(coefficient.a1, mathjs.exp(jw))),
        mathjs.multiply(coefficient.a2, mathjs.exp(jw2))
      );

      h = mathjs.dotMultiply(
        h,
        mathjs.dotDivide(a, b)
      );
    });

    const gains = mathjs.dotMultiply(20, mathjs.log10(mathjs.abs(h)));

    return gains._data;
  }
});
