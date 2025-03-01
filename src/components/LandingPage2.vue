<template>
  <div class="landing-page">
    <section class="hero">
      <h1>Bine ați venit la Magazinul Românesc</h1>
      <p>Descoperiți cele mai bune produse tradiționale românești!</p>
      <button class="cta-button">Explorați Produsele</button>
    </section>
    <section class="features">
      <div class="feature">
        <h2>Produse Autentice</h2>
        <p>Gama noastră de produse este 100% autentică și tradițională.</p>
      </div>
      <div class="feature">
        <h2>Livrare Rapidă</h2>
        <p>Asigurăm livrare rapidă și sigură la ușa dumneavoastră.</p>
      </div>
      <div class="feature">
        <h2>Calitate Garantată</h2>
        <p>Produsele noastre sunt de cea mai înaltă calitate.</p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'LandingPage2',
}
</script>

<style scoped>
.landing-page {
  text-align: center;
  padding: 20px;
}

.hero {
  background-color: #030303;
  padding: 50px 20px;
}

.cta-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
}

.features {
  display: flex;
  justify-content: space-around;
  padding: 50px 20px;
}

.feature {
  max-width: 300px;
}

.feature h2 {
  color: #42b983;
}
</style>
