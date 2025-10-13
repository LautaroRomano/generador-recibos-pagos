"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginAdmin } from "@/lib/client-auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shouldReload, setShouldReload] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // Efecto para manejar el reinicio automático de página
  useEffect(() => {
    if (shouldReload) {
      // Pequeño delay para asegurar que la cookie se haya establecido
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }, [shouldReload]);

  // Verificar si el usuario ya está autenticado al cargar la página
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/me');
        if (response.ok) {
          // Usuario ya autenticado, redirigir
          const callbackUrl = searchParams.get('callbackUrl');
          const redirectUrl = callbackUrl || "/";
          router.push(redirectUrl);
        }
      } catch (error) {
        // Usuario no autenticado, continuar con el login
      }
    };

    checkAuth();
  }, [router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor, ingrese email y contraseña");
      return;
    }

    try {
      setLoading(true);
      await loginAdmin({ email, password });
      
      // Obtener la URL de callback si existe
      const callbackUrl = searchParams.get('callbackUrl');
      const redirectUrl = callbackUrl || "/";
      
      // Pequeño delay para asegurar que la cookie se haya establecido
      setRedirecting(true);
      setTimeout(() => {
        // Intentar navegar primero
        try {
          router.push(redirectUrl);
        } catch (navError) {
          // Si la navegación falla, usar window.location para forzar la navegación
          window.location.href = redirectUrl;
        }
      }, 200);
      
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sistema de Pagos
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Inicie sesión para continuar
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Correo Electrónico
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || redirecting}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading || redirecting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {loading ? "Iniciando sesión..." : redirecting ? "Redirigiendo..." : "Iniciar Sesión"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
