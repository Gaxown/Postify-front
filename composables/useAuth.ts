export const useAuth = () => {
  const authToken = useCookie<string | null>('auth_token', {
    default: () => null,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30 // 30 days
  })

  const user = ref<any>(null)

  const setAuth = (token: string, userData: any) => {
    authToken.value = token
    user.value = userData
  }

  const clearAuth = () => {
    authToken.value = null
    user.value = null
  }

  const isAuthenticated = computed(() => {
    return !!authToken.value
  })

  const getAuthHeaders = () => {
    return authToken.value ? {
      'Authorization': `Bearer ${authToken.value}`
    } : {}
  }

  return {
    authToken: readonly(authToken),
    user: readonly(user),
    setAuth,
    clearAuth,
    isAuthenticated,
    getAuthHeaders
  }
} 