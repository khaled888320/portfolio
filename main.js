// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animează progress bars
        const bar = entry.target.querySelector('.skill-level-bar')
        if (bar) {
          setTimeout(() => {
            bar.style.width = bar.dataset.width + '%'
          }, 200)
        }
      }
    })
  }, { threshold: 0.1 })
  
  // Observă toate skill cards
  document.querySelectorAll('.skill-card').forEach(el => observer.observe(el))