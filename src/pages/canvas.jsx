import 'css/canvas.css';

const canvas = document.querySelector('canvas');
const { innerWidth } = window;
const { innerHeight } = window;
canvas.width = innerWidth;
canvas.height = innerHeight;

const c = canvas.getContext('2d');

const circle = (x, y, radius, colour, dx, dy) => {
  return ({
    x,
    y,
    radius,
    colour,
    dx,
    dy,
    draw() {
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.strokeStyle = colour;
      c.fillStyle = colour;
      c.stroke();
      c.fill();
      return this;
    },
    detectBoundaries() {
      if (this.x + this.radius >= innerWidth || this.x - this.radius <= 0) {
        this.dx *= -1;
      }

      if (this.y + this.radius >= innerHeight || this.y - this.radius <= 0) {
        this.dy *= -1;
      }
    },
    updatePosition() {
      this.detectBoundaries();
      this.x += this.dx;
      this.y += this.dy;
    },
  });
};
const circles = [];
const colours = ['yellow', 'orange', 'black'];

for (let i = 0; i < 100; i += 1) {
  const radius = 30;
  const spawnx = Math.random() * (innerWidth - radius * 2) + radius;
  const spawny = Math.random() * (innerHeight - radius * 2) + radius;
  const circ = circle(spawnx, spawny, radius, colours[i % 3], (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2);
  circles.push(circ);
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);
  circles.forEach((circ) => {
    circ.draw();
    circ.updatePosition();
  });
}

animate();
