import axios from 'axios';

interface LoginCredentials {
  email: string;
  password: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name?: string | null;
}

interface LoginResponse {
  success: boolean;
  admin: AdminUser;
}

interface CreateAdminData {
  email: string;
  password: string;
  name?: string;
}

/**
 * Login function to authenticate admin users
 */
export async function loginAdmin({ email, password }: LoginCredentials): Promise<AdminUser> {
  try {
    const response = await axios.post<LoginResponse>('/api/admin/login', {
      email,
      password,
    });
    
    if (response.data.success) {
      // Store admin user data in localStorage
      localStorage.setItem('adminUser', JSON.stringify(response.data.admin));
      return response.data.admin;
    } else {
      throw new Error('Login failed');
    }
  } catch (error: any) { 
    const message = error.response?.data?.error || 'An error occurred during login';
    throw new Error(message);
  }
}

/**
 * Logout function to clear admin session
 */
export async function logoutAdmin(): Promise<void> {
  try {
    // Clear local storage
    localStorage.removeItem('adminUser');
    // Call logout API to clear cookies
    await axios.post('/api/admin/logout');
  } catch (error) {
    console.error('Logout error:', error);
  }
}

/**
 * Get the current admin user from localStorage
 * This is a fallback method - the main authentication is handled by JWT cookies
 */
export function getCurrentAdmin(): AdminUser | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const adminData = localStorage.getItem('adminUser');
  if (!adminData) {
    return null;
  }
  
  try {
    return JSON.parse(adminData) as AdminUser;
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated by making a request to the server
 * This is more reliable than just checking localStorage
 */
export async function checkAuthStatus(): Promise<AdminUser | null> {
  try {
    const response = await axios.get('/api/admin/me');
    if (response.data.success && response.data.admin) {
      // Update localStorage with fresh data
      localStorage.setItem('adminUser', JSON.stringify(response.data.admin));
      return response.data.admin;
    }
    return null;
  } catch (error) {
    // If the request fails, clear localStorage
    localStorage.removeItem('adminUser');
    return null;
  }
}

/**
 * Create a new admin user
 */
export async function createAdmin(data: CreateAdminData): Promise<AdminUser> {
  try {
    const response = await axios.post<{ success: boolean; admin: AdminUser }>('/api/admin/users', data);
    
    if (response.data.success) {
      return response.data.admin;
    } else {
      throw new Error('Failed to create admin user');
    }
  } catch (error: any) {
    const message = error.response?.data?.error || 'An error occurred while creating admin user';
    throw new Error(message);
  }
}

/**
 * Get all admin users
 */
export async function getAdmins(): Promise<AdminUser[]> {
  try {
    const response = await axios.get<{ admins: AdminUser[] }>('/api/admin/users');
    return response.data.admins;
  } catch (error: any) {
    const message = error.response?.data?.error || 'An error occurred while fetching admin users';
    throw new Error(message);
  }
} 