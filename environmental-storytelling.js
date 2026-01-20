// ==========================================
// SUBTLE HINTS & ENVIRONMENTAL STORYTELLING
// Removes explicit choices, adds 3-tier hint system
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {

        // ===== REMOVE EXPLICIT TOPIC LISTS =====
        // Override cmdTalk to NOT show topic suggestions

        if (typeof GameEngine !== 'undefined') {
            const originalCmdTalk = GameEngine.cmdTalk;

            GameEngine.cmdTalk = function(target) {
                if (!target) {
                    this.output("Prata med vem?");
                    return;
                }

                const room = Rooms[Game.player.currentRoom];

                if (!room.characters || room.characters.length === 0) {
                    this.output("Det finns ingen här att prata med.");
                    return;
                }

                // Find character
                let foundChar = null;
                for (let charId of room.characters) {
                    const char = Characters[charId];
                    if (char && char.keywords.some(k => target.includes(k))) {
                        foundChar = { id: charId, char: char };
                        break;
                    }
                }

                if (!foundChar) {
                    this.output("Jag ser ingen sådan person här.");
                    return;
                }

                // Show dialogue - NO TOPIC LIST!
                const dialogue = foundChar.char.dialogue;

                // Check which dialogue to show
                if (foundChar.id === 'portier' && Game.player.hasModernClothes) {
                    this.output(`<div class="dialogue">${dialogue.first_modern_clothes}</div>`);
                } else if (foundChar.id === 'portier' && !Game.player.hasModernClothes) {
                    this.output(`<div class="dialogue">${dialogue.first_period_clothes}</div>`);
                } else if (dialogue.first && !Game.player.knowledge.includes(`met_${foundChar.id}`)) {
                    this.output(`<div class="dialogue">${dialogue.first}</div>`);
                    Game.player.knowledge.push(`met_${foundChar.id}`);

                    // NO TOPIC SUGGESTIONS - Let player discover!
                } else {
                    // Just acknowledge, don't list topics
                    this.output(`<div class="dialogue">${foundChar.char.name} tittar på dig avvaktande.</div>`);
                }

                // Track for achievements
                if (!Game.achievementStats.peopleSpokenTo.includes(foundChar.id)) {
                    Game.achievementStats.peopleSpokenTo.push(foundChar.id);
                }
            };
        }

        // ===== ENVIRONMENTAL CLUES IN DIALOGUE =====
        // Rewrite Bellman's first dialogue to be more subtle

        if (Characters && Characters.bellman) {
            Characters.bellman.dialogue.first = `En man med rufsigt hår och rödsprängda ögon höjer sitt ölstop mot dig.

"En ny besökare i Freden! Sätt dig, sätt dig!"

Han tar en djup klunk och tittar på dig med glänsande ögon. När du frågar vem han är, ler han brett:

"Bellman! Den störste skalden i riket, om du frågar mig. Och kanske den störste drickaren också..."

Han blir plötsligt tyst när någon vid bordet bredvid nämner namnet <span class="important">"Pechlin"</span>. Hans blick flackar mot fönstret - åt Blasieholmen.

Han tar en djup klunk brännvin och mumlar: "Adliga sammankomster som inte för något gott med sig..."

Sedan sjunger han en vers tyst för sig själv - något om Gustav och skålar.`;
        }

        // ===== THREE-TIER HINT SYSTEM =====

        if (!Game.hintSystem) {
            Game.hintSystem = {
                currentPuzzle: null,
                hintLevel: 0, // 0 = no hint shown yet, 1-3 = hint levels
                hintsShown: []
            };
        }

        // Define 3-tier hints for each puzzle
        const ThreeTierHints = {
            // PUZZLE: Need clothes
            need_clothes: {
                condition: () => Game.player.hasModernClothes && !Game.player.questProgress.foundClothes,
                hints: [
                    // Level 1: Very vague
                    "💡 Folk stirrar på dig. Något är fel med din klädsel. Kanske finns det någonstans du kan hitta mer passande kläder?",

                    // Level 2: More specific
                    "💡 Operan har personal som använder kostymer för föreställningar. Bakom kulisserna kanske det finns något du kan låna?",

                    // Level 3: Direct
                    "💡 Gå IN till Operan, sedan VÄNSTER till personalkorridoren. Där finns ett omklädningsrum (IN) med tidsenliga kläder. TA KLÄDER, sedan ANVÄND KLÄDER."
                ]
            },

            // PUZZLE: Find Anckarström
            find_anckarstrom: {
                condition: () => Game.player.questProgress.foundClothes && !Game.player.knowledge.includes('anckarstrom_mentioned'),
                hints: [
                    // Level 1: Vague
                    "💡 Du behöver information om konspirationen. Krogar är bra platser där tungorna lossnar. Gamla stan har flera historiska krogar...",

                    // Level 2: More specific
                    "💡 Den Gyldene Freden är känd för sina gäster. En viss skald som gillar brännvin brukar vistas där. Fråga honom om konspiratörer.",

                    // Level 3: Direct
                    "💡 Gå till Den Gyldene Freden. PRATA MED BELLMAN. Sedan FRÅGA BELLMAN OM KONSPIRATION. Han kan nämna viktiga namn."
                ]
            },

            // PUZZLE: Get pistol evidence
            pistol_evidence: {
                condition: () => Game.player.knowledge.includes('anckarstrom_mentioned') && !Game.player.questProgress.foundPistolsmith,
                hints: [
                    // Level 1: Vague
                    "💡 Pistolerna måste ha kommit någonstans ifrån. Kanske finns det en vapensmed i staden som kan ha sett Anckarström?",

                    // Level 2: More specific
                    "💡 Drottninggatan har flera verkstäder. En vapensmed vid namn Wåhlberg kanske kan ha information om pistoler som reparerats nyligen?",

                    // Level 3: Direct
                    "💡 Gå till Drottninggatan, sedan VÄNSTER till Wåhlbergs vapensmedja. PRATA MED WÅHLBERG. FRÅGA WÅHLBERG OM PISTOLER. Han kan ge dig Anckarströms adress."
                ]
            },

            // PUZZLE: Get ball ticket
            ball_ticket: {
                condition: () => Game.player.stats.chapter >= 2 && !Game.player.questProgress.gotTicket,
                hints: [
                    // Level 1: Vague
                    "💡 Du behöver tillträde till maskeradbalen. Kanske kan någon på Operan hjälpa dig få en biljett?",

                    // Level 2: More specific
                    "💡 Adelcrantz på Operan verkar vänlig. Fråga honom om biljett - kanske kan han hjälpa dig om du gör honom en tjänst?",

                    // Level 3: Direct
                    "💡 PRATA MED ADELCRANTZ. FRÅGA ADELCRANTZ OM BILJETT. Han vill ha färg. Gå till Kemistens butik, TA FÄRGBURKAR, GE FÄRG TILL ADELCRANTZ."
                ]
            },

            // PUZZLE: Infiltrate Pechlin
            infiltrate_pechlin: {
                condition: () => Game.player.stats.chapter >= 2 && !Game.player.knowledge.includes('heard_conspiracy'),
                hints: [
                    // Level 1: Vague
                    "💡 Bellman nämnde att Pechlin håller möten på Blasieholmen. Kanske kan du hitta mer konkret information där?",

                    // Level 2: More specific
                    "💡 Pechlins palats ligger på Blasieholmen. Om du smyger in när ingen ser dig kanske du kan avlyssna ett möte?",

                    // Level 3: Direct
                    "💡 Gå till Blasieholmen (från Fredsgatan). GÅ IN till Pechlins palats. GÅ UPP till salongen. Du kommer höra konspiratorerna planera mordet."
                ]
            },

            // PUZZLE: Climax scene
            stop_assassination: {
                condition: () => Game.player.currentRoom === 'opera_ballroom' && !Game.player.questProgress.savedKing,
                hints: [
                    // Level 1: Vague
                    "💡 Tiden är inne. Anckarström håller på att dra sin pistol. Du måste agera - men hur?",

                    // Level 2: More specific
                    "💡 Du kan fysiskt stoppa Anckarström genom att gripa honom, eller varna genom att ropa. Om du har bevis kan vakterna agera snabbare.",

                    // Level 3: Direct
                    "💡 Om du har bevis: ROPA (vakterna kommer gripa honom). Utan bevis: GRIPA ANCKARSTRÖM (du stoppar honom fysiskt). Eller: SKYDDA (offra dig själv)."
                ]
            },

            // PUZZLE: Warn king with evidence
            warn_king: {
                condition: () => Game.player.stats.chapter >= 3 && Game.player.inventory.some(i => ['pistol_list', 'anckarstrom_note', 'dokument'].includes(i)) && !Game.player.questProgress.savedKing,
                hints: [
                    // Level 1: Vague
                    "💡 Du har bevis om konspirationen. Kungen borde se dessa innan balen börjar...",

                    // Level 2: More specific
                    "💡 Kungen äter supé i Drabantsalen innan balen. Om du visar honom bevisen kanske han lyssnar?",

                    // Level 3: Direct
                    "💡 Gå till Drabantsalen. GE BEVIS TILL GUSTAV (eller GE PISTOL_LIST / ANCKARSTROM_NOTE / DOKUMENT TILL GUSTAV). Han kommer tro dig och arrestera konspiratörerna!"
                ]
            }
        };

        // Override hint button to use 3-tier system
        const hintButton = document.getElementById('hint-btn');
        if (hintButton) {
            hintButton.onclick = function() {
                // Find current puzzle
                let currentPuzzle = null;
                for (let [puzzleId, puzzle] of Object.entries(ThreeTierHints)) {
                    if (puzzle.condition()) {
                        currentPuzzle = { id: puzzleId, puzzle: puzzle };
                        break;
                    }
                }

                if (!currentPuzzle) {
                    GameEngine.output(`<div class="narrator">💡 Du verkar vara på rätt spår! Fortsätt utforska och prata med folk.</div>`);
                    return;
                }

                // Check if this is a new puzzle
                if (Game.hintSystem.currentPuzzle !== currentPuzzle.id) {
                    Game.hintSystem.currentPuzzle = currentPuzzle.id;
                    Game.hintSystem.hintLevel = 0;
                }

                // Increment hint level (max 3)
                if (Game.hintSystem.hintLevel < 3) {
                    Game.hintSystem.hintLevel++;
                }

                // Show appropriate hint
                const hint = currentPuzzle.puzzle.hints[Game.hintSystem.hintLevel - 1];
                GameEngine.output(`<div class="narrator">${hint}</div>`);

                // Show progress
                if (Game.hintSystem.hintLevel < 3) {
                    GameEngine.output(`<div class="narrator" style="font-size: 0.9em; opacity: 0.7;"><em>Tryck igen för mer specifik ledtråd (${Game.hintSystem.hintLevel}/3)</em></div>`);
                } else {
                    GameEngine.output(`<div class="narrator" style="font-size: 0.9em; opacity: 0.7;"><em>Det var den mest direkta ledtråden (3/3)</em></div>`);
                }

                // Track for achievements
                Game.player.stats.hintsUsed++;

                // Track which puzzle got hints
                if (!Game.hintSystem.hintsShown.includes(currentPuzzle.id)) {
                    Game.hintSystem.hintsShown.push(currentPuzzle.id);
                }
            };
        }

        // ===== REMOVE CLIMAX INSTRUCTION TEXT =====
        // Rewrite climax scene to be subtle

        if (Rooms && Rooms.opera_ballroom) {
            Rooms.opera_ballroom.description = `Det är midnatt. Balen är i full gång.

Hundratals människor i masker och fantasikostymer dansar, skrattar, viskar. Orkestern spelar den sjätte kontradansen.

Ljuskronorna ovan glittrar. Luften är tjock av parfym, svett och ljusvax.

<span class="important">Kungen</span> är lätt att känna igen trots masken - ordensstjärnorna glittrar på bröstet. Han går arm i arm med von Essen mot scenen, skrattar obesvärat.

Där... där ser du dem. <span class="warning">Män i svarta kappor och vita masker</span>. De rör sig genom folkmassan. Samordnade. Målmedvetna.

En av dem - du känner igen gången, nervositeten - <span class="important">Anckarström</span>.

Hans hand glider in under kappan.

Metall blinkar till i ljuset.

<span class="warning">Tiden saktar ner.</span>`;
        }

        // ===== IMPROVED BELLMAN DIALOGUE =====
        // No explicit topic list - player must figure it out

        if (Characters && Characters.bellman && Characters.bellman.dialogue.topics) {
            // Konspiration topic - more environmental
            Characters.bellman.dialogue.topics.konspiration = `Bellman lutar sig närmare. Andan luktar brännvin.

"Konspiratörer?" Han skrattar lågt. "Kära vän, denna stad SVÄMMAR av missnöjda adelsmän."

Han pekar diskret mot fönstret, åt Blasieholmen.

"General <span class="important">Pechlin</span>... gammal räv. Håller sina... <em>sammankomster</em> där borta. Adliga herrar som talar för lågt och dricker för lite." Han grimiserar. "Inget för mig!"

Han blir allvarlig en sekund.

"Men vill du veta mer... följ pengarna. Följ vapnen. En viss före detta <span class="important">kapten</span> har varit... aktiv på sistone."`;

            // Pechlin topic
            Characters.bellman.dialogue.topics.pechlin = `"Pechlin?" Bellman sänker rösten.

"Gammal general med stora planer. Palats på Blasieholmen - du vet, de vita kolonnerna?"

Han tar en klunk.

"Folk kommer och går där. Sena kvällar. Täta drapier. Men väggar har öron, min vän... <em>om man lyssnar noga</em>."

Han blinkar.`;

            // Song topic - trigger for Gustafs skål
            Characters.bellman.dialogue.topics.sång = `Bellman lyser upp!

"Ah! Du vill höra mig sjunga? Jag har tusentals visor!"

Han tömmer sitt stop.

"Men min strupe är torr, min vän. Ett glas brännvin skulle... inspirera musan..."

<em>Kanske kan du köpa brännvin till honom?</em>`;
        }

        // ===== IDLE TIMEOUT HINT HIGHLIGHTING =====
        // Gently remind inactive players about the hint system

        let idleTimer = null;
        let lastCommandTime = Date.now();

        function resetIdleTimer() {
            // Clear existing timer
            if (idleTimer) {
                clearTimeout(idleTimer);
            }

            // Remove any existing highlight
            const hintBtn = document.getElementById('hint-btn');
            if (hintBtn) {
                hintBtn.classList.remove('pulse-hint');
            }

            // Start new timer (90 seconds of inactivity)
            idleTimer = setTimeout(() => {
                const hintBtn = document.getElementById('hint-btn');
                if (hintBtn && Game.flags.gameStarted) {
                    // Add pulse animation
                    hintBtn.classList.add('pulse-hint');

                    // Remove after 4 seconds
                    setTimeout(() => {
                        hintBtn.classList.remove('pulse-hint');
                    }, 4000);
                }
            }, 90000); // 90 seconds
        }

        // Hook into command processing to reset timer
        if (typeof GameEngine !== 'undefined') {
            const originalProcessCommand = GameEngine.processCommand;

            GameEngine.processCommand = function(input) {
                // Reset idle timer on every command
                resetIdleTimer();

                // Call original command processor
                return originalProcessCommand.call(this, input);
            };
        }

        // Also reset timer on hint button click
        if (hintButton) {
            const originalHintClick = hintButton.onclick;
            hintButton.onclick = function() {
                resetIdleTimer();
                return originalHintClick.call(this);
            };
        }

        // Start the idle timer when game starts
        resetIdleTimer();

        console.log('🎭 Environmental Storytelling & 3-Tier Hints loaded!');
        console.log('⏰ Idle timeout hint system active!');

    }, 800);
});
