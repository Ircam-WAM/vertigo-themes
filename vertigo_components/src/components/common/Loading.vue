<template>
  <div :class="[ 'lds-ring', `color-${color}`]">
    <div />
    <div />
    <div />
    <div />
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    color: {
      type: String,
      default: 'white',
      validator: (v) => !v || ['white', 'black'].indexOf(v) !== -1
    }
  }
}
</script>

<style scoped>
.lds-ring {
  display: block;
  position: relative;
  width: 64px;
  height: 64px;
  margin: auto;
}

.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 51px;
  height: 51px;
  margin: 6px;
  border: 6px solid #fff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;

  /* default color */
  border-color: white transparent transparent transparent;
}

.lds-ring.color-black div {
  border-color: black transparent transparent transparent;
}

.lds-ring.color-white div {
  border-color: white transparent transparent transparent;
}

.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}

.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}

.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}

@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
