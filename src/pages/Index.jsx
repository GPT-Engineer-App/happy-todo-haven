import React from 'react';
import TodoList from '../components/TodoList';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Todo App</CardTitle>
        </CardHeader>
        <CardContent>
          <TodoList />
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;