
import React from 'react';
import Index from './pages/Index';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <div className="h-screen">
      <Index />
      <Toaster />
    </div>
  );
}

export default App;
