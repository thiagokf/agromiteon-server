const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// rota para o html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Rota temporária para ver os inscritos
app.get('/admin/leads', async (req, res) => {
    try {
        const leads = await Lead.find(); // Busca todos os registros
        res.json(leads);
    } catch (error) {
        res.status(500).send("Erro ao buscar dados");
    }
});

// config do mongo
require('dotenv').config()
const mongoURI = process.env.MONGO_URI; 

mongoose.connect(mongoURI)
  .then(() => console.log('✓ Conectado ao MongoDB com sucesso!'))
  .catch(err => console.error('x Erro ao conectar ao MongoDB:', err));

// modelo de dados
const LeadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now }
});

const Lead = mongoose.model('Lead', LeadSchema);

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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`
    =========================================
    Servidor rodando na porta ${PORT}
    Acesse: http://localhost:${PORT}
    =========================================
    `);
});