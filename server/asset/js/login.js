'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

;(function ($) {
    var Auth = function () {
        //auth class
        function Auth(form) {
            _classCallCheck(this, Auth);

            this._form = form;
            this._errorMsg = $('.error-msg');
            this._valid = true;
            this._inputs = $('input[required]');
            this._save_checkbox = $('input[name="save-password"]');
            this._sendingObj = {
                login: 'admin@task.com',
                password: 'abcd123'
            };
        }

        _createClass(Auth, [{
            key: 'init',
            value: function init() {
                var self = this;
                this.event(self);
            }
            //тут норм

        }, {
            key: 'event',
            value: function event(self) {
                this._inputs.on('change', function (e) {

                    self.validate.call(this, e, self);

                    self._sendingObj[this.name] = this.value;
                    console.log(self._sendingObj);
                });

                this._form.on('submit', function (e) {
                    e.preventDefault();

                    self._valid = true;

                    self._inputs.each(function (e, input) {
                        self.validate.call(input, e, self);
                    });

                    if (!self._valid) return;
                    self.sendRequest(self);
                });
            }
        }, {
            key: 'validate',
            value: function validate(e, self) {
                var dataRegex = this.dataset.regex;
                var reg = new RegExp(dataRegex);
                if (!reg.test(this.value) && this.value || !reg.test(this.value) && e.type === 'submit') {
                    this.classList.add('has-error');
                    self._valid = false;
                } else {
                    this.classList.remove('has-error');
                }
            }
        }, {
            key: 'showError',
            value: function showError(error, self) {
                this._errorMsg.text(error);
                this._errorMsg.fadeIn();
                setTimeout(function () {
                    self._errorMsg.fadeOut();
                }, 3000);
            }
        }, {
            key: 'sendRequest',
            value: function sendRequest(self) {
                //проверить валидна ли форма если нет вызвать метод showerror
                $.ajax({
                    method: 'POST',
                    data: JSON.stringify(this._sendingObj),
                    contentType: 'application/json',
                    url: 'http://localhost:8080/login',
                    success: function success(res) {
                        console.log(self);
                        self.setCookie(res._id, self._save_checkbox.prop('checked'));
                    },
                    error: function error(err) {
                        console.log(err);
                    }

                });
            }
        }, {
            key: 'setCookie',
            value: function setCookie(id, save) {
                var date = new Date();
                date.setSeconds(date.getSeconds() + 60000);

                document.cookie = this._save_checkbox.prop('checked') ? '_id=${id};expires=${date.toUTCString()}' : '_id=${id}';

                window.location = '/task';
            }
        }]);

        return Auth;
    }();

    var form = $('form[name="loginForm"]');
    var auth = new Auth(form);
    auth.init();
})(jQuery);