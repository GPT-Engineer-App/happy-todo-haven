import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TodoItem from './TodoItem';

const TodoList = () => {
  const [newTodo, setNewTodo] = useState('');
  const queryClient = useQueryClient();

  const { data: todos = [], isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: () => {
      // Simulating API call with local storage
      const storedTodos = localStorage.getItem('todos');
      return storedTodos ? JSON.parse(storedTodos) : [];
    },
  });

  const addTodoMutation = useMutation({
    mutationFn: (newTodo) => {
      const updatedTodos = [...todos, { id: Date.now(), text: newTodo, completed: false }];
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
      return updatedTodos;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['todos']);
      setNewTodo('');
    },
  });

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodoMutation.mutate(newTodo);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <form onSubmit={handleAddTodo} className="flex space-x-2">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className="flex-grow"
        />
        <Button type="submit">Add</Button>
      </form>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;