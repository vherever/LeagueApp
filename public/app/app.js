$(function() {
    function init(o){
        console.log('init');
        console.log(o);
        onreadyload();
    }

    window['initMyApp'] = init;

    var d = {
        summonerName: '',
        summonerLevel: null,
        profileIconId: null,
        summonerId: null,
        lastTimePlayed: null, // runtime
        lastTimePlayedHuman: null,
        lastPlayedChampion: '',
        freeChampionsRotation: [],
        summonerSummaryData: [],
        summonerLeagueData: [],
        latestVersion: '',
        selectors: {
            summonerInfoTemplate: '#template_summonerInfo',
            summonerInfoContainer: '#summonerInfoContainer',

            freeChampionsTemplate: '#template_freeChampions',
            freeChampionsContainer: '#freeChampionsContainer'
        }
    };



    $('.ui.loading.search').removeClass('loading');
    $('#search').on('keyup', function(e) {
        if(e.keyCode == 13) {
            //$('.ui.search').addClass('loading');
            var parameters = {
                search: $(this).val()
            };

            $.get('/searching', parameters, function(data) {
                if(_.isEmpty(data)) {
                    console.log('That summoner does not exist!');
                } else {
                    console.log(data.response.summonerBaseInfo.name);
                    d.summonerName = data.response.summonerBaseInfo.name;
                    d.summonerId = data.response.summonerBaseInfo.id;
                    d.summonerLevel = data.response.summonerBaseInfo.summonerLevel;
                    d.profileIconId = data.response.summonerBaseInfo.profileIconId;
                    d.lastTimePlayed = data.response.summonerRecentStatistics[0].createDate;
                    d.lastTimePlayedHuman = LolApiUtils.convertTimestampToTimeSince(d.lastTimePlayed);
                    d.lastPlayedChampion = data.response.lastPlayed.key;
                    d.summonerSummaryData = data.response.summonerSummaryData;
                    d.summonerLeagueData = data.response.summonerLeagueData;
                    render(d.selectors.summonerInfoTemplate, d.selectors.summonerInfoContainer);
                    $('#tab1').hide();
                    $('#tab2').show();
                    window.location = '/#/tab2';
                }
            }).success(function(result) {
                console.log(result);
                //$('.ui.loading.search').removeClass('loading');
            });
        }
    });

    function render(template, container) {
        var htmlTpl = $(template).html();
        $(container).html(_.template(htmlTpl)({ d: d }));
    }

    function onreadyload(){
        $.get('/getFreeChampions').success(function (data) {
            if(_.isEmpty(data)) {
                console.log('This user does not exist!');
            } else {
                d.freeChampionsRotation = data;
                d.latestVersion = data.latestVersion;
                console.log(d.freeChampionsRotation);
                render(d.selectors.freeChampionsTemplate, d.selectors.freeChampionsContainer);
                window.location = '/#/tab1';
            }
        });
    }

    function changeTab () {
        $('ul.tabs').each(function(){
            // For each set of tabs, we want to keep track of
            // which tab is active and its associated content
            var $active, $content, $links = $(this).find('a');

            // If the location.hash matches one of the links, use that as the active tab.
            // If no match is found, use the first link as the initial active tab.
            $active = $($links.filter('[href="'+location.hash+'"]')[0] || $links[0]);
            $active.addClass('active');

            $content = $($active[0].hash);

            // Hide the remaining content
            $links.not($active).each(function () {
                $(this.hash).hide();
            });

            // Bind the click event handler
            $(this).on('click', 'a', function(e){
                // Make the old tab inactive.
                $active.removeClass('active');
                $content.hide();

                // Update the variables with the new link and content
                $active = $(this);
                $content = $(this.hash);

                // Make the tab active.
                $active.addClass('active');
                $content.show();

                // Prevent the anchor's default click action
                e.preventDefault();
            });
        });
    }
    changeTab();

});