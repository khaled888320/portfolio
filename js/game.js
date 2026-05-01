// ===== GAME =====
const gameCanvas = document.getElementById('gameCanvas')
const ctx = gameCanvas.getContext('2d')
const scoreDisplay = document.getElementById('scoreDisplay')

let gameRunning = false
let score = 0
let player = { x: 225, y: 260, w: 50, h: 15, speed: 8 }
let stars = []
let keys = {}
let gameLoop = null

// Keyboard controls
document.addEventListener('keydown', e => { keys[e.key] = true })
document.addEventListener('keyup', e => { keys[e.key] = false })

function spawnStar() {
  stars.push({
    x: Math.random() * 460 + 20,
    y: -20,
    speed: 2 + Math.random() * 3 + score * 0.02,
    emoji: Math.random() > 0.8 ? '💎' : '⭐'
  })
}

function drawGame() {
  // Clear
  ctx.clearRect(0, 0, 500, 300)

  // Background
  ctx.fillStyle = '#050508'
  ctx.fillRect(0, 0, 500, 300)

  // Grid lines
  ctx.strokeStyle = 'rgba(124,106,247,0.08)'
  ctx.lineWidth = 1
  for (let x = 0; x < 500; x += 40) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, 300)
    ctx.stroke()
  }
  for (let y = 0; y < 300; y += 40) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(500, y)
    ctx.stroke()
  }

  // Player — gradient bar
  const gradient = ctx.createLinearGradient(player.x, 0, player.x + player.w, 0)
  gradient.addColorStop(0, '#7c6af7')
  gradient.addColorStop(1, '#f76a9f')
  ctx.fillStyle = gradient
  ctx.shadowColor = '#7c6af7'
  ctx.shadowBlur = 15
  ctx.beginPath()
  ctx.roundRect(player.x, player.y, player.w, player.h, 6)
  ctx.fill()
  ctx.shadowBlur = 0

  // Stars
  ctx.font = '20px serif'
  stars.forEach(star => {
    ctx.fillText(star.emoji, star.x, star.y)
  })
}

function updateGame() {
  if (!gameRunning) return

  // Move player
  if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed
  if (keys['ArrowRight'] && player.x < 450) player.x += player.speed

  // Move stars down
  stars.forEach(star => { star.y += star.speed })

  // Check collision + remove stars
  stars = stars.filter(star => {
    const caught = star.y > 255 &&
      star.x > player.x - 10 &&
      star.x < player.x + player.w + 10

    if (caught) {
      score += star.emoji === '💎' ? 5 : 1
      scoreDisplay.textContent = score
      return false
    }

    return star.y < 320
  })

  // Spawn new star
  if (Math.random() < 0.04) spawnStar()

  drawGame()
  gameLoop = requestAnimationFrame(updateGame)
}

function startGame() {
  if (gameRunning) return
  gameRunning = true
  score = 0
  stars = []
  player.x = 225
  scoreDisplay.textContent = '0'
  updateGame()
}

function resetGame() {
  gameRunning = false
  cancelAnimationFrame(gameLoop)
  score = 0
  stars = []
  player.x = 225
  scoreDisplay.textContent = '0'
  drawGame()
}

// Draw initial state
drawGame()

// ===== SNAKE GAME =====
const snakeCanvas = document.getElementById('snakeCanvas')
const sCtx = snakeCanvas.getContext('2d')
const snakeScoreDisplay = document.getElementById('snakeScore')

const CELL = 20
const COLS = 20
const ROWS = 20

let snake = []
let food = {}
let direction = { x: 1, y: 0 }
let nextDirection = { x: 1, y: 0 }
let snakeScore = 0
let snakeRunning = false
let snakeInterval = null

function randomFood() {
  return {
    x: Math.floor(Math.random() * COLS),
    y: Math.floor(Math.random() * ROWS)
  }
}

function drawSnake() {
  // Background
  sCtx.fillStyle = '#050508'
  sCtx.fillRect(0, 0, 400, 400)

  // Grid
  sCtx.strokeStyle = 'rgba(124,106,247,0.06)'
  sCtx.lineWidth = 1
  for (let x = 0; x <= COLS; x++) {
    sCtx.beginPath()
    sCtx.moveTo(x * CELL, 0)
    sCtx.lineTo(x * CELL, 400)
    sCtx.stroke()
  }
  for (let y = 0; y <= ROWS; y++) {
    sCtx.beginPath()
    sCtx.moveTo(0, y * CELL)
    sCtx.lineTo(400, y * CELL)
    sCtx.stroke()
  }

  // Food
  sCtx.font = '16px serif'
  sCtx.fillText('🍎', food.x * CELL + 2, food.y * CELL + 16)

  // Snake
  snake.forEach((seg, i) => {
    const ratio = i / snake.length
    const r = Math.floor(124 - ratio * 40)
    const g = Math.floor(106 + ratio * 100)
    const b = 247

    sCtx.fillStyle = i === 0
      ? '#7c6af7'
      : `rgb(${r},${g},${b})`

    sCtx.shadowColor = i === 0 ? '#7c6af7' : 'transparent'
    sCtx.shadowBlur = i === 0 ? 10 : 0

    sCtx.beginPath()
    sCtx.roundRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2, 4)
    sCtx.fill()
    sCtx.shadowBlur = 0
  })

  // Game over text
  if (!snakeRunning && snake.length > 0) {
    sCtx.fillStyle = 'rgba(0,0,0,0.7)'
    sCtx.fillRect(0, 150, 400, 80)
    sCtx.fillStyle = '#f76a9f'
    sCtx.font = 'bold 28px Clash Display, sans-serif'
    sCtx.textAlign = 'center'
    sCtx.fillText('Game Over! 💀', 200, 185)
    sCtx.fillStyle = '#7070a0'
    sCtx.font = '14px Satoshi, sans-serif'
    sCtx.fillText('Press Start to play again', 200, 215)
    sCtx.textAlign = 'left'
  }
}

function updateSnake() {
  direction = { ...nextDirection }

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  }

  // Wall collision
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
    gameOver()
    return
  }

  // Self collision
  if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
    gameOver()
    return
  }

  snake.unshift(head)

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    snakeScore += 10
    snakeScoreDisplay.textContent = snakeScore
    food = randomFood()
  } else {
    snake.pop()
  }

  drawSnake()
}

function gameOver() {
  snakeRunning = false
  clearInterval(snakeInterval)
  drawSnake()
}

document.addEventListener('keydown', e => {
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
    e.preventDefault()
  }
  if (e.key === 'ArrowUp' && direction.y !== 1)
    nextDirection = { x: 0, y: -1 }
  if (e.key === 'ArrowDown' && direction.y !== -1)
    nextDirection = { x: 0, y: 1 }
  if (e.key === 'ArrowLeft' && direction.x !== 1)
    nextDirection = { x: -1, y: 0 }
  if (e.key === 'ArrowRight' && direction.x !== -1)
    nextDirection = { x: 1, y: 0 }
})

function startSnake() {
  if (snakeRunning) return
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ]
  direction = { x: 1, y: 0 }
  nextDirection = { x: 1, y: 0 }
  snakeScore = 0
  snakeScoreDisplay.textContent = '0'
  food = randomFood()
  snakeRunning = true
  clearInterval(snakeInterval)
  snakeInterval = setInterval(updateSnake, 120)
}

function resetSnake() {
  snakeRunning = false
  clearInterval(snakeInterval)
  snake = []
  snakeScore = 0
  snakeScoreDisplay.textContent = '0'
  drawSnake()
}

// Initial draw
drawSnake()

// ===== BREAKOUT GAME =====
const breakoutCanvas = document.getElementById('breakoutCanvas')
const bCtx = breakoutCanvas.getContext('2d')
const breakoutScoreDisplay = document.getElementById('breakoutScore')

let bScore = 0
let bRunning = false
let bLoop = null

let paddle = { x: 190, y: 300, w: 80, h: 12, speed: 7 }
let ball = { x: 240, y: 270, vx: 3, vy: -3, r: 8 }
let bKeys = {}

// Bricks
const BRICK_ROWS = 4
const BRICK_COLS = 8
const BRICK_W = 52
const BRICK_H = 18
const BRICK_GAP = 6
const BRICK_OFFSET_X = 16
const BRICK_OFFSET_Y = 40

let bricks = []

const BRICK_COLORS = [
  '#f76a9f',
  '#7c6af7',
  '#6af7c0',
  '#f7c46a'
]

function initBricks() {
  bricks = []
  for (let r = 0; r < BRICK_ROWS; r++) {
    for (let c = 0; c < BRICK_COLS; c++) {
      bricks.push({
        x: BRICK_OFFSET_X + c * (BRICK_W + BRICK_GAP),
        y: BRICK_OFFSET_Y + r * (BRICK_H + BRICK_GAP),
        alive: true,
        color: BRICK_COLORS[r]
      })
    }
  }
}

function drawBreakout() {
  // Background
  bCtx.fillStyle = '#050508'
  bCtx.fillRect(0, 0, 480, 320)

  // Grid
  bCtx.strokeStyle = 'rgba(124,106,247,0.06)'
  bCtx.lineWidth = 1
  for (let x = 0; x < 480; x += 40) {
    bCtx.beginPath(); bCtx.moveTo(x, 0); bCtx.lineTo(x, 320); bCtx.stroke()
  }
  for (let y = 0; y < 320; y += 40) {
    bCtx.beginPath(); bCtx.moveTo(0, y); bCtx.lineTo(480, y); bCtx.stroke()
  }

  // Bricks
  bricks.forEach(brick => {
    if (!brick.alive) return
    bCtx.fillStyle = brick.color
    bCtx.shadowColor = brick.color
    bCtx.shadowBlur = 8
    bCtx.beginPath()
    bCtx.roundRect(brick.x, brick.y, BRICK_W, BRICK_H, 4)
    bCtx.fill()
    bCtx.shadowBlur = 0
  })

  // Paddle
  const pGrad = bCtx.createLinearGradient(paddle.x, 0, paddle.x + paddle.w, 0)
  pGrad.addColorStop(0, '#7c6af7')
  pGrad.addColorStop(1, '#f76a9f')
  bCtx.fillStyle = pGrad
  bCtx.shadowColor = '#7c6af7'
  bCtx.shadowBlur = 12
  bCtx.beginPath()
  bCtx.roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 6)
  bCtx.fill()
  bCtx.shadowBlur = 0

  // Ball
  bCtx.fillStyle = '#fff'
  bCtx.shadowColor = '#7c6af7'
  bCtx.shadowBlur = 15
  bCtx.beginPath()
  bCtx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2)
  bCtx.fill()
  bCtx.shadowBlur = 0

  // Game over / win text
  if (!bRunning && bScore > 0) {
    const allDead = bricks.every(b => !b.alive)
    bCtx.fillStyle = 'rgba(0,0,0,0.75)'
    bCtx.fillRect(0, 120, 480, 90)
    bCtx.fillStyle = allDead ? '#6af7c0' : '#f76a9f'
    bCtx.font = 'bold 28px sans-serif'
    bCtx.textAlign = 'center'
    bCtx.fillText(allDead ? 'You Win! 🎉' : 'Game Over! 💀', 240, 158)
    bCtx.fillStyle = '#7070a0'
    bCtx.font = '14px sans-serif'
    bCtx.fillText('Press Start to play again', 240, 195)
    bCtx.textAlign = 'left'
  }
}

function updateBreakout() {
  if (!bRunning) return

  // Move paddle
  if (bKeys['ArrowLeft'] && paddle.x > 0) paddle.x -= paddle.speed
  if (bKeys['ArrowRight'] && paddle.x < 480 - paddle.w) paddle.x += paddle.speed

  // Move ball
  ball.x += ball.vx
  ball.y += ball.vy

  // Wall bounce
  if (ball.x - ball.r < 0 || ball.x + ball.r > 480) ball.vx *= -1
  if (ball.y - ball.r < 0) ball.vy *= -1

  // Paddle bounce
  if (
    ball.y + ball.r > paddle.y &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.w
  ) {
    ball.vy = -Math.abs(ball.vy)
    const hitPos = (ball.x - paddle.x) / paddle.w
    ball.vx = (hitPos - 0.5) * 8
  }

  // Brick collision
  bricks.forEach(brick => {
    if (!brick.alive) return
    if (
      ball.x + ball.r > brick.x &&
      ball.x - ball.r < brick.x + BRICK_W &&
      ball.y + ball.r > brick.y &&
      ball.y - ball.r < brick.y + BRICK_H
    ) {
      brick.alive = false
      ball.vy *= -1
      bScore += 10
      breakoutScoreDisplay.textContent = bScore
    }
  })

  // Ball falls out
  if (ball.y > 340) {
    bRunning = false
    cancelAnimationFrame(bLoop)
    drawBreakout()
    return
  }

  // All bricks cleared
  if (bricks.every(b => !b.alive)) {
    bRunning = false
    cancelAnimationFrame(bLoop)
    drawBreakout()
    return
  }

  drawBreakout()
  bLoop = requestAnimationFrame(updateBreakout)
}

document.addEventListener('keydown', e => { bKeys[e.key] = true })
document.addEventListener('keyup', e => { bKeys[e.key] = false })

function startBreakout() {
  if (bRunning) return
  bScore = 0
  breakoutScoreDisplay.textContent = '0'
  paddle.x = 190
  ball = { x: 240, y: 270, vx: 3, vy: -3, r: 8 }
  initBricks()
  bRunning = true
  updateBreakout()
}

function resetBreakout() {
  bRunning = false
  cancelAnimationFrame(bLoop)
  bScore = 0
  breakoutScoreDisplay.textContent = '0'
  paddle.x = 190
  ball = { x: 240, y: 270, vx: 3, vy: -3, r: 8 }
  initBricks()
  drawBreakout()
}

// Initial draw
initBricks()
drawBreakout()


// ===== CODE QUIZ =====
const quizQuestions = [
  {
    q: 'Ce afișează?\nconsole.log(typeof null)',
    answers: ['"null"', '"object"', '"undefined"', '"boolean"'],
    correct: 1,
    lang: 'JS'
  },
  {
    q: 'Ce valoare are?\nconsole.log(0.1 + 0.2 === 0.3)',
    answers: ['true', 'false', 'undefined', 'NaN'],
    correct: 1,
    lang: 'JS'
  },
  {
    q: 'Ce afișează?\nconsole.log([] + [])',
    answers: ['null', '0', '""', 'undefined'],
    correct: 2,
    lang: 'JS'
  },
  {
    q: 'Care e corect în Vue 3?\nPentru a accesa valoarea unui ref:',
    answers: ['name.value', 'name.get()', 'ref(name)', '$name'],
    correct: 0,
    lang: 'VUE'
  },
  {
    q: 'Ce face în PHP?\n$arr = [1,2,3];\necho count($arr);',
    answers: ['1', '2', '3', 'Error'],
    correct: 2,
    lang: 'PHP'
  },
  {
    q: 'Care proprietate CSS face\nun element invizibil dar\nocupă spațiu?',
    answers: ['display:none', 'visibility:hidden', 'opacity:0', 'B și C'],
    correct: 3,
    lang: 'CSS'
  },
  {
    q: 'Ce afișează?\nconsole.log(1 + "2" + 3)',
    answers: ['6', '"123"', '"15"', 'Error'],
    correct: 1,
    lang: 'JS'
  },
  {
    q: 'În Laravel, ce face?\nProduct::with("category")->get()',
    answers: ['N+1 problem', 'Eager loading', 'Lazy loading', 'Cache query'],
    correct: 1,
    lang: 'LARAVEL'
  },
  {
    q: 'Care tag HTML5 este\ncorect semantic pentru navigare?',
    answers: ['<div id="nav">', '<navigation>', '<nav>', '<menu>'],
    correct: 2,
    lang: 'HTML'
  },
  {
    q: 'Ce face în CSS?\ndisplay: flex;\njustify-content: space-between',
    answers: [
      'Aliniază pe verticală',
      'Spațiu egal între elemente',
      'Centrează elementele',
      'Adaugă padding'
    ],
    correct: 1,
    lang: 'CSS'
  },
  {
    q: 'Ce afișează?\nconst x = [1,2,3]\nconsole.log(x.length)',
    answers: ['2', '3', '4', 'undefined'],
    correct: 1,
    lang: 'JS'
  },
  {
    q: 'În PHP, care e corect\npentru a verifica dacă\no cheie există în array?',
    answers: ['in_array()', 'array_key_exists()', 'isset()', 'B și C'],
    correct: 3,
    lang: 'PHP'
  },
]

let quizScore = 0
let quizIndex = 0
let quizAnswered = false
let quizTimerInterval = null
let quizTimeLeft = 15
let shuffledQuestions = []

const quizScoreEl = document.getElementById('quizScore')
const quizTotalEl = document.getElementById('quizTotal')
const quizQuestionEl = document.getElementById('quizQuestion')
const quizAnswersEl = document.getElementById('quizAnswers')
const quizFeedbackEl = document.getElementById('quizFeedback')
const quizTimerEl = document.getElementById('quizTimer')

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function startQuiz() {
  shuffledQuestions = shuffleArray(quizQuestions)
  quizScore = 0
  quizIndex = 0
  quizScoreEl.textContent = '0'
  quizTotalEl.textContent = shuffledQuestions.length
  showQuestion()
}

function showQuestion() {
  if (quizIndex >= shuffledQuestions.length) {
    endQuiz()
    return
  }

  quizAnswered = false
  quizTimeLeft = 15
  quizFeedbackEl.textContent = ''
  quizTimerEl.classList.remove('urgent')

  const q = shuffledQuestions[quizIndex]

  // Lang badge
  const langColors = {
    JS: '#f7c46a', VUE: '#41b883', PHP: '#7c6af7',
    LARAVEL: '#f76a9f', HTML: '#f76a6a', CSS: '#6af7c0'
  }
  const color = langColors[q.lang] || '#7c6af7'

  quizQuestionEl.innerHTML = `
    <span style="
      background: ${color}22;
      color: ${color};
      font-size: 10px;
      padding: 2px 10px;
      border-radius: 4px;
      letter-spacing: 2px;
      margin-bottom: 10px;
      display: inline-block;
    ">${q.lang}</span><br><br>
    ${q.q.replace(/\n/g, '<br>')}
  `

  quizAnswersEl.innerHTML = ''
  q.answers.forEach((answer, i) => {
    const btn = document.createElement('button')
    btn.className = 'quiz-answer-btn'
    btn.textContent = answer
    btn.onclick = () => selectAnswer(i)
    quizAnswersEl.appendChild(btn)
  })

  // Timer
  clearInterval(quizTimerInterval)
  quizTimerEl.textContent = '⏱️ ' + quizTimeLeft
  quizTimerInterval = setInterval(() => {
    quizTimeLeft--
    quizTimerEl.textContent = '⏱️ ' + quizTimeLeft
    if (quizTimeLeft <= 5) quizTimerEl.classList.add('urgent')
    if (quizTimeLeft <= 0) {
      clearInterval(quizTimerInterval)
      if (!quizAnswered) {
        quizAnswered = true
        quizFeedbackEl.textContent = '⏰ Time out! Correct: ' + shuffledQuestions[quizIndex].answers[shuffledQuestions[quizIndex].correct]
        quizFeedbackEl.style.color = 'var(--accent2)'
        const btns = quizAnswersEl.querySelectorAll('.quiz-answer-btn')
        btns[shuffledQuestions[quizIndex].correct].classList.add('correct')
        setTimeout(() => { quizIndex++; showQuestion() }, 2000)
      }
    }
  }, 1000)
}

function selectAnswer(i) {
  if (quizAnswered) return
  quizAnswered = true
  clearInterval(quizTimerInterval)

  const q = shuffledQuestions[quizIndex]
  const btns = quizAnswersEl.querySelectorAll('.quiz-answer-btn')

  btns[q.correct].classList.add('correct')

  if (i === q.correct) {
    quizScore++
    quizScoreEl.textContent = quizScore
    quizFeedbackEl.textContent = '✅ Correct!'
    quizFeedbackEl.style.color = 'var(--accent3)'
  } else {
    btns[i].classList.add('wrong')
    quizFeedbackEl.textContent = '❌ Wrong! Correct: ' + q.answers[q.correct]
    quizFeedbackEl.style.color = 'var(--accent2)'
  }

  setTimeout(() => { quizIndex++; showQuestion() }, 2000)
}

function endQuiz() {
  clearInterval(quizTimerInterval)
  const pct = Math.round(quizScore / shuffledQuestions.length * 100)
  let emoji = pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪'

  quizQuestionEl.innerHTML = `
    <div style="text-align:center; padding: 20px 0;">
      <div style="font-size: 48px; margin-bottom: 16px;">${emoji}</div>
      <div style="font-size: 22px; font-weight: 700; margin-bottom: 8px;">
        ${quizScore} / ${shuffledQuestions.length} correct
      </div>
      <div style="color: var(--accent); font-size: 28px; font-weight: 700;">
        ${pct}%
      </div>
    </div>
  `
  quizAnswersEl.innerHTML = ''
  quizTimerEl.textContent = '🎉 Done!'
  quizFeedbackEl.textContent = ''
}

function resetQuiz() {
  clearInterval(quizTimerInterval)
  quizScore = 0
  quizIndex = 0
  quizScoreEl.textContent = '0'
  quizTotalEl.textContent = '0'
  quizQuestionEl.textContent = 'Press Start to play!'
  quizAnswersEl.innerHTML = ''
  quizFeedbackEl.textContent = ''
  quizTimerEl.textContent = '⏱️ 15'
  quizTimerEl.classList.remove('urgent')
}
