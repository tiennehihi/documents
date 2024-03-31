i, b {
  font-style: normal;
  font-weight: 400;
}

body, html {
  padding: 0;
  margin: 0;
}

body {
  background: white;
}

body, td, input, textarea {
  font-family: source sans pro, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #222;
}

button {
  cursor: pointer;
}

* {
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

.nprogress-logo {
  display: inline-block;

  width: 100px;
  height: 20px;
  border: solid 4px #2d9;
  border-radius: 10px;

  position: relative;
}
.nprogress-logo:after {
  content: '';
  display: block;

  position: absolute;
  top: 4px;
  left: 4px;
  bottom: 4px;
  width: 40%;

  background: #2d9;
  border-radius: 3px;
}

.fade {
  transition: all 300ms linear 700ms;
  -webkit-transform: translate3d(0,0,0);
  -moz-transform: translate3d(0,0,0);
  -ms-transform: translate3d(0,0,0);
  -o-transform: translate3d(0,0,0);
  transform: translate3d(0,0,0);
  opacity: 1;
}

.fade.out {
  opacity: 0;
}

button {
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
}

.button