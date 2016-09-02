'use strict';// strict mode prevents certain actions from being taken, throws more exceptions, prevents/throws errors, disables confusing/poorly-thought-out features

var app = {}; // create namespace for our app

// Models
// ToDo Model Creation
app.Todo = Backbone.Model.extend({
  defaults: { // base vals
    title: '',
    completed: false
  }
});

// Collections
app.TodoList = Backbone.Collection.extend({
  model: app.Todo,
  localStorage: new Store("backbone-todo")
});
// instance of the Collection
app.todoList = new app.TodoList();

// Views
// render individual todo items list
app.TodoView = Backbone.View.extend({
    tagName: 'li',
    template: _.template($('#item-template').html()),
    render: function(){
        this.$el.html(this.template(this.model.toJson()));
        return this; // enables chained calls
    }
});
// renders the full list of todo items calling TodoView for each
app.AppView = Backbone.View.extend({
  el: '#todoapp',
  initialize: function () {
    this.input = this.$('#new-todo');
    app.todoList.on('add', this.addAll, this);
    app.todoList.on('reset', this.addAll, this);
    app.todoList.fetch(); // loads list from local storage
  },
  events: {
    'keypress #new-todo': 'createTodoOnEnter'
  },
  createTodoOnEnter: function(e){
    if ( e.which !== 13 || !this.input.val().trim() ) { // ENTER_KEY = 13
      return;
    }
    app.todoList.create(this.newAttributes());
    this.input.val(''); // clean input box
  },
  addOne: function(todo){
    var view = new app.TodoView({model: todo});
    $('#todo-list').append(view.render().el);
  },
  addAll: function(){
    this.$('#todo-list').html(''); // clean the todo list
    app.todoList.each(this.addOne, this);
  },
  newAttributes: function(){
    return {
      title: this.input.val().trim(),
      completed: false
    }
  }
});
//////7 COMMENT