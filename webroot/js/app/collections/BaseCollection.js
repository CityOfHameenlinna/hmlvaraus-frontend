define(["jquery","backbone"],
  function($, Backbone) {
    var Collection = Backbone.Collection.extend({
        isFiltered: false,

        fetchFiltered: function(options) {
            if(!options)
                options = {};

            var filterData = localStorage.getItem(this.filterKey);
            if(filterData) {
                filterData = JSON.parse(filterData);
                if(options.data) {
                    options.data = _.extend(options, filterData);
                }
                else {
                    options.data = filterData;
                }
                options.traditional = true;
            }

            if(!options.data)
                options.data = {};

            this.isFiltered = true;

            if (options.page) {
                options.data.page = options.page;
            }

            var currentUser = window.App.userCollection.currentUser;
            if (!currentUser) {
              options.data.hide_reserved = true;
            }

            if (options.reset) {
                this.reset();
            }

            var me = this;

            options.success = function(collection, response) {
                if (response.next) {
                    me.page = response.next - 1;
                    me.nextPage = response.next;
                }
                if (response.previous) {
                    me.page = response.previous + 1;
                    me.previousPage = response.previous;
                }
            }

            return this.fetch(options);
        },

        parse: function(response) {
            var obj = response.results;

            return _.map(obj, function (value, key) {
              return obj[key];
            });
        },
    });
    return Collection;
  });
