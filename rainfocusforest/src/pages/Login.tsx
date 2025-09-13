import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { writeLS } from '../lib/storage';
import { useNavigate } from 'react-router-dom';

type FormValues = { email: string; password: string };

const VALID_EMAIL = 'rainfocusforest@gmail.com';
const VALID_PASSWORD = '*TamimBost500#';

export default function Login() {
  const { register, handleSubmit } = useForm<FormValues>();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onSubmit = (data: FormValues) => {
    if (data.email === VALID_EMAIL && data.password === VALID_PASSWORD) {
      writeLS('isLoggedIn', true);
      navigate('/');
    } else {
      setError(t('login.error'));
      setTimeout(() => setError(null), 2000);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-app">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-surface p-8 rounded-2xl shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">{t('login.title')}</h1>
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="grid gap-1">
            <span className="text-sm text-app-2">{t('login.email')}</span>
            <input className="border rounded-lg p-2 bg-app/10" type="email" required {...register('email')} />
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-app-2">{t('login.password')}</span>
            <input className="border rounded-lg p-2 bg-app/10" type="password" required {...register('password')} />
          </label>
          <button className="btn-primary" type="submit">{t('login.submit')}</button>
        </form>
        <AnimatePresence>
          {error && (
            <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-400 text-red-600">
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

