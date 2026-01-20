// ==========================================
// EXPANDED ACHIEVEMENTS SYSTEM
// ==========================================
// Achievements that make players want to keep playing!

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {

        // Expand Achievements object with MANY more achievements
        if (typeof Achievements !== 'undefined') {

            // ===== STORY PROGRESSION =====
            Achievements.first_steps = {
                name: 'Tidsresenären',
                description: 'Anlände till 1792 - Din resa har börjat',
                icon: '🕰️',
                category: 'story'
            };

            Achievements.blend_in = {
                name: 'Kameleont',
                description: 'Bytte kläder och smälte in i mängden',
                icon: '🎭',
                category: 'story'
            };

            Achievements.detective = {
                name: 'Spårhund',
                description: 'Började samla ledtrådar om konspirationen',
                icon: '🔍',
                category: 'story'
            };

            Achievements.conspirator_found = {
                name: 'Avsläjaren',
                description: 'Identifierade en av de sammansvurna',
                icon: '🎯',
                category: 'story'
            };

            Achievements.access_granted = {
                name: 'Balens Gäst',
                description: 'Fick tillträde till maskeradbalen',
                icon: '🎫',
                category: 'story'
            };

            // ===== VICTORY ACHIEVEMENTS =====
            Achievements.king_saved = {
                name: 'Hjälten av Stockholm',
                description: 'Räddade Gustav III från mordet',
                icon: '👑',
                category: 'victory'
            };

            Achievements.perfect_victory = {
                name: 'Den Lysande Historikern',
                description: 'Räddade kungen med övertygande bevis - Perfect Victory!',
                icon: '⭐',
                category: 'victory'
            };

            Achievements.narrow_escape = {
                name: 'Sekundernas Mästare',
                description: 'Stoppade mordet i sista möjliga ögonblick',
                icon: '⚔️',
                category: 'victory'
            };

            // ===== DARK ACHIEVEMENTS =====
            Achievements.dark_justice = {
                name: 'Vigilanten',
                description: 'Tog lagen i egna händer',
                icon: '⚫',
                category: 'dark'
            };

            Achievements.conspiracy_joined = {
                name: 'Förrädaren',
                description: 'Gick med i konspirationen mot kungen',
                icon: '🗡️',
                category: 'dark'
            };

            Achievements.failed_mission = {
                name: 'Den Förlorade Tidsresenären',
                description: 'Misslyckades med uppdraget - Fastnade i 1792',
                icon: '💀',
                category: 'dark'
            };

            // ===== EXPLORATION ACHIEVEMENTS =====
            Achievements.tavern_crawler = {
                name: 'Krogkännaren',
                description: 'Besökte alla krogar i Stockholm',
                icon: '🍺',
                category: 'exploration'
            };

            Achievements.palace_visitor = {
                name: 'Hovmannen',
                description: 'Utforskade både Slottet och Pechlins palats',
                icon: '🏰',
                category: 'exploration'
            };

            Achievements.street_smart = {
                name: 'Stockholmskännaren',
                description: 'Besökte alla stadsdelar: Norrmalm, Gamla stan och Blasieholmen',
                icon: '🗺️',
                category: 'exploration'
            };

            Achievements.opera_expert = {
                name: 'Operafantomen',
                description: 'Utforskade alla rum i Kungliga Operan',
                icon: '🎭',
                category: 'exploration'
            };

            // ===== SOCIAL ACHIEVEMENTS =====
            Achievements.social_butterfly = {
                name: 'Sällskapsmänniskan',
                description: 'Pratade med minst 10 olika personer',
                icon: '👥',
                category: 'social'
            };

            Achievements.bellman_friend = {
                name: 'Bellmans Kompanjon',
                description: 'Blev god vän med Carl Michael Bellman',
                icon: '🎵',
                category: 'social'
            };

            Achievements.king_audience = {
                name: 'Kunglig Audiensen',
                description: 'Fick tala personligen med Gustav III',
                icon: '👑',
                category: 'social'
            };

            // ===== EVIDENCE COLLECTION =====
            Achievements.pistol_tracker = {
                name: 'Vapenexperten',
                description: 'Spårade Anckarströms pistoler till Wåhlberg',
                icon: '🔫',
                category: 'evidence'
            };

            Achievements.master_spy = {
                name: 'Spionen',
                description: 'Avlyssnade Pechlins hemliga möte',
                icon: '👂',
                category: 'evidence'
            };

            Achievements.break_in_artist = {
                name: 'Inbrottstjuven',
                description: 'Bröt dig in i Anckarströms lägenhet',
                icon: '🔓',
                category: 'evidence'
            };

            Achievements.evidence_collector = {
                name: 'Arkivarien',
                description: 'Samlade alla tre bevisdokument',
                icon: '📜',
                category: 'evidence'
            };

            // ===== SPECIAL ACTIONS =====
            Achievements.song_master = {
                name: 'Sångmästaren',
                description: 'Hörde Gustafs skål i alla tre sammanhang',
                icon: '🎶',
                category: 'special'
            };

            Achievements.food_critic = {
                name: 'Gourmanden',
                description: 'Smakade på all mat och dryck som erbjuds',
                icon: '🍽️',
                category: 'special'
            };

            Achievements.time_traveler = {
                name: 'Tidsmästaren',
                description: 'Upplevde alla tre dagar från början till slut',
                icon: '⏰',
                category: 'special'
            };

            Achievements.night_owl = {
                name: 'Nattugglán',
                description: 'Var ute efter midnatt i 1700-talets Stockholm',
                icon: '🦉',
                category: 'special'
            };

            // ===== ENDING COLLECTION =====
            Achievements.ending_collector_2 = {
                name: 'Berättelsesökaren',
                description: 'Upplevde 2 olika slut',
                icon: '📖',
                category: 'endings'
            };

            Achievements.ending_collector_4 = {
                name: 'Historiens Utforskare',
                description: 'Upplevde 4 olika slut',
                icon: '📚',
                category: 'endings'
            };

            Achievements.ending_collector_all = {
                name: 'Ödesvävarens Mästare',
                description: 'Upplevde ALLA 6 slut - Du har sett allt!',
                icon: '🌟',
                category: 'endings'
            };

            // ===== SPEED & SKILL =====
            Achievements.speedrunner = {
                name: 'Blixtsnabb',
                description: 'Räddade kungen på under 90 minuter',
                icon: '⚡',
                category: 'skill'
            };

            Achievements.no_hints = {
                name: 'Självständig',
                description: 'Klarade spelet utan att använda en enda ledtråd',
                icon: '🧠',
                category: 'skill'
            };

            Achievements.minimalist = {
                name: 'Minimalisten',
                description: 'Räddade kungen med mindre än 100 kommandon',
                icon: '🎯',
                category: 'skill'
            };

            // ===== FUN / EASTER EGGS =====
            Achievements.drunk_bellman = {
                name: 'Sup med Bellman',
                description: 'Köpte brännvin till Bellman',
                icon: '🍻',
                category: 'fun'
            };

            Achievements.candy_lover = {
                name: 'Sötsaken',
                description: 'Köpte brända mandlar från gatuförsäljaren',
                icon: '🍬',
                category: 'fun'
            };

            Achievements.fashion_victim = {
                name: 'Modeikonen',
                description: 'Undersökte alla klädespersedlar och kostymer',
                icon: '👔',
                category: 'fun'
            };

            Achievements.document_reader = {
                name: 'Dokumentläsaren',
                description: 'Läste alla brev, anteckningar och dokument',
                icon: '📄',
                category: 'fun'
            };

            // ===== MASTER ACHIEVEMENT =====
            Achievements.grand_master = {
                name: '⭐ GUSTAVIANSK HJÄLTE ⭐',
                description: 'Låste upp alla achievements - Du är en sann mästare av 1792!',
                icon: '🏆',
                category: 'master'
            };
        }

        // ===== ACHIEVEMENT TRACKING SYSTEM =====
        if (!Game.achievementStats) {
            Game.achievementStats = {
                peopleSpokenTo: [],
                roomsVisited: [],
                itemsCollected: [],
                foodTasted: [],
                documentsRead: [],
                endingsSeen: [],
                commandCount: 0,
                startTime: Date.now()
            };
        }

        // ===== AUTO-UNLOCK FUNCTIONS =====

        // Override room visit to track
        if (typeof GameEngine !== 'undefined') {
            const originalShowRoom = GameEngine.showRoom;
            GameEngine.showRoom = function(roomId, isFirstVisit) {
                originalShowRoom.call(this, roomId, isFirstVisit);

                // Track room visit
                if (!Game.achievementStats.roomsVisited.includes(roomId)) {
                    Game.achievementStats.roomsVisited.push(roomId);
                    checkExplorationAchievements();
                }
            };

            // Track commands
            const originalProcessCommand = GameEngine.processCommand;
            GameEngine.processCommand = function(input) {
                Game.achievementStats.commandCount++;
                originalProcessCommand.call(this, input);
            };
        }

        // Check exploration achievements
        function checkExplorationAchievements() {
            const visited = Game.achievementStats.roomsVisited;

            // All taverns
            const taverns = ['den_gyldene_freden', 'arbetarkrog'];
            if (taverns.every(t => visited.includes(t))) {
                unlockIfNew('tavern_crawler');
            }

            // All opera rooms
            const operaRooms = ['opera_entrance', 'opera_staff', 'costume_room', 'opera_foyer', 'opera_loges', 'drabant_hall', 'opera_ballroom'];
            if (operaRooms.filter(r => visited.includes(r)).length >= 5) {
                unlockIfNew('opera_expert');
            }

            // All districts
            const norrmalm = visited.includes('norrmalmstorg') && visited.includes('drottninggatan');
            const gamlastan = visited.includes('gamla_stan') || visited.includes('den_gyldene_freden');
            const blasieholmen = visited.includes('blasieholmen') || visited.includes('pechlin_house');

            if (norrmalm && gamlastan && blasieholmen) {
                unlockIfNew('street_smart');
            }

            // Palaces
            if (visited.includes('slott_courtyard') && visited.includes('pechlin_house')) {
                unlockIfNew('palace_visitor');
            }
        }

        // Check social achievements
        function checkSocialAchievements() {
            const people = Game.achievementStats.peopleSpokenTo;

            if (people.length >= 10) {
                unlockIfNew('social_butterfly');
            }

            if (people.includes('bellman') && people.filter(p => p === 'bellman').length >= 3) {
                unlockIfNew('bellman_friend');
            }

            if (people.includes('gustav_iii') || people.includes('gustav_iii_dining')) {
                unlockIfNew('king_audience');
            }
        }

        // Check evidence achievements
        function checkEvidenceAchievements() {
            const inv = Game.player.inventory;

            if (inv.includes('pistol_list')) {
                unlockIfNew('pistol_tracker');
            }

            if (Game.player.knowledge.includes('heard_conspiracy')) {
                unlockIfNew('master_spy');
            }

            if (inv.includes('anckarstrom_pistols') || inv.includes('anckarstrom_knife')) {
                unlockIfNew('break_in_artist');
            }

            if (inv.includes('pistol_list') && inv.includes('anckarstrom_note') && inv.includes('dokument')) {
                unlockIfNew('evidence_collector');
            }
        }

        // Check ending collection
        function checkEndingAchievements() {
            const endings = Game.achievementStats.endingsSeen;

            if (endings.length >= 2) {
                unlockIfNew('ending_collector_2');
            }

            if (endings.length >= 4) {
                unlockIfNew('ending_collector_4');
            }

            if (endings.length >= 6) {
                unlockIfNew('ending_collector_all');
            }
        }

        // Check skill achievements at ending
        function checkSkillAchievements() {
            const playTime = Date.now() - Game.achievementStats.startTime;
            const minutes = playTime / 60000;

            if (minutes < 90 && Game.player.questProgress.savedKing) {
                unlockIfNew('speedrunner');
            }

            if (Game.player.stats.hintsUsed === 0 && Game.player.questProgress.savedKing) {
                unlockIfNew('no_hints');
            }

            if (Game.achievementStats.commandCount < 100 && Game.player.questProgress.savedKing) {
                unlockIfNew('minimalist');
            }
        }

        // Check time-based achievements
        function checkTimeAchievements() {
            if (Game.currentTime.hour >= 0 && Game.currentTime.hour < 6) {
                unlockIfNew('night_owl');
            }

            if (Game.currentTime.day >= 16) {
                unlockIfNew('time_traveler');
            }
        }

        // Check for grand master
        function checkGrandMaster() {
            const totalAchievements = Object.keys(Achievements).length - 1; // -1 for grand_master itself
            const unlocked = Game.player.stats.achievements.length;

            if (unlocked >= totalAchievements) {
                unlockIfNew('grand_master');
            }
        }

        // Helper: Unlock if not already unlocked
        function unlockIfNew(achievementId) {
            if (!Game.player.stats.achievements.includes(achievementId)) {
                if (typeof GameEngine !== 'undefined' && GameEngine.unlockAchievement) {
                    GameEngine.unlockAchievement(achievementId);
                }
                checkGrandMaster();
            }
        }

        // ===== INTEGRATE WITH EXISTING SYSTEMS =====

        // Override cmdTalk to track people
        if (typeof GameEngine !== 'undefined') {
            const originalCmdTalk = GameEngine.cmdTalk;
            GameEngine.cmdTalk = function(target) {
                originalCmdTalk.call(this, target);

                const room = Rooms[Game.player.currentRoom];
                if (room.characters) {
                    for (let charId of room.characters) {
                        const char = Characters[charId];
                        if (char && char.keywords.some(k => target.includes(k))) {
                            Game.achievementStats.peopleSpokenTo.push(charId);
                            checkSocialAchievements();
                            break;
                        }
                    }
                }
            };

            // Override cmdTake to track items
            const originalCmdTake = GameEngine.cmdTake;
            GameEngine.cmdTake = function(itemName) {
                originalCmdTake.call(this, itemName);
                checkEvidenceAchievements();
            };

            // Override cmdExamine to track documents
            const originalCmdExamine = GameEngine.cmdExamine;
            GameEngine.cmdExamine = function(target) {
                originalCmdExamine.call(this, target);

                // Track document reading
                if (target.includes('brev') || target.includes('dokument') || target.includes('anteckn') || target.includes('lapp')) {
                    if (!Game.achievementStats.documentsRead.includes(target)) {
                        Game.achievementStats.documentsRead.push(target);

                        if (Game.achievementStats.documentsRead.length >= 5) {
                            unlockIfNew('document_reader');
                        }
                    }
                }
            };
        }

        // ===== ENDING TRACKING =====
        if (typeof showEnding !== 'undefined') {
            const originalShowEnding = showEnding;
            window.showEnding = function(endingId) {
                // Track ending
                if (!Game.achievementStats.endingsSeen.includes(endingId)) {
                    Game.achievementStats.endingsSeen.push(endingId);
                }

                // Check skill achievements
                checkSkillAchievements();
                checkEndingAchievements();

                // Unlock specific ending achievements
                if (endingId === 'perfect_victory') {
                    unlockIfNew('perfect_victory');
                }

                if (endingId === 'narrow_victory') {
                    unlockIfNew('narrow_escape');
                }

                if (endingId === 'failed_king_dies') {
                    unlockIfNew('failed_mission');
                }

                originalShowEnding(endingId);
            };
        }

        // ===== PERIODIC CHECKS =====
        setInterval(function() {
            if (Game.flags.gameStarted) {
                checkTimeAchievements();
                checkExplorationAchievements();
                checkEvidenceAchievements();
            }
        }, 30000); // Every 30 seconds

        console.log('🏆 Expanded Achievements System loaded!');
        console.log(`📊 Total achievements: ${Object.keys(Achievements).length}`);

    }, 600);
});

// ===== ACHIEVEMENT VIEWER =====
// Add command to view all achievements
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        if (typeof GameEngine !== 'undefined') {
            const originalProcessCommand = GameEngine.processCommand;
            GameEngine.processCommand = function(input) {
                const parsed = Parser.parse(input);

                if (parsed.verb === 'achievements' || input.includes('prestationer')) {
                    showAchievementList();
                    return;
                }

                originalProcessCommand.call(this, input);
            };
        }

        function showAchievementList() {
            const unlocked = Game.player.stats.achievements;
            const total = Object.keys(Achievements).length;

            let output = `<div style="border: 2px solid var(--accent-gold); padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">`;
            output += `<h2 style="color: var(--accent-gold); margin-bottom: 1rem;">🏆 PRESTATIONER (${unlocked.length}/${total})</h2>`;

            // Group by category
            const categories = {
                'story': '📖 STORY',
                'victory': '👑 SEGRAR',
                'dark': '⚫ MÖRKA VÄGAR',
                'exploration': '🗺️ UTFORSKNING',
                'social': '👥 SOCIALT',
                'evidence': '🔍 BEVIS',
                'special': '✨ SPECIAL',
                'endings': '🎬 ENDINGS',
                'skill': '🎯 SKICKLIGHET',
                'fun': '🎉 ROLIGT',
                'master': '⭐ MÄSTARE'
            };

            for (let [cat, title] of Object.entries(categories)) {
                const catAchievements = Object.entries(Achievements).filter(([id, a]) => a.category === cat);
                if (catAchievements.length === 0) continue;

                output += `<h3 style="color: var(--accent-blue); margin-top: 1.5rem; margin-bottom: 0.5rem;">${title}</h3>`;

                for (let [id, achievement] of catAchievements) {
                    const isUnlocked = unlocked.includes(id);
                    const opacity = isUnlocked ? '1' : '0.3';

                    output += `<div style="opacity: ${opacity}; margin: 0.5rem 0; padding: 0.5rem; background: rgba(255,255,255,0.05); border-radius: 4px;">`;
                    output += `<strong>${achievement.icon} ${achievement.name}</strong>`;
                    output += `<br><span style="font-size: 0.9rem; color: var(--text-secondary);">${achievement.description}</span>`;
                    if (isUnlocked) {
                        output += ` <span style="color: var(--accent-gold);">✓</span>`;
                    } else {
                        output += ` <span style="color: var(--text-secondary);">🔒</span>`;
                    }
                    output += `</div>`;
                }
            }

            output += `</div>`;

            if (typeof GameEngine !== 'undefined') {
                GameEngine.output(output);
            }
        }

    }, 700);
});
