import { cp, copyFile, readdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = resolve(appRoot, '..')
const distRoot = resolve(appRoot, 'dist')

for (const entry of await readdir(distRoot)) {
  await cp(resolve(distRoot, entry), resolve(repoRoot, entry), { recursive: true, force: true })
}

await copyFile(resolve(distRoot, 'index.html'), resolve(repoRoot, '404.html'))
