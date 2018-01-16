define( ['App',
    'backbone',
    'backbone-radio',
    'bootbox',
    'marionette',
    'jquery',
    'views/BaseView',
    'text!templates/boat_resource_edit_view.tmpl'],
    function(App, Backbone, Radio, bootbox, Marionette, $, BaseView, template) {
        return BaseView.extend({
            initialize: function() {
                this.mainRadioChannel = Radio.channel('main');
                this.unitCollection = this.options.unitCollection
            },

            events: {
                'click #resource-submit': 'saveResource',
                'click #resource-delete': 'deleteResource',
                'click #resource-cancel': 'viewResource',
                'change .required': 'checkRequired',
                'change .validated-data': 'validateData'
            },

            render: function() {
                var variables = {
                    resource: this.model,
                    unit_collection: this.unitCollection
                }
                var tmpl = _.template(template);
                this.$el.html(tmpl(variables));
            },

            viewResource: function(e) {
                e.preventDefault();
                window.App.router.navigate('boat-resource-details/' + this.model.getId(), {trigger: true});
            },
            deleteResource: function(e) {
                var me = this;
                e.preventDefault();

                bootbox.confirm({
                    message: "Olet poistamassa venepaikkaa. Kaikki venepaikan varaukset poistuvat samalla. Oletko varma?",
                    buttons: {
                        confirm: {
                            label: 'Poista',
                            className: 'btn-danger'
                        },
                        cancel: {
                            label: 'Peruuta',
                            className: 'btn-default'
                        }
                    },
                    callback: function (result) {
                        if(result) {
                            me.model.destroy()
                            .done(function() {
                                me.mainRadioChannel.trigger('resource-changed');
                            })
                            .fail(function(result) {
                                me.showRequestErrors(result.responseJSON);
                            });
                        }
                    }
                });
            },
            saveResource: function(e) {
                var me = this;
                e.preventDefault();
                var data = this.objectifyForm($('#edit-resource-form').serializeArray());
                data = this.validateAndReformatData(data);

                if(!data)
                    return;

                this.model.set('depth_cm', data.depth_cm);
                this.model.set('width_cm', data.width_cm);
                this.model.set('length_cm', data.length_cm);
                this.model.set('type', data.type);
                this.model.set('price', data.price);
                this.model.set('is_disabled', data.is_disabled);

                var resource = this.model.get('resource');

                resource.name.fi = data.resource.name;
                resource.description = data.resource.description ? {fi: data.resource.description} : {fi:''};
                resource.unit_id = data.resource.unit_id;

                this.model.set('resource', resource);

                this.model.save()
                .done(function(data) {
                    me.mainRadioChannel.trigger('resource-changed', data.id);
                    window.App.router.navigate('boat-resource-details/' + me.model.getId(), {trigger: true});
                })
                .fail(function(result) {
                    me.showRequestErrors(result.responseJSON);
                });
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
                        length.next('span.error').find('p').text('Valitse arvo väliltä 0-10');
                        isValid = false;
                    }

                    if(width.val() < 0 || width.val() > 10) {
                        width.addClass('validation-error');
                        width.next('span.error').find('p').text('Valitse arvo väliltä 0-10');
                        isValid = false;
                    }

                    if(depth.val() < 0 ||depth.val() > 10) {
                        depth.addClass('validation-error');
                        depth.next('span.error').find('p').text('Valitse arvo väliltä 0-10');
                        isValid = false;
                    }
                }

                return isValid;
            },

            validateAndReformatData: function(data) {
                if(!this.checkRequired() || !this.validateData())
                    return false;

                data.resource = {
                    name: data.name,
                    name_fi: data.name,
                    description: data.description,
                    description_fi: data.description,
                    slug: data.name,
                    unit_id: data.unit,
                    authentication: 'none'
                }
                delete data.name;
                delete data.unit;
                data.length_cm = data.length_cm ? Number(data.length_cm) * 100 : 0;
                data.width_cm = data.width_cm ? Number(data.width_cm) * 100 : 0;
                data.depth_cm = data.depth_cm ? Number(data.depth_cm) * 100 : 0;
                data.is_disabled = data.is_disabled ? true : false;
                data.price = Number(data.price);

                return data;
            }
        });
    });
