<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";

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

// Services fetched from backend
const services = ref([]);
const servicesLoading = ref(false);

// Dropdown state per row
const openDropdownIndex = ref(null);
const searchTerms = ref({});

// Company section expanded state
const companyExpanded = ref(false);

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

const updateCompany = (field, value) => {
    const updated = { ...props.company, [field]: value };
    emit("update:company", updated);
};

const formatCurrency = (value) => {
    return `$${value.toFixed(2)}`;
};

// Fetch services on mount
const fetchServices = async () => {
    servicesLoading.value = true;
    try {
        const response = await fetch("/api/services");
        if (response.ok) {
            services.value = await response.json();
        }
    } catch (e) {
        // silently fail
    } finally {
        servicesLoading.value = false;
    }
};

onMounted(() => {
    fetchServices();
    document.addEventListener("click", handleOutsideClick);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", handleOutsideClick);
});

const filteredServices = (index) => {
    const term = (searchTerms.value[index] || "").toLowerCase();
    if (!term) return services.value;
    return services.value.filter(
        (s) =>
            s.title.toLowerCase().includes(term) ||
            (s.description && s.description.toLowerCase().includes(term)),
    );
};

const openDropdown = (index) => {
    openDropdownIndex.value = index;
    if (!searchTerms.value[index]) {
        searchTerms.value[index] = localItems.value[index]?.description || "";
    }
};

const closeDropdown = () => {
    openDropdownIndex.value = null;
};

const handleOutsideClick = (event) => {
    if (!event.target.closest(".service-dropdown-wrapper")) {
        closeDropdown();
    }
};

const selectService = (index, service) => {
    const updatedItems = [...localItems.value];
    updatedItems[index].description = service.title;
    updatedItems[index].unitCost = parseFloat(service.base_price) || 0;
    updatedItems[index].price = parseFloat(service.base_price) || 0;
    updatedItems[index].totalCost =
        updatedItems[index].qty * updatedItems[index].unitCost;
    searchTerms.value[index] = service.title;
    emit("update:items", updatedItems);
    closeDropdown();
};

const handleDescriptionInput = (index, value) => {
    searchTerms.value[index] = value;
    updateItem(index, "description", value);
};
</script>

<template>
    <div class="bg-white rounded-xl shadow-lg p-8">
        <h2
            class="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-2"
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
        <div class="grid grid-cols-2 gap-8 mb-8">
            <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2"
                    >Invoice Number</label
                >
                <input
                    type="text"
                    :value="invoiceNumber"
                    @input="$emit('update:invoiceNumber', $event.target.value)"
                    class="w-full px-5 py-3.5 text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    placeholder="INV-001"
                />
            </div>
            <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2"
                    >Invoice Date</label
                >
                <input
                    type="date"
                    :value="invoiceDate"
                    @input="$emit('update:invoiceDate', $event.target.value)"
                    class="w-full px-5 py-3.5 text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
            </div>
        </div>

        <!-- Client Info -->
        <div class="bg-slate-50 rounded-xl p-6 mb-8">
            <h3 class="text-lg font-semibold text-slate-800 mb-5">
                Client Information
            </h3>
            <div class="grid grid-cols-2 gap-8">
                <div>
                    <label
                        class="block text-sm font-semibold text-slate-700 mb-2"
                        >Client Name</label
                    >
                    <input
                        type="text"
                        :value="clientName"
                        @input="$emit('update:clientName', $event.target.value)"
                        class="w-full px-5 py-3.5 text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                        placeholder="Mr/Mrs John Doe"
                    />
                </div>
                <div>
                    <label
                        class="block text-sm font-semibold text-slate-700 mb-2"
                        >Client Address</label
                    >
                    <input
                        type="text"
                        :value="clientAddress"
                        @input="
                            $emit('update:clientAddress', $event.target.value)
                        "
                        class="w-full px-5 py-3.5 text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                        placeholder="+85512 123 123, Phnom Penh"
                    />
                </div>
            </div>
        </div>

        <!-- Company & Payment Info (collapsible) -->
        <div
            class="bg-gradient-to-br from-slate-50 to-amber-50/30 rounded-xl mb-8 overflow-hidden"
        >
            <button
                @click="companyExpanded = !companyExpanded"
                class="w-full flex justify-between items-center p-6 text-left hover:bg-slate-100/50 transition-colors"
            >
                <h3
                    class="text-lg font-semibold text-slate-800 flex items-center gap-2"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-amber-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                    </svg>
                    Company & Payment Information
                </h3>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-slate-500 transition-transform duration-200"
                    :class="companyExpanded ? 'rotate-180' : ''"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            <div v-show="companyExpanded" class="px-6 pb-6 space-y-6">
                <!-- Company Details -->
                <div>
                    <h4
                        class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4"
                    >
                        Company Details
                    </h4>
                    <div class="grid grid-cols-2 gap-6">
                        <div>
                            <label
                                class="block text-sm font-semibold text-slate-700 mb-2"
                                >Company Name</label
                            >
                            <input
                                type="text"
                                :value="company.name"
                                @input="
                                    updateCompany('name', $event.target.value)
                                "
                                class="w-full px-5 py-3.5 text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                                placeholder="Company Name"
                            />
                        </div>
                        <div>
                            <label
                                class="block text-sm font-semibold text-slate-700 mb-2"
                                >Email</label
                            >
                            <input
                                type="email"
                                :value="company.email"
                                @input="
                                    updateCompany('email', $event.target.value)
                                "
                                class="w-full px-5 py-3.5 text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                                placeholder="email@company.com"
                            />
                        </div>
                        <div>
                            <label
                                class="block text-sm font-semibold text-slate-700 mb-2"
                                >Phone</label
                            >
                            <input
                                type="text"
                                :value="company.phone"
                                @input="
                                    updateCompany('phone', $event.target.value)
                                "
                                class="w-full px-5 py-3.5 text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                                placeholder="+855 96 905 3332"
                            />
                        </div>
                        <div>
                            <label
                                class="block text-sm font-semibold text-slate-700 mb-2"
                                >Address</label
                            >
                            <input
                                type="text"
                                :value="company.address"
                                @input="
                                    updateCompany(
                                        'address',
                                        $event.target.value,
                                    )
                                "
                                class="w-full px-5 py-3.5 text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                                placeholder="Street address"
                            />
                        </div>
                        <div class="col-span-2">
                            <label
                                class="block text-sm font-semibold text-slate-700 mb-2"
                                >Location</label
                            >
                            <input
                                type="text"
                                :value="company.location"
                                @input="
                                    updateCompany(
                                        'location',
                                        $event.target.value,
                                    )
                                "
                                class="w-full px-5 py-3.5 text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                                placeholder="Full location details"
                            />
                        </div>
                    </div>
                </div>

                <!-- Divider -->
                <div class="border-t border-slate-200"></div>

                <!-- Payment Information -->
                <div>
                    <h4
                        class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4"
                    >
                        Payment Information
                    </h4>
                    <div class="grid grid-cols-2 gap-6">
                        <div>
                            <label
                                class="block text-sm font-semibold text-slate-700 mb-2"
                                >Account Name</label
                            >
                            <input
                                type="text"
                                :value="company.paymentName"
                                @input="
                                    updateCompany(
                                        'paymentName',
                                        $event.target.value,
                                    )
                                "
                                class="w-full px-5 py-3.5 text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                                placeholder="SENG PITOU"
                            />
                        </div>
                        <div>
                            <label
                                class="block text-sm font-semibold text-slate-700 mb-2"
                                >Bank Account Detail</label
                            >
                            <input
                                type="text"
                                :value="company.bankDetail"
                                @input="
                                    updateCompany(
                                        'bankDetail',
                                        $event.target.value,
                                    )
                                "
                                class="w-full px-5 py-3.5 text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                                placeholder="001 561 704"
                            />
                        </div>
                        <div class="col-span-2">
                            <label
                                class="block text-sm font-semibold text-slate-700 mb-3"
                                >Select Bank</label
                            >
                            <div class="flex gap-4">
                                <label
                                    :class="[
                                        'flex items-center gap-3 px-6 py-4 rounded-xl border-2 cursor-pointer transition-all',
                                        company.selectedBank === 'aba'
                                            ? 'border-blue-500 bg-blue-50 shadow-sm'
                                            : 'border-slate-200 hover:border-slate-300 bg-white',
                                    ]"
                                >
                                    <input
                                        type="radio"
                                        name="bank"
                                        value="aba"
                                        :checked="
                                            company.selectedBank === 'aba'
                                        "
                                        @change="
                                            updateCompany('selectedBank', 'aba')
                                        "
                                        class="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <div class="flex items-center gap-2">
                                        <svg
                                            width="60"
                                            height="24"
                                            viewBox="0 0 60 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <rect
                                                x="0"
                                                y="0"
                                                width="34"
                                                height="24"
                                                rx="3"
                                                fill="#005b9c"
                                            />
                                            <text
                                                x="17"
                                                y="16"
                                                font-family="Arial, sans-serif"
                                                font-size="10"
                                                font-weight="bold"
                                                fill="white"
                                                text-anchor="middle"
                                            >
                                                ABA
                                            </text>
                                            <rect
                                                x="38"
                                                y="4"
                                                width="22"
                                                height="16"
                                                rx="2"
                                                fill="#e31837"
                                            />
                                            <text
                                                x="49"
                                                y="15"
                                                font-family="Arial, sans-serif"
                                                font-size="8"
                                                font-weight="bold"
                                                fill="white"
                                                text-anchor="middle"
                                            >
                                                PAY
                                            </text>
                                        </svg>
                                        <span
                                            class="text-sm font-medium text-slate-700"
                                            >ABA Bank</span
                                        >
                                    </div>
                                </label>
                                <label
                                    :class="[
                                        'flex items-center gap-3 px-6 py-4 rounded-xl border-2 cursor-pointer transition-all',
                                        company.selectedBank === 'acleda'
                                            ? 'border-green-500 bg-green-50 shadow-sm'
                                            : 'border-slate-200 hover:border-slate-300 bg-white',
                                    ]"
                                >
                                    <input
                                        type="radio"
                                        name="bank"
                                        value="acleda"
                                        :checked="
                                            company.selectedBank === 'acleda'
                                        "
                                        @change="
                                            updateCompany(
                                                'selectedBank',
                                                'acleda',
                                            )
                                        "
                                        class="w-4 h-4 text-green-600 focus:ring-green-500"
                                    />
                                    <div class="flex items-center gap-2">
                                        <svg
                                            width="80"
                                            height="24"
                                            viewBox="0 0 80 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <rect
                                                x="0"
                                                y="0"
                                                width="54"
                                                height="24"
                                                rx="3"
                                                fill="#00529B"
                                            />
                                            <text
                                                x="27"
                                                y="16"
                                                font-family="Arial, sans-serif"
                                                font-size="9"
                                                font-weight="bold"
                                                fill="white"
                                                text-anchor="middle"
                                            >
                                                ACLEDA
                                            </text>
                                            <rect
                                                x="58"
                                                y="4"
                                                width="22"
                                                height="16"
                                                rx="2"
                                                fill="#F7941D"
                                            />
                                            <text
                                                x="69"
                                                y="15"
                                                font-family="Arial, sans-serif"
                                                font-size="7"
                                                font-weight="bold"
                                                fill="white"
                                                text-anchor="middle"
                                            >
                                                BANK
                                            </text>
                                        </svg>
                                        <span
                                            class="text-sm font-medium text-slate-700"
                                            >ACLEDA Bank</span
                                        >
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Invoice Items -->
        <div class="mb-8">
            <div class="flex justify-between items-center mb-5">
                <h3 class="text-lg font-semibold text-slate-800">
                    Invoice Items
                </h3>
                <button
                    @click="$emit('addItem')"
                    class="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium text-base"
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

            <div class="overflow-x-auto rounded-xl border border-slate-200">
                <table class="w-full min-w-full">
                    <thead>
                        <tr class="bg-slate-100 text-slate-600">
                            <th
                                class="py-4 px-6 text-left font-semibold text-sm rounded-tl-xl"
                                style="width: 35%"
                            >
                                Description
                            </th>
                            <th
                                class="py-4 px-6 text-center font-semibold text-sm"
                                style="width: 23%"
                            >
                                Price
                            </th>
                            <th
                                class="py-4 px-6 text-center font-semibold text-sm"
                                style="width: 20%"
                            >
                                QTY
                            </th>
                            <th
                                class="py-4 px-6 text-center font-semibold text-sm"
                                style="width: 23%"
                            >
                                Unit Cost
                            </th>
                            <th
                                class="py-4 px-6 text-center font-semibold text-sm"
                                style="width: 15%"
                            >
                                Total
                            </th>
                            <th
                                class="py-4 px-6 text-center font-semibold text-sm rounded-tr-xl"
                                style="width: 10%"
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
                            <!-- Description: searchable service dropdown -->
                            <td class="py-5 px-6">
                                <div class="relative service-dropdown-wrapper">
                                    <div class="relative">
                                        <input
                                            type="text"
                                            :value="
                                                openDropdownIndex === index
                                                    ? searchTerms[index]
                                                    : item.description
                                            "
                                            @focus="openDropdown(index)"
                                            @input="
                                                handleDescriptionInput(
                                                    index,
                                                    $event.target.value,
                                                )
                                            "
                                            class="w-full px-4 py-3.5 pr-10 text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                            :placeholder="
                                                servicesLoading
                                                    ? 'Loading...'
                                                    : 'Select service'
                                            "
                                        />
                                        <span
                                            class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                class="h-5 w-5 transition-transform"
                                                :class="
                                                    openDropdownIndex === index
                                                        ? 'rotate-180'
                                                        : ''
                                                "
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </span>
                                    </div>

                                    <!-- Dropdown list -->
                                    <div
                                        v-if="openDropdownIndex === index"
                                        class="absolute z-50 left-0 top-full mt-2 w-full min-w-[320px] bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden"
                                    >
                                        <div
                                            v-if="servicesLoading"
                                            class="px-6 py-4 text-sm text-slate-400 text-center"
                                        >
                                            Loading services...
                                        </div>
                                        <div
                                            v-else-if="
                                                filteredServices(index)
                                                    .length === 0
                                            "
                                            class="px-6 py-4 text-sm text-slate-400 text-center"
                                        >
                                            No services found
                                        </div>
                                        <ul
                                            v-else
                                            class="max-h-64 overflow-y-auto divide-y divide-slate-100"
                                        >
                                            <li
                                                v-for="service in filteredServices(
                                                    index,
                                                )"
                                                :key="service.id"
                                                @mousedown.prevent="
                                                    selectService(
                                                        index,
                                                        service,
                                                    )
                                                "
                                                class="px-6 py-3.5 cursor-pointer hover:bg-amber-50 hover:text-amber-700 transition-colors"
                                            >
                                                <div
                                                    class="flex justify-between items-center gap-4"
                                                >
                                                    <span
                                                        class="text-base font-medium truncate"
                                                        >{{
                                                            service.title
                                                        }}</span
                                                    >
                                                    <span
                                                        v-if="
                                                            service.base_price
                                                        "
                                                        class="text-sm text-slate-600 whitespace-nowrap font-semibold"
                                                    >
                                                        ${{
                                                            parseFloat(
                                                                service.base_price,
                                                            ).toFixed(2)
                                                        }}
                                                    </span>
                                                </div>
                                                <p
                                                    v-if="service.description"
                                                    class="text-sm text-slate-400 truncate mt-1"
                                                >
                                                    {{ service.description }}
                                                </p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </td>

                            <td class="py-5 px-6">
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
                                    class="w-full px-4 py-3.5 text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-center"
                                    placeholder="0"
                                    min="0"
                                />
                            </td>
                            <td class="py-5 px-6">
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
                                    class="w-full px-4 py-3.5 text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-center"
                                    placeholder="1"
                                    min="1"
                                />
                            </td>
                            <td class="py-5 px-6">
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
                                    class="w-full px-4 py-3.5 text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-center"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                />
                            </td>
                            <td
                                class="py-5 px-6 text-center text-base font-semibold text-slate-800"
                            >
                                {{ formatCurrency(item.totalCost) }}
                            </td>
                            <td
                                class="py-5 px-6 text-center flex items-center justify-center h-full"
                            >
                                <button
                                    @click="$emit('removeItem', item.id)"
                                    :disabled="localItems.length <= 1"
                                    class="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
            class="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-8 text-white"
        >
            <h3 class="text-lg font-semibold mb-5">Invoice Summary</h3>
            <div class="grid grid-cols-3 gap-8">
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
                            class="w-28 px-4 py-3 text-base bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-white text-center"
                            min="0"
                            max="100"
                        />
                        <span class="text-slate-400 text-lg">%</span>
                    </div>
                </div>
                <div>
                    <label class="block text-sm text-slate-400 mb-2"
                        >Deposit Amount</label
                    >
                    <div class="flex items-center gap-2">
                        <span class="text-slate-400 text-lg">$</span>
                        <input
                            type="number"
                            :value="deposit"
                            @input="
                                $emit(
                                    'update:deposit',
                                    Number($event.target.value),
                                )
                            "
                            class="w-36 px-4 py-3 text-base bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-white text-center"
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
