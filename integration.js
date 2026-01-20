// ==========================================
// INTEGRATION - Connects all expansion files
// ==========================================

// Wait for DOM and all scripts to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize time system after a delay
    setTimeout(function() {
        if (window.TimeSystem) {
            TimeSystem.updateTimeDisplay();
        }
    }, 100);
});

// Extend GameEngine with new commands
if (typeof GameEngine !== 'undefined') {

    // Override processCommand to add new commands
    const originalProcessCommand = GameEngine.processCommand;
    GameEngine.processCommand = function(input) {
        if (!input.trim()) return;

        const parsed = Parser.parse(input);
        const verb = parsed.verb;
        const obj = parsed.object;

        // New commands
        if (verb === 'sov' || verb === 'vila' || verb === 'sleep') {
            this.cmdSleep();
            return;
        }

        if (verb === 'fråga' && obj) {
            this.cmdAsk(obj);
            return;
        }

        if (verb === 'ge' && obj) {
            this.cmdGive(obj);
            return;
        }

        if (verb === 'vänta' || verb === 'wait') {
            this.cmdWait();
            return;
        }

        // Call original
        originalProcessCommand.call(this, input);

        // Check for endings after each command
        if (typeof checkEndings !== 'undefined') {
            checkEndings();
        }

        // Advance time slightly
        if (window.TimeSystem) {
            TimeSystem.advanceTime(5); // 5 minutes per action
        }
    };

    // New command: Sleep
    GameEngine.cmdSleep = function() {
        if (Game.currentTime.hour >= 22 || Game.currentTime.hour < 6) {
            if (window.TimeSystem) {
                const result = TimeSystem.sleep();
                this.output(result);
            }
        } else {
            this.output("Det är för tidigt att sova. Du är inte trött än.");
        }
    };

    // New command: Ask about topic
    GameEngine.cmdAsk = function(query) {
        // Parse "fråga [person] om [ämne]"
        const parts = query.split(' om ');
        if (parts.length < 2) {
            this.output("Fråga vem om vad? (t.ex. 'fråga bellman om konspiration')");
            return;
        }

        const personName = parts[0].trim();
        const topic = parts[1].trim();

        const room = Rooms[Game.player.currentRoom];
        if (!room.characters) {
            this.output("Det finns ingen här att fråga.");
            return;
        }

        // Find character
        let foundChar = null;
        for (let charId of room.characters) {
            const char = Characters[charId];
            if (char && char.keywords.some(k => personName.includes(k))) {
                foundChar = { id: charId, char: char };
                break;
            }
        }

        if (!foundChar) {
            this.output(`Jag ser ingen ${personName} här.`);
            return;
        }

        // Check if character has that topic
        const dialogue = foundChar.char.dialogue;
        if (dialogue.topics && dialogue.topics[topic]) {
            this.output(`<div class="dialogue">${dialogue.topics[topic]}</div>`);

            // Update quest progress based on topics
            if (topic === 'anckarström' || topic === 'anckarstrom') {
                Game.player.questProgress.learnedAboutConspiracy = true;
                if (!Game.player.knowledge.includes('anckarstrom_mentioned')) {
                    Game.player.knowledge.push('anckarstrom_mentioned');
                    this.unlockAchievement('detective');
                    this.updateProgress(10);
                }
            }

            if (topic === 'pistoler' && foundChar.id === 'vahlberg') {
                Game.player.questProgress.foundPistolsmith = true;
                this.updateProgress(15);
            }
        } else {
            this.output(`<div class="dialogue">${foundChar.char.name} verkar inte ha något att säga om "${topic}".</div>`);
        }
    };

    // New command: Give item
    GameEngine.cmdGive = function(query) {
        // Parse "ge [item] till [person]"
        const parts = query.split(' till ');
        if (parts.length < 2) {
            this.output("Ge vad till vem? (t.ex. 'ge färg till adelcrantz')");
            return;
        }

        const itemName = parts[0].trim();
        const personName = parts[1].trim();

        // Find item in inventory
        let foundItem = null;
        for (let itemId of Game.player.inventory) {
            const item = Items[itemId];
            if (item && item.keywords.some(k => itemName.includes(k))) {
                foundItem = { id: itemId, item: item };
                break;
            }
        }

        if (!foundItem) {
            this.output("Du har inget sådant.");
            return;
        }

        // Find character
        const room = Rooms[Game.player.currentRoom];
        let foundChar = null;
        if (room.characters) {
            for (let charId of room.characters) {
                const char = Characters[charId];
                if (char && char.keywords.some(k => personName.includes(k))) {
                    foundChar = { id: charId, char: char };
                    break;
                }
            }
        }

        if (!foundChar) {
            this.output(`Jag ser ingen ${personName} här.`);
            return;
        }

        // Special quest logic
        if (foundItem.id === 'färgburkar' && foundChar.id === 'adelcrantz') {
            Game.player.inventory = Game.player.inventory.filter(i => i !== 'färgburkar');
            Game.player.inventory.push('ticket');
            Game.player.questProgress.gotTicket = true;

            this.output(`<div class="dialogue">"Ah, preussiskt blått! Perfekt! Tack så mycket, min vän!"</div>`);
            this.output(`Adelcrantz ger dig en <span class="important">biljett till maskeradbalen</span> som tack.`);

            this.unlockAchievement('access_granted');
            this.updateProgress(20);
        } else if (foundItem.id === 'anckarstrom_note' || foundItem.id === 'pistol_list' || foundItem.id === 'dokument') {
            // Giving evidence to king
            if (foundChar.id === 'gustav_iii' || foundChar.id === 'gustav_iii_dining') {
                Game.flags.hasGivenEvidence = true;
                this.output(Characters.gustav_iii_dining.dialogue.warn_with_evidence);

                // PERFECT VICTORY PATH
                Game.player.questProgress.savedKing = true;
                if (typeof checkEndings !== 'undefined') {
                    checkEndings();
                }
            } else {
                this.output(`${foundChar.char.name} tittar förvirrat på dokumentet.`);
            }
        } else {
            this.output(`${foundChar.char.name} vill inte ha det.`);
        }
    };

    // New command: Wait
    GameEngine.cmdWait = function() {
        if (window.TimeSystem) {
            TimeSystem.advanceTime(30);
            this.output(`Du väntar en stund. Tiden tickar vidare...`);
            this.output(`Det är nu ${TimeSystem.getTimeDescription()}.`);
        }
    };

    // Override cmdGo to handle special events
    const originalCmdGo = GameEngine.cmdGo;
    GameEngine.cmdGo = function(direction) {
        const room = Rooms[Game.player.currentRoom];
        const nextRoomId = room.exits ? room.exits[direction] : null;

        if (nextRoomId) {
            const nextRoom = Rooms[nextRoomId];

            // Check unlock conditions
            if (nextRoom.unlockCondition) {
                if (nextRoom.unlockCondition === 'chapter2' && Game.player.stats.chapter < 2) {
                    this.output("Du känner att det är för tidigt att gå dit än. Du behöver mer information först.");
                    return;
                }
                if (nextRoom.unlockCondition === 'chapter3' && Game.player.stats.chapter < 3) {
                    this.output("Den vägen är inte tillgänglig än.");
                    return;
                }
                if (nextRoom.unlockCondition === 'learned_about_pistols' && !Game.player.knowledge.includes('anckarstrom_mentioned')) {
                    this.output("Du känner inte till någon vapensmed än.");
                    return;
                }
                if (nextRoom.unlockCondition === 'found_anckarstrom' && !Game.player.knowledge.includes('anckarstrom_address')) {
                    this.output("Du vet inte var Anckarström bor.");
                    return;
                }
            }

            // Check special events
            if (nextRoom.specialEvent) {
                this.handleSpecialEvent(nextRoom.specialEvent, nextRoomId);
                return;
            }
        }

        // Call original
        originalCmdGo.call(this, direction);
    };

    // Special event handler
    GameEngine.handleSpecialEvent = function(eventId, roomId) {
        if (eventId === 'conspiracy_meeting') {
            Game.player.currentRoom = roomId;
            this.showRoom(roomId);

            setTimeout(() => {
                this.output(`<div class="warning">Du lyssnar på konspiratorernas samtal...</div>`);
            }, 1000);

            setTimeout(() => {
                this.output(`<div class="dialogue">"16 mars, vid midnatt," säger Pechlin. "Anckarström - ni skjuter. Ribbing och Horn - ni täcker hans flykt. Är vi överens?"

"Ja," svarar Anckarström med darrig röst. "Jag har vapnen. Jag är redo."

Horn säger: "När jag klapper kungen på axeln och säger 'God natt, mask' - då är det signalen."</div>`);

                this.output(`<div class="important">Du har nu konkret information om mordplanerna!</div>`);

                Game.player.questProgress.learnedAboutConspiracy = true;
                Game.player.knowledge.push('heard_conspiracy');
                this.unlockAchievement('conspirator_found');
                this.updateProgress(25);
            }, 3000);

            setTimeout(() => {
                this.output(`<div class="warning">Plötsligt vänder sig Pechlin!</div>`);
                this.output(`<div class="dialogue">"Vem är där?! Tjuvar! Mördare!"</div>`);
                this.output(`<div class="narrator">Du måste fly! Skriv 'gå ner' snabbt!</div>`);
            }, 5000);
        }

        if (eventId === 'assassination_attempt') {
            // The climactic scene
            Game.player.currentRoom = roomId;
            this.showRoom(roomId);

            if (!Game.player.questProgress.savedKing) {
                setTimeout(() => {
                    this.output(`<div class="warning">Du ser Anckarström dra pistolen!</div>`);
                    this.output(`<div class="narrator">Du kan:</div>`);
                    this.output(`<div class="narrator">- ROPA för att varna kungen</div>`);
                    this.output(`<div class="narrator">- GÅ EMELLAN för att skydda honom fysiskt</div>`);
                    this.output(`<div class="narrator">- GRIPA Anckarström</div>`);
                    this.output(`<div class="narrator">SNABBT! Skriv ett kommando!</div>`);

                    // Give player 10 seconds to act
                    setTimeout(() => {
                        if (!Game.player.questProgress.savedKing) {
                            this.output(`<div class="failure">BANG!</div>`);
                            this.output(`Du var för sent..`);

                            if (typeof checkEndings !== 'undefined') {
                                checkEndings();
                            }
                        }
                    }, 10000);
                }, 2000);
            }
        }

        if (eventId === 'anckarstrom_returns') {
            this.output(`<div class="warning">FOTSTEG I TRAPPAN!</div>`);
            this.output(`<div class="narrator">Anckarström kommer tillbaka! Du måste:</div>`);
            this.output(`<div class="narrator">- GÅ UT (genom dörren - riskabelt!)</div>`);
            this.output(`<div class="narrator">- GÅ FÖNSTER (klättra ut)</div>`);
            this.output(`<div class="narrator">- GÖMS (försök gömma dig)</div>`);
            this.output(`<div class="narrator">SNABBT!</div>`);
        }
    };

    // Add special action commands for climax
    const originalParse = Parser.parse;
    Parser.parse = function(input) {
        const result = originalParse.call(this, input);

        // Check for special actions
        if (input.includes('ropa') || input.includes('varna')) {
            result.verb = 'ropa';
            result.object = '';
        }

        if (input.includes('emellan') || input.includes('skydda')) {
            result.verb = 'skydda';
            result.object = '';
        }

        if (input.includes('gripa') || input.includes('stoppa')) {
            result.verb = 'gripa';
            result.object = input.replace(/gripa|stoppa/gi, '').trim();
        }

        if (input.includes('gömma') || input.includes('göm')) {
            result.verb = 'göm';
            result.object = '';
        }

        return result;
    };

    // Handle special climax actions
    const originalProcessCommand2 = GameEngine.processCommand;
    GameEngine.processCommand = function(input) {
        const parsed = Parser.parse(input);

        // Climax actions in ballroom
        if (Game.player.currentRoom === 'opera_ballroom') {
            if (parsed.verb === 'ropa') {
                if (!Game.player.inventory.includes('anckarstrom_note') && !Game.player.inventory.includes('pistol_list')) {
                    // Warned without proof
                    Game.flags.warnedKingWithoutProof = true;
                    this.output(`<div class="dialogue">"VAKT! ANCKARSTRÖM HAR EN PISTOL!"</div>`);
                    this.output(`Men din röst dränks i musiken och skratten. Kungen hör inte...`);
                    this.output(`<div class="failure">BANG!</div>`);
                    if (typeof checkEndings !== 'undefined') {
                        checkEndings();
                    }
                } else {
                    // Has evidence, can convince guards
                    this.output(`"VAKT! MÖRDARE!" Du visar upp bevisen!`);
                    this.output(`Soldater rusar fram och griper Anckarström innan han kan avfyra!`);
                    Game.player.questProgress.savedKing = true;
                    if (typeof checkEndings !== 'undefined') {
                        checkEndings();
                    }
                }
                return;
            }

            if (parsed.verb === 'skydda') {
                this.output(`Du kastar dig fram och ställer dig mellan kungen och Anckarström!`);
                this.output(`<div class="failure">BANG!</div>`);
                this.output(`Smärtan exploderar i din bröst. Du föll...`);
                this.output(`Men kungen lever.`);
                this.output(`<div class="narrator">Du dog som en hjälte. Kungen överlevde tack vare dig.</div>`);

                // Heroic sacrifice ending
                Game.player.questProgress.savedKing = true;
                Game.flags.martyrEnding = true;
                if (typeof checkEndings !== 'undefined') {
                    showEnding('narrow_victory'); // Modify this for unique martyr ending
                }
                return;
            }

            if (parsed.verb === 'gripa' && parsed.object.includes('anckar')) {
                this.output(`Du rusar fram och griper Anckarströms arm!`);
                this.output(`Pistolen avfyras - men skottet går vilt! Kulan träffar taket!`);
                this.output(`von Essen och vakter rusar fram och övermannar Anckarström.`);
                this.output(`<div class="important">KUNGEN ÄR RÄDDAD!</div>`);

                Game.player.questProgress.savedKing = true;
                if (typeof checkEndings !== 'undefined') {
                    checkEndings();
                }
                return;
            }
        }

        // Original processing
        originalProcessCommand2.call(this, input);
    };
}

// Add new achievement
if (typeof Achievements !== 'undefined') {
    Achievements.dark_justice = {
        name: 'Mörk rättvisa',
        description: 'Du tog lagen i egna händer',
        icon: '⚫'
    };

    Achievements.conspiracy_joined = {
        name: 'Förrädare',
        description: 'Du gick med i konspirationen',
        icon: '🗡️'
    };
}

console.log('🎮 Integration loaded: Expansion + Endings + New Commands active!');
