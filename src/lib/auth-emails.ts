export const verificationSubject = 'Confirmez votre adresse courriel — SpaceOrbitLAB'

export function authEmailHTML(kind: 'verify' | 'reset', token: string) {
  const url = new URL(kind === 'verify' ? '/confirmer-courriel' : '/reinitialiser-mot-de-passe', process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000')
  url.searchParams.set('token', token)
  const href = url.href.replaceAll('&', '&amp;').replaceAll('"', '&quot;')
  return kind === 'verify'
    ? `<h1>Bienvenue sur SpaceOrbitLAB</h1><p>Confirmez votre adresse courriel pour pouvoir vous connecter.</p><p><a href="${href}">Confirmer mon adresse courriel</a></p><p>Ce lien est à usage unique. Si vous n’avez pas créé ce compte, ignorez ce message.</p>`
    : `<h1>Réinitialiser votre mot de passe</h1><p>Ce lien est valable une heure et ne peut être utilisé qu’une fois.</p><p><a href="${href}">Choisir un nouveau mot de passe</a></p><p>Si vous n’avez pas fait cette demande, ignorez ce message.</p>`
}
