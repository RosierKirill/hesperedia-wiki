// Enums
export enum MagicForce {
  LUMEN = 'LUMEN',
  VESPER = 'VESPER',
  AETHER = 'AETHER',
  HUMUS = 'HUMUS',
  SANGUIS = 'SANGUIS',
  NIHIL = 'NIHIL',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  SUBSCRIBER = 'SUBSCRIBER',
}

export enum CharacterStatus {
  ALIVE = 'ALIVE',
  DECEASED = 'DECEASED',
  UNDEAD = 'UNDEAD',
  UNKNOWN = 'UNKNOWN',
  TRANSFORMED = 'TRANSFORMED',
}

export enum CreatureCategory {
  SANGUIS_CORRUPTION = 'SANGUIS_CORRUPTION',
  NIHIL_CORRUPTION = 'NIHIL_CORRUPTION',
  MONSTER = 'MONSTER',
  DEMON = 'DEMON',
  ORLA_ENTITY = 'ORLA_ENTITY',
  TRANSFORMED_ANIMAL = 'TRANSFORMED_ANIMAL',
  HYBRID = 'HYBRID',
  DEEP_CREATURE = 'DEEP_CREATURE',
}

export enum LocationType {
  CITY = 'CITY',
  VILLAGE = 'VILLAGE',
  FORTRESS = 'FORTRESS',
  RUIN = 'RUIN',
  DUNGEON = 'DUNGEON',
  LANDMARK = 'LANDMARK',
  SACRED_SITE = 'SACRED_SITE',
  CAMP = 'CAMP',
}

export enum ArticleCategory {
  HISTORY = 'HISTORY',
  MAGIC_SYSTEM = 'MAGIC_SYSTEM',
  CULTURE = 'CULTURE',
  RELIGION = 'RELIGION',
  GEOGRAPHY = 'GEOGRAPHY',
  POLITICS = 'POLITICS',
  EVENT = 'EVENT',
  MYTHOLOGY = 'MYTHOLOGY',
}

export enum ProjectType {
  VIDEO_GAME = 'VIDEO_GAME',
  TABLETOP_GAME = 'TABLETOP_GAME',
  COMIC = 'COMIC',
  MANGA = 'MANGA',
  ANIMATION = 'ANIMATION',
  NOVEL = 'NOVEL',
}

export enum ProjectStatus {
  ANNOUNCED = 'ANNOUNCED',
  IN_DEVELOPMENT = 'IN_DEVELOPMENT',
  DEMO_AVAILABLE = 'DEMO_AVAILABLE',
  RELEASED = 'RELEASED',
  ON_HOLD = 'ON_HOLD',
}

export enum FactionType {
  KINGDOM = 'KINGDOM',
  EMPIRE = 'EMPIRE',
  CITY_STATE = 'CITY_STATE',
  CULT = 'CULT',
  ORDER = 'ORDER',
  GUILD = 'GUILD',
  CLAN = 'CLAN',
  CHURCH = 'CHURCH',
  SECRET_SOCIETY = 'SECRET_SOCIETY',
}

// Interfaces
export interface MapCoords {
  x: number
  y: number
  polygon?: [number, number][]
}

export interface User {
  id: string
  email: string
  username: string
  role: UserRole
  avatarUrl?: string
  createdAt: string
}

export interface Realm {
  id: string
  name: string
  slug: string
  description?: string
  mapImageUrl?: string
  color?: string
  order: number
}

export interface Region {
  id: string
  name: string
  slug: string
  realmId: string
  realm?: Realm
  description?: string
  biome?: string
  dominantForce?: MagicForce
  mapCoords?: MapCoords
  imageUrl?: string
}

export interface Location {
  id: string
  name: string
  slug: string
  type: LocationType
  realmId: string
  regionId?: string
  region?: Region
  description?: string
  mapCoords?: { x: number; y: number }
  imageUrl?: string
  isCapital: boolean
}

export interface Faction {
  id: string
  name: string
  slug: string
  type: FactionType
  description?: string
  logoUrl?: string
  dominantForce?: MagicForce
  alignment?: string
}

export interface Character {
  id: string
  name: string
  slug: string
  titles: string[]
  species: string
  gender?: string
  age?: string
  status: CharacterStatus
  affiliations: Faction[]
  homeLocation?: Location
  portraitUrl?: string
  bannerUrl?: string
  primaryForce?: MagicForce
  secondaryForce?: MagicForce
  magicLevel?: number
  biography: string
  personality?: string
  abilities?: string
  isMainCharacter: boolean
  publishedAt?: string
}

export interface Creature {
  id: string
  name: string
  slug: string
  category: CreatureCategory
  subcategory?: string
  origin: string
  primaryForce?: MagicForce
  dangerLevel?: number
  description: string
  abilities?: string
  weaknesses?: string
  habitat?: string
  portraitUrl?: string
  publishedAt?: string
}

export interface Article {
  id: string
  title: string
  slug: string
  category: ArticleCategory
  excerpt?: string
  content: string
  coverImageUrl?: string
  tags: string[]
  magicForces: MagicForce[]
  featured: boolean
  publishedAt?: string
  avgRating?: number
  ratingCount?: number
}

export interface Project {
  id: string
  title: string
  slug: string
  type: ProjectType
  status: ProjectStatus
  description: string
  coverImageUrl?: string
  releaseDate?: string
  links?: Record<string, string>
  tags: string[]
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiError {
  message: string
  code?: string
  details?: Record<string, string[]>
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface SearchResult {
  type: 'character' | 'creature' | 'article' | 'faction' | 'location'
  id: string
  slug: string
  name: string
  excerpt?: string
  imageUrl?: string
}
