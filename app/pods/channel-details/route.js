import Route from '@ember/routing/route';

export default Route.extend({
  queryParams: {
    channel: {
      refreshModel: true
    }
  },

  model(params) {
    return {
      channel: JSON.parse(params.channel)
    };
  }
});
