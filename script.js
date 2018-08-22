var todoObject = {
  switch: 0,
  store: function (namespace, data) {
			if (arguments.length > 1) {
				return localStorage.setItem(namespace, JSON.stringify(data));
			} else {
				var store = localStorage.getItem(namespace);
				return (store && JSON.parse(store)) || [];
			}
		},
  todoList: [],
  getActiveTodos: function() {
    return this.todoList.filter(function(todo) {
      return !todo.completed;
    })
  },
  getCompletedTodos: function() {
    return this.todoList.filter(function(todo) {
      return todo.completed;
    })
  },
  getFilteredTodos:function() {
      if(todoObject.switch === 0) { 
        return this.todoList; 
      }
      if(todoObject.switch ===1) {
        return this.getActiveTodos();
      }
      if(todoObject.switch === 2) { 
        return this.getCompletedTodos();
      }
  },
  uuid: function () {
			var i, random;
			var uuid = '';

			for (i = 0; i < 32; i++) {
				random = Math.random() * 16 | 0;
				if (i === 8 || i === 12 || i === 16 || i === 20) {
					uuid += '-';
				}
				uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
			}

			return uuid;
		},
  addTodo: function(todo) {
    this.todoList.push({
      id: todoObject.uuid(),
      title: todo,
      completed: false
    });
    render.displayChange();
  },
  editTodo: function(position, newTitle) {
    this.todoList[position].title = newTitle;
    render.displayChange();
  },
  deleteTodo: function(position) {
    this.todoList.splice(position, 1);
    render.displayChange();
  },
  toggleAll: function() {
    var isChecked = HTMLvar.toggleAll.checked;
    if(isChecked === true) {
      this.todoList.forEach(function(todo) {
        todo.completed = true;
      })  
    } 
    if(isChecked === false) {
      this.todoList.forEach(function(todo) {
        todo.completed = false;
      })
    }
    render.displayChange();
  },
  toggleCompleted: function(position) {
    toggleAll = HTMLvar.toggleAll;
    totalTodos = this.todoList.length;
    completedTodos = 0;
    this.todoList[position].completed = !this.todoList[position].completed;
    this.todoList.forEach(function(todo) {
      if(todo.completed === true) {
        completedTodos++;
      }
    })
    if(completedTodos === totalTodos) {
      toggleAll.checked = true;
    }
    if(completedTodos != totalTodos) {
      toggleAll.checked = false;
    }
    render.displayChange();
  },
  getIndexByClick: function(event) {
    var uuid = event.id;
    todoList = this.todoList;
    var index = todoObject.todoList.length;
      
    while(index--) {
      if(todoList[index].id === uuid) {
        return index;
      }
    }
  },
  getIndexByNode: function(event) {
    var uuid = elementClicked.parentNode.id;
    todoList = this.todoList;
    var index = todoObject.todoList.length;
      
    while(index--) {
      if(todoList[index].id === uuid) {
        return index;
      }
    }
  }
};

var HTMLvar = {
  addTodo: document.getElementById('addTodo'),
  toggleAll: document.getElementById('toggleAll'),
  todoLabels: document.getElementById('todoLabels'),
  footer: document.getElementById('footer'),
  all: document.getElementById('0'),
  active: document.getElementById('1'),
  completed: document.getElementById('2'),
  item: document.getElementById('item')
};

var HTMLcreate = {
  createCheckBox: function() {
    var chkBox = document.createElement("input");
    chkBox.type = 'checkBox';
    chkBox.className = 'checkbox';
    return chkBox;
  },
  createInputBox: function(todo, uuid) {
    var inputBox = document.createElement("input");
    inputBox.className = 'editor';
    inputBox.value = todo;
    inputBox.id = 'Box'+uuid;
    inputBox.style.visibility = 'hidden';
    
    return inputBox;
  },
  createDeleteButton: function() {
    var deleteButton = document.createElement('button');
    deleteButton.className = 'deleteButton';
    deleteButton.textContent = 'x';
    return deleteButton;
  },
  createClearCompleted: function() {
    var clearCompleted = document.createElement('a');
    clearCompleted.className = 'destroy';
    clearCompleted.textContent = 'Clear Completed';
    clearCompleted.id = 'destroy';
    clearCompleted.style.visibility = 'hidden';
    return clearCompleted;
  },
  createItemIndicator: function() {
    var itemIndicator = document.createElement('a');
    var completedTodos = todoObject.getCompletedTodos().length;
    var totalTodos = todoObject.todoList.length;
    var value = totalTodos;
    var items = filterObject.pluralize(totalTodos, 'item');
    itemIndicator.className = 'indicator';
    itemIndicator.className = 'indicator';
    itemIndicator.textContent = value + ' '+ items + ' '+ 'left';
    return itemIndicator;
  }
};

var render = {
  displayChange: function() {
    todoObject.store('savedTodos', todoObject.todoList);
    itemIndicator = HTMLcreate.createItemIndicator();
    var todos = todoObject.getFilteredTodos();
    var todoLabels = HTMLvar.todoLabels;
    todoLabels.innerHTML = '';
    HTMLvar.item.innerHTML = '';
    HTMLvar.item.appendChild(itemIndicator);
    
    
    todos.forEach(function(todo) {
      var todoLi = document.createElement('li');
      var checkBox = HTMLcreate.createCheckBox();
      var deleteButton = HTMLcreate.createDeleteButton();
      var editInput = HTMLcreate.createInputBox(todo.title, todo.id);
      
      if(todo.completed === false) {  
        todoLi.textContent = todo.title;
        todoLi.id = todo.id;
        todoLi.className = 'edit';
        todoLi.prepend(checkBox);
        checkBox.checked = false;
        todoLi.appendChild(deleteButton);
        todoLabels.appendChild(todoLi);
        todoLabels.appendChild(editInput);
      } else {
        todoLi.textContent = todo.title;
        todoLi.id = todo.id;
        todoLi.className = 'strike';
        todoLi.prepend(checkBox);
        checkBox.checked = true;
        todoLi.appendChild(deleteButton);
        todoLabels.appendChild(todoLi);
        todoLabels.appendChild(editInput);
      }
    })
    
    if(todoObject.todoList.length === 0) {
      HTMLvar.toggleAll.checked = false;
      HTMLvar.toggleAll.style.visibility = 'Hidden';
      HTMLvar.footer.style.visibility = 'Hidden';
      HTMLvar.item.style.visibility = 'Hidden';
      todoObject.switch = 0;
      var all = document.getElementById('0');
      all.classList.add('selected');
      var active = document.getElementById('1');
      active.classList.remove('selected');
      var completed = document.getElementById('2');
      completed.classList.remove('selected');
    }
    
    if(todoObject.todoList.length > 0) {
      HTMLvar.toggleAll.style.visibility = '';
      HTMLvar.footer.style.visibility = '';
      HTMLvar.item.style.visibility = '';
    }
    
    if(todoObject.getCompletedTodos().length > 0) {
      var clearCompleted = document.getElementById('destroy');
      clearCompleted.style.visibility = '';
    }
    
    if(todoObject.getCompletedTodos().length === 0) {
      var clearCompleted = document.getElementById('destroy')
      clearCompleted.style.visibility = 'hidden';
    }
  }
};    
  
//allows pressing enter button to add input value to todo array
 HTMLvar.addTodo.addEventListener('keyup', function(e) {
  val = HTMLvar.addTodo.value.trim();
  if(e.keyCode === 13 && val!== '') {
    todoObject.addTodo(val);
    HTMLvar.addTodo.value = '';
  }
});

HTMLvar.toggleAll.addEventListener('click', function() {
  var isChecked = HTMLvar.toggleAll.checked;
  console.log(isChecked);
  todoObject.toggleAll();
});

HTMLvar.todoLabels.addEventListener('click', function(event) {
  elementClicked = event.target;
  var index = todoObject.getIndexByNode(elementClicked)
  console.log(index);
  if(elementClicked.className === "checkbox") {
    todoObject.toggleCompleted(todoObject.getIndexByNode());
  }
  if(elementClicked.className === "deleteButton") {
    todoObject.deleteTodo(todoObject.getIndexByNode());  
  }
})

HTMLvar.todoLabels.addEventListener('dblclick', function(event) {
  var elementClicked = event.target;
  var index = todoObject.getIndexByClick(elementClicked);
  var ValForAbort = todoObject.todoList[index].title;
  console.log(ValForAbort)
  console.log(index);
  var inputBox = HTMLcreate.createInputBox();
  inputBox.value = todoObject.todoList[index].title;
  
  if(elementClicked.className != 'editing') {
    elementClicked.classList.add('editing');
    elementClicked.style.visibility = 'hidden';
    var editorById = 'Box'+elementClicked.id;
    console.log(editorById);
    
    editInput = document.getElementById(editorById);
    editInput.style.visibility = ''; 
    editInput.focus();
    
    editInput.addEventListener('focusout', function() {
      var editInputVal = editInput.value.trim();
      if(editInputVal === '') {
        todoObject.deleteTodo(index);
        HTMLvar.addTodo.focus();
      } else {
      todoObject.editTodo(index, editInputVal);
      HTMLvar.addTodo.focus();
      }
    })
    editInput.addEventListener('keyup', function(e) {
      var editInputVal = editInput.value;
      
      if(e.keyCode === 27 && editInputVal !== '') {
        editInput.value = ValForAbort;
        HTMLvar.addTodo.focus();
      };
      if(e.keyCode === 27 && editInputVal == '') {
        todoObject.deleteTodo(index);
        HTMLvar.addTodo.focus();
      };
     
      if(e.keyCode === 13 && editInputVal !== '') {
        todoObject.editTodo(index, editInputVal);
        HTMLvar.addTodo.focus();
      };
    
      if(e.keyCode === 13 && editInputVal == '') {
        todoObject.deleteTodo(index);
        HTMLvar.addTodo.focus();
      };
    });
  };
});

HTMLvar.footer.addEventListener('click', function(event) {
  elementClicked = event.target;
   if(elementClicked.className === 'filter') {
    var all = document.getElementById('0');
    all.classList.remove('selected');
    var active = document.getElementById('1');
    active.classList.remove('selected');
    var completed = document.getElementById('2');
    completed.classList.remove('selected');
    console.log(elementClicked);
    id = elementClicked.id;
    todoObject.switch = parseInt(id);
    console.log(todoObject.switch);
    elementClicked.classList.add('selected');
    render.displayChange();
  }
  if(elementClicked.className === 'destroy') {
    todoObject.todoList = todoObject.getActiveTodos();
    render.displayChange();
    HTMLvar.addTodo.focus();
  };
});

filterObject = {
  filters: [{selection: 'All', selected: false}, {selection: 'Active', selected: false}, {selection: 'Completed', selected: false}],
  pluralize: function (count, word) {
		return count === 1 ? word : word + 's';
  },
  renderFilters: function() {
    var cCompleted = HTMLcreate.createClearCompleted(); 
    HTMLvar.footer.innerHTML = '';
    this.filters.forEach(function(filter, i) {
      var selector = document.createElement('a');
      selector.textContent = filter.selection;
      selector.classList.add('filter');
      selector.id = i;
      HTMLvar.footer.appendChild(selector);
        console.log(selector);
    })
    HTMLvar.footer.appendChild(cCompleted);
    
  },
  toggleSelected: function(position) {
    this.filters.forEach(function(filter) {
      filter.selected = false;
    })
    this.filters[position].selected = !this.filters[position].selected;
  },
  getFilterById: function(target) {
    var id = event.id; 
  },
};

todoObject.todoList = todoObject.store('savedTodos')
filterObject.renderFilters();
render.displayChange();



