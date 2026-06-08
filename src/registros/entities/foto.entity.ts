import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Registro } from './registro.entity.js';

@Entity('fotos')
export class Foto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  registroId: number;

  @Column({ length: 255 })
  nombreArchivo: string;

  @Column({ length: 500 })
  rutaArchivo: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Registro, (registro) => registro.fotos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'registroId' })
  registro: Registro;
}
