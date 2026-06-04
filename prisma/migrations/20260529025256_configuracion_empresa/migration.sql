-- AlterTable
ALTER TABLE "asistencias" ADD COLUMN     "minutos_retraso" INTEGER;

-- CreateTable
CREATE TABLE "configuracion_empresa" (
    "id_configuracion" BIGSERIAL NOT NULL,
    "hora_entrada" TEXT NOT NULL,
    "hora_salida" TEXT NOT NULL,
    "tolerancia_minutos" INTEGER NOT NULL DEFAULT 10,
    "max_usuarios" INTEGER NOT NULL DEFAULT 10,
    "codigo_empresa" TEXT,
    "id_institucion" BIGINT NOT NULL,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracion_empresa_pkey" PRIMARY KEY ("id_configuracion")
);

-- CreateIndex
CREATE UNIQUE INDEX "configuracion_empresa_id_institucion_key" ON "configuracion_empresa"("id_institucion");

-- AddForeignKey
ALTER TABLE "configuracion_empresa" ADD CONSTRAINT "configuracion_empresa_id_institucion_fkey" FOREIGN KEY ("id_institucion") REFERENCES "instituciones"("id_institucion") ON DELETE RESTRICT ON UPDATE CASCADE;
