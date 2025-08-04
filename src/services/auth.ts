export interface AuthResponse {
  success: boolean;
  message?: string;
}

export async function login(senha: string): Promise<AuthResponse> {
  try {
    const response = await fetch('http://choperiacolorado.com.br/receitas/admin/api_cardapio_auth.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ senha })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: 'Erro na conexão com o servidor'
    };
  }
} 