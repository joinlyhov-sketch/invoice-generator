<script setup>
import { ref } from "vue";
import InvoiceTemplate1 from "./InvoiceTemplate1.vue";
import InvoiceTemplate2 from "./InvoiceTemplate2.vue";

const props = defineProps({
    invoice: {
        type: Object,
        required: true,
    },
    company: {
        type: Object,
        required: true,
    },
    selectedTemplate: {
        type: String,
        required: true,
        validator: (value) => ["template1", "template2"].includes(value),
    },
    isExporting: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["exportPDF", "exportImage"]);

const previewScale = ref(0.7);

const zoomIn = () => {
    if (previewScale.value < 1.2) {
        previewScale.value += 0.1;
    }
};

const zoomOut = () => {
    if (previewScale.value > 0.4) {
        previewScale.value -= 0.1;
    }
};
</script>

<template>
    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- Preview Header -->
        <div class="bg-slate-800 px-6 py-4 flex justify-between items-center">
            <h2
                class="text-lg font-semibold text-white flex items-center gap-2"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-amber-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                </svg>
                Preview
            </h2>

            <div class="flex items-center gap-4">
                <!-- Zoom Controls -->
                <div
                    class="flex items-center gap-2 bg-slate-700 rounded-lg px-3 py-1"
                >
                    <button
                        @click="zoomOut"
                        class="text-slate-300 hover:text-white transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M20 12H4"
                            />
                        </svg>
                    </button>
                    <span
                        class="text-slate-300 text-sm min-w-[3rem] text-center"
                        >{{ Math.round(previewScale * 100) }}%</span
                    >
                    <button
                        @click="zoomIn"
                        class="text-slate-300 hover:text-white transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                    </button>
                </div>

                <!-- Export Buttons -->
                <div class="flex items-center gap-2">
                    <button
                        @click="$emit('exportPDF')"
                        :disabled="isExporting"
                        class="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                        </svg>
                        <span v-if="!isExporting">PDF</span>
                        <span v-else>Exporting...</span>
                    </button>
                    <button
                        @click="$emit('exportImage')"
                        :disabled="isExporting"
                        class="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <span v-if="!isExporting">Image</span>
                        <span v-else>Exporting...</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Preview Content -->
        <div class="p-6 bg-slate-100 overflow-auto max-h-[800px]">
            <div
                class="flex justify-center transition-transform"
                :style="{
                    transform: `scale(${previewScale})`,
                    transformOrigin: 'top center',
                }"
            >
                <div id="invoice-preview" class="shadow-2xl">
                    <InvoiceTemplate1
                        v-if="selectedTemplate === 'template1'"
                        :invoice="invoice"
                        :company="company"
                    />
                    <InvoiceTemplate2
                        v-else
                        :invoice="invoice"
                        :company="company"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
