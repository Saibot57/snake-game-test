import React, { useState, useEffect, useRef } from 'react';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const GRAVITY = 0.6;
const JUMP_FORCE = -15;
const MOVEMENT_SPEED = 5;
const PLATFORM_HEIGHT = 20;
const GROUND_HEIGHT = 50;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 50;
const ENEMY_WIDTH = 40;
const ENEMY_HEIGHT = 40;
const COIN_SIZE = 30;
const ENEMY_SPEED = 2;

// Game elements
interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Player extends GameObject {
  velY: number;
  velX: number;
  isJumping: boolean;
  facingRight: boolean;
}

interface Enemy extends GameObject {
  direction: number;
  isDead: boolean;
  isBoss?: boolean;
  health?: number;
  attackCooldown?: number;
  projectiles?: Projectile[];
}

interface Platform extends GameObject {}

interface Coin extends GameObject {
  collected: boolean;
}

interface Projectile extends GameObject {
  velX: number;
  velY: number;
  active: boolean;
}

// Game state
interface GameState {
  score: number;
  isGameOver: boolean;
  isGameWon: boolean;
  lives: number;
}

const ZelenskyPlatformer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    isGameOver: false,
    isGameWon: false,
    lives: 3
  });
  const [keys, setKeys] = useState({
    ArrowRight: false,
    ArrowLeft: false,
    ArrowUp: false,
    Space: false
  });
  const [player, setPlayer] = useState<Player>({
    x: 50,
    y: GAME_HEIGHT - GROUND_HEIGHT - PLAYER_HEIGHT,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    velY: 0,
    velX: 0,
    isJumping: false,
    facingRight: true
  });
  
  // Platforms
  const [platforms, setPlatforms] = useState<Platform[]>([
    // Ground
    { x: 0, y: GAME_HEIGHT - GROUND_HEIGHT, width: GAME_WIDTH, height: GROUND_HEIGHT },
    // Platforms
    { x: 100, y: 300, width: 100, height: PLATFORM_HEIGHT },
    { x: 300, y: 250, width: 100, height: PLATFORM_HEIGHT },
    { x: 500, y: 200, width: 100, height: PLATFORM_HEIGHT },
    { x: 650, y: 150, width: 150, height: PLATFORM_HEIGHT }
  ]);
  
  // Enemies
  const [enemies, setEnemies] = useState<Enemy[]>([
    { x: 200, y: GAME_HEIGHT - GROUND_HEIGHT - ENEMY_HEIGHT, width: ENEMY_WIDTH, height: ENEMY_HEIGHT, direction: -1, isDead: false },
    { x: 400, y: GAME_HEIGHT - GROUND_HEIGHT - ENEMY_HEIGHT, width: ENEMY_WIDTH, height: ENEMY_HEIGHT, direction: 1, isDead: false },
    { x: 550, y: GAME_HEIGHT - GROUND_HEIGHT - ENEMY_HEIGHT, width: ENEMY_WIDTH, height: ENEMY_HEIGHT, direction: -1, isDead: false },
    { x: 700, y: 150 - ENEMY_HEIGHT, width: ENEMY_WIDTH, height: ENEMY_HEIGHT, direction: 1, isDead: false },
    // Putin boss
    { 
      x: GAME_WIDTH - 100, 
      y: GAME_HEIGHT - GROUND_HEIGHT - ENEMY_HEIGHT * 2, 
      width: ENEMY_WIDTH * 1.5, 
      height: ENEMY_HEIGHT * 2, 
      direction: -1, 
      isDead: false,
      isBoss: true,
      health: 3,
      attackCooldown: 0,
      projectiles: []
    }
  ]);
  
  // Coins
  const [coins, setCoins] = useState<Coin[]>([
    { x: 150, y: 200, width: COIN_SIZE, height: COIN_SIZE, collected: false },
    { x: 350, y: 150, width: COIN_SIZE, height: COIN_SIZE, collected: false },
    { x: 550, y: 100, width: COIN_SIZE, height: COIN_SIZE, collected: false },
    { x: 700, y: 80, width: COIN_SIZE, height: COIN_SIZE, collected: false }
  ]);
  
  // Flag for game victory
  const flag = { x: 750, y: 100, width: 30, height: 50 };
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowRight' || e.code === 'ArrowLeft' || e.code === 'ArrowUp' || e.code === 'Space') {
        e.preventDefault();
        setKeys(prev => ({ ...prev, [e.code]: true }));
      }
      
      // Restart game if it's over
      if ((gameState.isGameOver || gameState.isGameWon) && e.code === 'Space') {
        resetGame();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowRight' || e.code === 'ArrowLeft' || e.code === 'ArrowUp' || e.code === 'Space') {
        setKeys(prev => ({ ...prev, [e.code]: false }));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState.isGameOver, gameState.isGameWon]);
  
  // Reset game
  const resetGame = () => {
    setGameState({
      score: 0,
      isGameOver: false,
      isGameWon: false,
      lives: 3
    });
    
    setPlayer({
      x: 50,
      y: GAME_HEIGHT - GROUND_HEIGHT - PLAYER_HEIGHT,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      velY: 0,
      velX: 0,
      isJumping: false,
      facingRight: true
    });
    
    setEnemies([
      { x: 200, y: GAME_HEIGHT - GROUND_HEIGHT - ENEMY_HEIGHT, width: ENEMY_WIDTH, height: ENEMY_HEIGHT, direction: -1, isDead: false },
      { x: 400, y: GAME_HEIGHT - GROUND_HEIGHT - ENEMY_HEIGHT, width: ENEMY_WIDTH, height: ENEMY_HEIGHT, direction: 1, isDead: false },
      { x: 550, y: GAME_HEIGHT - GROUND_HEIGHT - ENEMY_HEIGHT, width: ENEMY_WIDTH, height: ENEMY_HEIGHT, direction: -1, isDead: false },
      { x: 700, y: 150 - ENEMY_HEIGHT, width: ENEMY_WIDTH, height: ENEMY_HEIGHT, direction: 1, isDead: false },
      // Putin boss
      { 
        x: GAME_WIDTH - 100, 
        y: GAME_HEIGHT - GROUND_HEIGHT - ENEMY_HEIGHT * 2, 
        width: ENEMY_WIDTH * 1.5, 
        height: ENEMY_HEIGHT * 2, 
        direction: -1, 
        isDead: false,
        isBoss: true,
        health: 3,
        attackCooldown: 0,
        projectiles: []
      }
    ]);
    
    setCoins([
      { x: 150, y: 200, width: COIN_SIZE, height: COIN_SIZE, collected: false },
      { x: 350, y: 150, width: COIN_SIZE, height: COIN_SIZE, collected: false },
      { x: 550, y: 100, width: COIN_SIZE, height: COIN_SIZE, collected: false },
      { x: 700, y: 80, width: COIN_SIZE, height: COIN_SIZE, collected: false }
    ]);
  };
  
  // Check collisions
  const checkCollision = (obj1: GameObject, obj2: GameObject) => {
    return (
      obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y
    );
  };
  
  // Game loop
  useEffect(() => {
    if (gameState.isGameOver || gameState.isGameWon) return;
    
    const updateGame = () => {
      // Update player velocity based on input
      let newVelX = 0;
      if (keys.ArrowRight) newVelX = MOVEMENT_SPEED;
      if (keys.ArrowLeft) newVelX = -MOVEMENT_SPEED;
      
      // Update facing direction
      let newFacingRight = player.facingRight;
      if (newVelX > 0) newFacingRight = true;
      else if (newVelX < 0) newFacingRight = false;
      
      // Jump
      let newVelY = player.velY;
      let newIsJumping = player.isJumping;
      
      if ((keys.ArrowUp || keys.Space) && !player.isJumping) {
        newVelY = JUMP_FORCE;
        newIsJumping = true;
      }
      
      // Apply gravity
      newVelY += GRAVITY;
      
      // Update position
      let newX = player.x + newVelX;
      let newY = player.y + newVelY;
      
      // Keep player within bounds
      if (newX < 0) newX = 0;
      if (newX > GAME_WIDTH - PLAYER_WIDTH) newX = GAME_WIDTH - PLAYER_WIDTH;
      
      // Check platform collisions
      let onGround = false;
      
      platforms.forEach(platform => {
        if (
          newVelY > 0 && // Moving down
          newY + PLAYER_HEIGHT > platform.y && // Below top of platform
          newY < platform.y && // Above bottom of platform
          newX + PLAYER_WIDTH > platform.x && // Right of left edge
          newX < platform.x + platform.width // Left of right edge
        ) {
          newY = platform.y - PLAYER_HEIGHT; // Place on top of platform
          newVelY = 0; // Stop falling
          onGround = true;
          newIsJumping = false;
        }
      });
      
      // Check enemy collisions
      let updatedEnemies = [...enemies];
      let playerHit = false;
      
      updatedEnemies = updatedEnemies.map((enemy) => {
        if (enemy.isDead) return enemy;
        
        // Check if stomping on enemy
        if (
          newVelY > 0 && // Moving down
          player.y + PLAYER_HEIGHT <= enemy.y && // Was above
          newY + PLAYER_HEIGHT >= enemy.y && // Now overlapping
          newX + PLAYER_WIDTH > enemy.x && // Right of left edge
          newX < enemy.x + enemy.width // Left of right edge
        ) {
          // Bounce off enemy
          newVelY = JUMP_FORCE / 1.5;
          
          // Handle boss differently (requires multiple hits)
          if (enemy.isBoss && enemy.health !== undefined && enemy.health > 1) {
            // Reduce boss health
            setGameState(prev => ({
              ...prev,
              score: prev.score + 200
            }));
            
            return { 
              ...enemy, 
              health: enemy.health - 1,
              // Make the boss move away from the player briefly
              direction: newX < enemy.x ? 1 : -1,
              // Boss gets more aggressive as health decreases
              attackCooldown: 60 // 1 second at 60fps
            };
          }
          
          // Regular enemy or final boss hit
          setGameState(prev => ({
            ...prev,
            score: enemy.isBoss ? prev.score + 1000 : prev.score + 100
          }));
          
          return { ...enemy, isDead: true };
        }
        
        // Check if hit by enemy
        if (
          !gameState.isGameOver &&
          !enemy.isDead &&
          checkCollision(
            { x: newX, y: newY, width: PLAYER_WIDTH, height: PLAYER_HEIGHT },
            enemy
          )
        ) {
          playerHit = true;
        }
        
        // Move enemy
        let newEnemyX = enemy.x + (enemy.direction * ENEMY_SPEED);
        
        // Reverse direction if hitting edge or platform edge
        let shouldReverse = false;
        
        if (newEnemyX <= 0 || newEnemyX + ENEMY_WIDTH >= GAME_WIDTH) {
          shouldReverse = true;
        }
        
        // Find which platform the enemy is standing on
        for (const platform of platforms) {
          if (
            enemy.y + ENEMY_HEIGHT === platform.y &&
            enemy.x + ENEMY_WIDTH > platform.x &&
            enemy.x < platform.x + platform.width
          ) {
            // Check if about to walk off platform
            if (
              newEnemyX + ENEMY_WIDTH > platform.x + platform.width ||
              newEnemyX < platform.x
            ) {
              shouldReverse = true;
            }
            break;
          }
        }
        
        return {
          ...enemy,
          x: newEnemyX,
          direction: shouldReverse ? -enemy.direction : enemy.direction
        };
      });
      
      // Check coin collisions
      let updatedCoins = [...coins];
      
      updatedCoins = updatedCoins.map(coin => {
        if (coin.collected) return coin;
        
        if (checkCollision(
          { x: newX, y: newY, width: PLAYER_WIDTH, height: PLAYER_HEIGHT },
          coin
        )) {
          setGameState(prev => ({
            ...prev,
            score: prev.score + 50
          }));
          
          return { ...coin, collected: true };
        }
        
        return coin;
      });
      
      // Check flag collision (win condition)
      if (checkCollision(
        { x: newX, y: newY, width: PLAYER_WIDTH, height: PLAYER_HEIGHT },
        flag
      )) {
        setGameState(prev => ({
          ...prev,
          isGameWon: true
        }));
      }
      
      // Handle player being hit
      if (playerHit) {
        let newLives = gameState.lives - 1;
        
        if (newLives <= 0) {
          setGameState(prev => ({
            ...prev,
            isGameOver: true
          }));
        } else {
          setGameState(prev => ({
            ...prev,
            lives: newLives
          }));
          
          // Reset player position but keep score
          newX = 50;
          newY = GAME_HEIGHT - GROUND_HEIGHT - PLAYER_HEIGHT;
          newVelX = 0;
          newVelY = 0;
        }
      }
      
      // Update player
      // Handle boss logic and projectiles
      updatedEnemies = updatedEnemies.map(enemy => {
        if (!enemy.isBoss || enemy.isDead) return enemy;
        
        // Update boss
        let updatedBoss = { ...enemy };
        
        // Handle boss attack cooldown
        if (updatedBoss.attackCooldown !== undefined) {
          if (updatedBoss.attackCooldown > 0) {
            updatedBoss.attackCooldown -= 1;
          } else {
            // Fire projectile at player
            updatedBoss.attackCooldown = 120; // 2 seconds at 60fps
            
            // Calculate direction vector to player
            const dx = player.x - updatedBoss.x;
            const dy = player.y - updatedBoss.y;
            const mag = Math.sqrt(dx * dx + dy * dy);
            
            // New projectile
            const newProjectile: Projectile = {
              x: updatedBoss.x + updatedBoss.width / 2,
              y: updatedBoss.y + updatedBoss.height / 3,
              width: 15,
              height: 15,
              velX: (dx / mag) * 5,
              velY: (dy / mag) * 5,
              active: true
            };
            
            updatedBoss.projectiles = [...(updatedBoss.projectiles || []), newProjectile];
          }
        }
        
        // Update projectiles
        if (updatedBoss.projectiles) {
          updatedBoss.projectiles = updatedBoss.projectiles
            .filter(p => p.active)
            .map(p => {
              // Move projectile
              const newProjX = p.x + p.velX;
              const newProjY = p.y + p.velY;
              
              // Check if it's out of bounds
              if (newProjX < 0 || newProjX > GAME_WIDTH || newProjY < 0 || newProjY > GAME_HEIGHT) {
                return { ...p, active: false };
              }
              
              // Check for collision with player
              if (checkCollision(
                { x: newX, y: newY, width: PLAYER_WIDTH, height: PLAYER_HEIGHT },
                { x: newProjX, y: newProjY, width: p.width, height: p.height }
              )) {
                playerHit = true;
                return { ...p, active: false };
              }
              
              // Check for collision with platforms
              for (const platform of platforms) {
                if (checkCollision(
                  { x: newProjX, y: newProjY, width: p.width, height: p.height },
                  platform
                )) {
                  return { ...p, active: false };
                }
              }
              
              return { ...p, x: newProjX, y: newProjY };
            });
        }
        
        return updatedBoss;
      });

      setPlayer({
        x: newX,
        y: newY,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        velY: newVelY,
        velX: newVelX,
        isJumping: !onGround,
        facingRight: newFacingRight
      });
      
      // Update enemies and coins
      setEnemies(updatedEnemies);
      setCoins(updatedCoins);
    };
    
    const gameLoop = setInterval(updateGame, 1000 / 60);
    
    return () => clearInterval(gameLoop);
  }, [player, enemies, coins, platforms, keys, gameState.isGameOver, gameState.isGameWon, gameState.lives]);
  
  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    // Draw sky background
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    // Draw platforms
    ctx.fillStyle = '#8B4513';
    platforms.forEach(platform => {
      // Ground has grass
      if (platform.height === GROUND_HEIGHT) {
        // Brown dirt
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // Green grass
        ctx.fillStyle = '#228B22';
        ctx.fillRect(platform.x, platform.y, platform.width, 10);
      } else {
        // Regular platforms are brick-like
        ctx.fillStyle = '#CD853F';
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // Platform detail
        ctx.fillStyle = '#8B4513';
        for (let i = 0; i < platform.width; i += 20) {
          ctx.fillRect(platform.x + i, platform.y, 2, platform.height);
        }
        ctx.fillRect(platform.x, platform.y + platform.height / 2, platform.width, 2);
      }
    });
    
    // Draw coins
    coins.forEach(coin => {
      if (!coin.collected) {
        // Gold circle
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Shining effect
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(coin.x + coin.width / 3, coin.y + coin.height / 3, coin.width / 8, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    
    // Draw flag
    ctx.fillStyle = '#0057B7'; // Ukrainian blue
    ctx.fillRect(flag.x, flag.y, flag.width, flag.height/2);
    ctx.fillStyle = '#FFD700'; // Ukrainian yellow
    ctx.fillRect(flag.x, flag.y + flag.height/2, flag.width, flag.height/2);
    
    // Draw pole
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(flag.x - 5, flag.y, 5, flag.height + 50);
    
    // Draw enemies
    enemies.forEach(enemy => {
      if (!enemy.isDead) {
        if (enemy.isBoss) {
          // Draw Putin boss
          
          // Pale face
          ctx.fillStyle = '#F5DEB3';
          ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
          
          // Dark hair
          ctx.fillStyle = '#2F4F4F';
          ctx.fillRect(enemy.x - 5, enemy.y - 5, enemy.width + 10, 15);
          
          // Black suit
          ctx.fillStyle = '#000000';
          ctx.fillRect(enemy.x, enemy.y + enemy.height/3, enemy.width, enemy.height * 2/3);
          
          // Red tie
          ctx.fillStyle = '#8B0000';
          ctx.beginPath();
          ctx.moveTo(enemy.x + enemy.width/2, enemy.y + enemy.height/3);
          ctx.lineTo(enemy.x + enemy.width/2 - 8, enemy.y + enemy.height);
          ctx.lineTo(enemy.x + enemy.width/2 + 8, enemy.y + enemy.height);
          ctx.fill();
          
          // Eyes
          ctx.fillStyle = '#0047AB';
          ctx.fillRect(enemy.x + enemy.width/3, enemy.y + enemy.height/5, 8, 8);
          ctx.fillRect(enemy.x + enemy.width * 2/3 - 8, enemy.y + enemy.height/5, 8, 8);
          
          // Stern mouth
          ctx.fillStyle = '#8B0000';
          ctx.fillRect(enemy.x + enemy.width/4, enemy.y + enemy.height/3 - 10, enemy.width/2, 3);
          
          // Health bar
          if (enemy.health !== undefined) {
            const barWidth = enemy.width;
            const barHeight = 8;
            const barY = enemy.y - 15;
            
            // Background
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(enemy.x, barY, barWidth, barHeight);
            
            // Health
            ctx.fillStyle = '#00FF00';
            ctx.fillRect(enemy.x, barY, barWidth * (enemy.health / 3), barHeight);
          }
          
          // Draw projectiles
          if (enemy.projectiles) {
            enemy.projectiles.forEach(proj => {
              if (proj.active) {
                // Draw a red fireball
                ctx.fillStyle = '#FF0000';
                ctx.beginPath();
                ctx.arc(proj.x, proj.y, proj.width / 2, 0, Math.PI * 2);
                ctx.fill();
                
                // Orange center
                ctx.fillStyle = '#FFA500';
                ctx.beginPath();
                ctx.arc(proj.x, proj.y, proj.width / 4, 0, Math.PI * 2);
                ctx.fill();
              }
            });
          }
        } else {
          // Draw Trump-inspired enemy
          
          // Orange face
          ctx.fillStyle = '#FFA500';
          ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
          
          // Yellow hair
          ctx.fillStyle = '#FFD700';
          ctx.fillRect(enemy.x - 5, enemy.y - 5, enemy.width + 10, 10);
          
          // Black suit
          ctx.fillStyle = '#000000';
          ctx.fillRect(enemy.x, enemy.y + enemy.height/2, enemy.width, enemy.height/2);
          
          // Red tie
          ctx.fillStyle = '#FF0000';
          ctx.beginPath();
          ctx.moveTo(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
          ctx.lineTo(enemy.x + enemy.width/2 - 5, enemy.y + enemy.height);
          ctx.lineTo(enemy.x + enemy.width/2 + 5, enemy.y + enemy.height);
          ctx.fill();
          
          // Eyes
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(enemy.x + 10, enemy.y + 10, 5, 5);
          ctx.fillRect(enemy.x + enemy.width - 15, enemy.y + 10, 5, 5);
          
          // Mouth
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(enemy.x + 10, enemy.y + 25, enemy.width - 20, 3);
        }
      }
    });
    
    // Draw player (Zelenskyy)
    ctx.fillStyle = '#006400'; // Military green
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Face
    ctx.fillStyle = '#FFD59B'; // Skin color
    ctx.fillRect(player.x + 5, player.y + 5, player.width - 10, player.height / 3);
    
    // Beard
    ctx.fillStyle = '#333333';
    ctx.fillRect(player.x + 5, player.y + 15, player.width - 10, 5);
    
    // Eyes
    ctx.fillStyle = '#000000';
    if (player.facingRight) {
      ctx.fillRect(player.x + 20, player.y + 10, 4, 4);
      ctx.fillRect(player.x + 30, player.y + 10, 4, 4);
    } else {
      ctx.fillRect(player.x + 6, player.y + 10, 4, 4);
      ctx.fillRect(player.x + 16, player.y + 10, 4, 4);
    }
    
    // Draw HUD
    ctx.fillStyle = '#333333';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${gameState.score}`, 10, 30);
    
    // Draw lives
    ctx.fillText('Lives:', 10, 60);
    for (let i = 0; i < gameState.lives; i++) {
      ctx.fillStyle = '#006400';
      ctx.fillRect(70 + i * 30, 45, 20, 20);
    }
    
    // Draw game over or win message
    if (gameState.isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '40px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20);
      
      ctx.font = '20px Arial';
      ctx.fillText(`Final Score: ${gameState.score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20);
      ctx.fillText('Press SPACE to restart', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60);
    } else if (gameState.isGameWon) {
      ctx.fillStyle = 'rgba(0, 87, 183, 0.7)'; // Ukrainian blue with transparency
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT / 2);
      
      ctx.fillStyle = 'rgba(255, 215, 0, 0.7)'; // Ukrainian yellow with transparency
      ctx.fillRect(0, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT / 2);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '40px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('VICTORY!', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20);
      
      ctx.font = '20px Arial';
      ctx.fillText(`Final Score: ${gameState.score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20);
      ctx.fillText('Press SPACE to restart', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60);
    }
  }, [player, platforms, enemies, coins, gameState]);
  
  // Mobile controls
  const handleTouchStart = (direction: string) => {
    setKeys(prev => ({ ...prev, [direction]: true }));
  };
  
  const handleTouchEnd = (direction: string) => {
    setKeys(prev => ({ ...prev, [direction]: false }));
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 p-4">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">Zelenskyy vs. The Kremlin</h1>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          className="border-4 border-yellow-500 bg-blue-300 rounded shadow-lg"
        />
        
        {/* Instructions */}
        <div className="mt-4 text-center">
          <p className="mb-2">Use Arrow Keys to move and Space or Up Arrow to jump.</p>
          <p className="text-sm text-gray-600">
            Collect coins, defeat Trump enemies by jumping on them, and defeat the Putin boss to reach the Ukrainian flag!
          </p>
          <p className="text-sm text-red-600 font-bold mt-2">
            Warning: Boss shoots fireballs! Hit him 3 times to defeat him.
          </p>
        </div>
        
        {/* Mobile controls - only shown on smaller screens */}
        <div className="md:hidden mt-6">
          <div className="grid grid-cols-3 gap-2 w-48 mx-auto">
            <div></div>
            <button
              className="bg-blue-500 text-white p-4 rounded-lg"
              onTouchStart={() => handleTouchStart('ArrowUp')}
              onTouchEnd={() => handleTouchEnd('ArrowUp')}
            >
              ↑
            </button>
            <div></div>
            <button
              className="bg-blue-500 text-white p-4 rounded-lg"
              onTouchStart={() => handleTouchStart('ArrowLeft')}
              onTouchEnd={() => handleTouchEnd('ArrowLeft')}
            >
              ←
            </button>
            <div></div>
            <button
              className="bg-blue-500 text-white p-4 rounded-lg"
              onTouchStart={() => handleTouchStart('ArrowRight')}
              onTouchEnd={() => handleTouchEnd('ArrowRight')}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZelenskyPlatformer;