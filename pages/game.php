<!-- GAME -->
<section class="game" id="game">
  <div class="game-inner">

    <div class="section-tag">For fun</div>
    <h2 class="section-title">Play a Game! 🎮</h2>

    <div class="game-wrap">
      <div class="game-score">Score: <span id="scoreDisplay">0</span></div>
      <canvas id="gameCanvas" width="500" height="300"></canvas>
      <div class="game-instructions">
        Use ← → arrow keys to move. Catch the falling ⭐ stars!
      </div>
      <div class="game-controls">
        <button class="btn-primary" onclick="startGame()">
          <i class="fas fa-play"></i> Start Game
        </button>
        <button class="btn-ghost" onclick="resetGame()">
          <i class="fas fa-redo"></i> Reset
        </button>
      </div>
    </div>

    <!-- GAME 2 — SNAKE -->
<div class="game-wrap" style="margin-top: 40px;">
  <h3 class="game-title">Snake 🐍</h3>
  <div class="game-score">Score: <span id="snakeScore">0</span></div>
  <canvas id="snakeCanvas" width="400" height="400"></canvas>
  <div class="game-instructions">
    Use ← → ↑ ↓ arrow keys to move the snake. Eat 🍎 to grow!
  </div>
  <div class="game-controls">
    <button class="btn-primary" onclick="startSnake()">
      <i class="fas fa-play"></i> Start Snake
    </button>
    <button class="btn-ghost" onclick="resetSnake()">
      <i class="fas fa-redo"></i> Reset
    </button>
  </div>
</div>

<!-- GAME 3 — BREAKOUT -->
<div class="game-wrap" style="margin-top: 40px;">
  <h3 class="game-title">Breakout 🧱</h3>
  <div class="game-score">Score: <span id="breakoutScore">0</span></div>
  <canvas id="breakoutCanvas" width="480" height="320"></canvas>
  <div class="game-instructions">
    Use ← → arrow keys to move. Break all the bricks! 🧱
  </div>
  <div class="game-controls">
    <button class="btn-primary" onclick="startBreakout()">
      <i class="fas fa-play"></i> Start Breakout
    </button>
    <button class="btn-ghost" onclick="resetBreakout()">
      <i class="fas fa-redo"></i> Reset
    </button>
  </div>
</div>

<!-- GAME 4 — CODE QUIZ -->
<div class="game-wrap" style="margin-top: 40px;">
  <h3 class="game-title">Code Quiz 💻</h3>
  <div class="game-score">Score: <span id="quizScore">0</span> / <span id="quizTotal">0</span></div>

  <div id="quizGame">
    <div id="quizTimer" class="quiz-timer">⏱️ 15</div>
    <div id="quizQuestion" class="quiz-question">Press Start to play!</div>
    <div id="quizAnswers" class="quiz-answers"></div>
    <div id="quizFeedback" class="quiz-feedback"></div>
  </div>

  <div class="game-controls" style="margin-top: 20px;">
    <button class="btn-primary" onclick="startQuiz()">
      <i class="fas fa-play"></i> Start Quiz
    </button>
    <button class="btn-ghost" onclick="resetQuiz()">
      <i class="fas fa-redo"></i> Reset
    </button>
  </div>
</div>


  </div>
</section>