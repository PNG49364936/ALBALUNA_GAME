## Objet : Créer une app qui permettent à un enfant d'apprendre les couleurs,les animaux et "les fruits et légumes"
## Fonctionalités :
 L'enfant sélectionne une categorie "couleurs", "animaux" et "fruits et légumes". L'app demande "quelle est cette coulleur" ou "quel animal". 
Si réponse OK, l'app félicite l'enfant puis visuel style feu d'artifice.
Si réponse pas OK, l'app dit "tu t es trompé, quel animal ou couleur?".Aprés 3 erreurs, l app donne la bonne réponse.
il faut seulement les couleurs primaires. il faut 15 animaux simples (photos) et 15 fruits et légumes simples (photos).
Les couleurs foivent être proposées en un cercle de 10 centimetres environ.
Les images doivent être d environ 10 centimètres de haut et 10 cms larges.
A chaque ouverture de l'app,  le compteur "nombre de questions" et "score se remet à ZERO"
### Technologies à utiliser.
- HTML
- Tailwind CSS - DaisyUI 
- Lottie
- Freepik Kids, OpenDoodles ou unDraw 
- Howler.js (pour effets sonores)
- ElevenLabs ou Google Cloud Text-to-Speech (pour les voix) (Web Speech API  est un peu basique)
- envisager React + Vite si nécessaire

- NETLIFY + https://dancing-khapse-23b273.netlify.app/
- npm run build pour 
( Etape 1 : npm run build transforme ton code React en simples fichiers HTML/CSS/JS (dans un dossier dist/)                                                       
                                                                                                                                                         
  Etape 2 : tu deposes ces fichiers sur un service d'hebergement gratuit. Le plus simple :                                                                        

  - Netlify : tu glisses-deposes le dossier dist/ sur netlify.com et tu obtiens une URL du type decouverte-alba.netlify.app - gratuit, zero config
  - Vercel : pareil, gratuit

  Apres ca, n'importe qui avec le lien peut utiliser l'app depuis son telephone ou ordinateur.

  On fera ca quand l'app sera finalisee. Pour l'instant on continue a developper sur localhost:5173.)

#### Front end.
  
le style de l'app avec code source ci-dessous est OK


pour avoir une idée de ce que je veux, code source d'une app basique (app à beaucoup améliorer):

html<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Découverte - Couleurs & Animaux</title>
<link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@600;800&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #FFF8E7;
    --card: #ffffff;
    --shadow: 0 8px 30px rgba(0,0,0,0.08);
    --radius: 24px;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Nunito', sans-serif;
    background: var(--bg);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  /* Floating background shapes */
  .bg-shapes {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
  }
  .bg-shapes span {
    position: absolute;
    border-radius: 50%;
    opacity: 0.12;
    animation: floaty 8s ease-in-out infinite alternate;
  }
  .bg-shapes span:nth-child(1) { width: 200px; height: 200px; background: #FF6B6B; top: -40px; left: -60px; animation-delay: 0s; }
  .bg-shapes span:nth-child(2) { width: 160px; height: 160px; background: #4ECDC4; top: 20%; right: -40px; animation-delay: 1s; }
  .bg-shapes span:nth-child(3) { width: 240px; height: 240px; background: #FFD93D; bottom: -60px; left: 30%; animation-delay: 2s; }
  .bg-shapes span:nth-child(4) { width: 120px; height: 120px; background: #6C5CE7; bottom: 10%; right: 10%; animation-delay: 3s; }
  @keyframes floaty {
    to { transform: translate(30px, -20px) scale(1.1); }
  }

  .app {
    position: relative; z-index: 1;
    width: 100%; max-width: 600px;
    padding: 20px;
    text-align: center;
  }

  h1 {
    font-family: 'Fredoka One', cursive;
    font-size: 2.6rem;
    color: #2D3436;
    margin-bottom: 8px;
    letter-spacing: -1px;
  }
  h1 .emoji { font-size: 2.2rem; }

  .subtitle {
    font-size: 1.1rem;
    color: #636e72;
    margin-bottom: 40px;
  }

  /* Menu buttons */
  .menu { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; }
  .menu-btn {
    border: none; cursor: pointer;
    width: 220px; height: 220px;
    border-radius: var(--radius);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 12px;
    font-family: 'Fredoka One', cursive;
    font-size: 1.4rem;
    color: #fff;
    box-shadow: var(--shadow);
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative;
    overflow: hidden;
  }
  .menu-btn:hover { transform: translateY(-6px) scale(1.03); box-shadow: 0 14px 40px rgba(0,0,0,0.12); }
  .menu-btn:active { transform: scale(0.97); }
  .menu-btn .icon { font-size: 4rem; }
  .btn-colors { background: linear-gradient(135deg, #FF6B6B, #ee5a24); }
  .btn-animals { background: linear-gradient(135deg, #4ECDC4, #0abde3); }

  /* Game area */
  .game { display: none; flex-direction: column; align-items: center; gap: 20px; }
  .game.active { display: flex; }

  .color-display {
    width: 220px; height: 220px;
    border-radius: 50%;
    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    transition: background 0.5s;
    display: flex; align-items: center; justify-content: center;
    animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .animal-display {
    font-size: 8rem;
    line-height: 1;
    animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    filter: drop-shadow(0 6px 12px rgba(0,0,0,0.1));
  }
  @keyframes pop-in {
    0% { transform: scale(0); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }

  .question {
    font-family: 'Fredoka One', cursive;
    font-size: 1.5rem;
    color: #2D3436;
  }

  .mic-btn {
    width: 90px; height: 90px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, #6C5CE7, #a855f7);
    color: #fff;
    font-size: 2.4rem;
    cursor: pointer;
    box-shadow: 0 6px 24px rgba(108,92,231,0.35);
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative;
  }
  .mic-btn:hover { transform: scale(1.08); }
  .mic-btn.listening {
    animation: pulse-mic 1s ease-in-out infinite;
    background: linear-gradient(135deg, #e74c3c, #fd79a8);
    box-shadow: 0 6px 30px rgba(231,76,60,0.4);
  }
  @keyframes pulse-mic {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.12); }
  }

  .heard {
    font-size: 1rem;
    color: #636e72;
    min-height: 28px;
    font-style: italic;
  }

  .feedback {
    font-family: 'Fredoka One', cursive;
    font-size: 1.8rem;
    min-height: 50px;
    transition: opacity 0.3s;
  }
  .feedback.correct { color: #00b894; }
  .feedback.wrong { color: #e17055; }
  .feedback.reveal { color: #6C5CE7; }

  .score-bar {
    display: flex; gap: 20px; justify-content: center;
    font-size: 1rem; color: #636e72; font-weight: 800;
  }
  .score-bar span { background: var(--card); padding: 6px 16px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }

  .back-btn {
    margin-top: 10px;
    border: none; background: none;
    font-family: 'Nunito', sans-serif;
    font-size: 1rem; font-weight: 800;
    color: #b2bec3; cursor: pointer;
    text-decoration: underline;
    transition: color 0.2s;
  }
  .back-btn:hover { color: #636e72; }

  .no-speech {
    display: none;
    background: #ffeaa7;
    color: #2D3436;
    padding: 16px 24px;
    border-radius: 16px;
    font-weight: 800;
    max-width: 440px;
  }
  .no-speech.show { display: block; }

  .attempts-dots {
    display: flex; gap: 8px; justify-content: center;
  }
  .attempts-dots span {
    width: 14px; height: 14px; border-radius: 50%;
    background: #dfe6e9;
    transition: background 0.3s;
  }
  .attempts-dots span.used { background: #e17055; }
</style>
</head>
<body>

<div class="bg-shapes">
  <span></span><span></span><span></span><span></span>
</div>

<div class="app" id="app">
  <!-- LANDING -->
  <div id="landing">
    <h1><span class="emoji">🌈</span> Découverte <span class="emoji">🐾</span></h1>
    <p class="subtitle">Choisis ce que tu veux apprendre !</p>
    <div class="menu">
      <button class="menu-btn btn-colors" onclick="startGame('colors')">
        <span class="icon">🎨</span>
        Couleurs
      </button>
      <button class="menu-btn btn-animals" onclick="startGame('animals')">
        <span class="icon">🦁</span>
        Animaux
      </button>
    </div>
  </div>

  <!-- GAME -->
  <div id="game" class="game">
    <div class="score-bar">
      <span>✅ <span id="scoreOk">0</span></span>
      <span>🔄 Question <span id="questionNum">1</span></span>
    </div>

    <div id="displayZone"></div>

    <p class="question" id="questionText"></p>

    <div class="attempts-dots" id="dots">
      <span></span><span></span><span></span>
    </div>

    <button class="mic-btn" id="micBtn" onclick="listen()">🎤</button>
    <p class="heard" id="heard">&nbsp;</p>

    <p class="feedback" id="feedback">&nbsp;</p>

    <button class="back-btn" onclick="goHome()">⬅ Retour au menu</button>
  </div>

  <div class="no-speech" id="noSpeech">
    ⚠️ La reconnaissance vocale n'est pas disponible dans ce navigateur.<br>
    Utilise <strong>Google Chrome</strong> sur ordinateur pour la meilleure expérience.
  </div>
</div>

<script>
  // ---- DATA ----
  const COLORS = [
    { name: 'rouge',   hex: '#e74c3c', alt: ['rouges'] },
    { name: 'bleu',    hex: '#3498db', alt: ['bleue', 'bleus', 'bleues'] },
    { name: 'vert',    hex: '#27ae60', alt: ['verte', 'verts', 'vertes'] },
    { name: 'jaune',   hex: '#f1c40f', alt: ['jaunes'] },
    { name: 'orange',  hex: '#e67e22', alt: ['orangé'] },
    { name: 'violet',  hex: '#8e44ad', alt: ['violette', 'mauve'] },
    { name: 'rose',    hex: '#fd79a8', alt: ['roses'] },
    { name: 'noir',    hex: '#2d3436', alt: ['noire', 'noirs'] },
    { name: 'blanc',   hex: '#f5f5f5', alt: ['blanche', 'blancs'] },
    { name: 'marron',  hex: '#795548', alt: ['brun', 'brune'] },
  ];

  const ANIMALS = [
    { name: 'chat',    emoji: '🐱', alt: ['le chat', 'un chat', 'chaton', 'minou'] },
    { name: 'chien',   emoji: '🐶', alt: ['le chien', 'un chien', 'toutou'] },
    { name: 'lion',    emoji: '🦁', alt: ['le lion', 'un lion'] },
    { name: 'éléphant', emoji: '🐘', alt: ['elephant', 'le éléphant', "l'éléphant"] },
    { name: 'papillon', emoji: '🦋', alt: ['le papillon', 'un papillon'] },
    { name: 'poisson', emoji: '🐟', alt: ['le poisson', 'un poisson'] },
    { name: 'oiseau',  emoji: '🐦', alt: ['le oiseau', "l'oiseau", 'un oiseau'] },
    { name: 'lapin',   emoji: '🐰', alt: ['le lapin', 'un lapin'] },
    { name: 'cochon',  emoji: '🐷', alt: ['le cochon', 'un cochon'] },
    { name: 'vache',   emoji: '🐮', alt: ['la vache', 'une vache'] },
    { name: 'cheval',  emoji: '🐴', alt: ['le cheval', 'un cheval'] },
    { name: 'tortue',  emoji: '🐢', alt: ['la tortue', 'une tortue'] },
  ];

  // ---- STATE ----
  let mode = null;
  let items = [];
  let currentItem = null;
  let attempts = 0;
  let score = 0;
  let questionCount = 0;
  let recognition = null;
  let isListening = false;

  // ---- SPEECH RECOGNITION SETUP ----
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    document.getElementById('noSpeech').classList.add('show');
  }

  function createRecognition() {
    const r = new SpeechRecognition();
    r.lang = 'fr-FR';
    r.continuous = false;
    r.interimResults = false;
    r.maxAlternatives = 5;
    return r;
  }

  // ---- SPEECH SYNTHESIS ----
  function speak(text, callback) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'fr-FR';
    u.rate = 0.9;
    u.onend = callback || null;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }

  // ---- GAME LOGIC ----
  function startGame(m) {
    mode = m;
    items = mode === 'colors' ? [...COLORS] : [...ANIMALS];
    score = 0;
    questionCount = 0;
    document.getElementById('scoreOk').textContent = '0';
    document.getElementById('landing').style.display = 'none';
    document.getElementById('game').classList.add('active');
    nextRound();
  }

  function goHome() {
    speechSynthesis.cancel();
    if (recognition) { try { recognition.abort(); } catch(e){} }
    isListening = false;
    document.getElementById('micBtn').classList.remove('listening');
    document.getElementById('game').classList.remove('active');
    document.getElementById('landing').style.display = 'block';
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function nextRound() {
    attempts = 0;
    questionCount++;
    document.getElementById('questionNum').textContent = questionCount;
    updateDots();

    currentItem = items[Math.floor(Math.random() * items.length)];

    const zone = document.getElementById('displayZone');
    const fb = document.getElementById('feedback');
    const heard = document.getElementById('heard');
    fb.innerHTML = '&nbsp;';
    heard.innerHTML = '&nbsp;';

    if (mode === 'colors') {
      zone.innerHTML = `<div class="color-display" style="background:${currentItem.hex};${currentItem.name === 'blanc' ? 'border:3px solid #dfe6e9' : ''}"></div>`;
      document.getElementById('questionText').textContent = 'Quelle est cette couleur ? 🤔';
      speak('Quelle est cette couleur ?');
    } else {
      zone.innerHTML = `<div class="animal-display">${currentItem.emoji}</div>`;
      document.getElementById('questionText').textContent = 'Quel est cet animal ? 🤔';
      speak('Quel est cet animal ?');
    }
  }

  function updateDots() {
    const dots = document.querySelectorAll('#dots span');
    dots.forEach((d, i) => d.classList.toggle('used', i < attempts));
  }

  function checkAnswer(transcript) {
    const clean = transcript.toLowerCase().trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const target = currentItem.name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const allAccepted = [currentItem.name, ...(currentItem.alt || [])].map(s =>
      s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    );
    return allAccepted.some(a => clean.includes(a));
  }

  function handleResult(transcript) {
    const heard = document.getElementById('heard');
    const fb = document.getElementById('feedback');
    heard.textContent = `J'ai entendu : "${transcript}"`;

    if (checkAnswer(transcript)) {
      score++;
      document.getElementById('scoreOk').textContent = score;
      fb.className = 'feedback correct';
      fb.textContent = 'Bravo ! 🎉';
      speak('Bravo, c\'est correct !', () => {
        setTimeout(nextRound, 800);
      });
    } else {
      attempts++;
      updateDots();
      if (attempts >= 3) {
        const answer = currentItem.name;
        fb.className = 'feedback reveal';
        fb.textContent = `C'est : ${answer} !`;
        speak(`Ce n'est pas ça. La bonne réponse est : ${answer}.`, () => {
          setTimeout(nextRound, 1500);
        });
      } else {
        fb.className = 'feedback wrong';
        fb.textContent = `Non, essaie encore ! (${3 - attempts} essai${3 - attempts > 1 ? 's' : ''} restant${3 - attempts > 1 ? 's' : ''})`;
        speak('Ce n\'est pas ça, essaie encore !');
      }
    }
  }

  // ---- LISTEN ----
  function listen() {
    if (!SpeechRecognition) return;
    if (isListening) return;

    isListening = true;
    const btn = document.getElementById('micBtn');
    btn.classList.add('listening');
    document.getElementById('heard').innerHTML = 'Écoute en cours...';

    recognition = createRecognition();

    recognition.onresult = (e) => {
      isListening = false;
      btn.classList.remove('listening');
      const result = e.results[0];
      let transcript = result[0].transcript;
      handleResult(transcript);
    };

    recognition.onerror = (e) => {
      isListening = false;
      btn.classList.remove('listening');
      if (e.error === 'no-speech') {
        document.getElementById('heard').textContent = "Je n'ai rien entendu, réessaie !";
      } else {
        document.getElementById('heard').textContent = "Erreur, appuie à nouveau sur le micro.";
      }
    };

    recognition.onend = () => {
      isListening = false;
      btn.classList.remove('listening');
    };

    recognition.start();
  }
</script>

</body>
</html>