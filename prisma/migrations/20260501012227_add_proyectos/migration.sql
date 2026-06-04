-- CreateTable
CREATE TABLE "proyectos" (
    "id_proyecto" BIGSERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "id_institucion" BIGINT NOT NULL,

    CONSTRAINT "proyectos_pkey" PRIMARY KEY ("id_proyecto")
);

-- AddForeignKey
ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_id_institucion_fkey" FOREIGN KEY ("id_institucion") REFERENCES "instituciones"("id_institucion") ON DELETE RESTRICT ON UPDATE CASCADE;
