Plano Terravik — Calculadora/Quiz (Spec v2)
0) Objetivo do sistema

Gerar, de forma didática e sem tecnicismo, um plano com:

qual produto usar (1, 2 ou 3)

dose em g/m²

quantidade total (g/kg) para a área do usuário

embalagens recomendadas (400g / 900g / 2,7kg)

frequência (quando repetir)

alertas simples (regar, evitar calor extremo, etc.)

1) Produtos (catálogo interno do app)
P1 — GRAMADO NOVO (Implantação)

Base: MAP 11-52-00 (granulado)

Uso: plantio/implantação (antes ou junto do tapete/semente)

Dose (faixa): 8–12 g/m²

Dose padrão (default): 10 g/m²

Frequência: aplicação única (opcional “reforço leve” 30–45 dias se necessário)

Embalagens: 400g, 900g

P2 — VERDE RÁPIDO (Crescimento/verde)

Base: Sulfato de Amônio 21-0-0 + 24S (granulado)

Uso: 2–4 semanas após implantação e/ou quando precisa de vigor/cor

Dose (faixa): 15–20 g/m²

Dose padrão (default): 18 g/m²

Frequência: a cada 4–6 semanas em crescimento ativo

Embalagens: 2,7kg

P3 — RESISTÊNCIA TOTAL (Proteção/estresse) — ATUALIZADO

Base: NPK 19-4-19 (granulado)

Tecnologia: “Grânulo Único” (todos os nutrientes em cada grânulo)

Uso: calor intenso, pisoteio, uso frequente do gramado

Garantias (m/m): N 19% | P₂O₅ 4% | K₂O 19% | S (se presente) | Mg (opcional)

Dose recomendada (faixa): 15–25 g/m²

Dose padrão (default): 20 g/m²

Frequência: a cada 6–8 semanas em crescimento ativo

Embalagens: 400g, 900g

2) Perguntas do Quiz (inputs)
2.1 Dados básicos

Área do gramado (m²)

tipo: number

validação: > 0

ajuda: “Se não souber, use largura x comprimento.”

Você está implantando gramado novo agora?

tipo: radio: sim / não

se sim: habilita P1 automaticamente

Objetivo principal hoje (escolha 1)

radio:

Implantar / pegar mais rápido

Verde e crescimento (recuperar vigor)

Resistência ao calor/pisoteio

Plano completo (quero o melhor resultado)

2.2 Condições (para ajustar dose dentro da faixa)

Como está o clima no seu gramado HOJE? (melhor que “estação”, funciona no Brasil todo)

radio:

Quente e chovendo

Quente e seco

Ameno

Frio (crescimento lento/dormência)

Sol no gramado

radio: sol pleno / meia-sombra / sombra

Irrigação

radio:

Irrigo 3+ vezes por semana

Irrigo 1–2 vezes por semana

Quase não irrigo / depende de chuva

Uso/pisoteio

radio: baixo / médio / alto (criança/pet/churrasco/área de passagem)

Nível do gramado (autoavaliação)

radio:

Está bonito (manutenção)

Está fraco/amarelado

Tem falhas e está ralo

Observação: você pode perguntar UF/Estado apenas para mensagem/roteiro (“aqui costuma ser quente…”), mas o cálculo principal deve usar o “clima hoje” acima (evita erros de sazonalidade por região).

3) Motor de decisão (quais produtos entram)
Regras simples

Se implantando == sim → incluir P1 (Gramado Novo).

Se objetivo = “Verde e crescimento” → incluir P2.

Se objetivo = “Resistência ao calor/pisoteio” → incluir P3.

Se objetivo = “Plano completo”:

Se implantando: P1 + P2 (e P3 somente se pisoteio alto ou quente e seco)

Se não implantando: P2 + P3

Regras de segurança / evitar confusão

P1 é “uma vez” (starter). Não sugerir toda hora.

P3 tem N e P (19-4-19), então:

se usuário está em fase de implantação nos primeiros 15–20 dias, priorizar P1 e P2 e deixar P3 para “próximo ciclo” (6–8 semanas) se quiser simplificar o plano.

se ele insistir em “pisoteio alto e quente e seco”, permitir P3 com dose baixa (15 g/m²) e rega obrigatória.

4) Cálculo de dose (g/m²) — ajustes dentro da faixa
4.1 P1 (MAP 8–12; padrão 10)

Começar em dose = 10 e ajustar:

Se solo/falhas == "tem falhas e está ralo" → +1

Se clima hoje == "quente e chovendo" → +1 (perdas por chuva)

Se irrigação == "quase não irrigo" → -1 (evitar excesso sem ativação)

Se frio → -1

Clamp final: dose = min(12, max(8, dose))

4.2 P2 (SA 15–20; padrão 18)

Começar em dose = 18 e ajustar:

Se amarelado/fraco → +2

Se quente e chovendo → +1

Se quente e seco e não irriga → -2 (reduzir risco)

Se meia-sombra/sombra → -1

Se frio → -2

Clamp: min(20, max(15, dose))

4.3 P3 (NPK 19-4-19 15–25; padrão 20) — atualizado

Começar em dose = 20 e ajustar:

Se pisoteio alto → +3

Se quente e seco → +2 (desde que irrigue)

Se irrigação quase não irriga → -3

Se sombra → -3

Se frio → -5 (ou “pausar”)

Clamp: min(25, max(15, dose))

Regra simples para UI:
“Se estiver frio e a grama não estiver crescendo, reduza ou pause.”

5) Quantidade total por aplicação

Para cada produto:

quantidade_g = area_m2 * dose_g_m2

quantidade_kg = quantidade_g / 1000

Arredondamentos:

Exibir dose em g/m² inteiro

Exibir total em g (se < 1000g) senão em kg com 2 casas.

6) Recomendação de embalagens (400g / 900g / 2,7kg)
Tamanhos por produto

P1: [400, 900]

P2: [2700] (se precisar mais, multiplica unidades)

P3: [400, 900]

Algoritmo (recomendação padrão “menor sobra”)

Dado need_g e lista packs[], escolher combinação com:

total_g >= need_g

menor sobra = total_g - need_g

em empate, menor número de embalagens

Pseudo:

combos = todas combinações viáveis (1..N unidades) até (need_g + maior_pack*2)
escolher combo com menor sobra; se empate, menor contagem


Atalho prático (suficiente na prática):

Se tem 900 e 400:

se need_g <= 400 → 1x 400

se 400 < need_g <= 900 → 1x 900

se 900 < need_g <= 1300 → 1x 900 + 1x 400

se > 1300 → 2x 900 (e assim por diante)

Para P2 (2,7kg):

units = ceil(need_g / 2700)

7) Frequência e calendário (saída)

Definir data_inicio (user escolhe “aplicar hoje” ou seleciona data).

P1: uma vez (opcional reforço 30–45 dias)

P2: repetir em + (4 a 6 semanas)

P3: repetir em + (6 a 8 semanas)

UI simples: “Próxima aplicação sugerida: //____”.

8) Mensagens prontas (UX) — curtas e claras
Regras universais

“Aplique com o gramado seco e regue depois.”

“Evite aplicar no sol forte do meio-dia.”

“Se chover forte logo após, considere reaplicar leve (consulte o plano).”

Alertas específicos

P2 (Sulfato de amônio): “Se o gramado estiver sem irrigação e muito seco, use dose menor.”

P3 (NPK 19-4-19): “Para resistência de verdade, a constância vale mais do que exagerar na dose.”

9) Saída padrão (JSON) para o Next.js renderizar
{
  "area_m2": 60,
  "context": {
    "implantando": false,
    "objetivo": "resistencia",
    "clima_hoje": "quente_e_seco",
    "sol": "sol_pleno",
    "irrigacao": "3x_semana",
    "pisoteio": "alto",
    "nivel": "fraco_amarelado"
  },
  "plan": [
    {
      "product_id": "P3",
      "name": "Resistência Total",
      "dose_g_m2": 25,
      "need_g": 1500,
      "packs": [
        { "size_g": 900, "qty": 2 }
      ],
      "frequency_days": 49,
      "notes": [
        "Aplique e regue após.",
        "Evite aplicar sem irrigação em semana de seca."
      ]
    }
  ],
  "summary": {
    "next_steps": [
      "Aplicar hoje",
      "Reaplicar em 6–8 semanas"
    ]
  }
}

10) Defaults (para reduzir fricção)

Se usuário não sabe algo:

clima hoje: default ameno

sol: default sol pleno

irrigação: default 1–2 vezes por semana

pisoteio: default médio

nível: default manutenção

11) Checklist de implementação (para IA/dev)

 Form wizard com lógica condicional

 Motor de dose (clamp por produto)

 Motor de packs (menor sobra)

 Export do plano (JSON + cards)

 Página de resultado: “Hoje / Próxima aplicação / Quantidade / Comprar”

 Guardar estado no localStorage + gerar link compartilhável