// exercise_guides.js - Guida Esercizi con Uomo Stilizzato & Video Tutorial YouTube

export const EXERCISE_GUIDES = {
  // --- PETTO ---
  "Panca Piana Bilanciere": {
    muscle: "Petto",
    secondary: "Tricipiti, Deltoidi Anteriori",
    equipment: "Bilanciere + Panca",
    pattern: "bench_press",
    cues: [
      "Occhi sotto il bilanciere, piedi ben piantati a terra per massimo leg drive.",
      "Adduci e deprimi le scapole creando un arco dorsale compatto.",
      "Scendi controllando la sbarra sul centro/basso sterno coi gomiti a ~45-60°.",
      "Spingi esplosivo espirando, senza perdere l'assetto scapolare."
    ],
    mistake: "Gomiti aperti a 90° in linea con le spalle o rimbalzo della sbarra sul torace.",
    youtubeQuery: "esecuzione panca piana bilanciere tutorial"
  },
  "Panca Piana": {
    muscle: "Petto",
    secondary: "Tricipiti, Spalle",
    equipment: "Bilanciere / Manubri",
    pattern: "bench_press",
    cues: [
      "Stabilità massima: piedi a terra e glutei sempre a contatto con la panca.",
      "Scapole retratte durante tutto il range di movimento.",
      "Arco fisiologico lombare, non forzare la curva cervicale."
    ],
    mistake: "Staccare i glutei dalla panca per aiutarsi a salire.",
    youtubeQuery: "esecuzione panca piana tutorial"
  },
  "Panca Inclinata Manubri": {
    muscle: "Petto",
    secondary: "Fasci Clavicolari (Petto Alto), Deltoidi",
    equipment: "Manubri + Panca 30°",
    pattern: "incline_press",
    cues: [
      "Inclinazione panca a 30° (massimo 45° per non spostare il focus sulle spalle).",
      "Scendi aprendo il petto e sentendo l'allungamento dei fasci alti.",
      "Spingi convergendo leggermente in alto senza toccare i manubri.",
      "Mantieni i polsi neutri e stabili sopra i gomiti."
    ],
    mistake: "Panca troppo inclinata (>45°) trasformando l'esercizio in un lento avanti.",
    youtubeQuery: "panca inclinata manubri esecuzione perfetta"
  },
  "Croci ai Cavi": {
    muscle: "Petto",
    secondary: "Deltoide Anteriore",
    equipment: "Cavi Alti / Medi",
    pattern: "bench_press",
    cues: [
      "Gomiti leggermente flessi e bloccati in un angolo costante di ~15-20°.",
      "Focalizzati sull'avvicinare i bicipiti allo sterno, non solo le mani.",
      "Squeeze isometrico di 1 secondo nel punto di massima contrazione."
    ],
    mistake: "Piegare ed estendere i gomiti trasformando le croci in una spinta.",
    youtubeQuery: "croci ai cavi petto esecuzione corretta"
  },
  "Chest Press": {
    muscle: "Petto",
    secondary: "Tricipiti, Deltoidi",
    equipment: "Macchinario Isotonico",
    pattern: "bench_press",
    cues: [
      "Regola l'altezza del sedile: le maniglie devono essere all'altezza della linea dei capezzoli.",
      "Schiena ben aderente allo schienale e petto in fuori.",
      "Spingi in avanti senza bloccare violentemente l'articolazione del gomito."
    ],
    mistake: "Spalle che scivolano in avanti a fine spinta perdendo il contatto con lo schienale.",
    youtubeQuery: "chest press macchina esecuzione"
  },
  "Pectoral Machine": {
    muscle: "Petto",
    secondary: "Deltoide Anteriore",
    equipment: "Macchina Pectoral",
    pattern: "bench_press",
    cues: [
      "Regola i bracci per un allungamento sicuro e non doloroso alle spalle.",
      "Movimento controllato in fase eccentrica di almeno 2-3 secondi.",
      "Mantieni il petto alto e le spalle basse durante la chiusura."
    ],
    mistake: "Caricare troppo e strappare il movimento con lo slancio del busto.",
    youtubeQuery: "pectoral machine esecuzione"
  },
  "Push Up": {
    muscle: "Petto",
    secondary: "Core, Tricipiti, Spalle",
    equipment: "Corpo Libero",
    pattern: "bench_press",
    cues: [
      "Corpo in linea retta dalla testa ai talloni, addome e glutei contratti.",
      "Mani a larghezza spalle, dita leggermente extra-ruotate.",
      "Scendi finché il petto sfiora il pavimento coi gomiti a freccia (45°)."
    ],
    mistake: "Bacino che collassa verso il pavimento (iperestensione lombare).",
    youtubeQuery: "piegamenti sulle braccia push up esecuzione perfetta"
  },
  "Dips": {
    muscle: "Petto",
    secondary: "Tricipiti, Spalle",
    equipment: "Parallele",
    pattern: "dips",
    cues: [
      "Busto inclinato in avanti a ~30° per enfatizzare il pettorale basso.",
      "Gomiti che scendono indietro fino a un angolo di ~90° del braccio.",
      "Spingi forte sul palmo tornando in posizione senza scattare sui gomiti."
    ],
    mistake: "Scendere troppo in profondità stressando eccessivamente la capsula articolare della spalla.",
    youtubeQuery: "dips parallele petto esecuzione corretta"
  },

  // --- DORSALI ---
  "Trazioni alla Sbarra": {
    muscle: "Dorsali",
    secondary: "Bicipiti, Romboidi, Core",
    equipment: "Sbarra per Trazioni",
    pattern: "pullup",
    cues: [
      "Presa prona poco più larga delle spalle, corpo teso senza oscillare.",
      "Inizia il movimento deprimendo le scapole (attivazione dorsale).",
      "Tira portando il petto verso la sbarra, immaginando di portare i gomiti verso i fianchi.",
      "Supera la sbarra col mento e scendi in modo controllato fino a braccia quasi distese."
    ],
    mistake: "Kipping o scalciare con le gambe per darsi lo slancio.",
    youtubeQuery: "trazioni alla sbarra tutorial esecuzione"
  },
  "Trazioni": {
    muscle: "Dorsali",
    secondary: "Bicipiti, Dorso",
    equipment: "Sbarra",
    pattern: "pullup",
    cues: [
      "Deprimi le scapole all'inizio di ogni singola ripetizione.",
      "Petto fiero rivolto alla sbarra.",
      "Discesa lenta e controllata di 2 secondi."
    ],
    mistake: "Non completare l'escursione completa (ROM ridotto a metà).",
    youtubeQuery: "trazioni tutorial"
  },
  "Lat Machine": {
    muscle: "Dorsali",
    secondary: "Bicipiti, Fasci Medi",
    equipment: "Cavi / Torretta Lat",
    pattern: "lat_pulldown",
    cues: [
      "Blocca bene le cosce sotto i cuscinetti e inclina il busto indietro di 10-15°.",
      "Tira la sbarra verso la parte alta dello sterno guidando coi gomiti.",
      "Non tirare dietro al collo: la sbarra scende sempre sul petto.",
      "Risali accompagnando il peso sentendo l'allungamento del gran dorsale."
    ],
    mistake: "Dondolare violentemente con la schiena per muovere il carico.",
    youtubeQuery: "lat machine avanti esecuzione corretta"
  },
  "Rematore Bilanciere": {
    muscle: "Dorsali",
    secondary: "Bicipiti, Trapezi, Lombari",
    equipment: "Bilanciere",
    pattern: "row",
    cues: [
      "Busto inclinato a ~45° (o parallelo al suolo), schiena perfettamente neutra.",
      "Tira il bilanciere verso l'ombelico facendo scorrere i gomiti vicino al tronco.",
      "Strizza i dorsali e le scapole in cima per un secondo prima di rilasciare."
    ],
    mistake: "Arrotondare la zona lombare perdendo la curva fisiologica della colonna.",
    youtubeQuery: "rematore con bilanciere esecuzione perfetta"
  },
  "Rematore Manubrio": {
    muscle: "Dorsali",
    secondary: "Bicipiti, Dorso",
    equipment: "Manubrio + Panca",
    pattern: "row",
    cues: [
      "Tre punti d'appoggio: ginocchio e mano sulla panca, piede saldo a terra.",
      "Tira il manubrio descrivendo una traiettoria curva a 'J' verso la tasca posteriore.",
      "Evita di ruotare eccessivamente il busto per completare la ripetizione."
    ],
    mistake: "Tirare su dritto verso la spalla invece che verso il fianco.",
    youtubeQuery: "rematore con manubrio su panca esecuzione"
  },
  "Pulley": {
    muscle: "Dorsali",
    secondary: "Bicipiti, Romboidi",
    equipment: "Cavo Basso con Triangolo",
    pattern: "row",
    cues: [
      "Ginocchia leggermente flesse, petto aperto e schiena verticale.",
      "Tira il triangolo verso la bocca dello stomaco aprendo le spalle.",
      "Allunga il dorso in avanti in eccentrica mantenendo il controllo lombare."
    ],
    mistake: "Inarcare la schiena avanti e indietro dondolando come se si stesse remando in canoa.",
    youtubeQuery: "pulley basso esecuzione corretta"
  },
  "Pull-down braccia tese": {
    muscle: "Dorsali",
    secondary: "Grande Rotondo, Tricipiti",
    equipment: "Cavo Alto con Barra o Corda",
    pattern: "lat_pulldown",
    cues: [
      "Gomiti semibloccati con leggera flessione.",
      "Busto inclinato a ~30°, porta la sbarra alle cosce descrivendo un arco.",
      "Concentrati sul sentire il dorsale che si contrae ai lati della cassa toracica."
    ],
    mistake: "Piegare i gomiti trasformando l'esercizio in un pushdown per i tricipiti.",
    youtubeQuery: "pulldown braccia tese esecuzione"
  },

  // --- SPALLE ---
  "Military Press": {
    muscle: "Spalle",
    secondary: "Tricipiti, Parte Alta Petto, Core",
    equipment: "Bilanciere",
    pattern: "overhead_press",
    cues: [
      "In piedi, glutei e addome serrati come un blocco di cemento.",
      "Gomiti leggermente davanti alla sbarra, presa a larghezza spalle.",
      "Sposta la testa indietro per far passare la sbarra, poi infila la testa sotto al lockout.",
      "Non inarcare la schiena all'indietro per compensare la fatica."
    ],
    mistake: "Iperestensione lombare marcata durante la spinta.",
    youtubeQuery: "military press bilanciere esecuzione corretta"
  },
  "Shoulder Press": {
    muscle: "Spalle",
    secondary: "Tricipiti, Trapezio",
    equipment: "Macchina / Manubri",
    pattern: "overhead_press",
    cues: [
      "Schiena aderente allo schienale a 75-80°.",
      "Spingi verso l'alto senza far sbattere i pesi in cima.",
      "Scendi finché le maniglie sono all'altezza delle orecchie/spalle."
    ],
    mistake: "Scendere troppo poco o perdere la traiettoria verticale.",
    youtubeQuery: "shoulder press macchina manubri esecuzione"
  },
  "Lento Avanti Manubri": {
    muscle: "Spalle",
    secondary: "Tricipiti, Deltoide Laterale",
    equipment: "Manubri + Panca 75-80°",
    pattern: "overhead_press",
    cues: [
      "Panca inclinata a 75-80° (non perfettamente a 90° per tutelare le spalle).",
      "Gomiti posizionati sul piano scapolare (leggermente orientati in avanti, non aperti a 180°).",
      "Spingi in alto disegnando un leggero arco senza toccare i manubri tra loro."
    ],
    mistake: "Gomiti spalancati a croce che aumentano il rischio di impingement alla cuffia dei rotatori.",
    youtubeQuery: "lento avanti manubri seduto esecuzione"
  },
  "Alzate Laterali": {
    muscle: "Spalle",
    secondary: "Deltoide Laterale (focus isolamento)",
    equipment: "Manubri / Cavi",
    pattern: "lateral_raise",
    cues: [
      "Piccola inclinazione del busto in avanti (5-10°), petto fiero.",
      "Alza i manubri guidando coi gomiti, come se versassi acqua da una brocca.",
      "Fermati all'altezza delle spalle; non salire sopra l'orizzontale per non attivare il trapezio.",
      "Controlla la discesa: dura almeno il doppio della salita."
    ],
    mistake: "Slanciare il busto avanti e indietro caricando pesi eccessivi (egolifting).",
    youtubeQuery: "alzate laterali manubri esecuzione perfetta"
  },
  "Alzate Frontali": {
    muscle: "Spalle",
    secondary: "Deltoide Anteriore",
    equipment: "Manubri / Bilanciere",
    pattern: "lateral_raise",
    cues: [
      "In piedi stabile, solleva il manubrio dritto fino all'altezza dello sguardo.",
      "Polsi neutri, movimento pulito senza oscillazioni del bacino."
    ],
    mistake: "Dondolio pelvico per lanciare il carico.",
    youtubeQuery: "alzate frontali manubri esecuzione"
  },

  // --- GAMBE (QUADRICIPITI & FEMORALI) ---
  "Squat Bilanciere": {
    muscle: "Quadricipiti",
    secondary: "Glutei, Femorali, Core, Lombari",
    equipment: "Bilanciere + Rack",
    pattern: "squat",
    cues: [
      "Bilanciere incastrato sui trapezi, piedi a larghezza spalle con punte aperte di ~20-30°.",
      "Prendi aria nel diaframma (manovra di Valsalva) per compattare il core.",
      "Scendi piegando ginocchia e bacino contemporaneamente, mantenendo il ginocchio in linea con le dita del piede.",
      "Raggiungi almeno il parallelo (piega dell'anca sotto il ginocchio) e risali spingendo su tutto il piede."
    ],
    mistake: "Ginocchia che collassano verso l'interno (valgo) o talloni che si sollevano da terra.",
    youtubeQuery: "squat bilanciere esecuzione tutorial"
  },
  "Squat": {
    muscle: "Quadricipiti",
    secondary: "Glutei, Core",
    equipment: "Bilanciere / Corpo Libero",
    pattern: "squat",
    cues: [
      "Piedi saldi, peso distribuito su tre punti: tallone, alluce, quinto dito.",
      "Scendi col petto aperto e risali mantenendo la colonna neutra."
    ],
    mistake: "Perdita della curva lombare in buca (butt wink accentuato).",
    youtubeQuery: "squat tutorial perfetto"
  },
  "Leg Press": {
    muscle: "Quadricipiti",
    secondary: "Glutei, Femorali",
    equipment: "Pressa a 45°",
    pattern: "squat",
    cues: [
      "Schiena e zona lombare sempre incollate allo schienale: non staccare il sacro!",
      "Posiziona i piedi al centro della pedana a larghezza spalle.",
      "Scendi fin dove riesci senza sollevare la parte bassa della schiena.",
      "Non bloccare mai completamente le ginocchia in iperestensione a fine salita."
    ],
    mistake: "Staccare il bacino dallo schienale in discesa, creando pericolose compressioni vertebrali.",
    youtubeQuery: "leg press 45 gradi esecuzione corretta"
  },
  "Affondi": {
    muscle: "Quadricipiti",
    secondary: "Glutei, Femorali",
    equipment: "Manubri / Corpo Libero",
    pattern: "squat",
    cues: [
      "Fai un passo lungo in avanti; il ginocchio posteriore scende sfiorando il terreno.",
      "Il ginocchio anteriore resta stabile e non traballa all'interno.",
      "Spingi sul tallone anteriore per tornare in posizione eretta."
    ],
    mistake: "Passo troppo corto caricando troppo l'articolazione rotulea.",
    youtubeQuery: "affondi con manubri esecuzione"
  },
  "Leg Extension": {
    muscle: "Quadricipiti",
    secondary: "Isolamento Quadricipite",
    equipment: "Macchina Leg Extension",
    pattern: "leg_extension",
    cues: [
      "Allinea il perno della macchina col centro dell'articolazione del ginocchio.",
      "Afferra saldamente le maniglie laterali per mantenere il bacino piantato sul sedile.",
      "Estendi le gambe e trattieni la contrazione massima per 1 secondo in cima.",
      "Discesa controllata senza far sbattere i pesi."
    ],
    mistake: "Alzare il sedere dal sedile per dare lo slancio.",
    youtubeQuery: "leg extension esecuzione corretta"
  },
  "Leg Curl": {
    muscle: "Femorali",
    secondary: "Polpacci",
    equipment: "Macchina Leg Curl (Sdraiato o Seduto)",
    pattern: "leg_curl",
    cues: [
      "Cuscinetto posizionato appena sopra il tendine d'Achille (sotto il polpaccio).",
      "Bacino schiacciato contro il cuscino: non inarcare la schiena.",
      "Fletti i talloni verso i glutei stringendo forte i posteriori della coscia.",
      "Fase eccentrica lenta: resisti al carico in estensione."
    ],
    mistake: "Inarcare la zona lombare alzando il bacino durante la flessione.",
    youtubeQuery: "leg curl sdraiato esecuzione corretta"
  },

  // --- LOMBARI & POSTERIORI ---
  "Stacco": {
    muscle: "Lombari",
    secondary: "Glutei, Femorali, Trapezi, Core, Presa",
    equipment: "Bilanciere",
    pattern: "deadlift",
    cues: [
      "Bilanciere a contatto con le tibie a metà piede.",
      "Scapole sopra la sbarra, bacino all'altezza corretta (né troppo squat, né troppo teso).",
      "Pancia piena d'aria (core blindato), tira via il gioco del bilanciere prima di staccare.",
      "Spingi via il pavimento con le gambe estendendo anca e ginocchia insieme."
    ],
    mistake: "Tirare di schiena con la colonna curva a gatto (rischio ernie).",
    youtubeQuery: "stacco da terra tutorial deadlift"
  },
  "Stacchi Romeni": {
    muscle: "Femorali",
    secondary: "Glutei, Lombari",
    equipment: "Bilanciere / Manubri",
    pattern: "deadlift",
    cues: [
      "Ginocchia morbide con una flessione minima e fissa di ~15°.",
      "Il movimento è un hinge dell'anca: spingi il sedere indietro verso la parete.",
      "La sbarra sfiora le cosce e scende fin sotto le ginocchia finché senti tirare i femorali.",
      "Risali stringendo i glutei in avanti senza iperestendere la schiena in cima."
    ],
    mistake: "Piegare troppo le ginocchia facendolo diventare uno squat o allontanare il bilanciere dalle gambe.",
    youtubeQuery: "stacco rumeno rdl esecuzione perfetta"
  },
  "Hyperextension": {
    muscle: "Lombari",
    secondary: "Glutei, Femorali",
    equipment: "Panca Inclinata a 45°",
    pattern: "deadlift",
    cues: [
      "Cuscinetto posizionato sotto le creste iliache per permettere la flessione dell'anca.",
      "Scendi flettendo il busto e risali fino a una linea retta neutra.",
      "Non iperestendere la schiena indietro a fine corsa."
    ],
    mistake: "Iperestensione violenta del tratto lombare in cima.",
    youtubeQuery: "hyperextension panca 45 gradi esecuzione"
  },
  "Good Morning": {
    muscle: "Lombari",
    secondary: "Femorali, Glutei",
    equipment: "Bilanciere",
    pattern: "deadlift",
    cues: [
      "Bilanciere sui trapezi, ginocchia morbide.",
      "Fletti il busto in avanti spingendo i glutei indietro fino a 60-70°.",
      "Mantieni il core serrato e la schiena piatta."
    ],
    mistake: "Caricare troppo piegando la schiena in avanti senza controllo.",
    youtubeQuery: "good morning esercizio esecuzione"
  },

  // --- GLUTEI ---
  "Hip Thrust": {
    muscle: "Glutei",
    secondary: "Femorali, Core",
    equipment: "Bilanciere + Panca + Pad",
    pattern: "hip_thrust",
    cues: [
      "Panca posizionata subito sotto l'angolo inferiore delle scapole.",
      "Piedi posizionati in modo che le tibie siano perpendicolari al suolo al vertice della spinta (angolo a 90°).",
      "Mento verso il petto e sguardo sempre in avanti: non guardare il soffitto!",
      "Spingi sui talloni contraendo al massimo i glutei in cima in retroversione del bacino per 1-2 secondi."
    ],
    mistake: "Iperestendere la parte bassa della schiena invece di contrarre i glutei col bacino.",
    youtubeQuery: "hip thrust tutorial esecuzione perfetta"
  },
  "Glute Bridge": {
    muscle: "Glutei",
    secondary: "Femorali",
    equipment: "Tappetino / Bilanciere",
    pattern: "hip_thrust",
    cues: [
      "Disteso a terra, talloni vicini ai glutei.",
      "Solleva il bacino contraendo i glutei al massimo.",
      "Spingi sui talloni senza inarcare la schiena."
    ],
    mistake: "Spingere sulle punte dei piedi invece che sui talloni.",
    youtubeQuery: "ponte per glutei glute bridge esecuzione"
  },
  "Abductor Machine": {
    muscle: "Glutei",
    secondary: "Medio Gluteo",
    equipment: "Macchina Abduttori",
    pattern: "hip_thrust",
    cues: [
      "Schiena inclinata leggermente in avanti per massimizzare il medio gluteo.",
      "Spingi con le ginocchia aprendo le cosce al massimo range.",
      "Trattieni la contrazione per 1 secondo prima di richiudere controllando."
    ],
    mistake: "Far sbattere i pesi in chiusura perdendo la tensione continua.",
    youtubeQuery: "abductor machine glutei esecuzione"
  },

  // --- BRACCIA: BICIPITI & TRICIPITI ---
  "Curl Bilanciere": {
    muscle: "Bicipiti",
    secondary: "Brachiale, Avambracci",
    equipment: "Bilanciere Dritto o Sagomato (EZ)",
    pattern: "bicep_curl",
    cues: [
      "Gomiti saldamente bloccati lungo i fianchi: non devono scivolare indietro né troppo avanti.",
      "Fletti le braccia portando il bilanciere verso le spalle senza oscillare col busto.",
      "Squeeze del bicipite in cima e discesa lenta di 2-3 secondi fino a distensione quasi completa."
    ],
    mistake: "Dondolare con la schiena all'indietro per muovere il carico (cheating marcato).",
    youtubeQuery: "curl bilanciere bicipiti tutorial"
  },
  "Curl Manubri": {
    muscle: "Bicipiti",
    secondary: "Brachiale, Supinatori",
    equipment: "Manubri",
    pattern: "bicep_curl",
    cues: [
      "Inizia con presa a martello e ruota il polso (supinazione) durante la salita.",
      "Mignolo che ruota verso l'esterno in cima per picco di contrazione massimo.",
      "Gomito fermo nello spazio."
    ],
    mistake: "Sollevare i gomiti in avanti trasformando il curl in un'alzata frontale.",
    youtubeQuery: "curl con manubri alternato esecuzione"
  },
  "Hammer Curl": {
    muscle: "Bicipiti",
    secondary: "Brachioradiale (Avambraccio), Brachiale",
    equipment: "Manubri",
    pattern: "bicep_curl",
    cues: [
      "Presa neutra (pollici rivolti in alto come a martellare).",
      "Movimento rigido e controllato, ideale per dare spessore al braccio.",
      "Discesa lenta senza lasciare cadere i manubri."
    ],
    mistake: "Spostare il gomito avanti perdendo tensione sull'avambraccio e sul bicipite.",
    youtubeQuery: "hammer curl bicipiti martello esecuzione"
  },
  "Curl panca Scott": {
    muscle: "Bicipiti",
    secondary: "Capo Corto Bicipite",
    equipment: "Panca Scott + Bilanciere EZ",
    pattern: "bicep_curl",
    cues: [
      "Ascelle saldamente incastrate sulla sommità del cuscino inclinato.",
      "Non staccare i gomiti dal cuscinetto.",
      "Non iperestendere a scatto i gomiti in basso per tutelare i tendini."
    ],
    mistake: "Rilasciare il peso di colpo a fine discesa rischiando infortuni tendinei.",
    youtubeQuery: "panca scott curl bicipiti esecuzione"
  },
  "Spider Curl": {
    muscle: "Bicipiti",
    secondary: "Picco del Bicipite",
    equipment: "Manubri + Panca Inclinata a pancia in giù",
    pattern: "bicep_curl",
    cues: [
      "Petto appoggiato sulla panca a 45°, braccia a piombo perpendicolari a terra.",
      "Zero possibilità di barare con lo slancio del corpo: isolamento totale.",
      "Contrai con forza in cima e rilascia lentamente."
    ],
    mistake: "Tirare indietro i gomiti verso il busto.",
    youtubeQuery: "spider curl bicipiti esecuzione"
  },
  "Pushdown Cavi": {
    muscle: "Tricipiti",
    secondary: "Capo Laterale e Mediale",
    equipment: "Cavo Alto con Barra o Corda",
    pattern: "tricep_pushdown",
    cues: [
      "Gomiti incollati alla cassa toracica: sono la cerniera dell'esercizio.",
      "Spingi il peso verso il basso fino a estendere completamente il gomito.",
      "Se usi la corda, divarica le estremità verso l'esterno a fine corsa per massimo picco.",
      "Risali fino a ~90° di flessione senza staccare i gomiti dai fianchi."
    ],
    mistake: "Far muovere i gomiti avanti e indietro trasformando il pushdown in una spinta di spalla.",
    youtubeQuery: "pushdown tricipiti cavi esecuzione corretta"
  },
  "French Press": {
    muscle: "Tricipiti",
    secondary: "Capo Lungo del Tricipite",
    equipment: "Bilanciere EZ su Panca",
    pattern: "tricep_pushdown",
    cues: [
      "Braccia leggermente inclinate all'indietro verso la testa (non a 90° col busto).",
      "Piega solo i gomiti portando la sbarra verso la fronte o dietro la nuca.",
      "Estendi tornando nella posizione di partenza senza allargare a sventola i gomiti."
    ],
    mistake: "Gomiti che si aprono lateralmente aumentando lo stress sulle articolazioni.",
    youtubeQuery: "french press tricipiti esecuzione"
  },
  "Dips tra panche": {
    muscle: "Tricipiti",
    secondary: "Petto, Spalle",
    equipment: "Due Panche / Una Panca",
    pattern: "dips",
    cues: [
      "Schiena che scorre vicino alla panca senza allontanarsi.",
      "Scendi a 90° col gomito ed estendi tornando su spingendo sui palmi."
    ],
    mistake: "Allontanare il busto dalla panca sovraccaricando la capsula anteriore della spalla.",
    youtubeQuery: "dips tra panche tricipiti esecuzione"
  },
  "Estensioni Manubrio": {
    muscle: "Tricipiti",
    secondary: "Capo Lungo Tricipite",
    equipment: "Manubrio",
    pattern: "tricep_pushdown",
    cues: [
      "Braccio alto vicino all'orecchio, abbassa il manubrio dietro la nuca.",
      "Estendi verso il cielo mantenendo il braccio fermo."
    ],
    mistake: "Gomito che dondola lateralmente.",
    youtubeQuery: "estensioni tricipiti sopra la testa manubrio"
  },

  // --- TRAPEZI & POLPACCI ---
  "Scrollate Bilanciere": {
    muscle: "Trapezi",
    secondary: "Presa, Avambracci",
    equipment: "Bilanciere",
    pattern: "generic",
    cues: [
      "In piedi eretto, alza le spalle dritto verso le orecchie.",
      "Trattieni la contrazione in cima per 1-2 secondi prima di scendere.",
      "Non ruotare le spalle all'indietro: il movimento è puramente verticale."
    ],
    mistake: "Ruotare le spalle in cerchio (inutile e dannoso per le articolazioni acromion-claveari).",
    youtubeQuery: "scrollate con bilanciere shrugs esecuzione"
  },
  "Scrollate Manubri": {
    muscle: "Trapezi",
    secondary: "Trapezio Superiore",
    equipment: "Manubri",
    pattern: "generic",
    cues: [
      "Manubri ai lati delle cosce, solleva verso le orecchie in linea retta.",
      "Spremitura in alto e discesa controllata."
    ],
    mistake: "Rotazione delle spalle.",
    youtubeQuery: "scrollate manubri trapezi esecuzione"
  },
  "Face Pull": {
    muscle: "Trapezi",
    secondary: "Deltoide Posteriore, Cuffia dei Rotatori",
    equipment: "Cavo Alto con Corda",
    pattern: "row",
    cues: [
      "Tira la corda verso il naso / fronte aprendo le mani verso l'esterno.",
      "Gomiti alti e larghi: focalizzati sull'extra-rotazione dell'omero a fine corsa.",
      "Eccellente per la salute posturale delle spalle."
    ],
    mistake: "Tirare verso il mento con gomiti bassi.",
    youtubeQuery: "face pull cavi deltoidi posteriori esecuzione"
  },
  "Tirate al Mento": {
    muscle: "Trapezi",
    secondary: "Deltoidi Laterali, Bicipiti",
    equipment: "Bilanciere / Cavi",
    pattern: "lateral_raise",
    cues: [
      "Presa non troppo stretta (almeno a larghezza spalle per non pinzare la cuffia).",
      "Solleva i gomiti guidando il movimento verso l'alto fin sopra lo sterno."
    ],
    mistake: "Presa strettissima che comprime lo spazio sub-acromiale.",
    youtubeQuery: "tirate al mento bilanciere esecuzione corretta"
  },
  "Calf Raises": {
    muscle: "Polpacci",
    secondary: "Gastrocnemio e Soleo",
    equipment: "Step / Macchina Calf",
    pattern: "calf_raise",
    cues: [
      "Punte dei piedi sullo step con talloni liberi di scendere.",
      "Scendi in massimo allungamento e fermati 1 secondo in basso per disattivare il riflesso miotatico.",
      "Sali esplosivo sulle punte contraendo al massimo il polpaccio in cima per 1 secondo."
    ],
    mistake: "Rimbalzare velocemente sfruttando l'elasticità del tendine d'Achille invece di far lavorare il muscolo.",
    youtubeQuery: "calf raises polpacci esecuzione corretta"
  },
  "Calf Press": {
    muscle: "Polpacci",
    secondary: "Gastrocnemio",
    equipment: "Leg Press",
    pattern: "calf_raise",
    cues: [
      "Solo l'avampiede sulla pedana inferiore.",
      "Spingi distendendo le caviglie senza flettere le ginocchia.",
      "Pausa in allungamento prima di spingere."
    ],
    mistake: "Piegare le ginocchia trasformando il calf in una mini-pressa.",
    youtubeQuery: "calf su leg press esecuzione"
  },

  // --- ADDOME ---
  "Crunch": {
    muscle: "Addome",
    secondary: "Retto dell'Addome",
    equipment: "Tappetino",
    pattern: "crunch",
    cues: [
      "Sdraiato a terra, ginocchia piegate.",
      "Arriccia la cassa toracica verso il bacino sollevando solo le scapole.",
      "Espira tutta l'aria svuotando i polmoni per contrarre a fondo l'addome.",
      "Non tirare il collo con le mani: le mani sfiorano le tempie."
    ],
    mistake: "Tirarsi il collo con le braccia o alzare tutta la schiena da terra.",
    youtubeQuery: "crunch addominali esecuzione corretta"
  },
  "Plank": {
    muscle: "Addome",
    secondary: "Trasverso dell'Addome, Glutei, Spalle",
    equipment: "Tappetino",
    pattern: "plank",
    cues: [
      "Gomiti sotto le spalle, corpo dritto come una tavola.",
      "Glutei serrati e bacino in leggera retroversione.",
      "Spingi attivamente i gomiti contro il suolo allontanando le scapole.",
      "Respira regolarmente mantenendo il core di marmo."
    ],
    mistake: "Bacino che cade verso il pavimento o sedere troppo alto a piramide.",
    youtubeQuery: "plank addominali esecuzione perfetta"
  },
  "Leg Raises": {
    muscle: "Addome",
    secondary: "Flessori dell'Anca, Addome Basso",
    equipment: "Sbarra / Parallele / Tappetino",
    pattern: "crunch",
    cues: [
      "Solleva le ginocchia o le gambe ruotando il bacino verso l'alto (retroversione).",
      "Non limitarti a muovere le cosce: è la flessione del bacino che attiva l'addome.",
      "Discesa lenta senza dondolare col corpo."
    ],
    mistake: "Dondolare e inarcare la schiena staccandola dal supporto.",
    youtubeQuery: "leg raises alle parallele sbarra addominali"
  },
  "Ab Roller": {
    muscle: "Addome",
    secondary: "Core Profondo, Dorsali, Spalle",
    equipment: "Rotella Ab Wheel",
    pattern: "plank",
    cues: [
      "In ginocchio, schiena leggermente incurvata a cupola (bacino retroverso).",
      "Rotola in avanti controllando con l'addome fin dove riesci a mantenere l'assetto.",
      "Tira tornando indietro usando l'addome, non spingendo con le braccia."
    ],
    mistake: "Perdere il controllo e spanciare inarcando la schiena in avanti.",
    youtubeQuery: "ab roller ruota addominali tutorial"
  },
  "Russian Twist": {
    muscle: "Addome",
    secondary: "Obliqui",
    equipment: "Tappetino + Disco / Palla Medica",
    pattern: "crunch",
    cues: [
      "Seduto a terra col busto a 45°, piedi sollevati o appoggiati.",
      "Ruota il tronco da un lato all'altro controllando il movimento.",
      "Guarda dove ruota il peso mantenendo il petto fiero."
    ],
    mistake: "Muovere solo le braccia senza ruotare la cassa toracica.",
    youtubeQuery: "russian twist addominali obliqui esecuzione"
  }
};

/**
 * Trova la guida per un esercizio, o crea un fallback intelligente
 */
export const getExerciseGuide = (exerciseName) => {
  if (!exerciseName) {
    return {
      name: "Esercizio",
      muscle: "Muscolo",
      secondary: "Corpo intero",
      equipment: "Palestra",
      pattern: "generic",
      cues: [
        "Mantieni il core compatto e la schiena nella sua curva fisiologica.",
        "Esegui il movimento in modo controllato senza usare slanci.",
        "Espira nello sforzo (fase concentrica) e inspira nella discesa."
      ],
      mistake: "Caricare troppo compromettendo la traiettoria e la sicurezza.",
      youtubeQuery: "allenamento palestra corretta esecuzione"
    };
  }

  // 1. Controllo esatto
  if (EXERCISE_GUIDES[exerciseName]) {
    return { name: exerciseName, ...EXERCISE_GUIDES[exerciseName] };
  }

  // 2. Controllo per inclusione nel nome
  const nameLower = exerciseName.toLowerCase();
  for (const [key, val] of Object.entries(EXERCISE_GUIDES)) {
    if (nameLower.includes(key.toLowerCase()) || key.toLowerCase().includes(nameLower)) {
      return { name: exerciseName, ...val };
    }
  }

  // 3. Fallback per pattern di parole chiave
  const fallbackMappings = [
    { k: ["panca", "chest", "spinte petto", "distensioni"], pattern: "bench_press", muscle: "Petto", sec: "Tricipiti, Spalle", eq: "Panca / Manubri" },
    { k: ["squat", "pressa", "leg press", "hack"], pattern: "squat", muscle: "Quadricipiti", sec: "Glutei", eq: "Bilanciere / Macchina" },
    { k: ["stacco", "deadlift", "rdl"], pattern: "deadlift", muscle: "Femorali/Lombari", sec: "Glutei", eq: "Bilanciere" },
    { k: ["trazioni", "lat", "pulldown", "pull down"], pattern: "pullup", muscle: "Dorsali", sec: "Bicipiti", eq: "Sbarra / Cavi" },
    { k: ["rematore", "row", "pulley"], pattern: "row", muscle: "Dorsali", sec: "Bicipiti, Dorso", eq: "Bilanciere / Cavi" },
    { k: ["lento", "military", "spalle", "shoulder", "alzate"], pattern: "overhead_press", muscle: "Spalle", sec: "Tricipiti", eq: "Bilanciere / Manubri" },
    { k: ["curl", "bicipiti"], pattern: "bicep_curl", muscle: "Bicipiti", sec: "Avambracci", eq: "Manubri / Bilanciere" },
    { k: ["pushdown", "french", "tricipiti", "dip"], pattern: "tricep_pushdown", muscle: "Tricipiti", sec: "Petto, Spalle", eq: "Cavi / Panca" },
    { k: ["hip thrust", "ponte", "glutei"], pattern: "hip_thrust", muscle: "Glutei", sec: "Femorali", eq: "Bilanciere / Panca" },
    { k: ["calf", "polpacci"], pattern: "calf_raise", muscle: "Polpacci", sec: "Caviglia", eq: "Macchina / Step" },
    { k: ["crunch", "plank", "addome", "addominali"], pattern: "crunch", muscle: "Addome", sec: "Core", eq: "Tappetino" }
  ];

  for (const map of fallbackMappings) {
    if (map.k.some(kw => nameLower.includes(kw))) {
      return {
        name: exerciseName,
        muscle: map.muscle,
        secondary: map.sec,
        equipment: map.eq,
        pattern: map.pattern,
        cues: [
          "Mantieni il core sempre contratto e la colonna vertebrale in sicurezza.",
          "Controlla la fase negativa (eccentrica) per almeno 2 secondi.",
          "Concentrati sulla connessione mente-muscolo senza strappi."
        ],
        mistake: "Sfruttare l'inerzia o rimbalzare per completare le ripetizioni.",
        youtubeQuery: `esecuzione ${exerciseName} tutorial`
      };
    }
  }

  // Fallback generico
  return {
    name: exerciseName,
    muscle: "Muscolo Target",
    secondary: "Stabilizzatori",
    equipment: "Palestra",
    pattern: "generic",
    cues: [
      "Mantieni una postura solida ed esegui il range di movimento completo.",
      "Espira nella fase di spinta o tirata e inspira nel ritorno.",
      "Fermati se avverti dolori articolari non muscolari."
    ],
    mistake: "Perdere il controllo del peso a metà ripetizione.",
    youtubeQuery: `esecuzione ${exerciseName} tutorial`
  };
};

/**
 * Genera l'illustrazione SVG dell'omino stilizzato da palestra con i muscoli target illuminati
 */
export const getStylizedExerciseSVG = (pattern, muscle) => {
  // Colore primario muscolo target = IronTrack neon yellow/green (#c8ff00)
  const targetColor = "#c8ff00";
  const bodyBaseColor = "#374151";
  const strokeColor = "#9ca3af";
  const benchColor = "#1f2937";
  const barColor = "#e5e7eb";

  let innerSvg = "";

  switch (pattern) {
    case "bench_press":
    case "incline_press":
      innerSvg = `
        <!-- Bench -->
        <line x1="50" y1="180" x2="250" y2="180" stroke="${benchColor}" stroke-width="12" stroke-linecap="round"/>
        <line x1="80" y1="186" x2="80" y2="230" stroke="#111827" stroke-width="10"/>
        <line x1="220" y1="186" x2="220" y2="230" stroke="#111827" stroke-width="10"/>
        <!-- Torso on Bench -->
        <ellipse cx="140" cy="170" rx="45" ry="14" fill="${bodyBaseColor}"/>
        <!-- PETTO TARGET (Glow) -->
        <ellipse cx="145" cy="165" rx="22" ry="10" fill="${targetColor}" filter="drop-shadow(0 0 8px ${targetColor})"/>
        <!-- Head -->
        <circle cx="85" cy="168" r="14" fill="${bodyBaseColor}" stroke="${strokeColor}" stroke-width="2"/>
        <!-- Legs bent to floor -->
        <polyline points="180,172 215,190 225,230" fill="none" stroke="${bodyBaseColor}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- Arms pressing bar up -->
        <polyline points="145,165 130,125 145,95" fill="none" stroke="${bodyBaseColor}" stroke-width="8" stroke-linecap="round"/>
        <polyline points="145,165 160,125 145,95" fill="none" stroke="${bodyBaseColor}" stroke-width="8" stroke-linecap="round"/>
        <!-- Tricipiti accent -->
        <circle cx="130" cy="125" r="5" fill="#60a5fa"/>
        <!-- Barbell + Weights -->
        <line x1="70" y1="95" x2="220" y2="95" stroke="${barColor}" stroke-width="5"/>
        <rect x="75" y="78" width="10" height="34" rx="2" fill="#ef4444"/>
        <rect x="205" y="78" width="10" height="34" rx="2" fill="#ef4444"/>
        <!-- Motion Arrows -->
        <path d="M145,115 L145,80" stroke="${targetColor}" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow)"/>
      `;
      break;

    case "squat":
      innerSvg = `
        <!-- Floor -->
        <line x1="40" y1="230" x2="260" y2="230" stroke="#1f2937" stroke-width="4"/>
        <!-- Head -->
        <circle cx="150" cy="90" r="14" fill="${bodyBaseColor}" stroke="${strokeColor}" stroke-width="2"/>
        <!-- Torso upright/inclined -->
        <path d="M150,104 L145,165" stroke="${bodyBaseColor}" stroke-width="18" stroke-linecap="round"/>
        <!-- Barbell on Traps -->
        <line x1="80" y1="105" x2="220" y2="105" stroke="${barColor}" stroke-width="6"/>
        <rect x="85" y="85" width="12" height="40" rx="3" fill="#ef4444"/>
        <rect x="203" y="85" width="12" height="40" rx="3" fill="#ef4444"/>
        <!-- Arms holding bar -->
        <polyline points="140,110 115,108 110,105" fill="none" stroke="${bodyBaseColor}" stroke-width="6" stroke-linecap="round"/>
        <polyline points="160,110 185,108 190,105" fill="none" stroke="${bodyBaseColor}" stroke-width="6" stroke-linecap="round"/>
        <!-- QUADRICIPITI & GLUTEI TARGET -->
        <!-- Femore (Thigh deep parallel) -->
        <line x1="145" y1="165" x2="195" y2="175" stroke="${targetColor}" stroke-width="16" stroke-linecap="round" filter="drop-shadow(0 0 8px ${targetColor})"/>
        <!-- Glutes -->
        <circle cx="140" cy="168" r="14" fill="${targetColor}" filter="drop-shadow(0 0 6px ${targetColor})"/>
        <!-- Tibia (Calf) down to foot -->
        <polyline points="195,175 190,228 175,230" fill="none" stroke="${bodyBaseColor}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- Motion Arrow -->
        <path d="M150,65 L150,85" stroke="${targetColor}" stroke-width="2" stroke-dasharray="3,3"/>
      `;
      break;

    case "deadlift":
      innerSvg = `
        <!-- Floor -->
        <line x1="40" y1="230" x2="260" y2="230" stroke="#1f2937" stroke-width="4"/>
        <!-- Head -->
        <circle cx="190" cy="95" r="14" fill="${bodyBaseColor}" stroke="${strokeColor}" stroke-width="2"/>
        <!-- Torso Hinge (Flat Back) -->
        <line x1="190" y1="108" x2="135" y2="155" stroke="${bodyBaseColor}" stroke-width="16" stroke-linecap="round"/>
        <!-- LOMBARI TARGET -->
        <line x1="165" y1="130" x2="135" y2="155" stroke="${targetColor}" stroke-width="14" stroke-linecap="round" filter="drop-shadow(0 0 8px ${targetColor})"/>
        <!-- GLUTEI & FEMORALI TARGET -->
        <polyline points="135,155 160,195 155,230" fill="none" stroke="${targetColor}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" filter="drop-shadow(0 0 6px ${targetColor})"/>
        <!-- Arms hanging straight down -->
        <line x1="185" y1="115" x2="185" y2="185" stroke="${bodyBaseColor}" stroke-width="7" stroke-linecap="round"/>
        <!-- Barbell at shins -->
        <line x1="120" y1="185" x2="245" y2="185" stroke="${barColor}" stroke-width="6"/>
        <circle cx="130" cy="185" r="24" fill="#ef4444" stroke="#111" stroke-width="2"/>
        <circle cx="235" cy="185" r="24" fill="#ef4444" stroke="#111" stroke-width="2"/>
        <!-- Arrow up -->
        <path d="M185,160 L185,130" stroke="${targetColor}" stroke-width="3" stroke-dasharray="3,3"/>
      `;
      break;

    case "pullup":
    case "lat_pulldown":
      innerSvg = `
        <!-- Pullup Bar / Cable -->
        <line x1="60" y1="45" x2="240" y2="45" stroke="${barColor}" stroke-width="8" stroke-linecap="round"/>
        <!-- Arms pulling up -->
        <polyline points="150,115 110,80 90,45" fill="none" stroke="${bodyBaseColor}" stroke-width="8" stroke-linecap="round"/>
        <polyline points="150,115 190,80 210,45" fill="none" stroke="${bodyBaseColor}" stroke-width="8" stroke-linecap="round"/>
        <!-- Bicipiti Accent -->
        <circle cx="110" cy="80" r="6" fill="#60a5fa"/>
        <circle cx="190" cy="80" r="6" fill="#60a5fa"/>
        <!-- Head -->
        <circle cx="150" cy="85" r="14" fill="${bodyBaseColor}" stroke="${strokeColor}" stroke-width="2"/>
        <!-- DORSALI V-SHAPE TARGET -->
        <path d="M130,115 L170,115 L158,170 L142,170 Z" fill="${targetColor}" filter="drop-shadow(0 0 10px ${targetColor})"/>
        <!-- Torso & Legs hanging -->
        <line x1="150" y1="170" x2="150" y2="230" stroke="${bodyBaseColor}" stroke-width="12" stroke-linecap="round"/>
        <!-- Upward Arrow -->
        <path d="M150,140 L150,60" stroke="${targetColor}" stroke-width="2" stroke-dasharray="3,3"/>
      `;
      break;

    case "overhead_press":
    case "lateral_raise":
      innerSvg = `
        <!-- Floor -->
        <line x1="60" y1="230" x2="240" y2="230" stroke="#1f2937" stroke-width="4"/>
        <!-- Standing legs & Torso -->
        <line x1="150" y1="165" x2="140" y2="230" stroke="${bodyBaseColor}" stroke-width="12" stroke-linecap="round"/>
        <line x1="150" y1="165" x2="160" y2="230" stroke="${bodyBaseColor}" stroke-width="12" stroke-linecap="round"/>
        <line x1="150" y1="105" x2="150" y2="170" stroke="${bodyBaseColor}" stroke-width="16" stroke-linecap="round"/>
        <!-- Head -->
        <circle cx="150" cy="85" r="14" fill="${bodyBaseColor}" stroke="${strokeColor}" stroke-width="2"/>
        <!-- SPALLE / DELTOIDI TARGET (Glow) -->
        <circle cx="130" cy="105" r="12" fill="${targetColor}" filter="drop-shadow(0 0 8px ${targetColor})"/>
        <circle cx="170" cy="105" r="12" fill="${targetColor}" filter="drop-shadow(0 0 8px ${targetColor})"/>
        <!-- Arms Pressing Overhead -->
        <polyline points="130,105 120,70 135,45" fill="none" stroke="${bodyBaseColor}" stroke-width="7" stroke-linecap="round"/>
        <polyline points="170,105 180,70 165,45" fill="none" stroke="${bodyBaseColor}" stroke-width="7" stroke-linecap="round"/>
        <!-- Barbell / Dumbbells -->
        <line x1="90" y1="45" x2="210" y2="45" stroke="${barColor}" stroke-width="5"/>
        <rect x="95" y="32" width="10" height="26" rx="2" fill="#ef4444"/>
        <rect x="195" y="32" width="10" height="26" rx="2" fill="#ef4444"/>
      `;
      break;

    case "row":
      innerSvg = `
        <!-- Floor -->
        <line x1="40" y1="230" x2="260" y2="230" stroke="#1f2937" stroke-width="4"/>
        <!-- Torso 45 deg -->
        <line x1="190" y1="110" x2="140" y2="160" stroke="${bodyBaseColor}" stroke-width="16" stroke-linecap="round"/>
        <circle cx="200" cy="95" r="14" fill="${bodyBaseColor}" stroke="${strokeColor}" stroke-width="2"/>
        <!-- DORSALI / RETRO TARGET -->
        <line x1="175" y1="125" x2="145" y2="155" stroke="${targetColor}" stroke-width="14" stroke-linecap="round" filter="drop-shadow(0 0 8px ${targetColor})"/>
        <!-- Legs bent -->
        <polyline points="140,160 160,195 155,230" fill="none" stroke="${bodyBaseColor}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- Arm pulling elbow up -->
        <polyline points="180,118 175,145 160,135" fill="none" stroke="${bodyBaseColor}" stroke-width="7" stroke-linecap="round"/>
        <!-- Barbell pulled to stomach -->
        <circle cx="160" cy="145" r="14" fill="#ef4444"/>
        <!-- Motion Arrow -->
        <path d="M170,170 L160,145" stroke="${targetColor}" stroke-width="2" stroke-dasharray="3,3"/>
      `;
      break;

    case "bicep_curl":
      innerSvg = `
        <!-- Standing figure -->
        <line x1="50" y1="230" x2="250" y2="230" stroke="#1f2937" stroke-width="4"/>
        <line x1="140" y1="155" x2="135" y2="230" stroke="${bodyBaseColor}" stroke-width="12" stroke-linecap="round"/>
        <line x1="140" y1="155" x2="150" y2="230" stroke="${bodyBaseColor}" stroke-width="12" stroke-linecap="round"/>
        <line x1="140" y1="95" x2="140" y2="160" stroke="${bodyBaseColor}" stroke-width="16" stroke-linecap="round"/>
        <circle cx="140" cy="75" r="14" fill="${bodyBaseColor}" stroke="${strokeColor}" stroke-width="2"/>
        <!-- Upper arm fixed at side -->
        <line x1="140" y1="95" x2="142" y2="135" stroke="${bodyBaseColor}" stroke-width="8" stroke-linecap="round"/>
        <!-- BICIPITE TARGET (Glow) -->
        <circle cx="148" cy="120" r="12" fill="${targetColor}" filter="drop-shadow(0 0 8px ${targetColor})"/>
        <!-- Forearm curled up -->
        <line x1="142" y1="135" x2="165" y2="105" stroke="${bodyBaseColor}" stroke-width="7" stroke-linecap="round"/>
        <!-- Dumbbell -->
        <circle cx="168" cy="100" r="10" fill="#ef4444"/>
        <!-- Arc Arrow -->
        <path d="M150,150 A 25 25 0 0 1 170,115" fill="none" stroke="${targetColor}" stroke-width="2" stroke-dasharray="2,2"/>
      `;
      break;

    case "tricep_pushdown":
      innerSvg = `
        <!-- Standing figure pushing cable -->
        <line x1="50" y1="230" x2="250" y2="230" stroke="#1f2937" stroke-width="4"/>
        <!-- Cable Line from Top -->
        <line x1="180" y1="30" x2="175" y2="120" stroke="#9ca3af" stroke-width="3"/>
        <line x1="135" y1="95" x2="135" y2="160" stroke="${bodyBaseColor}" stroke-width="16" stroke-linecap="round"/>
        <line x1="135" y1="160" x2="130" y2="230" stroke="${bodyBaseColor}" stroke-width="12" stroke-linecap="round"/>
        <circle cx="135" cy="75" r="14" fill="${bodyBaseColor}" stroke="${strokeColor}" stroke-width="2"/>
        <!-- Upper Arm glued to ribcage -->
        <line x1="135" y1="98" x2="140" y2="135" stroke="${bodyBaseColor}" stroke-width="8"/>
        <!-- TRICIPITE TARGET (Back of arm) -->
        <line x1="132" y1="102" x2="136" y2="132" stroke="${targetColor}" stroke-width="10" stroke-linecap="round" filter="drop-shadow(0 0 8px ${targetColor})"/>
        <!-- Forearm pushing down -->
        <line x1="140" y1="135" x2="170" y2="160" stroke="${bodyBaseColor}" stroke-width="7" stroke-linecap="round"/>
        <rect x="165" y="155" width="12" height="10" rx="2" fill="#ef4444"/>
        <path d="M160,130 L170,160" stroke="${targetColor}" stroke-width="2" stroke-dasharray="2,2"/>
      `;
      break;

    case "dips":
      innerSvg = `
        <!-- Parallel Bars -->
        <line x1="80" y1="130" x2="220" y2="130" stroke="${benchColor}" stroke-width="8" stroke-linecap="round"/>
        <line x1="110" y1="130" x2="110" y2="230" stroke="#111827" stroke-width="8"/>
        <line x1="190" y1="130" x2="190" y2="230" stroke="#111827" stroke-width="8"/>
        <!-- Torso slightly forward -->
        <line x1="150" y1="85" x2="145" y2="155" stroke="${bodyBaseColor}" stroke-width="16" stroke-linecap="round"/>
        <circle cx="155" cy="65" r="14" fill="${bodyBaseColor}" stroke="${strokeColor}" stroke-width="2"/>
        <!-- PETTO & TRICIPITI TARGET -->
        <circle cx="160" cy="100" r="10" fill="${targetColor}" filter="drop-shadow(0 0 8px ${targetColor})"/>
        <line x1="135" y1="88" x2="130" y2="115" stroke="${targetColor}" stroke-width="8" stroke-linecap="round" filter="drop-shadow(0 0 6px ${targetColor})"/>
        <!-- Arms on Bar -->
        <polyline points="145,85 125,115 130,130" fill="none" stroke="${bodyBaseColor}" stroke-width="7" stroke-linecap="round"/>
        <!-- Legs bent back -->
        <polyline points="145,155 135,190 145,210" fill="none" stroke="${bodyBaseColor}" stroke-width="10" stroke-linecap="round"/>
      `;
      break;

    case "hip_thrust":
      innerSvg = `
        <!-- Bench -->
        <rect x="60" y="140" width="45" height="70" rx="4" fill="${benchColor}"/>
        <!-- Upper Back on Bench -->
        <circle cx="95" cy="130" r="12" fill="${bodyBaseColor}" stroke="${strokeColor}" stroke-width="2"/>
        <!-- Torso horizontal at top -->
        <line x1="95" y1="140" x2="160" y2="140" stroke="${bodyBaseColor}" stroke-width="14" stroke-linecap="round"/>
        <!-- GLUTEI TARGET (Glow) -->
        <circle cx="155" cy="140" r="14" fill="${targetColor}" filter="drop-shadow(0 0 10px ${targetColor})"/>
        <!-- Barbell on Hips -->
        <circle cx="155" cy="130" r="14" fill="#ef4444"/>
        <line x1="130" y1="130" x2="180" y2="130" stroke="${barColor}" stroke-width="5"/>
        <!-- Legs 90 deg down to floor -->
        <polyline points="160,140 185,140 185,210 200,210" fill="none" stroke="${bodyBaseColor}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="50" y1="210" x2="240" y2="210" stroke="#1f2937" stroke-width="4"/>
        <path d="M155,160 L155,135" stroke="${targetColor}" stroke-width="2" stroke-dasharray="2,2"/>
      `;
      break;

    case "leg_extension":
    case "leg_curl":
      innerSvg = `
        <!-- Machine seat -->
        <rect x="90" y="140" width="55" height="15" rx="3" fill="${benchColor}"/>
        <rect x="75" y="90" width="15" height="65" rx="3" fill="${benchColor}"/>
        <!-- Figure Seated -->
        <circle cx="100" cy="75" r="14" fill="${bodyBaseColor}" stroke="${strokeColor}" stroke-width="2"/>
        <line x1="95" y1="90" x2="105" y2="140" stroke="${bodyBaseColor}" stroke-width="14" stroke-linecap="round"/>
        <!-- Thigh on seat -->
        <line x1="105" y1="140" x2="150" y2="140" stroke="${bodyBaseColor}" stroke-width="14" stroke-linecap="round"/>
        <!-- QUADRICIPITI / FEMORALI TARGET -->
        <line x1="110" y1="135" x2="148" y2="135" stroke="${targetColor}" stroke-width="12" stroke-linecap="round" filter="drop-shadow(0 0 8px ${targetColor})"/>
        <!-- Lower leg kicking out -->
        <line x1="150" y1="140" x2="185" y2="155" stroke="${bodyBaseColor}" stroke-width="10" stroke-linecap="round"/>
        <circle cx="180" cy="155" r="8" fill="#ef4444"/>
      `;
      break;

    case "calf_raise":
      innerSvg = `
        <!-- Step -->
        <rect x="130" y="210" width="60" height="20" rx="2" fill="${benchColor}"/>
        <line x1="50" y1="230" x2="250" y2="230" stroke="#1f2937" stroke-width="4"/>
        <!-- Standing tall on tiptoes -->
        <circle cx="150" cy="65" r="14" fill="${bodyBaseColor}" stroke="${strokeColor}" stroke-width="2"/>
        <line x1="150" y1="80" x2="150" y2="140" stroke="${bodyBaseColor}" stroke-width="16" stroke-linecap="round"/>
        <line x1="150" y1="140" x2="150" y2="180" stroke="${bodyBaseColor}" stroke-width="14" stroke-linecap="round"/>
        <!-- POLPACCI TARGET (Glow) -->
        <ellipse cx="150" cy="185" rx="9" ry="16" fill="${targetColor}" filter="drop-shadow(0 0 8px ${targetColor})"/>
        <!-- Ankle extended high -->
        <polyline points="150,195 155,210 170,210" fill="none" stroke="${bodyBaseColor}" stroke-width="8" stroke-linecap="round"/>
        <path d="M150,165 L150,140" stroke="${targetColor}" stroke-width="2" stroke-dasharray="2,2"/>
      `;
      break;

    case "crunch":
    case "plank":
      innerSvg = `
        <!-- Mat Floor -->
        <line x1="40" y1="200" x2="260" y2="200" stroke="#1f2937" stroke-width="6" stroke-linecap="round"/>
        <!-- Planking / Crunch Figure -->
        <line x1="75" y1="180" x2="175" y2="150" stroke="${bodyBaseColor}" stroke-width="14" stroke-linecap="round"/>
        <circle cx="200" cy="140" r="14" fill="${bodyBaseColor}" stroke="${strokeColor}" stroke-width="2"/>
        <!-- ADDOME TARGET (Glow) -->
        <line x1="130" y1="162" x2="165" y2="152" stroke="${targetColor}" stroke-width="14" stroke-linecap="round" filter="drop-shadow(0 0 10px ${targetColor})"/>
        <!-- Arms and legs on ground -->
        <polyline points="175,150 185,180 195,198" fill="none" stroke="${bodyBaseColor}" stroke-width="6" stroke-linecap="round"/>
        <polyline points="75,180 65,198" fill="none" stroke="${bodyBaseColor}" stroke-width="8" stroke-linecap="round"/>
      `;
      break;

    default: // Generic Athlete silhouette
      innerSvg = `
        <!-- Floor Glow -->
        <ellipse cx="150" cy="225" rx="70" ry="12" fill="rgba(200,255,0,0.1)"/>
        <!-- Athlete Mannequin Standing -->
        <circle cx="150" cy="65" r="16" fill="${bodyBaseColor}" stroke="${strokeColor}" stroke-width="2"/>
        <!-- Torso -->
        <path d="M135,85 L165,85 L158,150 L142,150 Z" fill="${bodyBaseColor}" stroke="${strokeColor}" stroke-width="2"/>
        <!-- Target Glow on Core / Muscle -->
        <circle cx="150" cy="115" r="18" fill="${targetColor}" filter="drop-shadow(0 0 10px ${targetColor})"/>
        <!-- Arms -->
        <line x1="135" y1="88" x2="115" y2="140" stroke="${bodyBaseColor}" stroke-width="8" stroke-linecap="round"/>
        <line x1="165" y1="88" x2="185" y2="140" stroke="${bodyBaseColor}" stroke-width="8" stroke-linecap="round"/>
        <!-- Legs -->
        <line x1="145" y1="150" x2="135" y2="220" stroke="${bodyBaseColor}" stroke-width="12" stroke-linecap="round"/>
        <line x1="155" y1="150" x2="165" y2="220" stroke="${bodyBaseColor}" stroke-width="12" stroke-linecap="round"/>
      `;
      break;
  }

  return `
    <svg class="stylized-exercise-svg" viewBox="0 0 300 250" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 200px; display: block; margin: 0 auto; background: radial-gradient(circle at center, rgba(30, 41, 59, 0.7) 0%, rgba(10, 15, 26, 0.95) 100%); border-radius: 14px; border: 1px solid rgba(255,255,255,0.08);">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="${targetColor}"/>
        </marker>
      </defs>
      ${innerSvg}
    </svg>
  `;
};

/**
 * Mostra la modale Bottom-Sheet dell'Esercizio con Omino Stilizzato + Dettagli + Tasto Video YouTube
 */
export const openExerciseGuideModal = (exerciseName) => {
  const guide = getExerciseGuide(exerciseName);
  const svgIllustration = getStylizedExerciseSVG(guide.pattern, guide.muscle);
  const ytSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(guide.youtubeQuery || ('esecuzione ' + exerciseName))}`;

  // Rimuovi modali aperte se presenti
  const existing = document.getElementById('exercise-guide-modal');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'exercise-guide-modal';
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 99999;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 0;
    animation: fadeIn 0.25s ease-out;
  `;

  overlay.innerHTML = `
    <div class="card exercise-guide-card" style="
      width: 100%;
      max-width: 520px;
      max-height: 90vh;
      overflow-y: auto;
      margin: 0;
      border-radius: 24px 24px 0 0;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-bottom: none;
      background: #11151c;
      box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.8);
      padding: 24px 20px 30px;
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    ">
      <!-- Handle bar per tocco -->
      <div style="width: 44px; height: 5px; background: rgba(255,255,255,0.2); border-radius: 3px; margin: 0 auto 16px;"></div>

      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1px; color: var(--accent-color); font-weight: 800; background: rgba(200,255,0,0.12); padding: 3px 8px; border-radius: 6px;">${guide.muscle}</span>
            <span style="font-size: 0.72rem; color: #94a3b8; background: rgba(255,255,255,0.05); padding: 3px 8px; border-radius: 6px;">🏋️ ${guide.equipment}</span>
          </div>
          <h2 style="font-size: 1.35rem; font-weight: 800; margin: 0; color: #fff; line-height: 1.2;">${guide.name}</h2>
          <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 4px;">Secondari: <span style="color: #cbd5e1;">${guide.secondary}</span></div>
        </div>
        <button id="close-guide-modal" style="background: rgba(255,255,255,0.08); border: none; color: #cbd5e1; width: 34px; height: 34px; border-radius: 50%; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; cursor: pointer;">✕</button>
      </div>

      <!-- Illustrazione Omino Stilizzato -->
      <div style="margin-bottom: 18px;">
        <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; display: flex; justify-content: space-between;">
          <span>Diagramma Esecuzione</span>
          <span style="color: var(--accent-color)">● Muscolo Target</span>
        </div>
        ${svgIllustration}
      </div>

      <!-- Istruzioni / Cues di Esecuzione -->
      <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 14px; padding: 14px 16px; margin-bottom: 16px;">
        <div style="font-size: 0.82rem; font-weight: 700; color: var(--accent-color); margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
          <span>🎯</span> Punti Chiave dell'Esecuzione:
        </div>
        <ul style="margin: 0; padding-left: 18px; font-size: 0.84rem; line-height: 1.5; color: #e2e8f0; display: flex; flex-direction: column; gap: 6px;">
          ${guide.cues.map(c => `<li>${c}</li>`).join('')}
        </ul>
      </div>

      ${guide.mistake ? `
        <!-- Errore comune -->
        <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 12px; padding: 10px 14px; margin-bottom: 20px; display: flex; align-items: flex-start; gap: 10px;">
          <span style="font-size: 1.1rem; line-height: 1;">⚠️</span>
          <div style="font-size: 0.8rem; line-height: 1.4; color: #fca5a5;">
            <strong style="color: #ef4444;">Errore comune:</strong> ${guide.mistake}
          </div>
        </div>
      ` : ''}

      <!-- Azione YouTube Video -->
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <a href="${ytSearchUrl}" target="_blank" rel="noopener noreferrer" class="btn" style="
          background: #ff0000;
          color: #ffffff;
          font-weight: 700;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          text-decoration: none;
          box-shadow: 0 4px 15px rgba(255, 0, 0, 0.35);
          padding: 14px;
          border-radius: 14px;
        ">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          Guarda Video Tutorial su YouTube ↗
        </a>

        <button id="btn-close-modal-bottom" class="btn btn-secondary" style="font-size: 0.9rem; padding: 12px; border-radius: 14px;">
          Chiudi Guida
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const closeModal = () => {
    const card = overlay.querySelector('.exercise-guide-card');
    if (card) card.style.animation = 'slideDown 0.25s ease-in forwards';
    overlay.style.animation = 'fadeOut 0.25s ease-in forwards';
    setTimeout(() => overlay.remove(), 250);
  };

  overlay.querySelector('#close-guide-modal').addEventListener('click', closeModal);
  overlay.querySelector('#btn-close-modal-bottom').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
};
