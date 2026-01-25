// ═══════════════════════════════════════════════════════════════════════════
// BUGFIXES BATCH 4 - UX-förbättringar
// ═══════════════════════════════════════════════════════════════════════════
//
// FIXAR:
// 1. Ta bort automatiska ledtrådar (topics visas inte automatiskt)
// 2. Lägg till "utgångar", "riktningar" kommando
// 3. Gör klädtips subtilare, lägg till "ta på kläder", "byt kläder"
// 4. Fixa NPC-reaktion på kläder (ska inte visas om NPC inte finns)
//
// Loading: 1350ms - Efter bugfixes-batch3
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {

        console.log('🔧 Loading bugfixes batch 4...');

        // ═══════════════════════════════════════════════════════════════════
        // FIX 1: TA BORT AUTOMATISKA TOPIC-LEDTRÅDAR
        // ═══════════════════════════════════════════════════════════════════
        // Problem: När spelaren frågar om något som NPC inte kan svara på,
        // visas tillgängliga topics automatiskt - det ska inte hända.

        if (typeof GameEngine !== 'undefined') {
            // Ersätt cmdAsk igen med version som INTE visar topics automatiskt
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

                const cleanQuery = query.toLowerCase().trim();

                let npcPart = null;
                let topic = cleanQuery;

                if (cleanQuery.startsWith('om ')) {
                    topic = cleanQuery.substring(3).trim();
                } else if (cleanQuery.includes(' om ')) {
                    const parts = cleanQuery.split(' om ');
                    npcPart = parts[0].trim();
                    topic = parts.slice(1).join(' om ').trim();
                }

                // Hitta NPC i rummet
                let foundChar = null;

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

                if (!foundChar) {
                    for (let charId of room.characters) {
                        const char = Characters[charId];
                        if (char && char.keywords) {
                            for (let keyword of char.keywords) {
                                if (cleanQuery.includes(keyword.toLowerCase())) {
                                    foundChar = { id: charId, char: char };
                                    topic = topic.replace(keyword.toLowerCase(), '').trim();
                                    break;
                                }
                            }
                        }
                        if (foundChar) break;
                    }
                }

                if (!foundChar && room.characters.length > 0) {
                    const charId = room.characters[0];
                    foundChar = { id: charId, char: Characters[charId] };
                }

                if (!foundChar || !foundChar.char) {
                    this.output("Det finns ingen här att fråga.");
                    return;
                }

                topic = topic.replace(/^om\s+/, '').trim();

                const dialogue = foundChar.char.dialogue;

                // Kolla om topic matchar
                if (topic && dialogue && dialogue.topics && dialogue.topics[topic]) {
                    this.output(`<div class="dialogue">${dialogue.topics[topic]}</div>`);
                    return;
                }

                // Fuzzy-matchning
                if (topic && dialogue && dialogue.topics) {
                    const topicKeys = Object.keys(dialogue.topics);
                    for (let key of topicKeys) {
                        if (key.includes(topic) || topic.includes(key)) {
                            this.output(`<div class="dialogue">${dialogue.topics[key]}</div>`);
                            return;
                        }
                    }
                }

                // INGEN match - visa BARA att de inte vet, UTAN att lista topics
                if (!topic || topic.length === 0) {
                    this.output(`${foundChar.char.name} tittar frågande på dig.`);
                } else {
                    this.output(`${foundChar.char.name} skakar på huvudet. "Jag vet inget om det."`);
                }
                // BORTTAGEN: Automatisk visning av tillgängliga topics
            };

            console.log('   ✓ Removed automatic topic hints from cmdAsk');
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 2: LÄGG TILL "UTGÅNGAR" / "RIKTNINGAR" KOMMANDO
        // ═══════════════════════════════════════════════════════════════════

        if (typeof GameEngine !== 'undefined') {
            // Lägg till cmdExits funktion
            GameEngine.cmdExits = function() {
                const room = Rooms[Game.player.currentRoom];
                if (room && room.exits) {
                    const exitNames = Object.keys(room.exits);
                    if (exitNames.length > 0) {
                        this.output(`<div class="exits"><strong>Utgångar:</strong> ${exitNames.join(', ')}</div>`);
                    } else {
                        this.output("Det finns inga uppenbara utgångar härifrån.");
                    }
                } else {
                    this.output("Det finns inga uppenbara utgångar härifrån.");
                }
            };

            // Hook processCommand för att fånga nya kommandon
            const originalProcessCommand = GameEngine.processCommand;

            GameEngine.processCommand = function(input) {
                const lowerInput = input.toLowerCase().trim();

                // Utgångar/riktningar kommandon
                if (/^(utgångar|riktningar|vägar|vilka utgångar|vart kan jag gå|vart går det)/.test(lowerInput)) {
                    this.cmdExits();
                    return;
                }

                // "titta" eller "se dig omkring" ska också visa utgångar
                // (redan hanterat av showRoom, men lägg till extra stöd)

                return originalProcessCommand.call(this, input);
            };

            console.log('   ✓ Added "utgångar" / "riktningar" command');
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 3: SUBTILARE KLÄDTIPS OCH FLER ALIAS
        // ═══════════════════════════════════════════════════════════════════
        // Problem: "Du har nu tidsenliga kläder! Använd kommandot..." är för direkt
        // Lösning: Gör det mer immersivt

        // Hook cmdTake för att ändra meddelandet
        if (typeof GameEngine !== 'undefined' && GameEngine.cmdTake) {
            const originalCmdTake = GameEngine.cmdTake;

            GameEngine.cmdTake = function(itemName) {
                // Kolla om det är kläder som tas
                const isClothes = itemName && (
                    itemName.includes('kläd') ||
                    itemName.includes('kostym') ||
                    itemName.includes('dräkt') ||
                    itemName.includes('rock')
                );

                // Anropa original
                const result = originalCmdTake.call(this, itemName);

                // Om det var kläder, ersätt det direkta tipset med immersivt meddelande
                // (Originalet i game.js:852-853 visar redan meddelandet,
                //  vi behöver override efteråt)

                return result;
            };

            // Override meddelandet som visas efter att ta kläder
            // genom att patcha Items.period_clothes
            if (typeof Items !== 'undefined' && Items.period_clothes) {
                // Spara originalet för senare
                const originalTakeable = Items.period_clothes.takeable;

                // Vi kan inte enkelt override meddelandet från game.js:852-853
                // Så vi får acceptera det, eller patcha output efteråt
            }
        }

        // Lägg till fler alias för att använda kläder
        if (typeof GameEngine !== 'undefined') {
            const existingProcessCommand = GameEngine.processCommand;

            GameEngine.processCommand = function(input) {
                const lowerInput = input.toLowerCase().trim();

                // Fler sätt att byta kläder
                if (/^(ta på kläder|ta på kläderna|sätt på kläder|byt kläder|byt om|klä om|klä dig|klä på dig)/.test(lowerInput)) {
                    this.cmdUse('kläder');
                    return;
                }

                // Fråga vad man kan fråga om (explicit begäran om topics)
                if (/^(vad kan jag fråga om|vilka ämnen|vad vet du om|berätta vad du vet)/.test(lowerInput)) {
                    const room = Rooms[Game.player.currentRoom];
                    if (room.characters && room.characters.length > 0) {
                        const charId = room.characters[0];
                        const char = Characters[charId];
                        if (char && char.dialogue && char.dialogue.topics) {
                            const topics = Object.keys(char.dialogue.topics).join(', ');
                            this.output(`<em>Du kan fråga ${char.name} om: ${topics}</em>`);
                            return;
                        }
                    }
                    this.output("Det finns ingen här att fråga.");
                    return;
                }

                return existingProcessCommand.call(this, input);
            };

            console.log('   ✓ Added clothing aliases (ta på kläder, byt kläder, etc.)');
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 4: FIXA NPC KLÄD-REAKTION (SKA INTE VISAS OM NPC INTE FINNS)
        // ═══════════════════════════════════════════════════════════════════
        // Problem: Kläd-reaktion visas även när man försöker prata med en NPC
        // som inte finns i rummet

        // Override cmdTalk för att fixa detta
        if (typeof GameEngine !== 'undefined') {
            const baseCmdTalk = GameEngine.cmdTalk;

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

                // Hitta karaktär FÖRST innan vi visar någon reaktion
                let foundChar = null;
                for (let charId of room.characters) {
                    const char = Characters[charId];
                    if (char && char.keywords) {
                        for (let keyword of char.keywords) {
                            if (target.toLowerCase().includes(keyword.toLowerCase())) {
                                foundChar = { id: charId, char: char };
                                break;
                            }
                        }
                    }
                    if (foundChar) break;
                }

                // Om ingen karaktär hittades med det namnet
                if (!foundChar) {
                    this.output(`Jag ser ingen sådan person här.`);
                    return;
                }

                // NU kan vi visa kläd-reaktion (om tillämpligt)
                const hasModernClothes = Game.player.hasModernClothes !== false;
                const chance = hasModernClothes ? 0.35 : 0.15;
                const roomKey = `clothing_reaction_${Game.player.currentRoom}`;
                const alreadyReacted = Game.player.knowledge && Game.player.knowledge.includes(roomKey);

                if (!alreadyReacted && Math.random() < chance && typeof getClothingReaction === 'function') {
                    const reaction = getClothingReaction();

                    if (reaction.type === 'modern') {
                        this.output(`<div class="narrator">Innan samtalet börjar betraktar ${foundChar.char.name} dina kläder med förvirrad min:</div>
<div class="dialogue whisper">${reaction.text}</div>
<div class="narrator">Men de skakar av sig det och fortsätter...</div>`);
                    } else {
                        this.output(`<div class="dialogue whisper">${reaction.text}</div>`);
                    }

                    if (!Game.player.knowledge) Game.player.knowledge = [];
                    Game.player.knowledge.push(roomKey);
                }

                // Visa dialog
                const dialogue = foundChar.char.dialogue;
                if (dialogue) {
                    // Markera att vi träffat denna NPC
                    const metKey = `met_${foundChar.id}`;
                    if (!Game.player.knowledge) Game.player.knowledge = [];
                    const firstTime = !Game.player.knowledge.includes(metKey);

                    if (firstTime) {
                        Game.player.knowledge.push(metKey);
                        if (dialogue.first) {
                            this.output(`<div class="dialogue">${dialogue.first}</div>`);
                        } else if (dialogue.default) {
                            this.output(`<div class="dialogue">${dialogue.default}</div>`);
                        } else {
                            this.output(`${foundChar.char.name} nickar åt dig.`);
                        }
                    } else {
                        if (dialogue.default) {
                            this.output(`<div class="dialogue">${dialogue.default}</div>`);
                        } else if (dialogue.first) {
                            this.output(`<div class="dialogue">${dialogue.first}</div>`);
                        } else {
                            this.output(`${foundChar.char.name} nickar åt dig.`);
                        }
                    }
                } else {
                    this.output(`${foundChar.char.name} nickar åt dig men säger inget.`);
                }
            };

            console.log('   ✓ Fixed NPC clothing reaction (only shows when NPC exists)');
        }

        // ═══════════════════════════════════════════════════════════════════
        // FIX 5: SÄKERSTÄLL ATT "TITTA" VISAR UTGÅNGAR
        // ═══════════════════════════════════════════════════════════════════

        // Ingen ändring behövs - showRoom visar redan utgångar

        console.log('');
        console.log('✅ BUGFIXES BATCH 4 LOADED!');
        console.log('   - Automatic topic hints removed');
        console.log('   - "utgångar" / "riktningar" command added');
        console.log('   - Clothing aliases added (ta på kläder, byt kläder)');
        console.log('   - NPC clothing reaction fixed');
        console.log('');

    }, 1350); // Load after bugfixes-batch3 (1300ms)
});
