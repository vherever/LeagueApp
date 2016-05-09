function require_template(templateName) {
    var template = $('#template_' + templateName);
    if (template.length === 0) {
        var tmpl_dir = '../views/templates';
        var tmpl_url = tmpl_dir + '/' + templateName + '.html';
        var tmpl_string = '';

        $.ajax({
            url: tmpl_url,
            method: 'GET',
            async: false,
            contentType: 'text',
            success: function (data) {
                tmpl_string = data;
            }
        });

        $('body').append('<script id="template_' +
            templateName + '" type="text/template">' + tmpl_string + '<\/script>');
    }
}

require_template('summonerInfo');
require_template('freeChampions');