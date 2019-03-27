import Route from '@ember/routing/route';

export default Route.extend({
  queryParams: {
    channelId: {
      refreshModel: true
    }
  },

  model(params) {
    return params;
  }
});
