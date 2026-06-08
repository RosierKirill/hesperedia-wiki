'use client'

import { create } from 'zustand'
import { User, UserRole } from '@hesperedia/shared-types'
import { api } from '@/lib/api'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAdmin: boolean
  isEditor: boolean
  isSubscriber: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  hydrate: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isAdmin: false,
  isEditor: false,
  isSubscriber: false,

  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const { data } = await api.post('/auth/login', { email, password })
      const { user, accessToken, refreshToken } = data.data

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      set({
        user,
        isAdmin: user.role === UserRole.ADMIN,
        isEditor: user.role === UserRole.EDITOR || user.role === UserRole.ADMIN,
        isSubscriber: true,
      })
    } finally {
      set({ isLoading: false })
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    set({ user: null, isAdmin: false, isEditor: false, isSubscriber: false })
  },

  hydrate: () => {
    if (typeof window === 'undefined') return
    const token = localStorage.getItem('accessToken')
    if (!token) return

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('accessToken')
        return
      }
      set({
        user: { id: payload.id, email: payload.email, username: payload.username ?? '', role: payload.role, createdAt: '' },
        isAdmin: payload.role === UserRole.ADMIN,
        isEditor: payload.role === UserRole.EDITOR || payload.role === UserRole.ADMIN,
        isSubscriber: true,
      })
    } catch {
      localStorage.removeItem('accessToken')
    }
  },
}))
