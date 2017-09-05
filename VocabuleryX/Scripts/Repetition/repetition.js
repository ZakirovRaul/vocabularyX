var Context = (function () {
    var state1;
    var state2;
    var state3;
    var state4;
    var currentState;
    function context() {
        state1 = new State1(this);
        state2 = new State2(this);
        state3 = new State3(this);
        state4 = new State4(this);
        currentState = state3;

        this.getState1 = function () { return state1; };
        this.getState2 = function () { return state2; };
        this.getState3 = function () { return state3; };
        this.getState4 = function () { return state4; };
        this.getCurrentState = function () { return currentState; };
        this.setCurrentState = function (value) { currentState = value; };
    }

    context.prototype.handle = function () {
        this.getCurrentState().handle();
    };

    return context;
})();

var State1 = (function () {
    var context;
    function state(theContext) {
        context = theContext;

        this.getContext = function() {
            return context;
        };
    }

    state.prototype.handle = function () {
        new lesson1().handle();
        this.getContext().setCurrentState(this.getContext().getState2());
    }

    return state;
})();

var State2 = (function () {
    var context;
    function state(theContext) {
        context = theContext;

        this.getContext = function () {
            return context;
        };
    }

    state.prototype.handle = function () {
        new lesson2().handle();
        this.getContext().setCurrentState(this.getContext().getState3());
    }

    return state;
})();

var State3 = (function () {
    var context;
    function state(theContext) {
        context = theContext;

        this.getContext = function () {
            return context;
        };
    }

    state.prototype.handle = function () {
        new lesson3().handle();
        this.getContext().setCurrentState(this.getContext().getState4());
    }

    return state;
})();


var State4 = (function () {
    var context;
    function state(theContext) {
        context = theContext;

        this.getContext = function () {
            return context;
        };
    }
    //Finish, the last state
    state.prototype.handle = function () {
        $('#result').val(JSON.stringify(mistakes));
        $('#lessonForm').submit();
    }

    return state;
})();


var context = new Context();
var mistakes = [];

$(document).on('nextLesson', function() {
    context.handle();
});

function countMistake(e) {
    var item = mistakes.find(function(m) {
        return m.id === e.Word.Id;
    });
    item.count++;
}

$(document).ready(function() {
    words.forEach(function(w) {
        mistakes.push({ id: w.Word.Id, count: 0 });
    });

    var context = new Context();
    //context.handle();

    $(document).on('click', '#lesson1 .voice', function(e) {
        e.preventDefault();
        var msg = new SpeechSynthesisUtterance();
        msg.voice = voices[$(this).attr("data-voice-id")];
        msg.text = $('.originWord').text();
        speechSynthesis.speak(msg);

    });

    $('#lesson2 .voice').click(function() {
        var msg = new SpeechSynthesisUtterance();
        msg.voice = voices[$(this).attr("data-voice-id")];
        msg.text = $('.originWord').text();
        speechSynthesis.speak(msg);
    });

    $(document).on("click", "#lesson3 .voice", function(e) {
        e.preventDefault();
        var text = $('.originWord').text();
        var voiceId = $(this).attr("data-voice-id");
        aloud(text, voiceId);
    });

});

var lesson1 = (function() {
    var instance;
    var theWord = words[0];
    var answerGiven = false;

    function lesson() {
        if (!instance) {
            instance = this;
            init();
        }
    }

    lesson.prototype.handle = function() {
        $("#lesson1 .originWord").text(theWord.Word.Origin);
        var options = [];
        options.push(theWord.Word.Version);
        theWord.VersionOptions.forEach(function (val) {
            options.push(val);
        });
        options = tangleArray(options);

        var rawOption =
            '        <div class="row">\n' +
                '            <div class="btn btn-default">\n' +
                '                <span class="optionWord">{text}</span>\n' +
                '            </div>\n' +
                '        </div>';

        $('#lesson1-options').html('');
        options.forEach(function (item) {
            $('#lesson1-options').append(rawOption.replace("{text}", item.val));
        });
    }

    function init() {
        $('#lesson1').css("display", "block");

        $(document).on("click", "#lesson1-options .btn", function (e) {
            if (!answerGiven) {
                answerGiven = true;
                if ($(this).children().text() === theWord.Word.Version) {
                    processSuccess(this);
                } else {
                    processFail(this);
                }
            }
        });

        function processSuccess(element) {
            $(element).removeClass("btn btn-default").addClass("btn btn-success");
            setTimeout(function () {
                goNextWord();
            }, 500);
        }

        function processFail(element) {
            $(element).removeClass("btn btn-default").addClass("btn btn-danger");
            var correctOne = $("#lesson1-options .btn:contains(" + theWord.Word.Version + ")")[0];
            var timerId = setInterval(function () {
                if ($(correctOne).attr("class") === 'btn btn-default') {
                    $(correctOne).removeClass("btn btn-default").addClass("btn btn-success");
                } else {
                    $(correctOne).removeClass("btn btn-success").addClass("btn btn-default");
                }
            }, 250);

            setTimeout(function () {
                clearInterval(timerId);
                goNextWord();
            }, 500);

            countMistake(theWord);
        }

        function goNextWord() {
            theWord = words[words.indexOf(theWord) + 1];
            if (!theWord) {
                $('#lesson1').css("display", "none");
                document.dispatchEvent(new CustomEvent("nextLesson", {}));
            } else {
                answerGiven = false;
                instance.handle();
            }
        }
    }

    return lesson;
})();

var lesson2 = (function () {
    var instance;
    var theWord = words[0];
    var answerGiven = false;

    function lesson() {
        if (!instance) {
            instance = this;
            init();
        }
    }

    lesson.prototype.handle = function () {
        $("#lesson1 .originWord").text(theWord.Word.Version);
        var options = [];
        options.push(theWord.Word.Origin);
        theWord.OriginOptions.forEach(function (val) {
            options.push(val);
        });
        options = tangleArray(options);

        var rawOption =
            '        <div class="row">\n' +
                '            <div class="btn btn-default">\n' +
                '                <span class="optionWord">{text}</span>\n' +
                '            </div>\n' +
                '        </div>';

        $('#lesson1-options').html('');
        options.forEach(function (item) {
            $('#lesson1-options').append(rawOption.replace("{text}", item.val));
        });
    }

    function init() {
        $('#lesson1').css("display", "block");

        $(document).on("click", "#lesson1-options .btn", function (e) {
            if (!answerGiven) {
                answerGiven = true;
                if ($(this).children().text() === theWord.Word.Origin) {
                    processSuccess(this);
                } else {
                    processFail();
                }
            }
        });

        function processSuccess(element) {
            $(element).removeClass("btn btn-default").addClass("btn btn-success");
            setTimeout(function () {
                goNextWord();
            }, 500);
        }

        function processFail() {
            var correctOne = $("#lesson1-options .btn:contains(" + theWord.Word.Origin + ")")[0];
            var timerId = setInterval(function () {
                if ($(correctOne).attr("class") === 'btn btn-default') {
                    $(correctOne).removeClass("btn btn-default").addClass("btn btn-success");
                } else {
                    $(correctOne).removeClass("btn btn-success").addClass("btn btn-default");
                }
            }, 250);

            setTimeout(function () {
                clearInterval(timerId);
                goNextWord();
            }, 500);

            countMistake(theWord);
        }

        function goNextWord() {
            theWord = words[words.indexOf(theWord) + 1];
            if (!theWord) {
                $('#lesson1').css("display", "none");
                document.dispatchEvent(new CustomEvent("nextLesson", {}));
            } else {
                answerGiven = false;
                instance.handle();
            }
        }
    }

    return lesson;
})();

var lesson3 = (function() {
    var instance;
    var stop, chars, ind, curChar;
    var theWord = words[0];
    var attemps = 0;
    var maxAttemps = 3;

    function lesson() {
        if (!instance) {
            instance = this;
            init();
        }
    }

    lesson.prototype.handle = function () {
        $("#lesson3 .originWord").text(theWord.Word.Version);
        $('#charsGroup').html('');
        $('#spell').html('');

        var orderedArr = theWord.Word.Origin.split('');
        var tangledArr = tangleArray(orderedArr);

        for (var i = 0; i < orderedArr.length; i++) {
            $('#charsGroup').append('<span class="form-group" data-s="' + orderedArr[i] + '"></span>');
            $('#spell').append('<span class="form-group">' + tangledArr[i].val + '</span>');
        }

        stop = false;
        chars = $("#charsGroup span");
        ind = 0;
        curChar = $(chars[ind]).attr("data-s");

        var text = $('.originWord').text();
        var voiceId = $('#lesson3 .voice').attr("data-voice-id");
        aloud(text, voiceId);
        //$('#lesson3 .voice').onclick();
    }

    function init() {
        $('#lesson3').css("display", 'block');
        $(document).on("keypress", function(e) {
            if (!stop) {
                if (e.originalEvent.key == curChar) {
                    $(chars[ind]).css("background-color", '#037a01');
                    $(chars[ind++]).text(curChar);
                    $('#spell span:contains(' + curChar + ")").first().remove();
                    curChar = $(chars[ind]).attr("data-s");
                    if (ind === chars.length) {
                        stop = true;
                        goNextWord();
                    }
                } else {
                    attemps++;
                    if (attemps === 4) {
                        countMistake(theWord);
                    }
                    $(chars[ind]).css("background-color", "red");
                    setTimeout(function() {
                            $(chars[ind]).css("background-color", "#fff");
                        }, 1000);
                }
            }
        });


        function goNextWord() {
            attemps = 0;
            theWord = words[words.indexOf(theWord) + 1];
            if (theWord != undefined) {
                instance.handle();
            } else {
                $("#lesson3").css("display", 'none');
                document.dispatchEvent(new CustomEvent("nextLesson", {}));
            }
        } 
    }

    return lesson;
})();

function tangleArray(arry) {
    var tangle = [];
    arry.forEach(function (item) {
        tangle.push({
            key: getRandom(0, 100),
            val: item
        });
    });
    tangle.sort(function (item1, item2) {
        return item1.key - item2.key;
    });
    return tangle;
}


function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function aloud(text, voiceId) {
    var msg = new SpeechSynthesisUtterance();
    msg.voice = voices[voiceId];
    msg.text = text;
    speechSynthesis.speak(msg);
}