/* ===================================================
   "I'M YOUR GIRLFRIEND?" - JAVASCRIPT LOGIC
   Strictly Zero Audio / Pure Visual Interaction
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const btnRetry = document.getElementById('btn-retry');
  const viewHappy = document.getElementById('view-happy');
  const viewSad = document.getElementById('view-sad');
  const viewSuccess = document.getElementById('view-success');
  const evadeCountSpan = document.getElementById('evade-count');
  const evadeStatus = document.getElementById('evade-status');
  const reactionContainer = document.getElementById('reaction-container');
  const happyCatImg = document.getElementById('happy-cat-img');
  const sadCatImg = document.getElementById('sad-cat-img');

  // Random image pools
  const happyImages = [
    'assets/happy_1.jpg',
    'assets/happy_2.jpg',
    'assets/happy_3.jpg',
    'assets/happy_4.jpg'
  ];
  const sadImages = [
    'assets/sad_1.jpg',
    'assets/sad_2.jpg',
    'assets/sad_3.jpg',
    'assets/sad_4.jpg'
  ];

  // Set random images on page load
  happyCatImg.src = happyImages[Math.floor(Math.random() * happyImages.length)];
  sadCatImg.src = sadImages[Math.floor(Math.random() * sadImages.length)];

  let evadeCount = 0;
  let isRunawayActive = false;
  // Random threshold between 20 and 25 inclusive
  const unlockAt = 20 + Math.floor(Math.random() * 6);

  const quips = [
    "Nope! 😜",
    "Too slow! 💨",
    "Can't catch me! 🐾",
    "Hehe! ✨",
    "Try again! 😹",
    "Nuh-uh! 🙅‍♂️",
    "Say yes first! 💕",
    "Over here! 📍",
    "Still your girlfriend! 🐱💖",
    "Still unreachable! 🏃‍♂️",
    "Caught feelings, not me! ⚡",
    "Almost had it! 🥰"
  ];

  /**
   * Generates a random safe position within the viewport,
   * ensuring a noticeable jump away from current coordinates.
   */
  function getRandomCoordinates(currentX, currentY) {
    const padding = 24;
    const btnRect = btnYes.getBoundingClientRect();
    const btnWidth = btnRect.width || 120;
    const btnHeight = btnRect.height || 54;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const maxX = Math.max(padding, viewportWidth - btnWidth - padding);
    const maxY = Math.max(padding, viewportHeight - btnHeight - padding);

    let randomX = currentX;
    let randomY = currentY;
    let attempts = 0;

    // Ensure it leaps at least 100px away from the current position if space allows
    do {
      randomX = Math.floor(padding + Math.random() * (maxX - padding));
      randomY = Math.floor(padding + Math.random() * (maxY - padding));
      attempts++;
    } while (
      attempts < 10 &&
      currentX !== undefined &&
      currentY !== undefined &&
      Math.hypot(randomX - currentX, randomY - currentY) < 120
    );

    return { x: randomX, y: randomY };
  }

  /**
   * Spawns a playful floating text pop-up at coordinates
   */
  function spawnFloatingBubble(x, y) {
    const bubble = document.createElement('div');
    bubble.className = 'pop-bubble';

    // Pick random quip
    const randomQuip = quips[Math.floor(Math.random() * quips.length)];
    bubble.textContent = randomQuip;

    bubble.style.left = `${x}px`;
    bubble.style.top = `${y}px`;

    reactionContainer.appendChild(bubble);

    // Auto-remove after animation completes
    setTimeout(() => {
      bubble.remove();
    }, 1200);
  }

  /**
   * Move the Yes button to a new random location
   */
  function teleportYesButton(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const currentRect = btnYes.getBoundingClientRect();
    const oldCenterX = currentRect.left + currentRect.width / 2;
    const oldCenterY = currentRect.top + currentRect.height / 2;

    // First time runaway activation
    if (!isRunawayActive) {
      isRunawayActive = true;
      btnYes.classList.add('runaway');
      document.body.appendChild(btnYes); // move to body so fixed positioning is viewport-relative
    }

    const { x, y } = getRandomCoordinates(currentRect.left, currentRect.top);
    btnYes.style.left = `${x}px`;
    btnYes.style.top = `${y}px`;

    // Increment counter
    evadeCount++;
    evadeCountSpan.textContent = evadeCount;

    // Check unlock condition
    if (evadeCount >= unlockAt && !btnYes.classList.contains('unlocked')) {
      btnYes.classList.remove('runaway');
      btnYes.classList.add('unlocked');
      btnYes.style.position = 'relative';
      btnYes.style.left = '';
      btnYes.style.top = '';
      // Change appearance via CSS class; CSS already defines .btn-yes.unlocked styling
    }

    // Highlight tag effect
    const tag = evadeStatus.querySelector('.tag-label');
    if (tag) {
      tag.classList.add('highlight');
      setTimeout(() => tag.classList.remove('highlight'), 300);
    }

    // Spawn floating reaction
    spawnFloatingBubble(oldCenterX, oldCenterY);
  }

  // Handle Yes button click & touch events
  btnYes.addEventListener('click', (e) => {
    if (btnYes.classList.contains('unlocked')) {
      // Transition to success view
      viewHappy.classList.remove('active');
      viewHappy.classList.add('hidden');
      viewSuccess.classList.remove('hidden');
      viewSuccess.classList.add('active');
    } else {
      teleportYesButton(e);
    }
  });

  // Support evasive maneuver immediately on hover and on touch/click
  let hoverCooldown = false;
  btnYes.addEventListener('mouseenter', (e) => {
    if (!hoverCooldown && !btnYes.classList.contains('unlocked')) {
      hoverCooldown = true;
      teleportYesButton(e);
      setTimeout(() => { hoverCooldown = false; }, 150);
    }
  });

  /**
   * Handle No Button Click -> Transition to Sad Crying Cat Page
   */
  btnNo.addEventListener('click', () => {
    // Hide Yes button if it's currently floating in body
    if (isRunawayActive) {
      btnYes.style.display = 'none';
    }

    // Page transition
    viewHappy.classList.remove('active');
    viewHappy.classList.add('hidden');

    viewSad.classList.remove('hidden');
    viewSad.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /**
   * Reset back to Happy Page (also resets success view)
   */
  btnRetry.addEventListener('click', () => {
    // Return Yes button back to original container inside happy view
    const btnContainer = document.getElementById('btn-container');
    if (isRunawayActive) {
      btnYes.classList.remove('runaway');
      btnYes.classList.remove('unlocked');
      btnYes.style.position = '';
      btnYes.style.left = '';
      btnYes.style.top = '';
      btnYes.style.display = '';
      btnContainer.prepend(btnYes);
      isRunawayActive = false;
    }
    // Reset counter and unlock threshold
    evadeCount = 0;
    evadeCountSpan.textContent = evadeCount;
    // generate a new unlock threshold for next round
    // (optional) keep previous unlockAt or recalc; here we recalc
    // Note: this variable is const, so we cannot reassign; instead we rely on the same threshold for this session.

    // Switch views back to happy, hide others
    viewSad.classList.remove('active');
    viewSad.classList.add('hidden');
    viewSuccess.classList.remove('active');
    viewSuccess.classList.add('hidden');
    viewHappy.classList.remove('hidden');
    viewHappy.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Handle window resize so runaway button never falls off-screen
  window.addEventListener('resize', () => {
    if (isRunawayActive && btnYes.style.display !== 'none') {
      const currentRect = btnYes.getBoundingClientRect();
      const { x, y } = getRandomCoordinates(currentRect.left, currentRect.top);
      btnYes.style.left = `${x}px`;
      btnYes.style.top = `${y}px`;
    }
  });
});
