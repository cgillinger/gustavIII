// ==========================================
// ENDINGS SYSTEM
// ==========================================

const Endings = {
    // ENDING 1: Perfect Victory
    perfect_victory: {
        title: 'DEN RÄDDADE KUNGEN',
        achievement: 'king_saved',
        condition: function() {
            return Game.player.questProgress.savedKing &&
                   Game.player.inventory.includes('anckarstrom_note') &&
                   Game.player.inventory.includes('pistol_list');
        },
        text: `
<div class="ending-screen">
    <h1 class="ending-title">👑 DEN RÄDDADE KUNGEN 👑</h1>

    <p>Du står i Drabantsalen och ser kung Gustav III läsa dina bevis en sista gång.</p>

    <p>"${Game.player.name}," säger han och reser sig. "Ni har gjort en otrolig gärning. Utan er skulle jag varit död om några timmar."</p>

    <p>Polismästare Liljensparre bryter in genom dörren med soldater.</p>

    <p class="dialogue">"Ers Majestät! Vi har gripit Anckarström, Ribbing och Horn vid Operans ingång. De väntade på er med laddade vapen. Och Pechlin - även han är arresterad."</p>

    <p>Kungen nickar allvarligt.</p>

    <p>"Tack vare vår vän här," han pekar på dig, "har konspirationen avslöjats <em>innan</em> blodsutgjutelse. Sverige är räddat."</p>

    <p>Plötsligt känner du en vibration i fickan. Din smartphone! Den lyser! Ett meddelande blinkar:</p>

    <p class="important">"TEMPORAL PARADOX LÖST. HISTORIELINJE STABILISERAD. ÅTERFÖRFLYTTNING AKTIVERAD OM 60 SEKUNDER."</p>

    <p>Gustav III ser förvirrat på den lysande apparaten.</p>

    <p>"Vad är...?"</p>

    <p>"Ett underverk, Ers Majestät," svarar du och ler. "Ett underverk från framtiden."</p>

    <p>Du böjer dig djupt.</p>

    <p>"Lev länge och väl."</p>

    <p>Världen börjar flimra. Slottet löses upp. Du faller genom tid och rum...</p>

    <p class="important">...och vaknar i 2026, i din egen säng.</p>

    <p>Du kollar snabbt Wikipedia på telefonen. Gustav III - <em>död 1809 av naturliga orsaker, efter en lång och framgångsrik regeringstid.</em></p>

    <p>Du förändrade historien.</p>

    <p>Du räddade en kung.</p>

    <p class="ending-stats">
        <strong>SPELSTATISTIK:</strong><br>
        Kapitel slutförda: ${Game.player.stats.chapter}/3<br>
        Achievements: ${Game.player.stats.achievements.length}/6<br>
        Hints använda: ${Game.player.stats.hintsUsed}<br>
        Speltid: ${calculatePlaytime()}<br>
        <br>
        <strong class="golden">PERFEKT SLUT - Du räddade kungen med övertygande bevis!</strong>
    </p>
</div>`
    },

    // ENDING 2: Narrow Victory
    narrow_victory: {
        title: 'DET VAR PÅ VIPPEN',
        achievement: 'king_saved',
        condition: function() {
            return Game.player.questProgress.savedKing &&
                   !Game.player.inventory.includes('pistol_list');
        },
        text: `
<div class="ending-screen">
    <h1 class="ending-title">⚔️ DET VAR PÅ VIPPEN ⚔️</h1>

    <p>Maskeradbalen, klockan 23:45.</p>

    <p>Du ser Anckarström närma sig kungen genom folkmassan. Hans hand är under kappan. Ögonen fulla av hat.</p>

    <p><span class="warning">NU ELLER ALDRIG!</span></p>

    <p>Du kastar dig fram och griper Anckarströms arm just som han drar pistolen.</p>

    <p>"VAKT!" ropar du. "MÖRDARE!"</p>

    <p>Pistolen faller ur hans hand och smäller i golvet - men avfyras inte. Kungen vänder sig om, chockad.</p>

    <p>von Essen och Löwenhielm griper Anckarström. Ribbing och Horn försöker fly men fångas av soldater.</p>

    <p>Gustav III stirrar på dig.</p>

    <p>"Ni... räddade mitt liv. Vem är ni?"</p>

    <p>Du kan inte svara. Din smartphone börjar vibrera - tiden är ute.</p>

    <p class="important">"TEMPORALT FÖNSTER STÄNGS. ÅTERFÖRFLYTTNING NU."</p>

    <p>Du försvinner i en blixt framför kungens förvånade ögon...</p>

    <p>...och vaknar hemma i 2026.</p>

    <p>Wikipedia: <em>Gustav III överlevde ett mordförsök 1792. Attackerades av Anckarström men räddades av en okänd person som försvann på mystiskt sätt.</em></p>

    <p>Historien förändrad. Men bara knappt.</p>

    <p class="ending-stats">
        <strong>SPELSTATISTIK:</strong><br>
        Kapitel slutförda: ${Game.player.stats.chapter}/3<br>
        Achievements: ${Game.player.stats.achievements.length}/6<br>
        Hints använda: ${Game.player.stats.hintsUsed}<br>
        Speltid: ${calculatePlaytime()}<br>
        <br>
        <strong>BRÅKSLUT - Du stoppade mordet i sista sekund!</strong>
    </p>
</div>`
    },

    // ENDING 3: Failed - King Dies
    failed_king_dies: {
        title: 'HISTORIEN UPPREPAR SIG',
        achievement: null,
        condition: function() {
            return Game.currentTime.day === 16 &&
                   Game.currentTime.hour === 23 &&
                   Game.currentTime.minute >= 45 &&
                   !Game.player.questProgress.savedKing;
        },
        text: `
<div class="ending-screen failure">
    <h1 class="ending-title">💀 HISTORIEN UPPREPAR SIG 💀</h1>

    <p>Du hör det från andra sidan salongen.</p>

    <p>BANG!</p>

    <p>Ett pistolskott. Skrik. Musik som tystnar.</p>

    <p>Du tränger dig genom folkmassan och ser det:</p>

    <p>Kung Gustav III ligger på en bänk, blodig. von Essen trycker en duk mot såret. Anckarström grips av soldater.</p>

    <p>"Jag... är... blessé..." viskar kungen.</p>

    <p>Du misslyckades.</p>

    <p>Du hade tid. Du hade chanser. Men det räckte inte.</p>

    <p>Din smartphone vibrerar en sista gång:</p>

    <p class="important">"TEMPORAL MISSION MISSLYCKAD. HISTORIELINJE OFÖRÄNDRAD. FASTNAT I TIDSLINJE."</p>

    <p>Skärmen dör. För alltid.</p>

    <p>Du är fast här. I 1792. För evigt.</p>

    <p>13 dagar senare dör Gustav III av sina skador.</p>

    <p>Och du... du lever resten av ditt liv i en värld utan elektricitet, utan medicin, utan allt du kände.</p>

    <p>Som en främling i tiden.</p>

    <p class="ending-stats">
        <strong>SPELSTATISTIK:</strong><br>
        Kapitel slutförda: ${Game.player.stats.chapter}/3<br>
        Achievements: ${Game.player.stats.achievements.length}/6<br>
        Hints använda: ${Game.player.stats.hintsUsed}<br>
        Speltid: ${calculatePlaytime()}<br>
        <br>
        <strong class="failure">MISSLYCKANDE - Kungen dog. Du är fastlåst i historien.</strong>
    </p>

    <p><button onclick="location.reload()">Försök igen</button></p>
</div>`
    },

    // ENDING 4: Killed Anckarstrom
    vigilante_ending: {
        title: 'EGNA HÄNDER',
        achievement: 'dark_justice',
        condition: function() {
            return Game.flags.killedAnckarstrom;
        },
        text: `
<div class="ending-screen dark">
    <h1 class="ending-title">⚫ EGNA HÄNDER ⚫</h1>

    <p>Anckarströms lägenhet. Natten innan mordet.</p>

    <p>Han ligger på golvet. Du står över honom med hans egen pistol.</p>

    <p>"Varför..." viskar han med sista andetaget. "Varför stoppar du oss... tyrannens dagar borde vara räknade..."</p>

    <p>"För att mord är mord," svarar du kallt.</p>

    <p>Han dör.</p>

    <p>Du lämnar lägenheten. Ingen såg dig. Ingen vet.</p>

    <p>Nästa kväll går maskeradbalen av stapeln som planerat. Men Anckarström dyker aldrig upp. Varken Ribbing eller Horn vågar agera ensamma.</p>

    <p>Gustav III lever.</p>

    <p>Men till vilket pris?</p>

    <p>Din smartphone aktiverar återförflyttning. Du kommer hem till 2026.</p>

    <p>Wikipedia: <em>Gustav III, Sverige regerade längre. Jacob Johan Anckarström hittades mördad i sin lägenhet mars 1792. Mördaren greps aldrig.</em></p>

    <p>Du räddade kungen.</p>

    <p>Men du har blod på händerna.</p>

    <p class="ending-stats">
        <strong>SPELSTATISTIK:</strong><br>
        Kapitel slutförda: ${Game.player.stats.chapter}/3<br>
        Achievements: ${Game.player.stats.achievements.length}/6<br>
        Hints använda: ${Game.player.stats.hintsUsed}<br>
        Speltid: ${calculatePlaytime()}<br>
        <br>
        <strong class="dark">MÖRKT SLUT - Kungen lever, men till vilket pris?</strong>
    </p>
</div>`
    },

    // ENDING 5: Joined Conspirators
    conspiracy_ending: {
        title: 'DEN NYA ORDNINGEN',
        achievement: 'conspiracy_joined',
        condition: function() {
            return Game.flags.joinedConspiracy;
        },
        text: `
<div class="ending-screen conspiracy">
    <h1 class="ending-title">🗡️ DEN NYA ORDNINGEN 🗡️</h1>

    <p>Du tog ett annat val.</p>

    <p>I Pechlins salong accepterade du deras erbjudande.</p>

    <p>"Sverige behöver förändring," sa Pechlin. "Gå med oss, och skriv om framtiden."</p>

    <p>Och du gjorde det.</p>

    <p>Maskeradbalen. Midnatt. Du står bland de svarta kapporna.</p>

    <p>Anckarström avlossade skottet. Kungen föll.</p>

    <p>Men den här gången... den här gången organiserade du flykten. Med din kunskap om staden hjälpte du konspiratörerna undkomma.</p>

    <p>Gustav III dog. Gustav IV Adolf blev kung under förmyndare.</p>

    <p>Och du... du blev rådgivare åt den nya regimen. Med kunskap från framtiden formade du Sveriges öde.</p>

    <p>Din smartphone slocknade för evigt. Du kan aldrig återvända.</p>

    <p>Men du blev en legend. Den mystiska främlingen som hjälpte störta tyrannen.</p>

    <p>År 1809, när du är äldre, sker en ny revolution. Gustav IV Adolf avsätts.</p>

    <p>Och du ler. För du såg det komma.</p>

    <p class="ending-stats">
        <strong>SPELSTATISTIK:</strong><br>
        Kapitel slutförda: ${Game.player.stats.chapter}/3<br>
        Achievements: ${Game.player.stats.achievements.length}/6<br>
        Hints använda: ${Game.player.stats.hintsUsed}<br>
        Speltid: ${calculatePlaytime()}<br>
        <br>
        <strong class="conspiracy">ALTERNATIVT SLUT - Du valde andra sidan.</strong>
    </p>
</div>`
    },

    // ENDING 6: Warned but not believed
    cassandra_ending: {
        title: 'KASSANDRAS ÖDE',
        achievement: null,
        condition: function() {
            return Game.flags.warnedKingWithoutProof &&
                   Game.currentTime.day === 16 &&
                   Game.currentTime.minute >= 45;
        },
        text: `
<div class="ending-screen tragedy">
    <h1 class="ending-title">🎭 KASSANDRAS ÖDE 🎭</h1>

    <p>Du varnade honom.</p>

    <p>"Ers Majestät, ni är i fara! Anckarström planerar att mörda er ikväll!"</p>

    <p>Men utan bevis... utan konkreta fakta...</p>

    <p>"Jag känner till hoten," sa kungen kallt. "Och jag är inte rädd. Lämna mig."</p>

    <p>Och nu, klockan 23:45, på maskeradbalen...</p>

    <p>BANG!</p>

    <p>Kungen faller.</p>

    <p>Du stod bredvid honom. Du såg Anckarström. Men det var för sent.</p>

    <p>von Essen tittar på dig med förebråelse: "Ni varnade honom... varför lyssnade han inte?"</p>

    <p>För att ord utan bevis är bara vind.</p>

    <p>Du fastnar i 1792, levande med skulden att du VISSTE men inte kunde bevisa det.</p>

    <p>Som Kassandra i den grekiska myten - att se framtiden men aldrig bli trodd.</p>

    <p class="ending-stats">
        <strong>SPELSTATISTIK:</strong><br>
        Kapitel slutförda: ${Game.player.stats.chapter}/3<br>
        Achievements: ${Game.player.stats.achievements.length}/6<br>
        Hints använda: ${Game.player.stats.hintsUsed}<br>
        Speltid: ${calculatePlaytime()}<br>
        <br>
        <strong class="tragedy">TRAGISKT SLUT - Du visste men blev inte trodd.</strong>
    </p>

    <p><button onclick="location.reload()">Försök igen med bevis</button></p>
</div>`
    }
};

// Function to check and trigger appropriate ending
function checkEndings() {
    // Check in priority order
    if (Endings.perfect_victory.condition()) {
        showEnding('perfect_victory');
    } else if (Endings.narrow_victory.condition()) {
        showEnding('narrow_victory');
    } else if (Endings.vigilante_ending.condition()) {
        showEnding('vigilante_ending');
    } else if (Endings.conspiracy_ending.condition()) {
        showEnding('conspiracy_ending');
    } else if (Endings.cassandra_ending.condition()) {
        showEnding('cassandra_ending');
    } else if (Endings.failed_king_dies.condition()) {
        showEnding('failed_king_dies');
    }
}

function showEnding(endingId) {
    const ending = Endings[endingId];

    // Mark ending as seen
    Game.flags.endingSeen = endingId;

    // Unlock achievement if applicable
    if (ending.achievement) {
        GameEngine.unlockAchievement(ending.achievement);
    }

    // Clear output and show ending
    GameEngine.clearOutput();
    GameEngine.output(ending.text);

    // Hide input
    document.querySelector('.input-container').style.display = 'none';
    document.querySelector('.game-controls').style.display = 'none';

    // Set progress to 100%
    Game.player.stats.progress = 100;
    document.getElementById('progress-fill').style.width = '100%';
}

function calculatePlaytime() {
    // Rough calculation based on commands and time
    const minutes = Math.floor((Date.now() - Game.startTime) / 60000);
    if (minutes < 60) return `${minutes} minuter`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
}

// Add to Game object
Game.startTime = Date.now();
Game.flags.killedAnckarstrom = false;
Game.flags.joinedConspiracy = false;
Game.flags.warnedKingWithoutProof = false;
Game.flags.endingSeen = null;

// Export
window.Endings = Endings;
window.checkEndings = checkEndings;
window.showEnding = showEnding;
