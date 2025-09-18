"use client"

import { Globe } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useActionState, useEffect } from 'react';
import { loginAction, LoginState, registerAction, RegisterState } from '@/actions';
import LoadingImg from '@/components/loading-img';


export default function AuthPage() {
  return (
    <Suspense>
      <AuthContent />
    </Suspense>
  )
}

function AuthContent() {
  const searchs = useSearchParams()
  const form = searchs.get('form') ?? 'register'

  if (form === 'login') return <Login />
  return <Register />
}

function Register() {
  const [registerState, action, isPending] = useActionState<RegisterState, FormData>(registerAction, {message: ''})

  useEffect(() => {
    if (registerState.token) {
      location.reload()
    }
  }, [registerState])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href='/' className="flex justify-center">
          <Globe className="h-12 w-12 text-highlight" />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Créer un compte
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{' '}
          <Link href='/auth?form=login'
            className="font-medium text-highlight hover:text-highlight/40"
          >
            connectez-vous à votre compte
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" action={action}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom complet
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name='name'
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-highlight-second focus:border-highlight-second"
                  placeholder="Votre nom complet"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name='email'
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-highlight-second focus:border-highlight-second"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  name='password'
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-highlight-second focus:border-highlight-second"
                />
              </div>
            </div>

            <div>
              <p className="mt-2 mb-3 text-red-500">{registerState.message}</p>
              <button
                type="submit"
                className="cursor-pointer w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-highlight hover:bg-highlight-second focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-highlight-second"
              >
                {
                  isPending ? <LoadingImg /> : 'Creer le Compte'
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function Login() {
  const [loginState, action, isPending] = useActionState<LoginState, FormData>(loginAction, {message: ''})

  useEffect(() => {
    if (loginState.token) {
      location.reload()
    }
  }, [loginState])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href='/' className="flex justify-center">
          <Globe className="h-12 w-12 text-highlight" />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Connexion
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{' '}
          <Link href='/auth?form=register'
            className="font-medium text-highlight hover:text-highlight/40"
          >
            créez un compte
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" action={action}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name='email'
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-highlight-second focus:border-highlight-second"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  name='password'
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-highlight-second focus:border-highlight-second"
                />
              </div>
            </div>

            <div>
              <p className="mt-2 mb-3 text-red-500">{loginState.message}</p>
              <button
                type="submit"
                className="cursor-pointer w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-highlight hover:bg-highlight-second focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-highlight-second"
              >
                {
                  isPending ? <LoadingImg /> : 'Se connecter'
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}