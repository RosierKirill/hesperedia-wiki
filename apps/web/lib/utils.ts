import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { MagicForce } from '@hesperedia/shared-types'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export const FORCE_COLORS: Record<MagicForce, { text: string; bg: string; border: string; glow: string }> = {
  [MagicForce.LUMEN]: {
    text: 'text-lumen-600',
    bg: 'bg-lumen-500',
    border: 'border-lumen-400',
    glow: 'animate-glow-lumen',
  },
  [MagicForce.VESPER]: {
    text: 'text-vesper-400',
    bg: 'bg-vesper-600',
    border: 'border-vesper-400',
    glow: 'animate-glow-vesper',
  },
  [MagicForce.AETHER]: {
    text: 'text-aether-400',
    bg: 'bg-aether-500',
    border: 'border-aether-400',
    glow: '',
  },
  [MagicForce.HUMUS]: {
    text: 'text-humus-400',
    bg: 'bg-humus-500',
    border: 'border-humus-400',
    glow: '',
  },
  [MagicForce.SANGUIS]: {
    text: 'text-sanguis-400',
    bg: 'bg-sanguis-600',
    border: 'border-sanguis-400',
    glow: 'animate-glow-sanguis',
  },
  [MagicForce.NIHIL]: {
    text: 'text-nihil-400',
    bg: 'bg-nihil-600',
    border: 'border-nihil-400',
    glow: '',
  },
}

export const FORCE_ICONS: Record<MagicForce, string> = {
  [MagicForce.LUMEN]: '✦',
  [MagicForce.VESPER]: '☽',
  [MagicForce.AETHER]: '≋',
  [MagicForce.HUMUS]: '⬡',
  [MagicForce.SANGUIS]: '♦',
  [MagicForce.NIHIL]: '○',
}

export const FORCE_LABELS: Record<MagicForce, string> = {
  [MagicForce.LUMEN]: 'Lumen',
  [MagicForce.VESPER]: 'Vesper',
  [MagicForce.AETHER]: 'Aether',
  [MagicForce.HUMUS]: 'Humus',
  [MagicForce.SANGUIS]: 'Sanguis',
  [MagicForce.NIHIL]: 'Nihil',
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return ''
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date))
}
