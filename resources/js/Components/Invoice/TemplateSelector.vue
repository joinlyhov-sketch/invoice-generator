<script setup>
import { ref } from "vue";

const props = defineProps({
    selectedTemplate: {
        type: String,
        required: true,
        validator: (value) => ["template1", "template2"].includes(value),
    },
});

const emit = defineEmits(["update:selectedTemplate"]);

const templates = [
    {
        id: "template1",
        name: "Classic Orange",
        description:
            "Professional template with orange and blue accents, decorative elements",
    },
    {
        id: "template2",
        name: "Modern Minimal",
        description:
            "Clean and modern design with dark header, perfect for professional services",
    },
];
</script>

<template>
    <div class="bg-white rounded-xl shadow-lg p-6">
        <h2
            class="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
            </svg>
            Select Template
        </h2>

        <div class="grid grid-cols-2 gap-6">
            <div
                v-for="template in templates"
                :key="template.id"
                @click="$emit('update:selectedTemplate', template.id)"
                :class="[
                    'relative cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-lg',
                    selectedTemplate === template.id
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-slate-200 hover:border-slate-300',
                ]"
            >
                <!-- Selected indicator -->
                <div
                    v-if="selectedTemplate === template.id"
                    class="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>

                <!-- Template Preview -->
                <div class="aspect-[3/4] rounded-lg mb-4 overflow-hidden">
                    <!-- Template 1 Preview -->
                    <div
                        v-if="template.id === 'template1'"
                        class="w-full h-full bg-white border border-slate-100 p-2 relative"
                    >
                        <div class="h-8 relative mb-2">
                            <div
                                class="absolute top-0 left-0 w-16 h-6 bg-[#1e4a6e] rounded-br-full"
                            ></div>
                            <div
                                class="absolute top-1 left-8 w-4 h-4 bg-[#d4842a] rounded-full"
                            ></div>
                        </div>
                        <div class="text-xs font-bold text-[#d4842a] mb-2">
                            INVOICE
                        </div>
                        <div class="flex gap-2 mb-2">
                            <div
                                class="flex-1 h-4 bg-[#d4842a] rounded text-[6px] text-white flex items-center justify-center"
                            >
                                Product
                            </div>
                            <div
                                class="w-8 h-4 bg-[#d4842a] rounded text-[6px] text-white flex items-center justify-center"
                            >
                                Price
                            </div>
                            <div
                                class="w-8 h-4 bg-[#d4842a] rounded text-[6px] text-white flex items-center justify-center"
                            >
                                Total
                            </div>
                        </div>
                        <div class="space-y-1">
                            <div class="h-2 bg-slate-100 rounded w-full"></div>
                            <div class="h-2 bg-slate-100 rounded w-full"></div>
                            <div class="h-2 bg-slate-100 rounded w-3/4"></div>
                        </div>
                        <div
                            class="absolute bottom-2 right-2 w-16 h-4 bg-[#d4842a] rounded flex items-center justify-center"
                        >
                            <span class="text-[6px] text-white font-bold"
                                >GRAND TOTAL</span
                            >
                        </div>
                    </div>

                    <!-- Template 2 Preview -->
                    <div
                        v-if="template.id === 'template2'"
                        class="w-full h-full bg-white border border-slate-100 p-2"
                    >
                        <div
                            class="flex justify-between items-center mb-2 pb-1 border-b-2 border-slate-800"
                        >
                            <div class="text-xs font-bold text-slate-800">
                                INVOICE
                            </div>
                            <div class="text-[8px] text-slate-500">#12345</div>
                        </div>
                        <div class="flex gap-2 mb-2">
                            <div class="flex-1 bg-slate-50 p-1 rounded">
                                <div class="text-[6px] text-slate-400">
                                    From
                                </div>
                                <div
                                    class="h-2 bg-slate-200 rounded w-3/4 mt-1"
                                ></div>
                            </div>
                            <div class="flex-1 bg-slate-800 p-1 rounded">
                                <div class="text-[6px] text-slate-400">
                                    Bill To
                                </div>
                                <div
                                    class="h-2 bg-slate-600 rounded w-3/4 mt-1"
                                ></div>
                            </div>
                        </div>
                        <div class="space-y-1 mb-2">
                            <div class="h-2 bg-slate-100 rounded w-full"></div>
                            <div class="h-2 bg-slate-100 rounded w-full"></div>
                            <div class="h-2 bg-slate-100 rounded w-full"></div>
                        </div>
                        <div class="flex justify-end">
                            <div
                                class="w-16 h-4 bg-slate-800 rounded flex items-center justify-center"
                            >
                                <span class="text-[6px] text-white font-bold"
                                    >TOTAL DUE</span
                                >
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Template Info -->
                <h3 class="font-semibold text-slate-800 mb-1">
                    {{ template.name }}
                </h3>
                <p class="text-sm text-slate-500">{{ template.description }}</p>
            </div>
        </div>
    </div>
</template>
