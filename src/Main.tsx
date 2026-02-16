import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/app/components/layout';
import { Toaster } from '@/app/components/ui/sonner';
import { AppStateProvider } from '@/app/contexts/AppStateContext';
import { AuthProvider } from '@/app/contexts/AuthContext';
import { HomePage } from '@/app/pages/home';
import '@/styles/index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppStateProvider>
          <Toaster />
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate replace to="/home" />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="*" element={<Navigate replace to="/home" />} />
            </Route>
          </Routes>
        </AppStateProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
