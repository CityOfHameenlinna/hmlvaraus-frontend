define( [
    'App', 
    'backbone',
    'backbone-radio',
    'marionette', 
    'jquery', 
    'text!templates/unit_filter_view.tmpl'
    ],
    function(App, Backbone, Radio, Marionette, $, template) {
        return Marionette.View.extend({
            tagName: 'div',
            className: 'filter-container',
            template: template,
            filters: {},

            initialize: function() {
                this.mainRadioChannel = Radio.channel('main');
                var filterData = localStorage.getItem('unit_filters');
                if(filterData) {
                    this.filters = JSON.parse(filterData);
                }
            },

            regions: {
            },

            events: {
                'change .filter-input': 'filterInputChanged',
                'click #show-filters': 'showFilters',
                'click #filter-clear': 'clearFilters'
            },

            clearFilters: function(e) {
                this.$('textarea,input,select').val('');
                this.filters = {};
                localStorage.setItem('unit_filters', JSON.stringify(this.filters));
                this.mainRadioChannel.trigger('unit-filter-changed');
                $('.ordering-icon').removeClass('glyphicon-triangle-bottom glyphicon-triangle-top');
            },

            showFilters: function(e) {
                if($('#filters').hasClass('in')) {
                    $(e.currentTarget).text('Näytä suodattimet');
                    this.filters.show = false;
                    localStorage.setItem('unit_filters', JSON.stringify(this.filters));
                }
                else {
                    $(e.currentTarget).text('Piilota suodattimet');
                    this.filters.show = true;
                    localStorage.setItem('unit_filters', JSON.stringify(this.filters));
                }
            },

            filterInputChanged: function(e) {
                var target = $(e.currentTarget);

                var filterName = target.attr('name');

                var value = target.val();

                if(target.hasClass('float-filter')) {
                     value = Math.round(Number(target.val()) * 100);
                }

                if(value === '' || value === 0)
                    delete this.filters[filterName];
                else
                    this.filters[filterName] = value;

                localStorage.setItem('unit_filters', JSON.stringify(this.filters));

                this.mainRadioChannel.trigger('unit-filter-changed');
            },

            render: function() {
                var variables = {
                    filters: this.filters,
                }

                var helpers = {
                    cmToMeters: function(cm) {
                        if(!cm)
                            return '';
                        var meters = Number(cm) / 100;
                        meters = meters.toFixed(2);
                        return meters;
                    }
                }

                _.extend(variables, helpers);

                var tmpl = _.template(template);

                this.$el.html(tmpl(variables));
            }
        }
    );
    });