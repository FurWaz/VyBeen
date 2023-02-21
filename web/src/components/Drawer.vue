<template>
    <div id="drawer" class="flex grow-0 flex-row w-0 overflow-hidden transition-all min-w-0">
        <span class="flex grow-0 min-w-[0.3em] rounded-lg md:bg-slate-600 bg-transparent"></span>
        <div class="flex grow flex-col mx-2 min-w-fit min-h-0">
            <div class="flex justify-center bg-slate-600 rounded-lg py-1 px-4 w-full min-w-fit min-h-0">
                <p class="text-xl font-semibold text-slate-50 w-fit min-w-0 whitespace-nowrap"> Listeners </p>
            </div>
            <div class="flex flex-col space-y-2 mt-2 mx-2">
                <div class="flex rounded-lg shadow border-2 border-slate-600 bg-slate-900/[0.3] p-2 px-4 w-full min-w-fit min-h-0">
                    <div class="flex flex-col justify-center text-slate-50 mr-2 ml-1">
                        <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                    <div class="flex flex-col justify-center">
                        <p class="text-xl font-semibold text-slate-50 whitespace-nowrap">
                            <!-- {{ (User.CurrentUser == null) ? "Anonyme": User.CurrentUser.username }} -->
                            <span class="text-slate-500">(You)</span>
                        </p>
                    </div>
                </div>
                <div id="friends" class="flex flex-col space-y-2 mt-2 mx-2">

                </div>
                <!-- JUST HERE FOR TAILWIND TO GENERATE CSS -->
                <div class="hidden flex rounded-lg shadow border-2 border-slate-600 bg-slate-900/[0.3] p-2">
                    <div class="flex flex-col justify-center text-slate-50 mr-2 ml-1">
                        <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                    <div class="flex flex-col justify-center">
                        <p class="text-xl font-semibold text-slate-50 whitespace-nowrap"> </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import User from '../../main/scripts/User.js';

const friends = [];
// TODO : make server connection (long pooling for events, register, etc)

export default {
    name: "Drawer",
    components: {},
    methods: {},
    data() { return { friends }; },
    setup() {},
    mounted() {}
};
</script>