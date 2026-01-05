const axios = require('axios');
const bcrypt = require('bcrypt');

const jsonServer = require('../api.externa');

const getUserLogin = async (req, res) => {

    const { email, password } = req.query;

    // Se não há email/password, a requisição é inválida para a busca.
    if (!email || !password) {

        return res.status(400).json({ message: 'Email e senha devem ser passados como query parameters.' });
    }

    try {
        const response = await jsonServer.get('/users', {});

        const foundUsers = response.data;

        // Buscar usuário por email
        const user = foundUsers.find(u => u.email === email);
        
        if (!user) {
            return res.status(401).json({ email: 'Email ou senha incorretos!' });
        }

        // Verificar senha com bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ email: 'Email ou senha incorretos!' });
        }

        // Remover senha para não devolver para o front por segurança
        const { password: _, ...userWithoutPassword } = user;
        
        return res.status(200).json([userWithoutPassword]);
 
    } catch (error) {
        
        if (error.response) {

            return res
            .status(error.response.status)
            .json({ message: error.response.data.message || 'Erro ao buscar dados no servidor de dados.',
                error_details: error.response.data
            });
        }
        return res.status(500).json({ 
            message: 'Ocorreu o seguinte erro ao validar os dados de login: ' + error.message,
            error: error.message,
        });
    }
};

const getUser = async(req, res) => {
    
    const usersActive = req.query.isActive ==='true';

    try{

        const response = await jsonServer.get('/users');

        let users = response.data;

        if(req.query.isActive !== undefined){

            users = users.filter(u => u.isActive === usersActive);
        }

        return res.status(200).json(users); 

    }catch(error){
        if (error.response) {

            return res
            .status(error.response.status)
            .json({ message: error.response.data.message || 'Erro ao buscar dados no servidor de dados.',
                error_details: error.response.data
            });
        }
        return res.status(500).json({ 
            message: 'Ocorreu o seguinte erro ao buscar os usuários: ' + error.message,
            error: error.message,
        });
    }

}

const getUserId = async(req, res) => {
    const { id } = req.params;

    if(!id){
        return res
            .status(400)
            .json({message: `O parâmetro "id" deve ser informado!`});
    }

    try{

        const response = await jsonServer.get('/users', id);

        const user = response.data;

        const userFilter = user.filter(u =>(u.id === id));

        return res.status(200).json(userFilter);

    }catch(error){

        if (error.response) {

            return res
            .status(error.response.status)
            .json({ message: error.response.data.message || 'Erro ao buscar dados no servidor de dados.',
                error_details: error.response.data
            });
        }
        return res.status(500).json({ 
            message: 'Ocorreu o seguinte erro ao buscar o usuário: ' + error.message,
            error: error.message,
        });
    }

}


const postUser = async(req, res)=> {
    const {name, username, email, password, role }  = req.body;
    const user = req.body;

    // username é opcional, será gerado do email se não fornecido
    if(!name || !email || !password || !role){
        return res.status(400).json({
            message: "As seguintes informações são obrigatórias: name, email, password e role"
        });
    }

    // Se username não fornecido, usar parte do email
    if (!username) {
        user.username = email.split('@')[0];
    }

    try{
        
        const response = await jsonServer.post('/users', user);
         
        userCreated = response.data;

        res.status(200).json({userCreated})
    }catch(error){
        
        if (error.response) {

            return res
            .status(error.response.status)
            .json({ message: error.response.data.message || 'Erro ao se conectar com o servidor de dados.',
                error_details: error.response.data
            });
        }
        return res.status(500).json({ 
            message: 'Ocorreu o seguinte erro ao cadastrar um usuário: ' + error.message,
            error: error.message,
        });

    }

}  

const putUser = async(req, res) => {
    
    const { id } = req.params;
    const dadosUpdate = req.body;

    if(!id){
        return res
            .status(400)
            .json({message: `O parâmetro "id" do usuário deve ser informado!`});
    }

    try{

         const response = await jsonServer.put(`/users/${id}`, dadosUpdate);
         
         const updateUser = response.data;
         
         return res.status(200).json({
            message: `Usuário ${id} alterado com sucesso!`,
            user: updateUser
        });

    }catch(error){
        
        if (error.response) {

            return res
            .status(error.response.status)
            .json({ message: error.response.data.message || 'Erro ao se conectar com o servidor de dados.',
                error_details: error.response.data
            });
        }
        return res.status(500).json({ 
            message: 'Ocorreu o seguinte erro ao alterar um usuário: ' + error.message,
            error: error.message,
        });

    }

}

const deleteUser = async(req, res) => {
    const { id } = req.params;

    if(!id){
        
        return res.status(400).json({message: `Obrigatório informar o "id" do usuário!`}); 
    }

    try{
            const response = await jsonServer.delete(`/users/${id}`);

            const userExcluded = response.data;

            return res
                .status(200)
                .json({
                    message: `Usuário de id: ${userExcluded.id} excluído com sucesso!`,
                    user: userExcluded
                });

    }catch(error){
        
        if (error.response) {

            return res
            .status(error.response.status)
            .json({ message: error.response.data.message || 'Erro ao se conectar com o servidor de dados.',
                error_details: error.response.data
            });
        }
        return res.status(500).json({ 
            message: 'Ocorreu o seguinte erro ao excluir um usuário: ' + error.message,
            error: error.message,
        });
    }
}
module.exports = { getUserLogin, 
                   getUser,
                   getUserId, 
                   postUser,
                   putUser, 
                   deleteUser};
