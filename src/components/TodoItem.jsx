import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

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

  const getCategoryColor = (category) => {
    switch (category) {
      case 'personal': return 'bg-blue-500';
      case 'work': return 'bg-green-500';
      case 'shopping': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <li className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-3 flex-grow">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={handleToggle}
          id={`todo-${todo.id}`}
        />
        <div className="flex flex-col">
          <label
            htmlFor={`todo-${todo.id}`}
            className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'} font-medium`}
          >
            {todo.text}
          </label>
          <div className="flex items-center space-x-2 mt-1">
            <Badge className={`${getCategoryColor(todo.category)} text-white`}>
              {todo.category}
            </Badge>
            {todo.dueDate && (
              <span className="text-xs text-gray-500 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {format(new Date(todo.dueDate), "MMM d, yyyy")}
              </span>
            )}
          </div>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={handleDelete}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </li>
  );
};

export default TodoItem;