import { NextRequest } from 'next/server'
import { join } from 'path'
import { createReadStream, statSync } from 'fs'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Encoder les noms de fichiers pour gérer les espaces
    const safePath = params.path.map(segment => encodeURIComponent(segment))
    const filePath = join(process.cwd(), 'content', ...safePath)
    
    // Vérifier que le fichier existe et est dans le dossier content
    if (!filePath.startsWith(join(process.cwd(), 'content'))) {
      return new Response('Accès non autorisé', { status: 403 })
    }

    // Décoder le chemin pour la lecture du fichier
    const decodedPath = join(process.cwd(), 'content', ...params.path)
    const stat = statSync(decodedPath)
    const fileSize = stat.size
    const range = request.headers.get('range')

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      const chunksize = (end - start) + 1
      const stream = createReadStream(decodedPath, { start, end })

      const headers = new Headers({
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize.toString(),
        'Content-Type': 'audio/mp4',
      })

      return new Response(stream as unknown as ReadableStream, {
        status: 206,
        headers,
      })
    } else {
      const stream = createReadStream(decodedPath)
      const headers = new Headers({
        'Content-Length': fileSize.toString(),
        'Content-Type': 'audio/mp4',
        'Accept-Ranges': 'bytes',
      })

      return new Response(stream as unknown as ReadableStream, {
        status: 200,
        headers,
      })
    }
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier:', error)
    return new Response('Fichier non trouvé', { status: 404 })
  }
} 