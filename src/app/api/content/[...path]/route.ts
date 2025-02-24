import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'
import { createReadStream, statSync, readdirSync } from 'fs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
): Promise<NextResponse> {
  try {
    const { path } = await params
    console.log('Path reçu:', path)
    
    // Construire le chemin vers le dossier média
    const contentDir = join(process.cwd(), 'content')
    const decodedPath = path.map(segment => decodeURIComponent(segment))
    console.log('Path décodé:', decodedPath)
    
    // Obtenir le dossier parent et le nom de fichier recherché
    const fileName = decodedPath[decodedPath.length - 1]
    const parentDir = join(contentDir, ...decodedPath.slice(0, -1))
    console.log('Dossier parent:', parentDir)
    console.log('Nom de fichier recherché:', fileName)
    
    // Vérifier que le chemin est dans un dossier medias
    if (!parentDir.includes('medias') || !parentDir.startsWith(contentDir)) {
      console.error('Chemin non autorisé:', parentDir)
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 })
    }

    try {
      // Lire le contenu du dossier
      const files = readdirSync(parentDir)
      console.log('Fichiers dans le dossier:', files)
      
      // Trouver le fichier qui correspond (ignorer les retours à la ligne)
      console.log('Recherche de correspondance pour:', fileName)
      const actualFileName = files.find(f => {
        const normalizedFile = f.replace(/\n/g, '')
        const normalizedSearch = fileName.replace(/\n/g, '')
        console.log('Comparaison:', normalizedFile, '===', normalizedSearch)
        return normalizedFile === normalizedSearch
      })
      
      if (!actualFileName) {
        console.error('Fichier non trouvé:', fileName)
        console.error('Fichiers disponibles:', files)
        return NextResponse.json({ error: 'Fichier non trouvé' }, { status: 404 })
      }

      console.log('Fichier trouvé:', actualFileName)
      const filePath = join(parentDir, actualFileName)
      console.log('Chemin complet:', filePath)

      const stat = statSync(filePath)
      const fileSize = stat.size
      const range = request.headers.get('range')

      // Déterminer le type MIME en fonction de l'extension
      const ext = filePath.toLowerCase().split('.').pop() || ''
      const mimeTypes: { [key: string]: string } = {
        'm4a': 'audio/mp4',
        'mp3': 'audio/mpeg',
        'wav': 'audio/wav',
        'gif': 'image/gif',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'webp': 'image/webp'
      }
      const contentType = mimeTypes[ext] || 'application/octet-stream'

      if (range) {
        const parts = range.replace(/bytes=/, '').split('-')
        const start = parseInt(parts[0], 10)
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
        const chunksize = (end - start) + 1
        const stream = createReadStream(filePath, { start, end })

        const headers = new Headers({
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize.toString(),
          'Content-Type': contentType,
        })

        return new NextResponse(stream as unknown as ReadableStream, {
          status: 206,
          headers,
        })
      } else {
        const stream = createReadStream(filePath)
        const headers = new Headers({
          'Content-Length': fileSize.toString(),
          'Content-Type': contentType,
          'Accept-Ranges': 'bytes',
        })

        return new NextResponse(stream as unknown as ReadableStream, {
          status: 200,
          headers,
        })
      }
    } catch (error) {
      console.error('Erreur lors de la lecture du fichier:', error)
      return NextResponse.json({ error: 'Fichier non trouvé' }, { status: 404 })
    }
  } catch (error) {
    console.error('Erreur générale:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
} 