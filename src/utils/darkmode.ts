export function toggleDarkMode() {
  const css = document.createElement('style');
  css.appendChild(
    document.createTextNode(
      `* {
       -webkit-transition: none !important;
       -moz-transition: none !important;
       -o-transition: none !important;
       -ms-transition: none !important;
       transition: none !important;
      }`
    )
  );
  document.head.appendChild(css);
  const isDark = document.documentElement.classList.toggle('darkmode');

  if (isDark) {
    localStorage.setItem('darkmode', 'active');
  } else {
    localStorage.removeItem('darkmode');
  }

  const _ = window.getComputedStyle(css).opacity;
  document.head.removeChild(css);
}