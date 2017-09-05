$(document).on('keypress', "#dataGrid tbody tr .error", function() {
    $(this).removeClass('error');
});
$(document).on('click', "#dataGrid tbody tr", function (e) {
    if (e.target.name === "btnEdit" || e.target.parentNode.name === "btnEdit") {
        var origins = $(this).find('.word-origin');
        var versions = $(this).find('.word-version');
        origins[1].value = origins[0].innerText;
        versions[1].value = versions[0].innerText;
        $($(this).find('.row-read')).css('display', 'none');
        $($(this).find('.row-edit')).css('display', 'inline-block');

    }
    else if (e.target.name === "btnEditOk" || e.target.parentNode.name === "btnEditOk") {
        var origins = $(this).find('.word-origin');
        var versions = $(this).find('.word-version');
        var dirty = false;
        if (origins[1].value === "") {
            $(origins[1]).addClass("error");
            dirty = true;
        }
        if (versions[1].value === "") {
            $(versions[1]).addClass("error");
            dirty = true;
        }

        if (!dirty) {
            var tr = $(this);
            $.ajax({
                url: location.origin + '/Dictionary/UpdateWord/',
                type: 'POST',
                data: {
                    Id: tr.attr('data-id'),
                    Origin: origins[0].innerText,
                    Version: versions[0].innerText
                }
            }).done(function(response, status) {
                if (status === "success") {
                    origins[0].innerText = origins[1].value;
                    versions[0].innerText = versions[1].value;
                    $(tr.find('.row-read')).css('display', 'inline-block');
                    $(tr.find('.row-edit')).css('display', 'none');
                }
            });
        }
    } else if (e.target.name === "btnEditCancel" || e.target.parentNode.name === "btnEditCancel") {
        $($(this).find('.row-read')).css('display', 'inline-block');
        $($(this).find('.row-edit')).css('display', 'none');
        $(this).find('.error').removeClass('error');
    } else if (e.target.name === "btnRemove" || e.target.parentNode.name === "btnRemove") {
        var tr = $(this);
        $.ajax({
            url: location.origin + '/Dictionary/DeleteWord/' + $(this).attr("data-id")
        }).done(function(response, status) {
            if (status === "success") {
                tr.remove();
            }
        });
    }
});
var validator = $('#createWordForm').validate({
    rules: {
        origin: 'required',
        version: 'required'
    },
    messages: {
        //origin: 'required',
        //version: 'required'
    }
    //submitHandler: function(form) {
    //    form.submit();
    //}
});


function OnFailure(response) {
    if (response.responseText === "duplicate") {
        validator.showErrors({
            "origin" : "duplicate word, already exist"
        });
    }
}

function OnComplete() {
    $('#btnNewWord').prop("disabled", false);
    $('#txtOrigin').val('');
    $('#txtVersion').val('');
}

function OnBegin(){
    $('#btnNewWord').prop("disabled", true);
}

function OnSuccess(data) {
    var row = '            <tr data-id=' + data.Id +'>\n' +
        '                <td>\n' +
        '                    <button class="btn btn-default">\n' +
        '                        <span class="glyphicon glyphicon-play-circle" aria-hidden="true" name="speech"></span>\n' +
        '                    </button>\n' +
        '                </td>\n' +
        '                <td>\n' +
        '                    <span class="word-origin row-read">' + data.Origin + '</span>\n' +
        '                    <input class="input-sm word-origin row-edit" value="">\n' +
        '                </td>\n' +
        '                <td>\n' +
        '                    <span class="word-version row-read">' + data.Version + '</span>\n' +
        '                    <input class="input-sm word-version row-edit" value="">\n' +
        '                </td>\n' +
        '                <td class="text-center">\n' +
        '                    <span class="glyphicon glyphicon-ok-circle" name="status"></span>\n' +
        '                </td>\n' +
        '                <td class="text-center">\n' +
        '                    <button class="btn btn-default row-read" name="btnEdit">\n' +
        '                        <span class="glyphicon glyphicon-edit" aria-hidden="true"></span>\n' +
        '                    </button>\n' +
        '                    <button class="btn btn-default row-read" name="btnRemove">\n' +
        '                        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>\n' +
        '                    </button>\n' +
        '                    <button class="btn btn-default row-edit" name="btnEditOk">\n' +
        '                        <span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span>\n' +
        '                    </button>\n' +
        '                    <button class="btn btn-default row-edit" name="btnEditCancel">\n' +
        '                        <span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>\n' +
        '                    </button>\n' +
        '                </td>\n' +
        '            </tr>';
    var tbody = $('#dataGrid tbody').html();
    $('#dataGrid tbody').html(row + tbody);
}

