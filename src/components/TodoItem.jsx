import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const TodoItem = ({ todo }) => {
  const queryClient = useQueryClient();

  const toggleTodoMutation = useMutation({
    mutationFn: (updatedTodo) => {
      const todos = JSON.parse(localStorage.getItem('todos'));
      const updatedTodos = todos.map(t => t.id === updatedTodo.id ? updatedTodo : t);
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
      return updatedTodos;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['todos']);
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: (id) => {
      const todos = JSON.parse(localStorage.getItem('todos'));
      const updatedTodos = todos.filter(t => t.id !== id);
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
      return updatedTodos;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['todos']);
    },
  });

  const handleToggle = () => {
    toggleTodoMutation.mutate({ ...todo, completed: !todo.completed });
  };

  const handleDelete = () => {
    deleteTodoMutation.mutate(todo.id);
  };

  return (
    <li className="flex items-center justify-between p-2 bg-white rounded shadow">
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={handleToggle}
          id={`todo-${todo.id}`}
        />
        <label
          htmlFor={`todo-${todo.id}`}
          className={`${todo.completed ? 'line-through text-gray-500' : ''}`}
        >
          {todo.text}
        </label>
      </div>
      <Button variant="ghost" size="icon" onClick={handleDelete}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </li>
  );
};

export default TodoItem;