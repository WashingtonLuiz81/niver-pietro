const entryScreen = document.getElementById('entry-screen');
const showScreen = document.getElementById('show-screen');
const startBtn = document.getElementById('start-btn');
const music = document.getElementById('bg-music');
const photoContainer = document.getElementById('photo-container');
const lyricsText = document.querySelector('.current-lyric');

// CONFIGURAÇÃO - Washington, altere aqui!
const config = {
    // Adicione os nomes dos arquivos de fotos que você colocar na pasta assets/img/
    // Exemplo: ['foto1.jpg', 'foto2.jpg']
    photos: [
        '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', 
        '9.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', 
        '17.jpg', '18.jpg', '19.jpg', '20.jpg', '21.jpg', '22.jpg', '23.jpg', '24.jpg'
    ],
    // Intervalo de troca de fotos (em milissegundos)
    // Recomendação Antigravity: 9.5 segundos para 24 fotos (Música de 3:49)
    photoInterval: 9500,
    // Letras da música com o tempo em segundos (estimado)
    // Você pode ajustar o 'time' para bater com a música
    lyrics: [
        { time: 5, text: "Iniciando Protocolo: Surpresa do Pietro" },
        { time: 13, text: "Desde o começo um sonho guardado no olhar" },
        { time: 18, text: "O desejo de ser mãe difícil de explicar" },
        { time: 26, text: "Mesmo com a dor tentando te fazer parar" },
        { time: 33, text: "Você seguiu firme sem deixar de acreditar" },
        { time: 42, text: "Teve momentos que o mundo pesou demais" },
        { time: 47, text: "E o medo disse que talvez não viria mais" },
        { time: 55, text: "Mas dentro de você havia algo maior" },
        { time: 61, text: "Uma força que venceu toda a dor" },
        { time: 69, text: "E então chegou trazendo luz pro seu viver" },
        { time: 75, text: "O seu menino razão do seu renascer" },
        { time: 83, text: "4 aninhos de um amor que só cresce assim" },
        { time: 90, text: "No dia 6 de maio mudou tudo enfim" },
        { time: 97, text: "Eu vejo você em cada gesto de cuidado" },
        { time: 103, text: "Num abraço apertado no jeito dedicado" },
        { time: 110, text: "Mesmo cansada você nunca deixa faltar" },
        { time: 118, text: "Amor de mãe que não cansa de lutar" },
        { time: 124, text: "Você superou o que ninguém nem viu" },
        { time: 129, text: "Carregou no peito tudo o que sentiu" },
        { time: 132, text: "E hoje é exemplo é força é coração" },
        { time: 136, text: "É tudo pro seu filho em qualquer situação" },
        { time: 143, text: "Viviane você é força é proteção" },
        { time: 149, text: "É o porto seguro do seu filho é direção" },
        { time: 157, text: "Uma mãe de verdade que nunca desistiu" },
        { time: 163, text: "O teu amor é o maior presente que ele já viu" },
        { time: 170, text: "Dos olhos dele dá pra ver quem você é" },
        { time: 175, text: "Todo esse amor toda essa fé" },
        { time: 178, text: "Você é abrigo é colo é razão" },
        { time: 182, text: "É o mundo inteiro dentro da sua mão" },
        { time: 188, text: "Viviane você é força é proteção" },
        { time: 195, text: "É o porto seguro do seu filho é direção" },
        { time: 202, text: "Uma mãe de verdade que nunca desistiu" },
        { time: 209, text: "O teu amor é o maior presente que ele já viu" }
    ]
};

let currentPhotoIndex = 0;

function init() {
    startBtn.addEventListener('click', startShow);
}

function startShow() {
    // 1. Tenta colocar em Tela Cheia (melhor para TV)
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    }

    // 2. Transição de telas
    entryScreen.classList.remove('active');
    showScreen.classList.add('active');

    // 3. Play na música
    music.play().catch(err => console.log("Erro ao tocar música: ", err));

    // 4. Inicia carrossel de fotos
    setupPhotos();
    startPhotoCarousel();

    // 5. Inicia sincronização de letras
    startLyricsSync();
}

function setupPhotos() {
    config.photos.forEach((src, index) => {
        const div = document.createElement('div');
        div.className = `photo-slide ${index === 0 ? 'active' : ''}`;
        div.style.backgroundImage = `url('assets/img/${src}')`;
        photoContainer.appendChild(div);
    });
}

let photoIntervalId;

function startPhotoCarousel() {
    const slides = document.querySelectorAll('.photo-slide');
    if (slides.length <= 1) return;

    photoIntervalId = setInterval(() => {
        slides[currentPhotoIndex].classList.remove('active');
        currentPhotoIndex = (currentPhotoIndex + 1) % slides.length;
        slides[currentPhotoIndex].classList.add('active');
    }, config.photoInterval);
}

function startLyricsSync() {
    // Inicializa com a primeira letra visível se houver
    lyricsText.classList.add('lyric-visible');

    music.addEventListener('timeupdate', () => {
        const currentTime = music.currentTime;
        const currentLyric = config.lyrics
            .filter(l => l.time <= currentTime)
            .pop();

        if (currentLyric && lyricsText.innerText !== currentLyric.text) {
            // Efeito de transição suave
            lyricsText.classList.remove('lyric-visible');
            lyricsText.classList.add('lyric-hidden');

            setTimeout(() => {
                // Ajusta o tamanho da fonte baseado no tamanho do texto
                const length = currentLyric.text.length;
                if (length > 80) {
                    lyricsText.style.fontSize = '1.6rem';
                } else if (length > 45) {
                    lyricsText.style.fontSize = '2.2rem';
                } else {
                    lyricsText.style.fontSize = '3rem';
                }

                lyricsText.innerText = currentLyric.text;
                lyricsText.classList.remove('lyric-hidden');
                lyricsText.classList.add('lyric-visible');
            }, 600); // Sincronizado com o tempo do CSS
        }
    });
    // Monitora o fim da música para o Grand Finale
    music.addEventListener('ended', endShow);
}

function endShow() {
    console.log("Iniciando Grand Finale com Efeitos...");
    
    // 1. Para o carrossel de fotos
    if (photoIntervalId) clearInterval(photoIntervalId);

    // 2. Efeito de Flash
    const flash = document.createElement('div');
    flash.className = 'flash-effect animate-flash';
    document.body.appendChild(flash);

    // 3. Troca de telas no auge do brilho
    setTimeout(() => {
        const app = document.getElementById('app');
        const finalScreen = document.getElementById('final-screen');
        
        app.style.display = 'none';
        finalScreen.classList.add('active');
        
        // 4. Cria a chuva de partículas
        createParticles();

        // Limpa o flash
        setTimeout(() => flash.remove(), 1000);
    }, 400);
}

function createParticles() {
    const container = document.querySelector('.celebration-particles');
    if (!container) return;

    for (let i = 0; i < 50; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        
        // Posição aleatória
        p.style.left = Math.random() * 100 + 'vw';
        p.style.top = -Math.random() * 20 + 'vh';
        
        // Tamanho e velocidade aleatórios
        const size = Math.random() * 6 + 2 + 'px';
        p.style.width = size;
        p.style.height = size;
        p.style.animationDuration = Math.random() * 3 + 2 + 's';
        p.style.animationDelay = Math.random() * 5 + 's';
        p.style.opacity = Math.random();
        
        container.appendChild(p);
    }
}

// Iniciar app
init();
