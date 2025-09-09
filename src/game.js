// Flood facts for educational content
const floodFacts = [
  "❗ Many drainage systems in cities are clogged with trash, worsening floods.",
  "🏗️ Ghost infrastructure projects waste money that should protect communities.",
  "🌊 Improper dam construction and corruption can increase flood risks.",
  "♻️ Planting trees and restoring rivers can reduce flooding impact.",
  "🚧 Poor urban planning often leads to blocked waterways and heavier floods.",
];

class Game {
  constructor() {
    this.canvas = document.getElementById("game-canvas");
    this.fireboy = document.getElementById("fireboy");
    this.watergirl = document.getElementById("watergirl");
    this.flood = document.getElementById("flood");

    this.level = 1;
    this.gems = { collected: 0, total: 4 };
    this.floodHeight = 0;
    this.floodRiseSpeed = 0.5;
    this.gameRunning = true;

    this.characters = {
      fireboy: {
        x: 50,
        y: 520,
        width: 32,
        height: 32,
        onGround: false,
        velY: 0,
      },
      watergirl: {
        x: 100,
        y: 520,
        width: 32,
        height: 32,
        onGround: false,
        velY: 0,
      },
    };

    this.keys = {};
    this.gravity = 0.8;
    this.jumpPower = 15;
    this.moveSpeed = 5;

    this.platforms = [];
    this.pools = [];
    this.doors = [];
    this.gameGems = [];

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.createLevel();
    this.gameLoop();
    this.floodTimer();
  }

  setupEventListeners() {
    document.addEventListener("keydown", (e) => {
      this.keys[e.key.toLowerCase()] = true;
    });

    document.addEventListener("keyup", (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });

    document
      .getElementById("restart-btn")
      .addEventListener("click", () => {
        this.restart();
      });
  }

  createLevel() {
    this.clearLevel();

    // Create platforms
    this.createPlatform(0, 580, 800, 20); // Ground
    this.createPlatform(200, 480, 150, 20);
    this.createPlatform(450, 380, 150, 20);
    this.createPlatform(100, 350, 100, 20);
    this.createPlatform(600, 450, 100, 20);
    this.createPlatform(300, 250, 200, 20);
    this.createPlatform(650, 300, 100, 20);
    this.createPlatform(50, 200, 120, 20);

    // Create pools
    this.createPool("lava", 160, 560, 80, 20);
    this.createPool("water", 350, 560, 80, 20);
    this.createPool("poison", 500, 560, 80, 20);
    this.createPool("lava", 400, 360, 60, 20);
    this.createPool("water", 550, 430, 60, 20);

    // Create doors
    this.createDoor("fire", 680, 240);
    this.createDoor("water", 720, 240);

    // Create gems
    this.createGem("fire", 250, 450);
    this.createGem("water", 500, 350);
    this.createGem("fire", 650, 470);
    this.createGem("water", 320, 220);
  }

  createPlatform(x, y, width, height) {
    const platform = document.createElement("div");
    platform.className = "platform";
    platform.style.left = x + "px";
    platform.style.top = y + "px";
    platform.style.width = width + "px";
    platform.style.height = height + "px";
    this.canvas.appendChild(platform);

    this.platforms.push({ x, y, width, height, element: platform });
  }

  createPool(type, x, y, width, height) {
    const pool = document.createElement("div");
    pool.className = `${type}-pool`;
    pool.style.left = x + "px";
    pool.style.top = y + "px";
    pool.style.width = width + "px";
    pool.style.height = height + "px";
    this.canvas.appendChild(pool);

    this.pools.push({ type, x, y, width, height, element: pool });
  }

  createDoor(type, x, y) {
    const door = document.createElement("div");
    door.className = `door ${type}-door`;
    door.style.left = x + "px";
    door.style.top = y + "px";
    this.canvas.appendChild(door);

    this.doors.push({ type, x, y, width: 40, height: 60, element: door });
  }

  createGem(type, x, y) {
    const gem = document.createElement("div");
    gem.className = `gem ${type}-gem`;
    gem.style.left = x + "px";
    gem.style.top = y + "px";
    this.canvas.appendChild(gem);

    this.gameGems.push({
      type,
      x,
      y,
      width: 20,
      height: 20,
      element: gem,
      collected: false,
    });
  }

  clearLevel() {
    const elements = this.canvas.querySelectorAll(
      ".platform, .lava-pool, .water-pool, .poison-pool, .door, .gem, .flood-svg"
    );
    elements.forEach((el) => el.remove());

    this.platforms = [];
    this.pools = [];
    this.doors = [];
    this.gameGems = [];
  }

  updateCharacter(char, charName) {
    // Handle input
    if (charName === "fireboy") {
      if (this.keys["a"]) char.x -= this.moveSpeed;
      if (this.keys["d"]) char.x += this.moveSpeed;
      if (this.keys["w"] && char.onGround) {
        char.velY = -this.jumpPower;
        char.onGround = false;
      }
    } else if (charName === "watergirl") {
      if (this.keys["arrowleft"]) char.x -= this.moveSpeed;
      if (this.keys["arrowright"]) char.x += this.moveSpeed;
      if (this.keys["arrowup"] && char.onGround) {
        char.velY = -this.jumpPower;
        char.onGround = false;
      }
    }

    // Apply gravity
    if (!char.onGround) {
      char.velY += this.gravity;
    }
    char.y += char.velY;

    // Boundary checks
    char.x = Math.max(0, Math.min(char.x, 800 - char.width));

    // Platform collision
    char.onGround = false;
    for (let platform of this.platforms) {
      if (this.checkCollision(char, platform)) {
        if (char.velY > 0 && char.y < platform.y) {
          char.y = platform.y - char.height;
          char.velY = 0;
          char.onGround = true;
        }
      }
    }

    // Pool collision
    for (let pool of this.pools) {
      if (this.checkCollision(char, pool)) {
        if (
          (pool.type === "lava" && charName === "watergirl") ||
          (pool.type === "water" && charName === "fireboy") ||
          pool.type === "poison"
        ) {
          this.gameOver("Game Over! Character touched deadly element!");
          return;
        }
      }
    }

    // Gem collection
    for (let gem of this.gameGems) {
      if (!gem.collected && this.checkCollision(char, gem)) {
        if (
          (gem.type === "fire" && charName === "fireboy") ||
          (gem.type === "water" && charName === "watergirl")
        ) {
          gem.collected = true;
          gem.element.style.display = "none";
          this.gems.collected++;
          this.updateUI();
        }
      }
    }

    // Flood collision
    if (char.y + char.height > 600 - this.floodHeight) {
      this.gameOver("Game Over! Caught by the flood!");
      return;
    }

    // Door collision (win condition)
    for (let door of this.doors) {
      if (this.checkCollision(char, door)) {
        if (
          (door.type === "fire" && charName === "fireboy") ||
          (door.type === "water" && charName === "watergirl")
        ) {
          this.checkWin();
        }
      }
    }
  }

  checkCollision(obj1, obj2) {
    return (
      obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y
    );
  }

  checkWin() {
    // Check if both characters are at their doors and all gems collected
    let fireboyAtDoor = false;
    let watergirlAtDoor = false;

    for (let door of this.doors) {
      if (
        door.type === "fire" &&
        this.checkCollision(this.characters.fireboy, door)
      ) {
        fireboyAtDoor = true;
      }
      if (
        door.type === "water" &&
        this.checkCollision(this.characters.watergirl, door)
      ) {
        watergirlAtDoor = true;
      }
    }

    if (
      fireboyAtDoor &&
      watergirlAtDoor &&
      this.gems.collected >= this.gems.total
    ) {
      this.winGame(); // ✅ Use win modal
    }
  }


  winGame() {
  this.gameRunning = false;

  // Show win modal
  const modal = document.getElementById("win-modal");
  document.getElementById("gameover-message").textContent = "✅ Level Complete! Well done!";
  document.getElementById("gameover-message").style.color = "green"; // green text
  document.getElementById("flood-fact").textContent = "🎉 Great teamwork! You escaped the flood this time.";
  modal.classList.remove("hidden");

  // Restart button
  document.getElementById("win-restart-btn").onclick = () => {
    modal.classList.add("hidden");
    this.restart();
  };
}


  gameOver(message) {
    this.gameRunning = false;

    // Pick a random fact
    const randomFact = floodFacts[Math.floor(Math.random() * floodFacts.length)];

    // Show modal
    const modal = document.getElementById("gameover-modal");
    document.getElementById("gameover-message").textContent = message;
    document.getElementById("flood-fact").textContent = randomFact;
    modal.classList.remove("hidden");

    // Restart button
    document.getElementById("restart-modal-btn").onclick = () => {
      modal.classList.add("hidden");
      this.restart();
    };
  }

  updateUI() {
    document.getElementById("level").textContent = this.level;
    document.getElementById(
      "gems"
    ).textContent = `${this.gems.collected}/${this.gems.total}`;
    document.getElementById("flood-height").textContent =
      Math.round((this.floodHeight / 600) * 100) + "%";
  }

  render() {
    this.fireboy.style.left = this.characters.fireboy.x + "px";
    this.fireboy.style.top = this.characters.fireboy.y + "px";

    this.watergirl.style.left = this.characters.watergirl.x + "px";
    this.watergirl.style.top = this.characters.watergirl.y + "px";

    this.flood.style.height = this.floodHeight + "px";
  }

  gameLoop() {
    if (!this.gameRunning) return;

    this.updateCharacter(this.characters.fireboy, "fireboy");
    this.updateCharacter(this.characters.watergirl, "watergirl");
    this.render();

    requestAnimationFrame(() => this.gameLoop());
  }

  floodTimer() {
    if (!this.gameRunning) return;

    setTimeout(() => {
      this.floodHeight += this.floodRiseSpeed;
      this.updateUI();

      if (this.floodHeight < 400) {
        // Don't flood too high
        this.floodTimer();
      }
    }, 100);
  }

  restart() {
    this.gameRunning = true;
    this.gems.collected = 0;
    this.floodHeight = 0;

    this.characters.fireboy = {
      x: 50,
      y: 520,
      width: 32,
      height: 32,
      onGround: false,
      velY: 0,
    };
    this.characters.watergirl = {
      x: 100,
      y: 520,
      width: 32,
      height: 32,
      onGround: false,
      velY: 0,
    };

    document.getElementById("game-status").textContent = "";
    this.createLevel();
    this.updateUI();
    this.gameLoop();
    this.floodTimer();
  }
}

// Initialize the game when page loads
window.addEventListener("load", () => {
  const startModal = document.getElementById("start-modal");
  const startBtn = document.getElementById("start-btn");

  startBtn.addEventListener("click", () => {
    startModal.classList.add("hidden"); // Hide modal
    new Game(); // Start game
  });
});