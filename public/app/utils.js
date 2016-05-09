;(function () {
    var LolApiUtils = function() {};

    LolApiUtils.convertTimestampToDate = function(timestamp) {
        var d = new Date(timestamp),	// Convert the passed timestamp to milliseconds
            year = d.getFullYear(),
            month = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
            day = ('0' + d.getDate()).slice(-2),			// Add leading 0.
            hour = d.getHours(),
            h = hour,
            min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
            ampm = 'AM',
            time;
        if (hour > 12) {
            h = hour - 12;
            ampm = 'PM';
        } else if (hour === 12) {
            h = 12;
            ampm = 'PM';
        } else if (hour == 0) {
            h = 12;
        }
        // ie: 2013-02-18, 8:35 AM
        time = year + '-' + month + '-' + day + ', ' + h + ':' + min + ' ' + ampm;
        return time;
    };

    LolApiUtils.convertTimestampToTimeSince = function(timestamp) {

            var seconds = Math.floor((new Date() - timestamp) / 1000);

            var interval = Math.floor(seconds / 31536000);

            if (interval > 1) {
                return interval + " years";
            }
            interval = Math.floor(seconds / 2592000);
            if (interval > 1) {
                return interval + " months";
            }
            interval = Math.floor(seconds / 86400);
            if (interval > 1) {
                return interval + " days";
            }
            interval = Math.floor(seconds / 3600);
            if (interval > 1) {
                return interval + " hours";
            }
            interval = Math.floor(seconds / 60);
            if (interval > 1) {
                return interval + " minutes";
            }
            return Math.floor(seconds) + " seconds";
    };

    window.LolApiUtils = LolApiUtils;

})();