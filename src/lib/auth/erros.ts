/**
 * Leitura dos erros de autenticação do Supabase.
 *
 * O Supabase impõe uma espera de cerca de 60s por endereço no envio de e-mail
 * e responde, dentro dessa janela:
 *
 *   429 over_email_send_rate_limit
 *   "For security purposes, you can only request this after 27 seconds."
 *
 * É uma defesa legítima. O defeito era nosso: os formulários colapsavam
 * qualquer erro em "Tente novamente", que para limite de taxa é a única
 * instrução que garante o erro seguinte.
 *
 * POR QUE LER O OBJETO, E NÃO SÓ A MENSAGEM
 *
 * `AuthProvider` devolve o erro tipado como `Error`, o que apaga `status` e
 * `code` para o TypeScript. Em tempo de execução as duas propriedades estão
 * lá, porque o objeto é o `AuthError` do supabase-js. Então a checagem é feita
 * por narrowing em `unknown`, em vez de casar texto.
 *
 * O texto entra só como terceira tentativa, e para extrair o NÚMERO de
 * segundos, que não existe em campo próprio. Casar texto de mensagem de API é
 * frágil (muda com a versão, muda com o idioma), então quando o número não
 * aparece a função devolve `0`, que a interface traduz para uma espera
 * genérica em vez de inventar um número errado.
 */

/** Códigos que o Supabase usa para limite de requisição. */
const CODIGOS_DE_LIMITE = new Set([
  'over_email_send_rate_limit',
  'over_request_rate_limit',
  'over_sms_send_rate_limit',
])

function campoTexto(objeto: Record<string, unknown>, chave: string): string {
  const valor = objeto[chave]
  return typeof valor === 'string' ? valor : ''
}

/**
 * Quantos segundos faltam até poder pedir de novo.
 *
 * Devolve `null` quando o erro NÃO é de limite, `0` quando é de limite mas o
 * tempo não veio na resposta, e o número de segundos quando veio.
 *
 * O `0` é um caso de verdade e não um "não sei" disfarçado: quem chama precisa
 * distinguir "não é limite, mostre a mensagem padrão" de "é limite, mas não dá
 * para dizer quanto tempo".
 */
export function segundosDeEspera(erro: unknown): number | null {
  if (!erro || typeof erro !== 'object') return null
  const obj = erro as Record<string, unknown>

  const status = obj.status
  const code = campoTexto(obj, 'code')
  const mensagem = campoTexto(obj, 'message')

  const ehLimite =
    status === 429 ||
    CODIGOS_DE_LIMITE.has(code) ||
    /rate limit|too many requests/i.test(mensagem)

  if (!ehLimite) return null

  // "you can only request this after 27 seconds" / "after 1 second"
  const achado = mensagem.match(/after (\d+) seconds?/i)
  if (achado) {
    const n = Number(achado[1])
    if (Number.isFinite(n) && n > 0) return n
  }
  return 0
}

/** "27 segundos", "1 segundo", ou uma estimativa quando o tempo não veio. */
function quanto(segundos: number): string {
  if (segundos <= 0) return 'cerca de um minuto'
  return `${segundos} ${segundos === 1 ? 'segundo' : 'segundos'}`
}

/**
 * A frase para o limite de ENVIO de e-mail, já com o tempo quando ele é
 * conhecido. Nunca manda repetir na hora: é o oposto da instrução certa aqui.
 */
export function mensagemDeEspera(segundos: number, oQuePedir = 'outro link'): string {
  return `Você já pediu isso há pouco. Aguarde ${quanto(segundos)} antes de pedir ${oQuePedir}.`
}

/**
 * A frase para o limite de TENTATIVAS, no login.
 *
 * Separada da de envio porque a causa é outra: ali a pessoa pediu um e-mail
 * rápido demais, aqui ela errou a senha vezes demais. Dizer "você já pediu
 * isso há pouco" a quem está tentando entrar não descreve o que aconteceu.
 */
export function mensagemDeMuitasTentativas(segundos: number): string {
  return `Muitas tentativas seguidas. Aguarde ${quanto(segundos)} antes de tentar de novo.`
}
