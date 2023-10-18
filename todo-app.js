(function(){
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerText = title;
        return appTitle;
    }

    function createNewTodoItemForm() {
        // create nodes
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        // build tree
        form.append(input, buttonWrapper);
        buttonWrapper.append(button);

        // set attrs
        button.disabled = true;

        // add styles
        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');

        // add text
        input.placeholder = 'Введите название нового дела';
        button.innerText = 'Добавить дело';

        // add event listeners
        input.addEventListener('input', function(e) {
            // button is disabled if no text in input
            button.disabled = !(input.value);
        });

        // return form elements object
        return {
            form,
            input,
            button
        }
    }

    function createTodoList() {
        let todoList = document.createElement('ul');
        todoList.classList.add('list-group');
        return todoList;
    }

    function createTodoObj(name, done=false) {
        // create nodes
        let item = document.createElement('li');
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        // build tree
        item.innerText = name;
        item.append(buttonGroup);
        buttonGroup.append(doneButton, deleteButton);
        
        // add styles
        item.classList.add('list-group-item', 'd-flex','justify-content-between', 'align-items-center');
        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-succes');
        deleteButton.classList.add('btn', 'btn-danger');
        
        // add text
        doneButton.innerText = 'Готово';
        deleteButton.innerText = 'Удалить';

        // return item elements object
        return {
            item,
            name,
            done,
            doneButton,
            deleteButton
        }
    }

    function addTodoItemToArr(todoArr, todoObj) {
        let newId = 1;
        if (todoArr) {
            maxId = 1;
            for (let i = 0; i < todoArr.length; i++) {
                const arrItem = todoArr[i];
                maxId = Math.max(arrItem.id, maxId);
            }
            newId = maxId + 1;
        }

        todoArr.push({
            id: newId,
            name: todoObj.name,
            done: todoObj.done
       });
        return newId;
    }

    function removeTodoItemFromArr(todoArr, todoObj) {
        if (!todoArr) return;

        for (let i = 0; i < todoArr.length; i++) {
            if (todoArr[i].id == todoObj.id) {
                todoArr.splice(i, 1);
                return;
            }
        }
    }

    function setTodoArrItemDone(todoArr, todoArrItem) {
        for (const item of todoArr) {
            if (item.id == todoArrItem.id) {
                item.done = !item.done;
                return;
            }
        }
    }

    function configTodoObj(listName, todoArr, todoObj) {
        if (todoObj.done) {
            todoObj.item.classList.add('list-group-item-success');
        }

        // add button events
            // set todo item done
        todoObj.doneButton.addEventListener('click', function(e) {
        todoObj.item.classList.toggle('list-group-item-success');
        todoObj.done = !todoObj.done;
        setTodoArrItemDone(todoArr, todoObj);
        saveArrData(listName, todoArr);
        });
            // remove todo item
        todoObj.deleteButton.addEventListener('click', function(e) {
            if (confirm('Вы уверены?')) {
                todoObj.item.remove();
                removeTodoItemFromArr(todoArr, todoObj);
            }
            saveArrData(listName, todoArr);
        });
    }

    function saveArrData(storageKey, todoList) {
        todoArrString = JSON.stringify(todoList);
        localStorage.setItem(storageKey, todoArrString);
    }

    function getArrData(storageKey) {
        todoArrString = localStorage.getItem(storageKey);
        todoList = JSON.parse(todoArrString);
        return todoList;
    }

    function createTodoApp(container, listName, title='Список дел') {
        // init array
        todoArr = [];

        // create nodes
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createNewTodoItemForm();
        let todoList = createTodoList();

        // build tree
        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        // check local storage
        todoArrStorageData = getArrData(listName);
        if (todoArrStorageData) {
            todoArr = todoArrStorageData;
            for (const todoArrItem of todoArr) {
                newTodoObj = createTodoObj(todoArrItem.name, todoArrItem.done);
                newTodoObj.id = todoArrItem.id;
                configTodoObj(listName, todoArr, newTodoObj);
                todoList.append(newTodoObj.item);
            }
        }
        
        todoItemForm.form.addEventListener('submit', function(e) {
            // get input
            e.preventDefault();
            if (!todoItemForm.input.value) {
                return;
            }
            let inputText = todoItemForm.input.value;

            // reset form elems
            todoItemForm.input.value = '';
            todoItemForm.button.disabled = true;


            // create item object
            let todoObj = createTodoObj(inputText, false);
            let newItemId = addTodoItemToArr(todoArr, todoObj);
            todoObj.id = newItemId;
            saveArrData(listName, todoArr);
            configTodoObj(listName, todoArr, todoObj);
            
            // add dom item to list
            todoList.append(todoObj.item);
        });

    }

    window.createTodoApp = createTodoApp;
})();
