(function ($) {
    $.fn.editableIFrame = function () {
        var tabCode = 9;
        var isValid = true;
        var currentFrame = this;
        var addRemoveHandler = function (li, inst) {
            $(li).find('.remove').click(function () {
                var ul = $(this).closest('ul');
                $(this).closest('li').remove();
                var items = inst[0].obj.getItems();
                $(inst).trigger('change', [items]);
                if ($(ul).find('li > p:not([contentEditable="true"])').length == 0) {
                    isValid = true;
                    $(inst).css('border', '');
                    $(inst).trigger('validate', [true]);
                }

            });
        };

        var getEditTextBox = function () {
            return '<li><p contenteditable="true" style="display:inline-block; margin:0px; min-width:50px;"></p></li>';
        };

        var obj = {
            instance: currentFrame,
            getItems: function () {
                return $.map($(currentFrame).contents().find('li > p:not([contentEditable="true"])'), function (e) {
                    return $(e).html();
                });
            },
            getValue: function () {
                if (isValid == false) {
                    return [];
                }

                return $(currentFrame).contents().find('li > p[contentEditable="true"]').html();
            },
            clear: function () {
                var contents = $(currentFrame).contents();
                contents.find('ul li:not(:last)').remove();
            },
            setItems: function (concatenatedItems) {
                var inst = this.instance;
                if (concatenatedItems !== null && concatenatedItems !== undefined && concatenatedItems.length > 0) {
                    var items = concatenatedItems.split(';');
                    var contents = $(currentFrame).contents();
                    contents.find('ul li:not(:last)').remove();
                    $.each(items,
                        function (id, value) {
                            var lastChild = contents.find('li:last-child');
                            $('<li><p contenteditable="false" style="display:inline-block; margin:0px; min-width:50px;">' + value + '</p><span class="glyphicon glyphicon-remove remove"></span></li>').insertBefore(lastChild);
                            var addedChild = contents.find('li:nth-last-child(2)');
                            addRemoveHandler(addedChild, inst);
                        });
                } else {
                    var contents = $(currentFrame).contents();
                    contents.find('ul li:not(:last)').remove();
                }
            }
        };

        function initIFrame() {
            var self = this;
            var displayLoading = function (conts, isLoading) {
                if (isLoading) {
                    conts.find('body .spinner').show();
                    conts.find('body').css('background-color', '#cac6be');
                    conts.find('body ul').hide();
                } else {
                    contents.find('body .spinner').hide();
                    contents.find('body').css('background-color', '');
                    contents.find('body ul').show();
                }
            };

            var contents = $(currentFrame).contents();
            contents.find('head').append('<style></style>');
            var style = contents.find('head style');
            style.append('<link rel="stylesheet"  href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" type="text/css" charset="utf-8">');
            style.append('ul { list-style: none; padding: 0; list-style-type: none; }');
            style.append('li { display: inline-block; margin: 3px; padding: 5px; border: 1px solid black; }');
            style.append('.remove:hover { cursor: pointer; }');
            style.append('.spinner { width: 40px; height: 40px; background-color: white; margin: 100px auto; -webkit-animation: sk-rotateplane 1.2s infinite ease-in-out; animation: sk-rotateplane 1.2s infinite ease-in-out; }');
            style.append('@-webkit-keyframes sk-rotateplane { 0% { -webkit-transform: perspective(120px) } 50% { -webkit-transform: perspective(120px) rotateY(180deg) } 100% { -webkit-transform: perspective(120px) rotateY(180deg)  rotateX(180deg) } }');
            style.append('@keyframes sk-rotateplane { 0% {  transform: perspective(120px) rotateX(0deg) rotateY(0deg); -webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg) } 50% { transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg); -webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg) } 100% { transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg); -webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg); } }');
            contents.find('body').append('<div class="spinner" style="display:none;"></div>');

            if ($(currentFrame).data("maxInputLength") !== undefined) {
                contents.find('body').data("maxInputLength", $(currentFrame).data("maxInputLength"));
            }
            contents.find('body').append('<ul>' + getEditTextBox() + '</ul>');
        }

        initIFrame();
        $(currentFrame).contents().find('body').keydown(function (e) {
            if (e.keyCode === tabCode) {
                e.preventDefault();
            }
            if (e.key.length === 1) {
                var lastChild = $(this).find('li:last-child');
                var maxInputLength = $(this).data("maxInputLength");
                if (maxInputLength !== undefined && maxInputLength === lastChild[0].innerText.length) {
                    e.preventDefault();
                }
            }
        });
        $(currentFrame).contents().find('body').keyup(function (e) {
            var self = this,
                frameElt = e.view.frameElement;
            var addli = function (c) {
                var result = $(getEditTextBox());
                c.find('ul').append(result);
                return result;
            };

            var contents = $(currentFrame).contents();
            if (contents.find('li:last-child').length === 0) {
                addli(contents);
            }

            var lastChild = contents.find('li:last-child');
            var maxInputLength = $(this).data("maxInputLength");
            if (maxInputLength !== undefined && maxInputLength < lastChild[0].innerText.length) {
                lastChild.find('p')[0].innerText = lastChild[0].innerText.substring(0, maxInputLength);
            }

            if (e.keyCode === tabCode) {
                if (lastChild[0].innerText.trim() !== "") {
                    lastChild.find('p').attr('contentEditable', 'false');
                    lastChild.append("<span class='glyphicon glyphicon-remove remove'></span>");
                    var newli = addli(contents);
                    newli.find('p').focus();
                    addRemoveHandler(lastChild, currentFrame);
                    var items = frameElt.obj.getItems();
                    $(frameElt).trigger('change', [items]);
                }
            } 
        });
        currentFrame[0].obj = obj;
        return obj;
    };
}(jQuery));