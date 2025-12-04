import { useToast as useVueToast } from 'vue-toastification';
import type { ToastOptions } from 'vue-toastification';

export const useToast = () => {
  const toast = useVueToast();

  const success = (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      timeout: 3000,
      ...options,
    });
  };

  const error = (message: string, options?: ToastOptions) => {
    return toast.error(message, {
      timeout: 5000,
      ...options,
    });
  };

  const info = (message: string, options?: ToastOptions) => {
    return toast.info(message, {
      timeout: 4000,
      ...options,
    });
  };

  const warning = (message: string, options?: ToastOptions) => {
    return toast.warning(message, {
      timeout: 4000,
      ...options,
    });
  };

  return {
    success,
    error,
    info,
    warning,
    toast,
  };
};

