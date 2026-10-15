import { BrowserRouter } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import PomodoroFloatingWidget from '@/components/common/PomodoroFloatingWidget.jsx';
import AppRoutes from './routes.jsx';

function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <AppRoutes />
        <PomodoroFloatingWidget />
        <Toaster />
      </TooltipProvider>
    </BrowserRouter>
  );
}

export default App;