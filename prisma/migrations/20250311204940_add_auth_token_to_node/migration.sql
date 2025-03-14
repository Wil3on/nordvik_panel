/*
  Warnings:

  - The required column `authToken` was added to the `Node` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Node" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "os" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "authToken" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OFFLINE'
);
INSERT INTO "new_Node" ("createdAt", "description", "id", "ipAddress", "name", "os", "password", "port", "status", "uid", "updatedAt", "username") SELECT "createdAt", "description", "id", "ipAddress", "name", "os", "password", "port", "status", "uid", "updatedAt", "username" FROM "Node";
DROP TABLE "Node";
ALTER TABLE "new_Node" RENAME TO "Node";
CREATE UNIQUE INDEX "Node_uid_key" ON "Node"("uid");
CREATE UNIQUE INDEX "Node_authToken_key" ON "Node"("authToken");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
