#!/usr/bin/env node

/**
 * Script de Verificação Pré-Deploy
 * Valida se o projeto está pronto para produção
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 Verificando projeto Terravik Store...\n')

let errors = 0
let warnings = 0

// Verificar arquivos obrigatórios
const requiredFiles = [
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/components/cart/CartProvider.tsx',
  'src/lib/shopify/client.ts',
  'src/lib/calculator/engine.ts',
  'next.config.mjs',
  'tailwind.config.ts',
  'tsconfig.json',
  'package.json',
  'public/robots.txt',
  'public/manifest.json',
  '.env.local.example',
]

console.log('📁 Verificando arquivos obrigatórios...')
requiredFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`)
  } else {
    console.log(`  ❌ ${file} - FALTANDO`)
    errors++
  }
})

// Verificar .env.local
console.log('\n🔐 Verificando variáveis de ambiente...')
if (fs.existsSync('.env.local')) {
  const env = fs.readFileSync('.env.local', 'utf-8')
  
  const requiredEnvVars = [
    'NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN',
    'NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN',
    'NEXT_PUBLIC_SITE_URL',
  ]

  requiredEnvVars.forEach((varName) => {
    if (env.includes(varName) && !env.includes(`${varName}=sua-loja`) && !env.includes(`${varName}=seu_token`)) {
      console.log(`  ✅ ${varName}`)
    } else {
      console.log(`  ⚠️  ${varName} - não configurado ou usando placeholder`)
      warnings++
    }
  })
} else {
  console.log('  ⚠️  .env.local não encontrado (site usará mock data)')
  warnings++
}

// Verificar build
console.log('\n🔨 Verificando build...')
if (fs.existsSync('.next')) {
  console.log('  ✅ Build exists (.next/)')
} else {
  console.log('  ⚠️  Build não encontrado. Rode: npm run build')
  warnings++
}

// Verificar imagens
console.log('\n🖼️  Verificando imagens...')
const imageChecks = [
  { path: 'public/favicon.ico', label: 'Favicon' },
  { path: 'public/apple-touch-icon.png', label: 'Apple Touch Icon' },
  { path: 'public/images/og/default.jpg', label: 'Open Graph Default' },
]

imageChecks.forEach(({ path: imgPath, label }) => {
  if (fs.existsSync(imgPath)) {
    console.log(`  ✅ ${label}`)
  } else {
    console.log(`  ⚠️  ${label} - não encontrado (opcional mas recomendado)`)
    warnings++
  }
})

// Verificar package.json
console.log('\n📦 Verificando dependências...')
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'))

const requiredDeps = [
  'next',
  'react',
  'react-dom',
  'framer-motion',
  'lucide-react',
  'tailwindcss',
]

requiredDeps.forEach((dep) => {
  if (pkg.dependencies?.[dep] || pkg.devDependencies?.[dep]) {
    console.log(`  ✅ ${dep}`)
  } else {
    console.log(`  ❌ ${dep} - FALTANDO`)
    errors++
  }
})

// Resumo final
console.log('\n' + '='.repeat(50))
console.log('📊 RESUMO DA VERIFICAÇÃO\n')

if (errors === 0 && warnings === 0) {
  console.log('  🎉 PERFEITO! Projeto pronto para deploy!')
  console.log('\n  Próximos passos:')
  console.log('  1. Configure .env.local com credenciais reais')
  console.log('  2. Rode: npm run build')
  console.log('  3. Deploy: vercel --prod')
} else if (errors === 0) {
  console.log(`  ⚠️  ${warnings} avisos encontrados`)
  console.log('\n  Projeto funcional, mas recomenda-se resolver os avisos.')
  console.log('  Para deploy básico, pode prosseguir.')
} else {
  console.log(`  ❌ ${errors} erros críticos encontrados`)
  console.log(`  ⚠️  ${warnings} avisos`)
  console.log('\n  Corrija os erros antes de fazer deploy!')
  process.exit(1)
}

console.log('='.repeat(50) + '\n')
