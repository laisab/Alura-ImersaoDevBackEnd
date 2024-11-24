import 'dotenv/config'; // Carrega as variáveis de ambiente do arquivo .env
import { ObjectId } from "mongodb"; // Importa a classe ObjectId para trabalhar com IDs do MongoDB
import conectarAoBanco from "../config/dbConfig.js"; // Importa a função para conectar ao banco de dados

// Conecta ao banco de dados utilizando a string de conexão definida na variável de ambiente STRING_CONEXAO
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

// Função assíncrona para buscar todos os posts do banco de dados
export async function getTodosPosts(){
    // Seleciona o banco de dados "imersao"
    const db = conexao.db("imersao");
    // Seleciona a coleção "posts" dentro do banco de dados
    const colecao = db.collection("posts");
    // Busca todos os documentos da coleção e os retorna como um array
    return colecao.find().toArray();
}

// Função assíncrona para criar um novo post no banco de dados
export async function criarPost(novoPost) {
    // Seleciona o banco de dados "imersao"
    const db = conexao.db("imersao");
    // Seleciona a coleção "posts"
    const colecao = db.collection("posts");
    // Insere o novoPost na coleção e retorna o resultado da operação
    return colecao.insertOne(novoPost);
}

// Função assíncrona para atualizar um post no banco de dados
export async function atualizarPost(id, novoPost) {
    // Seleciona o banco de dados "imersao"
    const db = conexao.db("imersao");
    // Seleciona a coleção "posts"
    const colecao = db.collection("posts");
    // Converte o ID da string para um objeto ObjectId
    const objID = ObjectId.createFromHexString(id);
    // Atualiza o documento com o ID correspondente, utilizando o operador $set para definir os novos valores
    return colecao.updateOne({_id: new ObjectId(objID)}, {$set:novoPost});
}
