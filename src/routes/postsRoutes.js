import express from "express"; // Importa o framework Express
import multer from "multer"; // Importa o middleware Multer para lidar com uploads de arquivos
import cors from "cors"; // Importa o middleware CORS para habilitar requisições de origens diferentes
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost} from "../controllers/postsController.js"; // Importa os controllers de posts

// Configura as opções do CORS, permitindo requisições da origem "http://localhost:8000"
const corsOptions = {
    origin: "http://localhost:8000",
    optionsSuccessStatus: 200
};

// Configura o armazenamento do Multer para salvar os arquivos na pasta 'uploads/' com o nome original
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Define o diretório de destino
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Define o nome do arquivo
    }
})

// Cria uma instância do Multer com a configuração de armazenamento e um destino temporário
const upload = multer({ dest: "./uploads" , storage});

// Define as rotas da aplicação
const routes = (app) => {
    // Middleware para habilitar o recebimento de dados no formato JSON
    app.use(express.json());
    // Middleware para habilitar o CORS com as opções definidas
    app.use(cors(corsOptions));

    // Rota GET para listar todos os posts (chama o controller listarPosts)
    app.get("/posts", listarPosts);

    // Rota POST para criar um novo post (chama o controller postarNovoPost)
    app.post("/posts", postarNovoPost);

    // Rota POST para upload de imagem (chama o controller uploadImagem)
    // Utiliza o middleware 'upload.single("imagem")' para lidar com o upload de um único arquivo com o nome do campo "imagem"
    app.post("/upload", upload.single("imagem"), uploadImagem);

    // Rota PUT para atualizar um post (chama o controller atualizarNovoPost)
    // O ':id' na rota define um parâmetro de rota para o ID do post
    app.put("/upload/:id", atualizarNovoPost);
}

// Exporta a função de rotas
export default routes;
