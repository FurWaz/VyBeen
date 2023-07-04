<template>
    <div
        v-if="User.CurrentUser !== null"
        class="flex grow"
    >
        <div class="absolute top-0 right-0 w-screen h-screen bg-black">
            <div id="background" class="absolute top-0 right-0 w-screen h-screen bg-cover bg-center blur-3xl"></div>
            <div class="absolute top-0 right-0 w-screen h-screen flex grow bg-slate-900/[0.6]"></div>
        </div>
        <div class="flex grow flex-col z-50">
            <audio id="audio" src="" class="hidden"></audio>
            <vb-header></vb-header>
            <div class="flex grow min-w-0 min-h-0">
                <div class="flex grow flex-col justify-center px-4 min-w-0"> <!-- CONTENT -->
                    <div class="flex flex-col mx-auto p-1 min-w-0 max-w-full">
                        <!-- SEARCH BAR -->
                        <search></search>
                        <!-- VIEW -->
                        <player :init="obj => { player = obj; }"></player>
                    </div>
                </div>
                <drawer></drawer>
            </div>
        </div>
    </div>
    <div
        v-else
        class="show-up vybeen-popup hidden flex grow flex-col justify-center"
    >
        <div class="flex mx-auto w-fit">
            
            <div class="flex flex-col bg-slate-700 border-2 border-slate-600 shadow-lg rounded-lg">
                <h1 class="bg-slate-600 text-slate-200 font-bold text-xl py-2 px-4">VyBeen</h1>
                <div class="p-4">
                    <p class="text-slate-300 font-semibold"> You are currently not connected. </p>
                    <p class="text-slate-300 font-semibold"> Please log in to your FurWaz account to access VyBeen. </p>
                </div>
                <div class="flex grow-0 justify-between p-2">
                    <button-text :action="goBack"> Cancel </button-text>
                    <button-block :onclick="login"> Log In </button-block>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import Player from '../components/Player.vue';
import Search from '../components/Search.vue';
import VbHeader from '../components/VbHeader.vue';
import Drawer from '../components/Drawer.vue';
import ButtonBlock from '../components/ButtonBlock.vue';
import ButtonText from '../components/ButtonText.vue';

import Portal from 'https://cdn.furwaz.fr/api/portal.min.js';

import { toogleDrawer, showLyrics, doesShowLyrics, setPlayingIcon, displaySoundPanel, hideSoundPanel } from '../scripts/uiManager.js';
import { fetchInfos, requestSearch, startMainLoop, API_URL } from '../scripts/main';
import { setupEvents } from '../scripts/events';
import { fetchClients } from '../scripts/clients';
import User from '../scripts/User';

function setup() {
    if (User.CurrentUser == null) {
        const uis = document.getElementsByClassName('vybeen-ui');
        for (let i = 0; i < uis.length; i++) {
            uis[i].classList.add('hidden');
        }
        const popup = document.getElementsByClassName('vybeen-popup')[0];
        popup.classList.remove('hidden');
        return;
    }

    document.getElementById("show-lyrics-btn").addEventListener("click", ev => {
        showLyrics(!doesShowLyrics());
    });

    document.getElementById("btn-back").addEventListener("click", ev => {
        window.history.back();
    });

    document.getElementById("btn-toggle-drawer").addEventListener("click", ev => {
        toogleDrawer();
    });

    document.getElementById("btn-play").addEventListener("click", ev => {
        /**@type {HTMLAudioElement} */
        const audio = document.getElementById("audio");
        if (audio.paused) {
            audio.play();
            setPlayingIcon(true);
            startMainLoop();
        } else {
            audio.pause();
            setPlayingIcon(false);
        }
    });

    document.getElementById("btn-search").addEventListener("click", ev => {
        requestSearch(document.getElementById("search").value);
    });
    document.getElementById("search").addEventListener("keyup", ev => {
        if (ev.key == "Enter") {
            requestSearch(document.getElementById("search").value);
        }
    });

    let btnSound = document.getElementById("btn-sound");
    btnSound.addEventListener("mouseenter", ev => {
        displaySoundPanel();
    });
    btnSound.addEventListener("mouseleave", ev => {
        hideSoundPanel();
    });
}

export default {
    name: 'Home',
    data() {
        return {
            User
        }
    },
    components: {
        Player,
        Search,
        VbHeader,
        Drawer,
        ButtonBlock,
        ButtonText
    },
    mounted() {
        setup();
        if (User.CurrentUser !== null) {
            setupEvents();
            fetchInfos();
            fetchClients();
            startMainLoop();
        }
    },
    methods: {
        login() {
            fetch(API_URL + "/login").then(res => res.json()).then(json => {
                const token = json.token;
                const portal = new Portal(token);
                portal.open();
                portal.on('error', err => { console.error(err); });
                portal.on('response', infos => {
                    User.CurrentUser = infos;
                    window.location.reload();
                });
            }).catch(console.error);
        },
        goBack() {
            window.history.back();
        }
    }
}
</script>

<style>
/* random translation and rotation */
@keyframes float {
    0%, 100% {
        transform: translate(0, 0) rotate(0);
    }
    25% {
        transform: translate(4px, 0) rotate(-1deg);
    }
    50% {
        transform: translate(0, 4px) rotate(1deg);
    }
    75% {
        transform: translate(2px, 3px) rotate(-2deg);
    }
}

.cover-prev {
    background-image: url("");
    background-position: center;
    background-size: cover;
}

.blur-bg {
    backdrop-filter: blur(20px);
}

.paroles {
    @apply text-slate-200/[0.3] font-semibold md:text-lg text-base text-center my-2 mx-auto max-w-[80%] rounded-lg px-4 py-1 border border-transparent transition-all;
}
.selected {
    @apply text-slate-50 font-bold md:text-2xl text-xl bg-slate-50/[0.2] border-2 border-slate-50/[0.2];
    /* animation: float 4s cubic-bezier(.4,.2,.6,.8) infinite; */
}
a {
    @apply text-blue-500 font-bold;
}
</style>