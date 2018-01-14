# task-manager

1. Клонируете репозиторий
```js
git clone https://github.com/dmgame/task-manager-v.2.0.git
```
2. Перейдите в склонированную папку или откройте е в редакторе кода
```js
cd task-manager
```
3. Разворачивание проекта (установка всех модулей). У вас должен быть установлен nodejs и gulp глобально
```js
 npm up
```
---

#### Привяжите к своему репозиторию***
1. Создайте новый репозиторий на github

2. Подвяжите текущий task-manager к своему репозиторию
```js
git remote set-url origin "ссылка на ваш репозиторий"
```

---


## Настройка сервера (установка доп пакетов для сервера, выполняется один раз)

1.
```js
npm i -g nodemon

```
2.
```js
npm i --save-dev babel-preset-es2015
```

3.
```js
npm i --save-dev babel-cli
```

4.
```js
npm install -g babel-cli
```

5.
```js
npm rebuild node-sass
```
---

## Запуск сервера

```js
nodemon server/app.js --exec babel-node --presets es2015,stage-2
```
---

#### При успешном запуске должно написать
```js
Server is up and running on port 8080
```


---

## Копирование файлов из своей верстки task-manager которую мы делали на этапе верстки
1. Из папки dist копируете все в папку dist нового проекта кроме папки js она там уже есть
2. Из папки app копируете 2 файла index.html и login.html *(обязательно у вас файлы должны также называться)* в корень папки server
3. Из папки app копируете папки js, img, fonts, css в папку server/asset *(если папки asset нет то создайте ее)*
4. gulpfile.js уже исправлен в новом проекте его копировать не нужно, но посмотрите в него если вы хотите что то добавить то добавляйте.

---
#### После копирования
1. Запускаете или перезапускаете сервер
```js
nodemon server/app.js --exec babel-node --presets es2015,stage-2
```
2. Запуск gulp
```js
gulp watch
```
3. Все готово для работы!

---

#### Страницы доступны по адресу
```js
localhost:8080/login
localhost:8080/task
```
---
#### Логин:  *admin@task.com*, Пароль: *abcd123*

#### Что умеет сервер
1. Верефикация пользователя пример запроса на jQuery:
```js
 $.ajax({
    method: 'POST',
    data: JSON.stringify(this._sendingObj),
    contentType: 'application/json',
    url: 'http://localhost:8080/login',
    success: function (res){
        console.log(this);
        self.setTocken(res._id, self._save_checkbox.prop('checked'));

    },
    error: function (err){
        console.log(err);
    }
})
```

2. Отдавайть все таски из базы пример запроса на jQuery:
```js
$.ajax({
    method: 'POST',
    url: 'http://localhost:8080/allTasks',
    success: function(res){
        self.sortTasks(res)
            .then(self.render)
            .catch(function(error){
                console.error(error);
            })
    },
    error: function(error){
        console.error(error);
    }
})
```
3. Добавление новых тасков
```js
$.ajax({
    data: JSON.stringify(data),
    type: 'POST',
    contentType: 'application/json',
    url: `http://localhost:8080/add/`,
    success: function(data){
        //какие-то действия при том если поменялось
    },
    error: function () {
		//какие-то действия при том если не поменялось
    }

});
```

4. Редактирование тасков:
```js
$.ajax({
    data: JSON.stringify(data),
    type: 'PUT',
    contentType: 'application/json',
    url: `http://localhost:8080/edit/${taskID}`,
    success: function(data){
        //какие-то действия при том если поменялось
    },
    error: function () {
		//какие-то действия при том если не поменялось
    }

});
```

