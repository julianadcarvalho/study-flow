import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  async sugerirTopicos(descricao: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({
      model: 'models/gemini-2.0-flash',
    });

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Sugira tópicos estudo com base neste plano: "${descricao}" estruturado assim: 1: Titulo, 2: tipo: video 3: link de estudo, artigo ou livro. Exemplo: 1: Introdução ao JavaScript, 2: https://www.youtube.com/watch?v=abc123, 3: video. Não traga nada além disso.`,
            },
          ],
        },
      ],
    });

    const response = await result.response;
    return response.text();
  }
}
