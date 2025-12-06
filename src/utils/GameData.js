/**
 * Gerenciador de dados do jogo
 * Carrega perguntas, gerencia pontuação e persistência
 */
export class GameData {
    constructor() {
        this.perguntas = [];
        this.perguntaAtual = 0;
        this.pontuacao = 0;
        this.perguntasRespondidas = [];
        this.config = this.loadConfig();
        this.nomeJogador = this.loadNomeJogador();
    }
    
    async loadPerguntas() {
        try {
            const response = await fetch('data/perguntas.json');
            const data = await response.json();
            this.perguntas = this.shuffleArray([...data.perguntas]);
            return this.perguntas;
        } catch (error) {
            console.error('Erro ao carregar perguntas:', error);
            return [];
        }
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    getPerguntaAtual() {
        if (this.perguntaAtual < this.perguntas.length) {
            return this.perguntas[this.perguntaAtual];
        }
        return null;
    }
    
    responderPergunta(respostaIndex) {
        const pergunta = this.getPerguntaAtual();
        if (!pergunta) return null;
        
        const correta = respostaIndex === pergunta.resposta;
        if (correta) {
            this.pontuacao++;
        }
        
        this.perguntasRespondidas.push({
            pergunta: pergunta,
            resposta: respostaIndex,
            correta: correta
        });
        
        this.perguntaAtual++;
        
        return {
            correta: correta,
            explicacao: pergunta.explicacao
        };
    }
    
    resetJogo() {
        this.perguntaAtual = 0;
        this.pontuacao = 0;
        this.perguntasRespondidas = [];
        // Não embaralhar novamente - as perguntas já foram selecionadas
    }
    
    getResultado() {
        const total = this.perguntasRespondidas.length;
        const porcentagem = total > 0 ? Math.round((this.pontuacao / total) * 100) : 0;
        
        return {
            pontuacao: this.pontuacao,
            total: total,
            porcentagem: porcentagem
        };
    }
    
    loadConfig() {
        const saved = localStorage.getItem('quimicaConfig');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            som: true,
            musica: true,
            dificuldade: 'todos'
        };
    }
    
    saveConfig() {
        localStorage.setItem('quimicaConfig', JSON.stringify(this.config));
    }
    
    getConfig() {
        return this.config;
    }
    
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.saveConfig();
    }
    
    loadNomeJogador() {
        const saved = localStorage.getItem('quimicaNomeJogador');
        return saved || '';
    }
    
    saveNomeJogador(nome) {
        this.nomeJogador = nome;
        localStorage.setItem('quimicaNomeJogador', nome);
    }
    
    getNomeJogador() {
        return this.nomeJogador || 'Jogador';
    }
    
    saveProgresso(nomeJogador, pontuacao, total, perguntasRespondidas) {
        const progresso = {
            nome: nomeJogador,
            pontuacao: pontuacao,
            total: total,
            porcentagem: total > 0 ? Math.round((pontuacao / total) * 100) : 0,
            data: new Date().toISOString(),
            perguntas: perguntasRespondidas
        };
        
        // Carregar histórico existente
        const historico = this.loadHistorico();
        historico.push(progresso);
        
        // Manter apenas os últimos 10 resultados
        if (historico.length > 10) {
            historico.shift();
        }
        
        localStorage.setItem('quimicaProgresso', JSON.stringify(historico));
    }
    
    loadHistorico() {
        const saved = localStorage.getItem('quimicaProgresso');
        return saved ? JSON.parse(saved) : [];
    }
    
    getMelhorResultado(nomeJogador) {
        const historico = this.loadHistorico();
        const resultadosJogador = historico.filter(h => h.nome === nomeJogador);
        
        if (resultadosJogador.length === 0) return null;
        
        return resultadosJogador.reduce((melhor, atual) => {
            return atual.pontuacao > melhor.pontuacao ? atual : melhor;
        }, resultadosJogador[0]);
    }
}

