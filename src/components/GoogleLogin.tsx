'use client';

import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export default function GoogleLogin() {
  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <Button onClick={handleGoogleLogin}>
      Login with Google
    </Button>
  );
}
