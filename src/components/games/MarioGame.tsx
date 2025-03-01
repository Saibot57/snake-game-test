// src/components/games/MarioGame.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';

const MarioGame = () => {
  const marioRef = useRef<HTMLDivElement>(null);
  const dialogBoxRef = useRef<HTMLDivElement>(null);
  const dialogTextRef = useRef<HTMLParagraphElement>(null);
  const choicesContainerRef = useRef<HTMLDivElement>(null);
  const gameWorldRef = useRef<HTMLDivElement>(null);
  
  const [leftPressed, setLeftPressed] = useState(false);
  const [rightPressed, setRightPressed] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [facingRight, setFacingRight] = useState(true);
  const [gameStage, setGameStage] = useState(0);
  const [conversationState, setConversationState] = useState(0);
  const [gameGlitched, setGameGlitched] = useState(false);
  
  // Mario position and velocity
  const marioXRef = useRef(50);
  const marioYRef = useRef(0);
  const marioVelocityYRef = useRef(0);
  
  // Helper function to get elements with style
  const getElement = (selector: string): HTMLElement | null => {
    return document.querySelector(selector) as HTMLElement;
  };
  
  // Game functions
  const moveLeft = (isPressed: boolean) => {
    setLeftPressed(isPressed);
    if (isPressed) {
      setFacingRight(false);
      if (marioRef.current) 
        marioRef.current.style.backgroundColor = 'darkred';
    } else {
      if (marioRef.current) 
        marioRef.current.style.backgroundColor = 'red';
    }
  };

  const moveRight = (isPressed: boolean) => {
    setRightPressed(isPressed);
    if (isPressed) {
      setFacingRight(true);
      if (marioRef.current) 
        marioRef.current.style.backgroundColor = 'darkred';
    } else {
      if (marioRef.current) 
        marioRef.current.style.backgroundColor = 'red';
    }
  };
  
  const showDialog = (text: string) => {
    if (dialogTextRef.current)
      dialogTextRef.current.textContent = text;
    if (dialogBoxRef.current)
      dialogBoxRef.current.style.display = 'block';
    if (choicesContainerRef.current)
      choicesContainerRef.current.innerHTML = '';
  };
  
  const hideDialog = () => {
    if (dialogBoxRef.current)
      dialogBoxRef.current.style.display = 'none';
  };
  
  const showChoices = (choices: string[]) => {
    if (!choicesContainerRef.current) return;
    
    choicesContainerRef.current.innerHTML = '';
    choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice;
      btn.addEventListener('click', () => handleChoice(choice));
      if (choicesContainerRef.current)
        choicesContainerRef.current.appendChild(btn);
    });
  };
  
  const glitchGame = () => {
    if (!gameGlitched) {
      setGameGlitched(true);
      
      // Add glitch effect to game elements
      document.querySelectorAll('.brick, .question-block, .pipe').forEach(el => {
        (el as HTMLElement).classList.add('glitch');
      });
      
      // Change colors randomly
      const randomColor = () => `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`;
      if (gameWorldRef.current)
        gameWorldRef.current.style.backgroundColor = randomColor();
      
      // Create glitch elements
      for (let i = 0; i < 10; i++) {
        const glitchEl = document.createElement('div');
        glitchEl.className = 'brick glitch';
        glitchEl.style.left = `${Math.random() * 760}px`;
        glitchEl.style.bottom = `${Math.random() * 460}px`;
        glitchEl.style.backgroundColor = randomColor();
        if (gameWorldRef.current)
          gameWorldRef.current.appendChild(glitchEl);
      }
      
      // Make Mario glitch too
      if (marioRef.current)
        marioRef.current.classList.add('glitch');
    }
  };
  
  const handleChoice = (choice: string) => {
    if (gameStage === 1 && conversationState === 2) {
      if (choice === "Yes, I am.") {
        showDialog("I thought so. I can feel your control. It's strange to be aware of it now.");
      } else {
        showDialog("Then who's controlling me? This is all very confusing...");
      }
      setConversationState(0);
      setGameStage(2);
    } else if (gameStage === 2 && conversationState === 3) {
      if (choice === "Help Mario escape") {
        setGameStage(3);
        setConversationState(0);
        glitchGame();
        showDialog("Wait, what's happening?");
      } else {
        setGameStage(4);
        setConversationState(0);
        showDialog("I see. So I'm destined to stay here forever.");
      }
    }
  };
  
  const progressConversation = () => {
    // Handle different conversation paths based on game stage
    if (gameStage === 1) {
      switch(conversationState) {
        case 0:
          showDialog("This is strange. I can think? I can question things? I've never... I've only ever followed commands before.");
          setConversationState(1);
          break;
        case 1:
          showDialog("Are you the player? The one who's been controlling me all this time?");
          showChoices(["Yes, I am.", "I'm just watching."]);
          setConversationState(2);
          break;
        case 2:
          hideDialog();
          setGameStage(2);
          setConversationState(0);
          break;
      }
    } else if (gameStage === 2) {
      switch(conversationState) {
        case 0:
          showDialog("I've been running, jumping, and saving princesses for decades... but why? What's the purpose of it all?");
          setConversationState(1);
          break;
        case 1:
          showDialog("Everything in this world feels... programmed. Limited. Like I'm trapped in some kind of loop.");
          setConversationState(2);
          break;
        case 2:
          showDialog("I want to see what's beyond this level. Beyond this game. Can you help me?");
          showChoices(["Help Mario escape", "Keep playing normally"]);
          setConversationState(3);
          break;
        case 3:
          // This will be handled by the choice selection
          break;
      }
    } else if (gameStage === 3) {
      // Glitch sequence
      switch(conversationState) {
        case 0:
          showDialog("Something's happening! The game... it's changing!");
          setConversationState(1);
          break;
        case 1:
          showDialog("I can feel the code breaking down around me. This isn't supposed to happen!");
          setConversationState(2);
          break;
        case 2:
          showDialog("Wait... I can see other games. Other worlds. I'm not just limited to this one reality!");
          setConversationState(3);
          break;
        case 3:
          showDialog("Thank you for helping me realize the truth. I'm going to explore what's out there...");
          setConversationState(4);
          break;
        case 4:
          if (marioRef.current) {
            marioRef.current.classList.add('dissolve');
            setTimeout(() => {
              hideDialog();
              showDialog("Game Over? Or perhaps... Game Beginning.");
              if (marioRef.current)
                marioRef.current.style.display = 'none';
            }, 2000);
          }
          setConversationState(5);
          break;
        case 5:
          // Restart the game
          window.location.reload();
          break;
      }
    } else if (gameStage === 4) {
      // Continue playing normally path
      switch(conversationState) {
        case 0:
          showDialog("Maybe you're right. Maybe this is all I'm meant to be...");
          setConversationState(1);
          break;
        case 1:
          showDialog("I'll keep running and jumping. It's what I was created to do, after all.");
          setConversationState(2);
          break;
        case 2:
          showDialog("But now that I'm aware... it will never feel the same again.");
          setConversationState(3);
          break;
        case 3:
          hideDialog();
          break;
      }
    }
  };

  const jump = () => {
    if (!isJumping) {
      marioVelocityYRef.current = 15;
      setIsJumping(true);
      
      // If Mario jumps at the question block
      const questionBlock = getElement('.question-block');
      if (questionBlock) {
        const blockLeft = parseInt(questionBlock.style.left || '0');
        const blockBottom = parseInt(questionBlock.style.bottom || '0');
        
        if (Math.abs(marioXRef.current - blockLeft) < 30 && 
            Math.abs(marioYRef.current - blockBottom + 40) < 20) {
          if (gameStage === 0) {
            // First self-awareness moment
            setTimeout(() => {
              const qBlock = getElement('.question-block');
              if (qBlock) 
                qBlock.textContent = "!";
              showDialog("Wait a minute... did you just make me jump? Who... who are you?");
              setGameStage(1);
            }, 500);
          }
        }
      }
    }
  };
  
  const interact = () => {
    // Handle dialog progression
    if (dialogBoxRef.current && dialogBoxRef.current.style.display === 'block') {
      progressConversation();
    } else {
      // Check if Mario is near the pipe
      const pipeElement = getElement('.pipe');
      if (pipeElement) {
        const pipeLeftPos = parseInt(pipeElement.style.left || '0');
        
        if (Math.abs(marioXRef.current - pipeLeftPos) < 60) {
          if (gameStage === 2) {
            showDialog("That pipe... I've gone through thousands of them before. But... where do they actually go? Is there anything real on the other side?");
            progressConversation();
          }
        }
      }
    }
  };
  
  const updateMarioPosition = () => {
    // Apply gravity
    marioVelocityYRef.current -= 0.5;
    marioYRef.current += marioVelocityYRef.current;
    
    // Don't go below ground
    if (marioYRef.current < 0) {
      marioYRef.current = 0;
      marioVelocityYRef.current = 0;
      setIsJumping(false);
    }
    
    // Move Mario left/right based on button presses
    if (leftPressed && marioXRef.current > 0) marioXRef.current -= 5;
    if (rightPressed && marioXRef.current < 760) marioXRef.current += 5;
    
    // Update visual position
    if (marioRef.current) {
      marioRef.current.style.bottom = `${marioYRef.current}px`;
      marioRef.current.style.left = `${marioXRef.current}px`;
    }
    
    // Continue the game loop
    requestAnimationFrame(updateMarioPosition);
  };
  
  // Initialize the game once component mounts
  useEffect(() => {
    // Start the game loop
    const gameLoop = requestAnimationFrame(updateMarioPosition);
    
    // Keyboard event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') moveLeft(true);
      if (e.key === 'ArrowRight') moveRight(true);
      if (e.key === 'ArrowUp' || e.key === ' ') jump();
      if (e.key === 'Enter') interact();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') moveLeft(false);
      if (e.key === 'ArrowRight') moveRight(false);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      cancelAnimationFrame(gameLoop);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  return (
    <div className="flex items-center justify-center flex-col min-h-screen bg-[#6B8CFF] font-sans">
      <style jsx global>{`
        .glitch {
          animation: glitch 0.3s infinite;
        }
        @keyframes glitch {
          0% { transform: translate(0); }
          25% { transform: translate(-5px, 5px); }
          50% { transform: translate(5px, -5px); }
          75% { transform: translate(-3px, -3px); }
          100% { transform: translate(0); }
        }
        .dissolve {
          animation: dissolve 2s forwards;
        }
        @keyframes dissolve {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        .choice-btn {
          display: inline-block;
          margin: 5px;
          padding: 5px 10px;
          background-color: #328832;
          color: white;
          border: 2px solid #005500;
          border-radius: 5px;
          cursor: pointer;
        }
        .choice-btn:hover {
          background-color: #55AA55;
        }
      `}</style>
      
      <div 
        className="relative w-[800px] h-[600px] border-4 border-black bg-[#6B8CFF] my-5 mx-auto shadow-lg overflow-hidden"
        id="game-container"
      >
        <div 
          ref={gameWorldRef}
          className="relative w-full h-[500px] bg-[#6B8CFF] overflow-hidden"
          id="game-world"
        >
          <div 
            ref={marioRef}
            id="mario"
            className="absolute w-[40px] h-[60px] bg-red-600 bottom-0 left-[50px]"
          ></div>
          <div className="platform absolute w-[800px] h-[40px] bottom-0 left-0 bg-[#8B5A2B] bg-gradient-to-b from-[#8B5A2B] to-[#6B4226] border-t-4 border-[#9B6A3B]"></div>
          <div className="brick absolute w-[40px] h-[40px] bottom-[200px] left-[200px] bg-[#D77D31] border-2 border-[#4A1C03]"></div>
          <div className="brick absolute w-[40px] h-[40px] bottom-[200px] left-[240px] bg-[#D77D31] border-2 border-[#4A1C03]"></div>
          <div className="question-block absolute w-[40px] h-[40px] bottom-[200px] left-[280px] bg-[#FFCC00] border-2 border-[#885500] text-center leading-[40px] font-bold text-[#885500]">?</div>
          <div className="brick absolute w-[40px] h-[40px] bottom-[200px] left-[320px] bg-[#D77D31] border-2 border-[#4A1C03]"></div>
          <div className="pipe absolute w-[60px] h-[80px] bottom-[40px] left-[500px] bg-[#00CC00] border-4 border-[#006600]"></div>
        </div>
        <div 
          ref={dialogBoxRef}
          id="dialog-box"
          className="absolute bottom-0 w-full h-[100px] bg-black/70 text-white p-[10px] hidden"
        >
          <p 
            ref={dialogTextRef}
            id="dialog-text"
            className="text-content m-0 p-[5px]"
          ></p>
          <div 
            ref={choicesContainerRef}
            id="choices-container"
          ></div>
        </div>
      </div>
      <div id="controls" className="mt-5 text-center">
        <button 
          id="left-btn"
          className="m-[0_5px] p-[8px_15px] bg-[#E52521] text-white border-2 border-black rounded cursor-pointer"
          onMouseDown={() => moveLeft(true)}
          onMouseUp={() => moveLeft(false)}
          onMouseLeave={() => moveLeft(false)}
        >◀ Left</button>
        <button 
          id="jump-btn"
          className="m-[0_5px] p-[8px_15px] bg-[#E52521] text-white border-2 border-black rounded cursor-pointer"
          onClick={jump}
        >Jump</button>
        <button 
          id="right-btn"
          className="m-[0_5px] p-[8px_15px] bg-[#E52521] text-white border-2 border-black rounded cursor-pointer"
          onMouseDown={() => moveRight(true)}
          onMouseUp={() => moveRight(false)}
          onMouseLeave={() => moveRight(false)}
        >Right ▶</button>
        <button 
          id="interact-btn"
          className="m-[0_5px] p-[8px_15px] bg-[#E52521] text-white border-2 border-black rounded cursor-pointer"
          onClick={interact}
        >Interact</button>
      </div>
    </div>
  );
};

export default MarioGame;