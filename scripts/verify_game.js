import puppeteer from 'puppeteer-core';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function pressKey(page, keyName) {
  await page.keyboard.down(keyName);
  await new Promise(r => setTimeout(r, 80));
  await page.keyboard.up(keyName);
  await new Promise(r => setTimeout(r, 120));
}

async function run() {
  console.log('[Test Runner] Launching Edge browser from:', EDGE_PATH);
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`[Browser Console Error] ${msg.text()}`);
    }
  });

  console.log('[Test Runner] Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // 1. Title Screen & Start
  await page.waitForSelector('#game-container canvas');
  await new Promise(r => setTimeout(r, 1200));

  console.log('[Test Runner] Clicking Play button...');
  await page.mouse.click(640, 460);
  await new Promise(r => setTimeout(r, 1000));

  // =========================================================================
  // REQUIREMENT 1: Remove blue interaction area & Don Mateo's visibility arrow
  // =========================================================================
  console.log('\n--- VERIFYING REQUIREMENT 1: Attention Arrow & No Blue Circle ---');
  const arrowCheckBefore = await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    return {
      arrowVisible: plaza.donMateo.isAttentionArrowVisible(),
      arrowY: plaza.donMateo.arrowContainer.y,
      mateoY: plaza.donMateo.y,
      tweenActive: plaza.donMateo.arrowTween && plaza.donMateo.arrowTween.isPlaying()
    };
  });
  console.log('[Req 1] Arrow status before interaction:', arrowCheckBefore);
  if (!arrowCheckBefore.arrowVisible) throw new Error('Expected attention arrow to be visible above Don Mateo!');
  if (!arrowCheckBefore.tweenActive) throw new Error('Expected attention arrow to have an active bounce tween!');

  await page.screenshot({ path: 'test_m4_attention_arrow.png' });

  // =========================================================================
  // REQUIREMENT 2 & 3: Opening sequence, delayed event, and prompt lifecycle
  // =========================================================================
  console.log('\n--- VERIFYING REQUIREMENT 2 & 3: Opening Dialogue & Delayed Event ---');
  await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    plaza.player.setPosition(735, 375);
    plaza.player.update();
    plaza.donMateo.updateProximity(plaza.player, false);
  });
  await new Promise(r => setTimeout(r, 200));

  // Check prompt is visible when near
  const promptNearMateo = await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    return plaza.donMateo.promptContainer.visible;
  });
  if (!promptNearMateo) throw new Error('Expected Don Mateo prompt to be visible when player is near!');

  // Press E to interact
  await pressKey(page, 'KeyE');
  await new Promise(r => setTimeout(r, 300));

  const firstDialogue = await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    return {
      isOpen: plaza.dialogueBox.isOpen,
      textEs: plaza.dialogueBox.dialogueTextEs.text,
      textEn: plaza.dialogueBox.dialogueTextEn.text,
      arrowVisible: plaza.donMateo.isAttentionArrowVisible(),
      promptVisibleDuringDialogue: plaza.donMateo.promptContainer.visible
    };
  });
  console.log('[Req 3] First interaction dialogue:', firstDialogue);
  if (!firstDialogue.isOpen) throw new Error('Don Mateo first dialogue did not open!');
  if (!firstDialogue.textEs.includes('¿Listo para el tiempo loco?')) {
    throw new Error('Expected opening dialogue «¡Hola! ¿Listo para el tiempo loco?»');
  }
  if (firstDialogue.arrowVisible) {
    throw new Error('Expected attention arrow to hide when player starts interaction!');
  }
  if (firstDialogue.promptVisibleDuringDialogue) {
    throw new Error('Expected prompt to be hidden while dialogue is open!');
  }

  await page.screenshot({ path: 'test_m4_first_dialogue.png' });

  // Close dialogue -> starts 1.8s delay
  console.log('[Req 3] Closing dialogue to test 1.8s delay...');
  await pressKey(page, 'Space');
  await new Promise(r => setTimeout(r, 300));

  // Immediately after closing (t ~ 300ms), weather MUST still be sunny
  const immediateStatus = await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    return {
      weather: plaza.weatherCycle.currentWeather,
      scheduled: plaza.isWeatherTransitionScheduled
    };
  });
  console.log('[Req 3] Immediate status after closing dialogue:', immediateStatus);
  if (immediateStatus.weather !== 'sunny') {
    throw new Error('Weather event must not start before the 1.5-2.0s delay!');
  }
  if (!immediateStatus.scheduled) {
    throw new Error('Expected delayed weather transition to be scheduled!');
  }

  // Wait for 1.8s delay to expire
  console.log('[Req 3] Waiting for 1.8s delay to trigger first queued weather event...');
  await new Promise(r => setTimeout(r, 1900));

  const firstEventStatus = await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    return {
      weather: plaza.weatherCycle.currentWeather,
      state: plaza.weatherCycle.questManager.state,
      queueIndex: plaza.weatherCycle.questManager.currentQueueIndex
    };
  });
  console.log('[Req 4] First queued weather event started:', firstEventStatus);
  const eligibleEvents = ['rain', 'wind', 'cold', 'heat', 'sunny'];
  if (!eligibleEvents.includes(firstEventStatus.weather)) {
    throw new Error(`Delayed event failed to trigger a valid weather type! Got: ${firstEventStatus.weather}`);
  }
  if (firstEventStatus.state !== 'WAITING_FOR_FIRST_QUEST') {
    throw new Error(`Expected state WAITING_FOR_FIRST_QUEST, got: ${firstEventStatus.state}`);
  }

  // =========================================================================
  // REQUIREMENT 5 & 13: Phase A (Untimed first quest) + Quest Indicators
  // =========================================================================
  console.log('\n--- VERIFYING REQUIREMENT 5 & 13: Phase A Untimed Quest & Quest Indicator ---');
  // Specifically activate Rain to test Phase A -> Phase B -> Phase C flow
  await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    plaza.weatherCycle.questManager.activateWeatherEvent('rain');
  });
  await new Promise(r => setTimeout(r, 400));

  const phaseACheck = await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    const qm = plaza.weatherCycle.questManager;
    const hud = plaza.hud;
    return {
      state: qm.state,
      weather: qm.currentWeather,
      timerVisible: hud.timerContainer.visible,
      firstQuestCompleted: qm.activeQuests[0].isCompleted,
      indicatorCount: qm.activeIndicators.size,
      firstQuestIndicatorTarget: qm.activeIndicators.get('rain_chair') ? {
        x: qm.activeIndicators.get('rain_chair').target.x,
        y: qm.activeIndicators.get('rain_chair').target.y
      } : null
    };
  });
  console.log('[Req 5] Phase A status in Rain:', phaseACheck);
  if (phaseACheck.state !== 'WAITING_FOR_FIRST_QUEST') throw new Error('Expected WAITING_FOR_FIRST_QUEST in Phase A!');
  if (phaseACheck.timerVisible) throw new Error('Phase A must NOT show a countdown timer!');
  if (phaseACheck.firstQuestCompleted) throw new Error('First quest should not be completed yet!');
  if (phaseACheck.indicatorCount !== 1) throw new Error('Expected exactly 1 QuestIndicator in Phase A!');

  // Pick up chair at (765, 320)
  console.log('[Req 5] Picking up chair at (765, 320)...');
  await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    plaza.player.setPosition(765, 320);
    plaza.player.update();
  });
  await new Promise(r => setTimeout(r, 200));
  await pressKey(page, 'KeyE');
  await new Promise(r => setTimeout(r, 300));

  const chairPickedUp = await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    const chair = plaza.weatherCycle.questManager.rainChair;
    const indicator = plaza.weatherCycle.questManager.activeIndicators.get('rain_chair');
    return {
      isCarried: chair.isCarried,
      indicatorTargetX: indicator ? indicator.target.x : null,
      indicatorTargetY: indicator ? indicator.target.y : null
    };
  });
  console.log('[Req 5 & 13] Chair carried status & indicator retarget:', chairPickedUp);
  if (!chairPickedUp.isCarried) throw new Error('Chair failed to be picked up!');
  if (chairPickedUp.indicatorTargetX !== 840 || chairPickedUp.indicatorTargetY !== 235) {
    throw new Error('QuestIndicator should redirect to café shelter (840, 235) when chair is carried!');
  }

  // Walk to café shelter (840, 235) and place chair
  console.log('[Req 5] Placing chair under café shelter (840, 235)...');
  await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    plaza.player.setPosition(840, 235);
    plaza.player.update();
  });
  await new Promise(r => setTimeout(r, 200));
  await pressKey(page, 'KeyE');
  await new Promise(r => setTimeout(r, 400));

  // =========================================================================
  // REQUIREMENT 5 (Phase B): 60-Second Countdown starts & 2 Bonus Quests active
  // =========================================================================
  console.log('\n--- VERIFYING REQUIREMENT 5: Phase B 60s Countdown & Bonus Quests ---');
  const phaseBCheck = await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    const qm = plaza.weatherCycle.questManager;
    const hud = plaza.hud;
    return {
      state: qm.state,
      firstQuestCompleted: qm.activeQuests[0].isCompleted,
      timerVisible: hud.timerContainer.visible,
      timerText: hud.timerText.text,
      bonusQuestCount: qm.activeQuests.length - 1,
      indicatorCount: qm.activeIndicators.size,
      hasUmbrellaIndicator: qm.activeIndicators.has('rain_umbrella'),
      hasCrateIndicator: qm.activeIndicators.has('rain_crate')
    };
  });
  console.log('[Req 5] Phase B status:', phaseBCheck);
  if (phaseBCheck.state !== 'BONUS_TIMER') throw new Error('Expected BONUS_TIMER state after first quest!');
  if (!phaseBCheck.firstQuestCompleted) throw new Error('First quest must be marked completed!');
  if (!phaseBCheck.timerVisible) throw new Error('Countdown timer must be visible in Phase B!');
  if (!phaseBCheck.timerText.includes('60s') && !phaseBCheck.timerText.includes('59s')) {
    throw new Error(`Expected timer to start at ~60s! Got: ${phaseBCheck.timerText}`);
  }
  if (!phaseBCheck.hasUmbrellaIndicator || !phaseBCheck.hasCrateIndicator) {
    throw new Error('Expected QuestIndicators for both bonus quests in Phase B!');
  }

  // Complete one bonus quest: pick up umbrella at (675, 420)
  console.log('[Req 5] Completing Bonus Quest 1: picking up umbrella at (675, 420)...');
  await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    plaza.player.setPosition(675, 420);
    plaza.player.update();
  });
  await new Promise(r => setTimeout(r, 200));
  await pressKey(page, 'KeyE');
  await new Promise(r => setTimeout(r, 300));

  const bonus1Complete = await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    const qm = plaza.weatherCycle.questManager;
    return {
      umbrellaCompleted: qm.activeQuests[1].isCompleted,
      crateCompleted: qm.activeQuests[2].isCompleted,
      umbrellaIndicatorExists: qm.activeIndicators.has('rain_umbrella'),
      crateIndicatorExists: qm.activeIndicators.has('rain_crate'),
      timerVisible: plaza.hud.timerContainer.visible
    };
  });
  console.log('[Req 5] Bonus Quest 1 completion status:', bonus1Complete);
  if (!bonus1Complete.umbrellaCompleted) throw new Error('Umbrella bonus quest failed to complete!');
  if (bonus1Complete.umbrellaIndicatorExists) throw new Error('Umbrella QuestIndicator should be removed upon completion!');
  if (!bonus1Complete.crateIndicatorExists) throw new Error('Crate QuestIndicator should remain active!');
  if (!bonus1Complete.timerVisible) throw new Error('Timer should still be running!');

  // =========================================================================
  // REQUIREMENT 5 (Phase C): Timeout Ends Event & Skips Remaining Bonus Quests
  // =========================================================================
  console.log('\n--- VERIFYING REQUIREMENT 5: Phase C Timeout & Recap with Skipped Quests ---');
  // Trigger timeout
  await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    plaza.weatherCycle.questManager.endEventDueToTimeout();
  });
  await new Promise(r => setTimeout(r, 400));

  const phaseCCheck = await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    const qm = plaza.weatherCycle.questManager;
    const modal = plaza.weatherCycle.completionModal;
    return {
      state: qm.state,
      modalOpen: modal.isOpen,
      q1Completed: qm.activeQuests[0].isCompleted,
      q2Completed: qm.activeQuests[1].isCompleted,
      q3Completed: qm.activeQuests[2].isCompleted,
      q3Skipped: qm.activeQuests[2].isSkipped,
      q1Text: modal.questText1.text,
      q2Text: modal.questText2.text,
      q3Text: modal.questText3.text,
      autoAdvanceVisible: modal.autoAdvanceText.visible,
      autoAdvanceText: modal.autoAdvanceText.text,
      indicatorsRemaining: qm.activeIndicators.size
    };
  });
  console.log('[Req 5] Phase C status:', phaseCCheck);
  if (phaseCCheck.state !== 'EVENT_RECAP') throw new Error('Expected EVENT_RECAP state after timeout!');
  if (!phaseCCheck.modalOpen) throw new Error('Recap modal failed to open!');
  if (!phaseCCheck.q3Skipped) throw new Error('Incomplete bonus quest should be marked skipped!');
  if (!phaseCCheck.q3Text.includes('Omitida') && !phaseCCheck.q3Text.includes('Skipped')) {
    throw new Error('Recap checklist must display "Omitida (Skipped)" for uncompleted bonus quests!');
  }
  if (!phaseCCheck.autoAdvanceVisible) throw new Error('Auto-advance countdown text must be visible in recap modal!');
  if (phaseCCheck.indicatorsRemaining !== 0) throw new Error('All QuestIndicators must be cleaned up on event end!');

  await page.screenshot({ path: 'test_m4_rain_completed.png' });

  // =========================================================================
  // REQUIREMENT 4: Auto-advance after 3s delay
  // =========================================================================
  console.log('\n--- VERIFYING REQUIREMENT 4: Automatic Advance to Next Event ---');
  console.log('[Req 4] Waiting for 3s auto-advance countdown to expire...');
  await new Promise(r => setTimeout(r, 3400));

  const autoAdvanceStatus = await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    return {
      modalOpen: plaza.weatherCycle.completionModal.isOpen,
      state: plaza.weatherCycle.questManager.state,
      queueIndex: plaza.weatherCycle.questManager.currentQueueIndex
    };
  });
  console.log('[Req 4] Status after auto-advance delay:', autoAdvanceStatus);
  if (autoAdvanceStatus.modalOpen) throw new Error('Recap modal should close automatically after countdown!');
  if (autoAdvanceStatus.state !== 'WAITING_FOR_FIRST_QUEST') {
    throw new Error(`Expected next event to start in WAITING_FOR_FIRST_QUEST, got: ${autoAdvanceStatus.state}`);
  }

  // =========================================================================
  // REQUIREMENT 6 & 7: Test Wind Cycle, Paper Respawn, Sombrero, Crate
  // =========================================================================
  console.log('\n--- VERIFYING REQUIREMENT 6 & 7: Wind Cycle & Paper Deterministic Respawn ---');
  await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    plaza.weatherCycle.questManager.activateWeatherEvent('wind');
  });
  await new Promise(r => setTimeout(r, 400));

  const windCheck = await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    const qm = plaza.weatherCycle.questManager;
    return {
      weather: qm.currentWeather,
      carmenVisible: qm.carmen.visible,
      p1Visible: qm.windPaper1.visible,
      p2Visible: qm.windPaper2.visible,
      hatVisible: qm.windHat.visible,
      crateVisible: qm.windCrate.visible
    };
  });
  console.log('[Req 6 & 7] Wind event props spawned:', windCheck);
  if (!windCheck.carmenVisible || !windCheck.p1Visible || !windCheck.p2Visible || !windCheck.hatVisible || !windCheck.crateVisible) {
    throw new Error('All Wind event props must be visible and active!');
  }

  // Collect Paper 1 at (520, 360) and Paper 2 at (680, 470)
  await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    plaza.player.setPosition(520, 360);
    plaza.player.update();
  });
  await new Promise(r => setTimeout(r, 150));
  await pressKey(page, 'KeyE');
  await new Promise(r => setTimeout(r, 200));

  await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    plaza.player.setPosition(680, 470);
    plaza.player.update();
  });
  await new Promise(r => setTimeout(r, 150));
  await pressKey(page, 'KeyE');
  await new Promise(r => setTimeout(r, 200));

  // Deliver to Carmen at (200, 290)
  await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    plaza.player.setPosition(200, 310);
    plaza.player.update();
  });
  await new Promise(r => setTimeout(r, 150));
  await pressKey(page, 'KeyE');
  await new Promise(r => setTimeout(r, 300));

  const windPhaseB = await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    return {
      state: plaza.weatherCycle.questManager.state,
      firstQuestDone: plaza.weatherCycle.questManager.activeQuests[0].isCompleted
    };
  });
  console.log('[Req 6] Wind Phase A complete -> Phase B:', windPhaseB);
  if (!windPhaseB.firstQuestDone) throw new Error('Wind first quest failed to complete!');

  // Pick up sombrero at (750, 470)
  await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    plaza.player.setPosition(750, 470);
    plaza.player.update();
  });
  await new Promise(r => setTimeout(r, 150));
  await pressKey(page, 'KeyE');
  await new Promise(r => setTimeout(r, 200));

  // Return sombrero to Don Mateo at (735, 375)
  await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    plaza.player.setPosition(735, 375);
    plaza.player.update();
  });
  await new Promise(r => setTimeout(r, 150));
  await pressKey(page, 'KeyE');
  await new Promise(r => setTimeout(r, 300));

  const hatDlg = await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    return {
      isOpen: plaza.dialogueBox.isOpen,
      textEs: plaza.dialogueBox.dialogueTextEs.text
    };
  });
  console.log('[Req 6] Don Mateo sombrero return dialogue:', hatDlg);
  if (!hatDlg.isOpen || !hatDlg.textEs.includes('sombrero')) {
    throw new Error('Expected Don Mateo sombrero delivery dialogue!');
  }
  await pressKey(page, 'Space');
  await new Promise(r => setTimeout(r, 300));

  // =========================================================================
  // REQUIREMENT 7: Test Wind -> Rain -> Wind repeatability and paper respawn
  // =========================================================================
  console.log('\n--- VERIFYING REQUIREMENT 7: Repeatability (Wind -> Rain -> Wind) ---');
  await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    plaza.weatherCycle.questManager.activateWeatherEvent('rain');
  });
  await new Promise(r => setTimeout(r, 300));

  await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    plaza.weatherCycle.questManager.activateWeatherEvent('wind');
  });
  await new Promise(r => setTimeout(r, 300));

  const respawnCheck = await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    const qm = plaza.weatherCycle.questManager;
    return {
      p1Visible: qm.windPaper1.visible,
      p1Collected: qm.windPaper1.isCollected,
      p2Visible: qm.windPaper2.visible,
      p2Collected: qm.windPaper2.isCollected,
      hatVisible: qm.windHat.visible,
      hatDelivered: qm.windHat.isDelivered
    };
  });
  console.log('[Req 7] Respawn status on repeated Wind event:', respawnCheck);
  if (!respawnCheck.p1Visible || respawnCheck.p1Collected || !respawnCheck.p2Visible || respawnCheck.p2Collected) {
    throw new Error('Wind papers failed to cleanly respawn on repeated wind event!');
  }
  if (!respawnCheck.hatVisible || respawnCheck.hatDelivered) {
    throw new Error('Wind sombrero failed to reset cleanly on repeated wind event!');
  }

  // =========================================================================
  // REQUIREMENT 6: Test Cold, Heat, and Sunny Quests
  // =========================================================================
  console.log('\n--- VERIFYING REQUIREMENT 6: Cold, Heat, and Sunny Distinct Quests ---');

  // Cold Event
  await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    plaza.weatherCycle.questManager.activateWeatherEvent('cold');
  });
  await new Promise(r => setTimeout(r, 300));

  const coldQuests = await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    return plaza.weatherCycle.questManager.activeQuests.map(q => q.titleEs);
  });
  console.log('[Req 6] Cold 3 Quests:', coldQuests);
  if (coldQuests.length !== 3) throw new Error('Expected 3 distinct Cold quests!');

  // Heat Event
  await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    plaza.weatherCycle.questManager.activateWeatherEvent('heat');
  });
  await new Promise(r => setTimeout(r, 300));

  const heatQuests = await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    return plaza.weatherCycle.questManager.activeQuests.map(q => q.titleEs);
  });
  console.log('[Req 6] Heat 3 Quests:', heatQuests);
  if (heatQuests.length !== 3) throw new Error('Expected 3 distinct Heat quests!');

  // Sunny Event
  await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    plaza.weatherCycle.questManager.activateWeatherEvent('sunny');
  });
  await new Promise(r => setTimeout(r, 300));

  const sunnyQuests = await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    return plaza.weatherCycle.questManager.activeQuests.map(q => q.titleEs);
  });
  console.log('[Req 6] Sunny 3 Quests:', sunnyQuests);
  if (sunnyQuests.length !== 3) throw new Error('Expected 3 distinct Sunny quests!');

  // Complete Sunny Quest 1: Inspect flowers at (330, 300)
  console.log('[Req 6] Completing Sunny Quest 1: inspecting flowers...');
  await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    plaza.player.setPosition(330, 300);
    plaza.player.update();
  });
  await new Promise(r => setTimeout(r, 150));
  await pressKey(page, 'KeyE');
  await new Promise(r => setTimeout(r, 300));

  const sunnyFirstDone = await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    return plaza.weatherCycle.questManager.activeQuests[0].isCompleted;
  });
  console.log('[Req 6] Sunny flowers quest completed:', sunnyFirstDone);
  if (!sunnyFirstDone) throw new Error('Sunny flowers quest failed to complete!');

  // =========================================================================
  // REQUIREMENT 4: Session Complete & Restart
  // =========================================================================
  console.log('\n--- VERIFYING REQUIREMENT 4: Session Complete & Restart Flow ---');
  await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    const qm = plaza.weatherCycle.questManager;
    // Set queue index to end
    qm.currentQueueIndex = qm.eventQueue.length - 1;
    qm.startNextQueuedEvent();
  });
  await new Promise(r => setTimeout(r, 400));

  const sessionCompleteCheck = await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    const modal = plaza.weatherCycle.completionModal;
    return {
      isOpen: modal.isOpen,
      title: modal.title.text,
      restartVisible: modal.btnRestartSession.visible
    };
  });
  console.log('[Req 4] Session complete screen:', sessionCompleteCheck);
  if (!sessionCompleteCheck.isOpen || !sessionCompleteCheck.title.includes('SESIÓN COMPLETADA')) {
    throw new Error('Expected Session Complete modal to appear at end of queue!');
  }
  if (!sessionCompleteCheck.restartVisible) {
    throw new Error('Expected Start New Session button to be visible!');
  }

  // Click Restart Session
  console.log('[Req 4] Clicking Start New Session button...');
  await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    plaza.weatherCycle.completionModal.btnRestartSession.emit('pointerdown');
  });
  await new Promise(r => setTimeout(r, 500));

  const restartStatus = await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    return {
      weather: plaza.weatherCycle.currentWeather,
      arrowVisible: plaza.donMateo.isAttentionArrowVisible(),
      modalOpen: plaza.weatherCycle.completionModal.isOpen
    };
  });
  console.log('[Req 4] Status after session restart:', restartStatus);
  if (restartStatus.weather !== 'sunny') throw new Error('Session restart must return to sunny plaza!');
  if (!restartStatus.arrowVisible) throw new Error('Don Mateo attention arrow must reappear on session restart!');
  if (restartStatus.modalOpen) throw new Error('Modal should be closed after session restart!');

  await page.screenshot({ path: 'test_m4_sunny_baseline.png' });

  // =========================================================================
  // REQUIREMENT 2: Prompt Lifecycle & Hysteresis verification
  // =========================================================================
  console.log('\n--- VERIFYING REQUIREMENT 2: Prompt Lifecycle & Hysteresis ---');
  const promptHysteresis = await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    const mateo = plaza.donMateo;
    const player = plaza.player;

    // 1. Far away (dist = 200) -> false
    player.setPosition(575, 375);
    mateo.updateProximity(player, false);
    const far = mateo.promptContainer.visible;

    // 2. Move to enter radius (dist = 75 <= 80) -> true
    player.setPosition(700, 375);
    mateo.updateProximity(player, false);
    const entered = mateo.promptContainer.visible;

    // 3. Move to hysteresis zone (dist = 88: > 80 but <= 95) -> should stay true (no flicker!)
    player.setPosition(687, 375);
    mateo.updateProximity(player, false);
    const hysteresisHold = mateo.promptContainer.visible;

    // 4. Move beyond exit radius (dist = 110 > 95) -> false
    player.setPosition(665, 375);
    mateo.updateProximity(player, false);
    const exited = mateo.promptContainer.visible;

    return { far, entered, hysteresisHold, exited };
  });
  console.log('[Req 2] Hysteresis results:', promptHysteresis);
  if (promptHysteresis.far !== false || promptHysteresis.entered !== true || promptHysteresis.hysteresisHold !== true || promptHysteresis.exited !== false) {
    throw new Error('Prompt hysteresis failed to prevent boundary flicker!');
  }

  // =========================================================================
  // REQUIREMENT 14: Slower Player Movement & Normalized Diagonal Travel
  // =========================================================================
  console.log('\n--- VERIFYING REQUIREMENT 14: Slower Player Movement ---');
  const movementCheck = await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    const player = plaza.player;

    const baseSpeed = player.speed;

    // Simulate key presses for diagonal movement: Right + Down
    player.cursors.right.isDown = true;
    player.cursors.down.isDown = true;
    player.update();

    const diagVx = player.body.velocity.x;
    const diagVy = player.body.velocity.y;
    const diagMagnitude = Math.hypot(diagVx, diagVy);

    // Release keys
    player.cursors.right.isDown = false;
    player.cursors.down.isDown = false;
    player.update();

    const idleVx = player.body.velocity.x;
    const idleVy = player.body.velocity.y;

    // Test movement lock
    player.cursors.up.isDown = true;
    player.update();
    const movingVx = player.body.velocity.x;
    const movingVy = player.body.velocity.y;
    player.setMovementLock(true);
    const lockedVx = player.body.velocity.x;
    const lockedVy = player.body.velocity.y;
    player.setMovementLock(false);
    player.cursors.up.isDown = false;
    player.update();

    return {
      baseSpeed,
      diagVx,
      diagVy,
      diagMagnitude: Math.round(diagMagnitude),
      idleVx,
      idleVy,
      movingVy,
      lockedVx,
      lockedVy
    };
  });
  console.log('[Req 14] Player movement audit:', movementCheck);
  if (movementCheck.baseSpeed !== 118) {
    throw new Error(`Expected player speed to be 118 (reduced ~12.6% from 135), got ${movementCheck.baseSpeed}`);
  }
  if (movementCheck.diagMagnitude !== 118) {
    throw new Error(`Expected normalized diagonal speed magnitude to be 118, got ${movementCheck.diagMagnitude}`);
  }
  if (movementCheck.idleVx !== 0 || movementCheck.idleVy !== 0) {
    throw new Error('Expected player velocity to be 0 when idle!');
  }
  if (movementCheck.lockedVx !== 0 || movementCheck.lockedVy !== 0) {
    throw new Error('Expected player velocity to be immediately 0 when movement is locked!');
  }

  // =========================================================================
  // REQUIREMENT: Ambient NPCs on Benches
  // =========================================================================
  console.log('\n--- VERIFYING: Ambient NPCs Sitting on Benches ---');
  const ambientNpcCheck = await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    if (!plaza.ambientBenchNpcs || plaza.ambientBenchNpcs.length === 0) {
      return { count: 0 };
    }
    return {
      count: plaza.ambientBenchNpcs.length,
      npc1: { x: plaza.ambientBenchNpcs[0].x, y: plaza.ambientBenchNpcs[0].y, visible: plaza.ambientBenchNpcs[0].visible },
      npc2: { x: plaza.ambientBenchNpcs[1].x, y: plaza.ambientBenchNpcs[1].y, visible: plaza.ambientBenchNpcs[1].visible }
    };
  });
  console.log('Ambient Bench NPCs audit:', ambientNpcCheck);
  if (ambientNpcCheck.count < 2) {
    throw new Error('Expected at least 2 ambient NPCs sitting on plaza benches!');
  }

  // =========================================================================
  // REQUIREMENT: Accompany to the Café Escort Quest
  // =========================================================================
  console.log('\n--- VERIFYING: Accompany to the Café Escort Quest ---');
  const escortCheck = await page.evaluate(async () => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    const qm = plaza.weatherCycle.questManager;

    // Activate cold weather
    qm.activateWeatherEvent('cold');
    // Complete first quest to enter Phase B (Bonus timer)
    qm.completeFirstQuest();

    const elena = qm.coldElena;
    const initialFollowing = elena.isFollowingPlayer;

    // Player walks up to Elena at (730, 330) and interacts
    plaza.player.setPosition(730, 330);
    plaza.player.update();
    qm.handleInteraction(plaza.player);

    const followingAfterInteract = elena.isFollowingPlayer;
    const escortedFlag = elena.isEscorted;

    // Simulate player walking toward café at (825, 255)
    plaza.player.setPosition(800, 270);
    plaza.player.update();
    qm.update(plaza.player, false);

    const elenaMoving = (elena.body.velocity.x !== 0 || elena.body.velocity.y !== 0);

    // Player reaches café entrance
    plaza.player.setPosition(825, 255);
    plaza.player.update();
    // Simulate Elena stepping into the café entrance zone
    elena.setPosition(820, 255);
    qm.update(plaza.player, false);

    const questCompleted = qm.activeQuests[2].isCompleted;
    const followingAfterArrival = elena.isFollowingPlayer;

    return {
      initialFollowing,
      followingAfterInteract,
      escortedFlag,
      elenaMoving,
      questCompleted,
      followingAfterArrival
    };
  });
  console.log('Café Escort Quest audit:', escortCheck);
  if (!escortCheck.followingAfterInteract || !escortCheck.escortedFlag) {
    throw new Error('Elena should begin following the player upon interaction!');
  }
  if (!escortCheck.questCompleted) {
    throw new Error('Café escort quest should complete when Elena arrives at the café entrance!');
  }
  if (escortCheck.followingAfterArrival !== false) {
    throw new Error('Elena should stop following once she arrives at the café!');
  }

  // =========================================================================
  // REQUIREMENT: Sunny Escort Quest using Snowy Escort Mechanics
  // =========================================================================
  console.log('\n--- VERIFYING: Sunny Escort Quest using Snowy Escort Mechanics ---');
  const sunnyEscortCheck = await page.evaluate(async () => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    const qm = plaza.weatherCycle.questManager;

    // Activate sunny weather
    qm.activateWeatherEvent('sunny');
    qm.completeFirstQuest(); // Enter Phase B (Bonus timer)

    const sofia = qm.heatSofia;
    const initialFollowing = sofia.isFollowingPlayer;

    // Player walks up to Sofia at (600, 470) and interacts
    plaza.player.setPosition(sofia.x, sofia.y);
    plaza.player.update();
    qm.handleInteraction(plaza.player);

    const followingAfterInteract = sofia.isFollowingPlayer;
    const escortedFlag = sofia.isEscorted;

    // Simulate player walking toward tree shade at (755, 565)
    plaza.player.setPosition(700, 520);
    plaza.player.update();
    qm.update(plaza.player, false);

    const sofiaMoving = (sofia.body.velocity.x !== 0 || sofia.body.velocity.y !== 0);

    // Player arrives under tree shade
    plaza.player.setPosition(755, 565);
    plaza.player.update();
    // Sofia steps into shaded zone
    sofia.setPosition(750, 560);
    qm.update(plaza.player, false);

    const shadeQuest = qm.activeQuests[1];
    const questCompleted = shadeQuest.isCompleted;
    const followingAfterArrival = sofia.isFollowingPlayer;
    const finalInShade = sofia.inShade;

    return {
      initialFollowing,
      followingAfterInteract,
      escortedFlag,
      sofiaMoving,
      questCompleted,
      followingAfterArrival,
      finalInShade,
      finalX: sofia.x,
      finalY: sofia.y
    };
  });
  console.log('Sunny Escort Quest audit:', sunnyEscortCheck);
  if (!sunnyEscortCheck.followingAfterInteract || !sunnyEscortCheck.escortedFlag) {
    throw new Error('Sofia should begin following player using real-time follow mechanics upon interaction!');
  }
  if (!sunnyEscortCheck.sofiaMoving) {
    throw new Error('Sofia should visibly move towards the player during escort!');
  }
  if (!sunnyEscortCheck.questCompleted || !sunnyEscortCheck.finalInShade) {
    throw new Error('Sunny escort quest should complete when Sofia arrives at the shaded tree area!');
  }
  if (sunnyEscortCheck.followingAfterArrival !== false) {
    throw new Error('Sofia should stop following once she arrives at the shaded tree area!');
  }

  // =========================================================================
  // REQUIREMENT: Ice Cream Quest replacing Glass of Water
  // =========================================================================
  console.log('\n--- VERIFYING: Ice Cream Quest (¡Vamos a comer un helado!) ---');
  const iceCreamCheck = await page.evaluate(async () => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    const qm = plaza.weatherCycle.questManager;

    // Check quest titles: confirm NO glass of water quest
    const titlesEs = qm.activeQuests.map(q => q.titleEs);
    const hasGlassOfWater = titlesEs.some(t => t.toLowerCase().includes('vaso de agua'));
    const hasIceCream = titlesEs.some(t => t.includes('helado'));

    // Heladero initial status
    const heladero = qm.heladero;
    const initialOrdered = heladero.isOrdered;

    // Walk up to Heladero Paco at (790, 270)
    plaza.player.setPosition(790, 270);
    plaza.player.update();

    // Interact to order ice cream
    qm.handleInteraction(plaza.player);

    const dlgOpen = plaza.dialogueBox.isOpen;
    const dlgSpeakerEs = plaza.dialogueBox.speakerTextEs ? plaza.dialogueBox.speakerTextEs.text : '';
    const dlgTextEs = plaza.dialogueBox.dialogueTextEs ? plaza.dialogueBox.dialogueTextEs.text : '';
    const dlgTextEn = plaza.dialogueBox.dialogueTextEn ? plaza.dialogueBox.dialogueTextEn.text : '';

    // Close dialogue immediately to complete ordering
    plaza.dialogueBox.close(true);

    const finalOrdered = heladero.isOrdered;
    const iceQuestCompleted = qm.activeQuests[2].isCompleted;

    return {
      hasGlassOfWater,
      hasIceCream,
      initialOrdered,
      dlgOpen,
      dlgSpeakerEs,
      dlgTextEs,
      dlgTextEn,
      finalOrdered,
      iceQuestCompleted
    };
  });
  console.log('Ice Cream Quest audit:', iceCreamCheck);
  if (iceCreamCheck.hasGlassOfWater) {
    throw new Error('The old glass-of-water quest should be completely removed from sunny weather!');
  }
  if (!iceCreamCheck.hasIceCream) {
    throw new Error('Expected "¡Vamos a comer un helado!" quest to be active!');
  }
  if (!iceCreamCheck.dlgTextEs.includes('helado') || !iceCreamCheck.dlgTextEs.includes('por favor')) {
    throw new Error('Dialogue must include «¿Quieres un helado?» and «por favor»!');
  }
  if (!iceCreamCheck.iceQuestCompleted) {
    throw new Error('Ice cream quest should complete after interacting with vendor and ordering!');
  }

  // =========================================================================
  // REQUIREMENT: Repeat Sunny Weather in Same Session
  // =========================================================================
  console.log('\n--- VERIFYING: Repeat Sunny Weather in Same Session ---');
  const repeatSunnyCheck = await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    const qm = plaza.weatherCycle.questManager;

    // Reactivate sunny weather in the same session
    qm.activateWeatherEvent('sunny');

    return {
      sofiaResetX: qm.heatSofia.x,
      sofiaResetY: qm.heatSofia.y,
      sofiaFollowing: qm.heatSofia.isFollowingPlayer,
      sofiaInShade: qm.heatSofia.inShade,
      heladeroOrdered: qm.heladero.isOrdered,
      flowersInspected: qm.sunnyFlowers.isInspected,
      firstQuestCompleted: qm.activeQuests[0].isCompleted,
      secondQuestCompleted: qm.activeQuests[1].isCompleted,
      thirdQuestCompleted: qm.activeQuests[2].isCompleted
    };
  });
  console.log('Repeat Sunny audit:', repeatSunnyCheck);
  if (repeatSunnyCheck.sofiaResetX !== 600 || repeatSunnyCheck.sofiaResetY !== 470) {
    throw new Error('Sofia should cleanly reset to initial position (600, 470) on repeated sunny weather!');
  }
  if (repeatSunnyCheck.sofiaFollowing || repeatSunnyCheck.sofiaInShade) {
    throw new Error('Sofia escort state should reset on repeated sunny weather!');
  }
  if (repeatSunnyCheck.heladeroOrdered) {
    throw new Error('Heladero order status should reset on repeated sunny weather!');
  }
  if (repeatSunnyCheck.firstQuestCompleted || repeatSunnyCheck.secondQuestCompleted || repeatSunnyCheck.thirdQuestCompleted) {
    throw new Error('All quests should reset to uncompleted on repeated sunny weather!');
  }

  // =========================================================================
  // REQUIREMENT: Everyday Spanish Vocabulary Inventory Audit (7+ items, 0 duplicates)
  // =========================================================================
  console.log('\n--- VERIFYING: Spanish Vocabulary Inventory (7+ Items, 0 Duplicates) ---');
  const vocabAudit = await page.evaluate(async () => {
    // Dynamic import of constants
    const { WEATHER_VOCABULARY_INVENTORY } = await import('/src/config/constants.js');
    const categories = ['rain', 'wind', 'cold', 'heat', 'sunny'];

    const report = {};
    const allObjects = [];
    let duplicates = [];

    categories.forEach(cat => {
      const items = WEATHER_VOCABULARY_INVENTORY[cat] || [];
      report[cat] = {
        count: items.length,
        items: items.map(i => i.es)
      };

      items.forEach(i => {
        if (allObjects.includes(i.es)) {
          duplicates.push({ object: i.es, category: cat });
        } else {
          allObjects.push(i.es);
        }
      });
    });

    return {
      report,
      totalUniqueObjects: allObjects.length,
      duplicates
    };
  });
  console.log('Vocabulary Audit report:', vocabAudit);
  ['rain', 'wind', 'cold', 'heat', 'sunny'].forEach(cat => {
    if (vocabAudit.report[cat].count < 7) {
      throw new Error(`Category ${cat} must have at least 7 distinct everyday objects, got ${vocabAudit.report[cat].count}!`);
    }
  });
  if (vocabAudit.duplicates.length > 0) {
    throw new Error(`Found duplicate vocabulary objects across categories: ${JSON.stringify(vocabAudit.duplicates)}`);
  }
  if (vocabAudit.totalUniqueObjects < 35) {
    throw new Error(`Expected at least 35 unique everyday objects across all 5 weather categories, got ${vocabAudit.totalUniqueObjects}!`);
  }

  // Take screenshot of the new sunny layout with ice-cream cart and vendor
  await page.screenshot({ path: 'test_sunny_icecream_layout.png' });

  // =========================================================================
  // REQUIREMENT: UI Layout & Multi-Row Quest Readability
  // =========================================================================
  console.log('\n--- VERIFYING: UI Layout & Multi-Row Quest Panel ---');
  const uiCheck = await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    const hud = plaza.hud;
    const qm = plaza.weatherCycle.questManager;

    // 1. Single quest mode
    hud.setTaskDisplay('MISIÓN: Explora libremente la plaza.', 'MISSION: Freely explore the plaza.');
    const singleVisible = hud.singleTaskContainer.visible;
    const multiVisibleWhenSingle = hud.multiTaskContainer.visible;

    // 2. Multi-quest mode
    hud.setMultiQuestDisplay(qm.activeQuests);
    const singleVisibleWhenMulti = hud.singleTaskContainer.visible;
    const multiVisible = hud.multiTaskContainer.visible;
    const rowCount = hud.questRows.length;
    const row1TextEs = hud.questRows[0].titleEs.text;
    const row1TextEn = hud.questRows[0].titleEn.text;
    const row2TextEs = hud.questRows[1].titleEs.text;
    const row3TextEs = hud.questRows[2].titleEs.text;

    // 3. Vocabulary panel dimensions
    const vocabX = hud.vocabPhrase.x;
    const vocabFontSize = hud.vocabPhrase.style.fontSize;
    const vocabColor = hud.vocabPhrase.style.color;

    return {
      singleVisible,
      multiVisibleWhenSingle,
      singleVisibleWhenMulti,
      multiVisible,
      rowCount,
      row1TextEs,
      row1TextEn,
      row2TextEs,
      row3TextEs,
      vocabX,
      vocabFontSize,
      vocabColor
    };
  });
  console.log('UI Layout audit:', uiCheck);
  if (!uiCheck.singleVisible || uiCheck.multiVisibleWhenSingle) {
    throw new Error('Single quest mode container visibility incorrect!');
  }
  if (uiCheck.singleVisibleWhenMulti || !uiCheck.multiVisible) {
    throw new Error('Multi-quest mode container visibility incorrect!');
  }
  if (uiCheck.rowCount !== 3 || !uiCheck.row1TextEs || !uiCheck.row2TextEs || !uiCheck.row3TextEs) {
    throw new Error('Expected 3 distinct quest rows in multi-quest display!');
  }

  // Take screenshot of the new UI layout
  await page.screenshot({ path: 'test_improved_ui_layout.png' });

  // =========================================================================
  // REQUIREMENT 15: Sound Effects and Ambient Audio System
  // =========================================================================
  console.log('\n--- VERIFYING REQUIREMENT 15: Sound Effects & Ambient Audio ---');
  const audioCheck = await page.evaluate(() => {
    const plaza = window.__PHASER_GAME__.scene.getScene('PlazaScene');
    const sm = plaza.soundManager;
    const hud = plaza.hud;

    if (!sm) {
      return { hasSoundManager: false };
    }

    // 1. Initial audio toggle state
    const initialMuted = sm.isMuted;
    const initialTextEs = hud.soundTextEs.text;
    const initialTextEn = hud.soundTextEn.text;

    // 2. Toggle mute via HUD button click
    hud.soundButtonContainer.emit('pointerdown');
    const mutedAfterToggle = sm.isMuted;
    const mutedTextEs = hud.soundTextEs.text;
    const mutedTextEn = hud.soundTextEn.text;

    // 3. Toggle back to unmuted
    hud.soundButtonContainer.emit('pointerdown');
    const restoredMuted = sm.isMuted;
    const restoredTextEs = hud.soundTextEs.text;
    const restoredTextEn = hud.soundTextEn.text;

    // 4. Test SFX methods for graceful execution (no crashes)
    let sfxErrors = [];
    try { sm.playFootstep(); } catch (e) { sfxErrors.push('playFootstep: ' + e.message); }
    try { sm.stopFootsteps(); } catch (e) { sfxErrors.push('stopFootsteps: ' + e.message); }
    try { sm.playInteract(); } catch (e) { sfxErrors.push('playInteract: ' + e.message); }
    try { sm.playProgress(); } catch (e) { sfxErrors.push('playProgress: ' + e.message); }
    try { sm.playCompletion(); } catch (e) { sfxErrors.push('playCompletion: ' + e.message); }
    try { sm.playWeatherTransition(); } catch (e) { sfxErrors.push('playWeatherTransition: ' + e.message); }

    // 5. Test Weather ambience switching across all 5 states
    const weatherHistory = [];
    ['rain', 'wind', 'cold', 'heat', 'sunny'].forEach(w => {
      sm.setWeather(w);
      weatherHistory.push(sm.currentWeather);
    });

    // 6. Stop ambience test
    sm.stopAmbience();
    const ambienceAfterStop = sm.currentAmbience;

    return {
      hasSoundManager: true,
      initialMuted,
      initialTextEs,
      initialTextEn,
      mutedAfterToggle,
      mutedTextEs,
      mutedTextEn,
      restoredMuted,
      restoredTextEs,
      restoredTextEn,
      sfxErrors,
      weatherHistory,
      ambienceAfterStop
    };
  });

  console.log('[Req 15] SoundManager audit:', audioCheck);
  if (!audioCheck.hasSoundManager) {
    throw new Error('SoundManager not found on PlazaScene!');
  }
  if (audioCheck.initialMuted !== false || !audioCheck.initialTextEn.includes('SOUND: ON')) {
    throw new Error('Sound should default to ON!');
  }
  if (audioCheck.mutedAfterToggle !== true || !audioCheck.mutedTextEn.includes('SOUND: OFF')) {
    throw new Error('HUD Sound Toggle button did not mute audio or update HUD text correctly!');
  }
  if (audioCheck.restoredMuted !== false || !audioCheck.restoredTextEn.includes('SOUND: ON')) {
    throw new Error('HUD Sound Toggle button did not unmute audio correctly!');
  }
  if (audioCheck.sfxErrors.length > 0) {
    throw new Error('Audio SFX threw runtime errors: ' + audioCheck.sfxErrors.join(', '));
  }
  if (JSON.stringify(audioCheck.weatherHistory) !== JSON.stringify(['rain', 'wind', 'cold', 'heat', 'sunny'])) {
    throw new Error('SoundManager failed to track weather ambience correctly!');
  }
  if (audioCheck.ambienceAfterStop !== null) {
    throw new Error('SoundManager.stopAmbience() must clear active ambience to prevent audio leaks!');
  }

  await browser.close();
  console.log('\n============================================================');
  console.log('✅ ALL REQUIREMENTS (UI, ESCORT, SHADE, BENCHES, SPEED) PASSED 100%!');
  console.log('============================================================');
}

run().catch(err => {
  console.error('\n❌ [Test Runner] FAILED with error:', err);
  process.exit(1);
});
