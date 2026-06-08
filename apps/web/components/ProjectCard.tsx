import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Project, ProjectStatus } from '@hesperedia/shared-types'

const statusColors: Record<ProjectStatus, string> = {
  [ProjectStatus.ANNOUNCED]: 'text-aether-400 bg-aether-900/30 border-aether-700/40',
  [ProjectStatus.IN_DEVELOPMENT]: 'text-lumen-400 bg-lumen-900/30 border-lumen-700/40',
  [ProjectStatus.DEMO_AVAILABLE]: 'text-vesper-400 bg-vesper-900/30 border-vesper-700/40',
  [ProjectStatus.RELEASED]: 'text-humus-400 bg-humus-900/30 border-humus-700/40',
  [ProjectStatus.ON_HOLD]: 'text-nihil-400 bg-nihil-800 border-nihil-700/40',
}

const statusLabels: Record<ProjectStatus, string> = {
  [ProjectStatus.ANNOUNCED]: 'Annoncé',
  [ProjectStatus.IN_DEVELOPMENT]: 'En développement',
  [ProjectStatus.DEMO_AVAILABLE]: 'Démo disponible',
  [ProjectStatus.RELEASED]: 'Sorti',
  [ProjectStatus.ON_HOLD]: 'En pause',
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`}>
      <motion.article
        className="group rounded-xl overflow-hidden border border-nihil-700 hover:border-lumen-600/50 bg-nihil-800 transition-colors h-full flex flex-col"
        whileHover={{ y: -3 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {project.coverImageUrl ? (
          <div className="relative h-40 overflow-hidden">
            <Image
              src={project.coverImageUrl}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-nihil-800 to-transparent" />
          </div>
        ) : (
          <div className="h-40 bg-gradient-to-br from-nihil-700 to-nihil-800 flex items-center justify-center">
            <span className="text-4xl opacity-20">
              {project.type === 'VIDEO_GAME' ? '🎮'
                : project.type === 'TABLETOP_GAME' ? '🎲'
                : project.type === 'COMIC' ? '📚'
                : project.type === 'MANGA' ? '📖'
                : project.type === 'ANIMATION' ? '🎬'
                : project.type === 'NOVEL' ? '📝'
                : '✨'}
            </span>
          </div>
        )}

        <div className="p-4 flex flex-col gap-2 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-ui text-parchment-500 uppercase tracking-wide">
              {project.type.replace('_', ' ')}
            </p>
            <span className={`text-xs font-ui px-2 py-0.5 rounded-full border shrink-0 ${statusColors[project.status]}`}>
              {statusLabels[project.status]}
            </span>
          </div>

          <h3 className="font-heading text-parchment-100 font-semibold leading-tight group-hover:text-lumen-300 transition-colors">
            {project.title}
          </h3>

          <p className="text-sm font-body text-parchment-400 line-clamp-2 flex-1 leading-relaxed">
            {project.description}
          </p>

          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {project.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs font-ui px-1.5 py-0.5 rounded bg-nihil-700 text-parchment-500">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.article>
    </Link>
  )
}
