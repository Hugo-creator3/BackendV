/*
  Warnings:

  - You are about to drop the `proyectos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "proyectos" DROP CONSTRAINT "proyectos_id_institucion_fkey";

-- DropTable
DROP TABLE "proyectos";

-- CreateTable
CREATE TABLE "codigos_verificacion" (
    "id" BIGSERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "expira_en" TIMESTAMP(3) NOT NULL,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "codigos_verificacion_pkey" PRIMARY KEY ("id")
);
