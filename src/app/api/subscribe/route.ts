import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Initialisation de Resend avec la clé API
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      )
    }

    console.log('Tentative d\'ajout du contact:', email)
    console.log('Audience ID:', process.env.RESEND_AUDIENCE_ID)

    // Création du contact dans Resend
    const result = await resend.contacts.create({
      email,
      firstName: '', // Optionnel
      lastName: '', // Optionnel
      unsubscribed: false,
      audienceId: process.env.RESEND_AUDIENCE_ID as string,
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