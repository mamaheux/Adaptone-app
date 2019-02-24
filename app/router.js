import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('configs');
  this.route('initial-parameters');
  this.route('probe-initialization');
});

export default Router;
