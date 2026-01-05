import { useState } from 'react';

export type ApiState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useApiState<T>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async (apiCall: () => Promise<T>) => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error: any) {
      const message = error.message || 'Erro desconhecido';
      setState({ data: null, loading: false, error: message });
      throw error;
    }
  };

  const reset = () => {
    setState({ data: null, loading: false, error: null });
  };

  return { ...state, execute, reset };
}
