// ═══════════════════════════════════════════════════════════════════════════
// BUGFIXES BATCH 3 - FRÅGA-kommando, klädflaggor, ledtrådsknappen
// ═══════════════════════════════════════════════════════════════════════════
//
// FIXAR:
// 1. FRÅGA-kommandot: "om" tas bort från topic ("fråga om kungen" → topic "kungen")
// 2. Klädflaggor: hasModernClothes och foundClothes sätts korrekt
// 3. Ledtrådsknappen: Fungerar konsekvent
//
// Loading: 1300ms - Efter bugfixes-batch2
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {

        console.log('🔧 Loading bugfixes batch 3...');

        // ═══════════════════════════════════════════════════════════════════
        // FIX 1: FRÅGA-KOMMANDOT - STRIP "OM" FRÅN TOPIC
        // ═══════════════════════════════════════════════════════════════════
        // Problem: "fråga om kungen" → topic blir "om kungen" istället för "kungen"
        // Problem: "fråga karolin om krig" → topic blir "om krig" istället för "krig"

        if (typeof GameEngine !== 'undefined') {
            // Ersätt cmdAsk helt för att hantera "om" korrekt
            GameEngine.cmdAsk = function(query) {
                if (!query) {
                    this.output("Fråga vem om vad?");
                    return;
                }

                const room = Rooms[Game.player.currentRoom];
                if (!room.characters || room.characters.length === 0) {
                    this.output("Det finns ingen här att fråga.");
                    return;
                }

                // Rensa query och splitta på "om"
                const cleanQuery = query.toLowerCase().trim();

                // Hantera olika format:
                // "om kungen" → topic = "kungen"
                // "karolin om krig" → npc = "karolin", topic = "krig"
                // "karolinen om mat" → npc = "karolinen", topic = "mat"

                let npcPart = null;
                let topic = cleanQuery;

                // Kolla om query börjar med "om " (inget NPC-namn)
                if (cleanQuery.startsWith('om ')) {
                    topic = cleanQuery.substring(3).trim(); // Ta bort "om " från början
                } else if (cleanQuery.includes(' om ')) {
                    // Format: "npc om topic"
                    const parts = cleanQuery.split(' om ');
                    npcPart = parts[0].trim();
                    topic = parts.slice(1).join(' om ').trim(); // Allt efter första "om"
                }

                // Hitta NPC i rummet
                let foundChar = null;

                // Om vi har en NPC-del, sök efter den specifikt
                if (npcPart) {
                    for (let charId of room.characters) {
                        const char = Characters[charId];
                        if (char && char.keywords) {
                            for (let keyword of char.keywords) {
                                if (npcPart.includes(keyword.toLowerCase())) {
                                    foundChar = { id: charId, char: char };
                                    break;
                                }
                            }
                        }
                        if (foundChar) break;
                    }
                }

                // Om ingen specifik NPC hittades, sök i hela query
                if (!foundChar) {
                    for (let charId of room.characters) {
                        const char = Characters[charId];
                        if (char && char.keywords) {
                            for (let keyword of char.keywords) {
                                if (cleanQuery.includes(keyword.toLowerCase())) {
                                    foundChar = { id: charId, char: char };
                                    // Ta bort keyword från topic
                                    topic = topic.replace(keyword.toLowerCase(), '').trim();
                                    break;
                                }
                            }
                        }
                        if (foundChar) break;
                    }
                }

                // Om fortfarande ingen NPC, använd första i rummet
                if (!foundChar && room.characters.length > 0) {
                    const charId = room.characters[0];
                    foundChar = { id: charId, char: Characters[charId] };
                }

                if (!foundChar || !foundChar.char) {
                    this.output("Det finns ingen här att fråga.");
                    return;
                }

                // Rensa topic från extra mellanslag och "om" om det finns kvar
                topic = topic.replace(/^om\s+/, '').trim();

                // Kolla om det finns topics för denna NPC
                const dialogue = foundChar.char.dialogue;

                if (topic && dialogue && dialogue.topics && dialogue.topics[topic]) {
                    this.output(`<div class="dialogue">${dialogue.topics[topic]}</div>`);
                    return;
                }

                // Fuzzy-matchning: Kolla om topic delvis matchar något ämne
                if (topic && dialogue && dialogue.topics) {
                    const topicKeys = Object.keys(dialogue.topics);
                    for (let key of topicKeys) {
                        if (key.includes(topic) || topic.includes(key)) {
                            this.output(`<div class="dialogue">${dialogue.topics[key]}</div>`);
                            return;
                        }
                    }
                }

                // Ingen match - visa tillgängliga ämnen
                if (!topic || topic.length === 0) {
                    this.output(`Vad vill du fråga ${foundChar.char.name} om?`);
                } else {
                    this.output(`${foundChar.char.name} har inget att säga om "${topic}".`);
                }

                if (dialogue && dialogue.topics) {
                    const availableTopics = Object.keys(dialogue.topics).join(', ');
                    if (availableTopics) {
                        this.output(`<em>Du kan fråga om: ${availableTopics}</em>`);
                    }
                }
            };

            console.log('   ✓ Fixed cmdAsk - "om" now properly stripped from topic');
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 2: KLÄDFLAGGOR - hasModernClothes OCH foundClothes
        // ═══════════════════════════════════════════════════════════════════
        // Problem: critical-fixes.js interceptar "använd kläder" för tidigt
        // och sätter aldrig flaggorna korrekt.

        if (typeof GameEngine !== 'undefined') {
            // Ersätt cmdUse för att korrekt hantera kläder
            const existingCmdUse = GameEngine.cmdUse;

            GameEngine.cmdUse = function(itemName) {
                if (!itemName) {
                    this.output("Använd vad?");
                    return;
                }

                // Kolla om det handlar om kläder
                if (itemName.includes('kläd') || itemName.includes('kostym') || itemName === 'byt om') {
                    // Kolla om spelaren REDAN BÄR tidsenliga kläder
                    if (Game.player.hasModernClothes === false) {
                        this.output("Du bär redan tidsenliga kläder.");
                        return;
                    }

                    // Kolla om spelaren HAR kläder i inventariet
                    const hasClothes = Game.player.inventory.includes('period_clothes') ||
                                      Game.player.inventory.includes('tidsenliga_kläder');

                    if (!hasClothes) {
                        this.output("Du har inga andra kläder att byta till ännu. Kanske kan du hitta något på Operan?");
                        return;
                    }

                    // Byt kläder - SÄTT FLAGGORNA!
                    Game.player.hasModernClothes = false;
                    Game.player.hasPeriodClothes = true;
                    Game.player.questProgress.foundClothes = true;

                    // Visa beskrivning
                    if (typeof Items !== 'undefined' && Items.period_clothes && Items.period_clothes.use) {
                        const useResult = Items.period_clothes.use();
                        this.output(useResult);
                    } else {
                        this.output(`<div class="success">Du byter snabbt om till de tidsenliga kläderna. Den pastellblå sidenrocken sitter perfekt, och med den broderade västen, knäbyxorna och den trekantiga hatten ser du ut som en äkta 1700-talsgentleman.

<strong>Du smälter nu in perfekt i 1792!</strong></div>`);
                    }

                    // Achievement
                    if (typeof this.unlockAchievement === 'function') {
                        this.unlockAchievement('blend_in');
                    }

                    // Update progress
                    if (typeof this.updateProgress === 'function') {
                        this.updateProgress(15);
                    }

                    console.log('🎭 Clothes changed! hasModernClothes:', Game.player.hasModernClothes,
                               'foundClothes:', Game.player.questProgress.foundClothes);

                    return;
                }

                // För andra saker, anropa existerande funktion
                // Men skippa om det är critical-fixes wrappern som kollar kläder igen
                if (existingCmdUse) {
                    // Kolla om existingCmdUse är critical-fixes wrappern
                    // Gå direkt till game.js originalfunktion om möjligt
                    try {
                        return existingCmdUse.call(this, itemName);
                    } catch (e) {
                        console.error('cmdUse error:', e);
                        this.output(`Du kan inte använda ${itemName} just nu.`);
                    }
                }
            };

            console.log('   ✓ Fixed cmdUse - clothing flags now set correctly');
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 3: LEDTRÅDSKNAPPEN - ROBUST IMPLEMENTATION
        // ═══════════════════════════════════════════════════════════════════

        // Skapa en robust getContextualHint funktion
        window.getContextualHint = function() {
            if (typeof Game === 'undefined' || !Game.player) {
                return "Utforska omgivningen och prata med folk!";
            }

            const quest = Game.player.questProgress || {};
            const room = Game.player.currentRoom;
            const hasModernClothes = Game.player.hasModernClothes !== false;

            // Kläder-hints
            if (hasModernClothes && !quest.foundClothes) {
                if (room === 'costume_room') {
                    return "TA KLÄDER för att ta de tidsenliga kläderna, sedan ANVÄND KLÄDER för att byta om.";
                }
                if (room === 'opera_staff') {
                    return "Gå VÄNSTER för att komma till omklädningsrummet där det finns kläder.";
                }
                if (room === 'opera_entrance') {
                    return "Gå IN för att komma till personalkorridoren där du kanske kan hitta kläder.";
                }
                return "Du sticker ut i dina moderna kläder. Gå till Operan (NORR från Norrmalmstorg) och hitta omklädningsrummet.";
            }

            // Quest-hints baserat på progress
            if (!quest.learnedAboutConspiracy) {
                if (room === 'gyldene_freden') {
                    return "Prata med folket här! Prova PRATA MED ADELSMAN eller LYSSNA på samtalen.";
                }
                return "Nu när du smälter in, besök Den Gyldene Freden i Gamla stan för att höra rykten. Gå SÖDER till Norrbro, sedan SÖDER till Slottet, och VÄSTER till Stortorget.";
            }

            if (!quest.hasEvidence) {
                return "Du behöver bevis! Utforska Wåhlbergs vapensmedja på Drottninggatan (NORR från Norrmalmstorg) eller Pechlins palats på Blasieholmen.";
            }

            if (!quest.warnedKing) {
                return "Du har bevis! Hitta kungen och varna honom. Han borde vara på slottet eller i Operans loger.";
            }

            return "Fortsätt utforska och följ ledtrådarna!";
        };

        // Sätt upp ledtrådsknappen på nytt
        const hintBtn = document.getElementById('hint-btn');
        if (hintBtn) {
            // Ta bort alla event listeners genom att klona
            const newHintBtn = hintBtn.cloneNode(true);
            hintBtn.parentNode.replaceChild(newHintBtn, hintBtn);

            // Lägg till ny click handler
            newHintBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                console.log('💡 Hint button clicked (batch3)');

                const hint = window.getContextualHint();

                if (typeof GameEngine !== 'undefined' && typeof GameEngine.output === 'function') {
                    GameEngine.output(`<div class="hint">💡 <strong>Ledtråd:</strong> ${hint}</div>`);
                } else {
                    // Fallback: skriv direkt till output
                    const output = document.getElementById('output');
                    if (output) {
                        const hintDiv = document.createElement('div');
                        hintDiv.className = 'hint';
                        hintDiv.innerHTML = `💡 <strong>Ledtråd:</strong> ${hint}`;
                        output.appendChild(hintDiv);
                        output.scrollTop = output.scrollHeight;
                    }
                }
            });

            console.log('   ✓ Fixed hint button with robust click handler');
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 4: PROCESSCOMMAND - HANTERA "FRÅGA OM X" DIREKT
        // ═══════════════════════════════════════════════════════════════════

        if (typeof GameEngine !== 'undefined' && GameEngine.processCommand) {
            const originalProcessCommand = GameEngine.processCommand;

            GameEngine.processCommand = function(input) {
                const lowerInput = input.toLowerCase().trim();

                // Fånga "fråga om X" direkt (utan NPC-namn)
                const askAboutMatch = lowerInput.match(/^fråga\s+om\s+(.+)$/);
                if (askAboutMatch) {
                    const topic = askAboutMatch[1].trim();
                    this.cmdAsk(topic);
                    return;
                }

                // Fånga "fråga X om Y"
                const askNpcMatch = lowerInput.match(/^fråga\s+(.+?)\s+om\s+(.+)$/);
                if (askNpcMatch) {
                    const npc = askNpcMatch[1].trim();
                    const topic = askNpcMatch[2].trim();
                    this.cmdAsk(`${npc} om ${topic}`);
                    return;
                }

                // Annars kör original
                return originalProcessCommand.call(this, input);
            };

            console.log('   ✓ Fixed processCommand to properly route FRÅGA commands');
        }

        console.log('');
        console.log('✅ BUGFIXES BATCH 3 LOADED!');
        console.log('   - FRÅGA command now properly strips "om" from topic');
        console.log('   - Clothing flags (hasModernClothes, foundClothes) now set correctly');
        console.log('   - Hint button works with robust implementation');
        console.log('');

    }, 1300); // Load after bugfixes-batch2 (1250ms)
});
