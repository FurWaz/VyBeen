<template>
    <div class="flex grow flex-col min-w-0 min-h-0">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: "App",
    data() {
        return {
            year: new Date().getFullYear()
        }
    }
};
</script>

<style>
</style>