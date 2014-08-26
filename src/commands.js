define(['util', '../bower_components/webuploader_fex/dist/webuploader.js'], function(_, webuploader){
    function ico(klass){
        return '<i class="icon-' + klass + '"></i>'
    }

    return {
        undo: {
            icon: ico('undo'),
            title: '撤销',
            param: ''
        },
        bold: {
            icon: ico('bold'),
            title: '加粗',
            param: true,
            active: function(){
                var bold = $.css(this, 'font-weight');
                return bold == 'bold' || bold >= 700;
            }
        },
        'delete': {
            html: '删除',
            param: true
        },
        indent: {
            icon: ico('indent'),
            title: '增加缩进',
            param: ''
        },
        formatBlock: '',
        insertHorizontalRule: {
            html: '插入水平分割线',
            param: ''
        },
        italic: {
            icon: ico('italic'),
            title: '斜体',
            param: true,
            active: function(){
                return $.css(this, 'font-style') == 'italic'
            }
        },
        justifyLeft: {
            icon: ico('align-left'),
            title: '左对齐',
            param: '',
            active: function(){
                var align = $.css(this, 'text-align');
                return align == 'left' || align == 'start';
            }
        },
        justifyRight: {
            icon: ico('align-right'),
            title: '右对齐',
            param: '',
            active: function(){
                var align = $.css(this, 'text-align');
                return align == 'right' || align == 'end';
            }
        },
        justifyFull: {
            icon: ico('align-justify'),
            title: '绝对对齐',
            param: true
        },
        justifyCenter: {
            icon: ico('align-center'),
            title: '居中对齐',
            param: '',
            active: function(){
                return $.css(this, 'text-align') == 'center';
            }
        },
        outdent: {
            icon: ico('dedent'),
            title: '减少缩进',
            param: ''
        },
        removeFormat: {
            icon: ico('eraser'),
            title: '清除格式',
            param: ''
        },
        selectAll: {
            html: '全选',
            param: ''
        },
        strikeThrough: {
            icon: ico('strikethrough'),
            title: '删除线',
            param: '' ,
            active: function(){
                return $.css(this, 'text-decoration') == 'line-through'
            }
        },
        subscript:{
            icon: ico('subscript'),
            title: '下标',
            param: 'true',
            active: function(){
                return $.css(this, 'vertical-align') == ''
            }
        },
        superscript:{
            icon: ico('superscript'),
            title: '上标',
            param: 'true',
            active: function(){
                return $.css(this, 'vertical-align') == ''
            }
        },
        underline: {
            icon: ico('underline'),
            title: '下划线',
            param: '',
            active: function(){
                return $.css(this, 'text-decoration') == 'underline'
            }
        },
        unlink: {
            icon: ico('unlink'),
            title: '删除链接',
            param: ''
        },
        insertImage: {
            icon: ico('photo'),
            title: '插入图片',
            panel: $.UI.Dialog($('<div>测试</div>')),
            param: function(){}
        },
        insertAttachment: {
            icon: ico('paperclip'),
            title: '插入附件',
            panel: $.UI.Dialog($('<div>测试</div>'))
        }
    }
})