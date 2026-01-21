// ==========================================
// DIRECTION NORMALIZATION FIX
// ==========================================
// Fixes all direction synonyms so "söder" = "syd", "öster" = "öst", etc.

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {

        console.log('🧭 Loading direction normalization fix...');

        // Direction normalization map
        const DirectionMap = {
            // All variations of NORTH
            'norr': 'norr',
            'nord': 'norr',
            'n': 'norr',
            'norrut': 'norr',

            // All variations of SOUTH
            'syd': 'syd',
            'söder': 'syd',
            'söderut': 'syd',
            's': 'syd',

            // All variations of EAST
            'öster': 'öster',
            'öst': 'öster',
            'österut': 'öster',
            'ö': 'öster',

            // All variations of WEST
            'väster': 'väster',
            'väst': 'väster',
            'västerut': 'väster',
            'v': 'väster',

            // Other directions
            'in': 'in',
            'ut': 'ut',
            'upp': 'upp',
            'ner': 'ner',
            'ned': 'ner',
            'vänster': 'vänster',
            'höger': 'höger',
            'fram': 'fram'
        };

        // Override cmdGo to normalize directions
        if (typeof GameEngine !== 'undefined') {
            const originalCmdGo = GameEngine.cmdGo;

            GameEngine.cmdGo = function(direction) {
                if (!direction) {
                    this.output("Gå vart? (t.ex. 'gå norr', 'gå söder', 'gå in')");
                    return;
                }

                // Clean up direction
                direction = direction.toLowerCase().trim();

                // Remove filler words like "åt", "mot", "till"
                direction = direction.replace(/^(åt|mot|till|i)\s+/, '');

                // Normalize direction
                const normalizedDir = DirectionMap[direction] || direction;

                const room = Rooms[Game.player.currentRoom];

                // Try normalized direction first
                if (room.exits && room.exits[normalizedDir]) {
                    const nextRoomId = room.exits[normalizedDir];
                    const nextRoom = Rooms[nextRoomId];

                    // Check if room exists (defensive)
                    if (!nextRoom) {
                        this.output("Det finns inget rum i den riktningen.");
                        return;
                    }

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
                        if (nextRoom.unlockCondition === 'found_anckarstrom_address' && !Game.player.knowledge.includes('anckarstrom_address')) {
                            this.output("Du vet inte var den adressen är.");
                            return;
                        }
                    }

                    // Check if player can enter (clothing check)
                    if (nextRoomId === 'opera_foyer' && Game.player.hasModernClothes) {
                        this.output(`<div class="warning">Portiern stoppade dig. "Inte så där klädd!"</div>`);
                        return;
                    }

                    // Move to new room
                    Game.player.currentRoom = nextRoomId;
                    this.showRoom(nextRoomId);

                    // Track room visits for achievements
                    if (!Game.achievementStats.roomsVisited.includes(nextRoomId)) {
                        Game.achievementStats.roomsVisited.push(nextRoomId);
                    }

                    return;
                }

                // Try original direction as fallback
                if (room.exits && room.exits[direction]) {
                    return originalCmdGo.call(this, direction);
                }

                // Not found
                this.output("Du kan inte gå åt det hållet.");
            };
        }

        // Also update Parser synonyms to be consistent
        if (typeof Parser !== 'undefined' && Parser.synonyms) {
            // Fix direction synonyms
            Parser.synonyms['norr'] = ['nord', 'n', 'norrut'];
            Parser.synonyms['syd'] = ['söder', 's', 'söderut'];
            Parser.synonyms['öster'] = ['öst', 'ö', 'österut'];
            Parser.synonyms['väster'] = ['väst', 'v', 'västerut'];
        }

        console.log('✅ Direction normalization active!');
        console.log('   All compass variations now work:');
        console.log('   - norr/nord/n/norrut → norr');
        console.log('   - syd/söder/s/söderut → syd');
        console.log('   - öster/öst/ö/österut → öster');
        console.log('   - väster/väst/v/västerut → väster');

    }, 1000); // Load AFTER all other systems (especially integration.js)
});
