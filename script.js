const entryScreen = document.getElementById('entry-screen');
const showScreen = document.getElementById('show-screen');
const startBtn = document.getElementById('start-btn');
const music = document.getElementById('bg-music');
const photoContainer = document.getElementById('photo-container');
const lyricsText = document.querySelector('.current-lyric');

// CONFIGURAÇÃO - Washington, altere aqui!
const config = {
    photoCount: 24,
    // Intervalo de troca de fotos (em milissegundos)
    // Recomendação Antigravity: 9.5 segundos para 24 fotos (Música de 3:49)
    photoInterval: 9500,
    // Letras da música com o tempo em segundos
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
let photoIntervalId;

function init() {
    startBtn.addEventListener('click', startShow);
}

async function startShow() {
    // 1. Tenta colocar em Tela Cheia (melhor para TV)
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    }

    // 2. Transição de telas
    entryScreen.classList.remove('active');
    showScreen.classList.add('active');

    // 3. Play na música
    music.play().catch(err => console.log("Erro ao tocar música: ", err));

    // 4. Inicia carrossel de fotos (detectando extensões na hora)
    await setupPhotos();
    startPhotoCarousel();

    // 5. Inicia sincronização de letras
    startLyricsSync();
}

async function setupPhotos() {
    photoContainer.innerHTML = '';
    const extensions = ['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'PNG', 'webp', 'HEIC', 'heic'];
    const loadingPromises = [];

    for (let i = 1; i <= config.photoCount; i++) {
        const slide = document.createElement('div');
        slide.className = `photo-slide ${i === 1 ? 'active' : ''}`;
        photoContainer.appendChild(slide);

        // Função interna para testar extensões em paralelo para cada foto
        const loadPhoto = async (index, element) => {
            let found = false;
            for (const ext of extensions) {
                const imgPath = `assets/img/${index}.${ext}`;
                const img = await checkImageAndGetDims(imgPath);
                if (img) {
                    element.style.backgroundImage = `url('${imgPath}')`;
                    
                    // INTELIGÊNCIA DE ORIENTAÇÃO
                    // Se a altura for maior que a largura (Vertical), usa 'contain'
                    if (img.naturalHeight > img.naturalWidth) {
                        element.style.backgroundSize = 'contain';
                    } else {
                        element.style.backgroundSize = 'cover';
                    }

                    found = true;
                    if (ext.toLowerCase() === 'heic') {
                        console.error(`AVISO: A foto ${index} está em formato HEIC. Converta para JPG!`);
                    }
                    break;
                }
            }
            if (!found) {
                console.error(`ERRO: Foto ${index} não encontrada!`);
                element.style.backgroundColor = '#000';
            }
        };

        loadingPromises.push(loadPhoto(i, slide));
    }

    // Aguarda todas as fotos serem validadas simultaneamente
    await Promise.all(loadingPromises);
    console.log("Sistema de fotos pronto para a missão!");
}

function checkImageAndGetDims(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = url;
    });
}

function startPhotoCarousel() {
    const slides = document.querySelectorAll('.photo-slide');
    if (slides.length <= 1) return;

    photoIntervalId = setInterval(() => {
        const prevSlide = slides[currentPhotoIndex];
        prevSlide.classList.add('last-active');
        prevSlide.classList.remove('active');

        currentPhotoIndex = (currentPhotoIndex + 1) % slides.length;
        const nextSlide = slides[currentPhotoIndex];
        nextSlide.classList.add('active');

        setTimeout(() => {
            prevSlide.classList.remove('last-active');
        }, 2000);
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
                    lyricsText.style.fontSize = '1.5rem';
                } else if (length > 45) {
                    lyricsText.style.fontSize = '2rem';
                } else {
                    lyricsText.style.fontSize = '2.5rem';
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
