export function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('darkmode');

  if (isDark) {
    localStorage.setItem('darkmode', 'active');
  } else {
    localStorage.removeItem('darkmode');
  }
}