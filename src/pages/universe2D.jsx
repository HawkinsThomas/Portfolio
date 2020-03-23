import 'css/universe2D.css';

const canvas = document.querySelector('canvas');
const { innerWidth } = window;
const { innerHeight } = window;
canvas.width = innerWidth;
canvas.height = innerHeight;

const c = canvas.getContext('2d');

const circle = (x, y, mass, radius, colour, dx, dy) => {
  return ({
    x,
    y,
    mass,
    radius,
    extraRadius: 0,
    colour,
    defaultColour: 'lightgrey',
    dx,
    dy,
    ddx: 0,
    ddy: 0,
    forceX: 0,
    forceY: 0,
    t: 0.0001,
    mouseProximity: 0,
    drawLines: true,
    draw() {
      //this.getMouseProximity(mouse);
      //this.updateRadius();
      c.beginPath();
      if (this.extraRadius <= 1) {
        c.fillStyle = this.defaultColour;
      } else {
        c.fillStyle = this.colour;
      }
      c.arc(this.x, this.y, this.radius + this.extraRadius, 0, Math.PI * 2, false);
      c.fill();
      c.beginPath();
      if (this.drawLines) {
        c.strokeStyle = 'red';
        c.moveTo(this.x, this.y);
        c.lineTo(this.x + this.forceX * 0.5, this.y + this.forceY * 0.5);
        c.stroke();
        c.beginPath();
      }
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
    resetForce() {
      this.forceX = 0;
      this.forceY = 0;
    },
    addForce(force) {
      this.forceX += force.forceX;
      this.forceY += force.forceY;
    },
    accelerate() {
      this.ddx = this.forceX / this.mass;
      this.ddy = this.forceY / this.mass;
    },
    updatePosition() {
      this.detectBoundaries();
      this.accelerate();
      this.dx += this.ddx;
      this.dy += this.ddy;
      this.x += this.dx * this.t + 0.5 * this.ddx * (this.t ** 2);
      this.y += this.dy * this.t + 0.5 * this.ddy * (this.t ** 2);
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

const engine = {
  gravityConstant: 100,
  totalFrames: 0,
  chanceOfCollision: 1,
  startCondition: [],
  objects: [],
  setStartCondition(objects) {
    this.startCondition = objects;
    this.objects = objects;
  },
  detectCollision(object1, object2) {
    const deltaX = object1.x - object2.x;
    const deltaY = object1.y - object2.y;
    const distance = (Math.sqrt((deltaX ** 2) + (deltaY ** 2)));
    if (object1.radius + object2.radius > distance) {
      if (Math.random * 100 < this.chanceOfCollision) {
        return true;
      }
      object1.dx *= 0.5;
      object2.dx *= 0.5;
      object1.dy *= 0.5;
      object2.dy *= 0.5;
    }
    return false;
  },
  handleCollisions() {
    //TODO: if a collision has occured, handle it.
    //delete the smaller obj
    //conserve mass
    //calculate momentum

  },
  calculateForce(object1, object2) {
    const deltaX = object1.x - object2.x;
    const deltaY = object1.y - object2.y;
    let radians = Math.atan2(deltaY, deltaX);
    radians %= (Math.PI * 2);

    const distance = (Math.sqrt((deltaX ** 2) + (deltaY ** 2)));
    if (distance < 1.7) {
      return { forceX: 0, forceY: 0 };
    }

    const forceX = (this.gravityConstant * object1.mass * object2.mass * Math.cos(radians)) / (distance ** 2);
    const forceY = (this.gravityConstant * object1.mass * object2.mass * Math.sin(radians)) / (distance ** 2);
    return { forceX, forceY };
  },
  zeroForces() {
    this.objects.forEach(object => object.resetForce());
  },
  updateForces() {
    const oppositeForceMethod = true;
    this.zeroForces();
    if (oppositeForceMethod) {
      this.objects.forEach((object, idx, objects) => {
        for (let j = 0; j < objects.length - (idx + 1); j += 1) {
          const force = this.calculateForce(object, objects[j + (idx + 1)]);
          const oppositeForce = { forceX: force.forceX * -1, forceY: force.forceY * -1 };
          object.addForce(oppositeForce);
          objects[j + idx + 1].addForce(force);
        }
      });
    } else {
      this.objects.forEach((object, idx, objects) => {
        for (let j = 0; j < objects.length; j += 1) {
          if (idx !== j) {
            const force = this.calculateForce(objects[j], object);
            object.addForce(force);
          }
        }
      });
    }
    
  },
  updateFrame() {
    this.updateForces();
    this.objects.forEach((object) => {
      object.updatePosition();
      object.draw();
    });
  },
  recordFrame() {
    //record object position state in an object that is readable by animator
  },
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
const rows = 10;
const columns = 30;
for (let i = 0; i < rows; i += 1) {
  for (let j = 0; j < columns; j += 1) {
    const radius = 4;
    const spawnx = j / columns * (innerWidth - radius * 2) + radius + (innerWidth / (2 * columns));
    const spawny = i / rows * (innerHeight - radius * 2) + radius + (innerHeight / (2 * rows));
    const spawndx = 0;//(Math.random() * 200) - 100;
    const spawndy = 0;//(Math.random() * 200) - 100;
    const circ = circle(spawnx, spawny, 10, radius, colours[i % colours.length], spawndx, spawndy);
    circles.push(circ);
  }
}

engine.setStartCondition(circles);

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);
  engine.updateFrame();
  console.log(engine.objects);
}

animate();
