-- CreateTable
CREATE TABLE "asistencias" (
    "id_asistencia" BIGSERIAL NOT NULL,
    "fecha_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "latitud" DOUBLE PRECISION NOT NULL,
    "longitud" DOUBLE PRECISION NOT NULL,
    "estado" TEXT NOT NULL,
    "id_usuario" BIGINT NOT NULL,
    "id_institucion" BIGINT NOT NULL,

    CONSTRAINT "asistencias_pkey" PRIMARY KEY ("id_asistencia")
);

-- AddForeignKey
ALTER TABLE "asistencias" ADD CONSTRAINT "asistencias_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asistencias" ADD CONSTRAINT "asistencias_id_institucion_fkey" FOREIGN KEY ("id_institucion") REFERENCES "instituciones"("id_institucion") ON DELETE RESTRICT ON UPDATE CASCADE;
