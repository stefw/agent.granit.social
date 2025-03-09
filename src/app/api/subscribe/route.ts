import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Vérifier si les variables d'environnement nécessaires sont définies
const RESEND_API_KEY = process.env.RESEND_API_KEY
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID

// Initialisation conditionnelle de Resend
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

export async function POST(request: Request) {
  try {
    // Vérifier si Resend est configuré
    if (!resend || !RESEND_AUDIENCE_ID) {
      console.warn('Configuration Resend manquante. La fonctionnalité de newsletter est désactivée.')
      return NextResponse.json(
        { error: 'Service de newsletter temporairement indisponible' },
        { status: 503 }
      )
    }

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      )
    }

    console.log('Tentative d\'ajout du contact:', email)
    console.log('Audience ID:', RESEND_AUDIENCE_ID)

    // Création du contact dans Resend
    const result = await resend.contacts.create({
      email,
      firstName: '', // Optionnel
      lastName: '', // Optionnel
      unsubscribed: false,
      audienceId: RESEND_AUDIENCE_ID,
    })

    console.log('Résultat Resend:', result)

    return NextResponse.json(
      { message: 'Inscription réussie', data: result },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur détaillée:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de l\'inscription' },
      { status: 500 }
    )
  }
}
