/*
  Warnings:

  - You are about to drop the column `hora_entrada` on the `instituciones` table. All the data in the column will be lost.
  - You are about to drop the column `hora_salida` on the `instituciones` table. All the data in the column will be lost.
  - You are about to drop the column `tolerancia_minutos` on the `instituciones` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "instituciones" DROP COLUMN "hora_entrada",
DROP COLUMN "hora_salida",
DROP COLUMN "tolerancia_minutos";
