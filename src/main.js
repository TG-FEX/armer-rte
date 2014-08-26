define(['armer', 'util', 'commands', 'event'], function($, _, commandList){
    var defaults = {
        commands: [['undo'], ['bold', 'italic', '|', 'underline', 'strikeThrough'], ['superscript', 'subscript'], ['justifyLeft', 'justifyCenter', 'justifyRight', '|',/* 'justifyFull', '|',*/ 'indent', 'outdent'], ['insertImage', 'insertAttachment']]
    };
    $.RTE = function(textareaSelector, options){
        options = $.extend({}, defaults, options);
        this.options = options
        var $textarea = $(textareaSelector);
        var $container = $('<div style="position: relative">').insertAfter($textarea);
        var $menu = $('<menu class="btn-menu"></menu>')
        var $iframe = $('<iframe style="width: 100%">');
        var iframe = $iframe[0];
        iframe.frameBorder = 0;
        iframe.frameMargin = 0;
        iframe.framePadding = 0;
        this.el = {
            $container: $container,
            $menu: $menu.appendTo($container),
            $textarea: $textarea.appendTo($container),
            $iframe: $iframe,
            iframe: iframe,
            $status: $('<div>')
        };
        $menu.appendTo($container);
        $textarea.hide();
        $iframe.appendTo($container);
        this.el.$status.appendTo($container);

        this.iframeWin = this.el.$iframe[0].contentWindow;
        this.iframeDoc = this.iframeWin.document;
        var css = '', that = this;
        _.initIFrame(this.iframeDoc, '<html><head>' + css + '</head><body>' + $.trim($textarea.val()) + '</body></html>');
        _.setDesignMode(this.iframeDoc);

        this.createMenu(this.options.commands);

        this.iframeWin.focus();
        $(this.iframeDoc).on('selectionchange', function(){that.getStatus()});

        $(this.iframeWin).on('click', function(e){
            $iframe.trigger(e);
        })
    };

    //'backColor, createLink, fontSize, foreColor, insertImage, insertOrderedList, insertUnorderedList, insertParagraph'

    $.RTE.command = commandList;

    $.RTE.prototype = {
        getStatus: function(force){
            var newElement = _.getSelectionContainerElement(this.iframeWin);
            if (force || this.oldElement != newElement) {
                this.oldElement = newElement;
                $.each(this.commands, function(_, item){
                    if (item.active)
                        item.el.$btn.css('color', item.active.call(newElement) ? 'red' : 'black');
                })
            }
        },
        createMenu: function(commands){
            var that = this, loop;
            commands = commands || this.options.commands;
            that.commands = [];
            (loop = function (commands, $menu){
                $.each(commands, function(i, item){
                    if ($.type(item, 'array')) {
                        var $group = $('<span class="btn-menu">');
                        loop(item, $group);
                        $group.appendTo(that.el.$menu);
                    } else {
                        if (item == '|') {
                            $menu.append('<span class="sep">|</span>')
                        } else {
                            var o = $.extend({}, commandList[item]);
                            var $b = that.createBtn(item, o);
                            o.el = {};
                            o.el.$btn = $b;
                            that.commands.push(o);
                            $menu.append($b);
                        }
                    }
                })
            })(commands, that.el.$menu);
        },
        createBtn: function(command, options){
            //icoClass, command, option
            var that = this;
            var o = {
                name: command,
                command: command,
                btnClass: 'btn-' + $.hyphen(command),
                param: options
            };
            if (!$.type(options, 'object'))
                options = o;
            else options = $.extend({}, o, options);

            options.html = options.html ? options.html : options.icon ? '' : command;
            options.title = options.title || options.html || options.command;

            var $btn = $('<a>', {
                html: options.html,
                'class': options.btnClass,
                href: 'javascript:',
                title: options.title
            }).prepend(options.icon);

            if (options.panel) {
                $btn.click(function(){
                    options.panel.trigger('open', [{position: {of: $btn, at: 'left bottom+15', my: 'left top'}}]);
                })
                $(window).onExcept($btn.add(options.$element), 'click', function(){
                    options.panel.trigger('close');
                })
            } else
                $btn.click(function(){
                    var param = options.param;
                    if ($.isFunction(param)) param = options.param() || [];
                    if ($.isFunction(options.command))
                        options.command.apply(that.iframeWin, param);
                    else {
                        _.formatText(that.iframeWin, options.command, param);
                        that.getStatus(true)
                    }
                });

            return $btn
        }
    };

    return $.RTE
})
