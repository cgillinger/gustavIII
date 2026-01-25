// ═══════════════════════════════════════════════════════════════════════════
// DEBUG SYSTEM - Loggning och felsökning
// ═══════════════════════════════════════════════════════════════════════════
//
// AKTIVERING:
//   Lägg till ?debug i URL:en, t.ex.:
//   - index.html?debug
//   - index.html?debug=true
//
// FUNKTIONER:
//   - Loggar alla spelarkommandon och spelets svar
//   - Visar aktuella flaggor i en panel
//   - Exporterar logg till nedladdningsbar fil
//   - Markerar "Jag förstår inte"-svar för enkel identifiering
//
// DEBUG-KOMMANDON (i spelet):
//   - "debug export" - Ladda ner loggen som JSON-fil
//   - "debug flags" - Visa alla flaggor i output
//   - "debug clear" - Rensa loggen
//   - "debug teleport [rum]" - Teleportera till rum
//   - "debug give [item]" - Ge dig själv ett item
//
// ═══════════════════════════════════════════════════════════════════════════

(function() {
    'use strict';

    // Kolla om debug-läge är aktiverat via URL
    const urlParams = new URLSearchParams(window.location.search);
    const DEBUG_ENABLED = urlParams.has('debug') || window.location.hash.includes('debug');

    if (!DEBUG_ENABLED) {
        console.log('🔇 Debug mode disabled. Add ?debug to URL to enable.');
        return;
    }

    console.log('🐛 DEBUG MODE ENABLED');

    // ═══════════════════════════════════════════════════════════════════
    // DEBUG STATE
    // ═══════════════════════════════════════════════════════════════════

    const DebugSystem = {
        enabled: true,
        log: [],
        sessionStart: new Date().toISOString(),
        unhandledCommands: [],
        commandStats: {},

        // Lägg till en loggpost
        addEntry: function(type, data) {
            const entry = {
                timestamp: new Date().toISOString(),
                type: type,
                room: typeof Game !== 'undefined' ? Game.player.currentRoom : 'unknown',
                ...data
            };

            this.log.push(entry);

            // Spara till localStorage för persistens
            this.saveToStorage();

            // Logga till konsolen
            if (type === 'input') {
                console.log(`📝 INPUT: "${data.command}" [${entry.room}]`);
            } else if (type === 'output') {
                const preview = data.text.substring(0, 100).replace(/<[^>]*>/g, '');
                console.log(`📤 OUTPUT: ${preview}...`);
            } else if (type === 'unhandled') {
                console.warn(`⚠️ UNHANDLED: "${data.command}"`);
                this.unhandledCommands.push(data.command);
            }
        },

        // Hämta aktuella flaggor
        getFlags: function() {
            if (typeof Game === 'undefined') return {};

            return {
                currentRoom: Game.player.currentRoom,
                questProgress: { ...Game.player.questProgress },
                inventory: [...Game.player.inventory],
                knowledge: Game.player.knowledge ? [...Game.player.knowledge] : [],
                hasModernClothes: Game.player.hasModernClothes,
                stats: { ...Game.player.stats },
                currentTime: typeof Game.currentTime !== 'undefined' ? { ...Game.currentTime } : null,
                flags: typeof Game.flags !== 'undefined' ? { ...Game.flags } : {}
            };
        },

        // Spara till localStorage
        saveToStorage: function() {
            try {
                localStorage.setItem('debug_log', JSON.stringify(this.log.slice(-500))); // Spara senaste 500
                localStorage.setItem('debug_session', this.sessionStart);
            } catch (e) {
                console.warn('Could not save debug log to localStorage');
            }
        },

        // Ladda från localStorage
        loadFromStorage: function() {
            try {
                const savedLog = localStorage.getItem('debug_log');
                const savedSession = localStorage.getItem('debug_session');

                if (savedLog && savedSession === this.sessionStart) {
                    this.log = JSON.parse(savedLog);
                }
            } catch (e) {
                console.warn('Could not load debug log from localStorage');
            }
        },

        // Exportera logg till fil
        exportLog: function() {
            const exportData = {
                sessionStart: this.sessionStart,
                exportTime: new Date().toISOString(),
                totalCommands: this.log.filter(e => e.type === 'input').length,
                unhandledCommands: this.unhandledCommands,
                commandStats: this.commandStats,
                currentFlags: this.getFlags(),
                log: this.log
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `gustav3-debug-${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            console.log('📁 Debug log exported!');
            return exportData;
        },

        // Rensa logg
        clearLog: function() {
            this.log = [];
            this.unhandledCommands = [];
            this.commandStats = {};
            localStorage.removeItem('debug_log');
            console.log('🗑️ Debug log cleared');
        },

        // Uppdatera kommandostatistik
        trackCommand: function(verb) {
            if (!this.commandStats[verb]) {
                this.commandStats[verb] = 0;
            }
            this.commandStats[verb]++;
        }
    };

    // Exportera globalt
    window.DebugSystem = DebugSystem;

    // ═══════════════════════════════════════════════════════════════════
    // HOOK INTO GAME ENGINE
    // ═══════════════════════════════════════════════════════════════════

    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {

            if (typeof GameEngine === 'undefined') {
                console.error('GameEngine not found - debug hooks not installed');
                return;
            }

            // Hook processCommand för att logga input
            const originalProcessCommand = GameEngine.processCommand;
            GameEngine.processCommand = function(input) {
                if (!input || !input.trim()) return;

                const trimmedInput = input.trim().toLowerCase();

                // Debug-kommandon
                if (trimmedInput.startsWith('debug ')) {
                    handleDebugCommand(trimmedInput, this);
                    return;
                }

                // Logga input
                DebugSystem.addEntry('input', {
                    command: input.trim(),
                    flags: DebugSystem.getFlags()
                });

                // Spåra verb
                const verb = trimmedInput.split(/\s+/)[0];
                DebugSystem.trackCommand(verb);

                // Anropa original
                return originalProcessCommand.call(this, input);
            };

            // Hook output för att logga svar
            const originalOutput = GameEngine.output;
            GameEngine.output = function(text) {
                // Logga output
                DebugSystem.addEntry('output', {
                    text: text,
                    isUnhandled: text.includes('Jag förstår inte') || text.includes('förstår inte det kommandot')
                });

                // Kolla om det var ett "förstår inte"-svar
                if (text.includes('Jag förstår inte') || text.includes('förstår inte det kommandot')) {
                    const lastInput = DebugSystem.log.filter(e => e.type === 'input').pop();
                    if (lastInput) {
                        DebugSystem.addEntry('unhandled', {
                            command: lastInput.command,
                            room: lastInput.room
                        });
                    }
                }

                // Anropa original
                return originalOutput.call(this, text);
            };

            console.log('   ✓ Debug hooks installed on GameEngine');

            // Skapa debug-panel
            createDebugPanel();

        }, 1500); // Vänta på att alla andra scripts laddats
    });

    // ═══════════════════════════════════════════════════════════════════
    // DEBUG COMMANDS
    // ═══════════════════════════════════════════════════════════════════

    function handleDebugCommand(input, engine) {
        const parts = input.split(/\s+/);
        const cmd = parts[1];
        const arg = parts.slice(2).join(' ');

        switch (cmd) {
            case 'export':
                const data = DebugSystem.exportLog();
                engine.output(`<div class="debug">📁 Debug-logg exporterad! ${data.totalCommands} kommandon, ${data.unhandledCommands.length} ohanterade.</div>`);
                break;

            case 'flags':
                const flags = DebugSystem.getFlags();
                engine.output(`<div class="debug"><pre>${JSON.stringify(flags, null, 2)}</pre></div>`);
                break;

            case 'clear':
                DebugSystem.clearLog();
                engine.output(`<div class="debug">🗑️ Debug-logg rensad.</div>`);
                break;

            case 'teleport':
            case 'tp':
                if (arg && typeof Rooms !== 'undefined' && Rooms[arg]) {
                    Game.player.currentRoom = arg;
                    engine.showRoom(arg);
                    engine.output(`<div class="debug">🚀 Teleporterad till: ${arg}</div>`);
                } else {
                    const roomList = Object.keys(Rooms).join(', ');
                    engine.output(`<div class="debug">Rum finns inte. Tillgängliga rum:\n${roomList}</div>`);
                }
                break;

            case 'give':
                if (arg && typeof Items !== 'undefined' && Items[arg]) {
                    if (!Game.player.inventory.includes(arg)) {
                        Game.player.inventory.push(arg);
                    }
                    engine.output(`<div class="debug">🎁 Fick: ${Items[arg].name || arg}</div>`);
                } else {
                    const itemList = Object.keys(Items).join(', ');
                    engine.output(`<div class="debug">Item finns inte. Tillgängliga items:\n${itemList}</div>`);
                }
                break;

            case 'setflag':
                if (arg) {
                    const [flagPath, value] = arg.split('=');
                    try {
                        eval(`Game.player.${flagPath} = ${value}`);
                        engine.output(`<div class="debug">🚩 Flagga satt: ${flagPath} = ${value}</div>`);
                    } catch (e) {
                        engine.output(`<div class="debug">❌ Kunde inte sätta flagga: ${e.message}</div>`);
                    }
                }
                break;

            case 'time':
                if (typeof Game.currentTime !== 'undefined') {
                    if (arg) {
                        const [day, hour] = arg.split(':').map(Number);
                        if (day) Game.currentTime.day = day;
                        if (hour) Game.currentTime.hour = hour;
                        engine.output(`<div class="debug">⏰ Tid ändrad till: Dag ${Game.currentTime.day}, ${Game.currentTime.hour}:00</div>`);
                    } else {
                        engine.output(`<div class="debug">⏰ Nuvarande tid: Dag ${Game.currentTime.day}, ${Game.currentTime.hour}:${Game.currentTime.minute || 0}</div>`);
                    }
                }
                break;

            case 'stats':
                engine.output(`<div class="debug"><strong>Kommandostatistik:</strong><pre>${JSON.stringify(DebugSystem.commandStats, null, 2)}</pre></div>`);
                break;

            case 'unhandled':
                const unhandled = [...new Set(DebugSystem.unhandledCommands)];
                engine.output(`<div class="debug"><strong>Ohanterade kommandon (${unhandled.length}):</strong>\n${unhandled.join('\n') || 'Inga!'}</div>`);
                break;

            case 'help':
            default:
                engine.output(`<div class="debug">
<strong>🐛 DEBUG-KOMMANDON:</strong>
• debug export - Ladda ner logg som JSON
• debug flags - Visa alla flaggor
• debug clear - Rensa loggen
• debug teleport [rum] - Teleportera till rum
• debug give [item] - Ge dig själv ett item
• debug setflag [path=value] - Sätt flagga
• debug time [dag:timme] - Visa/ändra tid
• debug stats - Visa kommandostatistik
• debug unhandled - Lista ohanterade kommandon
</div>`);
        }
    }

    // ═══════════════════════════════════════════════════════════════════
    // DEBUG PANEL (UI)
    // ═══════════════════════════════════════════════════════════════════

    function createDebugPanel() {
        // Skapa CSS för debug-panelen
        const style = document.createElement('style');
        style.textContent = `
            #debug-panel {
                position: fixed;
                bottom: 10px;
                right: 10px;
                width: 300px;
                max-height: 400px;
                background: rgba(0, 0, 0, 0.9);
                border: 1px solid #c9a227;
                border-radius: 5px;
                font-family: monospace;
                font-size: 11px;
                color: #0f0;
                z-index: 10000;
                overflow: hidden;
            }

            #debug-panel.collapsed {
                max-height: 30px;
            }

            #debug-panel-header {
                background: #1a1a1a;
                padding: 5px 10px;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #c9a227;
            }

            #debug-panel-content {
                padding: 10px;
                max-height: 350px;
                overflow-y: auto;
            }

            #debug-panel.collapsed #debug-panel-content {
                display: none;
            }

            .debug-section {
                margin-bottom: 10px;
            }

            .debug-section-title {
                color: #c9a227;
                font-weight: bold;
                margin-bottom: 5px;
            }

            .debug-flag {
                display: flex;
                justify-content: space-between;
                padding: 2px 0;
            }

            .debug-flag-name {
                color: #888;
            }

            .debug-flag-value {
                color: #0f0;
            }

            .debug-flag-value.false {
                color: #f00;
            }

            .debug-flag-value.true {
                color: #0f0;
            }

            #debug-export-btn {
                background: #c9a227;
                color: #000;
                border: none;
                padding: 5px 10px;
                cursor: pointer;
                width: 100%;
                margin-top: 10px;
            }

            .debug {
                background: rgba(0, 50, 0, 0.5);
                border-left: 3px solid #0f0;
                padding: 10px;
                margin: 5px 0;
                font-family: monospace;
                white-space: pre-wrap;
            }
        `;
        document.head.appendChild(style);

        // Skapa panelen
        const panel = document.createElement('div');
        panel.id = 'debug-panel';
        panel.innerHTML = `
            <div id="debug-panel-header">
                <span>🐛 DEBUG</span>
                <span id="debug-toggle">▼</span>
            </div>
            <div id="debug-panel-content">
                <div class="debug-section">
                    <div class="debug-section-title">📍 Position</div>
                    <div id="debug-room">-</div>
                </div>
                <div class="debug-section">
                    <div class="debug-section-title">🚩 Flaggor</div>
                    <div id="debug-flags"></div>
                </div>
                <div class="debug-section">
                    <div class="debug-section-title">📊 Session</div>
                    <div id="debug-stats"></div>
                </div>
                <button id="debug-export-btn">📁 Exportera Logg</button>
            </div>
        `;
        document.body.appendChild(panel);

        // Toggle-funktion
        document.getElementById('debug-panel-header').addEventListener('click', function() {
            panel.classList.toggle('collapsed');
            document.getElementById('debug-toggle').textContent = panel.classList.contains('collapsed') ? '▲' : '▼';
        });

        // Export-knapp
        document.getElementById('debug-export-btn').addEventListener('click', function() {
            DebugSystem.exportLog();
        });

        // Uppdatera panelen regelbundet
        setInterval(updateDebugPanel, 1000);
    }

    function updateDebugPanel() {
        if (typeof Game === 'undefined') return;

        // Uppdatera rum
        const roomEl = document.getElementById('debug-room');
        if (roomEl) {
            const room = Rooms[Game.player.currentRoom];
            roomEl.textContent = `${Game.player.currentRoom} (${room ? room.name : 'unknown'})`;
        }

        // Uppdatera flaggor
        const flagsEl = document.getElementById('debug-flags');
        if (flagsEl) {
            const flags = DebugSystem.getFlags();
            let html = '';

            // Quest progress
            if (flags.questProgress) {
                for (let [key, value] of Object.entries(flags.questProgress)) {
                    html += `<div class="debug-flag">
                        <span class="debug-flag-name">${key}</span>
                        <span class="debug-flag-value ${value}">${value}</span>
                    </div>`;
                }
            }

            // Andra viktiga flaggor
            html += `<div class="debug-flag">
                <span class="debug-flag-name">hasModernClothes</span>
                <span class="debug-flag-value ${flags.hasModernClothes}">${flags.hasModernClothes}</span>
            </div>`;

            html += `<div class="debug-flag">
                <span class="debug-flag-name">inventory</span>
                <span class="debug-flag-value">${flags.inventory.length} items</span>
            </div>`;

            flagsEl.innerHTML = html;
        }

        // Uppdatera statistik
        const statsEl = document.getElementById('debug-stats');
        if (statsEl) {
            const inputCount = DebugSystem.log.filter(e => e.type === 'input').length;
            const unhandledCount = DebugSystem.unhandledCommands.length;
            statsEl.innerHTML = `
                <div class="debug-flag">
                    <span class="debug-flag-name">Kommandon</span>
                    <span class="debug-flag-value">${inputCount}</span>
                </div>
                <div class="debug-flag">
                    <span class="debug-flag-name">Ohanterade</span>
                    <span class="debug-flag-value ${unhandledCount > 0 ? 'false' : ''}">${unhandledCount}</span>
                </div>
            `;
        }
    }

    console.log('✅ Debug system loaded. Use ?debug in URL to activate.');

})();
