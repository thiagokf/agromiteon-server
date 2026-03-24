require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// config do mongo
const mongoURI =process.env.MONGO_URI; 

mongoose.connect(mongoURI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// modelo de dados
const LeadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now }
});

const Lead = mongoose.model('Lead', LeadSchema);

app.post('/', (req, res) =>{
    res.status(200).send("servidor funcionando")
})

// rota para newsletter
app.post('/newsletter', async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ success: false, message: "Campos obrigatórios faltando." });
    }

    try {
        const newLead = new Lead({ name, email });
        await newLead.save();
        console.log(`Assinante salvo: ${email}`);
        
        return res.status(201).json({ 
            success: true, 
            message: "✓ Inscrição realizada com sucesso!" 
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: "Este e-mail já está cadastrado." 
            });
        }
        console.error("Erro no banco:", error);
        return res.status(500).json({ success: false, message: "Erro interno no servidor." });
    }
});

const PORT = process.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
    Servidor rodando na porta ${PORT}
    `);
});