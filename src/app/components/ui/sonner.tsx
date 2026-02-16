import { Toaster as SonnerToaster, toast } from 'sonner';

export function Toaster() {
  return <SonnerToaster closeButton richColors position="top-right" />;
}

export { toast };
