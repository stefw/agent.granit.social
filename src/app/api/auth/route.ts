import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { action, email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }
    
    if (action === 'signin') {
      // Connexion
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      return NextResponse.json({ success: true, user: data.user });
    } else if (action === 'signup') {
      // Vérifier si l'utilisateur est autorisé à créer un compte
      // Dans un environnement de production, vous voudriez probablement
      // limiter la création de comptes à certains domaines d'email
      // ou utiliser un système d'invitation
      
      // Inscription
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      return NextResponse.json({ 
        success: true, 
        user: data.user,
        message: 'Vérifiez votre email pour confirmer votre compte'
      });
    } else {
      return NextResponse.json(
        { error: 'Action non reconnue' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Erreur d\'authentification:', error);
    
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Déconnexion
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erreur de déconnexion:', error);
    
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
