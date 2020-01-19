Полная история подобного задания находится в файле my-readme.md;

# Задание 3. Найдите ошибки

В этом репозитории находятся материалы тестового задания «Найдите ошибки» для [16-й Школы разработки интерфейсов](https://yandex.ru/promo/academy/shri) (зима 2020, Москва).

Для работы приложения нужны [Node.js](https://nodejs.org/en/) (v10 или выше) и редактор [VS Code](https://code.visualstudio.com).

## Задание

**Дан исходный код приложения, в котором есть ошибки. Одни ошибки — стилистические, а другие не позволят даже запустить приложение. Вам нужно найти все ошибки и исправить их.**

Тестовое приложение — это плагин VS Code для удобного прототипирования интерфейсов с помощью дизайн-системы из первого задания. Вы можете описать в файле `.json` блоки, из которых состоит интерфейс. Плагин добавляет превью (1) и линтер (2) для структуры блоков.

![скриншот интерфейса](extension.png)

### Превью интерфейса

- Превью интерфейса доступно для всех файлов `.json`.
- Превью открывается в отдельной вкладке:
  - при выполнении команды `Example: Show preview` через палитру команд;
  - при нажатии кнопки сверху от редактора (см. скриншот);
  - при нажатии горячих клавиш **⌘⇧V** (для macOS) или **Ctrl+Shift+V** (для Windows).
- Вкладка превью должна открываться рядом с текущим редактором.
- Если превью уже открыто, то должна открываться уже открытая вкладка, новая открываться не должна.
- Когда пользователь изменяет в редакторе структуру блоков, превью должно обновляться
- Сейчас превью отображает структуру блоков в виде прямоугольников. Реализуйте отображение превью с помощью вёрстки и JS из первого задания.

### Линтер структуры блоков

- Линтер применяется для всех файлов `.json`.
- Линтер подсвечивает ошибочное место в файле и отображает сообщение при наведении мыши.
- Линтер отображает сообщения на панели `Problems` (**⌘⇧M** для macOS или **Ctrl+Shift+M** для Windows), сообщения группируются по файлам, при клике происходит переход к ошибочному месту.
- Сейчас плагин использует линтер-заглушку, проверяющий всего два правила: 1) «запрещены названия полей в верхнем регистре»; 2) «в каждом объекте должно быть поле `block`». Подключите в проект линтер из второго задания.

### Настройки

Плагин добавляет в настройки VS Code новый раздел `Example` с параметрами:

- `example.enable` — использовать линтер;
- `example.severity.uppercaseNamesIsForbidden` — тип сообщения для правила «Запрещены названия полей в верхнем регистре»;
- `example.severity.blockNameIsRequired` — тип сообщения для правила «В каждом объекте должно быть поле `block`».

Типы сообщений: `Error`, `Warning`, `Information`, `Hint`.

При изменении конфигурации новые настройки должны применяться к работе линтера.

## Как запустить

1. Открыть проект в VS Code.
2. Запустить `npm i`.
3. Нажать **F5**.

Должно открыться ещё одно окно VS Code с подключённым плагином.

## Что мы проверяем этим заданием

В этом задании мы хотим проверить, можете ли вы разобраться в незнакомом коде и API, а также ваш навык отладки. Пожалуйста, опишите в коде или в файле README ход ваших мыслей: какие ошибки и как вы нашли, почему они возникли, как их можно исправить. Вы можете использовать сторонние инструменты и библиотеки на свое усмотрение, но мы ждем от вас комментария — что и зачем вы использовали.
