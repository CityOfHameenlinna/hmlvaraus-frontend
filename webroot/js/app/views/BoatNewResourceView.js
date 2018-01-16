define( ['App',
    'backbone',
    'backbone-radio',
    'bootbox',
    'marionette',
    'jquery',
    'views/BaseView',
    'text!templates/boat_new_resource_view.tmpl'],
    function(App, Backbone, Radio, bootbox, Marionette, $, BaseView, template) {
        return BaseView.extend({
            initialize: function() {
                this.unitCollection = this.options.unitCollection;
                this.mainRadioChannel = Radio.channel('main');
            },

            render: function() {
                var variables = {
                    unit_collection: this.unitCollection
                }

                var tmpl = _.template(template);
                this.$el.html(tmpl(variables));
            },

            events: {
                'click #resource-submit': 'save',
                'change .required': 'checkRequired',
                'change .validated-data': 'validateData'
            },

            validateAndReformatData: function(data) {
                if(!this.checkRequired() || !this.validateData())
                    return false;

                data.resource = {
                    name: data.name,
                    name_fi: data.name,
                    description: data.description,
                    description_fi: data.description,
                    unit_id: data.unit,
                    reservable: true
                }
                delete data.name;
                delete data.unit;
                data.length_cm = data.length_cm ? Number(data.length_cm) * 100 : 0;
                data.width_cm = data.width_cm ? Number(data.width_cm) * 100 : 0;
                data.depth_cm = data.depth_cm ? Number(data.depth_cm) * 100 : 0;
                data.price = Number(data.price);

                return data;
            },

            validateData: function(e) {
                var isValid = true;

                if(e) {
                    target = $(e.currentTarget);
                    if(target.hasClass('berth-size')) {
                        if(target.val() < 0 ||target.val() > 10) {
                            target.addClass('validation-error');
                            target.next('span.error').find('p').text('Valitse arvo väliltä 0-10');
                            isValid = false;
                        }
                        else {
                            target.removeClass('validation-error');
                            target.next('span.error').find('p').text('');
                        }
                    }
                }
                else {
                    var length = $('#resource-berth-length');
                    var width = $('#resource-berth-width');
                    var depth = $('#resource-berth-depth');

                    if(length.val() < 0 || length.val() > 10) {
                        length.addClass('validation-error');
                        length.next('span.error').find('p').text('Pituus tulisi olla 0 tai suurempi');
                        isValid = false;
                    }

                    if(width.val() < 0 || width.val() > 10) {
                        width.addClass('validation-error');
                        width.next('span.error').find('p').text('Leveys tulisi olla 0 tai suurempi');
                        isValid = false;
                    }

                    if(depth.val() < 0 ||depth.val() > 10) {
                        depth.addClass('validation-error');
                        depth.next('span.error').find('p').text('Syväys tulisi olla 0 tai suurempi');
                        isValid = false;
                    }
                }

                return isValid;
            },
            save: function(e) {
                var me = this;
                e.preventDefault();
                var bodyJson = this.objectifyForm($('#new-resource-form').serializeArray());

                bodyJson = this.validateAndReformatData(bodyJson);

                if(!bodyJson)
                    return;

                $.ajax({
                    url: '/api/berth/',
                    method: 'post',
                    data: JSON.stringify(bodyJson),
                    dataType: 'json',
                    contentType: 'application/json'
                })
                .done(function(data) {
                    me.mainRadioChannel.trigger('resource-changed', data.id);
                })
                .fail(function(result) {
                    me.showRequestErrors(result.responseJSON);
                });
            },
        });
    });
