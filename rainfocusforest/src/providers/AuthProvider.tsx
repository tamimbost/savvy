import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { readLS, writeLS } from '../lib/storage';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(readLS('isLoggedIn', false));
  useEffect(() => { writeLS('isLoggedIn', isLoggedIn); }, [isLoggedIn]);
  return { isLoggedIn, setIsLoggedIn };
}

export function AuthGate({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) return fallback as any;
  return children as any;
}

