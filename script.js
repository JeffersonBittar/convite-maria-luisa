// --- Interaction Logic ---
const audio = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-toggle');
const icon = musicBtn.querySelector('i');
let isPlaying = false;

function openInvitation() {
    const overlay = document.getElementById('entrance-overlay');
    const card = document.getElementById('invitation-card');
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none';
        card.classList.add('visible');
    }, 800);
    toggleMusic();
}

function toggleMusic() {
    if (isPlaying) {
        audio.pause();
        icon.classList.remove('fa-volume-up');
        icon.classList.add('fa-volume-mute');
        isPlaying = false;
    } else {
        audio.play().then(() => {
            icon.classList.remove('fa-volume-mute');
            icon.classList.add('fa-volume-up');
            isPlaying = true;
        }).catch(e => console.error("Audio Error:", e));
    }
}

// --- Gemini AI Logic (Online Only) ---
function toggleAiInput() {
    const group = document.getElementById('ai-input-group');
    const btn = document.getElementById('start-ai-btn');
    group.style.display = 'flex';
    btn.style.display = 'none';
    document.getElementById('guest-name').focus();
}

function handleEnter(e) {
    if (e.key === 'Enter') generateMermaidName();
}

async function generateMermaidName() {
    const nameInput = document.getElementById('guest-name');
    const resultBox = document.getElementById('ai-result');
    const name = nameInput.value.trim();

    if (!name) return;

    // UI Loading State
    resultBox.style.display = 'block';
    resultBox.innerHTML = '<div class="loading-bubbles"><span></span><span></span><span></span></div><p style="margin-top:5px; font-size:0.9rem; color:#666;">Consultando as conchas mágicas...</p>';

    // Esta variável será substituída pela Vercel durante o deploy.
    const apiKey = "__GEMINI_API_KEY__"; 
    
    // Alerta para o desenvolvedor se a chave não for substituída
    if (apiKey.startsWith("__GEMINI") && apiKey.endsWith("__")) {
        console.error("A chave da API do Gemini não foi substituída. Configure a variável de ambiente na Vercel.");
        resultBox.innerHTML = `<p style="color:red;">Oh não! A magia falhou. A chave da API não está configurada corretamente.</p>`;
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const prompt = `Você é um oráculo mágico do fundo do mar (estilo Disney, Pequena Sereia). O nome do convidado é "${name}". 
    Crie:
    1. Um "Nome de Sereia/Tritão" majestoso ou divertido baseado no nome dele (ex: "Marina das Marés", "João dos Corais").
    2. Uma frase curta e mágica descrevendo o poder especial dele no oceano.
    Responda em Português, tom alegre e infantil. Use emojis.
    Não use formatação Markdown pesada, apenas texto simples e quebras de linha.`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            console.error("Resposta da API não foi OK:", response);
            throw new Error(`Falha na API com status: ${response.status}`);
        }

        const data = await response.json();
        const aiText = data.candidates[0].content.parts[0].text;
        
        // Display Result
        resultBox.innerHTML = `
            <h3 style="color:var(--ariel-purple); font-family:'Great Vibes', cursive; font-size:1.8rem;">${name}, a sua identidade secreta é...</h3>
            <p style="color:var(--deep-blue); font-size:1.1rem; line-height:1.5; margin-top:10px; white-space: pre-wrap;">${aiText}</p>
            <button onclick="resetAi()" style="margin-top:15px; background:none; border:none; color:var(--primary-teal); text-decoration:underline; cursor:pointer;">Tentar outro nome</button>
        `;

    } catch (error) {
        console.error("Erro na API:", error);
        resultBox.innerHTML = `<p style="color:red;">Oh não! Um tubarão comeu o cabo da internet. Verifique sua conexão e tente novamente!</p>`;
    }
}

function resetAi() {
    document.getElementById('ai-result').style.display = 'none';
    document.getElementById('ai-input-group').style.display = 'none';
    document.getElementById('start-ai-btn').style.display = 'inline-flex';
    document.getElementById('guest-name').value = '';
}

function createBubbles() {
    const ocean = document.getElementById('ocean-background');
    if (!ocean) return; // Garante que o elemento exista
    const bubbleCount = 25;

    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        const size = Math.random() * 30 + 10 + 'px';
        bubble.style.width = size;
        bubble.style.height = size;
        bubble.style.left = Math.random() * 95 + 'vw'; /* Alterado de 100vw para 95vw para evitar overflow */
        bubble.style.animationDuration = Math.random() * 8 + 5 + 's';
        bubble.style.animationDelay = Math.random() * 5 + 's';
        ocean.appendChild(bubble);
    }
}

// Garante que o DOM está carregado antes de executar
document.addEventListener('DOMContentLoaded', () => {
    createBubbles();
});
