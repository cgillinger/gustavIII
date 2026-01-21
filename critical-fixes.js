// ═══════════════════════════════════════════════════════════════════════════
// CRITICAL FIXES - Riktningar, Ledtrådar, Graceful Fallbacks
// ═══════════════════════════════════════════════════════════════════════════
//
// FIXAR:
// 1. Riktningar fungerar inte ("norr" → "Jag förstår inte det kommandot")
// 2. Dubbla ledtrådssystem (game.js + environmental-storytelling.js)
// 3. "använd kläder" → undefined (saknar graceful fallback)
// 4. Ledtrådar visas i rumsbeskrivningar (💡 i löpande text)
// 5. NPCs utan graceful fallback när man pratar med dem
//
// Loading: 1050ms - EFTER alla andra system
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {

        console.log('🔧 Loading critical fixes...');

        // ═══════════════════════════════════════════════════════════════════
        // FIX 1: RIKTNINGAR MÅSTE FUNGERA
        // ═══════════════════════════════════════════════════════════════════
        // Problem: "norr" parsas som verb='norr' men processCommand har ingen case för det
        // Lösning: Wrap processCommand för att detektera riktningar och anropa cmdGo

        if (typeof GameEngine !== 'undefined') {
            const originalProcessCommand = GameEngine.processCommand;

            // Direction detection map
            const AllDirections = ['norr', 'nord', 'n', 'norrut',
                                   'syd', 'söder', 's', 'söderut',
                                   'öster', 'öst', 'ö', 'österut',
                                   'väster', 'väst', 'v', 'västerut',
                                   'in', 'ut', 'upp', 'ner', 'ned',
                                   'vänster', 'höger', 'fram'];

            GameEngine.processCommand = function(input) {
                if (!input.trim()) return;

                const parsed = Parser.parse(input);
                const verb = parsed.verb;

                // Check if verb is a direction
                if (AllDirections.includes(verb)) {
                    // It's a direction! Call cmdGo with the direction
                    this.cmdGo(verb);
                    return;
                }

                // Not a direction - call original
                originalProcessCommand.call(this, input);
            };
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 2: DUBBLA LEDTRÅDSSYSTEM
        // ═══════════════════════════════════════════════════════════════════
        // Problem: game.js Hints.getHint() OCH environmental-storytelling.js båda körs
        // Lösning: Override Hints.getHint() att INTE returnera gamla ledtrådar

        if (typeof Hints !== 'undefined') {
            Hints.getHint = function() {
                // Låt environmental-storytelling.js hantera allt
                // Detta förhindrar dubbla ledtrådar
                return null; // Return nothing - environmental-storytelling har redan kört
            };
        }

        // Override hint button click i game.js
        const hintBtn = document.getElementById('hint-btn');
        if (hintBtn) {
            // Remove old listener
            const newHintBtn = hintBtn.cloneNode(true);
            hintBtn.parentNode.replaceChild(newHintBtn, hintBtn);

            // environmental-storytelling.js har redan lagt till sin onClick
            // men vi måste se till att den gamla från game.js inte körs
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 3: GRACEFUL FALLBACK FÖR "ANVÄND"
        // ═══════════════════════════════════════════════════════════════════
        // Problem: "använd kläder" → undefined
        // Lösning: Wrap cmdUse för bättre felhantering

        if (typeof GameEngine !== 'undefined' && GameEngine.cmdUse) {
            const originalCmdUse = GameEngine.cmdUse;

            GameEngine.cmdUse = function(item) {
                if (!item) {
                    this.output("Använd vad?");
                    return;
                }

                // Check if trying to use clothes/kläder
                if (item.includes('kläd')) {
                    const hasClothes = Game.player.inventory.includes('tidsenliga_kläder') ||
                                      Game.player.inventory.includes('period_clothes');

                    if (hasClothes) {
                        // Already wearing them
                        this.output("Du har redan tidsenliga kläder på dig.");
                        return;
                    } else if (!Game.player.hasModernClothes) {
                        this.output("Du bär redan tidsenliga kläder.");
                        return;
                    } else {
                        this.output("Du har inga andra kläder att byta till ännu. Kanske kan du hitta något på Operan?");
                        return;
                    }
                }

                // Try original
                try {
                    const result = originalCmdUse.call(this, item);

                    // Check if result is undefined - that means item not useable
                    if (result === undefined) {
                        // Check if item exists in inventory
                        const hasItem = Game.player.inventory.some(i => i.toLowerCase().includes(item.toLowerCase()));

                        if (hasItem) {
                            this.output(`Du kan inte använda ${item} just nu.`);
                        } else {
                            this.output(`Du har inget som heter "${item}".`);
                        }
                    }
                } catch (e) {
                    // Catch any errors
                    this.output(`Du kan inte använda ${item} just nu.`);
                    console.error('cmdUse error:', e);
                }
            };
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 4: GRACEFUL FALLBACK FÖR NPC-INTERAKTION
        // ═══════════════════════════════════════════════════════════════════
        // Problem: "prata med vakt" kan ge undefined eller ingen respons
        // Lösning: Lägg till generiska svar för NPCs utan dialogue

        if (typeof GameEngine !== 'undefined' && GameEngine.cmdTalk) {
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
                    if (char && char.keywords && char.keywords.some(k => target.includes(k))) {
                        foundChar = { id: charId, char: char };
                        break;
                    }
                }

                if (!foundChar) {
                    // Check if they're trying to talk to generic NPCs mentioned in description
                    const genericNPCs = {
                        'vakt': 'Vakten reagerar inte när du försöker prata med honom. Han står stilla och övervakar folkmassan.',
                        'guard': 'Vakten reagerar inte när du försöker prata med honom. Han står stilla och övervakar folkmassan.',
                        'folk': 'Folket omkring dig går sina egna vägar, upptagna med sina ärenden.',
                        'människa': 'De verkar inte intresserade av att prata med en främling.',
                        'kvinna': 'Hon nickar artigt men fortsätter sin väg.',
                        'man': 'Han mumlar något ohörbart och går vidare.',
                        'barn': 'Barnen springer iväg skrattande.',
                        'adelsman': 'Adelsmannen ser på dig med överlägsen blick och vänder sig bort.',
                        'soldat': 'Soldaten ger dig en kort nick men säger inget.',
                        'tjänare': 'Tjänaren gör en hastig bugning och fortsätter sitt arbete.',
                        'arbetare': 'Arbetaren svarar kort och återgår till sitt arbete.'
                    };

                    for (let [key, response] of Object.entries(genericNPCs)) {
                        if (target.includes(key)) {
                            this.output(response);
                            return;
                        }
                    }

                    this.output("Jag ser ingen sådan person här.");
                    return;
                }

                // Try original
                try {
                    originalCmdTalk.call(this, target);
                } catch (e) {
                    // If dialogue fails, give graceful fallback
                    this.output(`${foundChar.char.name} verkar inte vilja prata just nu.`);
                    console.error('cmdTalk error:', e);
                }
            };
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 5: TA BORT 💡 FRÅN RUMSBESKRIVNINGAR
        // ═══════════════════════════════════════════════════════════════════
        // Problem: Ledtrådar visas i löpande text i rummen
        // Lösning: Wrap showRoom för att ta bort 💡-ikoner från beskrivningar

        if (typeof GameEngine !== 'undefined' && GameEngine.showRoom) {
            const originalShowRoom = GameEngine.showRoom;

            GameEngine.showRoom = function(roomId) {
                // Call original first
                originalShowRoom.call(this, roomId);

                // Now remove any 💡 hint icons that appeared in the description
                // These should ONLY appear when player clicks hint button
                const output = document.getElementById('output');
                if (output) {
                    const lastElements = Array.from(output.children).slice(-5); // Check last 5 elements

                    lastElements.forEach(elem => {
                        if (elem.innerHTML && elem.innerHTML.includes('💡')) {
                            // This is a room description with embedded hints - remove the hints
                            elem.innerHTML = elem.innerHTML.replace(/💡[^<]*/g, '').trim();
                        }
                    });
                }
            };
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 6: FÖRBÄTTRA FELMEDDELANDEN
        // ═══════════════════════════════════════════════════════════════════
        // Ge bättre felmeddelanden generellt

        if (typeof GameEngine !== 'undefined' && GameEngine.cmdExamine) {
            const originalCmdExamine = GameEngine.cmdExamine;

            GameEngine.cmdExamine = function(target) {
                if (!target) {
                    this.output("Undersök vad?");
                    return;
                }

                try {
                    originalCmdExamine.call(this, target);
                } catch (e) {
                    this.output(`Du ser inget speciellt med ${target}.`);
                    console.error('cmdExamine error:', e);
                }
            };
        }

        if (typeof GameEngine !== 'undefined' && GameEngine.cmdTake) {
            const originalCmdTake = GameEngine.cmdTake;

            GameEngine.cmdTake = function(item) {
                if (!item) {
                    this.output("Ta vad?");
                    return;
                }

                try {
                    originalCmdTake.call(this, item);
                } catch (e) {
                    this.output(`Du kan inte ta ${item}.`);
                    console.error('cmdTake error:', e);
                }
            };
        }

        console.log('✅ Critical fixes loaded!');
        console.log('   - All directions now work (norr, syd, öster, väster, etc)');
        console.log('   - Hint system unified (no duplicates)');
        console.log('   - Graceful fallbacks for all commands');
        console.log('   - No hints in room descriptions');

    }, 1050); // Load AFTER everything else (direction-fix is 1000ms)
});
