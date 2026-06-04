-- AlterTable
ALTER TABLE "instituciones" ADD COLUMN     "hora_entrada" TEXT,
ADD COLUMN     "hora_salida" TEXT,
ADD COLUMN     "tolerancia_minutos" INTEGER NOT NULL DEFAULT 0;
