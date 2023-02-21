<template>
    <div class="flex flex-col bg-slate-700/[0.5] rounded-lg p-2 mt-2 w-[40em] max-w-[100%] border-2 border-slate-700">
        <div id="preview" class="flow grow-0 cover-prev rounded-lg bg-slate-70 0 h-[10em] md:h-[15em] lg:h-[20em] m-2 border-2 border-slate-500 overflow-hidden">
            <div class="flex w-full h-full max-h-[100%] overflow-hidden">
                <div id="div-lyrics" class="flex grow flex-col justify-center transition-all bg-black/[0]">
                    <div id="lyrics" class="flex grow flex-col px-2 overflow-x-hidden transition-all py-[10%] opacity-0 pointer-events-none">
                        <p class="paroles">Loading ...</p>
                    </div>
                </div>
            </div>
            <div class="flex justify-end w-full h-0">
                <div class="absolute w-0 h-0">
                    <div
                        id="show-lyrics-btn"
                        class="absolute bottom-1 right-1 w-fit h-fit border-2 border-slate-400 rounded p-1 bg-slate-700/[0.5] text-slate-300 hover:text-slate-100 hover:border-slate-300 hover:bg-slate-500/[0.6] cursor-pointer transition-all"
                    >
                        <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"></path>
                            <circle cx="17" cy="7" r="5"></circle>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex grow-0 mt-8 mx-2 justify-center min-w-0">
            <h1 id="title" class="text-slate-200 font-bold text-xl text-ellipsis max-w-full overflow-hidden whitespace-nowrap"> - - - - - </h1>
        </div>
        <div class="flex grow-0 mt-4 text-slate-400 font-semibold mx-2">
            <div id="progress" class="flex flex-col justify-center"> <!-- TIMER LEFT -->
                00 : 00
            </div>
            <div class="flex grow flex-col justify-center mx-2">
                <div class="flex h-1 bg-slate-500 rounded-lg">
                    <div id="bar" class="flex bg-slate-200 rounded-lg transition-all" style="width: 0%"></div>
                </div>
            </div>
            <div id="time" class="flex flex-col justify-center"> <!-- TIMER RIGHT -->
                00 : 00
            </div>
        </div>
        <div class="flex grow h-fit mx-2 mt-8 font-semibold ">
            <div id="btn-sound" class="flex m-2">
                <div
                    class="flex h-fit w-fit rounded-lg border-2 border-slate-600 bg-slate-700/[0.5] text-slate-500 hover:bg-slate-600/[0.5] hover:text-slate-300 hover:border-slate-500 p-2 transition-all cursor-pointer"
                >
                    <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                    </svg>
                </div>

                <div class="w-0 h-0">
                    <div class="flex w-fit h-fit">
                        <span class="border-4 border-transparent"></span>
                        <div id="sound-panel" class="flex justify-center flex-col w-fit h-9 my-1 rounded-md border-slate-600 bg-slate-700/[0.5] transition-all overflow-hidden" style="max-width: 0px">
                            <div id="sound-panel-child" class="w-20 m-2">
                                <div class="flex flex-col justify-center">
                                    <div class="flex h-2 bg-slate-500 rounded pointer-events-none">
                                        <div id="sound-bar" class="flex bg-slate-50 rounded transition-all" style="width: 50%"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-center mx-auto">
                <div
                    id="btn-prev"
                    :class="'opacity-0 pointer-events-none'"
                    class="flex rounded-lg border-2 border-slate-600 bg-slate-700/[0.5] text-slate-500 hover:bg-slate-600/[0.5] hover:text-slate-300 hover:border-slate-500 p-2 m-2 transition-all cursor-pointer"
                >
                    <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="19 20 9 12 19 4 19 20"></polygon>
                        <line x1="5" y1="19" x2="5" y2="5"></line>
                    </svg>
                </div>
                <div
                    id="btn-play"
                    class="flex rounded-lg border-2 border-slate-600 bg-slate-700/[0.5] text-slate-500 hover:bg-slate-600/[0.5] hover:text-slate-300 hover:border-slate-500 p-2 m-2 transition-all cursor-pointer"
                >
                    <svg class="w-6 h-6 mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                </div>
                <div
                    id="btn-next"
                    class="flex rounded-lg border-2 border-slate-600 bg-slate-700/[0.5] text-slate-500 hover:bg-slate-600/[0.5] hover:text-slate-300 hover:border-slate-500 p-2 m-2 transition-all cursor-pointer"
                >
                    <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="5 4 15 12 5 20 5 4"></polygon>
                        <line x1="19" y1="5" x2="19" y2="19"></line>
                    </svg>
                </div>
            </div>

            <div class="opacity-0 pointer-events-none w-10 h-8 m-2"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Player",
    props: {
        init: {
            type: Function,
            required: false,
            default: (obj) => {},
        },
    },
    data() {
        return {showLyrics: false, playing: false};
    },
    methods: {
        setPlaying(playing) {
            this.playing = playing;
        },
        setShowLyrics(showLyrics) {
            this.showLyrics = showLyrics;
            if (!showLyrics) {
                const container = document.getElementById("lyrics");
                for (let i = 0; i < container.childElementCount; i++) {
                    const child = container.children[i];
                    if (child.classList.contains("selected")) {
                        container.scrollTo({
                            top: child.offsetTop,
                            behavior: "smooth"
                        });
                        break;
                    }
                }
            }
        },
    },
    mounted() {
        this.init(this);
    },
}
</script>