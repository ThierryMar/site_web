export function validEmail(email: string) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validPassword(password: string) {
  return password.length >= 12 && password.length <= 128
}
