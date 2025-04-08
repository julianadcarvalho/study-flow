import { Controller, Post, Body } from '@nestjs/common';
import { GeminiService } from './gemini.service';

@Controller('ia')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('sugerir')
  async sugerir(@Body('descricao') descricao: string) {
    return { sugestao: await this.geminiService.sugerirTopicos(descricao) };
  }
}
