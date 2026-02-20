# 📝 Academia Terravik - Templates para Expansão

Use estes templates para adicionar conteúdo rapidamente.

---

## 📚 Template: Nova Lição

```typescript
// Adicione em src/lib/academia/courses.ts
// Dentro do array lessons: [] do curso desejado

{
  id: 'SEU-ID-UNICO',
  slug: 'slug-url-amigavel',
  title: 'Título da Lição',
  description: 'Descrição curta e atraente (max 100 chars)',
  duration: 10, // minutos estimados
  type: 'texto', // ou 'video', 'interativo'
  xpReward: 50, // XP base (50-60 típico)
  order: 1, // ordem sequencial
  content: {
    sections: [
      {
        type: 'text',
        content: `# Título Principal

Introdução da lição...

## Tópico 1

Conteúdo do tópico 1...

### Subtópico

Mais detalhes...

**Negrito importante**

*Itálico para ênfase*

---

## Tópico 2

Lista com marcadores:
- Item 1
- Item 2
- Item 3

Lista numerada:
1. Passo 1
2. Passo 2
3. Passo 3`
      },
      {
        type: 'callout',
        content: {
          type: 'tip', // 'tip' (azul) ou 'warning' (amarelo)
          title: 'Dica Terravik',
          text: 'Texto da dica importante para o usuário.'
        }
      }
    ],
    quiz: {
      id: 'quiz-SEU-ID',
      passingScore: 60, // 60% é padrão
      questions: [
        {
          id: 'q1',
          type: 'multiple-choice',
          question: 'Qual é a pergunta?',
          options: [
            { id: 'a', text: 'Opção A' },
            { id: 'b', text: 'Opção B (correta)' },
            { id: 'c', text: 'Opção C' },
            { id: 'd', text: 'Opção D' },
          ],
          correctAnswer: 'b',
          explanation: 'Explicação clara do porquê B está correta.'
        },
        {
          id: 'q2',
          type: 'true-false',
          question: 'Afirmação verdadeira ou falsa?',
          options: [
            { id: 'true', text: 'Verdadeiro' },
            { id: 'false', text: 'Falso' },
          ],
          correctAnswer: 'true',
          explanation: 'Explicação da resposta correta.'
        }
      ]
    },
    practicalTips: [
      {
        icon: '💡', // emoji relevante
        title: 'Título da Dica',
        description: 'Descrição prática e acionável',
        timing: 'Quando fazer isso (opcional)'
      }
    ],
    relatedProducts: ['gramado-novo', 'nutricao-completa'] // opcional
  }
}
```

---

## 🎓 Template: Novo Curso

```typescript
// Adicione em src/lib/academia/courses.ts
// No array COURSES

{
  id: 'seu-curso-id',
  slug: 'slug-do-curso',
  title: 'Nome do Curso',
  subtitle: 'Tagline curta',
  description: 'Descrição completa do que será aprendido.',
  icon: '🎯', // emoji representativo
  color: {
    primary: '#3B82F6', // cor principal (hex)
    light: '#DBEAFE',   // versão clara
    gradient: 'from-blue-500 to-cyan-600', // Tailwind gradient
  },
  difficulty: 'iniciante', // 'iniciante', 'intermediario', 'avancado'
  estimatedTime: 45, // minutos totais
  prerequisites: [], // ou ['id-curso-prereq']
  featured: false, // true para destaque na home
  badge: {
    name: 'Nome do Badge',
    icon: '🏅',
    description: 'Descrição do badge conquistado'
  },
  lessons: [
    // Array de lições (use template acima)
  ]
}
```

---

## 🏆 Template: Nova Conquista

```typescript
// Adicione em src/lib/academia/achievements.ts
// No array ACHIEVEMENTS

{
  id: 'conquista-id-unica',
  name: 'Nome da Conquista',
  description: 'Descrição do que precisa fazer',
  icon: '🏆', // emoji representativo
  category: 'aprendizado', // 'aprendizado', 'consistencia', 'maestria', 'especial'
  condition: { 
    type: 'lessons_completed', // ver tipos abaixo
    value: 50 
  },
  xpReward: 500, // XP ao desbloquear
  rarity: 'raro', // 'comum', 'raro', 'epico', 'lendario'
}
```

### Tipos de Condição Disponíveis

```typescript
// Número de lições completas
{ type: 'lessons_completed', value: 10 }

// Número de cursos completos
{ type: 'courses_completed', value: 2 }

// Todos os cursos (boolean)
{ type: 'all_courses_completed', value: true }

// Dias consecutivos (streak)
{ type: 'streak', value: 7 }

// Quizzes com 100%
{ type: 'perfect_quiz', value: 5 }

// Lições em um único dia
{ type: 'lessons_in_day', value: 3 }

// Horário específico
{ type: 'time_of_day', value: 'early_morning' } // ou 'late_night'
```

---

## 📖 Template: Conteúdo Markdown Rico

### Estrutura Completa

```markdown
# Título Principal da Lição

Parágrafo introdutório engajante que explica o que será aprendido.

## Primeiro Tópico

Conteúdo explicativo do primeiro tópico.

**Ponto importante em negrito.**

### Subtópico com Lista

- Item importante 1
- Item importante 2
- Item importante 3

## Segundo Tópico

Mais conteúdo educacional.

### Exemplo Prático

1. Primeiro passo
2. Segundo passo
3. Terceiro passo

**Dica:** Use negrito para destacar conceitos-chave.

---

## Terceiro Tópico

### Tabela Comparativa (opcional)

| Característica | Opção A | Opção B |
|---------------|---------|---------|
| Custo | Baixo | Alto |
| Eficácia | Média | Alta |
| Facilidade | Alta | Baixa |

### Lista de Vantagens

✅ Vantagem 1  
✅ Vantagem 2  
✅ Vantagem 3  

### Lista de Desvantagens

❌ Desvantagem 1  
❌ Desvantagem 2  

---

## Resumo Final

Recapitule os pontos principais da lição em 2-3 frases.
```

---

## ❓ Template: Questão de Quiz

### Múltipla Escolha (4 opções)

```typescript
{
  id: 'q1',
  type: 'multiple-choice',
  question: 'Qual é a principal causa de X?',
  options: [
    { id: 'a', text: 'Opção incorreta 1' },
    { id: 'b', text: 'Opção correta' },
    { id: 'c', text: 'Opção incorreta 2' },
    { id: 'd', text: 'Opção incorreta 3' },
  ],
  correctAnswer: 'b',
  explanation: 'A opção B está correta porque [razão clara e educativa].'
}
```

### Múltipla Escolha (3 opções)

```typescript
{
  id: 'q2',
  type: 'multiple-choice',
  question: 'Em qual situação você deve fazer Y?',
  options: [
    { id: 'a', text: 'Situação A' },
    { id: 'b', text: 'Situação B' },
    { id: 'c', text: 'Situação C' },
  ],
  correctAnswer: 'a',
  explanation: 'A situação A é ideal porque [explicação].'
}
```

### Verdadeiro ou Falso

```typescript
{
  id: 'q3',
  type: 'true-false',
  question: 'A afirmação X é verdadeira?',
  options: [
    { id: 'true', text: 'Verdadeiro' },
    { id: 'false', text: 'Falso' },
  ],
  correctAnswer: 'true',
  explanation: 'Verdadeiro! [Explicação do porquê é verdadeiro].'
}
```

---

## 💡 Template: Dicas Práticas

```typescript
practicalTips: [
  {
    icon: '📸',
    title: 'Fotografe e Documente',
    description: 'Tire fotos antes e depois para acompanhar evolução',
    timing: 'Fazer antes de qualquer mudança'
  },
  {
    icon: '⏰',
    title: 'Configure Lembretes',
    description: 'Use alarmes para não esquecer tarefas importantes',
    timing: 'Configurar agora'
  },
  {
    icon: '📝',
    title: 'Anote Observações',
    description: 'Mantenha um diário do seu gramado',
    timing: 'Semanalmente'
  },
  {
    icon: '🔍',
    title: 'Inspecione Regularmente',
    description: 'Verifique sinais de problemas toda semana',
    timing: 'Toda semana'
  }
]
```

---

## 🎨 Template: Callout (Destaque)

### Dica (Azul)

```typescript
{
  type: 'callout',
  content: {
    type: 'tip',
    title: 'Dica Terravik',
    text: 'Conteúdo da dica valiosa para o usuário.'
  }
}
```

### Aviso (Amarelo)

```typescript
{
  type: 'callout',
  content: {
    type: 'warning',
    title: 'Atenção',
    text: 'Aviso importante sobre algo que o usuário deve evitar ou ter cuidado.'
  }
}
```

---

## 🎯 Guia de Boas Práticas

### Para Lições

✅ **Faça:**
- Título claro e direto (50 chars max)
- Descrição engajante (100 chars max)
- Conteúdo estruturado (H1 → H2 → H3)
- Listas para facilitar leitura
- Negrito em conceitos-chave
- 3-5 questões no quiz
- XP proporcional à duração (5-10 XP por min)

❌ **Evite:**
- Parágrafos muito longos (max 5 linhas)
- Jargão técnico sem explicação
- Conteúdo sem estrutura
- Quiz muito difícil (min 60% pass rate)
- Mais de 6 questões por quiz

### Para Quizzes

✅ **Faça:**
- Perguntas claras e objetivas
- 3-4 opções de resposta
- Explicação educativa (não apenas "está certo")
- Mix de fácil e médio
- Relate à lição diretamente

❌ **Evite:**
- Perguntas ambíguas
- "Pegadinhas" desnecessárias
- Muito fácil (todas óbvias)
- Muito difícil (ninguém acerta)
- Explicação vaga

### Para Conquistas

✅ **Faça:**
- Nome criativo e memorável
- Ícone representativo
- Descrição clara do objetivo
- XP proporcional à dificuldade
- Mix de fácil/médio/difícil

❌ **Evite:**
- Nome genérico
- Impossível de alcançar
- XP desproporcional
- Descrição confusa

---

## 🔢 Guia de Valores

### Duração Estimada
- Lição curta: 5-8 min
- Lição média: 10-12 min
- Lição longa: 15-20 min

### XP por Lição
- Curta: 40-50 XP
- Média: 50-60 XP
- Longa: 60-80 XP

### XP de Conquistas
- Comum: 100-200 XP
- Rara: 300-500 XP
- Épica: 600-1000 XP
- Lendária: 2000-5000 XP

### Questões no Quiz
- Mínimo: 3 questões
- Ideal: 3-5 questões
- Máximo recomendado: 6 questões

### Passing Score
- Padrão: 60%
- Fácil: 50%
- Difícil: 70%

---

## 📊 Exemplo Completo: Lição do Zero

```typescript
{
  id: 'cuidados-primavera',
  slug: 'cuidados-primavera',
  title: 'Cuidados com Gramado na Primavera',
  description: 'Prepare seu gramado para a estação de crescimento',
  duration: 12,
  type: 'texto',
  xpReward: 55,
  order: 5,
  content: {
    sections: [
      {
        type: 'text',
        content: `# Cuidados com Gramado na Primavera

A primavera é a estação de crescimento! Seu gramado precisa de atenção especial para aproveitar ao máximo.

## 🌱 Por Que a Primavera é Importante?

Após o inverno, o gramado entra em fase de crescimento acelerado:
- Metabolismo aumenta com temperatura
- Raízes se desenvolvem rapidamente  
- Momento ideal para correções

---

## 🔧 Checklist de Primavera

### 1. Limpeza Geral

**O que fazer:**
- Remover folhas secas acumuladas
- Varrer detritos do inverno
- Arejar o solo (se compactado)

**Por quê?**  
Folhas bloqueiam luz e criam ambiente úmido (fungos).

### 2. Primeira Adubação

**Timing:** Setembro (início da primavera)

**Produto recomendado:**  
Terravik Nutrição Completa (20-05-20)

**Quantidade:**  
100g por m² (siga embalagem)

### 3. Controle de Mato

**Melhor época:** Outubro

Mato compete por nutrientes. Remova manualmente ou use herbicida seletivo.

---

## 💧 Ajuste a Rega

Aumente frequência gradualmente:
- **Setembro:** 2x por semana
- **Outubro:** 2-3x por semana
- **Novembro:** 3x por semana

---

## ⚠️ Erros Comuns

❌ **Adubar muito cedo** (agosto ainda frio)  
❌ **Cortar muito baixo** (enfraquece gramado)  
❌ **Ignorar pragas** (época de aparecimento)`
      },
      {
        type: 'callout',
        content: {
          type: 'tip',
          title: 'Dica Terravik',
          text: 'Faça a primeira adubação quando notar crescimento retomando (grama mais verde e crescendo).'
        }
      }
    ],
    quiz: {
      id: 'quiz-primavera',
      passingScore: 60,
      questions: [
        {
          id: 'q1',
          type: 'multiple-choice',
          question: 'Quando fazer a primeira adubação da primavera?',
          options: [
            { id: 'a', text: 'Agosto (ainda inverno)' },
            { id: 'b', text: 'Setembro (início primavera)' },
            { id: 'c', text: 'Dezembro (verão)' },
          ],
          correctAnswer: 'b',
          explanation: 'Setembro é ideal, quando o gramado retoma crescimento e temperatura está adequada.'
        },
        {
          id: 'q2',
          type: 'true-false',
          question: 'É correto remover folhas secas antes de adubar?',
          options: [
            { id: 'true', text: 'Verdadeiro' },
            { id: 'false', text: 'Falso' },
          ],
          correctAnswer: 'true',
          explanation: 'Verdadeiro! Folhas bloqueiam luz e impedem adubo de chegar ao solo.'
        },
        {
          id: 'q3',
          type: 'multiple-choice',
          question: 'Qual produto Terravik é recomendado para primavera?',
          options: [
            { id: 'a', text: 'Gramado Novo (11-52-00)' },
            { id: 'b', text: 'Nutrição Completa (20-05-20)' },
            { id: 'c', text: 'Verde Rápido (30-00-10)' },
          ],
          correctAnswer: 'b',
          explanation: 'Nutrição Completa tem NPK balanceado ideal para crescimento saudável na primavera.'
        }
      ]
    },
    practicalTips: [
      {
        icon: '📅',
        title: 'Marque no Calendário',
        description: 'Anote datas de adubação (a cada 30 dias)',
        timing: 'Fazer agora'
      },
      {
        icon: '📸',
        title: 'Foto Antes e Depois',
        description: 'Documente a evolução do gramado',
        timing: 'No início e fim da primavera'
      }
    ],
    relatedProducts: ['nutricao-completa', 'recupera-gramado']
  }
}
```

---

## 🚀 Workflow de Criação

### 1. Planejamento
- [ ] Definir tema da lição
- [ ] Pesquisar conteúdo (fontes confiáveis)
- [ ] Estruturar tópicos principais
- [ ] Definir ordem lógica

### 2. Escrita
- [ ] Escrever introdução engajante
- [ ] Desenvolver cada tópico
- [ ] Adicionar exemplos práticos
- [ ] Criar callouts de destaque

### 3. Quiz
- [ ] Criar 3-5 questões
- [ ] Misturar tipos (múltipla escolha + V/F)
- [ ] Escrever explicações claras
- [ ] Testar dificuldade

### 4. Dicas Práticas
- [ ] Listar 2-4 dicas acionáveis
- [ ] Adicionar emojis representativos
- [ ] Incluir timing se relevante

### 5. Revisão
- [ ] Verificar ortografia
- [ ] Checar formatação Markdown
- [ ] Testar no navegador
- [ ] Fazer quiz você mesmo

### 6. Integração
- [ ] Adicionar em courses.ts
- [ ] Ajustar order das lições
- [ ] Verificar IDs únicos
- [ ] Testar navegação

---

**Use estes templates para expandir a Academia rapidamente! 🚀**
