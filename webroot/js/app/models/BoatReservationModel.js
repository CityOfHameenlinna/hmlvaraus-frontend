define(["jquery", "backbone", "moment", "models/BaseModel"],
    function($, Backbone, moment, BaseModel) {
        // Creates a new Backbone Model class object
        var Model = BaseModel.extend({
            urlRoot: '/api/berth_reservation/',
            initialize: function() {

            },

            defaults: {

            },

            validate: function(attrs) {

            },

            getStateFinnish: function() {
                switch(this.get('reservation').state) {
                    case 'cancelled':
                        return "Peruutettu";
                        break;
                    case 'confirmed':
                        return "Hyväksytty";
                        break;
                    case 'denied':
                        return "Evätty";
                        break;
                    case 'requested':
                        return "Pyydetty";
                        break;
                }
            },

            getState: function() {
                return this.get('reservation').state;
            },

            getResourceId: function() {
                return this.get('reservation').resource;
            },

            getResource: function() {
                return this.get('reservation').resource;
            },

            getUnitName: function() {
                return this.get('berth').resource.unit.name.fi;
            },

            getResourceName: function() {
                return this.get('berth').resource.name.fi;
            },

            getBeginTime: function() {
                return this.get('reservation').begin;
            },

            getEndTime: function() {
                return this.get('reservation').end;
            },

            getBeginDateFinnish: function() {
                var time = moment(this.get('reservation').begin);
                return time.format("D.M.YYYY");
            },

            getEndDateFinnish: function() {
                var time = moment(this.get('reservation').end);
                return time.format("D.M.YYYY");
            },

            getBeginTimeFinnish: function() {
                var time = moment(this.get('reservation').begin);
                return time.format("D.M.YYYY HH:mm");
            },

            getEndTimeFinnish: function() {
                var time = moment(this.get('reservation').end);
                return time.format("D.M.YYYY HH:mm");
            },

            getTimeSpanFinnish: function() {
                return this.getBeginTimeFinnish() + " - " + this.getEndTimeFinnish();
            },

            getIsPaidTimeFinnish: function() {
                if(!this.get('is_paid_at'))
                    return '';
                var time = moment(this.get('is_paid_at'));
                return time.format("D.M.YYYY HH:mm");
            },

            getKeyReturnedTimeFinnish: function() {
                if(!this.get('key_returned_at'))
                    return '';
                var time = moment(this.get('key_returned_at'));
                return time.format("D.M.YYYY HH:mm");
            },

            getReserver: function(userCollection) {
                if(!this.get('reservation').user || !this.get('reservation').user.id)
                    return "Ei tietoja";

                var userModel = userCollection.getByUID(this.get('reservation').user.id);

                if(!userModel)
                    return 'Ei tietoja';

                return userModel.get('first_name') + ' ' + userModel.get('last_name') + ' (' + userModel.get('username') + ')';
            },

            getHasStarted: function() {
                return this.get('has_started');
            },

            getHasEnded: function() {
                return this.get('has_ended');
            },

            getIsRenewed: function() {
                return this.get('is_renewed');
            },

            getIsPaid: function() {
                return this.get('is_paid');
            },

            getIsPaidFinnish: function() {
                return this.get('is_paid') ? "Kyllä" : "Ei";
            },

            getReserverName: function() {
                return this.get('reservation').reserver_name;
            },

            getReserverAddress: function() {
                return this.get('reservation').reserver_address_street;
            },

            getReserverZip: function() {
                return this.get('reservation').reserver_address_zip;
            },

            getReserverCity: function() {
                return this.get('reservation').reserver_address_city;
            },

            getReserverEmail: function() {
                return this.get('reservation').reserver_email_address;
            },

            getReserverPhone: function() {
                return this.get('reservation').reserver_phone_number;
            },

            getRespaReservationId: function() {
                return this.get('reservation').id;
            },

            getStateUpdated: function() {
                if(!this.get('state_updated_at'))
                    return '';
                var time = moment(this.get('state_updated_at'));
                return time.format("D.M.YYYY HH:mm");
            },

            getKeyReturned: function() {
                return this.get('key_returned');
            },

            isCancelled: function() {
                return this.getState() == 'cancelled';
            },

            saveUpdate: function(data) {
                return $.ajax({
                    url: this.url() + '?show_cancelled=true',
                    method: 'patch',
                    data: JSON.stringify(data),
                    dataType: 'json',
                    contentType: 'application/json'
                });
            },

            saveIsPaid: function(value) {
                return $.ajax({
                    url: this.url() + '?show_cancelled=true',
                    method: 'patch',
                    data: JSON.stringify({is_paid: value}),
                    dataType: 'json',
                    contentType: 'application/json'
                });
            },

            sendRenewalMail: function() {
                return $.ajax({
                    url: this.url() + '?show_cancelled=true',
                    method: 'patch',
                    data: JSON.stringify({resend_renewal: true}),
                    dataType: 'json',
                    contentType: 'application/json'
                });
            },

            saveKeyReturned: function(value) {
                return $.ajax({
                    url: this.url() + '?show_cancelled=true',
                    method: 'patch',
                    data: JSON.stringify({key_returned: value}),
                    dataType: 'json',
                    contentType: 'application/json'
                });
            },

            saveCancel: function() {
                var reservation = this.get('reservation');
                reservation.state = 'cancelled';
                this.set('reservation', reservation);
                return $.ajax({
                    url: this.url(),
                    method: 'patch',
                    data: JSON.stringify({state: reservation.state}),
                    dataType: 'json',
                    contentType: 'application/json'
                });
            },

            getDescription: function() {
                return this.get('reservation').event_description;
            },

            getReservedByCitizen: function() {
                return this.get('reserved_by_citizen');
            }
        });
        return Model;

    }

);
