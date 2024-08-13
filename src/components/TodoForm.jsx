import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const TodoForm = () => {
  const [newTodo, setNewTodo] = useState('');
  const [category, setCategory] = useState('personal');
  const [dueDate, setDueDate] = useState(null);
  const queryClient = useQueryClient();

  const addTodoMutation = useMutation({
    mutationFn: (newTodo) => {
      const todos = JSON.parse(localStorage.getItem('todos')) || [];
      const updatedTodos = [...todos, { id: Date.now(), text: newTodo.text, completed: false, category: newTodo.category, dueDate: newTodo.dueDate }];
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
      return updatedTodos;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['todos']);
      setNewTodo('');
      setCategory('personal');
      setDueDate(null);
    },
  });

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodoMutation.mutate({ text: newTodo, category, dueDate });
    }
  };

  return (
    <form onSubmit={handleAddTodo} className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className="flex-grow"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="work">Work</SelectItem>
            <SelectItem value="shopping">Shopping</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-between items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : <span>Pick a due date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button type="submit">Add Todo</Button>
      </div>
    </form>
  );
};

export default TodoForm;