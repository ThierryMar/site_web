import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { Admins } from './collections/Admins'
import { Users } from './collections/Users'
import { Pages } from './collections/Pages'
import { Intro, CourseOverviews, Downloads, Simulations } from './collections/Marketing'
import { Courses, Lessons, CourseResources, Exercises, Quizzes } from './collections/Courses'
import { transactionalEmail } from './lib/email'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const migrating = process.env.PAYLOAD_MIGRATING === 'true'

export default buildConfig({
  admin: { user: 'admins', importMap: { baseDir: dirname } },
  collections: [Admins, Users, Pages, Intro, CourseOverviews, Downloads, Simulations, Courses, Lessons, CourseResources, Exercises, Quizzes],
  editor: lexicalEditor(),
  email: transactionalEmail,
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  db: postgresAdapter({
    pool: {
      connectionString: migrating
        ? process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || ''
        : process.env.DATABASE_URL || '',
      max: 5,
      connectionTimeoutMillis: 10000,
    },
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
})
