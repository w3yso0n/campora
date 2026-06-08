import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Abstracción para persistencia de archivos.
 * Para migrar a S3/GCS, reemplaza la implementación de este servicio
 * sin tocar RegistrosService.
 */
@Injectable()
export class StorageService {
  private readonly uploadsRoot: string;

  constructor(private readonly config: ConfigService) {
    this.uploadsRoot = path.resolve(process.cwd(), 'uploads');
  }

  /**
   * Guarda un buffer en disco y devuelve la ruta relativa (desde uploadsRoot).
   * Crea los directorios intermedios si no existen.
   */
  async saveFile(relativePath: string, data: Buffer): Promise<string> {
    const absolutePath = path.join(this.uploadsRoot, relativePath);
    const dir = path.dirname(absolutePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(absolutePath, data);
    return relativePath;
  }

  /**
   * Construye la URL pública de acceso al archivo.
   */
  getPublicUrl(relativePath: string): string {
    const host = this.config.get<string>('APP_HOST', 'http://localhost:3000');
    const normalized = relativePath.replace(/\\/g, '/');
    return `${host}/uploads/${normalized}`;
  }
}
