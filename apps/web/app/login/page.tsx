'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { Button } from '@/components/ui/Button'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, isLoading } = useAuthStore()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      router.push('/')
    } catch {
      setError('Email ou mot de passe incorrect.')
    }
  }

  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-lumen-500 text-3xl">✦</span>
          <h1 className="font-heading text-2xl font-bold text-ink dark:text-parchment-100 mt-2">Connexion</h1>
          <p className="font-body italic text-ink/60 dark:text-parchment-400 mt-1">Accéder à l&apos;espace communauté</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-ui font-medium text-ink dark:text-parchment-200 mb-1.5" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-parchment-300 dark:border-nihil-600 bg-parchment-50 dark:bg-nihil-800 text-ink dark:text-parchment-100 font-ui text-sm focus:outline-none focus:ring-2 focus:ring-lumen-500/50"
              placeholder="votre@email.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-ui font-medium text-ink dark:text-parchment-200 mb-1.5" htmlFor="password">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-parchment-300 dark:border-nihil-600 bg-parchment-50 dark:bg-nihil-800 text-ink dark:text-parchment-100 font-ui text-sm focus:outline-none focus:ring-2 focus:ring-lumen-500/50"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-sm font-ui text-sanguis-600 dark:text-sanguis-400">{error}</p>
          )}

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Se connecter
          </Button>
        </form>
      </div>
    </div>
  )
}
