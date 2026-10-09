# Vídeo da seção Home

Arquivos usados pela seção de vídeo da home:

- `fertilizante-terravik.mp4`: o vídeo (H.264, sem áudio).
- `fertilizante-terravik-poster.jpg`: o primeiro quadro do vídeo, em 1280×720. Aparece antes de o vídeo
  carregar e é tudo o que aparece para quem pediu menos movimento ou economiza dados.

Os caminhos e a descrição em texto do vídeo ficam em `src/components/home/video-secao.ts`.

**Trocou o arquivo, troque o nome** (e atualize `video-secao.ts`). O Next guarda a imagem otimizada pelo
nome e o navegador guarda o vídeo: arquivo novo com nome antigo chega a quem já visitou como o arquivo velho.
Ao trocar o vídeo, gere o pôster de novo a partir do primeiro quadro e reescreva a descrição.

Se houver uma versão WebM, preencha o campo `webm` em `video-secao.ts`: ela passa a ser tentada antes do MP4.

Nomes sem espaço: original com espaço no nome (`.mp4` ou `.mov`) nesta pasta é ignorado pelo git.

**Nota:** se o vídeo faltar ou falhar, o pôster fica no lugar (sem área preta).
