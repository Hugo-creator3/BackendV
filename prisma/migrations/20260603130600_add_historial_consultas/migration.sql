CREATE TABLE "historial_consultas" (
    "id_historial" BIGSERIAL NOT NULL,
    "id_institucion" BIGINT NOT NULL,
    "id_admin" BIGINT,
    "pregunta" TEXT NOT NULL,
    "consulta_sql" TEXT,
    "respuesta" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'OK',
    "error" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_consultas_pkey" PRIMARY KEY ("id_historial")
);

CREATE INDEX "historial_consultas_id_institucion_idx" ON "historial_consultas"("id_institucion");

ALTER TABLE "historial_consultas"
ADD CONSTRAINT "historial_consultas_id_institucion_fkey"
FOREIGN KEY ("id_institucion") REFERENCES "instituciones"("id_institucion")
ON DELETE CASCADE ON UPDATE CASCADE;
