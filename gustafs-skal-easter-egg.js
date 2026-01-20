// ==========================================
// GUSTAFS SKÅL - EASTER EGG ARC
// ==========================================
// Add this to game after other scripts load

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {

        // Track if player has heard the song in different contexts
        if (!Game.flags) Game.flags = {};
        Game.flags.heardGustafsSkol = {
            freden: false,
            drabant: false,
            victory: false
        };

        // Add brännvin item to Den Gyldene Freden
        if (Rooms.den_gyldene_freden) {
            if (!Rooms.den_gyldene_freden.items) {
                Rooms.den_gyldene_freden.items = [];
            }
            if (!Rooms.den_gyldene_freden.items.includes('brännvin')) {
                Rooms.den_gyldene_freden.items.push('brännvin');
            }
        }

        // Add brännvin item definition
        if (Items && !Items.brännvin) {
            Items.brännvin = {
                name: 'brännvin',
                description: 'Ett stop kryddat brännvin. Lukten är stark - kummin och anis. Detta kommer Bellman uppskatta!',
                takeable: true,
                useable: false,
                keywords: ['brännvin', 'sprit', 'dryck']
            };
        }

        // Extend Bellman's dialogue
        if (Characters && Characters.bellman) {
            if (!Characters.bellman.dialogue.give_brannvin) {
                Characters.bellman.dialogue.give_brannvin = function() {
                    Game.flags.heardGustafsSkol.freden = true;

                    return `<div class="dialogue">
Bellman tar emot brännvinsstopet med glänsande ögon!

"Ah! En riktig vän! Detta förtjänar en sång!"

Han reser sig vingligt, höjer glaset och börjar sjunga med full stämma:

<div style="font-style: italic; padding: 1rem; border-left: 3px solid var(--accent-gold); margin: 1rem 0; background: rgba(212, 175, 55, 0.1);">
🎵 <strong>Gustafs skål!</strong><br>
Den bäste kung som Norden äger<br>
Han ej tål<br>
Att vigtskåln ojämt väger<br><br>

God och glad<br>
Han ilskans röst föraktar<br>
Samt avvaktar och betraktar<br>
Dårskap i sin grad<br><br>

Sådan kung<br>
Är värd att styra Sveriges öden<br>
Rask och ung<br>
Ej rådlös uti nöden<br><br>

Vasa ätt<br>
Har aldrig lärt att svika<br>
Aldrig tvika, men att fika<br>
Till att göra rätt! 🎵
</div>

Hela krogen applåderar! Folk höjer sina stop och ropar "SKÅL!"

<span class="important">Du har upplevt Gustafs skål med Bellman själv!</span>
</div>`;
                };
            }
        }

        // Add Gustafs skål scene to Drabantsalen
        if (Rooms && Rooms.drabant_hall) {
            const originalDesc = Rooms.drabant_hall.description;

            // Add special action to listen to song
            if (!Rooms.drabant_hall.specialActions) {
                Rooms.drabant_hall.specialActions = {};
            }

            Rooms.drabant_hall.specialActions.listen_song = function() {
                if (Game.flags.heardGustafsSkol.drabant) {
                    return "Du har redan hört hovmännen sjunga Gustafs skål.";
                }

                Game.flags.heardGustafsSkol.drabant = true;

                return `<div class="narrator">
Du står vid dörren och lyssnar...

Plötsligt reser sig von Essen med sitt vinkupa:

"En skål för Hans Majestät!"

Alla vid bordet reser sig. Löwenhielm börjar sjunga, och de andra stämmer in:

<div style="font-style: italic; padding: 1rem; border-left: 3px solid var(--accent-gold); margin: 1rem 0; background: rgba(212, 175, 55, 0.1);">
🎵 <strong>Gustafs skål!</strong><br>
Den bäste kung som Norden äger<br>
Han ej tål<br>
Att vigtskåln ojämt väger<br><br>

God och glad<br>
Han ilskans röst föraktar<br>
Samt avvaktar och betraktar<br>
Dårskap i sin grad<br><br>

Sådan kung<br>
Är värd att styra Sveriges öden<br>
Rask och ung<br>
Ej rådlös uti nöden<br><br>

Vasa ätt<br>
Har aldrig lärt att svika<br>
Aldrig tvika, men att fika<br>
Till att göra rätt! 🎵
</div>

Kungen ler brett och höjer sitt glas med dem.

<span class="important">Du har hört hovet sjunga Gustafs skål!</span>

Men du känner en kyla... i morgon, om du inte lyckas, kommer dessa män att sörja sin kung istället.
</div>`;
            };
        }

        // Override integration.js cmdGive to handle brännvin
        if (typeof GameEngine !== 'undefined') {
            const originalCmdGive = GameEngine.cmdGive;

            GameEngine.cmdGive = function(query) {
                const parts = query.split(' till ');
                if (parts.length >= 2) {
                    const itemName = parts[0].trim();
                    const personName = parts[1].trim();

                    // Check for brännvin to Bellman
                    if (itemName.includes('brännvin') && personName.includes('bellman')) {
                        // Check if player has brännvin
                        if (!Game.player.inventory.includes('brännvin')) {
                            this.output("Du har inget brännvin.");
                            return;
                        }

                        // Check if Bellman is here
                        const room = Rooms[Game.player.currentRoom];
                        if (!room.characters || !room.characters.includes('bellman')) {
                            this.output("Bellman är inte här.");
                            return;
                        }

                        // Remove brännvin from inventory
                        Game.player.inventory = Game.player.inventory.filter(i => i !== 'brännvin');

                        // Show the song!
                        const result = Characters.bellman.dialogue.give_brannvin();
                        this.output(result);

                        // Check if player has heard all three
                        checkGustafsSkålAchievement();

                        return;
                    }
                }

                // Call original
                originalCmdGive.call(this, query);
            };
        }

        // Add listen command
        if (typeof Parser !== 'undefined') {
            const originalParse = Parser.parse;
            Parser.parse = function(input) {
                const result = originalParse.call(this, input);

                if (input.includes('lyssna') || input.includes('listen')) {
                    result.verb = 'lyssna';
                }

                return result;
            };
        }

        // Handle listen command
        if (typeof GameEngine !== 'undefined') {
            const originalProcessCommand = GameEngine.processCommand;
            GameEngine.processCommand = function(input) {
                const parsed = Parser.parse(input);

                if (parsed.verb === 'lyssna' || parsed.verb === 'listen') {
                    const room = Rooms[Game.player.currentRoom];

                    if (Game.player.currentRoom === 'drabant_hall' && room.specialActions && room.specialActions.listen_song) {
                        const result = room.specialActions.listen_song();
                        this.output(result);
                        checkGustafsSkålAchievement();
                        return;
                    } else {
                        this.output("Du lyssnar noga... men hör inget särskilt intressant just nu.");
                        return;
                    }
                }

                // Call original
                originalProcessCommand.call(this, input);
            };
        }

        // Achievement checker
        function checkGustafsSkålAchievement() {
            if (Game.flags.heardGustafsSkol.freden &&
                Game.flags.heardGustafsSkol.drabant &&
                !Game.player.stats.achievements.includes('song_master')) {

                if (typeof GameEngine !== 'undefined' && GameEngine.unlockAchievement) {
                    GameEngine.unlockAchievement('song_master');
                }
            }
        }

        // Add new achievement
        if (typeof Achievements !== 'undefined') {
            Achievements.song_master = {
                name: 'Sångmästare',
                description: 'Hörde Gustafs skål i alla dess former',
                icon: '🎵'
            };
        }

        console.log('🎵 Gustafs skål easter egg loaded!');

    }, 500); // Delay to ensure other scripts are loaded
});

// ==========================================
// PERFECT VICTORY ENDING - ADD GUSTAFS SKÅL
// ==========================================

// Override the perfect victory ending to include the song
if (typeof Endings !== 'undefined') {
    setTimeout(function() {
        const originalPerfectVictory = Endings.perfect_victory.text;

        Endings.perfect_victory.text = `
<div class="ending-screen">
    <h1 class="ending-title">👑 DEN RÄDDADE KUNGEN 👑</h1>

    <p>Du står i Drabantsalen och ser kung Gustav III läsa dina bevis en sista gång.</p>

    <p>"${Game.player.name}," säger han och reser sig. "Ni har gjort en otrolig gärning. Utan er skulle jag varit död om några timmar."</p>

    <p>Polismästare Liljensparre bryter in genom dörren med soldater.</p>

    <p class="dialogue">"Ers Majestät! Vi har gripit Anckarström, Ribbing och Horn vid Operans ingång. De väntade på er med laddade vapen. Och Pechlin - även han är arresterad."</p>

    <p>Kungen nickar allvarligt.</p>

    <p>"Tack vare vår vän här," han pekar på dig, "har konspirationen avslöjats <em>innan</em> blodsutgjutelse. Sverige är räddat."</p>

    <p>Han vänder sig till von Essen och Löwenhielm:</p>

    <p>"Mina herrar - detta förtjänar en skål!"</p>

    <p>von Essen häller upp vin. Alla reser sig. Kungen höjer sitt glas och börjar sjunga med klar röst:</p>

    <div style="font-style: italic; padding: 1rem; border-left: 3px solid var(--accent-gold); margin: 1rem 0; background: rgba(212, 175, 55, 0.1);">
    🎵 <strong>Gustafs skål!</strong><br>
    Den bäste kung som Norden äger<br>
    Han ej tål<br>
    Att vigtskåln ojämt väger<br><br>

    God och glad<br>
    Han ilskans röst föraktar<br>
    Samt avvaktar och betraktar<br>
    Dårskap i sin grad<br><br>

    Sådan kung<br>
    Är värd att styra Sveriges öden<br>
    Rask och ung<br>
    Ej rådlös uti nöden<br><br>

    Vasa ätt<br>
    Har aldrig lärt att svika<br>
    Aldrig tvika, men att fika<br>
    Till att göra rätt! 🎵
    </div>

    <p>Hovmännen stämmer in. Sången ekar genom Operans salar.</p>

    <p>Plötsligt känner du en vibration i fickan. Din smartphone! Den lyser! Ett meddelande blinkar:</p>

    <p class="important">"TEMPORAL PARADOX LÖST. HISTORIELINJE STABILISERAD. ÅTERFÖRFLYTTNING AKTIVERAD OM 60 SEKUNDER."</p>

    <p>Gustav III ser förvirrat på den lysande apparaten.</p>

    <p>"Vad är...?"</p>

    <p>"Ett underverk, Ers Majestät," svarar du och ler. "Ett underverk från framtiden."</p>

    <p>Du böjer dig djupt.</p>

    <p>"Lev länge och väl. Och sjung denna sång ofta."</p>

    <p>Världen börjar flimra. Sången fortsätter eka i dina öron när slottet löses upp. Du faller genom tid och rum...</p>

    <p class="important">...och vaknar i 2026, i din egen säng.</p>

    <p>Du kollar snabbt Wikipedia på telefonen. Gustav III - <em>död 1809 av naturliga orsaker, efter en lång och framgångsrik regeringstid. Känd för sin kärlek till konst, kultur och sången "Gustafs skål".</em></p>

    <p>Du förändrade historien.</p>

    <p>Du räddade en kung.</p>

    <p>Och du kommer alltid minnas sången.</p>

    <p class="ending-stats">
        <strong>SPELSTATISTIK:</strong><br>
        Kapitel slutförda: ${Game.player.stats.chapter}/3<br>
        Achievements: ${Game.player.stats.achievements.length}/${Object.keys(Achievements).length}<br>
        Hints använda: ${Game.player.stats.hintsUsed}<br>
        Speltid: ${calculatePlaytime()}<br>
        <br>
        <strong class="golden">PERFEKT SLUT - Du räddade kungen med övertygande bevis!</strong>
        ${Game.flags.heardGustafsSkol && Game.flags.heardGustafsSkol.freden && Game.flags.heardGustafsSkol.drabant ? '<br><br>🎵 <em>Du hörde Gustafs skål genom hela historien - från krogens bord till kungens sal.</em>' : ''}
    </p>
</div>`;

        // Mark as heard in victory
        if (typeof showEnding !== 'undefined') {
            const originalShowEnding = showEnding;
            window.showEnding = function(endingId) {
                if (endingId === 'perfect_victory') {
                    if (!Game.flags.heardGustafsSkol) Game.flags.heardGustafsSkol = {};
                    Game.flags.heardGustafsSkol.victory = true;
                    checkGustafsSkålAchievement();
                }
                originalShowEnding(endingId);
            };
        }

    }, 600);
}

// Helper function for achievement check
function checkGustafsSkålAchievement() {
    if (Game.flags.heardGustafsSkol &&
        Game.flags.heardGustafsSkol.freden &&
        Game.flags.heardGustafsSkol.drabant &&
        !Game.player.stats.achievements.includes('song_master')) {

        if (typeof GameEngine !== 'undefined' && GameEngine.unlockAchievement) {
            GameEngine.unlockAchievement('song_master');
        }
    }
}
