-- AlterTable
ALTER TABLE "geolocalizacion_config" ADD COLUMN     "bloqueo_horario" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "bloqueo_intentos" BOOLEAN NOT NULL DEFAULT true;
