;(function($) {
    class Auth{
        //auth class
        constructor(form){
            this._form = form;
            this._errorMsg = $('.error-msg');
            this._valid = true;
            this._inputs = $('input[required]');
            this._save_checkbox = $('input[name="save-password"]');
            this._sendingObj = {
                login: 'admin@task.com' ,
                password: 'abcd123'
            };
        }

        init(){
            let self = this;
            this.event(self);
        }
        //тут норм

        event(self){
            this._inputs.on('change', function (e) {

                self.validate.call(this, e, self);

                self._sendingObj[this.name] = this.value;
                console.log(self._sendingObj);
            });

            this._form.on('submit' , function (e){
                e.preventDefault();

                self._valid = true;

                self._inputs.each(function (e, input) {
                    self.validate.call(input, e, self);
                });

                if (!self._valid) return
                self.sendRequest(self);

            })
        }

        validate(e, self){
            let dataRegex = this.dataset.regex;
            let reg = new RegExp(dataRegex);
            if (!reg.test(this.value) && this.value || !reg.test(this.value) && e.type === 'submit') {
                this.classList.add('has-error');
                self._valid = false;
            } else {
                this.classList.remove('has-error');
            }

        }

        showError(error,self){
            this._errorMsg.text(error);
            this._errorMsg.fadeIn();
            setTimeout(function () {
                self._errorMsg.fadeOut();
            }, 3000)

        }

        sendRequest(self) {
            //проверить валидна ли форма если нет вызвать метод showerror
            $.ajax({
                method: 'POST',
                data: JSON.stringify(this._sendingObj),
                contentType: 'application/json',
                url: 'http://localhost:8080/login',
                success: function (res) {
                    console.log(self);
                    self.setCookie(res._id, self._save_checkbox.prop('checked'));

                },
                error: function (err) {
                    console.log(err);

                },

            })

        }

        setCookie(id,save){
            let date = new Date();
            date.setSeconds(date.getSeconds() + 60000);

            document.cookie = this._save_checkbox.prop('checked') ?
                '_id=${id};expires=${date.toUTCString()}' :
                '_id=${id}';

            window.location = '/task'
        }


    }

    let form = $('form[name="loginForm"]');
    let auth = new Auth(form);
    auth.init();



})(jQuery);