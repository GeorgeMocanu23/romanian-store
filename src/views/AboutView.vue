<template>
  <div class="about-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1>Despre Magazinul Românesc</h1>
        <p>Aducem tradițiile și gusturile autentice românești mai aproape de tine</p>
      </div>
    </section>

    <!-- Our Story Section -->
    <section class="content-section story-section">
      <div class="section-content">
        <div class="text-content">
          <h2>Povestea Noastră</h2>
          <p>Magazinul Românesc a luat naștere din dorința de a păstra și promova tradițiile culinare românești autentice. Totul a început în 2023, când am decis să aducem împreună cele mai bune produse tradiționale din toate colțurile României.</p>
          <p>De la rețete transmise din generație în generație până la produse artizanale create cu pasiune, fiecare produs din magazinul nostru spune o poveste despre moștenirea noastră culturală.</p>
        </div>
        <div class="image-container">
          <img src="https://images.unsplash.com/photo-1595475207225-428b62bda831" alt="Produse tradiționale românești" />
        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="content-section mission-section">
      <div class="section-content reverse">
        <div class="text-content">
          <h2>Misiunea Noastră</h2>
          <p>Ne-am propus să fim puntea dintre tradițiile culinare românești și noua generație, aducând gusturile autentice în casele voastre. Lucrăm îndeaproape cu producători locali și artizani pentru a vă oferi cele mai bune produse tradiționale.</p>
          <div class="mission-points">
            <div class="point">
              <i>🌟</i>
              <h3>Calitate Premium</h3>
              <p>Selectăm cu grijă fiecare produs pentru a asigura cea mai înaltă calitate</p>
            </div>
            <div class="point">
              <i>🤝</i>
              <h3>Susținere Locală</h3>
              <p>Sprijinim producătorii și artizanii locali din toate regiunile României</p>
            </div>
            <div class="point">
              <i>🌿</i>
              <h3>Autenticitate</h3>
              <p>Păstrăm rețetele și metodele tradiționale de preparare</p>
            </div>
          </div>
        </div>
        <div class="image-container">
          <img src="https://images.unsplash.com/photo-1605522561233-768ad7a8fabf" alt="Preparare produse tradiționale" />
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="content-section values-section">
      <div class="section-content">
        <div class="text-content">
          <h2>Valorile Noastre</h2>
          <div class="values-grid">
            <div class="value-card">
              <i>🏆</i>
              <h3>Excelență</h3>
              <p>Ne străduim să oferim cele mai bune produse și servicii clienților noștri</p>
            </div>
            <div class="value-card">
              <i>💝</i>
              <h3>Pasiune</h3>
              <p>Punem suflet în tot ceea ce facem, de la selecția produselor până la livrare</p>
            </div>
            <div class="value-card">
              <i>🤲</i>
              <h3>Comunitate</h3>
              <p>Construim legături puternice cu producătorii și clienții noștri</p>
            </div>
            <div class="value-card">
              <i>🌍</i>
              <h3>Sustenabilitate</h3>
              <p>Respectăm mediul înconjurător în toate aspectele activității noastre</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="content-section contact-section">
      <div class="contact-wrapper">
        <div class="contact-header">
          <h2>Hai să păstrăm legătura!</h2>
          <p class="contact-subtitle">Suntem mereu bucuroși să auzim de la clienții noștri. Împărtășește-ne gândurile tale sau întreabă-ne orice despre produsele noastre tradiționale.</p>
        </div>
        
        <div class="contact-cards">
          <div class="contact-card">
            <div class="contact-icon">
              <i>📞</i>
            </div>
            <h3>Telefon</h3>
            <p>Disponibili L-V: 9:00 - 18:00</p>
            <a href="tel:+40123456789" class="contact-link">+40 123 456 789</a>
          </div>

          <div class="contact-card">
            <div class="contact-icon">
              <i>✉️</i>
            </div>
            <h3>Email</h3>
            <p>Răspundem în maxim 24h</p>
            <a href="mailto:contact@magazinromanesc.ro" class="contact-link">contact@magazinromanesc.ro</a>
          </div>

          <div class="contact-card">
            <div class="contact-icon">
              <i>📍</i>
            </div>
            <h3>Adresă</h3>
            <p>Vizitează-ne la sediu</p>
            <address class="contact-link">Strada Principală, Nr. 1<br>București, România</address>
          </div>
        </div>

        <div class="social-media">
          <h3>Urmărește-ne pe rețelele sociale</h3>
          <div class="social-icons">
            <a href="#" class="social-icon">📱</a>
            <a href="#" class="social-icon">📸</a>
            <a href="#" class="social-icon">👥</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'AboutView',
}
</script>

<style scoped>
.about-container {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  overflow-x: hidden;
}

.hero-section {
  height: 60vh;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1601647998485-8df45a0a8c6a') center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  margin-top: 54px;
}

.hero-content {
  max-width: 800px;
  padding: 0 20px;
}

.hero-content h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
}

.hero-content p {
  font-size: 1.5rem;
  font-weight: 300;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  margin: 0 auto;
}

.content-section {
  padding: 5rem 0;
}

.section-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  gap: 4rem;
  align-items: center;
}

.reverse {
  flex-direction: row-reverse;
}

.text-content {
  flex: 1;
}

.image-container {
  flex: 1;
  height: 400px;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 2.5rem;
  color: #2577c8;
  margin-bottom: 1.5rem;
}

p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 1rem;
}

.mission-points {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.point {
  text-align: center;
}

.point i {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.point h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.point p {
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.value-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.value-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.value-card i {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.value-card h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.contact-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 5rem 0;
}

.contact-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.contact-header {
  text-align: center;
  margin-bottom: 4rem;
}

.contact-subtitle {
  max-width: 600px;
  margin: 0 auto;
  font-size: 1.2rem;
  color: #666;
  line-height: 1.6;
}

.contact-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 4rem;
}

.contact-card {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.contact-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
}

.contact-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: #f8f9fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-icon i {
  font-size: 2.5rem;
}

.contact-card h3 {
  color: #2577c8;
  font-size: 1.4rem;
  margin-bottom: 1rem;
}

.contact-card p {
  color: #666;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.contact-link {
  color: #2577c8;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  transition: color 0.3s ease;
}

.contact-link:hover {
  color: #1b5a9d;
}

.social-media {
  text-align: center;
  margin-top: 4rem;
}

.social-media h3 {
  color: #333;
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
}

.social-icons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

.social-icon {
  width: 50px;
  height: 50px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.social-icon:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }

  .hero-content p {
    font-size: 1.2rem;
  }

  .section-content {
    flex-direction: column;
    gap: 2rem;
  }

  .reverse {
    flex-direction: column;
  }

  .image-container {
    height: 300px;
  }

  .mission-points {
    grid-template-columns: 1fr;
  }

  .values-grid {
    grid-template-columns: 1fr;
  }

  .contact-cards {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .contact-card {
    padding: 1.5rem;
  }

  .contact-icon {
    width: 60px;
    height: 60px;
  }

  .contact-icon i {
    font-size: 2rem;
  }

  .social-icons {
    gap: 1rem;
  }

  .social-icon {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }

  .contact-subtitle {
    font-size: 1.1rem;
    padding: 0 1rem;
  }
}

@media (min-width: 1600px) {
  .section-content {
    max-width: 1400px;
  }

  .hero-content {
    max-width: 1000px;
  }
}
</style>
