define( [
	'App',
	'backbone',
	'marionette',
	'jquery',
	'bootbox',
	'models/PurchaseModel',
    'models/BoatReservationModel',
    'models/BoatResourceModel',
    'models/UnitModel',
	'text!templates/purchase_result_view.tmpl'
],
	function(App, Backbone, Marionette, $, bootbox, PurchaseModel, BoatReservationModel, BoatResourceModel,
		UnitModel, template) {
        return Marionette.View.extend({
        	initialize: function() {
        		this.code = this.options.code;
        	},

        	render: function() {
        		var me = this;
        		this.model = new PurchaseModel();

        		this.model.fetch({data:{code:this.code}})
        		.done(function(data) {
					me.reservationModel = new BoatReservationModel(me.model.get('hml_reservation'));
					me.resourceModel = new BoatResourceModel(me.reservationModel.get('berth'));
					me.unitModel = new UnitModel(me.resourceModel.get('resource').unit);
        			me._render();
        		})
        		.fail(function(err) {
                    bootbox.alert('Virhe maksun käsittelyssä! Ota yhteyttä asiakaspalveluun.')
        		});
        	},

            _render: function() {
                var variables = {
					model: this.model,
					reservation_model: this.reservationModel,
                    resource_model: this.resourceModel,
                    unit_model: this.unitModel
                }

                var tmpl = _.template(template);
                this.$el.html(tmpl(variables));

                this.model.patch({'report_seen': true, 'code': this.code});
            }
        });
    });