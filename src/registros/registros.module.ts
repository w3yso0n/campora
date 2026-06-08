import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Registro } from './entities/registro.entity.js';
import { Foto } from './entities/foto.entity.js';
import { RegistrosController } from './registros.controller.js';
import { RegistrosService } from './registros.service.js';
import { StorageService } from './storage/storage.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Registro, Foto])],
  controllers: [RegistrosController],
  providers: [RegistrosService, StorageService],
})
export class RegistrosModule {}
