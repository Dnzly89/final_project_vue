<template>
  <footer class="footer">
    <div class="footer__content">

      <div class="footer__links">

        
        <a href="#" target="_blank" class="footer__link">
          <img src="/icons/vk.svg" alt="VK" />
        </a>

     
        <a href="#" target="_blank" class="footer__link">
          <img src="/icons/telegram.svg" alt="Telegram" />
        </a>

       
        <a href="#" target="_blank" class="footer__link">
          <img src="/icons/youtube.svg" alt="YouTube" />
        </a>

        <a href="#" target="_blank" class="footer__link">
          <img src="/icons/ok.svg" alt="OK" />
        </a>

      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: 50px;
  padding: 30px 0;
  border-radius: 16px 16px 0 0;
}

.footer__title {
  color: #fff;
  font-size: 18px;
  margin-bottom: 15px;
}

.footer__links {
  display: flex;
  justify-content: flex-end;
  gap: 24px;
}

.footer__link img {
  width: 32px;
  height: 32px;
  transition: 0.3s ease;
  opacity: 0.8;
}

.footer__link img:hover {
  transform: scale(1.1);
  opacity: 1;
}

@media (max-width: 480px) {
  .footer {
    padding: 20px;
  }

  .footer__links {
    justify-content: flex-start; /* ← иконки слева */
  }
}
</style>
