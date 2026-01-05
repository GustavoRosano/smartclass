/**
 * User Service
 * 
 * Camada de serviço para lógica de negócios relacionada a usuários
 * Separação de responsabilidades: Service -> Resource -> External API
 */

const jsonServer = require('../api.externa');
const bcrypt = require('bcrypt');

/**
 * Buscar usuário por ID
 */
async function getUserById(userId) {
  try {
    const response = await jsonServer.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Buscar usuário por email
 */
async function getUserByEmail(email) {
  try {
    const response = await jsonServer.get('/users', {
      params: { email }
    });
    
    const users = response.data;
    return users.find(u => u.email === email) || null;
  } catch (error) {
    console.error('[UserService] Erro ao buscar usuário por email:', error);
    return null;
  }
}

/**
 * Buscar todos os usuários
 */
async function getAllUsers(filters = {}) {
  try {
    const response = await jsonServer.get('/users', { params: filters });
    return response.data;
  } catch (error) {
    console.error('[UserService] Erro ao buscar usuários:', error);
    throw new Error('Erro ao buscar usuários');
  }
}

/**
 * Criar novo usuário
 */
async function createUser(userData) {
  try {
    // Validar se email já existe
    const existingUser = await getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Preparar dados do usuário
    const newUser = {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'aluno',
      mobilePhone: userData.mobilePhone || null,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Criar no banco
    const response = await jsonServer.post('/users', newUser);
    
    // Remover senha da resposta
    const { password, ...userWithoutPassword } = response.data;
    return userWithoutPassword;

  } catch (error) {
    console.error('[UserService] Erro ao criar usuário:', error);
    throw error;
  }
}

/**
 * Atualizar usuário
 */
async function updateUser(userId, updateData) {
  try {
    // Se está atualizando senha, fazer hash
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    updateData.updatedAt = new Date().toISOString();

    const response = await jsonServer.put(`/users/${userId}`, updateData);
    
    // Remover senha da resposta
    const { password, ...userWithoutPassword } = response.data;
    return userWithoutPassword;

  } catch (error) {
    console.error('[UserService] Erro ao atualizar usuário:', error);
    throw new Error('Erro ao atualizar usuário');
  }
}

/**
 * Deletar usuário (soft delete - apenas desativa)
 */
async function deleteUser(userId) {
  try {
    await jsonServer.put(`/users/${userId}`, {
      isActive: false,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('[UserService] Erro ao deletar usuário:', error);
    throw new Error('Erro ao deletar usuário');
  }
}

/**
 * Validar credenciais de login
 */
async function validateCredentials(email, password) {
  try {
    const user = await getUserByEmail(email);
    
    if (!user) {
      return { valid: false, error: 'Usuário não encontrado' };
    }

    if (!user.isActive) {
      return { valid: false, error: 'Conta desativada' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return { valid: false, error: 'Senha incorreta' };
    }

    // Remover senha antes de retornar
    const { password: _, ...userWithoutPassword } = user;
    
    return { valid: true, user: userWithoutPassword };

  } catch (error) {
    console.error('[UserService] Erro ao validar credenciais:', error);
    return { valid: false, error: 'Erro ao validar credenciais' };
  }
}

module.exports = {
  getUserById,
  getUserByEmail,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  validateCredentials
};
