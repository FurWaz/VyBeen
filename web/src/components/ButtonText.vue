<template>
    <div class="flex w-fit max-w-full min-w-0">
        <div
            class="flex items-center justify-center w-fit h-fit rounded-md bg-transparent border-2 border-transparent dark:border-transparent transition-all max-w-full"
            :class="disabled
                ? 'text-slate-400 dark:text-slate-400 cursor-default'
                : (color !== 'slate'? 'text-'+color+'-500 dark:text-'+color+'-500' : 'text-slate-700 dark:text-slate-200') + ' hover:border-slate-200 hover:dark:border-slate-600 hover:text-slate-700 hover:dark:text-white'"
        >
            <component
                :is="link ? (link.startsWith('http') ? 'a' : 'router-link') : 'button'"
                ref="btn"
                class="py-1 px-3 outline-none outline-offset-4 rounded"
                :class="disabled? ' cursor-default': ' focus:outline-orange-500'"
                :to="href"
            >
                <p class="text-lg font-semibold whitespace-nowrap text-ellipsis overflow-hidden max-w-full min-w-0 w-fit h-fit max-h-full min-h-0">
                    <slot />
                </p>
            </component>
        </div>
        
        <!-- Just for tailwind to generate classes, not showing nor useful -->
        <span
            class="hidden
            text-teal-500 text-red-500 text-orange-500 text-blue-500 text-slate-500
            dark:text-teal-500 dark:text-red-500 dark:text-orange-500 dark:text-blue-500 dark:text-slate-500
            hover:text-teal-500 hover:text-red-500 hover:text-orange-500 hover:text-blue-500 hover:text-slate-500
            hover:border-teal-500 hover:border-red-500 hover:border-orange-500 hover:border-blue-500 hover:border-slate-500
            hover:dark:border-teal-500 hover:dark:border-red-500 hover:dark:border-orange-500 hover:dark:border-blue-500 hover:dark:border-slate-500"
        />
    </div>
</template>

<script>
export default {
    name: 'ButtonText',
    props: {
        href: {
            type: String,
            default: '',
            required: false
        },
        onclick: {
            type: Function,
            default: () => {},
            required: false
        },
        disabled: {
            type: [Boolean, String],
            default: false,
            required: false
        },
        color: {
            type: String,
            default: 'slate',
            required: false
        }
    },
    data() {
        return {
            window,
            link: this.href
        }
    },
    watch: {
        disabled() {
            this.link = this.disabled? undefined : this.href;
        }
    },
    mounted() {
        this.link = this.disabled? undefined : this.href;
        if (!this.link)
            this.$refs["btn"].addEventListener("click", this.onClick);
    },
    methods: {
        onClick() {
            if (this.href || this.disabled) return;
            this.onclick?.(this);
        }
    }
}
</script>