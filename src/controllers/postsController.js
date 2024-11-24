import fs from "fs";
import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModel.js";
import gerarDescricaoComGemini from "../services/geminiService.js";

// Controller para listar todos os posts
export async function listarPosts(req, res){
    // Chama a função do model para buscar todos os posts do banco de dados
    const posts = await getTodosPosts();
    // Retorna os posts encontrados como resposta JSON com status 200 (OK)
    res.status(200).json(posts);
} 

// Controller para criar um novo post
export async function postarNovoPost(req, res){
    // Recebe os dados do novo post a partir do corpo da requisição
    const novoPost = req.body;

    try{
        // Chama a função do model para criar o post no banco de dados
        const postCriado = await criarPost(novoPost);
        // Retorna o post criado como resposta JSON com status 200 (OK)
        res.status(200).json(postCriado);
    }catch(erro){
        // Em caso de erro, imprime a mensagem de erro no console
        console.error(erro.message);
        // Retorna uma mensagem de erro como resposta JSON com status 500 (Internal Server Error)
        res.status(500).json({"Erro":"Falha na requisição"});
    }
}

// Controller para fazer upload de uma imagem
export async function uploadImagem(req, res){
    // Cria um objeto novoPost com a URL da imagem, descrição vazia e alt vazio
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname, // Nome original do arquivo de imagem
        alt: ""
    };

    try{
        // Chama a função do model para criar um post com os dados da imagem
        const postCriado = await criarPost(novoPost);
        // Define o novo nome do arquivo de imagem com o ID do post inserido e a extensão .png
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
        // Renomeia o arquivo de imagem carregado para o novo nome
        fs.renameSync(req.file.path, imagemAtualizada);
        // Retorna o post criado como resposta JSON com status 200 (OK)
        res.status(200).json(postCriado);
    }catch(erro){
        // Em caso de erro, imprime a mensagem de erro no console
        console.error(erro.message);
        // Retorna uma mensagem de erro como resposta JSON com status 500 (Internal Server Error)
        res.status(500).json({"Erro":"Falha na requisição"});
    }
}

// Controller para atualizar um post existente
export async function atualizarNovoPost(req, res){
    // Extrai o ID do post a ser atualizado dos parâmetros da requisição
    const id = req.params.id;
    // Constrói a URL da imagem com base no ID do post
    const urlImagem = `http://localhost:3000/${id}.png`;
    

    try{
        // Lê o arquivo de imagem correspondente ao ID do post
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
        // Chama a função gerarDescricaoComGemini para gerar uma descrição da imagem
        const descricao = await gerarDescricaoComGemini(imgBuffer);

        // Cria um objeto post com a URL da imagem, a descrição gerada e o texto alternativo (alt) recebido do corpo da requisição
        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        };

        // Chama a função do model para atualizar o post no banco de dados
        const postCriado = await atualizarPost(id, post);
        // Retorna o post atualizado como resposta JSON com status 200 (OK)
        res.status(200).json(postCriado);
    }catch(erro){
        // Em caso de erro, imprime a mensagem de erro no console
        console.error(erro.message);
        // Retorna uma mensagem de erro como resposta JSON com status 500 (Internal Server Error)
        res.status(500).json({"Erro":"Falha na requisição"});
    }
}
