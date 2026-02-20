# 🚀 Academia Terravik - Quick Start

## ✅ Status: Implementação Concluída!

A Academia Terravik está 100% funcional e pronta para uso.

---

## 🎯 Acesso Rápido

### Servidor Local

```bash
npm run dev
```

**URL:** http://localhost:3000/academia

### URLs Disponíveis

- 🏠 **Hub Principal:** `/academia`
- 📚 **Cursos:** `/academia/cursos`
- 🏆 **Conquistas:** `/academia/conquistas`
- 👤 **Perfil:** `/academia/perfil`
- 📖 **Lição exemplo:** `/academia/cursos/fundamentos-do-gramado/tipos-de-grama`

---

## 🎮 Testando a Gamificação

### Ganhe seus primeiros XP

1. Acesse `/academia`
2. Clique em "Fundamentos do Gramado"
3. Complete a lição "Tipos de Grama no Brasil"
4. Faça o quiz (tente acertar 100%!)
5. Veja sua celebração com confetti 🎉

### Desbloqueie conquistas

- **👣 Primeiro Passo:** Complete sua primeira lição
- **💯 Resposta Perfeita:** Acerte 100% em um quiz
- **🔥 Aquecendo:** Volte amanhã para manter o streak

### Suba de nível

- **Nível 1 (Semente):** 0 XP - você começa aqui 🌱
- **Nível 2 (Broto):** 100 XP - complete 2 lições com quiz perfeito
- **Nível 3 (Jardineiro Iniciante):** 300 XP

---

## 📝 Estrutura dos Cursos

### 🌱 Fundamentos do Gramado (Iniciante)
**3 lições | 26 min | 9 questões**

1. **Tipos de Grama no Brasil** (8 min)
   - Esmeralda, São Carlos, Bermuda, Santo Agostinho
   - Quiz: 3 questões
   - 50 XP + bonuses

2. **Entendendo o Solo** (10 min)
   - Tipos de solo, pH, preparação
   - Quiz: 3 questões
   - 50 XP + bonuses

3. **Água e Rega Correta** (8 min)
   - Horários, frequência, sinais
   - Quiz: 3 questões
   - 50 XP + bonuses

**Badge ao completar:** 🌿 Conhecedor de Gramados

### 🧪 Adubação e Nutrição (Intermediário)
**1 lição | 12 min | 4 questões**

1. **Entendendo NPK** (12 min)
   - Nitrogênio, Fósforo, Potássio
   - Produtos Terravik explicados
   - Quiz: 4 questões
   - 60 XP + bonuses

**Badge ao completar:** ⚗️ Nutricionista de Gramados

### 🔍 Problemas e Soluções (Intermediário)
**1 lição | 10 min | 3 questões**

1. **Gramado Amarelado** (10 min)
   - Diagnóstico de causas
   - Soluções práticas
   - Quiz: 3 questões
   - 60 XP + bonuses

**Badge ao completar:** 🩺 Doutor do Gramado

---

## 💡 Dicas de Teste

### Testar Sistema de Streak

```javascript
// Abra o Console do navegador em /academia
// Simular atividade de ontem
const progress = JSON.parse(localStorage.getItem('terravik_academia_progress'));
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
progress.lastActivityDate = yesterday.toISOString();
localStorage.setItem('terravik_academia_progress', JSON.stringify(progress));
// Recarregue e complete uma lição
```

### Resetar Progresso

```javascript
// No Console do navegador
localStorage.removeItem('terravik_academia_progress');
// Recarregue a página
```

### Ver Progresso Atual

```javascript
// No Console do navegador
console.log(JSON.parse(localStorage.getItem('terravik_academia_progress')));
```

---

## 🎨 UI/UX Features para Testar

### ✨ Animações
- **Confetti:** Aparece ao completar quiz/lição
- **XP Bar:** Animação suave ao ganhar XP
- **Progress Rings:** Transição circular fluida
- **Cards:** Hover effects com elevação

### 🎯 Interatividade
- **Quiz:** Feedback visual imediato (verde/vermelho)
- **Lock System:** Lições bloqueadas até completar anterior
- **Streak Counter:** Muda de cor com streak alto
- **Celebration Modal:** Diferentes tipos (XP, level-up, conquista, curso)

### 📱 Responsividade
- Teste em mobile (350px+)
- Teste em tablet (768px+)
- Teste em desktop (1024px+)

---

## 🔧 Modificar Conteúdo

### Adicionar Nova Lição

```typescript
// Arquivo: src/lib/academia/courses.ts
// Encontre o curso e adicione em lessons: [...]
{
  id: 'fund-4',
  slug: 'nova-licao',
  title: 'Título da Nova Lição',
  description: 'Descrição curta',
  duration: 10,
  type: 'texto',
  xpReward: 50,
  order: 4,
  content: {
    sections: [
      {
        type: 'text',
        content: `# Seu conteúdo Markdown aqui
        
## Subtítulo

Parágrafo com texto...`
      },
      {
        type: 'callout',
        content: {
          type: 'tip', // ou 'warning'
          title: 'Dica Importante',
          text: 'Conteúdo da dica'
        }
      }
    ],
    quiz: {
      id: 'quiz-fund-4',
      passingScore: 60,
      questions: [
        {
          id: 'q1',
          type: 'multiple-choice',
          question: 'Sua pergunta?',
          options: [
            { id: 'a', text: 'Opção A' },
            { id: 'b', text: 'Opção B' },
            { id: 'c', text: 'Opção C' },
          ],
          correctAnswer: 'b',
          explanation: 'Explicação da resposta correta'
        }
      ]
    },
    practicalTips: [
      {
        icon: '💡',
        title: 'Dica Prática',
        description: 'Descrição da dica',
        timing: 'Quando fazer (opcional)'
      }
    ]
  }
}
```

### Ajustar Valores de XP

```typescript
// Arquivo: src/lib/academia/xp-system.ts
export const XP_CONFIG = {
  actions: {
    completarLicao: 50,        // Mude aqui
    completarQuiz100: 100,     // Mude aqui
    completarQuiz80: 75,
    completarQuiz60: 50,
    completarCurso: 500,       // Mude aqui
    primeiraLicaoDoDia: 25,
    manterStreak: 30,
  },
  // ...
}
```

### Adicionar Conquista

```typescript
// Arquivo: src/lib/academia/achievements.ts
export const ACHIEVEMENTS: Achievement[] = [
  // ... conquistas existentes
  {
    id: 'sua-conquista',
    name: 'Nome da Conquista',
    description: 'Complete X para desbloquear',
    icon: '🏆',
    category: 'aprendizado', // ou 'consistencia', 'maestria', 'especial'
    condition: { 
      type: 'lessons_completed', // ou outro tipo
      value: 15 
    },
    xpReward: 300,
    rarity: 'raro', // ou 'comum', 'epico', 'lendario'
  },
]
```

---

## 📊 Tipos de Condition para Conquistas

```typescript
// Tipos disponíveis em checkAchievement():
'lessons_completed'        // value: número de lições
'courses_completed'        // value: número de cursos
'all_courses_completed'    // value: true
'streak'                   // value: dias consecutivos
'perfect_quiz'             // value: número de quizzes 100%
'lessons_in_day'           // value: lições em um dia
'time_of_day'              // value: 'early_morning' ou 'late_night'
```

---

## 🚀 Deploy

### Build de Produção

```bash
npm run build
npm start
```

### Verificar Build

```bash
npm run build
# Deve passar sem erros
# Output esperado: "Compiled successfully"
```

### Variáveis de Ambiente

Nenhuma variável adicional necessária para a Academia.
O progresso é salvo localmente (localStorage).

---

## 📱 SEO e Meta Tags

Cada página tem:
- ✅ Meta title otimizado
- ✅ Meta description
- ✅ Open Graph (opcional adicionar)
- ✅ Estrutura semântica HTML5

---

## 🎯 KPIs para Monitorar (Futuro)

Se quiser adicionar analytics:

- Taxa de conclusão de cursos
- Tempo médio por lição
- Taxa de acerto em quizzes
- Usuários com streak 7+ dias
- Conquistas mais desbloqueadas
- Cursos mais populares

---

## 💬 FAQ Rápido

### Como adiciono mais cursos?

Edite `src/lib/academia/courses.ts` e adicione um novo objeto no array `COURSES`.

### Como personalizo as cores?

As cores estão inline nos componentes. Busque por `className` com cores como `bg-green-500`.

### Posso usar banco de dados?

Sim! Substitua `localStorage` em `src/lib/academia/storage.ts` por chamadas API.

### Como adiciono vídeos?

Adicione um novo tipo de seção em `content.sections`:
```typescript
{
  type: 'video',
  content: { url: 'https://...' }
}
```
E renderize no componente da lição.

---

## 🐛 Problemas Comuns

### Progresso não salva

**Causa:** localStorage desabilitado ou modo anônimo  
**Solução:** Tente em janela normal do navegador

### Quiz não avança

**Causa:** Não selecionou resposta  
**Solução:** Clique em uma opção antes de "Próxima"

### Animação não aparece

**Causa:** JavaScript desabilitado  
**Solução:** Habilite JS no navegador

---

## 📞 Suporte

Para dúvidas ou melhorias:
1. Verifique `ACADEMIA_CONCLUIDA.md` (documentação completa)
2. Inspecione o código em `src/lib/academia/` e `src/components/academia/`
3. Console do navegador para debug

---

## ✅ Checklist Pré-Deploy

- [ ] Teste todas as lições
- [ ] Complete um curso inteiro
- [ ] Teste em mobile
- [ ] Verifique links de produtos (relatedProducts)
- [ ] Teste redirecionamento /blog → /academia
- [ ] Ajuste conteúdo se necessário
- [ ] `npm run build` passa sem erros
- [ ] Otimize imagens se houver

---

**Pronto para usar! 🎉**

**Servidor:** `npm run dev`  
**URL:** http://localhost:3000/academia

**Divirta-se aprendendo sobre gramados! 🌱**
