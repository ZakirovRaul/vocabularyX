
$(document).ready(function () {


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
        let lines = data.trim().split('\r\n');
        let html = "";
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].trim() !== "") {
                let word = parseLine(lines[i]);
                if (word != null) {
                    html += templateRow(word.name, word.translation);
                }
                else {
                    html += templateRow(lines[i], "") + errorRow("Invalid format");
                }
            }
        }
        $("#tableDic tbody").html(html);
    }

    function parseLine(line) {
        let regExp = /^(.+)\s-\s(.+)$/i;
        var groups = regExp.exec(line);
        if (groups != null && groups.length === 3) {
            return {
                name: groups[1],
                translation: groups[2]
            }
        }
        return null;
    }

    function templateRow(word, translate) {
        return "                <tr data-edit=\"false\">\n" +
            "                    <td><div class=\"readMode origin\" >" + word + "</div><input class=\"input-lg col-lg-12 editMode hidden\" value=\"" + word + "\"></td>\n" +
            "                    <td><div class=\"readMode\">" + translate + "</div><input class=\"input-lg col-lg-12 editMode hidden\" value=\"" + translate + "\"></td>\n" +
            "                    <td>\n" +
            "                        <div class=\"readMode\">\n" +
            "                            <span class=\"btn-link editRow\">Edit</span> | \n" +
            "                            <span class=\"btn-link deleteRow\">Delete</span>\n" +
            "                        </div>\n" +
            "                        <div class=\"editMode hidden\">\n" +
            "                            <span class=\"btn-link editRowYes\">Save</span>\n" +
            "                            <span class=\"btn-link editRowNo\">Cancel</span>\n" +
            "                        </div>\n" +
            "                    </td>\n" +
            "                </tr>";
    }

    //function failedRow(line, id, error) {
    //    return "                <tr data-edit=\"false\">\n" +
    //        "                    <td><div class=\"readMode\" >" +
    //        line +
    //        "</div><input class=\"input-lg col-lg-12 editMode hidden\" value=\"" +
    //        line +
    //        "\"></td>\n" +
    //        "                    <td><div class=\"readMode\"></div><input class=\"input-lg col-lg-12 editMode hidden\" value=\"\"></td>\n" +
    //        "                    <td>\n" +
    //        "                        <div class=\"readMode\">\n" +
    //        "                            <span class=\"btn-link editRow\">Edit</span> | \n" +
    //        "                            <span class=\"btn-link deleteRow\">Delete</span>\n" +
    //        "                        </div>\n" +
    //        "                        <div class=\"editMode hidden\">\n" +
    //        "                            <span class=\"btn-link editRowYes\">Save</span>\n" +
    //        "                            <span class=\"btn-link editRowNo\">Cancel</span>\n" +
    //        "                        </div>\n" +
    //        "                    </td>\n" +
    //        "                </tr>\n" +
    //        errorRow(error);

    //}

    function errorRow(error) {
        return "                <tr class=\"format-error\">\n" +
            "                <td colspan=\"3\">\n" +
            "                   <div class=\"alert alert-danger alert-dismissable fade in format-error\">\n" + error + "\n" +
            "                   </div>\n" +
            "                </td>\n" +
            "                </tr>";
    }

    $(document).on('click', '#tableDic tr', function (e) {
        if (e.target.className === "btn-link deleteRow") {
            if ($(e.currentTarget).next().attr('class') === "format-error") {
                $(e.currentTarget).next().remove();
            }
            e.currentTarget.remove();

        } else if (e.target.className === "btn-link editRow") {
            var editNow = $(this).attr("data-edit") === "false";
            if (editNow) {
                $(this).find('.readMode').addClass("hidden");
                $(this).find('.editMode').removeClass("hidden");
                $(this).attr("data-edit", true);
                if ($(e.currentTarget).next().attr('class') === "format-error") {
                    $(e.currentTarget).next().hide();
                }
            }
        } else if (e.target.className === "btn-link editRowYes") {
            let wordValid = validateRow($(this).find("input")[0].value, $(this).find("input")[1].value);
            if (wordValid) {
                if ($(e.currentTarget).next().attr('class') === "format-error") {
                    $(e.currentTarget).next().remove();
                }
            } else {
                $(this).after(errorRow("Invalid format"));
            }

            $(this).find(".readMode")[0].innerHTML = $(this).find("input")[0].value;
            $(this).find(".readMode")[1].innerHTML = $(this).find("input")[1].value;

            $(this).find('.readMode').removeClass("hidden");
            $(this).find('.editMode').addClass("hidden");
            $(this).attr("data-edit", false);
        } else if (e.target.className === "btn-link editRowNo") {
            $(this).find('input')[0].value = $(this).find(".readMode")[0].innerHTML;
            $(this).find('input')[1].value = $(this).find(".readMode")[1].innerHTML;

            $(this).find('.readMode').removeClass("hidden");
            $(this).find('.editMode').addClass("hidden");
            $(this).attr("data-edit", false);

            if ($(e.currentTarget).next().attr('class') === "format-error") {
                $(e.currentTarget).next().show();
            }
        }

        ////e.stopPropagation();
        //        return false;
        //    }

        });

    $('#btnSave').click(function(e) {
        if ($('.format-error').length === 0) {
            $('html, body').animate({
                'scrollTop': $('.format-error').offset().top - 100
                },
                1000);
            e.preventDefault();
        } else {
            let postData = $("#tableDic tbody tr").toArray();
            postData = postData.filter(function(item) {
                return item.className !== "format-error";
            });
            postData = postData.map((item) => {
                let word = {};
                word.Name = $(item).find(".readMode")[0].innerHTML.trim();
                word.Translation = $(item).find(".readMode")[1].innerHTML.trim();
                return word;
            });
            $.ajax({
                url: "/Import/Save",
                type: "POST",
                data: { words : postData },
                success: (data, status) => {
                    $('#tableDic tbody').html("");
                    let tbody = "";
                    data.forEach((item) => {
                        tbody += templateRow(item.Name, item.Translation) + errorRow(item.Error);
                    });
                    $("#tableDic tbody").html(tbody);
                }
            });
        }
    });
   
    function validateRow(origin, tran) {
        return tran !== "" && origin !== "";
    }


});