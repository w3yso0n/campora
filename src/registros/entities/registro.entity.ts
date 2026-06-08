import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Foto } from './foto.entity.js';

@Entity('registros')
export class Registro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nombre: string;

  @Column({ length: 255 })
  municipio: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string | null;

  @Column({ type: 'datetime' })
  fecha: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Foto, (foto) => foto.registro, { cascade: true })
  fotos: Foto[];
}
