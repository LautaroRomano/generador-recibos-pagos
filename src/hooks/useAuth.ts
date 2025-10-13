import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentAdmin, checkAuthStatus, AdminUser } from '@/lib/client-auth';

export function useAuth() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First try to get from localStorage for immediate UI update
        const localAdmin = getCurrentAdmin();
        setAdmin(localAdmin);
        
        // Then verify with server for accuracy
        const serverAdmin = await checkAuthStatus();
        setAdmin(serverAdmin);
        
        if (!serverAdmin) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return { admin, loading, isAuthenticated: !!admin };
} 