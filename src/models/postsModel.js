import 'dotenv/config';
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js";

// Conecta ao banco de dados utilizando a string de conexão fornecida no ambiente
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

// Função assíncrona para buscar todos os posts do banco de dados
export async function getTodosPosts(){
    // Obtém o banco de dados "imersao" da conexão
    const db = conexao.db("imersao");
    // Obtém a coleção "posts" do banco de dados
    const colecao = db.collection("posts");
    // Retorna todos os documentos da coleção como um array
    return colecao.find().toArray();
}

export async function criarPost(novoPost) {
    const db = conexao.db("imersao");
    const colecao = db.collection("posts");
    return colecao.insertOne(novoPost);
}

export async function atualizarPost(id, novoPost) {
    const db = conexao.db("imersao");
    const colecao = db.collection("posts");
    const objID = ObjectId.createFromHexString(id);
    return colecao.updateOne({_id: new ObjectId(objID)}, {$set:novoPost});
}