
$(document).ready(function () {
    var incorrectWords = [];

    $('#btnChooseFile').change(function (evt) {
        var files = evt.target.files;
        if (files.length > 0) {
            var reader = new FileReader();
            reader.onload = function () {
                var data = this.result;
                processData(data);
            };
            reader.onprogress = function () {
                console.log('loading');
            }
            reader.readAsText(files[0], 'CP1251');

        }
    });

    function processData(data) {
        var result = [];
        var regExp = /^(.+)\s-\s(.+)$/i;
        var lines = data.trim().split('\r\n');
        var html = "";
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].trim() !== '') {
                var groups = regExp.exec(lines[i]);
                if (groups != null && groups.length == 3) {
                    html += createRow(groups[1], groups[2]);
                }
                else {
                    incorrectWords.push("#" + i);
                    html +=
                        "                <tr class=\"text-danger\" data-edit=\"false\" id=\"" + i + "\">\n" +
                        "                    <td><div class=\"readMode\" >" + lines[i] + "</div><input class=\"input-lg col-lg-12 editMode hidden\" value=\"" + lines[i] + "\"></td>\n" +
                        "                    <td><div class=\"readMode\"></div><input class=\"input-lg col-lg-12 editMode hidden\" value=\"\"></td>\n" +
                        "                    <td>\n" +
                        "                        <div class=\"readMode\">\n" +
                        "                            <a href=\"#\" class=\"editRow\">Edit</a>\n" +
                        "                        </div>\n" +
                        "                        <div class=\"editMode hidden\">\n" +
                        "                            <a href=\"#\" class=\"editRowYes\">Save</a>\n" +
                        "                            <a href=\"#\" class=\"editRowNo\">Cancel</a>\n" +
                        "                        </div>\n" +
                        "                    </td>\n" +
                        "                </tr>";
                }
            }
        }
        appendDataToTable(html);
    }

    function createRow(word, translate) {
        return "                <tr data-edit=\"false\">\n" +
"                    <td><div class=\"readMode origin\" >" + word + "</div><input class=\"input-lg col-lg-12 editMode hidden\" value=\"" + word + "\"></td>\n" +
"                    <td><div class=\"readMode\">" + translate + "</div><input class=\"input-lg col-lg-12 editMode hidden\" value=\"" + translate + "\"></td>\n" +
"                    <td>\n" +
"                        <div class=\"readMode\">\n" +
"                            <a href=\"#\" class=\"editRow\">Edit</a>\n" +
"                        </div>\n" +
"                        <div class=\"editMode hidden\">\n" +
"                            <a href=\"#\" class=\"editRowYes\">Save</a>\n" +
"                            <a href=\"#\" class=\"editRowNo\">Cancel</a>\n" +
"                        </div>\n" +
"                    </td>\n" +
"                </tr>";
    }

    $(document).on('click', '#tableDic tr', function (e) {
        if (e.target.localName === "a") {
            var editNow = $(this).attr("data-edit") === "false";
            if (editNow) {
                $(this).find('.readMode').addClass("hidden");
                $(this).find('.editMode').removeClass("hidden");
                $(this).attr("data-edit", true);
            }
            else {
                if (e.target.className === "editRowYes") {
                    if ($(this).hasClass("text-danger") &&
                        validateRow($(this).find("input")[0].value, $(this).find("input")[1].value)) {

                        $(this).removeClass("text-danger");
                        var index = $.inArray('#' + $(this).attr('id'), incorrectWords);
                        if (index !== -1) {
                            incorrectWords.splice(index, 1);
                        }

                    }
                    $(this).find(".readMode")[0].innerHTML = $(this).find("input")[0].value;
                    $(this).find(".readMode")[1].innerHTML = $(this).find("input")[1].value;
                }
                else if (e.target.className === "editRowNo") {
                    $(this).find('input')[0].value = $(this).find(".readMode")[0].innerHTML;
                    $(this).find('input')[1].value = $(this).find(".readMode")[1].innerHTML;
                }
                $(this).find('.readMode').removeClass("hidden");
                $(this).find('.editMode').addClass("hidden");
                $(this).attr("data-edit", false);
            }
            //e.stopPropagation();
            return false;
        }
    });

    $('#btnSave').click(function(e) {
        //location.hash = incorrectWords[7];
        $('html, body').animate({
            'scrollTop':   $(incorrectWords[0]).offset().top - 100
        }, 1000);
        e.preventDefault();
    });

    $('#btnAddWord').click(function (e) {
        $('#addRowTemplate').removeClass('hidden');
    });

    $(document).on('click', '#addRowTemplate .editRowYes', function(e) {
        $('#addRowTemplate').addClass("hidden");
        var newRow = createRow($('#addRowTemplate input')[0].value, $('#addRowTemplate input')[1].value);
        appendDataToTable(newRow);
        e.stopPropagation();
    });

    $(document).on('click', '#addRowTemplate .editRowNo', function (e) {
        $('#addRowTemplate').addClass("hidden");
        e.stopPropagation();
    });

    function appendDataToTable(val) {
        var firstRow = $("#tableDic tbody tr")[0].outerHTML;
        var lastRows = $("#tableDic tbody").html().replace(firstRow, "");
        $("#tableDic tbody").html(firstRow + val + lastRows);
    }

    function validateRow(origin, tran) {
        return tran !== "" && origin !== "";
    }

    //$('#modalSave').on('click', function () {
    //    $(currentRow.getElementsByTagName("td")[0]).text($('#modalOW').val());
    //    $(currentRow.getElementsByTagName("td")[1]).text($('#modalTW').val());
    //});
});