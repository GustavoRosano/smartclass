const axios = require('axios');
const jsonServer = axios.create({ 
    // Aponta para o JSON-Server
    baseURL: 'http://localhost:3001' 
});
 
const getUserLogin = async (req, res) => {

    const { email, password } = req.query;

    // Se não há email/password, a requisição é inválida para a busca.
    if (!email || !password) {

        return res.status(400).json({ message: 'Email e senha devem ser passados como query parameters.' });
    }

    try {
        const response = await jsonServer.get('/user', {});

        const foundUsers = response.data;

        // aplicando filtro para buscar o login recebido
        const userFilter = foundUsers.filter(u =>
            u.email === email && u.password === password
        );
        
        // removendo a senha para não devolver para o front por segurança
        const returnUser = userFilter.map(({ password, ...user }) => user); 
        
        // se nenhum login foi encotrado devolve a critica.
        if (returnUser.length === 0) {
         return res.status(401).json({ email: 'Email ou senha incorretos!' });
        }
        
        return res.status(200).json(returnUser);
 
    } catch (error) {
        
        if (error.response) {

            return res
            .status(error.response.status)
            .json({ message: error.response.data.message || 'Erro ao buscar dados no servidor de dados (JSON-Server).',
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
    
    try{

        const response = await jsonServer.get('/user');

        const users = response.data;

        return res.status(200).json(users); 

    }catch(error){
        if (error.response) {

            return res
            .status(error.response.status)
            .json({ message: error.response.data.message || 'Erro ao buscar dados no servidor de dados (JSON-Server).',
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

        const response = await jsonServer.get('/user', id);

        const user = response.data;

        const userFilter = user.filter(u =>(u.id === id));

        return res.status(200).json(userFilter);

    }catch(error){

        if (error.response) {

            return res
            .status(error.response.status)
            .json({ message: error.response.data.message || 'Erro ao buscar dados no servidor de dados (JSON-Server).',
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
    const {name, email, password, role }  = req.body;
    const user = req.body;

    if(!name || !email || !password || !role){
        
        return res.status(400).json({messsage:" As seguintes informações são obrigatórias: name, email, password e role "});
    }
    try{
        
        const response = await jsonServer.post('/user', user);
         
        userCreated = response.data;

        res.status(200).json({userCreated})
    }catch(error){
        
        if (error.response) {

            return res
            .status(error.response.status)
            .json({ message: error.response.data.message || 'Erro ao se conectar com o servidor de dados (JSON-Server).',
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

         const response = await jsonServer.put(`/user/${id}`, dadosUpdate);
         
         const updateUser = response.data;
         
         return res.status(200).json({
            message: `Usuário ${id} alterado com sucesso!`,
            user: updateUser
        });

    }catch(error){
        
        if (error.response) {

            return res
            .status(error.response.status)
            .json({ message: error.response.data.message || 'Erro ao se conectar com o servidor de dados (JSON-Server).',
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
            const response = await jsonServer.delete(`/user/${id}`);

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
            .json({ message: error.response.data.message || 'Erro ao se conectar com o servidor de dados (JSON-Server).',
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
