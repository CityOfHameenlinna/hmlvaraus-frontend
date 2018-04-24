define( [
    'App',
    'backbone',
    'marionette',
    'jquery',
    'bootbox',
    'models/BoatReservationModel',
    'models/BoatResourceModel',
    'models/UnitModel',
    'text!templates/reservation_result_view.tmpl'
],
    function(App, Backbone, Marionette, $, bootbox, BoatReservationModel, BoatResourceModel, UnitModel, template) {
        return Marionette.View.extend({
        	initialize: function() {
        	},

        	render: function() {
                var me = this;
                this.model = new BoatReservationModel();
                this.model.set('id', this.options.modelId);
                this.model.fetch()
                .done(function(data) {
                    me.resourceModel = new BoatResourceModel(me.model.get('berth'));
                    me.unitModel = new UnitModel(me.resourceModel.get('resource').unit);
                    me._render();
                })
        	},

            _render: function() {
                var variables = {
                    reservation_model: this.model,
                    resource_model: this.resourceModel,
                    unit_model: this.unitModel
                }

                var tmpl = _.template(template);
                this.$el.html(tmpl(variables));
            }
        });
    });