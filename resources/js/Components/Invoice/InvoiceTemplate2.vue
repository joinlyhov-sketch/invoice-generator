<script setup>
const props = defineProps({
    invoice: {
        type: Object,
        required: true,
    },
    company: {
        type: Object,
        required: true,
    },
});

const formatCurrency = (value) => {
    return `$${value.toFixed(2)}`;
};

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};
</script>

<template>
    <div
        class="w-[750px] bg-white font-sans p-8"
        style="
            font-family:
                Segoe UI Tahoma,
                Geneva,
                Verdana,
                sans-serif;
        "
    >
        <!-- Header -->
        <div
            class="flex justify-between items-start mb-8 pb-6 border-b-4 border-slate-800"
        >
            <div>
                <h1 class="text-4xl font-bold text-slate-800 tracking-tight">
                    INVOICE
                </h1>
                <p class="text-slate-500 mt-1">Professional Service Invoice</p>
            </div>
            <div class="text-right">
                <div class="text-3xl font-bold text-slate-800">
                    #{{ invoice.invoiceNumber }}
                </div>
                <div class="text-slate-500 mt-1">
                    {{ formatDate(invoice.invoiceDate) }}
                </div>
            </div>
        </div>

        <!-- Company & Client Info -->
        <div class="flex justify-between mb-8">
            <!-- From -->
            <div class="bg-slate-50 p-5 rounded-lg w-[45%]">
                <h3
                    class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3"
                >
                    From
                </h3>
                <p class="font-bold text-slate-800 text-lg">
                    {{ company.name }}
                </p>
                <p class="text-slate-600 text-sm mt-2">
                    {{ company.location }}
                </p>
                <p class="text-slate-600 text-sm">{{ company.phone }}</p>
                <p class="text-slate-600 text-sm">{{ company.email }}</p>
            </div>

            <!-- To -->
            <div class="bg-slate-800 text-white p-5 rounded-lg w-[45%]">
                <h3
                    class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3"
                >
                    Bill To
                </h3>
                <p class="font-bold text-lg">{{ invoice.clientName }}</p>
                <p class="text-slate-300 text-sm mt-2">
                    {{ invoice.clientAddress }}
                </p>
            </div>
        </div>

        <!-- Items Table -->
        <div class="mb-8">
            <table class="w-full">
                <thead>
                    <tr class="border-b-2 border-slate-200">
                        <th
                            class="py-4 text-left font-bold text-slate-800 text-sm uppercase tracking-wider"
                        >
                            Description
                        </th>
                        <th
                            class="py-4 text-center font-bold text-slate-800 text-sm uppercase tracking-wider w-20"
                        >
                            Qty
                        </th>
                        <th
                            class="py-4 text-right font-bold text-slate-800 text-sm uppercase tracking-wider w-28"
                        >
                            Unit Price
                        </th>
                        <th
                            class="py-4 text-right font-bold text-slate-800 text-sm uppercase tracking-wider w-28"
                        >
                            Amount
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(item, index) in invoice.items"
                        :key="index"
                        class="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                        <td class="py-4">
                            <span class="font-medium text-slate-800">{{
                                item.description || "Service Item"
                            }}</span>
                        </td>
                        <td class="py-4 text-center text-slate-600">
                            {{ item.qty }}
                        </td>
                        <td class="py-4 text-right text-slate-600">
                            {{ formatCurrency(item.unitCost) }}
                        </td>
                        <td class="py-4 text-right font-medium text-slate-800">
                            {{ formatCurrency(item.totalCost) }}
                        </td>
                    </tr>
                    <!-- Empty rows for minimum height -->
                    <tr
                        v-for="n in Math.max(0, 4 - invoice.items.length)"
                        :key="'empty-' + n"
                        class="border-b border-slate-100"
                    >
                        <td class="py-4">&nbsp;</td>
                        <td class="py-4">&nbsp;</td>
                        <td class="py-4">&nbsp;</td>
                        <td class="py-4">&nbsp;</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Totals Section -->
        <div class="flex justify-end mb-8">
            <div class="w-[300px]">
                <div class="flex justify-between py-2 text-slate-600">
                    <span>Subtotal</span>
                    <span class="font-medium text-slate-800">{{
                        formatCurrency(invoice.subtotal)
                    }}</span>
                </div>
                <div class="flex justify-between py-2 text-slate-600">
                    <span>VAT ({{ invoice.vatPercent }}%)</span>
                    <span class="font-medium text-slate-800">{{
                        formatCurrency(invoice.vatAmount)
                    }}</span>
                </div>
                <div
                    class="flex justify-between py-2 text-slate-600 border-b border-slate-200"
                >
                    <span>Deposit</span>
                    <span class="font-medium text-green-600"
                        >-{{ formatCurrency(invoice.deposit) }}</span
                    >
                </div>
                <div
                    class="flex justify-between py-4 mt-2 bg-slate-800 text-white px-4 rounded-lg"
                >
                    <span class="font-bold text-lg">TOTAL DUE</span>
                    <span class="font-bold text-xl">{{
                        formatCurrency(invoice.grandTotal)
                    }}</span>
                </div>
            </div>
        </div>

        <!-- Payment Info -->
        <div class="bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-lg">
            <h3 class="font-bold text-slate-800 mb-4 text-lg">
                Payment Information
            </h3>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <p
                        class="text-xs text-slate-400 uppercase tracking-wider mb-1"
                    >
                        Account Name
                    </p>
                    <p class="font-medium text-slate-800">
                        {{ company.paymentName }}
                    </p>
                </div>
                <div>
                    <p
                        class="text-xs text-slate-400 uppercase tracking-wider mb-1"
                    >
                        Account Number
                    </p>
                    <p class="font-medium text-slate-800">
                        {{ company.bankDetail }}
                    </p>
                </div>
                <div>
                    <p
                        class="text-xs text-slate-400 uppercase tracking-wider mb-1"
                    >
                        Bank
                    </p>
                    <p class="font-medium text-slate-800">ABA Bank</p>
                </div>
                <div>
                    <p
                        class="text-xs text-slate-400 uppercase tracking-wider mb-1"
                    >
                        Payment Method
                    </p>
                    <div class="flex items-center gap-2">
                        <span
                            class="bg-blue-600 text-white text-xs px-2 py-1 rounded font-bold"
                            >ABA</span
                        >
                        <span
                            class="bg-red-600 text-white text-xs px-2 py-1 rounded font-bold"
                            >PAY</span
                        >
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="mt-8 pt-6 border-t border-slate-200 text-center">
            <p class="text-slate-500 text-sm">Thank you for your business!</p>
            <p class="text-slate-400 text-xs mt-2">
                This invoice was generated electronically and is valid without
                signature.
            </p>
        </div>
    </div>
</template>
