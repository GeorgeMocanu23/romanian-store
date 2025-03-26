<template>
  <div class="landing-container">
    <!-- Carousel Section -->
    <div class="carousel-container">
      <div class="carousel">
        <div v-for="(slide, index) in slides" 
             :key="slide.id" 
             v-show="currentSlide === index" 
             class="carousel-slide">
          <img :src="slide.image" 
               :alt="slide.title" 
               @error="handleImageError">
          <div class="slide-content">
            <h2>{{ slide.title }}</h2>
            <p>{{ slide.description }}</p>
          </div>
        </div>

        <button class="carousel-control prev" @click="prevSlide">❮</button>
        <button class="carousel-control next" @click="nextSlide">❯</button>
        
        <div class="carousel-indicators">
          <button v-for="(slide, index) in slides" 
                  :key="slide.id"
                  :class="['indicator', { active: currentSlide === index }]"
                  @click="goToSlide(index)">
          </button>
        </div>
      </div>
    </div>

    <!-- Welcome Section -->
    <div class="welcome-section">
      <h1>Bun venit la Magazinul Românesc</h1>
      <p>Descoperă gustul autentic al produselor tradiționale românești</p>
      <router-link to="/products" class="cta-button">Vezi produsele noastre</router-link>
    </div>

    <!-- Features Section -->
    <div class="features-section">
      <div class="feature">
        <i class="feature-icon">🌟</i>
        <h3>Calitate Premium</h3>
        <p>Produse autentice românești</p>
      </div>
      <div class="feature">
        <i class="feature-icon">🚚</i>
        <h3>Livrare Rapidă</h3>
        <p>În toată țara în 24-48h</p>
      </div>
      <div class="feature">
        <i class="feature-icon">💝</i>
        <h3>Satisfacție Garantată</h3>
        <p>Clienți mulțumiți garantat</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LandingPage',

  data() {
    return {
      slides: [
        {
          id: 1,
          title: 'Produse Tradiționale Românești',
          description: 'Gustul autentic al bucătăriei românești',
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'
        },
        {
          id: 2,
          title: 'Cozonaci Proaspeți',
          description: 'Făcuți cu dragoste și ingrediente naturale',
          image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff'
        },
        {
          id: 3,
          title: 'Preparate ca la Mama Acasă',
          description: 'Rețete tradiționale transmise din generație în generație',
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5'
        }
      ],
      currentSlide: 0,
      timer: null
    }
  },

  methods: {
    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length
    },

    prevSlide() {
      this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length
    },

    goToSlide(index) {
      this.currentSlide = index
    },

    startSlideShow() {
      this.timer = setInterval(this.nextSlide, 5000)
    },

    handleImageError(event) {
      event.target.src = 'https://picsum.photos/1200/800'
    }
  },

  mounted() {
    this.startSlideShow()
  },

  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}
</script>

<style scoped>
.landing-container {
  margin-top: 60px;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  overflow-x: hidden;
  background-color: white;
  position: relative;
}

.carousel-container {
  position: relative;
  width: 100vw;
  height: 80vh;
  min-height: 400px;
  background-color: #f5f5f5;
  overflow: hidden;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

.carousel {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.carousel-slide {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.slide-content {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 3rem 5%;
  margin-top: auto;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
}

.slide-content h2 {
  font-size: clamp(1.5rem, 5vw, 3rem);
  margin-bottom: 1rem;
}

.slide-content p {
  font-size: clamp(1rem, 2vw, 1.5rem);
}

.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  color: white;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.prev {
  left: 20px;
}

.next {
  right: 20px;
}

.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 3;
}

.indicator {
  width: clamp(8px, 1.5vw, 12px);
  height: clamp(8px, 1.5vw, 12px);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  padding: 0;
}

.indicator.active {
  background: white;
}

/* Welcome Section Styles */
.welcome-section {
  text-align: center;
  padding: 4rem 5%;
  background: white;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

.welcome-section h1 {
  font-size: clamp(2rem, 4vw, 3rem);
  color: #2577c8;
  margin-bottom: 1rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.welcome-section p {
  font-size: clamp(1rem, 2vw, 1.3rem);
  color: #666;
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.cta-button {
  display: inline-block;
  padding: clamp(0.8rem, 2vw, 1.2rem) clamp(1.5rem, 4vw, 2.5rem);
  background: #2577c8;
  color: white;
  text-decoration: none;
  border-radius: 30px;
  font-size: clamp(1rem, 1.5vw, 1.2rem);
  transition: transform 0.3s, background 0.3s;
}

.cta-button:hover {
  background: #1b5a9d;
  transform: translateY(-2px);
}

/* Features Section Styles */
.features-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(1rem, 3vw, 2rem);
  padding: 4rem 5%;
  background: #f9f9f9;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

.feature {
  flex: 1;
  min-width: 280px;
  max-width: 400px;
  margin: 1rem;
  text-align: center;
  padding: clamp(1.5rem, 3vw, 2.5rem);
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.feature:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: clamp(2rem, 4vw, 3rem);
  margin-bottom: 1rem;
}

.feature h3 {
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  color: #2577c8;
  margin-bottom: 0.5rem;
}

.feature p {
  font-size: clamp(0.9rem, 1.5vw, 1.1rem);
  color: #666;
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

/* Add a container for content to limit the maximum width */
.welcome-section > *,
.features-section > * {
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

/* Adjust the grid for features to maintain the correct spacing */
.features-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .landing-container {
    margin-top: 60px;
  }

  .carousel-container {
    height: 60vh;
  }

  .feature {
    min-width: 250px;
    margin: 0.5rem;
  }
}

@media (max-width: 480px) {
  .carousel-container {
    height: 50vh;
  }

  .feature {
    min-width: 100%;
    margin: 0.5rem 0;
  }
}
</style>
