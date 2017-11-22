class Context
{
    constructor() {
        this.state1 = new State1(this);
        this.state2 = new State2(this);
        this.state3 = new State3(this);
        this.state4 = new State4(this);
        this.currentState = this.state4;
    }

    get State1() {
        return this.state1;
    }
    get State2() {
        return this.state2;
    }
    get State3() {
        return this.state3;
    }
    get State4() {
        return this.state4;
    }
    get CurrentState() {
        return this.currentState;
    }
    set CurrentState(value) {
        this.currentState = value;
    }

    handle() {
        this.CurrentState.handle();
    }
}

class State {
    constructor(context) {
        this.context = context;
    }

    set Context(value) {
        this.context = value;
    }

    get Context() {
        return this.context;
    }

    handle() {
    }
}

class State1 extends State {
    handle() {
        new Lesson1Handler(new Lesson1Panel()).handle();
        this.Context.CurrentState = this.Context.State2;
    }
}

class State2 extends State {
    handle() {
        new Lesson2Handler(new Lesson1Panel()).handle();
        this.Context.CurrentState = this.Context.State3;
    }
}

class State3 extends State {
    handle() {
        new Lesson3Handler(new Lesson3Panel()).handle();
        this.Context.CurrentState = this.Context.State4;
    }
}

class State4 extends State {
    handle() {
        let mistakesData = JSON.stringify(totalMistakes.map((item) => {
            return {
                Id: item.id,
                Count: item.count
            };
        }));

        $.ajax({
            url: '/Learn/Complete',
            dataType: 'json',
            type: 'POST',
            data: { mistakes: mistakesData }
        });
        $("#lessonComplete").css('display', 'block');
        totalMistakes.forEach((item) => {
            $('<tr>' +
                '<td><span class="col-left">' + item.name + '</span></td>' +
                '<td><span class="col-right">' + item.count + '</span></td>' +
                '</tr>').appendTo($("#lessonComplete table tbody"));
        });

        //var a = totalMistakes;
        //$('#result').val(JSON.stringify(mistakes));
        //$('#lessonForm').submit();
    }
}


//var State4 = (function () {
//    var context;
//    function state(theContext) {
//        context = theContext;

//        this.getContext = function () {
//            return context;
//        };
//    }
//    //Finish, the last state
//    state.prototype.handle = function () {
//        $('#result').val(JSON.stringify(mistakes));
//        $('#lessonForm').submit();
//    }

//    return state;
//})();

//var mistakes = [];

//$(document).on('nextLesson', function() {
//    context.handle();
//});

//function countMistake(e) {
//    var item = mistakes.find(function(m) {
//        return m.id === e.Word.Id;
//    });
//    item.count++;
//}
var totalMistakes = [];

$(document).ready(function () {

    words.forEach(function(w) {
        totalMistakes.push({ id: w.Word.Id, name: w.Word.Name, count: 0 });
    });
    

    var context = new Context();
    context.handle();

    $(document).on('nextLesson', () => {
        context.handle();
    });

    //$(document).on('click', '#lesson1 .voice', function(e) {
    //    e.preventDefault();
    //    var msg = new SpeechSynthesisUtterance();
    //    msg.voice = voices[$(this).attr("data-voice-id")];
    //    msg.text = $('.originWord').text();
    //    speechSynthesis.speak(msg);

    //});

    //$('#lesson2 .voice').click(function() {
    //    var msg = new SpeechSynthesisUtterance();
    //    msg.voice = voices[$(this).attr("data-voice-id")];
    //    msg.text = $('.originWord').text();
    //    speechSynthesis.speak(msg);
    //});

    //$(document).on("click", "#lesson3 .voice", function(e) {
    //    e.preventDefault();
    //    var text = $('.originWord').text();
    //    var voiceId = $(this).attr("data-voice-id");
    //    aloud(text, voiceId);
    //});

});


class Lesson1Handler {
    constructor(panel) {
        this.itemIndex = 0;
        this.panel = panel;
        this.panel.showPanel();
    }

    displayWord() {
        let item = words[this.itemIndex];
        var options = [];
        options.push(item.Word.Translation);
        options = options.concat(item.ForeignOptions);
        options = tangleArray(options);
        this.panel.WordId = item.Word.Id;
        this.panel.CorrectAnswer = item.Word.Translation;
        this.panel.setTitle(item.Word.Name);
        this.panel.setOptions(options);
        this.panel.OnNext = () => {
            this.nextWord();
        };
    }

    handle() {
        this.displayWord();
    }

    nextWord() {
        this.itemIndex++;
        if (this.itemIndex < words.length) {
            this.displayWord();
            this.panel.AnswerGiven = false;
        } else {
            this.panel.hidePanel();
            document.dispatchEvent(new CustomEvent('nextLesson'));
        }
    }
    
}

class Lesson2Handler {
    constructor(panel) {
        this.itemIndex = 0;
        this.panel = panel;
        this.panel.showPanel();
    }

    displayWord() {
        let item = words[this.itemIndex];
        var options = [];
        options.push(item.Word.Name);
        options = options.concat(item.NativeOptions);
        options = tangleArray(options);
        this.panel.WordId = item.Word.Id;
        this.panel.CorrectAnswer = item.Word.Name;
        this.panel.setTitle(item.Word.Translation);
        this.panel.setOptions(options);
        this.panel.OnNext = () => {
            this.nextWord();
        };
    }

    handle() {
        this.displayWord();
    }

    nextWord() {
        this.itemIndex++;
        if (this.itemIndex < words.length) {
            this.displayWord();
            this.panel.AnswerGiven = false;
        } else {
            this.panel.hidePanel();
            document.dispatchEvent(new CustomEvent('nextLesson'));
        }
    }
    
}

class Lesson3Handler {
    constructor(panel) {
        this.itemIndex = 0;
        this.panel = panel;
        this.panel.showPanel();
    }

    displayWord() {
        let item = words[this.itemIndex];
        var orderedArr = item.Word.Name.split('');
        var tangledArr = tangleArray(orderedArr);

        this.panel.Word = item.Word;
        this.panel.setTitle(item.Word.Translation);
        this.panel.setOptions(orderedArr, tangledArr);
        this.panel.OnNext = () => {
            this.nextWord();
        };
    }

    handle() {
        this.displayWord();
    }

    nextWord() {
        this.itemIndex++;
        if (this.itemIndex < words.length) {
            this.displayWord();
        } else {
            this.panel.hidePanel();
            document.dispatchEvent(new CustomEvent('nextLesson'));
        }
    }

}

class Lesson1Panel {

    set WordId(value) {
        this.wordId = value;
    }

    set CorrectAnswer(value) {
        this.correctAnswer = value;
    }

    set AnswerGiven(value) {
        this.answerGiven = value;
    }

    constructor() {
        this.answerGiven = false;
        $(document).on("click", "#lesson1-options .btn",
            (e) => {
                if (!this.answerGiven) {
                    this.answerGiven = true;
                    if ($(e.currentTarget).children().text() === this.correctAnswer) {
                        this.success(e.currentTarget);
                    } else {
                        this.fail(e.currentTarget);
                    }
                }
            });
    }

    set OnNext(value) {
        this.goNext = value;
    }

    showPanel() {
        $('#lesson1').css("display", "block");
    }

    hidePanel() {
        $('#lesson1').css("display", "none");
    }

    setTitle(value) {
        $("#lesson1 .originWord").text(value);
    }

    setOptions(options) {
        var rawOption =
            '        <div class="row">\n' +
                '            <div class="btn btn-default">\n' +
                '                <span class="optionWord">{text}</span>\n' +
                '            </div>\n' +
                '        </div>';

        $('#lesson1-options').html("");
        options.forEach(function (opt) {
            $('#lesson1-options').append(rawOption.replace("{text}", opt.val));
        });
    }

    success(element) {
        $(element).removeClass("btn btn-default").addClass("btn btn-success");
        setTimeout(() => {
                this.goNext();
            },
            500);
    }

    fail(element) {
        $(element).removeClass("btn btn-default").addClass("btn btn-danger");
        var correctOne = $("#lesson1-options .btn:contains(" + this.correctAnswer + ")")[0];
        var timerId = setInterval(function () {
                if ($(correctOne).attr("class") === 'btn btn-default') {
                    $(correctOne).removeClass("btn btn-default").addClass("btn btn-success");
                } else {
                    $(correctOne).removeClass("btn btn-success").addClass("btn btn-default");
                }
            },
            250);

        setTimeout(() => {
                clearInterval(timerId);
                this.goNext();
            },
            500);

        totalMistakes.find((item) => { return item.id == this.wordId; }).count++;
    }

}


class Lesson3Panel {

    set Word(value) {
        this.word = value;
    }

    constructor() {
        $(document).on("keypress",
            (e) => {
                var _chars = this.chars;
                if (!this.stop) {
                    if (e.originalEvent.key == this.curChar) {
                        $(_chars[this.ind]).css("background-color", '#037a01');
                        $(_chars[this.ind++]).text(this.curChar);
                        $('#spell span:contains(' + this.curChar + ")").first().remove();
                        this.curChar = $(_chars[this.ind]).attr("data-s");
                        if (this.ind === _chars.length) {
                            this.stop = true;
                            this.goNext();
                        }
                    } else {
                        this.attemps++;
                        if (this.attemps === 2) {
                            totalMistakes.find((item) => { return item.id == this.word.Id; }).count++;
                        }
                        $(_chars[this.ind]).css("background-color", "red");
                        setTimeout(() => {
                            $(_chars[this.ind]).css("background-color", "#fff");
                            },
                            1000);
                    }
                }
            });
    }

    set OnNext(value) {
        this.goNext = value;
    }

    showPanel() {
        $('#lesson3').css("display", 'block');
    }

    hidePanel() {
        $('#lesson3').css("display", "none");
    }

    setTitle(value) {
        $("#lesson3 .originWord").text(value);
    }

    setOptions(orderedArr, tangledArr) {
        $('#charsGroup').html('');
        $('#spell').html('');

        for (var i = 0; i < orderedArr.length; i++) {
            $('#charsGroup').append('<span class="form-group" data-s="' + orderedArr[i] + '"></span>');
            $('#spell').append('<span class="form-group">' + tangledArr[i].val + '</span>');
        }

        this.attemps = 0;
        this.stop = false;
        this.chars = $("#charsGroup span");
        this.ind = 0;
        this.curChar = $(this.chars[this.ind]).attr("data-s");

        let text = $('.originWord').text();
        let voiceId = $('#lesson3 .voice').attr("data-voice-id");
        aloud(text, voiceId);
    }
}
//var lesson3 = (function() {
//    var instance;
//    var stop, chars, ind, curChar;
//    var theWord = words[0];
//    var attemps = 0;
//    var maxAttemps = 3;

//    function lesson() {
//        if (!instance) {
//            instance = this;
//            init();
//        }
//    }

//    lesson.prototype.handle = function () {
//        $("#lesson3 .originWord").text(theWord.Word.Version);
//        $('#charsGroup').html('');
//        $('#spell').html('');

//        var orderedArr = theWord.Word.Origin.split('');
//        var tangledArr = tangleArray(orderedArr);

//        for (var i = 0; i < orderedArr.length; i++) {
//            $('#charsGroup').append('<span class="form-group" data-s="' + orderedArr[i] + '"></span>');
//            $('#spell').append('<span class="form-group">' + tangledArr[i].val + '</span>');
//        }

//        stop = false;
//        chars = $("#charsGroup span");
//        ind = 0;
//        curChar = $(chars[ind]).attr("data-s");

//        var text = $('.originWord').text();
//        var voiceId = $('#lesson3 .voice').attr("data-voice-id");
//        aloud(text, voiceId);
//        //$('#lesson3 .voice').onclick();
//    }

//    function init() {
//        $('#lesson3').css("display", 'block');
//        $(document).on("keypress", function(e) {
//            if (!stop) {
//                if (e.originalEvent.key == curChar) {
//                    $(chars[ind]).css("background-color", '#037a01');
//                    $(chars[ind++]).text(curChar);
//                    $('#spell span:contains(' + curChar + ")").first().remove();
//                    curChar = $(chars[ind]).attr("data-s");
//                    if (ind === chars.length) {
//                        stop = true;
//                        goNextWord();
//                    }
//                } else {
//                    attemps++;
//                    if (attemps === 4) {
//                        countMistake(theWord);
//                    }
//                    $(chars[ind]).css("background-color", "red");
//                    setTimeout(function() {
//                            $(chars[ind]).css("background-color", "#fff");
//                        }, 1000);
//                }
//            }
//        });


//        function goNextWord() {
//            attemps = 0;
//            theWord = words[words.indexOf(theWord) + 1];
//            if (theWord != undefined) {
//                instance.handle();
//            } else {
//                $("#lesson3").css("display", 'none');
//                document.dispatchEvent(new CustomEvent("nextLesson", {}));
//            }
//        } 
//    }

//    return lesson;
//})();

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