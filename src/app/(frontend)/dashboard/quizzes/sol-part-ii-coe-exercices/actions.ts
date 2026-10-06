'use server'

import { headers } from 'next/headers'
import { getPayload } from 'payload'
import { revalidatePath } from 'next/cache'
import config from '@payload-config'
import { gradeCoe, type CoeResult } from '@/lib/grade-coe'

export async function submitCoe(answers: unknown): Promise<{ result?: CoeResult; error?: 'incomplete' | 'auth' | 'save' }> {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (user?.collection !== 'users') return { error: 'auth' }
  let result: CoeResult
  try { result = gradeCoe(answers) } catch { return { error: 'incomplete' } }
  try {
    // Identity and score are derived on the server; only this action writes the field.
    await payload.update({ collection: 'users', id: user.id, overrideAccess: true, data: { lastCoeResult: result } })
    revalidatePath('/dashboard')
    return { result }
  } catch {
    return { error: 'save' }
  }
}
