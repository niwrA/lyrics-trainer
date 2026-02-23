/**
 * Internationalization composable
 */

import type { Lang, Messages } from "../types";

const messages: Record<Lang, Messages> = {
  en: {
    appTitle: "Lyrics Trainer",
    appSubtitle:
      "Practice lyrics: next-line (MCQ), cloze, or typing. Source: paste or JSON.",
    resetSession: "Reset session",
    exportSongsJson: "Export songs JSON",

    sourceAndSongs: "Songs",
    tabLibrary: "JSON library",
    tabPaste: "Paste lyrics",
    tabJsonImport: "JSON import",

    sortBy: "Sort by",
    sortTitle: "Title",
    sortArtist: "Artist",
    sortCreatedAt: "Date added",
    sortLines: "# lines",
    sortAsc: "↑",
    sortDesc: "↓",

    search: "Search",
    searchPlaceholder: "search title/artist/album...",
    linesCount: "{n} lines",
    tipAddSongs: 'Tip: add songs via "Paste lyrics" or "JSON import".',

    title: "Title",
    titlePlaceholder: "e.g. Yo soy la milonga criolla",
    artist: "Artist",
    album: "Album",
    optional: "optional",

    edit: "Edit",
    editSong: "Edit song",
    editSongJson: "Edit song data (JSON)",
    saveChanges: "Save changes",
    cancel: "Cancel",
    jsonFormatHelp: "JSON format help (opens in new tab)",
    editModeRaw: "Raw JSON",
    editModeVisual: "Visual Editor",
    selectWordsForTranslation: "Select words in the lyrics to add translations",
    addTranslation: "Add Translation",
    addVocab: "Add to vocabulary",
    vocabularyItems: "Vocabulary items",

    pasteFullLyrics: "Paste the full lyrics",
    pastePlaceholder: "Paste the lyrics here...",
    addToLibrary: "Add to library",
    clear: "Clear",
    pasteHint: "Lines are split by newline; empty lines are ignored.",

    pasteJson: "Paste JSON (songs[])",
    jsonPlaceholder: '[{"id":"...","title":"...","lines":["..."]}]',
    import: "Import",
    jsonSchemaExampleTitle: "JSON schema example",

    training: "Training",
    chooseSongFirst: "First choose a song from the library, or add one.",
    delete: "Delete",

    exerciseAndOptions: "Settings",
    uiLanguage: "UI language",
    exercise: "Exercise",
    mode: "Mode",
    modeNextLine: "Next line",
    modeCloze: "Fill blanks (cloze)",
    modeType: "Type (whole line)",
    modeVocabulary: "Word meanings",

    tabAbout: "About",
    aboutTitle: "About Lyrics Trainer",
    aboutP1:
      "Lyrics Trainer is a free, browser-based tool for practicing song lyrics. You can train with next-line questions, fill-in-the-blanks (cloze), and typing exercises.",
    aboutP2:
      "All lyrics are provided by you and stored locally in your browser. No accounts are required, nothing is uploaded, and no tracking or analytics are used.",
    aboutP3:
      "It is designed for language learners, singers, performers, and anyone who wants to memorize lyrics more effectively.",

    order: "Order",
    orderSequence: "In order",
    orderRandom: "Random",

    optionCount: "# options",

    nextLineInput: "Next-line input",
    inputChoice: "Choose (MCQ)",
    inputType: "Type",

    clozeStartMissing: "Start missing (# words)",
    clozeMaxMissing: "Max missing (# words)",
    clozeProgression: "Increase difficulty after correct",
    clozeInput: "Cloze input",
    on: "On",
    off: "Off",

    showClozeTarget: "Show target word (helper)",
    targetWordHelper: "Target word (helper)",

    typeMode: "Typing mode",
    typeNextLine: "Type next line",
    typeCurrentLine: "Type current line",
    showHintLine: "Show hint line",

    normalization: "Comparison",
    normStrict: "Strict",
    normBasic: "Ignore case/spaces",
    normPunct: "Ignore case/spaces/punctuation",

    newQuestion: "New question",
    showAnswer: "Show answer",
    hideAnswer: "Hide answer",

    prompt: "Prompt",
    answer: "Answer",

    chooseNextLine: "Next line",
    fillMissingWords: "Fill the missing words",

    clozeChoiceHint: "Click the correct word per blank. (One blank at a time)",
    clozeTypeHint:
      "Type all missing words (separated by spaces). Order matters.",

    blank: "Blank",
    blankOf: "{i} / {n}",

    typeHere: "type here...",
    check: "Check",

    typeHintLine: "Hint: the prompt above is the line you need to type.",

    good: "Correct!",
    notGood: "Incorrect.",
    youTypedLabel: "You typed",
    correctLabel: "Correct",
    expectedLabel: "Expected",

    wordCorrect: "Correct word!",
    wordIncorrect: "Incorrect word.",
    clozeCorrect: "Cloze: correct!",
    clozeIncorrect: "Cloze: incorrect.",

    statsScore: "Score",
    statsClozeDifficulty: "Cloze difficulty",
    statsLineIndex: "Line index",

    scoreLine: "{ok}/{total} (correct / total)",
    scoreLineShort: "{ok} / {total}",
    missingWords: "{n} words missing",
    indexOf: "{i} / {n}",

    sessionReset: "Session reset.",
    songAdded: "Song added.",
    songUpdated: "Song updated.",
    jsonExportStarted: "JSON export started (download).",
    jsonPasteFirst: "Paste JSON first.",
    jsonParseError: "JSON parse error.",
    noValidSongs: "No valid songs found in JSON.",
    importedSongs: "Imported: {n} songs.",
    importedSongSets: "Imported: {n} song sets.",
    noSetSelected: "No song set selected.",
    provideTitle: "Please provide a title.",
    pasteLyricsFirst: "Paste lyrics first.",
    tooFewLines: "Too few lines. Make sure the text has multiple lines.",
    continue: "Continue",
    tryAgain: "Try again",

    importFromFile: "Import from file",
    fileLoaded: "File loaded: {name}",
    fileReadError: "Error reading file.",
    or: "or",

    vocabularyHint: "Choose the correct meaning.",
    vocabularyWord: "Word",
    vocabularyTranslation: "Translation",
    vocabularyExplanation: "Explanation",
    noVocabulary:
      "No vocabulary data for this song. Add words and translations/explanations via JSON.",
    manageVocabulary: "Manage vocabulary",

    songSets: "Song Sets",
    newSet: "New Set",
    setName: "Set name",
    setNamePlaceholder: "e.g. Spanish Classics",
    deleteSet: "Delete set",
    renameSet: "Rename set",
    selectSet: "Select a song set",

    footer:
      "Local in your browser (localStorage). No network. JSON import/export available.",

    // Onboarding/Help
    helpButton: "Help & Getting Started",
    onboardingTitle: "Getting Started with Lyrics Trainer",
    onboardingWelcome: "Welcome to Lyrics Trainer!",
    onboardingWelcomeDesc:
      "Learn song lyrics effectively with interactive exercises. Here's how to get started:",
    onboardingStep1: "Step 1: Add Your First Song",
    onboardingStep1Desc: "Start by adding a song to your library:",
    onboardingStep1a: 'Go to the "Songs" tab',
    onboardingStep1b: 'Choose "Paste lyrics" or "JSON import"',
    onboardingStep1c: 'Paste the song lyrics and click "Add to library"',
    onboardingStep2: "Step 2: Choose an Exercise Mode",
    onboardingStep2Desc:
      "Go to Training tab and select your preferred exercise type:",
    onboardingMode1:
      "Answer MCQ or type the next line after seeing the current line",
    onboardingMode2:
      "Fill in missing words. Start with 1-2 blanks and increase difficulty as you improve",
    onboardingMode3: "Type the entire line from scratch",
    onboardingMode4:
      "Learn word meanings and translations for vocabulary practice",
    onboardingTips: "💡 Quick Tips",
    onboardingTip1:
      "Try 'Fill blanks (cloze)' with random order for best learning",
    onboardingTip2:
      "Show answer to learn from mistakes before continuing",
    onboardingTip3:
      "Adjust difficulty and settings to match your learning pace",
    gotIt: "Got it!",

    modeSettings: "Mode Settings",
    noModeSettings: "No additional settings for this mode.",
  },
  es: {
    appTitle: "Entrenador de Letras",
    appSubtitle:
      "Practica letras: siguiente línea (MCQ), cloze o escribir. Fuente: pegar o JSON.",
    resetSession: "Reiniciar sesión",
    exportSongsJson: "Exportar songs JSON",

    sourceAndSongs: "Canciones",
    tabLibrary: "Biblioteca JSON",
    tabPaste: "Pegar letra",
    tabJsonImport: "Importar JSON",

    sortBy: "Ordenar por",
    sortTitle: "Título",
    sortArtist: "Artista",
    sortCreatedAt: "Fecha",
    sortLines: "# líneas",
    sortAsc: "↑",
    sortDesc: "↓",

    search: "Buscar",
    searchPlaceholder: "buscar título/artista/álbum...",
    linesCount: "{n} líneas",
    tipAddSongs:
      "Consejo: añade canciones con 'Pegar letra' o 'Importar JSON'.",

    title: "Título",
    titlePlaceholder: "p.ej. Yo soy la milonga criolla",
    artist: "Artista",
    album: "Álbum",
    optional: "opcional",

    edit: "Editar",
    editSong: "Editar canción",
    editSongJson: "Editar datos de canción (JSON)",
    saveChanges: "Guardar cambios",
    cancel: "Cancelar",
    jsonFormatHelp: "Ayuda de formato JSON (abre en una pestaña nueva)",
    editModeRaw: "JSON sin procesar",
    editModeVisual: "Editor visual",
    selectWordsForTranslation:
      "Selecciona palabras en la letra para agregar traducciones",
    addTranslation: "Agregar traducción",
    addVocab: "Agregar al vocabulario",
    vocabularyItems: "Elementos de vocabulario",

    pasteFullLyrics: "Pega la letra completa",
    pastePlaceholder: "Pega la letra aquí...",
    addToLibrary: "Añadir a la biblioteca",
    clear: "Vaciar",
    pasteHint:
      "Las líneas se separan por salto de línea; se ignoran las vacías.",

    pasteJson: "Pega JSON (songs[])",
    jsonPlaceholder: '[{"id":"...","title":"...","lines":["..."]}]',
    import: "Importar",
    jsonSchemaExampleTitle: "Ejemplo de esquema JSON",

    training: "Práctica",
    chooseSongFirst: "Primero elige una canción de la biblioteca o añade una.",
    delete: "Eliminar",

    exerciseAndOptions: "Opciones",
    uiLanguage: "Idioma de la UI",
    exercise: "Ejercicio",
    mode: "Modo",
    modeNextLine: "Siguiente línea",
    modeCloze: "Completar huecos (cloze)",
    modeType: "Escribir (línea completa)",
    modeVocabulary: "Significados de palabras",

    tabAbout: "Acerca de",
    aboutTitle: "Acerca de Lyrics Trainer",
    aboutP1:
      "Lyrics Trainer es una herramienta gratuita en el navegador para practicar letras. Puedes entrenar con preguntas de la siguiente línea, completar huecos (cloze) y ejercicios de escritura.",
    aboutP2:
      "Todas las letras las proporcionas tú y se guardan localmente en tu navegador. No se necesitan cuentas, no se sube nada y no se usa seguimiento ni analítica.",
    aboutP3:
      "Está pensado para estudiantes de idiomas, cantantes, intérpretes y cualquiera que quiera memorizar letras de forma más eficaz.",

    order: "Orden",
    orderSequence: "En orden",
    orderRandom: "Aleatorio",

    optionCount: "# opciones",

    nextLineInput: "Entrada (siguiente línea)",
    inputChoice: "Elegir (MCQ)",
    inputType: "Escribir",

    clozeStartMissing: "Inicio (# palabras omitidas)",
    clozeMaxMissing: "Máximo (# palabras omitidas)",
    clozeProgression: "Aumentar dificultad al acertar",
    clozeInput: "Entrada cloze",
    on: "Activado",
    off: "Desactivado",

    showClozeTarget: "Mostrar palabra objetivo (ayuda)",
    targetWordHelper: "Palabra objetivo (ayuda)",

    typeMode: "Modo de escritura",
    typeNextLine: "Escribir la siguiente línea",
    typeCurrentLine: "Escribir la línea actual",
    showHintLine: "Mostrar pista",

    normalization: "Comparación",
    normStrict: "Estricto",
    normBasic: "Ignorar mayúsculas/espacios",
    normPunct: "Ignorar mayúsculas/espacios/puntuación",

    newQuestion: "Nueva pregunta",
    showAnswer: "Mostrar respuesta",
    hideAnswer: "Ocultar respuesta",

    prompt: "Contexto",
    answer: "Respuesta",

    chooseNextLine: "Siguiente línea",
    fillMissingWords: "Completa las palabras que faltan",

    clozeChoiceHint:
      "Haz clic en la palabra correcta por hueco. (Un hueco a la vez)",
    clozeTypeHint:
      "Escribe todas las palabras faltantes (separadas por espacios). El orden importa.",

    blank: "Hueco",
    blankOf: "{i} / {n}",

    typeHere: "escribe aquí...",
    check: "Comprobar",

    typeHintLine: "Pista: el texto de arriba es la línea que debes escribir.",

    good: "¡Correcto!",
    notGood: "Incorrecto.",
    youTypedLabel: "Escribiste",
    correctLabel: "Correcto",
    expectedLabel: "Esperado",

    wordCorrect: "¡Palabra correcta!",
    wordIncorrect: "Palabra incorrecta.",
    clozeCorrect: "Cloze: ¡correcto!",
    clozeIncorrect: "Cloze: incorrecto.",

    statsScore: "Puntuación",
    statsClozeDifficulty: "Dificultad cloze",
    statsLineIndex: "Índice",

    scoreLine: "{ok}/{total} (correctas/total)",
    scoreLineShort: "{ok} / {total}",
    missingWords: "{n} palabras omitidas",
    indexOf: "{i} / {n}",

    sessionReset: "Sesión reiniciada.",
    songAdded: "Canción añadida.",
    songUpdated: "Canción actualizada.",
    jsonExportStarted: "Exportación JSON iniciada (descarga).",
    jsonPasteFirst: "Primero pega el JSON.",
    jsonParseError: "Error al parsear JSON.",
    noValidSongs: "No se encontraron canciones válidas en el JSON.",
    importedSongs: "Importadas: {n} canciones.",
    importedSongSets: "Importados: {n} conjuntos de canciones.",
    noSetSelected: "No hay conjunto de canciones seleccionado.",
    provideTitle: "Indica un título.",
    pasteLyricsFirst: "Primero pega la letra.",
    tooFewLines: "Muy pocas líneas. Asegúrate de tener varias líneas.",
    continue: "Continuar",
    tryAgain: "Intentar de nuevo",

    importFromFile: "Importar desde archivo",
    fileLoaded: "Archivo cargado: {name}",
    fileReadError: "Error al leer el archivo.",
    or: "o",

    vocabularyHint: "Elige el significado correcto.",
    vocabularyWord: "Palabra",
    vocabularyTranslation: "Traducción",
    vocabularyExplanation: "Explicación",
    noVocabulary:
      "Sin datos de vocabulario para esta canción. Añade palabras y traducciones/explicaciones mediante JSON.",
    manageVocabulary: "Gestionar vocabulario",

    songSets: "Conjuntos de canciones",
    newSet: "Nuevo conjunto",
    setName: "Nombre del conjunto",
    setNamePlaceholder: "p.ej. Clásicos españoles",
    deleteSet: "Eliminar conjunto",
    renameSet: "Renombrar conjunto",
    selectSet: "Selecciona un conjunto de canciones",

    footer:
      "Local en tu navegador (localStorage). Sin red. Importación/exportación JSON disponible.",

    // Onboarding/Help
    helpButton: "Ayuda y primeros pasos",
    onboardingTitle: "Primeros pasos con Lyrics Trainer",
    onboardingWelcome: "¡Bienvenido a Lyrics Trainer!",
    onboardingWelcomeDesc:
      "Aprende letras de canciones de forma efectiva con ejercicios interactivos. Aquí te mostramos cómo empezar:",
    onboardingStep1: "Paso 1: Añade tu primera canción",
    onboardingStep1Desc: "Comienza añadiendo una canción a tu biblioteca:",
    onboardingStep1a: 'Ve a la pestaña "Canciones"',
    onboardingStep1b: 'Elige "Pegar letra" o "Importar JSON"',
    onboardingStep1c:
      'Pega la letra de la canción y haz clic en "Añadir a la biblioteca"',
    onboardingStep2: "Paso 2: Elige un tipo de ejercicio",
    onboardingStep2Desc:
      "Ve a la pestaña Práctica y selecciona tu tipo de ejercicio preferido:",
    onboardingMode1:
      "Responde MCQ o escribe la siguiente línea después de ver la línea actual",
    onboardingMode2:
      "Completa palabras faltantes. Comienza con 1-2 huecos e incrementa la dificultad a medida que mejoras",
    onboardingMode3: "Escribe la línea completa desde cero",
    onboardingMode4:
      "Aprende significados de palabras y traducciones para práctica de vocabulario",
    onboardingTips: "💡 Consejos rápidos",
    onboardingTip1:
      "Prueba 'Completar huecos (cloze)' con orden aleatorio para un mejor aprendizaje",
    onboardingTip2:
      "Muestra la respuesta para aprender de los errores antes de continuar",
    onboardingTip3:
      "Ajusta la dificultad y configuración para que coincida con tu ritmo de aprendizaje",
    gotIt: "¡Entendido!",

    modeSettings: "Configuración de modo",
    noModeSettings: "Sin configuración adicional para este modo.",
  },
};

function formatParams(
  s: string,
  params?: Record<string, string | number>
): string {
  if (!params) return s;
  let out = s;
  for (const [k, v] of Object.entries(params))
    out = out.replaceAll(`{${k}}`, String(v));
  return out;
}

export function useI18n(uiLang: Lang | (() => Lang)) {
  const getLang = (): Lang =>
    typeof uiLang === "function" ? uiLang() : uiLang;

  // Plain function — Vue tracks reactive reads (e.g. settings.uiLang via getter)
  // during template/computed render, so language changes trigger re-renders.
  const t = (key: string, params?: Record<string, string | number>): string => {
    const lang = getLang();
    return formatParams(messages[lang]?.[key] ?? messages.en[key] ?? key, params);
  };

  return { t };
}
