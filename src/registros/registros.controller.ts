import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RegistrosService } from './registros.service.js';
import { CreateRegistroDto } from './dto/create-registro.dto.js';
import { CreateFotoDto } from './dto/create-foto.dto.js';

@Controller('registros')
export class RegistrosController {
  constructor(private readonly registrosService: RegistrosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateRegistroDto) {
    return this.registrosService.create(dto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.registrosService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.registrosService.findOne(id);
  }

  @Post(':id/fotos')
  @HttpCode(HttpStatus.CREATED)
  addFoto(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateFotoDto,
  ) {
    return this.registrosService.addFoto(id, dto);
  }
}
