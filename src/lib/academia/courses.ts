// src/lib/academia/courses.ts

// Legacy types for static courses data (to be removed when fully migrated to Supabase)
export interface LegacyCourse {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: { primary: string; light: string; gradient: string };
  difficulty: 'iniciante' | 'intermediario' | 'avancado';
  estimatedTime: number;
  featured?: boolean;
  badge: { name: string; icon: string; description: string };
  prerequisites?: string[];
  lessons: LegacyLesson[];
}
export interface LegacyLesson {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: number;
  type: string;
  xpReward: number;
  order: number;
  content: any;
}

export const COURSES: LegacyCourse[] = [
  {
    id: 'fundamentos-gramado',
    slug: 'fundamentos-do-gramado',
    title: 'Fundamentos do Gramado',
    subtitle: 'Tudo para começar',
    description: 'Conceitos básicos: tipos de grama, solo, luz e água.',
    icon: '🌱',
    color: {
      primary: '#22C55E',
      light: '#DCFCE7',
      gradient: 'from-green-500 to-emerald-600',
    },
    difficulty: 'iniciante',
    estimatedTime: 45,
    featured: true,
    badge: { name: 'Conhecedor de Gramados', icon: '🌿', description: 'Dominou os fundamentos' },
    lessons: [
      {
        id: 'fund-1',
        slug: 'tipos-de-grama',
        title: 'Tipos de Grama no Brasil',
        description: 'Conheça as principais espécies',
        duration: 8,
        type: 'texto',
        xpReward: 50,
        order: 1,
        content: {
          sections: [
            {
              type: 'text',
              content: `# Conhecendo as Gramas Brasileiras

Escolher a grama certa é o primeiro passo para ter um jardim dos sonhos! Cada tipo tem características únicas que se adaptam melhor a diferentes condições.

## 🌿 Grama Esmeralda

A **queridinha dos brasileiros**! Possui folhas finas, cor verde intensa e forma um tapete denso e uniforme.

**Características:**
- Alta resistência ao pisoteio
- Baixa manutenção (cresce devagar)
- Ótima para sol pleno
- Tolera períodos curtos de seca
- Recuperação rápida de danos

**Ideal para:** Jardins residenciais, áreas recreativas, campos de futebol amador.

## 🌾 Grama São Carlos

Possui folhas largas e é a campeã da **meia-sombra**!

**Características:**
- Tolera bem áreas sombreadas
- Folhas mais largas e macias
- Crescimento moderado
- Boa resistência ao pisoteio
- Menos exigente em água

**Ideal para:** Jardins com árvores, áreas parcialmente sombreadas.

## ⚽ Grama Bermuda

A **profissional dos campos esportivos**!

**Características:**
- Recuperação ultra-rápida
- Altíssima resistência ao pisoteio
- Cresce muito rápido (requer cortes frequentes)
- Necessita muito sol
- Raízes profundas

**Ideal para:** Campos esportivos, áreas de alto tráfego, playgrounds.

## 🌳 Grama Santo Agostinho

A **campeã absoluta da sombra**!

**Características:**
- Tolera sombra intensa
- Folhas largas e verde-escuras
- Crescimento vigoroso
- Boa resistência ao pisoteio
- Forma tapete denso

**Ideal para:** Jardins com muitas árvores, áreas com pouca luz solar.

---

## 💡 Como Escolher?

1. **Sol pleno (6h+ de sol):** Esmeralda ou Bermuda
2. **Meia-sombra (3-6h de sol):** São Carlos ou Esmeralda
3. **Sombra intensa (<3h de sol):** Santo Agostinho
4. **Alto tráfego:** Bermuda ou Esmeralda
5. **Baixa manutenção:** Esmeralda ou São Carlos`
            },
            {
              type: 'callout',
              content: {
                type: 'tip',
                title: 'Dica Terravik',
                text: 'Se seu jardim tem áreas de sombra E áreas de sol, considere usar mais de um tipo de grama! Isso garante beleza em todo o espaço.',
              },
            },
          ],
          quiz: {
            id: 'quiz-fund-1',
            passingScore: 60,
            questions: [
              {
                id: 'q1',
                type: 'multiple-choice',
                question: 'Qual grama é mais indicada para áreas com sombra intensa?',
                options: [
                  { id: 'a', text: 'Esmeralda' },
                  { id: 'b', text: 'Santo Agostinho' },
                  { id: 'c', text: 'Bermuda' },
                  { id: 'd', text: 'São Carlos' },
                ],
                correctAnswer: 'b',
                explanation: 'A Santo Agostinho é a mais tolerante à sombra intensa, sendo ideal para jardins com muitas árvores.',
              },
              {
                id: 'q2',
                type: 'true-false',
                question: 'A Esmeralda é a grama mais usada em jardins residenciais no Brasil.',
                options: [
                  { id: 'true', text: 'Verdadeiro' },
                  { id: 'false', text: 'Falso' },
                ],
                correctAnswer: 'true',
                explanation: 'Correto! A Esmeralda é a mais popular no Brasil por sua beleza, baixa manutenção e boa resistência.',
              },
              {
                id: 'q3',
                type: 'multiple-choice',
                question: 'Qual grama tem recuperação mais rápida e é ideal para campos esportivos?',
                options: [
                  { id: 'a', text: 'Esmeralda' },
                  { id: 'b', text: 'São Carlos' },
                  { id: 'c', text: 'Bermuda' },
                  { id: 'd', text: 'Santo Agostinho' },
                ],
                correctAnswer: 'c',
                explanation: 'A Bermuda tem recuperação ultra-rápida e altíssima resistência, sendo a escolha profissional para campos esportivos.',
              },
            ],
          },
          practicalTips: [
            {
              icon: '📸',
              title: 'Fotografe seu jardim',
              description: 'Tire fotos em diferentes horários (manhã, tarde, noite) para ver quanto sol cada área recebe ao longo do dia.',
            },
            {
              icon: '📏',
              title: 'Meça sua área',
              description: 'Calcule os metros quadrados para estimar quantidade de tapetes e custos.',
            },
          ],
        },
      },
      {
        id: 'fund-2',
        slug: 'entendendo-o-solo',
        title: 'Entendendo o Solo',
        description: 'A fundação de um gramado saudável',
        duration: 10,
        type: 'texto',
        xpReward: 50,
        order: 2,
        content: {
          sections: [
            {
              type: 'text',
              content: `# A Importância do Solo

Um gramado bonito começa **debaixo da terra**! O solo é a fundação que sustenta, nutre e hidrata suas gramas.

## Os 3 Tipos de Solo

### 🏖️ Solo Arenoso

**Características:**
- Drena água MUITO rápido
- Pobre em nutrientes
- Não compacta
- Esquenta rapidamente

**Desafios:**
- Água escorre antes das raízes absorverem
- Precisa de adubação frequente
- Seca rápido

**Solução:** Adicione matéria orgânica (composto) para melhorar retenção de água e nutrientes.

### 🧱 Solo Argiloso

**Características:**
- Retém MUITA água
- Rico em nutrientes
- Compacta facilmente
- Esquenta devagar

**Desafios:**
- Pode encharcar e sufocar raízes
- Compactação dificulta crescimento
- Demora para secar

**Solução:** Adicione areia e matéria orgânica para melhorar drenagem e aeração.

### 🌟 Solo Franco (IDEAL)

**Características:**
- Equilíbrio perfeito entre areia, argila e silte
- Boa drenagem + boa retenção
- Rico em nutrientes
- Fácil de trabalhar

**Por que é ideal:**
- Drena bem, mas retém umidade suficiente
- Raízes penetram facilmente
- Mantém nutrientes disponíveis

---

## 🧪 Teste Simples de Solo

Você pode identificar seu tipo de solo em casa:

**Teste da Bola:**
1. Pegue um punhado de solo úmido
2. Aperte na mão formando uma bola
3. Observe o resultado:

- **Não forma bola, desmancha:** Solo arenoso
- **Forma bola firme que não quebra:** Solo argiloso
- **Forma bola que quebra com pressão leve:** Solo franco

## 📊 pH do Solo

O pH ideal para gramados é entre **6.0 e 7.0** (levemente ácido a neutro).

**pH muito baixo (<5.5):** Solo ácido
- Dificulta absorção de nutrientes
- Solução: Adicionar calcário

**pH muito alto (>7.5):** Solo alcalino
- Ferro e outros nutrientes ficam indisponíveis
- Solução: Adicionar enxofre

---

## 🔧 Preparação do Solo (Antes de Plantar)

1. **Limpe a área:** Remova entulho, pedras, mato
2. **Nivele o terreno:** Evite depressões que acumulam água
3. **Adicione matéria orgânica:** 5-10cm de composto ou húmus
4. **Adicione areia (se solo argiloso):** 3-5cm
5. **Misture bem:** Use enxada rotativa ou revire manualmente
6. **Compacte levemente:** Use rolo ou pise uniformemente
7. **Regue 2-3 dias antes:** Solo deve estar úmido no plantio`
            },
            {
              type: 'callout',
              content: {
                type: 'warning',
                title: 'Atenção',
                text: 'NUNCA plante grama em solo compactado! As raízes não conseguem penetrar e o gramado não se desenvolve.',
              },
            },
          ],
          quiz: {
            id: 'quiz-fund-2',
            passingScore: 60,
            questions: [
              {
                id: 'q1',
                type: 'multiple-choice',
                question: 'Qual tipo de solo é considerado ideal para gramados?',
                options: [
                  { id: 'a', text: 'Arenoso' },
                  { id: 'b', text: 'Argiloso' },
                  { id: 'c', text: 'Franco' },
                  { id: 'd', text: 'Pedregoso' },
                ],
                correctAnswer: 'c',
                explanation: 'O solo franco combina boa drenagem com retenção adequada de água e nutrientes, sendo o equilíbrio perfeito.',
              },
              {
                id: 'q2',
                type: 'multiple-choice',
                question: 'Qual o principal problema do solo arenoso?',
                options: [
                  { id: 'a', text: 'Retém muita água' },
                  { id: 'b', text: 'Drena água muito rápido' },
                  { id: 'c', text: 'Compacta facilmente' },
                  { id: 'd', text: 'Muito rico em nutrientes' },
                ],
                correctAnswer: 'b',
                explanation: 'O solo arenoso drena água muito rapidamente, fazendo com que as raízes não tenham tempo suficiente para absorver.',
              },
              {
                id: 'q3',
                type: 'multiple-choice',
                question: 'Qual a faixa de pH ideal para gramados?',
                options: [
                  { id: 'a', text: '4.0 a 5.0' },
                  { id: 'b', text: '6.0 a 7.0' },
                  { id: 'c', text: '8.0 a 9.0' },
                  { id: 'd', text: '10.0 a 11.0' },
                ],
                correctAnswer: 'b',
                explanation: 'O pH ideal é entre 6.0 e 7.0 (levemente ácido a neutro), onde os nutrientes ficam mais disponíveis para as plantas.',
              },
            ],
          },
          practicalTips: [
            {
              icon: '🧤',
              title: 'Faça o teste da bola',
              description: 'É grátis e te dá informações valiosas sobre seu solo em 30 segundos!',
            },
          ],
        },
      },
      {
        id: 'fund-3',
        slug: 'agua-e-rega',
        title: 'Água e Rega Correta',
        description: 'O segredo da rega perfeita',
        duration: 8,
        type: 'texto',
        xpReward: 50,
        order: 3,
        content: {
          sections: [
            {
              type: 'text',
              content: `# A Arte da Rega Perfeita

Regar parece simples, mas é uma das **tarefas mais importantes** e onde mais erros acontecem!

## 🌊 A Regra de Ouro

> **Regue profundamente, mas com MENOS frequência.**

Por quê? Isso estimula as raízes a crescerem mais profundas em busca de água, criando um gramado mais resistente à seca.

---

## 💧 Quanto Regar?

**Regra geral:** ~25mm de água por semana (incluindo chuva)

**Como medir:**
- Coloque latinhas vazias pelo gramado
- Regue normalmente
- Quando acumular 2,5cm de água, está bom!

**Frequência:**
- **Verão:** 2-3x por semana
- **Inverno:** 1x por semana (ou menos, se chover)
- **Primavera/Outono:** 2x por semana

---

## ⏰ Melhor Horário

### 🌅 IDEAL: Manhã Cedo (5h-9h)

**Vantagens:**
- Água penetra antes do calor evaporar
- Folhas secam durante o dia
- Menos perda por evaporação
- Previne doenças fúngicas

### 🌤️ ACEITÁVEL: Final da tarde (16h-18h)

**Cuidados:**
- Garanta que folhas sequem antes do anoitecer
- Evite se umidade está alta

### 🌙 EVITE: Noite (após 20h)

**Por quê:**
- Folhas ficam úmidas a noite toda
- Ambiente perfeito para fungos
- Doenças se espalham rapidamente

---

## 🚨 Sinais de Falta de Água

1. **Cor azulada/acinzentada** (ao invés de verde)
2. **Folhas enroladas** (tentam reduzir evaporação)
3. **Pegadas ficam marcadas** (grama não volta ao normal)
4. **Solo seco** a 5cm de profundidade

---

## 💦 Sinais de Excesso de Água

1. **Solo sempre encharcado**
2. **Grama amarelada** (raízes sufocadas)
3. **Fungos e musgo** aparecem
4. **Grama "mole"** ao pisar
5. **Odor desagradável** do solo

---

## 🎯 Dicas Práticas

### Gramado Novo (Primeiros 30 dias)
- Regue TODO DIA (leve)
- Solo deve estar sempre úmido
- Não deixe encharcar

### Gramado Estabelecido
- Regue profundamente 2-3x/semana
- Espere solo secar entre regas
- Estimula raízes profundas

### Sistema de Irrigação
- Programe para 5h-7h da manhã
- Ajuste conforme chuva
- Verifique se todas áreas recebem água
- Manutenção semestral (limpeza de bicos)

### Rega Manual
- Use esguicho com jato tipo "chuveiro"
- Evite jato forte (compacta solo)
- Regue até água começar a empoçar, depois pare
- Retome após água infiltrar

---

## 🌍 Economize Água

1. **Regue nas horas certas** (menos evaporação)
2. **Ajuste altura da grama** (mais alta retém mais umidade)
3. **Adicione matéria orgânica** (solo retém mais água)
4. **Cubra solo exposto** (reduz evaporação)
5. **Conserte vazamentos** no sistema de irrigação`
            },
            {
              type: 'callout',
              content: {
                type: 'warning',
                title: '⚠️ NUNCA Regue à Noite!',
                text: 'Regar à noite é o erro #1 que favorece doenças fúngicas. A umidade prolongada cria ambiente perfeito para fungos.',
              },
            },
          ],
          quiz: {
            id: 'quiz-fund-3',
            passingScore: 60,
            questions: [
              {
                id: 'q1',
                type: 'multiple-choice',
                question: 'Qual o MELHOR horário para regar o gramado?',
                options: [
                  { id: 'a', text: 'Meio-dia (12h-14h)' },
                  { id: 'b', text: 'Manhã cedo (5h-9h)' },
                  { id: 'c', text: 'Noite (21h-23h)' },
                  { id: 'd', text: 'Tarde (14h-16h)' },
                ],
                correctAnswer: 'b',
                explanation: 'Manhã cedo é ideal! A água penetra antes do calor, folhas secam durante o dia e há menos evaporação.',
              },
              {
                id: 'q2',
                type: 'true-false',
                question: 'É melhor regar profundamente 2-3 vezes por semana do que regar pouco todos os dias.',
                options: [
                  { id: 'true', text: 'Verdadeiro' },
                  { id: 'false', text: 'Falso' },
                ],
                correctAnswer: 'true',
                explanation: 'Verdadeiro! Regar profundamente estimula raízes mais profundas, criando um gramado mais resistente à seca.',
              },
              {
                id: 'q3',
                type: 'multiple-choice',
                question: 'Por que NÃO devemos regar à noite?',
                options: [
                  { id: 'a', text: 'Gasta mais água' },
                  { id: 'b', text: 'As folhas ficam úmidas por muito tempo, favorecendo fungos' },
                  { id: 'c', text: 'A grama não absorve água à noite' },
                  { id: 'd', text: 'Atrai mosquitos' },
                ],
                correctAnswer: 'b',
                explanation: 'À noite as folhas ficam úmidas por horas, criando ambiente perfeito para fungos e doenças se desenvolverem.',
              },
            ],
          },
          practicalTips: [
            {
              icon: '🥫',
              title: 'Teste das latinhas',
              description: 'Espalhe latinhas vazias e regue. Meça quanto água acumulou para calibrar seu sistema.',
              timing: 'Fazer 1x ao configurar irrigação',
            },
            {
              icon: '⏰',
              title: 'Configure alarme',
              description: 'Se for regar manualmente, coloque alarme para 6h da manhã nos dias de rega.',
              timing: 'Configurar agora',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'adubacao-nutricao',
    slug: 'adubacao-e-nutricao',
    title: 'Adubação e Nutrição',
    subtitle: 'Alimente seu gramado',
    description: 'Domine NPK, timing e identificação de deficiências nutricionais.',
    icon: '🧪',
    color: {
      primary: '#B68D40',
      light: '#FBF7EE',
      gradient: 'from-amber-500 to-yellow-600',
    },
    difficulty: 'intermediario',
    estimatedTime: 60,
    prerequisites: ['fundamentos-gramado'],
    featured: true,
    badge: { name: 'Nutricionista de Gramados', icon: '⚗️', description: 'Expert em adubação' },
    lessons: [
      {
        id: 'adub-1',
        slug: 'entendendo-npk',
        title: 'Entendendo NPK',
        description: 'Os macronutrientes essenciais',
        duration: 12,
        type: 'texto',
        xpReward: 60,
        order: 1,
        content: {
          sections: [
            {
              type: 'text',
              content: `# NPK: A Tríade da Nutrição

Você já viu aqueles números nos pacotes de adubo? **10-10-10**, **20-05-20**, **11-52-00**? Esses são os valores de NPK!

## O Que é NPK?

**N - P - K** são as iniciais dos três macronutrientes essenciais:

---

## 🟢 N - Nitrogênio (Crescimento Verde)

**O que faz:**
- Responsável pela COR VERDE intensa
- Estimula crescimento de folhas e caules
- Aumenta a densidade do gramado
- Acelera recuperação após cortes

**Sinais de falta:**
- Gramado amarelado
- Crescimento lento
- Folhas pálidas

**Sinais de excesso:**
- Verde MUITO escuro
- Crescimento excessivo (muito trabalho para cortar!)
- Mais suscetível a doenças
- Queima de folhas

**Quando usar mais N:**
- Primavera (fase de crescimento)
- Verão (manutenção)
- Após reforma ou plantio

---

## 🟤 P - Fósforo (Raízes Fortes)

**O que faz:**
- Promove desenvolvimento de RAÍZES profundas
- Ajuda no estabelecimento inicial
- Aumenta resistência a doenças
- Melhora absorção de outros nutrientes

**Sinais de falta:**
- Crescimento lento mesmo com N adequado
- Raízes fracas e superficiais
- Folhas roxeadas/avermelhadas

**Quando usar mais P:**
- **PLANTIO NOVO** (essencial!)
- Recuperação de gramados danificados
- Outono (fortalece para inverno)

---

## 🔵 K - Potássio (Resistência)

**O que faz:**
- Aumenta resistência a DOENÇAS
- Melhora tolerância à SECA
- Aumenta resistência ao FRIO
- Fortalece estrutura celular
- Melhora eficiência no uso de água

**Sinais de falta:**
- Pontas e bordas das folhas amareladas/marrons
- Maior suscetibilidade a doenças
- Murcha fácil em dias quentes

**Quando usar mais K:**
- Final do verão (preparar para outono)
- Outono (fortalecer para inverno)
- Períodos de estresse hídrico

---

## 🎯 Produtos Terravik Explicados

### Gramado Novo (11-52-00)
- **Alto P** para enraizamento
- Ideal para plantio e reforma
- **Quando usar:** Nas primeiras 4-6 semanas após plantar

### Nutrição Completa (20-05-20)
- **Alto N** para cor verde
- **Alto K** para resistência
- **Quando usar:** Manutenção mensal em gramados estabelecidos

### Verde Rápido (30-00-10)
- **Altíssimo N** para resultado visual rápido
- **Quando usar:** Quando gramado está amarelado ou antes de eventos

### Recupera Gramado (15-15-15)
- **Balanceado** para recuperação geral
- **Quando usar:** Após danos, estresse ou períodos de negligência

---

## 📅 Calendário de Adubação

| Estação | Produto Principal | Frequência |
|---------|------------------|------------|
| **Primavera** | Nutrição Completa | A cada 30 dias |
| **Verão** | Nutrição Completa | A cada 30-45 dias |
| **Outono** | Rico em K | A cada 45 dias |
| **Inverno** | Não adubar ou 1x só | - |

---

## 💡 Dicas Importantes

1. **NUNCA adube em gramado seco** - Sempre regue antes ou após
2. **Menos é mais** - Excesso queima mais que falta
3. **Distribua uniformemente** - Use espalhador ou faça cruzado
4. **Leia instruções** - Dosagem varia por produto
5. **Evite em dias muito quentes** - Prefira dias nublados/frescos`
            },
            {
              type: 'callout',
              content: {
                type: 'tip',
                title: 'Dica Terravik',
                text: 'O "Gramado Novo" (11-52-00) tem ALTO FÓSFORO para enraizamento. Já o "Nutrição Completa" (20-05-20) é para manutenção com ênfase em cor verde e resistência.',
              },
            },
          ],
          quiz: {
            id: 'quiz-adub-1',
            passingScore: 60,
            questions: [
              {
                id: 'q1',
                type: 'multiple-choice',
                question: 'Qual nutriente é responsável pela cor verde intensa do gramado?',
                options: [
                  { id: 'a', text: 'Fósforo (P)' },
                  { id: 'b', text: 'Potássio (K)' },
                  { id: 'c', text: 'Nitrogênio (N)' },
                  { id: 'd', text: 'Cálcio (Ca)' },
                ],
                correctAnswer: 'c',
                explanation: 'O Nitrogênio (N) é responsável pelo crescimento verde e cor intensa das folhas.',
              },
              {
                id: 'q2',
                type: 'multiple-choice',
                question: 'Por que o produto "Gramado Novo" tem alto teor de Fósforo (P)?',
                options: [
                  { id: 'a', text: 'Para deixar mais verde' },
                  { id: 'b', text: 'Para promover enraizamento profundo' },
                  { id: 'c', text: 'Para aumentar resistência a doenças' },
                  { id: 'd', text: 'Para acelerar crescimento das folhas' },
                ],
                correctAnswer: 'b',
                explanation: 'O Fósforo (P) promove desenvolvimento de raízes fortes e profundas, essencial no estabelecimento inicial.',
              },
              {
                id: 'q3',
                type: 'multiple-choice',
                question: 'Qual nutriente aumenta a resistência do gramado à seca, frio e doenças?',
                options: [
                  { id: 'a', text: 'Nitrogênio (N)' },
                  { id: 'b', text: 'Fósforo (P)' },
                  { id: 'c', text: 'Potássio (K)' },
                  { id: 'd', text: 'Magnésio (Mg)' },
                ],
                correctAnswer: 'c',
                explanation: 'O Potássio (K) fortalece a estrutura celular e aumenta a resistência geral da planta a estresses.',
              },
              {
                id: 'q4',
                type: 'true-false',
                question: 'Devemos SEMPRE regar o gramado antes ou depois de adubar.',
                options: [
                  { id: 'true', text: 'Verdadeiro' },
                  { id: 'false', text: 'Falso' },
                ],
                correctAnswer: 'true',
                explanation: 'Verdadeiro! Regar ajuda o adubo a penetrar no solo e evita queima das folhas pelo contato direto.',
              },
            ],
          },
          practicalTips: [
            {
              icon: '📦',
              title: 'Leia sempre a embalagem',
              description: 'Os números NPK variam por produto. Sempre confira antes de aplicar.',
            },
            {
              icon: '⚖️',
              title: 'Use balança',
              description: 'Pese o adubo para aplicar a dosagem exata. "No olho" geralmente resulta em excesso.',
            },
          ],
          relatedProducts: ['gramado-novo', 'nutricao-completa', 'verde-rapido', 'recupera-gramado'],
        },
      },
    ],
  },
  {
    id: 'problemas-solucoes',
    slug: 'problemas-e-solucoes',
    title: 'Problemas e Soluções',
    subtitle: 'Diagnostique e resolva',
    description: 'Identifique e corrija problemas comuns: amarelamento, pragas, doenças e deficiências.',
    icon: '🔍',
    color: {
      primary: '#EF4444',
      light: '#FEE2E2',
      gradient: 'from-red-500 to-orange-600',
    },
    difficulty: 'intermediario',
    estimatedTime: 50,
    prerequisites: ['fundamentos-gramado'],
    badge: { name: 'Doutor do Gramado', icon: '🩺', description: 'Expert em diagnóstico' },
    lessons: [
      {
        id: 'prob-1',
        slug: 'gramado-amarelado',
        title: 'Gramado Amarelado',
        description: 'Causas e soluções práticas',
        duration: 10,
        type: 'texto',
        xpReward: 60,
        order: 1,
        content: {
          sections: [
            {
              type: 'text',
              content: `# Meu Gramado Está Amarelo! E Agora?

Gramado amarelado é uma das queixas mais comuns. A boa notícia: **geralmente é fácil de resolver**!

## 🔍 Diagnóstico: Identifique a Causa

### 1. 🟡 Falta de Nitrogênio (MAIS COMUM - 70% dos casos)

**Sintomas:**
- Amarelamento **uniforme** por toda área
- Crescimento lento
- Grama "fraca"
- Cor verde-pálido ou amarelo-claro

**Como confirmar:**
- Não choveu/regou nos últimos dias (não é falta de água)
- Faz 2+ meses sem adubar
- Solo não está encharcado

**Solução:**
1. Aplicar **Verde Rápido (30-00-10)** ou **Nutrição Completa (20-05-20)**
2. Regar após aplicação
3. Resultado visível em 7-10 dias
4. Repetir mensalmente

---

### 2. 💧 Excesso de Água

**Sintomas:**
- Amarelamento + **solo encharcado**
- Odor desagradável do solo
- Grama "mole" ao pisar
- Áreas com musgo

**Como confirmar:**
- Solo está sempre úmido/molhado
- Rega frequente ou chuvas constantes
- Drenagem ruim (água empoça)

**Solução:**
1. **REDUZA** frequência de rega
2. Melhore drenagem (adicione areia, faça furos no solo)
3. Aumente altura do corte temporariamente
4. Aplicar fungicida se houver fungos

---

### 3. 🏜️ Falta de Água

**Sintomas:**
- Amarelamento + **solo seco e duro**
- Folhas enroladas
- Pegadas ficam marcadas
- Cor azul-acinzentada

**Como confirmar:**
- Não choveu há dias
- Solo seco a 5cm de profundidade
- Grama não volta ao normal após pisar

**Solução:**
1. **AUMENTE** frequência de rega
2. Regue profundamente (até solo absorver)
3. Considere sistema de irrigação automático
4. Adicione matéria orgânica (retém mais água)

---

### 4. ☀️ Sol Excessivo + Calor

**Sintomas:**
- Amarelamento em áreas mais expostas
- Pior em horários de sol forte
- Pontas das folhas queimadas

**Solução:**
1. Aumentar frequência de rega
2. **Aumentar altura do corte** (grama mais alta protege raízes)
3. Aplicar fertilizante com potássio (aumenta resistência)
4. Considerar sombreamento parcial

---

### 5. 🐕 Urina de Cachorro

**Sintomas:**
- **Manchas circulares** amarelas/marrons
- Centro morto, borda verde-escura
- Padrão aleatório pelo gramado

**Solução:**
1. Regar IMEDIATAMENTE após o pet urinar (dilui)
2. Aplicar calcário nas manchas
3. Treinar pet para usar área específica
4. Plantar grama mais resistente (Bermuda)

---

### 6. 🦠 Doenças Fúngicas

**Sintomas:**
- Manchas **circulares** amarelas/marrons
- Bordas vermelhas/escuras
- Crescimento do fungo visível (manchas)
- Pior em condições úmidas

**Solução:**
1. Aplicar fungicida específico
2. Melhorar circulação de ar
3. Reduzir rega noturna
4. Aumentar altura do corte

---

### 7. ⚙️ Corte Incorreto

**Sintomas:**
- Pontas amareladas/marrons
- Após corte recente
- Aspecto "queimado"

**Causas:**
- Lâmina cega
- Corte muito baixo
- Grama úmida ao cortar

**Solução:**
1. **Afiar lâmina** do cortador
2. Aumentar altura do corte
3. Cortar apenas com grama seca
4. Mudar padrão de corte (não passar sempre no mesmo sentido)

---

## 🎯 Plano de Ação Rápido

**Se não souber a causa, siga esta ordem:**

1. **Verifique solo:** Seco ou encharcado?
   - Seco → Regue
   - Encharcado → Pare de regar

2. **Adube:** Se faz 1+ mês sem adubar
   - Use **Verde Rápido** ou **Nutrição Completa**

3. **Observe por 1 semana:**
   - Melhorou? Continue o tratamento
   - Não melhorou? Pode ser doença (aplicar fungicida)

4. **Prevenção:**
   - Adubação mensal
   - Rega adequada
   - Corte com lâmina afiada`
            },
            {
              type: 'callout',
              content: {
                type: 'tip',
                title: '💡 Dica de Ouro',
                text: 'Em 70% dos casos, gramado amarelado é simples falta de Nitrogênio. Tente adubar primeiro antes de investigar outras causas!',
              },
            },
          ],
          quiz: {
            id: 'quiz-prob-1',
            passingScore: 60,
            questions: [
              {
                id: 'q1',
                type: 'multiple-choice',
                question: 'Qual a causa MAIS comum de gramado amarelado?',
                options: [
                  { id: 'a', text: 'Excesso de água' },
                  { id: 'b', text: 'Falta de Nitrogênio' },
                  { id: 'c', text: 'Pragas' },
                  { id: 'd', text: 'Doenças fúngicas' },
                ],
                correctAnswer: 'b',
                explanation: 'A falta de Nitrogênio é responsável por cerca de 70% dos casos de amarelamento uniforme em gramados.',
              },
              {
                id: 'q2',
                type: 'multiple-choice',
                question: 'Como identificar que o amarelamento é causado por urina de cachorro?',
                options: [
                  { id: 'a', text: 'Amarelamento uniforme por todo gramado' },
                  { id: 'b', text: 'Manchas circulares com centro morto e borda verde-escura' },
                  { id: 'c', text: 'Solo sempre encharcado' },
                  { id: 'd', text: 'Folhas enroladas' },
                ],
                correctAnswer: 'b',
                explanation: 'Urina de cachorro causa manchas circulares características, com centro amarelo/morto e borda verde-escura pelo excesso de nitrogênio concentrado.',
              },
              {
                id: 'q3',
                type: 'true-false',
                question: 'Gramado amarelado com solo encharcado indica falta de água.',
                options: [
                  { id: 'true', text: 'Verdadeiro' },
                  { id: 'false', text: 'Falso' },
                ],
                correctAnswer: 'false',
                explanation: 'Falso! Solo encharcado indica EXCESSO de água. As raízes ficam sufocadas e não conseguem absorver nutrientes, causando amarelamento.',
              },
            ],
          },
          practicalTips: [
            {
              icon: '📸',
              title: 'Fotografe o problema',
              description: 'Tire fotos de perto e de longe. Ajuda a acompanhar evolução e comparar com exemplos online.',
            },
            {
              icon: '📝',
              title: 'Anote quando começou',
              description: 'Problemas súbitos geralmente são água/rega. Gradual = falta de nutrientes.',
            },
          ],
          relatedProducts: ['verde-rapido', 'nutricao-completa', 'recupera-gramado'],
        },
      },
    ],
  },
];

export function getCourseBySlug(slug: string): LegacyCourse | undefined {
  return COURSES.find(c => c.slug === slug);
}

export function getLessonBySlug(courseSlug: string, lessonSlug: string) {
  const course = getCourseBySlug(courseSlug);
  return course?.lessons.find(l => l.slug === lessonSlug);
}

export function getAllLessons() {
  return COURSES.flatMap(course => 
    course.lessons.map(lesson => ({
      ...lesson,
      courseId: course.id,
      courseSlug: course.slug,
      courseTitle: course.title,
      courseIcon: course.icon,
    }))
  );
}

export function getCourseLessonsCount(courseId: string): number {
  const course = COURSES.find(c => c.id === courseId);
  return course?.lessons.length || 0;
}
