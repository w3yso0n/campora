import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Registro } from './entities/registro.entity.js';
import { Foto } from './entities/foto.entity.js';
import { CreateRegistroDto } from './dto/create-registro.dto.js';
import { CreateFotoDto } from './dto/create-foto.dto.js';
import { StorageService } from './storage/storage.service.js';

@Injectable()
export class RegistrosService {
  constructor(
    @InjectRepository(Registro)
    private readonly registroRepo: Repository<Registro>,

    @InjectRepository(Foto)
    private readonly fotoRepo: Repository<Foto>,

    private readonly storage: StorageService,
  ) {}

  async create(dto: CreateRegistroDto): Promise<Registro> {
    const registro = this.registroRepo.create({
      nombre: dto.nombre,
      municipio: dto.municipio,
      observaciones: dto.observaciones ?? null,
      fecha: new Date(dto.fecha),
    });
    return this.registroRepo.save(registro);
  }

  async findAll(
    page = 1,
    limit = 20,
  ): Promise<{ data: Registro[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.registroRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Registro & { fotos: (Foto & { url: string })[] }> {
    const registro = await this.registroRepo.findOne({
      where: { id },
      relations: { fotos: true },
    });

    if (!registro) {
      throw new NotFoundException(`Registro ${id} no encontrado`);
    }

    const fotosConUrl = registro.fotos.map((foto) => ({
      ...foto,
      url: this.storage.getPublicUrl(`registros/${foto.registroId}/${foto.nombreArchivo}`),
    }));

    return { ...registro, fotos: fotosConUrl };
  }

  private fotoConUrl(foto: Foto): Foto & { url: string } {
    return {
      ...foto,
      url: this.storage.getPublicUrl(`registros/${foto.registroId}/${foto.nombreArchivo}`),
    };
  }

  async findFotos(registroId: number): Promise<(Foto & { url: string })[]> {
    const registro = await this.registroRepo.findOne({ where: { id: registroId } });
    if (!registro) {
      throw new NotFoundException(`Registro ${registroId} no encontrado`);
    }

    const fotos = await this.fotoRepo.find({
      where: { registroId },
      order: { createdAt: 'ASC' },
    });

    return fotos.map((f) => this.fotoConUrl(f));
  }

  async findFoto(registroId: number, fotoId: number): Promise<Foto & { url: string }> {
    const foto = await this.fotoRepo.findOne({ where: { id: fotoId, registroId } });
    if (!foto) {
      throw new NotFoundException(`Foto ${fotoId} no encontrada en el registro ${registroId}`);
    }
    return this.fotoConUrl(foto);
  }

  async addFoto(registroId: number, dto: CreateFotoDto): Promise<Foto> {
    const registro = await this.registroRepo.findOne({ where: { id: registroId } });
    if (!registro) {
      throw new NotFoundException(`Registro ${registroId} no encontrado`);
    }

    const buffer = Buffer.from(dto.base64, 'base64');
    const relativePath = `registros/${registroId}/${dto.nombre}`;
    await this.storage.saveFile(relativePath, buffer);

    const foto = this.fotoRepo.create({
      registroId,
      nombreArchivo: dto.nombre,
      rutaArchivo: relativePath,
    });

    return this.fotoRepo.save(foto);
  }
}
