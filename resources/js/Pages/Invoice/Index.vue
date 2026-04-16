<script setup>
import { ref } from "vue";
import InvoiceForm from "../../Components/Invoice/InvoiceForm.vue";
// import TemplateSelector from "../../Components/Invoice/TemplateSelector.vue";
import InvoicePreview from "../../Components/Invoice/InvoicePreview.vue";
import { useExport } from "@/Composables/useExport";
import { useInvoice } from "@/Composables/useInvoice";
import TemplateSelector from "@/Components/Invoice/TemplateSelector.vue";

// Invoice state
const {
    items,
    invoiceNumber,
    invoiceDate,
    clientName,
    clientAddress,
    vatPercent,
    deposit,
    companyInfo,
    subtotal,
    vatAmount,
    grandTotal,
    addItem,
    removeItem,
    getInvoiceData,
    resetForm,
} = useInvoice();

// Export state
const { isExporting, exportToPDF, exportToImage } = useExport();

// Selected template
const selectedTemplate = ref("template1");

// Active tab
const activeTab = ref("form");

// Handle exports
const handleExportPDF = () => {
    const filename = `invoice-${invoiceNumber.value}`;
    exportToPDF("invoice-preview", filename);
};

const handleExportImage = () => {
    const filename = `invoice-${invoiceNumber.value}`;
    exportToImage("invoice-preview", filename, "png");
};
</script>

<template>
    <div class="min-h-screen bg-slate-100">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b border-slate-200">
            <div class="max-w-7xl mx-auto px-6 py-4">
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <div
                            class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-6 w-6 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h1 class="text-xl font-bold text-slate-800">
                                Invoice Generator
                            </h1>
                            <p class="text-sm text-slate-500">
                                Create and export professional invoices
                            </p>
                        </div>
                    </div>
                    <button
                        @click="resetForm"
                        class="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
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
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        Reset Form
                    </button>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto px-6 py-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Left Column: Form & Template Selection -->
                <div class="space-y-6">
                    <!-- Tabs -->
                    <div class="bg-white rounded-xl shadow-lg p-2 flex gap-2">
                        <button
                            @click="activeTab = 'form'"
                            :class="[
                                'flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2',
                                activeTab === 'form'
                                    ? 'bg-amber-500 text-white'
                                    : 'text-slate-600 hover:bg-slate-100',
                            ]"
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
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>
                            Invoice Form
                        </button>
                        <button
                            @click="activeTab = 'template'"
                            :class="[
                                'flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2',
                                activeTab === 'template'
                                    ? 'bg-amber-500 text-white'
                                    : 'text-slate-600 hover:bg-slate-100',
                            ]"
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
                                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                                />
                            </svg>
                            Choose Template
                        </button>
                    </div>

                    <!-- Invoice Form -->
                    <InvoiceForm
                        v-show="activeTab === 'form'"
                        v-model:items="items"
                        v-model:invoiceNumber="invoiceNumber"
                        v-model:invoiceDate="invoiceDate"
                        v-model:clientName="clientName"
                        v-model:clientAddress="clientAddress"
                        v-model:vatPercent="vatPercent"
                        v-model:deposit="deposit"
                        v-model:company="companyInfo"
                        :subtotal="subtotal"
                        :vatAmount="vatAmount"
                        :grandTotal="grandTotal"
                        @addItem="addItem"
                        @removeItem="removeItem"
                    />

                    <!-- Template Selector -->
                    <TemplateSelector
                        v-show="activeTab === 'template'"
                        v-model:selectedTemplate="selectedTemplate"
                    />
                </div>

                <!-- Right Column: Preview -->
                <div class="lg:sticky lg:top-8">
                    <InvoicePreview
                        :invoice="getInvoiceData"
                        :company="companyInfo"
                        :selectedTemplate="selectedTemplate"
                        :isExporting="isExporting"
                        @exportPDF="handleExportPDF"
                        @exportImage="handleExportImage"
                    />
                </div>
            </div>
        </main>
    </div>
</template>
