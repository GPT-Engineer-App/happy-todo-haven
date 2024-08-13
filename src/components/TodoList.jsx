import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TodoList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const { data: todos = [], isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: () => {
      const storedTodos = localStorage.getItem('todos');
      return storedTodos ? JSON.parse(storedTodos) : [];
    },
  });

  const filteredTodos = todos.filter(todo => 
    todo.text.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCategory === 'all' || todo.category === filterCategory)
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <TodoForm />
      <div className="flex space-x-2">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search todos"
          className="flex-grow"
        />
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="work">Work</SelectItem>
            <SelectItem value="shopping">Shopping</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ul className="space-y-3">
        {filteredTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;