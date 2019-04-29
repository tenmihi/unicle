<template>
  <div id="app">
    <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
      <div class="navbar-brand header">
        <router-link class="navbar-item" to="/">
          Home
        </router-link>
        <router-link class="navbar-item" to="/about">
          About
        </router-link>
      </div>
    </nav>
    <div class="container">
      <div class="hero-body">
        <div class="logo">
          <router-link to="/">
            <img src="../public/logo.png" width="128" height="80">
          </router-link>
        </div>
      </div>
      <router-view class="app-content" />
    </div>
  </div>
</template>

<style>
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.app-content {
  margin: 0px 16px;
}
</style>