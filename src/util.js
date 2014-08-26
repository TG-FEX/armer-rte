define(function(_, exports){
    exports.initIFrame = function initIFrame(doc, content){
        doc.open();
        doc.write(content);
        doc.close();
    };
    exports.getSelectionContainerElement = function (window) {
        var document = window.document;
        var range, sel, container;
        if (document.selection && document.selection.createRange) {
            // IE case
            range = document.selection.createRange();
            return range.parentElement();
        } else if (window.getSelection) {
            sel = window.getSelection();
            if (sel.getRangeAt) {
                if (sel.rangeCount > 0) {
                    range = sel.getRangeAt(0);
                }
            } else {
                // Old WebKit selection object has no getRangeAt, so
                // create a range from other selection properties
                range = document.createRange();
                range.setStart(sel.anchorNode, sel.anchorOffset);
                range.setEnd(sel.focusNode, sel.focusOffset);

                // Handle the case when the selection was selected backwards (from the end to the start in the document)
                if (range.collapsed !== sel.isCollapsed) {
                    range.setStart(sel.focusNode, sel.focusOffset);
                    range.setEnd(sel.anchorNode, sel.anchorOffset);
                }
            }

            if (range) {
                container = range.commonAncestorContainer;

                // Check if the container is a text node and return its parent if so
                return container.nodeType === 3 ? container.parentNode : container;
                //return container;
            }
        }
    };

    exports.pasteHtmlAtCaret = function (window, replacement, selectPastedContent) {
        var document = window.document;
        var sel, range, content;
        if (typeof replacement == 'string') replacement = function(){return replacement}

        if (window.getSelection) {
            // IE9 and non-IE
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                var el = document.createElement("div");

                range = sel.getRangeAt(0);
                el.appendChild(range.cloneContents());
                content = el.innerHTML;

                range.deleteContents();

                // Range.createContextualFragment() would be useful here but is
                // only relatively recently standardized and is not suppoRTEd in
                // some browsers (IE9, for one)

                content = replacement(content, range);

                if (content !== false) {
                    el.innerHTML = content;
                    var frag = document.createDocumentFragment(), node, lastNode;
                    while ( (node = el.firstChild) ) {
                        lastNode = frag.appendChild(node);
                    }
                    var firstNode = frag.firstChild;
                    range.insertNode(frag);

                    // Preserve the selection
                    if (lastNode) {
                        range = range.cloneRange();
                        range.setStartAfter(lastNode);
                        if (selectPastedContent) {
                            range.setStartBefore(firstNode);
                        } else {
                            range.collapse(true);
                        }
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                }
            }
        } else if ( (sel = document.selection) && sel.type != "Control") {
            // IE < 9
            var originalRange = sel.createRange();
            content = replacement(originalRange.htmlText);
            if (content !== false) {
                originalRange.collapse(true);
                sel.createRange().pasteHTML(content);
                if (selectPastedContent) {
                    range = sel.createRange();
                    range.setEndPoint("StartToStart", originalRange);
                    range.select();
                }
            }
        }
    };
    exports.setDesignMode = function (doc){
        (doc.designMode)
            ?(doc.designMode = 'On')
            :(doc.body.contentEditable = true);
    };
    exports.formatText = function (win, command, param) {
        win.focus();
        try {
            win.document.execCommand(command, false, param);
        } catch (e) {
            console.log(e)
        }
        win.focus();
    }

});