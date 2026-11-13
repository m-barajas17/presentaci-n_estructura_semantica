const tagDetails = {
  header: { icon: "⌂", title: "La presentación", description: "Agrupa lo que introduce una página o una sección. Suele contener su título y, a veces, el nombre del sitio, autoría o una breve introducción.", usage: "En este ejemplo, «Pequeños mundos» y su subtítulo presentan el sitio.", tip: "Puede haber varios header en una página si cada uno pertenece a una sección distinta. head es otra etiqueta: guarda datos del documento." },
  nav: { icon: "↗", title: "Las rutas para moverse", description: "Agrupa enlaces importantes que llevan a otras páginas o partes del documento. Es el menú de rutas de la persona visitante.", usage: "En este ejemplo, «Explorar», «Historias» y «Acerca de» forman la navegación.", tip: "No hace falta envolver cada enlace con nav. Úsalo para un bloque principal de navegación, no para cualquier grupo de links." },
  main: { icon: "◎", title: "El contenido central", description: "Contiene el tema principal y exclusivo de esta página: lo que la distingue de las demás páginas del sitio.", usage: "Aquí reúne la historia principal sobre la tortuga y los temas relacionados.", tip: "Usa un main para el contenido principal visible. Deja fuera los elementos que se repiten por todo el sitio, como el menú global." },
  section: { icon: "▤", title: "Un capítulo temático", description: "Agrupa contenido que pertenece a un mismo tema. Ayuda a dividir un asunto grande en partes reconocibles.", usage: "«También te puede interesar» forma una sección de recomendaciones relacionadas.", tip: "Una section normalmente necesita un encabezado que nombre su tema. Para agrupar solo por estilo, usa un div." },
  article: { icon: "▣", title: "Una pieza que puede vivir sola", description: "Representa contenido relativamente independiente que conserva sentido al separarlo de la página, como una noticia, una publicación o una reseña.", usage: "La historia «El viaje de la tortuga verde» tiene título y contenido propios.", tip: "Un article puede incluir su propio header, secciones y footer. Puede estar dentro de main o de una sección temática." },
  aside: { icon: "◫", title: "Información complementaria", description: "Presenta algo relacionado con el tema cercano, pero secundario. La persona puede entender el contenido principal sin leerlo.", usage: "El «Dato del océano» complementa la historia sin ser parte esencial de ella.", tip: "Aside no quiere decir necesariamente «columna al lado». Lo importante es que el contenido sea complementario." },
  footer: { icon: "⌄", title: "El cierre", description: "Reúne información final de la página o del bloque al que pertenece, como autoría, enlaces relacionados o contacto.", usage: "El pie del ejemplo cierra el sitio con sus enlaces y derechos de autor.", tip: "Un footer puede cerrar todo el sitio o una pieza article. El contexto indica a qué parte pertenece." },
  h1: { icon: "H₁", title: "El tema principal", description: "Presenta el tema de mayor nivel en la página. Si lees solo este encabezado, deberías saber de qué trata el contenido principal.", usage: "«Océanos del mundo» es el tema general de este ejemplo.", tip: "El nombre h1 marca jerarquía, no tamaño. CSS puede hacer que un h1 se vea pequeño o un h3 muy grande." },
  h2: { icon: "H₂", title: "Un apartado del tema", description: "Divide el tema principal en una sección importante. Responde: ¿cuál es una de las grandes partes de este tema?", usage: "«Vida marina» es un apartado dentro de «Océanos del mundo».", tip: "Un h2 puede iniciar cada nueva sección principal. No lo elijas solo por el estilo visual." },
  h3: { icon: "H₃", title: "Un subtema", description: "Desarrolla un tema más específico dentro de un apartado h2. El nivel muestra esa relación entre ideas.", usage: "«Tortugas» se desarrolla dentro del apartado «Vida marina».", tip: "Usa h3 cuando el contenido depende de un h2. Si el esquema necesita h2 primero, no te lo saltes." },
  h4: { icon: "H₄", title: "Un detalle del subtema", description: "Abre una parte más específica dentro de un bloque h3. Continúa el esquema a un nivel inferior.", usage: "«La tortuga verde» es un detalle del tema «Tortugas».", tip: "HTML permite títulos hasta h6, pero no es necesario usar todos los niveles. Sigue la estructura real de tus ideas." }
};

const navItems = [...document.querySelectorAll(".nav-item")];
const slides = [...document.querySelectorAll(".slide")];
const progressFill = document.querySelector("#progressFill");
const progressCount = document.querySelector("#progressCount");
const nextSlide = document.querySelector("#nextSlide");
let currentSlide = 0;

function setCurrentSlide(index) {
  currentSlide = Math.max(0, Math.min(index, slides.length - 1));
  navItems.forEach((item, itemIndex) => {
    const active = itemIndex === currentSlide;
    item.classList.toggle("is-active", active);
    if (active) item.setAttribute("aria-current", "location");
    else item.removeAttribute("aria-current");
  });
  if (progressFill) progressFill.style.height = `${(currentSlide / (slides.length - 1)) * 100}%`;
  if (progressCount) progressCount.innerHTML = `${String(currentSlide).padStart(2, "0")} <i>/ ${String(slides.length - 1).padStart(2, "0")}</i>`;
  if (nextSlide) {
    nextSlide.setAttribute("aria-label", currentSlide === slides.length - 1 ? "Volver al inicio" : "Siguiente apartado");
    nextSlide.textContent = currentSlide === slides.length - 1 ? "↑" : "↓";
  }
}

const slideObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (visible) setCurrentSlide(slides.indexOf(visible.target));
}, { threshold: [0.2, 0.45, 0.7] });
slides.forEach((slide) => slideObserver.observe(slide));
navItems.forEach((item, index) => item.addEventListener("click", () => setCurrentSlide(index)));
nextSlide?.addEventListener("click", () => {
  const targetIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
  slides[targetIndex].scrollIntoView({ behavior: "smooth", block: "start" });
});

const inspector = {
  index: document.querySelector("#inspectorIndex"),
  icon: document.querySelector("#tagIcon"),
  chip: document.querySelector("#tagChip"),
  title: document.querySelector("#tagTitle"),
  description: document.querySelector("#tagDescription"),
  usage: document.querySelector("#tagUsage"),
  tip: document.querySelector("#tagTip")
};
const tagOrder = ["header", "nav", "main", "section", "article", "aside", "footer"];
function explainTag(tag) {
  const detail = tagDetails[tag];
  if (!detail) return;
  document.querySelectorAll("[data-tag].is-explained").forEach((button) => button.classList.remove("is-explained"));
  document.querySelectorAll(`[data-tag="${tag}"]`).forEach((button) => button.classList.add("is-explained"));
  document.querySelectorAll(".tag-select").forEach((button) => {
    const active = button.dataset.tag === tag;
    button.classList.toggle("selected", active);
    button.setAttribute("aria-pressed", String(active));
  });
  const tagIndex = tagOrder.includes(tag) ? tagOrder.indexOf(tag) + 1 : Number(tag.at(-1));
  const tagTotal = tagOrder.includes(tag) ? tagOrder.length : 4;
  if (inspector.index) inspector.index.textContent = `${String(tagIndex).padStart(2, "0")} / ${String(tagTotal).padStart(2, "0")}`;
  inspector.icon.textContent = detail.icon;
  inspector.chip.textContent = `<${tag}>`;
  inspector.title.textContent = detail.title;
  inspector.description.textContent = detail.description;
  inspector.usage.textContent = detail.usage;
  inspector.tip.textContent = detail.tip;
  const anatomy = document.querySelector("#anatomyInfo");
  if (anatomy) {
    anatomy.innerHTML = `<span class="info-eyebrow">ETIQUETA SELECCIONADA</span><span class="info-emoji">${detail.icon}</span><h3 class="info-title">&lt;${tag}&gt; · ${detail.title}</h3><p class="info-description">${detail.description}</p><div class="info-callout"><b>Ejemplo aquí:</b> ${detail.usage}<br /><br /><b>Recuerda:</b> ${detail.tip}</div>`;
  }
  const headingFeedback = document.querySelector("#headingFeedback");
  if (headingFeedback && tag.startsWith("h")) headingFeedback.innerHTML = `<b>&lt;${tag}&gt; · ${detail.title}:</b> ${detail.description} <span>${detail.usage}</span>`;
}
document.querySelectorAll("[data-tag]").forEach((button) => {
  button.addEventListener("click", () => {
    explainTag(button.dataset.tag);
    if (button.classList.contains("heading-tag-select")) {
      document.querySelectorAll(".heading-tag-select").forEach((heading) => heading.setAttribute("aria-pressed", String(heading === button)));
    }
  });
});

const quizRounds = [
  {
    label: "SITUACIÓN · PUBLICACIÓN", title: "La banda anuncia<br />una nueva gira.",
    description: "La nota tiene título, fecha y texto propios. Se entiende si alguien la comparte sola.",
    clue: "✳ PISTA: PUEDE VIVIR POR SÍ SOLA", answer: "article",
    success: "¡Sí! <article> encaja porque la noticia tiene título y contenido propios, y se entiende aunque salga de esta página.",
    options: [["article", "Una publicación independiente"], ["section", "Un capítulo de un tema"], ["aside", "Un contenido complementario"]]
  },
  {
    label: "SITUACIÓN · NAVEGACIÓN", title: "Una página reúne<br />enlaces del sitio.",
    description: "Los enlaces llevan a Inicio, Actividades y Contacto. Su tarea es ayudar a encontrar el camino.",
    clue: "✳ PISTA: SON RUTAS PARA MOVERSE", answer: "nav",
    success: "¡Correcto! <nav> agrupa enlaces de navegación importantes. Piensa en el menú como un pequeño mapa de rutas.",
    options: [["article", "Una historia que puede compartirse"], ["nav", "Un bloque de navegación"], ["section", "Un capítulo temático"]]
  },
  {
    label: "SITUACIÓN · INFORMACIÓN EXTRA", title: "Junto a la noticia<br />hay un dato curioso.",
    description: "El dato está relacionado con la noticia, pero la historia se entiende perfectamente sin él.",
    clue: "✳ PISTA: ACOMPAÑA, PERO NO ES ESENCIAL", answer: "aside",
    success: "¡Lo tienes! <aside> encaja porque aporta información relacionada pero complementaria; no es parte esencial de la noticia.",
    options: [["aside", "Un complemento relacionado"], ["main", "El contenido principal"], ["article", "Una pieza independiente"]]
  }
];
let quizRound = 0;
let quizScore = 0;
let quizAnswered = false;
let quizFinished = false;
const quizScoreAwarded = [false, false, false];
const quizFeedback = document.querySelector("#quizFeedback");
const quizNext = document.querySelector("#quizNext");
const quizScoreLabel = document.querySelector("#quizScore");
function renderQuizRound() {
  const round = quizRounds[quizRound];
  document.querySelector("#quizRoundLabel").textContent = `RETO ${quizRound + 1} DE ${quizRounds.length}`;
  document.querySelector("#quizProgressFill").style.width = `${(quizRound / quizRounds.length) * 100}%`;
  document.querySelector("#quizStoryLabel").textContent = round.label;
  document.querySelector("#quizStoryTitle").innerHTML = round.title;
  document.querySelector("#quizStoryDescription").textContent = round.description;
  document.querySelector("#quizStoryStamp").textContent = round.clue;
  quizScoreLabel.textContent = `${quizScore} ${quizScore === 1 ? "acierto" : "aciertos"}`;
  document.querySelectorAll(".quiz-option").forEach((button, index) => {
    const [tag, label] = round.options[index];
    button.dataset.answer = tag;
    button.querySelector("code").textContent = `<${tag}>`;
    button.querySelector("span").textContent = label;
    button.classList.remove("correct", "incorrect");
  });
  quizAnswered = false;
  quizNext.disabled = true;
  quizNext.innerHTML = quizRound === quizRounds.length - 1 ? "Ver resultado <span aria-hidden=\"true\">→</span>" : "Siguiente reto <span aria-hidden=\"true\">→</span>";
  quizFeedback.className = "quiz-feedback";
  quizFeedback.textContent = "Elige una opción para recibir una pista.";
}
document.querySelector("#quizOptions")?.addEventListener("click", (event) => {
  const option = event.target.closest(".quiz-option");
  if (!option || quizFinished) return;
  const round = quizRounds[quizRound];
  const correct = option.dataset.answer === round.answer;
  if (correct && !quizScoreAwarded[quizRound]) {
    quizScore += 1;
    quizScoreAwarded[quizRound] = true;
  }
  document.querySelectorAll(".quiz-option").forEach((button) => button.classList.remove("correct", "incorrect"));
  option.classList.add(correct ? "correct" : "incorrect");
  quizAnswered = true;
  quizNext.disabled = false;
  quizScoreLabel.textContent = `${quizScore} ${quizScore === 1 ? "acierto" : "aciertos"}`;
  quizFeedback.className = `quiz-feedback ${correct ? "correct-text" : "incorrect-text"}`;
  quizFeedback.textContent = correct
    ? round.success
    : `Casi. Pregúntate: ¿es una pieza que se entiende sola, una ruta para navegar o un dato que acompaña? ${round.clue.replace("✳ PISTA: ", "Pista: ").toLowerCase()}.`;
});
quizNext?.addEventListener("click", () => {
  if (!quizAnswered || quizFinished) return;
  if (quizRound < quizRounds.length - 1) {
    quizRound += 1;
    renderQuizRound();
    return;
  }
  quizFinished = true;
  document.querySelector("#quizRoundLabel").textContent = "MISIÓN COMPLETADA";
  document.querySelector("#quizProgressFill").style.width = "100%";
  document.querySelector("#quizStoryTitle").innerHTML = quizScore === 3 ? "¡Mapa<br />perfecto!" : "¡Misión<br />cumplida!";
  document.querySelector("#quizStoryDescription").textContent = `Acertaste ${quizScore} de ${quizRounds.length}. Ya puedes distinguir una pieza independiente, una ruta de navegación y un contenido complementario.`;
  document.querySelector("#quizStoryStamp").textContent = "✳ ¡YA PIENSAS EN EL PROPÓSITO!";
  quizNext.hidden = true;
  quizFeedback.className = "quiz-feedback correct-text";
  quizFeedback.textContent = "Recuerda la pregunta clave: ¿qué trabajo cumple este contenido dentro de la página?";
});
document.querySelector("#resetQuiz")?.addEventListener("click", () => {
  quizRound = 0;
  quizScore = 0;
  quizFinished = false;
  quizScoreAwarded.fill(false);
  quizNext.hidden = false;
  renderQuizRound();
});
renderQuizRound();

const presentationToggle = document.querySelector("#presentationToggle");
presentationToggle?.addEventListener("click", () => {
  const enabled = document.body.classList.toggle("presentation-mode");
  presentationToggle.setAttribute("aria-pressed", String(enabled));
  presentationToggle.innerHTML = enabled ? "<span aria-hidden=\"true\">⛶</span> Salir" : "<span aria-hidden=\"true\">⛶</span> Presentar";
  if (enabled) window.scrollTo({ top: 0, behavior: "smooth" });
});

document.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || ["INPUT", "TEXTAREA", "BUTTON", "A"].includes(document.activeElement?.tagName)) return;
  if (event.key === "ArrowDown" || event.key === "PageDown") {
    event.preventDefault();
    slides[Math.min(currentSlide + 1, slides.length - 1)].scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (event.key === "ArrowUp" || event.key === "PageUp") {
    event.preventDefault();
    slides[Math.max(currentSlide - 1, 0)].scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

