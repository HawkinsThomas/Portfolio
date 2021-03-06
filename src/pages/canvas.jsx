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
    extraRadius: 0,
    colour,
    defaultColour: 'lightgrey',
    dx,
    dy,
    mouseProximity: 0,
    draw(mouse) {
      this.getMouseProximity(mouse);
      this.updateRadius();
      c.beginPath();
      if (this.extraRadius <= 1) {
        c.fillStyle = this.defaultColour;
      } else {
        c.fillStyle = this.colour;
      }
      c.arc(this.x, this.y, this.radius + this.extraRadius, 0, Math.PI * 2, false);
      c.fill();
      c.beginPath();
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
    getMouseProximity(mouse) {
      this.mouseProximity = Math.sqrt(((this.x - mouse.x) ** 2) + ((this.y - mouse.y) ** 2));
    },
    updateRadius() {
      const interactionRadius = 75;
      if (this.mouseProximity < interactionRadius) {
        const proximityRad = 50 * ((interactionRadius - this.mouseProximity) / interactionRadius);
        if (proximityRad > this.extraRadius) {
          this.extraRadius = proximityRad;
        }
      } else if (this.extraRadius > 0) {
        this.extraRadius = this.extraRadius - 0.5;
      }
    },
  });
};

const mouse = {
  x: undefined,
  y: undefined,
  updatePosition(event) {
    this.x = event.x;
    this.y = event.y;
  },
};

canvas.addEventListener('mousemove', (event) => {
  mouse.updatePosition(event);
});

canvas.addEventListener('touchmove', (event) => {
  event.preventDefault();
  mouse.updatePosition({ x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY });
});

const circles = [];
const colours = ['#E27D60', '#85DCBA', '#E8A87C', '#C38D9E', '#41B3A3'];

for (let i = 0; i < 500; i += 1) {
  const radius = 3 + (4 * Math.random());
  const spawnx = Math.random() * (innerWidth - radius * 2) + radius;
  const spawny = Math.random() * (innerHeight - radius * 2) + radius;
  const spawndx = (Math.random() - 0.5) * 3;
  const spawndy = (Math.random() - 0.5) * 3;
  const circ = circle(spawnx, spawny, radius, colours[i % colours.length], spawndx, spawndy);
  circles.push(circ);
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);
  circles.forEach((circ) => {
    circ.draw(mouse);
    circ.updatePosition();
  });
}

animate();
