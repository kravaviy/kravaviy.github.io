;(function ($) {

    let task_link = $('.toggle-task-list a');
    let task_content = $('.task-content');



    function tab(e) {
        e.preventDefault();
        let activeBlock = $(this).attr('href');
        task_content.removeClass('active');
        task_link.removeClass('active');

        $(this).addClass('active');
        $(activeBlock).addClass('active');
    }

    task_link.on('click', tab);

})(jQuery);