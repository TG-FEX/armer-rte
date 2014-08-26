define(function (require) {
    var $ = require('armer');
    if (!$.isNativeEvent('selectionchange')) {
        var SELECT_ALL_MODIFIER = /^Mac/.test(navigator.platform) ? 'metaKey' : 'ctrlKey';
        var RANGE_PROPS = ['startContainer', 'startOffset', 'endContainer', 'endOffset'];
        var DATA = "selectionchangeData";
        var handlers = {
            keydown: function (e) {
                var code = e.keyCode;
                if (code === 65 && e[SELECT_ALL_MODIFIER] && !e.shiftKey && !e.altKey || // Ctrl-A or Cmd-A
                    (code <= 40 && code >= 37) && e.shiftKey) { // (Alt-)Shift-arrow
                    setTimeout(dispatchIfChanged.bind(null, this), 0);
                }
            },
            mousedown: function (e) {
                if (e.button === 0) {
                    $.event.add(this, 'mousemove', handlers.mousemove);
                    setTimeout(dispatchIfChanged.bind(null, this), 0);
                }
            },
            mousemove: function (e) {  // only needed while primary button is down
                if (e.buttons & 1) {
                    dispatchIfChanged(this);
                } else {
                    $.event.remove(this, 'mousemove', handlers.mousemove);
                }
            },
            mouseup: function (e) {
                if (e.button === 0) {
                    $.nextTick(function(){
                        dispatchIfChanged(this)
                    })
                    setTimeout(dispatchIfChanged.bind(null, this), 0);
                } else {
                    $.event.remove(this, 'mousemove', handlers.mousemove);
                }
            }
        };

        function onFocus() {
            setTimeout(dispatchIfChanged.bind(null, this.document), 0);
        }

        $.event.special.selectionchange = {
            setup: function(){
                var $this = $(this);
                if (!$this.data(DATA)) {
                    $this.data(DATA, getSelectionRange(this));
                    for (var i in handlers) {
                        $.event.add(this, i + '._selectionchange', handlers[i]);
                    }
                    $.event.add(this.defaultView, 'focus' + '._selectionchange', onFocus);
                }
            },
            teardown: function(){
                var $this = $(this);
                if ($this.data(DATA)) {
                    $this.removeData(DATA);
                    for (var i in handlers) {
                        $.event.remove(this, i + '._selectionchange', handlers[i]);
                    }
                    $.event.remove(this.defaultView, 'focus' + '._selectionchange', onFocus);
                }
            }
        };

        function getSelectionRange(doc) {
            var s = doc.getSelection();
            return s.rangeCount ? s.getRangeAt(0) : null;
        }

        function dispatchIfChanged(doc) {
            var $doc = $(doc);
            var rOld = $doc.data(DATA);
            var rNew = getSelectionRange(doc);
            if (!sameRange(rNew, rOld)) {
                $doc.data(DATA, rNew);
                $.nextTick(function(){
                    $.event.trigger(new $.Event('selectionchange'), [], doc)
                });
            }
        }

        function sameRange(r1, r2) {
            return r1 === r2 || r1 && r2 && RANGE_PROPS.every(function (prop) {
                return r1[prop] === r2[prop];
            });
        }

    }
});
