// ═══════════════════════════════════════════════════════════════════════════
// BUGFIXES BATCH 6 - Debug-analys fixar
// ═══════════════════════════════════════════════════════════════════════════
//
// Baserat på debug-sessionen gustav3-debug-2026-01-27T09-59-39.json
// och analys-rapporten gustavIII_debug_analysis_report_sv_27_jan.txt
//
// FIXAR:
// P0-1: Adelcrantz klädkommentar - ska BARA visas om hasModernClothes=true
// P0-2: "byt om" feedback - tydligt meddelande att bytet lyckades
// P0-3: Dubbeldialog (dedup) - förhindra att kläd-reaktion visas om NPC-dialog nämner kläder
// P1-1: Parser: fånga "Vad vet du?" och liknande
// P1-2: Topic-listning när NPC inte känner till ämne
// P2-1: Synka knowledge och questProgress
//
// Loading: 1600ms - Efter bugfixes-batch5
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {

        console.log('🔧 Loading bugfixes batch 6 (debug analysis fixes)...');

        // ═══════════════════════════════════════════════════════════════════
        // P0-1: ADELCRANTZ KLÄDKOMMENTAR - VILLKORA PÅ hasModernClothes
        // ═══════════════════════════════════════════════════════════════════
        // Problem: Adelcrantz säger "teater experiment" om kläderna även när
        // spelaren redan har tidsenliga kläder (hasModernClothes=false)

        if (typeof Characters !== 'undefined' && Characters.adelcrantz) {
            Characters.adelcrantz.dialogue = Characters.adelcrantz.dialogue || {};

            // Gör first-dialogen dynamisk baserat på kläder
            Object.defineProperty(Characters.adelcrantz.dialogue, 'first', {
                get: function() {
                    const hasModernClothes = Game.player.hasModernClothes !== false;

                    if (hasModernClothes) {
                        // Spelaren har moderna kläder - kommentera dem
                        return `Den äldre mannen ser upp från sina ritningar och studerar dig med höjda ögonbryn.

"Nå men... vilka märkliga kläder ni bär! Är det från någon teaterproduktion? Eller kanske från utlandet?"

Han reser sig och gör en lätt bugning.

"Förlåt min nyfikenhet. Jag är Carl Fredrik Adelcrantz, hovarkitekt. Jag ritade detta operahus."

Han ler, men hans blick blir snart allvarlig.

"Spännande tider vi lever i. <em>Kungen</em> planerar en stor <em>maskeradbal</em> på lördag."

Han sänker rösten.

"Jag har hört oroande viskningar om <em>konspirationer</em>. Men sådant pratar man inte om öppet. Vad för er hit?"`;
                    } else {
                        // Spelaren har tidsenliga kläder - ingen klädkommentar
                        return `Den äldre mannen ser upp från sina ritningar och ler vänligt.

"Välkommen till min verkstad, unge herre!"

Han reser sig och gör en elegant bugning.

"Jag är Carl Fredrik Adelcrantz, hovarkitekt. Jag ritade detta operahus."

Han tittar på din sidenrock med uppskattning.

"Fin dräkt ni bär - pastellblått är mycket modernt i år."

Hans blick blir snart allvarlig.

"Spännande tider vi lever i. <em>Kungen</em> planerar en stor <em>maskeradbal</em> på lördag."

Han sänker rösten.

"Jag har hört oroande viskningar om <em>konspirationer</em>. Men sådant pratar man inte om öppet. Vad för er hit?"`;
                    }
                },
                configurable: true
            });

            console.log('   ✓ P0-1: Adelcrantz dialogue now conditional on hasModernClothes');
        }

        // ═══════════════════════════════════════════════════════════════════
        // P0-2: "BYT OM" SUCCESS-FEEDBACK
        // ═══════════════════════════════════════════════════════════════════
        // Problem: "byt om" ger inget synligt meddelande att bytet lyckades

        if (typeof GameEngine !== 'undefined') {
            const existingCmdUse = GameEngine.cmdUse;

            GameEngine.cmdUse = function(item) {
                const lowerItem = (item || '').toLowerCase();

                // Specialhantering för kläd-byte
                if (lowerItem.includes('kläd')) {
                    // Kontrollera om spelaren har kläderna
                    const hasClothes = Game.player.inventory.some(i =>
                        i === 'period_clothes' ||
                        i === 'tidsenliga_kläder' ||
                        (typeof Items !== 'undefined' && Items[i] &&
                         Items[i].name && Items[i].name.toLowerCase().includes('kläd'))
                    );

                    if (!hasClothes) {
                        this.output(`<div class="warning">Du har inga kläder att byta till.</div>`);
                        return;
                    }

                    // Kontrollera om redan bytt
                    if (Game.player.hasModernClothes === false) {
                        this.output(`<div class="narrator">Du bär redan tidsenliga kläder från 1700-talet.</div>`);
                        return;
                    }

                    // Utför bytet
                    Game.player.hasModernClothes = false;
                    Game.player.questProgress.foundClothes = true;

                    // Visa tydlig feedback
                    this.output(`<div class="success">Du byter om med fumliga händer.</div>

<div class="narrator">Kläderna är åtsittande och obekväma - den korsettliknande västen pressar, de tajta knäbyxorna begränsar rörelsefriheten, och silkesstrumporna vill glida ner.

Men när du ser dig i spegeln ser du en gentleman från 1700-talet titta tillbaka.</div>

<div class="important">Nu kan du röra dig fritt utan att väcka uppmärksamhet!</div>`);

                    // Lägg till achievement om det finns
                    if (Game.player.stats && Game.player.stats.achievements) {
                        if (!Game.player.stats.achievements.includes('changed_clothes')) {
                            Game.player.stats.achievements.push('changed_clothes');
                        }
                    }

                    return;
                }

                // Annars använd original cmdUse
                if (existingCmdUse) {
                    return existingCmdUse.call(this, item);
                }
            };

            console.log('   ✓ P0-2: "byt om" now gives clear success feedback');
        }

        // ═══════════════════════════════════════════════════════════════════
        // P0-3: DUBBELDIALOG - DEDUP KLÄD-REAKTIONER
        // ═══════════════════════════════════════════════════════════════════
        // Problem: Både NPC-dialog OCH clothingReaction kan kommentera kläder

        // Lista över NPCs vars first-dialog redan nämner kläder
        const npcsWithClothingInDialogue = [
            'adelcrantz',   // Nämner kläder i first-dialog
            'portier',      // Har speciell kläd-hantering
            'scenarbetare', // Målaren kommenterar kläder
            'vonEssen'      // Nämner "märklig klädsel"
        ];

        // Override getClothingReaction för att returnera null för dessa NPCs
        if (typeof window.getClothingReaction === 'function') {
            const originalGetClothingReaction = window.getClothingReaction;

            window.getClothingReaction = function(npcId) {
                // Om NPC redan har klädkommentar i dialog, skippa
                if (npcId && npcsWithClothingInDialogue.includes(npcId)) {
                    return null;
                }
                return originalGetClothingReaction();
            };

            console.log('   ✓ P0-3: Clothing reactions deduplicated for NPCs with clothing dialogue');
        }

        // Patcha cmdTalk för att skicka med NPC-id till getClothingReaction
        if (typeof GameEngine !== 'undefined' && GameEngine.cmdTalk) {
            const patchedCmdTalk = GameEngine.cmdTalk;

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

                // Hitta karaktär
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

                if (!foundChar) {
                    this.output(`Jag ser ingen sådan person här.`);
                    return;
                }

                // Kläd-reaktion - men BARA om NPC:n inte har kläder i sin dialog
                const hasModernClothes = Game.player.hasModernClothes !== false;
                const roomKey = `clothing_reaction_${Game.player.currentRoom}`;
                const alreadyReacted = Game.player.knowledge && Game.player.knowledge.includes(roomKey);
                const skipClothingReaction = npcsWithClothingInDialogue.includes(foundChar.id);

                // Visa kläd-reaktion ENDAST om:
                // 1. Inte redan reagerat i detta rum
                // 2. NPC:n inte redan har klädkommentar i dialog
                // 3. Slumpmässig chans
                if (!alreadyReacted && !skipClothingReaction && Math.random() < (hasModernClothes ? 0.35 : 0.15)) {
                    if (typeof getClothingReaction === 'function') {
                        const reaction = getClothingReaction(foundChar.id);
                        if (reaction) {
                            const name = foundChar.char.name.toLowerCase();
                            let pronoun = name.includes('dam') || name.includes('kvinna') ||
                                         name.includes('fru') || name.includes('fröken') ? 'hon' : 'han';

                            if (reaction.type === 'modern') {
                                this.output(`<div class="narrator">${foundChar.char.name} betraktar dina kläder med förvirrad min:</div>
<div class="dialogue whisper">${reaction.text}</div>
<div class="narrator">Men ${pronoun} skakar av sig det och fortsätter...</div>`);
                            } else {
                                this.output(`<div class="dialogue whisper">${reaction.text}</div>`);
                            }

                            if (!Game.player.knowledge) Game.player.knowledge = [];
                            Game.player.knowledge.push(roomKey);
                        }
                    }
                }

                // Visa huvuddialog
                const dialogue = foundChar.char.dialogue;
                if (dialogue) {
                    const metKey = `met_${foundChar.id}`;
                    if (!Game.player.knowledge) Game.player.knowledge = [];
                    const firstTime = !Game.player.knowledge.includes(metKey);

                    if (firstTime) {
                        Game.player.knowledge.push(metKey);

                        // Synka questProgress med knowledge
                        syncKnowledgeAndQuest(foundChar.id);

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
                        } else {
                            this.output(`${foundChar.char.name} har inget mer att säga just nu.`);
                        }
                    }

                    // Visa topic-hints
                    if (dialogue.topics && Object.keys(dialogue.topics).length > 0) {
                        const topicList = Object.keys(dialogue.topics).slice(0, 4).join(', ');
                        this.output(`<div class="hint-subtle"><em>Du kan fråga om: ${topicList}</em></div>`);
                    }
                }
            };
        }

        // ═══════════════════════════════════════════════════════════════════
        // P1-1: PARSER - FÅNGA "VAD VET DU?" OCH LIKNANDE
        // ═══════════════════════════════════════════════════════════════════
        // Problem: "Vad vet du?" registreras som UNHANDLED i debug-loggen

        if (typeof GameEngine !== 'undefined') {
            const existingProcessCommand = GameEngine.processCommand;

            GameEngine.processCommand = function(input) {
                const lowerInput = input.toLowerCase().trim();

                // "Vad vet du?" och liknande
                if (/^(vad vet du|vad kan du berätta|vad vet ni|berätta för mig|vad har du hört)/.test(lowerInput)) {
                    const room = Rooms[Game.player.currentRoom];
                    if (room.characters && room.characters.length > 0) {
                        const charId = room.characters[0];
                        const char = Characters[charId];
                        if (char && char.dialogue && char.dialogue.topics) {
                            const topics = Object.keys(char.dialogue.topics);
                            if (topics.length > 0) {
                                const topicList = topics.join(', ');
                                this.output(`<div class="dialogue">"Vad vill ni veta? Jag kan berätta om: <em>${topicList}</em>."</div>
<div class="hint-subtle">Skriv FRÅGA [person] OM [ämne]</div>`);
                                return;
                            }
                        }
                        this.output(`<div class="dialogue">"Jag vet inte så mycket, tyvärr."</div>`);
                        return;
                    }
                    this.output("Det finns ingen här att fråga.");
                    return;
                }

                // "Fråga om" utan ämne
                if (/^fråga\s+(om\s*)?$/.test(lowerInput)) {
                    this.output(`<div class="hint">Skriv FRÅGA [person] OM [ämne], t.ex. "fråga adelcrantz om kungen"</div>`);
                    return;
                }

                return existingProcessCommand.call(this, input);
            };

            console.log('   ✓ P1-1: Parser now catches "Vad vet du?" and similar');
        }

        // ═══════════════════════════════════════════════════════════════════
        // P1-2: TOPIC-LISTNING NÄR NPC INTE KÄNNER TILL ÄMNE
        // ═══════════════════════════════════════════════════════════════════
        // Problem: "Jag vet inget om det." upprepas 8 gånger utan vägledning

        if (typeof GameEngine !== 'undefined' && GameEngine.cmdAsk) {
            const existingCmdAsk = GameEngine.cmdAsk;

            GameEngine.cmdAsk = function(targetAndTopic) {
                if (!targetAndTopic) {
                    this.output(`<div class="hint">Skriv FRÅGA [person] OM [ämne], t.ex. "fråga adelcrantz om kungen"</div>`);
                    return;
                }

                // Parsa "person om ämne"
                const match = targetAndTopic.match(/^(.+?)\s+om\s+(.+)$/i);
                if (!match) {
                    // Försök hitta NPC och visa deras topics
                    const room = Rooms[Game.player.currentRoom];
                    if (room.characters && room.characters.length > 0) {
                        for (let charId of room.characters) {
                            const char = Characters[charId];
                            if (char && char.dialogue && char.dialogue.topics) {
                                const topics = Object.keys(char.dialogue.topics).join(', ');
                                this.output(`<div class="hint">Du kan fråga ${char.name} om: <em>${topics}</em></div>`);
                                return;
                            }
                        }
                    }
                    this.output(`<div class="hint">Skriv FRÅGA [person] OM [ämne]</div>`);
                    return;
                }

                const targetName = match[1].trim();
                const topic = match[2].trim().toLowerCase();

                // Hitta NPC
                const room = Rooms[Game.player.currentRoom];
                if (!room.characters || room.characters.length === 0) {
                    this.output("Det finns ingen här att fråga.");
                    return;
                }

                let foundChar = null;
                for (let charId of room.characters) {
                    const char = Characters[charId];
                    if (char && char.keywords) {
                        for (let keyword of char.keywords) {
                            if (targetName.toLowerCase().includes(keyword.toLowerCase())) {
                                foundChar = { id: charId, char: char };
                                break;
                            }
                        }
                    }
                    if (foundChar) break;
                }

                if (!foundChar) {
                    this.output(`Jag ser ingen sådan person här.`);
                    return;
                }

                // Kolla om NPC har topics
                const dialogue = foundChar.char.dialogue;
                if (!dialogue || !dialogue.topics) {
                    this.output(`<div class="dialogue">${foundChar.char.name} ser förvirrad ut. "Jag... jag vet inte vad ni pratar om."</div>`);
                    return;
                }

                // Hitta topic (med fuzzy matching)
                let foundTopic = null;
                for (let t of Object.keys(dialogue.topics)) {
                    if (t.toLowerCase() === topic ||
                        topic.includes(t.toLowerCase()) ||
                        t.toLowerCase().includes(topic)) {
                        foundTopic = t;
                        break;
                    }
                }

                if (foundTopic) {
                    // Hitta svaret och visa det
                    const response = dialogue.topics[foundTopic];
                    this.output(`<div class="dialogue">${response}</div>`);

                    // Lägg till knowledge
                    const knowledgeKey = `asked_${foundChar.id}_${foundTopic}`;
                    if (!Game.player.knowledge.includes(knowledgeKey)) {
                        Game.player.knowledge.push(knowledgeKey);
                    }
                } else {
                    // Topic okänt - VISA TILLGÄNGLIGA TOPICS istället för bara "Jag vet inget"
                    const availableTopics = Object.keys(dialogue.topics);

                    // Personlig fallback baserat på NPC
                    let fallbackResponse = "";
                    switch(foundChar.id) {
                        case 'adelcrantz':
                            fallbackResponse = `Adelcrantz rynkar pannan. "Hmm, ${topic}? Det vet jag tyvärr inget om."`;
                            break;
                        case 'portier':
                            fallbackResponse = `Portiern skakar på huvudet. "Det ligger utanför min kunskap."`;
                            break;
                        case 'bellman':
                            fallbackResponse = `Bellman tar en klunk ur sin bägare. "Det ämnet inspirerar mig inte, tyvärr."`;
                            break;
                        case 'krogvarden':
                            fallbackResponse = `Krogvärden torkar ett glas. "Jag hör mycket, men inte om det."`;
                            break;
                        default:
                            fallbackResponse = `${foundChar.char.name} skakar på huvudet. "Tyvärr vet jag inget om det."`;
                    }

                    this.output(`<div class="dialogue">${fallbackResponse}</div>
<div class="hint-subtle"><em>Du kan fråga om: ${availableTopics.join(', ')}</em></div>`);
                }
            };

            console.log('   ✓ P1-2: Unknown topics now show available alternatives');
        }

        // ═══════════════════════════════════════════════════════════════════
        // P2-1: SYNKA KNOWLEDGE OCH QUESTPROGRESS
        // ═══════════════════════════════════════════════════════════════════
        // Problem: met_adelcrantz i knowledge men questProgress.metAdelcrantz=false

        function syncKnowledgeAndQuest(npcId) {
            if (!Game.player.questProgress) {
                Game.player.questProgress = {};
            }
            if (!Game.player.knowledge) {
                Game.player.knowledge = [];
            }

            // Synka NPC-möten
            const npcMapping = {
                'adelcrantz': 'metAdelcrantz',
                'portier': 'metPortier',
                'bellman': 'metBellman',
                'krogvarden': 'metKrogvarden',
                'king': 'metKing',
                'anckarstrom': 'metAnckarstrom'
            };

            // Från knowledge till questProgress
            for (let [npc, questKey] of Object.entries(npcMapping)) {
                if (Game.player.knowledge.includes(`met_${npc}`)) {
                    Game.player.questProgress[questKey] = true;
                }
            }

            // Specifik synk för nyss träffad NPC
            if (npcId && npcMapping[npcId]) {
                Game.player.questProgress[npcMapping[npcId]] = true;
            }
        }

        // Exportera funktionen
        window.syncKnowledgeAndQuest = syncKnowledgeAndQuest;

        // Kör synk vid laddning
        if (typeof Game !== 'undefined' && Game.player) {
            syncKnowledgeAndQuest();
            console.log('   ✓ P2-1: Knowledge and questProgress synchronized');
        }

        // ═══════════════════════════════════════════════════════════════════
        // CSS FÖR FEEDBACK-MEDDELANDEN
        // ═══════════════════════════════════════════════════════════════════

        const feedbackStyle = document.createElement('style');
        feedbackStyle.textContent = `
            .success {
                color: #4a4;
                font-weight: bold;
                margin: 10px 0;
            }
            .hint-subtle {
                color: #888;
                font-style: italic;
                font-size: 0.9em;
                margin-top: 5px;
            }
            .dialogue.whisper {
                font-style: italic;
                opacity: 0.9;
            }
        `;
        document.head.appendChild(feedbackStyle);

        console.log('');
        console.log('✅ BUGFIXES BATCH 6 LOADED!');
        console.log('   P0-1: Adelcrantz clothing dialogue conditional');
        console.log('   P0-2: "byt om" success feedback');
        console.log('   P0-3: Clothing reaction deduplication');
        console.log('   P1-1: Parser catches "Vad vet du?"');
        console.log('   P1-2: Unknown topics show alternatives');
        console.log('   P2-1: Knowledge/questProgress sync');
        console.log('');

    }, 1600);
});
