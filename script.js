const FORMSPREE_ENDPOINT = "https://formspree.io/f/xppppkrp";

const questions = [
  {
    question: "01. What's your favorite thing I've ever said to you?"
  },
  {
    question: "02. When you're feeling down, what would you want me to do for you?"
  },
  {
    question: "03. When was the first time you felt that there might be something special between us?"
  },
  {
    question: "04. What makes you feel truly understood by someone?"
  },
  {
    question: "05. What kind of conversations do you enjoy most with me?"
  },
  {
    question: "06. What makes you feel most comfortable being yourself around me?"
  },
  {
    question: "07. What makes you want to keep getting closer to someone?"
  },
  {
    question: "08. What would you like us to do when things start feeling boring or repetitive?"
  },
  {
    question: "09. In what ways can I love you better?"
  },
  {
    question: "10. Is there a moment when you felt especially proud of our relationship?"
  },
  {
    question: "11. When we misunderstand each other, what would help you feel better and work things out?"
  },
  {
    question: "12. What's something about yourself you wish I understood better? It could be a habit, a feeling, a fear, or a part of your personality that people don't always understand."
  },
  {
    question: "13. What's one thing you'd love for us to experience together? It could be a date, a trip, a new hobby, a little tradition, or something simple."
  }
];

const quizScreen = document.getElementById("quizScreen");
const successScreen = document.getElementById("successScreen");
const questionContainer = document.getElementById("questionContainer");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

let currentIndex = 0;
const answers = [];

function updateProgress() {
  const answeredCount = answers.filter((value) => value && value.trim() !== "").length;
  const percent = Math.round((answeredCount / questions.length) * 100);

  if (progressFill) progressFill.style.width = `${percent}%`;
  if (progressText) progressText.textContent = `${percent}%`;
}

function showMessage(text, type = "error") {
  let msg = document.querySelector(".form-message");
  if (!msg) {
    msg = document.createElement("div");
    msg.className = "form-message";
    questionContainer.appendChild(msg);
  }

  msg.className = `form-message ${type}`;
  msg.textContent = text;
}

function renderQuestion() {
  const q = questions[currentIndex];
  const currentAnswer = answers[currentIndex] || "";

  questionContainer.innerHTML = `
    <div class="question-card">
      <div class="question-header">
        <span class="question-index">Question ${currentIndex + 1}/${questions.length}</span>
      </div>

      <h3 class="question-title">${q.question}</h3>

      <div class="textarea-wrap">
        <textarea
          class="question-textarea"
          id="answerInput"
          placeholder="your answer... 😭"
        >${currentAnswer}</textarea>
      </div>

      <div class="question-actions">
        <button type="button" class="secondary-btn" id="prevBtn" ${currentIndex === 0 ? "disabled" : ""}>
          Return
        </button>
        <button type="button" class="next-btn" id="nextBtn">
          ${currentIndex === questions.length - 1 ? "Submit Results" : "Next"}
        </button>
      </div>
    </div>
  `;

  const textArea = document.getElementById("answerInput");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  textArea.addEventListener("input", (event) => {
    answers[currentIndex] = event.target.value;
    updateProgress();
  });

  prevBtn?.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      renderQuestion();
    }
  });

  nextBtn?.addEventListener("click", () => {
    const value = (answers[currentIndex] || "").trim();

    if (!value) {
      showMessage("Please answer this one too my babyyyyy", "error");
      return;
    }

    answers[currentIndex] = value;

    if (currentIndex < questions.length - 1) {
      currentIndex++;
      renderQuestion();
      return;
    }

    submitQuiz();
  });

  updateProgress();
}

function submitQuiz() {
  const payload = {
    submittedAt: new Date().toISOString(),
    answers: questions.map((item, index) => ({
      question: item.question,
      answer: answers[index] || ""
    }))
  };

  fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then((response) => {
      if (!response.ok) throw new Error("Submit failed");
      return response.json();
    })
    .then(() => {
      if (quizScreen) quizScreen.classList.add("hidden");
      if (successScreen) successScreen.classList.remove("hidden");
    })
    .catch(() => {
      showMessage("There was an error submitting the form. Please check the Formspree endpoint.", "error");
    });
}

renderQuestion();