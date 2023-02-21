<template>
    <div class="flex grow-0 p-2 w-full h-fit">
        <div class="flex justify-between w-full rounded-lg bg-slate-700/[0.5] border-2 border-slate-700">
            <div class="flex flex-col justify-center p-2">
                <div
                    id="btn-back"
                    class="text-slate-200 p-2 rounded-lg border-2 border-slate-700 hover:text-slate-50 hover:bg-slate-500 cursor-pointer transition-all">
                    <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </div>
            </div>
            <div class="flex flex-col justify-center">
                <h1 class="text-slate-50 font-bold text-2xl"> VyBeen </h1>
            </div>
            <div class="flex flex-col justify-center p-2">
                <div
                    id="btn-toggle-drawer"
                    class="text-slate-200 p-2 rounded-lg border-2 border-slate-700 hover:text-slate-50 hover:bg-slate-500 cursor-pointer transition-all">
                    <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "VbHeader",
    data() {
        return {}
    },
    methods: {}
}
</script>