(() => {
  const thumbs = document.querySelectorAll('.thumb');
  thumbs.forEach(button => button.addEventListener('click', () => {
    thumbs.forEach(item => item.classList.remove('is-active'));
    button.classList.add('is-active');
  }));
  document.getElementById('buyNow').addEventListener('click', () => {
    window.location.href = 'MinhHuy_2474802016546_Shopping.html';
  });
})();
