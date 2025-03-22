
import React from 'react';
import Index from './pages/Index';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";

function App() {
  return (
    <>
      <Index />
      <Toaster />
      <SonnerToaster position="top-right" />
    </>
  );
}

export default App;
