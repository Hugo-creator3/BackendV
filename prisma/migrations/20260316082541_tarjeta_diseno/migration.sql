-- CreateTable
CREATE TABLE "instituciones" (
    "id_institucion" BIGSERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "razon_social" TEXT,
    "rfc" TEXT,
    "clave_segura" TEXT NOT NULL,
    "tipo_institucion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "instituciones_pkey" PRIMARY KEY ("id_institucion")
);

-- CreateTable
CREATE TABLE "admins" (
    "id_admin" BIGSERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "cargo" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "id_institucion" BIGINT NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id_admin")
);

-- CreateTable
CREATE TABLE "tarjeta_diseno" (
    "id_diseno" BIGSERIAL NOT NULL,
    "nombre_institucion" TEXT NOT NULL,
    "logo_url" TEXT,
    "color_primario" TEXT,
    "color_secundario" TEXT,
    "color_terciario" TEXT,
    "color_cuarto" TEXT,
    "id_institucion" BIGINT NOT NULL,

    CONSTRAINT "tarjeta_diseno_pkey" PRIMARY KEY ("id_diseno")
);

-- CreateIndex
CREATE UNIQUE INDEX "instituciones_clave_segura_key" ON "instituciones"("clave_segura");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tarjeta_diseno_id_institucion_key" ON "tarjeta_diseno"("id_institucion");

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_id_institucion_fkey" FOREIGN KEY ("id_institucion") REFERENCES "instituciones"("id_institucion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarjeta_diseno" ADD CONSTRAINT "tarjeta_diseno_id_institucion_fkey" FOREIGN KEY ("id_institucion") REFERENCES "instituciones"("id_institucion") ON DELETE RESTRICT ON UPDATE CASCADE;
