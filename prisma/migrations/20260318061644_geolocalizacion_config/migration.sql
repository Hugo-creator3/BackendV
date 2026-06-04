-- CreateTable
CREATE TABLE "geolocalizacion_config" (
    "id_config" BIGSERIAL NOT NULL,
    "latitud" DOUBLE PRECISION NOT NULL,
    "longitud" DOUBLE PRECISION NOT NULL,
    "radio_metros" INTEGER NOT NULL DEFAULT 100,
    "id_institucion" BIGINT NOT NULL,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "geolocalizacion_config_pkey" PRIMARY KEY ("id_config")
);

-- CreateIndex
CREATE UNIQUE INDEX "geolocalizacion_config_id_institucion_key" ON "geolocalizacion_config"("id_institucion");

-- AddForeignKey
ALTER TABLE "geolocalizacion_config" ADD CONSTRAINT "geolocalizacion_config_id_institucion_fkey" FOREIGN KEY ("id_institucion") REFERENCES "instituciones"("id_institucion") ON DELETE RESTRICT ON UPDATE CASCADE;
