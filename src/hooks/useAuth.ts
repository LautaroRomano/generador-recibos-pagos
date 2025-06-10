import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentAdmin, AdminUser } from '@/lib/client-auth';

export function useAuth() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const currentAdmin = getCurrentAdmin();
      setAdmin(currentAdmin);
      setLoading(false);

      if (!currentAdmin) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  return { admin, loading, isAuthenticated: !!admin };
} 