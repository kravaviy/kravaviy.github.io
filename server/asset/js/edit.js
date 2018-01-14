"use strict";

(function ($) {

        var logOut = $('.icon-logout'),
            addTaskBtn = $(".add-task"),
            overlay = $(".overlay"),
            editTask = $(".edit-task");

        function logOutFunc() {
                localStorage.removeItem("User's ID");
                sessionStorage.removeItem("User's ID");
                window.location = '/login';
        }

        function openEditBlock() {
                $([this, overlay, editTask]).toggleClass('open');
        }

        function closeEditBlock() {
                addTaskBtn.removeClass("open");
                overlay.removeClass("open");
                editTask.removeClass("open");
        }

        logOut.on('click', logOutFunc);
        addTaskBtn.on("click", openEditBlock);
        overlay.on("click", closeEditBlock);
})(jQuery);