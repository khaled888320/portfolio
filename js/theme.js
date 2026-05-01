// ===== THEME TOGGLE =====
function toggleTheme() {
    const html = document.documentElement
    const current = html.getAttribute('data-theme')
    const newTheme = current === 'dark' ? 'light' : 'dark'
  
    html.setAttribute('data-theme', newTheme)
  
    const btn = document.getElementById('themeBtn')
    btn.textContent = newTheme === 'dark' ? '🌙' : '☀️'
  
    localStorage.setItem('theme', newTheme)
  }
  
  // Încarcă tema salvată
  const savedTheme = localStorage.getItem('theme') || 'dark'
  document.documentElement.setAttribute('data-theme', savedTheme)
  document.getElementById('themeBtn').textContent = savedTheme === 'dark' ? '🌙' : '☀️'