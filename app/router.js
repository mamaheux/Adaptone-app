import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('configs');
  this.route('console-loading');
  this.route('initial-parameters');
  this.route('optimization');
  this.route('probe-initialization');
  this.route('probe-positioning');
  this.route('probe-positions');
  this.route('optimal-positions');
});

export default Router;
