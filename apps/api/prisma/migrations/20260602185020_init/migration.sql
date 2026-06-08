-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EDITOR', 'SUBSCRIBER');

-- CreateEnum
CREATE TYPE "MagicForce" AS ENUM ('LUMEN', 'VESPER', 'AETHER', 'HUMUS', 'SANGUIS', 'NIHIL');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('CITY', 'VILLAGE', 'FORTRESS', 'RUIN', 'DUNGEON', 'LANDMARK', 'SACRED_SITE', 'CAMP');

-- CreateEnum
CREATE TYPE "FactionType" AS ENUM ('KINGDOM', 'EMPIRE', 'CITY_STATE', 'CULT', 'ORDER', 'GUILD', 'CLAN', 'CHURCH', 'SECRET_SOCIETY');

-- CreateEnum
CREATE TYPE "CharacterStatus" AS ENUM ('ALIVE', 'DECEASED', 'UNDEAD', 'UNKNOWN', 'TRANSFORMED');

-- CreateEnum
CREATE TYPE "CreatureCategory" AS ENUM ('SANGUIS_CORRUPTION', 'NIHIL_CORRUPTION', 'MONSTER', 'DEMON', 'ORLA_ENTITY', 'TRANSFORMED_ANIMAL', 'HYBRID', 'DEEP_CREATURE');

-- CreateEnum
CREATE TYPE "CreatureOrigin" AS ENUM ('NATURAL', 'SANGUIS', 'NIHIL', 'UNDERWORLD', 'ORLA', 'ANCIENT_MAGIC', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "ArticleCategory" AS ENUM ('HISTORY', 'MAGIC_SYSTEM', 'CULTURE', 'RELIGION', 'GEOGRAPHY', 'POLITICS', 'EVENT', 'MYTHOLOGY');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('VIDEO_GAME', 'TABLETOP_GAME', 'COMIC', 'MANGA', 'ANIMATION', 'NOVEL', 'SHORT_FILM', 'OTHER');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ANNOUNCED', 'IN_DEVELOPMENT', 'DEMO_AVAILABLE', 'RELEASED', 'ON_HOLD', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'SUBSCRIBER',
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Realm" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "mapImageUrl" TEXT,
    "color" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Realm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "realmId" TEXT NOT NULL,
    "description" TEXT,
    "biome" TEXT,
    "dominantForce" "MagicForce",
    "mapCoords" JSONB,
    "imageUrl" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "LocationType" NOT NULL,
    "realmId" TEXT NOT NULL,
    "regionId" TEXT,
    "description" TEXT,
    "mapCoords" JSONB,
    "imageUrl" TEXT,
    "isCapital" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faction" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "FactionType" NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "bannerUrl" TEXT,
    "dominantForce" "MagicForce",
    "alignment" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Faction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titles" TEXT[],
    "species" TEXT NOT NULL,
    "gender" TEXT,
    "age" TEXT,
    "status" "CharacterStatus" NOT NULL,
    "portraitUrl" TEXT,
    "bannerUrl" TEXT,
    "primaryForce" "MagicForce",
    "secondaryForce" "MagicForce",
    "magicLevel" INTEGER,
    "biography" TEXT NOT NULL,
    "personality" TEXT,
    "abilities" TEXT,
    "history" TEXT,
    "isMainCharacter" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "homeLocationId" TEXT,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Creature" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "CreatureCategory" NOT NULL,
    "subcategory" TEXT,
    "origin" "CreatureOrigin" NOT NULL,
    "primaryForce" "MagicForce",
    "dangerLevel" INTEGER,
    "description" TEXT NOT NULL,
    "abilities" TEXT,
    "weaknesses" TEXT,
    "habitat" TEXT,
    "portraitUrl" TEXT,
    "imageUrl" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Creature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "ArticleCategory" NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "tags" TEXT[],
    "magicForces" "MagicForce"[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharactersOnFactions" (
    "characterId" TEXT NOT NULL,
    "factionId" TEXT NOT NULL,

    CONSTRAINT "CharactersOnFactions_pkey" PRIMARY KEY ("characterId","factionId")
);

-- CreateTable
CREATE TABLE "CharactersOnLocations" (
    "characterId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,

    CONSTRAINT "CharactersOnLocations_pkey" PRIMARY KEY ("characterId","locationId")
);

-- CreateTable
CREATE TABLE "ArticlesOnCharacters" (
    "articleId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,

    CONSTRAINT "ArticlesOnCharacters_pkey" PRIMARY KEY ("articleId","characterId")
);

-- CreateTable
CREATE TABLE "ArticlesOnCreatures" (
    "articleId" TEXT NOT NULL,
    "creatureId" TEXT NOT NULL,

    CONSTRAINT "ArticlesOnCreatures_pkey" PRIMARY KEY ("articleId","creatureId")
);

-- CreateTable
CREATE TABLE "ArticlesOnFactions" (
    "articleId" TEXT NOT NULL,
    "factionId" TEXT NOT NULL,

    CONSTRAINT "ArticlesOnFactions_pkey" PRIMARY KEY ("articleId","factionId")
);

-- CreateTable
CREATE TABLE "ArticlesOnLocations" (
    "articleId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,

    CONSTRAINT "ArticlesOnLocations_pkey" PRIMARY KEY ("articleId","locationId")
);

-- CreateTable
CREATE TABLE "ArticlesOnRegions" (
    "articleId" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,

    CONSTRAINT "ArticlesOnRegions_pkey" PRIMARY KEY ("articleId","regionId")
);

-- CreateTable
CREATE TABLE "FactionsOnRegions" (
    "factionId" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,

    CONSTRAINT "FactionsOnRegions_pkey" PRIMARY KEY ("factionId","regionId")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "ProjectType" NOT NULL,
    "status" "ProjectStatus" NOT NULL,
    "description" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "bannerUrl" TEXT,
    "releaseDate" TIMESTAMP(3),
    "links" JSONB,
    "tags" TEXT[],
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "parentId" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleRating" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArticleRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityProposal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "submittedBy" TEXT,
    "voteCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityProposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "provider" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "altText" TEXT,
    "tags" TEXT[],
    "uploadedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Realm_name_key" ON "Realm"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Realm_slug_key" ON "Realm"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Region_slug_key" ON "Region"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Location_slug_key" ON "Location"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Faction_slug_key" ON "Faction"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Character_slug_key" ON "Character"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Creature_slug_key" ON "Creature"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_targetType_targetId_key" ON "Vote"("userId", "targetType", "targetId");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleRating_userId_articleId_key" ON "ArticleRating"("userId", "articleId");

-- AddForeignKey
ALTER TABLE "Region" ADD CONSTRAINT "Region_realmId_fkey" FOREIGN KEY ("realmId") REFERENCES "Realm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_realmId_fkey" FOREIGN KEY ("realmId") REFERENCES "Realm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_homeLocationId_fkey" FOREIGN KEY ("homeLocationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharactersOnFactions" ADD CONSTRAINT "CharactersOnFactions_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharactersOnFactions" ADD CONSTRAINT "CharactersOnFactions_factionId_fkey" FOREIGN KEY ("factionId") REFERENCES "Faction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharactersOnLocations" ADD CONSTRAINT "CharactersOnLocations_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharactersOnLocations" ADD CONSTRAINT "CharactersOnLocations_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticlesOnCharacters" ADD CONSTRAINT "ArticlesOnCharacters_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticlesOnCharacters" ADD CONSTRAINT "ArticlesOnCharacters_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticlesOnCreatures" ADD CONSTRAINT "ArticlesOnCreatures_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticlesOnCreatures" ADD CONSTRAINT "ArticlesOnCreatures_creatureId_fkey" FOREIGN KEY ("creatureId") REFERENCES "Creature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticlesOnFactions" ADD CONSTRAINT "ArticlesOnFactions_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticlesOnFactions" ADD CONSTRAINT "ArticlesOnFactions_factionId_fkey" FOREIGN KEY ("factionId") REFERENCES "Faction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticlesOnLocations" ADD CONSTRAINT "ArticlesOnLocations_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticlesOnLocations" ADD CONSTRAINT "ArticlesOnLocations_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticlesOnRegions" ADD CONSTRAINT "ArticlesOnRegions_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticlesOnRegions" ADD CONSTRAINT "ArticlesOnRegions_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactionsOnRegions" ADD CONSTRAINT "FactionsOnRegions_factionId_fkey" FOREIGN KEY ("factionId") REFERENCES "Faction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactionsOnRegions" ADD CONSTRAINT "FactionsOnRegions_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleRating" ADD CONSTRAINT "ArticleRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleRating" ADD CONSTRAINT "ArticleRating_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
