/*
  Warnings:

  - Added the required column `supportedOS` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Game` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `password` to the `Node` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Node` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "steamAppId" TEXT,
    "gameCode" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "supportedOS" JSONB NOT NULL,
    "startupCommands" TEXT,
    "defaultConfig" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Game" ("createdAt", "defaultConfig", "description", "gameCode", "id", "name", "startupCommands", "steamAppId", "updatedAt") SELECT "createdAt", "defaultConfig", "description", "gameCode", "id", "name", "startupCommands", "steamAppId", "updatedAt" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
CREATE UNIQUE INDEX "Game_gameCode_key" ON "Game"("gameCode");
CREATE TABLE "new_Node" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OFFLINE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Node" ("createdAt", "description", "id", "ipAddress", "name", "os", "port", "uid", "updatedAt") SELECT "createdAt", "description", "id", "ipAddress", "name", "os", "port", "uid", "updatedAt" FROM "Node";
DROP TABLE "Node";
ALTER TABLE "new_Node" RENAME TO "Node";
CREATE UNIQUE INDEX "Node_uid_key" ON "Node"("uid");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
