<template>
    <div class="flex rounded-lg bg-slate-700/[0.5] p-1 border-2 border-slate-700">
        <input
            id="search"
            type="text"
            name="search"
            class="w-full bg-transparent rounded-lg border-2 border-slate-500 outline-none text-slate-50 focus:border-slate-300 px-2 py-1 transition-all"
        >
        <div id="btn-search" class="flex flex-col justify-center px-2 cursor-pointer text-slate-400 hover:text-slate-300 transition-all">
            <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
        </div>
    </div>
</template>

<script>
export default {
    name: "Search",
    data() {
        return {}
    },
    methods: {
        goBack() {}
    }
}
</script>