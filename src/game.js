const floodFacts = [
        "❗ Many drainage systems in cities are clogged with trash, worsening floods.",
        "🏗️ Ghost infrastructure projects waste money that should protect communities.",
        "🌊 Improper dam construction and corruption can increase flood risks.",
        "♻️ Planting trees and restoring rivers can reduce flooding impact.",
        "🚧 Poor urban planning often leads to blocked waterways and heavier floods.",
        "🏙️ Concrete surfaces prevent water absorption, increasing flood severity.",
        "🌳 Deforestation removes natural flood barriers and water absorption.",
        "💰 Corruption in flood control projects puts communities at greater risk.",
      ];

      const levelDescriptions = [
        "🎓 Tutorial: Learn the basics of teamwork and gem collection!",
        "🚧 Separation: Characters must take different paths to succeed!",
        "🌀 The Maze: Navigate complex paths and avoid deadly traps!",
        "💀 Final Trial: Fast flood, narrow platforms, perfect timing required!"
      ];

      class Game {
        constructor() {
          this.canvas = document.getElementById("game-canvas");
          this.fireboy = document.getElementById("fireboy");
          this.watergirl = document.getElementById("watergirl");
          this.flood = document.getElementById("flood");

          this.level = 1;
          this.maxLevel = 5;
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

          document.getElementById("restart-btn").addEventListener("click", () => {
            this.restart();
          });
        }

        createLevel() {
          this.clearLevel();
          this.setLevelParameters();
          
          switch(this.level) {
            case 1:
              this.createLevel1();
              break;
            case 2:
              this.createLevel2();
              break;
            case 3:
              this.createLevel3();
              break;
            case 4:
              this.createLevel4();
              break;
            case 5:
              this.createLevel5();
              break;
            default:
              this.createLevel1();
          }
        }

        setLevelParameters() {
          switch(this.level) {
            case 1:
              this.floodRiseSpeed = 0.3;
              this.gems.total = 4;
              break;
            case 2:
              this.floodRiseSpeed = 0.5;
              this.gems.total = 6;
              break;
            case 3:
              this.floodRiseSpeed = 0.7;
              this.gems.total = 8;
              break;
            case 4:
              this.floodRiseSpeed = 0.9;
              this.gems.total = 10;
              break;
            case 5:
              this.floodRiseSpeed = 1.2;
              this.gems.total = 12;
              break;
          }
        }

        createLevel1() {
          // Level 1: Tutorial - Simple layout
          this.createPlatform(0, 580, 800, 20); // Ground
          this.createPlatform(200, 480, 150, 20);
          this.createPlatform(450, 380, 150, 20);
          this.createPlatform(300, 250, 200, 20);
          
          // Simple hazards
          this.createPool("lava", 160, 560, 80, 20);
          this.createPool("water", 350, 560, 80, 20);
          
          // Doors close together
          this.createDoor("fire", 480, 190);
          this.createDoor("water", 520, 190);
          
          // Easy gem placement
          this.createGem("fire", 250, 450);
          this.createGem("water", 500, 350);
          this.createGem("fire", 350, 220);
          this.createGem("water", 450, 220);
        }

        createLevel2() {
          // Level 2: Separation - Characters must take different paths
          this.createPlatform(0, 580, 800, 20); // Ground
          this.createPlatform(100, 500, 100, 20);
          this.createPlatform(300, 450, 100, 20);
          this.createPlatform(500, 400, 100, 20);
          this.createPlatform(700, 350, 100, 20);
          this.createPlatform(150, 350, 100, 20);
          this.createPlatform(350, 250, 100, 20);
          this.createPlatform(550, 200, 100, 20);

          // More hazards
          this.createPool("lava", 200, 560, 100, 20);
          this.createPool("water", 400, 560, 100, 20);
          this.createPool("poison", 600, 560, 80, 20);
          this.createPool("lava", 250, 430, 60, 20);
          this.createPool("water", 450, 380, 60, 20);

          // Doors separated
          this.createDoor("fire", 580, 140);
          this.createDoor("water", 620, 140);

          // More gems, requiring teamwork
          this.createGem("fire", 150, 470);
          this.createGem("water", 350, 420);
          this.createGem("fire", 530, 370);
          this.createGem("water", 730, 320);
          this.createGem("fire", 380, 220);
          this.createGem("water", 580, 170);
        }

        createLevel3() {
          // Level 3: Maze-like - Complex navigation
          this.createPlatform(0, 580, 800, 20); // Ground
          // Left side path
          this.createPlatform(50, 520, 60, 20);
          this.createPlatform(150, 460, 60, 20);
          this.createPlatform(50, 400, 60, 20);
          this.createPlatform(150, 340, 60, 20);
          this.createPlatform(50, 280, 60, 20);
          this.createPlatform(150, 220, 60, 20);
          
          // Middle obstacles
          this.createPlatform(300, 500, 60, 20);
          this.createPlatform(400, 450, 60, 20);
          this.createPlatform(300, 400, 60, 20);
          this.createPlatform(400, 350, 60, 20);
          this.createPlatform(300, 300, 60, 20);
          this.createPlatform(400, 250, 60, 20);
          
          // Right side path
          this.createPlatform(600, 480, 60, 20);
          this.createPlatform(700, 420, 60, 20);
          this.createPlatform(600, 360, 60, 20);
          this.createPlatform(700, 300, 60, 20);
          this.createPlatform(600, 240, 60, 20);
          this.createPlatform(700, 180, 60, 20);
          
          // Top platform
          this.createPlatform(250, 150, 300, 20);
          
          // Many hazards
          this.createPool("lava", 120, 560, 40, 20);
          this.createPool("water", 210, 560, 40, 20);
          this.createPool("poison", 360, 560, 40, 20);
          this.createPool("lava", 460, 560, 40, 20);
          this.createPool("water", 560, 560, 40, 20);
          this.createPool("poison", 110, 500, 40, 20);
          this.createPool("lava", 210, 440, 40, 20);
          this.createPool("water", 360, 480, 40, 20);
          this.createPool("poison", 460, 430, 40, 20);
          this.createPool("lava", 660, 460, 40, 20);
          this.createPool("water", 660, 400, 40, 20);
          
          this.createDoor("fire", 350, 90);
          this.createDoor("water", 400, 90);
          
          // Hidden gems requiring exploration
          this.createGem("fire", 80, 490);
          this.createGem("water", 180, 430);
          this.createGem("fire", 80, 370);
          this.createGem("water", 180, 310);
          this.createGem("fire", 330, 470);
          this.createGem("water", 430, 420);
          this.createGem("fire", 630, 450);
          this.createGem("water", 730, 390);
          this.createGem("fire", 630, 330);
          this.createGem("water", 730, 270);
        }

        createLevel4() {
          // Level 4: Final Challenge - Fast flood, precise timing
          this.createPlatform(0, 580, 800, 20); // Ground
          
          // Narrow platforms requiring precise jumps
          this.createPlatform(80, 520, 40, 20);
          this.createPlatform(180, 480, 40, 20);
          this.createPlatform(280, 440, 40, 20);
          this.createPlatform(380, 400, 40, 20);
          this.createPlatform(480, 360, 40, 20);
          this.createPlatform(580, 320, 40, 20);
          this.createPlatform(680, 280, 40, 20);
          
          // Alternative path
          this.createPlatform(120, 460, 40, 20);
          this.createPlatform(220, 400, 40, 20);
          this.createPlatform(320, 340, 40, 20);
          this.createPlatform(420, 280, 40, 20);
          this.createPlatform(520, 220, 40, 20);
          this.createPlatform(620, 160, 40, 20);
          
          // High platform network
          this.createPlatform(100, 300, 40, 20);
          this.createPlatform(200, 260, 40, 20);
          this.createPlatform(300, 220, 40, 20);
          this.createPlatform(400, 180, 40, 20);
          this.createPlatform(500, 140, 40, 20);
          this.createPlatform(600, 100, 40, 20);
          
          // Final platform
          this.createPlatform(350, 80, 100, 20);
          
          // Maximum hazards
          this.createPool("lava", 120, 560, 30, 20);
          this.createPool("water", 160, 560, 30, 20);
          this.createPool("poison", 200, 560, 30, 20);
          this.createPool("lava", 240, 560, 30, 20);
          this.createPool("water", 280, 560, 30, 20);
          this.createPool("poison", 320, 560, 30, 20);
          this.createPool("lava", 360, 560, 30, 20);
          this.createPool("water", 400, 560, 30, 20);
          this.createPool("poison", 440, 560, 30, 20);
          this.createPool("lava", 480, 560, 30, 20);
          this.createPool("water", 520, 560, 30, 20);
          this.createPool("poison", 560, 560, 30, 20);
          this.createPool("lava", 600, 560, 30, 20);
          this.createPool("water", 640, 560, 30, 20);
          this.createPool("poison", 680, 560, 30, 20);
          
          this.createDoor("fire", 370, 20);
          this.createDoor("water", 410, 20);
          
          // Gems requiring perfect coordination
          this.createGem("fire", 100, 490);
          this.createGem("water", 200, 450);
          this.createGem("fire", 300, 410);
          this.createGem("water", 400, 370);
          this.createGem("fire", 500, 330);
          this.createGem("water", 600, 290);
          this.createGem("fire", 130, 280);
          this.createGem("water", 230, 230);
          this.createGem("fire", 330, 190);
          this.createGem("water", 430, 150);
          this.createGem("fire", 530, 110);
          this.createGem("water", 630, 70);
        }

        createPlatform(x, y, width, height) {
          const platform = document.createElement("div");
          platform.className = "platform";
          platform.style.left = x + "px";
          platform.style.top = y + "px";
          platform.style.width = width + "px";
          platform.style.height = height + "px";
          this.canvas.querySelector('.overlay').appendChild(platform);

          this.platforms.push({ x, y, width, height, element: platform });
        }

        createPool(type, x, y, width, height) {
          const pool = document.createElement("div");
          pool.className = `${type}-pool`;
          pool.style.left = x + "px";
          pool.style.top = y + "px";
          pool.style.width = width + "px";
          pool.style.height = height + "px";
          this.canvas.querySelector('.overlay').appendChild(pool);

          this.pools.push({ type, x, y, width, height, element: pool });
        }

        createDoor(type, x, y) {
          const door = document.createElement("div");
          door.className = `door ${type}-door`;
          door.style.left = x + "px";
          door.style.top = y + "px";
          this.canvas.querySelector('.overlay').appendChild(door);

          this.doors.push({ type, x, y, width: 40, height: 60, element: door });
        }

        createGem(type, x, y) {
          const gem = document.createElement("div");
          gem.className = `gem ${type}-gem`;
          gem.style.left = x + "px";
          gem.style.top = y + "px";
          this.canvas.querySelector('.overlay').appendChild(gem);

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
            ".platform, .lava-pool, .water-pool, .poison-pool, .door, .gem"
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
            this.winGame();
          }
        }

        winGame() {
          this.gameRunning = false;

          if (this.level < this.maxLevel) {
            // Show level complete message
            const modal = document.getElementById("win-modal");
            document.getElementById("win-message").textContent = `Level ${this.level} Complete! Well done!`;
            document.getElementById("win-extra").textContent = `🎉 Great teamwork! Ready for Level ${this.level + 1}?`;
            modal.classList.remove("hidden");

            // Next level button
            document.getElementById("win-restart-btn").textContent = "Next Level";
            document.getElementById("win-restart-btn").onclick = () => {
              modal.classList.add("hidden");
              this.nextLevel();
            };
          } else {
            // Game completed
            const modal = document.getElementById("win-modal");
            document.getElementById("win-message").textContent = "🏆 Congratulations! You've completed all levels!";
            document.getElementById("win-extra").textContent = "🌊 You've mastered flood survival and exposed all corruption! Mayor Vico and the Flood Spirit make an unstoppable team!";
            modal.classList.remove("hidden");

            // Play again button
            document.getElementById("win-restart-btn").textContent = "Play Again";
            document.getElementById("win-restart-btn").onclick = () => {
              modal.classList.add("hidden");
              this.level = 1;
              this.restart();
            };
          }
        }

        nextLevel() {
          this.level++;
          this.restart();
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
          document.getElementById("gems").textContent = `${this.gems.collected}/${this.gems.total}`;
          document.getElementById("flood-height").textContent = Math.round((this.floodHeight / 600) * 100) + "%";
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

            // Flood limit increases with level difficulty
            const maxFloodHeight = 300 + (this.level * 20);
            if (this.floodHeight < maxFloodHeight) {
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

          document.getElementById("game-status").textContent = levelDescriptions[this.level - 1] || "";
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
          startModal.classList.add("hidden");
          new Game();
        });
      });