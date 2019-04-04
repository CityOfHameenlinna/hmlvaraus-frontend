define( ['App',
    'backbone',
    'backbone-radio',
    'marionette',
    'jquery',
    'moment',
    'text!templates/unit_details_view.tmpl',
    'leaflet'
    ],
    function(App, Backbone, Radio, Marionette, $, moment, template, L) {
        return Marionette.View.extend({
            initialize: function() {
                this.currentUser = window.App.userCollection.currentUser;
                this.mainRadioChannel = Radio.channel('main');
            },
            events: {
                'click #unit-edit': 'editUnit',
                'click #to-units-boats': 'toUnitsBoats'
            },

            ui: {
                mapContainer: "#google-map"
            },
            render: function() {
                var me = this;

                var variables = {
                    currentUser: this.currentUser,
                    unit: this.model,
                    is_deleted: this.model.isDeleted()
                }
                var tmpl = _.template(template);
                this.$el.html(tmpl(variables));

                setTimeout(function() {
                    me.setupMap();
                }, 10);
            },

            setupMap: function() {
                var me = this;
                var default_location = {
                    lng: 24.4590,
                    lat: 60.9929
                }

                var cMarker = L.icon({
                    iconUrl:       '/static/img/marker-icon.png',
                    iconRetinaUrl: '/static/img/marker-icon-2x.png',
                    shadowUrl:     '/static/img/marker-shadow.png',
                    iconSize:    [25, 41],
                    iconAnchor:  [12, 41],
                    popupAnchor: [1, -34],
                    tooltipAnchor: [16, -28],
                    shadowSize:  [41, 41]
                });

                var modelLocation = this.model.getLocation();

                var map = L.map(this.$('#map')[0], {
                }).setView(modelLocation ? modelLocation : default_location, 15);

                L.tileLayer.wms('https://kartta.hameenlinna.fi/teklaogcweb/WMS.ashx?', {
                    layers: 'Opaskartta'
                }).addTo(map);

                var marker = L.marker(modelLocation ? modelLocation : default_location, {icon: cMarker}).addTo(map);
            },

            editUnit: function() {
                window.App.router.navigate('unit-edit/' + this.model.getId(), {trigger: true});
            },

            toUnitsBoats: function() {
                if (this.currentUser) {
                    this.showBoatResourcesTotal();
                }
                else {
                    this.showBoatResourcesFree();
                }
                window.App.router.navigate('boat-resources', {trigger: true});
                this.mainRadioChannel.trigger('navigated', '#nav-resources');
            },

            showBoatResourcesTotal: function(e) {
                var filters = {
                    show: true,
                    unit_id: this.model.getId()
                };
                localStorage.setItem('boat_resource_filters', JSON.stringify(filters));
            },

            showBoatResourcesFree: function(e) {
                var filters = {
                    show: true,
                    berth_begin: moment().toISOString(),
                    berth_end: moment().toISOString(),
                    date_filter_type: 'not_reserved',
                    unit_id: this.model.getId()
                };
                localStorage.setItem('boat_resource_filters', JSON.stringify(filters));
            },
        });
    });
