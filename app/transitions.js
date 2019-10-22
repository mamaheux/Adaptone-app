const ANIMATION_DURATION = 300;

export default function() {
  this.transition(
    this.toRoute([
      'configs',
      'console',
      'console-loading',
      'initial-parameters',
      'optimal-positions',
      'optimization',
      'probe-initialization',
      'probe-positions']
    ),
    this.use('fade', {duration: ANIMATION_DURATION})
  );

  this.transition(
    this.hasClass('channel-details-transition'),
    this.toValue(true),
    this.use('toUp', {duration: ANIMATION_DURATION}),
    this.reverse('toDown', {duration: ANIMATION_DURATION})
  );

  this.transition(
    this.hasClass('eq-type-transition'),
    this.toValue(true),
    this.use('crossFade', {duration: ANIMATION_DURATION}),
    this.reverse('crossFade', {duration: ANIMATION_DURATION})
  );
}
