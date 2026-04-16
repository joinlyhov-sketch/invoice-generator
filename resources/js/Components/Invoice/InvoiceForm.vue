<script setup>
import { ref, watch } from "vue";

const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
    invoiceNumber: {
        type: String,
        required: true,
    },
    invoiceDate: {
        type: String,
        required: true,
    },
    clientName: {
        type: String,
        required: true,
    },
    clientAddress: {
        type: String,
        required: true,
    },
    vatPercent: {
        type: Number,
        required: true,
    },
    deposit: {
        type: Number,
        required: true,
    },
    company: {
        type: Object,
        required: true,
    },
    subtotal: {
        type: Number,
        required: true,
    },
    vatAmount: {
        type: Number,
        required: true,
    },
    grandTotal: {
        type: Number,
        required: true,
    },
});

const emit = defineEmits([
    "update:items",
    "update:invoiceNumber",
    "update:invoiceDate",
    "update:clientName",
    "update:clientAddress",
    "update:vatPercent",
    "update:deposit",
    "update:company",
    "addItem",
    "removeItem",
]);

const localItems = ref([...props.items]);

watch(
    () => props.items,
    (newItems) => {
        localItems.value = [...newItems];
    },
    { deep: true },
);

const updateItem = (index, field, value) => {
    const updatedItems = [...localItems.value];
    if (field === "qty" || field === "unitCost" || field === "price") {
        updatedItems[index][field] = Number(value) || 0;
        updatedItems[index].totalCost =
            updatedItems[index].qty * updatedItems[index].unitCost;
    } else {
        updatedItems[index][field] = value;
    }
    emit("update:items", updatedItems);
};

const formatCurrency = (value) => {
    return `$${value.toFixed(2)}`;
};
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
            </svg>
            Invoice Details
        </h2>

        <!-- Invoice Info -->
        <div class="grid grid-cols-2 gap-6 mb-8">
            <div>
                <label class="block text-sm font-medium text-slate-600 mb-2"
                    >Invoice Number</label
                >
                <input
                    type="text"
                    :value="invoiceNumber"
                    @input="$emit('update:invoiceNumber', $event.target.value)"
                    class="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    placeholder="INV-001"
                />
            </div>
            <div>
                <label class="block text-sm font-medium text-slate-600 mb-2"
                    >Invoice Date</label
                >
                <input
                    type="date"
                    :value="invoiceDate"
                    @input="$emit('update:invoiceDate', $event.target.value)"
                    class="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
            </div>
        </div>

        <!-- Client Info -->
        <div class="bg-slate-50 rounded-lg p-5 mb-8">
            <h3 class="text-lg font-semibold text-slate-800 mb-4">
                Client Information
            </h3>
            <div class="grid grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-medium text-slate-600 mb-2"
                        >Client Name</label
                    >
                    <input
                        type="text"
                        :value="clientName"
                        @input="$emit('update:clientName', $event.target.value)"
                        class="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                        placeholder="Mr/Mrs John Doe"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-600 mb-2"
                        >Client Address</label
                    >
                    <input
                        type="text"
                        :value="clientAddress"
                        @input="
                            $emit('update:clientAddress', $event.target.value)
                        "
                        class="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                        placeholder="+85512 123 123, Phnom Penh"
                    />
                </div>
            </div>
        </div>

        <!-- Invoice Items -->
        <div class="mb-8">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-slate-800">
                    Invoice Items
                </h3>
                <button
                    @click="$emit('addItem')"
                    class="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
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
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Add Item
                </button>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="bg-slate-100 text-slate-600">
                            <th
                                class="py-3 px-4 text-left font-semibold text-sm rounded-l-lg"
                            >
                                Description
                            </th>
                            <th
                                class="py-3 px-4 text-center font-semibold text-sm w-24"
                            >
                                Price
                            </th>
                            <th
                                class="py-3 px-4 text-center font-semibold text-sm w-20"
                            >
                                QTY
                            </th>
                            <th
                                class="py-3 px-4 text-center font-semibold text-sm w-28"
                            >
                                Unit Cost
                            </th>
                            <th
                                class="py-3 px-4 text-center font-semibold text-sm w-28"
                            >
                                Total
                            </th>
                            <th
                                class="py-3 px-4 text-center font-semibold text-sm rounded-r-lg w-16"
                            >
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(item, index) in localItems"
                            :key="item.id"
                            class="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                            <td class="py-3 px-4">
                                <input
                                    type="text"
                                    :value="item.description"
                                    @input="
                                        updateItem(
                                            index,
                                            'description',
                                            $event.target.value,
                                        )
                                    "
                                    class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm"
                                    placeholder="Service description"
                                />
                            </td>
                            <td class="py-3 px-4">
                                <input
                                    type="number"
                                    :value="item.price"
                                    @input="
                                        updateItem(
                                            index,
                                            'price',
                                            $event.target.value,
                                        )
                                    "
                                    class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm text-center"
                                    placeholder="0"
                                    min="0"
                                />
                            </td>
                            <td class="py-3 px-4">
                                <input
                                    type="number"
                                    :value="item.qty"
                                    @input="
                                        updateItem(
                                            index,
                                            'qty',
                                            $event.target.value,
                                        )
                                    "
                                    class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm text-center"
                                    placeholder="1"
                                    min="1"
                                />
                            </td>
                            <td class="py-3 px-4">
                                <input
                                    type="number"
                                    :value="item.unitCost"
                                    @input="
                                        updateItem(
                                            index,
                                            'unitCost',
                                            $event.target.value,
                                        )
                                    "
                                    class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm text-center"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                />
                            </td>
                            <td
                                class="py-3 px-4 text-center font-medium text-slate-800"
                            >
                                {{ formatCurrency(item.totalCost) }}
                            </td>
                            <td class="py-3 px-4 text-center">
                                <button
                                    @click="$emit('removeItem', item.id)"
                                    :disabled="localItems.length <= 1"
                                    class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Summary -->
        <div
            class="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white"
        >
            <h3 class="text-lg font-semibold mb-4">Invoice Summary</h3>
            <div class="grid grid-cols-3 gap-6">
                <div>
                    <label class="block text-sm text-slate-400 mb-2"
                        >VAT Percentage</label
                    >
                    <div class="flex items-center gap-2">
                        <input
                            type="number"
                            :value="vatPercent"
                            @input="
                                $emit(
                                    'update:vatPercent',
                                    Number($event.target.value),
                                )
                            "
                            class="w-24 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-white text-center"
                            min="0"
                            max="100"
                        />
                        <span class="text-slate-400">%</span>
                    </div>
                </div>
                <div>
                    <label class="block text-sm text-slate-400 mb-2"
                        >Deposit Amount</label
                    >
                    <div class="flex items-center gap-2">
                        <span class="text-slate-400">$</span>
                        <input
                            type="number"
                            :value="deposit"
                            @input="
                                $emit(
                                    'update:deposit',
                                    Number($event.target.value),
                                )
                            "
                            class="w-32 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-white text-center"
                            min="0"
                            step="0.01"
                        />
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-sm text-slate-400 mb-1">
                        Subtotal: {{ formatCurrency(subtotal) }}
                    </div>
                    <div class="text-sm text-slate-400 mb-1">
                        VAT ({{ vatPercent }}%): {{ formatCurrency(vatAmount) }}
                    </div>
                    <div class="text-sm text-slate-400 mb-2">
                        Deposit: -{{ formatCurrency(deposit) }}
                    </div>
                    <div class="text-2xl font-bold text-amber-400">
                        Grand Total: {{ formatCurrency(grandTotal) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
