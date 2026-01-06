const axios = require('axios');
const jsonServer = require('../api.externa');

const getPosts = async(req, res) => {
    
    const isExcludedRequested = req.query.excluded === 'true';
    const { userId } = req.query;
    
    try{
        const response = await jsonServer.get('/posts');
        let posts  = response.data;

        // Mapear _id para id (compatibilidade MongoDB)
        posts = posts.map(post => {
            const { _id, __v, ...rest } = post;
            return {
                ...rest,
                id: _id || post.id
            };
        });

        if(req.query.excluded !== undefined){
            posts = posts.filter(p => p.excluded === isExcludedRequested);
        }

        // Filtrar por userId se fornecido (para professores verem apenas seus posts)
        if(userId){
            posts = posts.filter(p => p.userId === userId || p.userId === String(userId));
        }

        return res.status(200).json({posts});

    }catch(error){

        if (error.response) {

            return res
            .status(error.response.status)
            .json({ message: error.response.data.message || 'Erro ao buscar dados no servidor de dados.',
                error_details: error.response.data
            });
        }
        return res.status(500).json({ 
            message: 'Ocorreu o seguinte erro ao buscar os POSTS: ' + error.message,
            error: error.message,
        });
    }
}

const getPostId = async(req, res) => {
    const { id } = req.params;

    if(!id){
        return res
            .status(400)
            .json({message:`O parâmetro "id" deve ser informado!`})
    }
    try{

        const response = await jsonServer.get(`/posts/${id}`);
        let post = response.data;
        
        // Mapear _id para id (compatibilidade MongoDB)
        if (post._id && !post.id) {
            const { _id, __v, ...rest } = post;
            post = {
                ...rest,
                id: _id
            };
        }
        
        return res.status(200).json(post);

    }catch(error){

        if (error.response) {

            return res
            .status(error.response.status)
            .json({ message: error.response.data.message || 'Erro ao buscar dados no servidor de dados.',
                error_details: error.response.data
            });

        }
        
        return res.status(500).json({ 
            message: 'Ocorreu o seguinte erro ao buscar um POST: ' + error.message,
            error: error.message,
        });
    }
}

const postPosts = async(req, res)=> {
    const {title, author, content, userId, urlImage} = req.body;
    const post = req.body;

    if(!title || !author || !content || !userId || !urlImage){
        console.error('[PostResource] Campos faltando:', { 
            title: !!title, 
            author: !!author, 
            content: !!content, 
            userId: !!userId, 
            urlImage: !!urlImage 
        });
        
        return res
            .status(400)
            .json({message: "Título, autor, conteúdo, usuário e url da imagem são obrigatórios"});
    }
    try{
        
        const response = await jsonServer.post('/posts', post);
         
        postCreated = response.data;
        
        console.log('[PostResource] ✅ Post criado:', postCreated.id || postCreated._id);

        res.status(200).json({postCreated})
    }catch(error){
        
        if (error.response) {

            return res
            .status(error.response.status)
            .json({ message: error.response.data.message || 'Erro na comunicação com o servidor de dados (JSON-Server).',
                error_details: error.response.data
            });
        }
        return res.status(500).json({ 
            message: 'Ocorreu o seguinte erro ao cadastrar um POST: ' + error.message,
            error: error.message,
        });
    }

}

const putPost = async(req, res) => {
    const { id } = req.params;
    const postUpdate = req.body;

    if(!id){
        return res 
            .status(400)
            .json({message: `O parâmetro "id" do post deve ser informado!`});
    }

    try{

        const response = await jsonServer.put(`/posts/${id}`, postUpdate);

        const postUpdated = response.data;

        return res
            .status(200)
            .json({message: `O post de id: ${postUpdated.id}, foi alterado com sucesso!`,
                   post: postUpdated });
            
    }catch(error){

        if(error.response){

            let _message = 'Erro na comunicação com o servidor de dados (JSON-Server).';

            if(error.response.data == 'Not Found'){
                _message = 'Post não encontrado através do id informado!';
            }

            return res
                .status(error.response.status)
                .json({message: error.response.data.message || _message,
                       error_details: error.response.data 
                });
        }

        return res
            .status(500).json({
                message: 'Ocorreu o seguinte erro ao alterar um POST: ' + error.message,
                error: error.message,
            })

    }

}

const deletePost = async(req, res) => {
    const { id } = req.params;

    if(!id){
        return res 
            .status(400)
            .json({message: `O parâmetro "id" do post deve ser informado!`});
    }

    try{ 
            const response = await jsonServer.delete(`/posts/${id}`);

            const postDeleted = response.data;

            return res
                .status(200)
                .json({message: "Post excluído com sucesso!",
                       post: postDeleted
                });
         

    }catch(error){

        if(error.response){

            let _message = 'Erro na comunicação com o servidor de dados (JSON-Server).';
            
            if(error.response.data == 'Not Found'){
                _message = 'Post não encontrado através do id informado!';
            }

            return res 
                .status(error.response.status)
                .json({message: error.response.data.message || _message,
                       error_details: error.response.data
                });
        }
            return res
                .status(500)
                .json({message: 'Ocorreu um erro ao excluir Post' + error.message,
                       error: error.message 
                });

    }


}

module.exports = {getPosts,
                  getPostId, 
                  postPosts,
                  putPost,
                  deletePost
                  };