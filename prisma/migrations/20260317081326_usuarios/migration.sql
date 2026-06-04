-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" BIGSERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "telefono" TEXT,
    "genero" TEXT,
    "fecha_nacimiento" TIMESTAMP(3),
    "foto_url" TEXT,
    "id_institucion" BIGINT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_institucion_fkey" FOREIGN KEY ("id_institucion") REFERENCES "instituciones"("id_institucion") ON DELETE RESTRICT ON UPDATE CASCADE;
