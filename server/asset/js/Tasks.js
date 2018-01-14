'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

;(function ($) {
    var Tasks = function () {
        function Tasks() {
            _classCallCheck(this, Tasks);

            this.actionWithTask = '';

            this.task = {
                status: 'undone'
            };
        }

        _createClass(Tasks, [{
            key: 'init',
            value: function init() {
                var self = this;

                this.checkToken(self).then(this.getTasks).then(this.sortTask).then(this.render).then(this.addEvent).then(Tasks.hidePreloader).then(this.changeColor).catch(this.errorHandler); //norm
            }
        }, {
            key: 'checkToken',
            value: function checkToken(self) {

                return new Promise(function (resolve, reject) {

                    var index = document.cookie.indexOf('_id');
                    var indexEnd = document.cookie.indexOf(';', index);
                    var token = indexEnd === -1 ? document.cookie.slice(index) : document.cookie.slice(index, indexEnd);

                    if (index !== -1) resolve(self);else reject('logout');
                });
            }
        }, {
            key: 'changeColor',
            value: function changeColor() {
                var li = $('.change-color li');
                var changed_blocks = $('[data-change]');
                var change_tab = $('[data-change-color]');
                var color = localStorage.getItem('data-color') || 'ca457e';

                function getColor(color) {
                    changed_blocks.each(function (i, el) {
                        $(el).css("background-color", color);
                    });
                    change_tab.each(function (i, el) {
                        $(el).css("color", color);
                    });
                }

                li.each(function (i, e) {
                    var color = $(e).attr('data-color');
                    $(e).css("background-color", color);
                });

                li.on('click', function () {
                    var color = $(this).attr('data-color');
                    getColor(color);

                    localStorage.setItem('data-color', color);
                });

                getColor(color);
            }
        }, {
            key: 'getTasks',
            value: function getTasks(self) {
                console.log('getting tasks ...');

                return new Promise(function (resolve, reject) {
                    $.ajax({
                        method: 'POST',
                        url: 'http://localhost:8080/allTasks',
                        success: function success(res) {
                            self.response = res;
                            resolve(self);
                        },
                        error: function error(_error) {
                            reject(_error);
                        }
                    });
                });
            }
        }, {
            key: 'logout',
            value: function logout() {
                localStorage.removeItem("User's ID");
                sessionStorage.removeItem("User's ID");
                window.location = '/login';
            }
        }, {
            key: 'sortTask',
            value: function sortTask(self) {
                console.log('sorting tasks...', self);

                var sortArr = self.response.slice(),
                    obj = {};

                sortArr.forEach(function (task) {

                    var day = new Date(task.date),
                        options = { month: 'short' };

                    task.ms = Date.parse(task.date);
                    task.day = day.getDate();
                    task.month = day.toLocaleString('ru', options);
                });

                sortArr.sort(function (prev, next) {
                    return prev.ms - next.ms;
                });

                var undoneTasks = sortArr.filter(function (task) {
                    return task.status === 'undone';
                });
                var doneTasks = sortArr.filter(function (task) {
                    return task.status === 'done';
                });

                self.undoneTasks = Tasks.createObjFromArr(undoneTasks);
                self.doneTasks = Tasks.createObjFromArr(doneTasks);

                return self;
            }
        }, {
            key: 'render',
            value: function render(self) {
                console.log('Rendering tasks...', self);

                return new Promise(function (resolve, reject) {

                    var activeTaskContainer = $('#active-task .container');
                    var doneTaskContainer = $('#all-task .container');

                    var getActiveTaskHtml = self.undoneTasks ? Tasks.renderTaskWrap(self.undoneTasks) : '';
                    var getDoneTaskHtml = self.doneTasks ? Tasks.renderTaskWrap(self.doneTasks) : '';

                    activeTaskContainer.append(getActiveTaskHtml);
                    doneTaskContainer.append(getDoneTaskHtml);

                    if (!self.undoneTasks) {
                        Tasks.emptyTasks(activeTaskContainer, 'У вас нет активных задач');
                    }
                    if (!self.doneTasks) {
                        Tasks.emptyTasks(doneTaskContainer, 'У вас нет завершенных задач');
                    }
                    resolve(self);
                });
            }
        }, {
            key: 'addEvent',
            value: function addEvent(self) {
                console.log('Adding events...', self);
                var logOut = $('.icon-logout');
                var addTaskBtn = $('.add-task');
                var editTaskBtn = $('.icon-edit');
                var overlay = $('.overlay');
                var sendTask = $('.add-task-btn');

                $('.task-header').on('click', Tasks.taskAccordion);

                addTaskBtn.off('click');
                editTaskBtn.off('click');
                overlay.off('click');
                sendTask.off('click');

                logOut.on('click', logOut);
                addTaskBtn.on('click', function (e) {
                    self.actionWithTask = $(this).attr('data-action');
                    Tasks.openModal(e);
                });
                editTaskBtn.on('click', function (e) {
                    self.actionWithTask = $(this).attr('data-action');

                    var id = $(this).closest('.task').attr('data-task-id');
                    console.log(id);
                    var task = self.response.filter(function (oneTask) {
                        return oneTask._id === id;
                    })[0];

                    self.task._id = id;

                    Tasks.addValueInModal(task);
                    Tasks.openModal(e);
                });
                overlay.on('click', function (e) {
                    self.actionWithTask = $(this).attr('data-action');
                    Tasks.openModal(e);
                });

                sendTask.on('click', function (e) {
                    e.preventDefault();

                    self.updateTaskObj(self).then(function () {
                        if (self.actionWithTask === 'add') {
                            console.log(self.actionWithTask);
                            self.addNewTask(self);
                        } else {
                            console.log(self.actionWithTask);
                            self.editCurenTask(self);
                        }
                    }).catch(self.errorHandler);
                });
            }
        }, {
            key: 'errorHandler',
            value: function errorHandler(self) {
                if (self.error === 'logout') {
                    self.logout();
                } else {
                    console.error('Error');
                }
            }
        }, {
            key: 'addNewTask',
            value: function addNewTask(self) {

                $.ajax({
                    method: 'POST',
                    url: 'http://localhost:8080/add/',
                    data: JSON.stringify(this.task),
                    contentType: 'application/json',
                    success: function success(res) {
                        console.log('success', res);
                        $('.overlay').trigger('click');
                        self.getTasks(self).then(self.sortTask).then(self.render).then(self.addEvent);
                    },
                    error: function error(_error2) {
                        console.log(_error2);
                    }

                });
            }
        }, {
            key: 'editCurenTask',
            value: function editCurenTask(self) {
                $.ajax({
                    data: JSON.stringify(self.task),
                    type: 'PUT',
                    contentType: 'application/json',
                    url: 'http://localhost:8080/edit/' + self.task._id,
                    success: function success(data) {
                        //какие-то действия при том если поменялось
                        console.log('success edit');
                        $('.overlay').trigger('click');
                        self.getTasks(self).then(self.sortTasks).then(self.render).then(self.addEvent);
                    },
                    error: function error() {
                        //какие-то действия при том если не поменялось
                        console.log('error edit');
                    }

                });
            }
        }, {
            key: 'updateTaskObj',
            value: function updateTaskObj(self) {

                return new Promise(function (resolve, reject) {

                    var date = $('.edit-task #task-date');
                    var time = $('.edit-task #task-time');
                    var taskText = $('.edit-task textarea');

                    if (!date.val() || !time.val() || !taskText.val()) {
                        self.error = 'empty input modal';
                        return reject(self);
                    }

                    self.task.date = date.val();
                    self.task.time = time.val();
                    self.task.taskText = taskText.val();

                    resolve();
                });
            }
        }], [{
            key: 'hidePreloader',
            value: function hidePreloader() {

                $('#loading').addClass('hide');
            }
        }, {
            key: 'createObjFromArr',
            value: function createObjFromArr(arr) {
                var obj = {};

                arr.forEach(function (task) {
                    if (!obj[task.date]) {
                        obj[task.date] = arr.filter(function (el) {
                            return el.date === task.date;
                        });
                    }
                });

                return obj;
            }
        }, {
            key: 'taskAccordion',
            value: function taskAccordion(e) {

                var parent = $(this).closest('.task');
                var content = $(parent).find('.task-content-wrap');

                if ($(parent).hasClass('open')) {
                    $(content).slideUp(500, function () {
                        return $(parent).removeClass('open');
                    });
                } else {
                    $(content).slideDown(500, function () {
                        return $(parent).addClass('open');
                    });
                }
            }
        }, {
            key: 'renderTaskWrap',
            value: function renderTaskWrap(obj) {
                var marcup = '';

                for (var day in obj) {
                    marcup += '<div>\n                                <div class="task-day" data-change="background-color">\n                                    <span class="day">' + obj[day][0].day + '</span>\n                                    <span class="month">' + obj[day][0].month + '</span>\n                                </div>\n                                <div class="all-task-wrap">\n                                    <div class="timeline" data-change="border-left-color"></div>\n                                    ' + Tasks.renderTasksByDay(obj[day]) + '\n                                    \n                                </div>\n                            </div>';
                }

                return marcup;
            }
        }, {
            key: 'renderTasksByDay',
            value: function renderTasksByDay(array) {
                var tasksMarcup = '';
                var date = Date.now();

                array.forEach(function (task) {

                    var taskWarning = date > task.ms ? 'warning' : '';
                    var taskStatus = task.status === 'done' ? 'success' : '';

                    tasksMarcup += '<div class="task ' + (taskStatus || taskWarning) + '" data-task-id="' + task._id + '">\n\t\t\t\t\t\t<div class="to-do-time" data-change="background-color">' + task.time + '</div>\n\t\t\t\t\t\t<div class="task-header flex-container">\n\t\t\t\t\t\t\t<span class="icon icon-arrow"></span>\n\t\t\t\t\t\t\t<span class="icon short-task-text">' + task.taskText + '</span>\n\t\t\t\t\t\t\t<span class="icon icon-cancel"></span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="task-content-wrap">\n\t\t\t\t\t\t\t<div class="time-row flex-container">\n\t\t\t\t\t\t\t\t<div class="task-icon">\n\t\t\t\t\t\t\t\t\t<span class="icon icon-time"></span>\t\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="time">' + task.time + '</div>\n\t\t\t\t\t\t\t\t<div class="task-icon">\n\t\t\t\t\t\t\t\t\t<span class="icon icon-bell"></span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="task-text-row flex-container">\n\t\t\t\t\t\t\t\t<div class="task-icon">\n\t\t\t\t\t\t\t\t\t<span class="icon icon-list"></span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="text">' + task.taskText + '</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="task-check-row check-done flex-container">\n\t\t\t\t\t\t\t\t<div class="task-icon">\n\t\t\t\t\t\t\t\t\t<span class="icon icon-check"></span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="check">\n\t\t\t\t\t\t\t\t\t<input type="checkbox" name="status" id="status">\n\t\t\t\t\t\t\t\t\t<label for="status">\u042F \u0432\u044B\u043F\u043E\u043B\u043D\u0438\u043B \u0437\u0430\u0434\u0430\u0447\u0443</label>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="task-check-row check-current flex-container">\n\t\t\t\t\t\t\t\t<div class="task-icon">\n\t\t\t\t\t\t\t\t\t<span class="icon icon-check"></span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="check">\n\t\t\t\t\t\t\t\t\t<input type="checkbox" name="status" id="status">\n\t\t\t\t\t\t\t\t\t<label for="status">\u0417\u0430\u0434\u0430\u0447\u0430 \u0435\u0449\u0435 \u043D\u0435 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0430</label>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="task-edit-row flex-container">\n\t\t\t\t\t\t\t\t<span class="icon icon-edit" data-action="edit"></span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="task-message deadline">\n\t\t\t\t\t\t\t<div class="message-row flex-container">\n\t\t\t\t\t\t\t\t<div class="task-icon">\n\t\t\t\t\t\t\t\t\t<span class="icon icon-warning"></span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="text">\n\t\t\t\t\t\t\t\t\t<p>\u0412\u044B \u043D\u0435 \u0432\u044B\u043F\u043E\u043B\u043D\u0438\u043B\u0438 \u0437\u0430\u0434\u0430\u0447\u0443</p>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="task-message done">\n\t\t\t\t\t\t\t<div class="message-row flex-container">\n\t\t\t\t\t\t\t\t<div class="task-icon">\n\t\t\t\t\t\t\t\t\t<span class="icon icon-star"></span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="text">\n\t\t\t\t\t\t\t\t\t<p>\u041F\u043E\u0437\u0434\u0440\u0430\u0432\u043B\u044F\u0435\u043C!</p>\n\t\t\t\t\t\t\t\t\t<p>\u0412\u044B \u0441\u043F\u0440\u0430\u0432\u0438\u043B\u0438\u0441\u044C \u0441 \u0437\u0430\u0434\u0430\u0447\u0435\u0439</p>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>';
                });

                return tasksMarcup;
            }
        }, {
            key: 'emptyTasks',
            value: function emptyTasks(container, text) {

                var alert = '<div class="alert empty-task"> ' + text + ' </div>';

                container.append(alert);
            }
        }, {
            key: 'openModal',
            value: function openModal(e) {

                console.log(this);

                var editModal = $('.edit-task');
                var overlay = $('.overlay');

                $([editModal, overlay]).toggleClass('open');
            }
        }, {
            key: 'addValueInModal',
            value: function addValueInModal(task) {

                var date = $('.edit-task #task-date');
                var time = $('.edit-task #task-time');
                var taskText = $('.edit-task textarea');

                date.val(task.date);
                time.val(task.time);
                taskText.val(task.taskText);
            }
        }]);

        return Tasks;
    }();

    var tasks = new Tasks();
    tasks.init();
})(jQuery);