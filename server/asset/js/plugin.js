'use strict';

;(function ($) {

    var task_link = $('.toggle-task-list a');
    var task_content = $('.task-content');

    function tab(e) {
        e.preventDefault();
        var activeBlock = $(this).attr('href');
        task_content.removeClass('active');
        task_link.removeClass('active');

        $(this).addClass('active');
        $(activeBlock).addClass('active');
    }

    task_link.on('click', tab);
})(jQuery);