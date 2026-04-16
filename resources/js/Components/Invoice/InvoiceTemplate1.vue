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
    return `$${value.toFixed(0)}`;
};

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};
</script>

<template>
    <div
        class="w-[750px] bg-white font-sans"
        style="
            font-family:
                Segoe UI Tahoma,
                Geneva,
                Verdana,
                sans-serif;
        "
    >
        <!-- Header with decorative elements -->
        <div class="relative h-[140px] overflow-hidden">
            <!-- Top left decorative shape -->
            <svg
                class="absolute top-0 left-0 w-[300px] h-[120px]"
                viewBox="0 0 300 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <!-- Main blue shape -->
                <path
                    d="M0 0H300C300 0 280 20 260 40C240 60 250 80 220 90C190 100 160 80 130 85C100 90 80 110 50 115C20 120 0 100 0 100V0Z"
                    fill="#1e4a6e"
                />
                <!-- Orange accent -->
                <ellipse cx="200" cy="35" rx="50" ry="25" fill="#d4842a" />
                <!-- Blue circle -->
                <circle cx="100" cy="50" r="30" fill="#2d6a94" />
                <!-- Small orange dot -->
                <circle cx="150" cy="70" r="8" fill="#d4842a" />
            </svg>

            <!-- Top right decorative shape -->
            <svg
                class="absolute top-0 right-0 w-[150px] h-[100px]"
                viewBox="0 0 150 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M150 0V80C150 80 130 70 110 75C90 80 70 90 50 85C30 80 20 60 30 45C40 30 60 40 80 30C100 20 120 0 150 0Z"
                    fill="#1e4a6e"
                />
                <circle cx="100" cy="40" r="15" fill="#d4842a" />
            </svg>

            <!-- INVOICE Title -->
            <div class="absolute top-[60px] left-[30px]">
                <h1
                    class="text-[48px] font-bold text-[#d4842a] tracking-wide"
                    style="font-family: Arial Black sans-serif"
                >
                    INVOICE
                </h1>
            </div>
        </div>

        <!-- Invoice Info Section -->
        <div class="px-[30px] py-[20px] flex justify-between items-start">
            <!-- Left: Invoice Number and Date -->
            <div class="border-2 border-[#d4842a]">
                <div class="flex">
                    <div
                        class="bg-[#d4842a] text-white px-4 py-2 font-semibold min-w-[80px]"
                    >
                        Invoice:
                    </div>
                    <div class="px-4 py-2 min-w-[120px]">
                        {{ invoice.invoiceNumber }}
                    </div>
                </div>
                <div class="flex border-t-2 border-[#d4842a]">
                    <div
                        class="bg-[#d4842a] text-white px-4 py-2 font-semibold min-w-[80px]"
                    >
                        Date:
                    </div>
                    <div class="px-4 py-2 min-w-[120px]">
                        {{ formatDate(invoice.invoiceDate) }}
                    </div>
                </div>
            </div>

            <!-- Right: Invoice To -->
            <div class="text-right">
                <div class="flex gap-4 justify-end mb-1">
                    <span class="font-semibold text-gray-600">Invoice to:</span>
                    <span class="font-medium">{{ invoice.clientName }}</span>
                </div>
                <div class="flex gap-4 justify-end">
                    <span class="font-semibold text-gray-600">Address:</span>
                    <span class="font-medium">{{ invoice.clientAddress }}</span>
                </div>
            </div>
        </div>

        <!-- Product Table -->
        <div class="px-[30px] mb-4">
            <table class="w-full">
                <thead>
                    <tr class="bg-[#d4842a] text-white">
                        <th
                            class="py-3 px-4 text-left font-semibold rounded-l-lg w-[35%]"
                        >
                            Product Description
                        </th>
                        <th class="py-3 px-4 text-center font-semibold w-[15%]">
                            Price
                        </th>
                        <th class="py-3 px-4 text-center font-semibold w-[12%]">
                            QTY
                        </th>
                        <th class="py-3 px-4 text-center font-semibold w-[18%]">
                            Unit Cost
                        </th>
                        <th
                            class="py-3 px-4 text-center font-semibold rounded-r-lg w-[20%]"
                        >
                            Total Cost
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(item, index) in invoice.items"
                        :key="index"
                        class="border-b border-gray-200"
                    >
                        <td class="py-3 px-4">{{ item.description || "-" }}</td>
                        <td class="py-3 px-4 text-center">
                            {{ item.price ? formatCurrency(item.price) : "-" }}
                        </td>
                        <td class="py-3 px-4 text-center">
                            {{ item.qty || "-" }}
                        </td>
                        <td class="py-3 px-4 text-center">
                            {{
                                item.unitCost
                                    ? formatCurrency(item.unitCost)
                                    : "-"
                            }}
                        </td>
                        <td class="py-3 px-4 text-center">
                            {{
                                item.totalCost
                                    ? formatCurrency(item.totalCost)
                                    : "-"
                            }}
                        </td>
                    </tr>
                    <!-- Empty rows to fill space -->
                    <tr
                        v-for="n in Math.max(0, 5 - invoice.items.length)"
                        :key="'empty-' + n"
                        class="border-b border-gray-200"
                    >
                        <td class="py-3 px-4">&nbsp;</td>
                        <td class="py-3 px-4">&nbsp;</td>
                        <td class="py-3 px-4">&nbsp;</td>
                        <td class="py-3 px-4">&nbsp;</td>
                        <td class="py-3 px-4">&nbsp;</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Bottom Section -->
        <div class="px-[30px] flex justify-between items-start mt-8">
            <!-- Left: Company Address -->
            <div class="max-w-[350px]">
                <h3 class="text-[#d4842a] font-bold text-lg mb-2 underline">
                    Company Address:
                </h3>
                <p class="font-bold text-[#1e4a6e] mb-1">{{ company.name }}</p>
                <p class="text-gray-700 mb-1">{{ company.address }}</p>
                <p class="text-gray-700 mb-1">{{ company.phone }}</p>
                <p class="text-gray-700 mb-1">{{ company.location }}</p>
                <p class="text-[#1e4a6e] underline mb-4">{{ company.email }}</p>

                <h3 class="text-[#d4842a] font-bold text-lg mb-3">
                    Payment Info:
                </h3>
                <!-- ABA PAY Logo -->
                <div class="mb-3">
                    <div
                        class="inline-flex items-center bg-[#005b9c] text-white px-3 py-1 rounded"
                    >
                        <span class="text-xs font-bold mr-1">ABA</span>
                        <span
                            class="bg-[#e31837] text-white text-xs px-2 py-0.5 rounded font-bold"
                            >PAY</span
                        >
                    </div>
                </div>

                <div class="text-sm">
                    <div class="flex gap-4 mb-1">
                        <span class="text-gray-600 min-w-[80px]">Name</span>
                        <span class="font-medium"
                            >: {{ company.paymentName }}</span
                        >
                    </div>
                    <div class="flex gap-4">
                        <span class="text-gray-600 min-w-[80px]"
                            >Bank Detail</span
                        >
                        <span class="font-medium"
                            >: {{ company.bankDetail }}</span
                        >
                    </div>
                </div>
            </div>

            <!-- Right: Totals -->
            <div class="min-w-[250px]">
                <div class="space-y-2 mb-4">
                    <div class="flex justify-between text-lg">
                        <span class="text-gray-600">Subtotal</span>
                        <span class="font-medium">{{
                            formatCurrency(invoice.subtotal)
                        }}</span>
                    </div>
                    <div class="flex justify-between text-lg">
                        <span class="text-gray-600">VAT</span>
                        <span class="font-medium"
                            >{{ invoice.vatPercent }}%</span
                        >
                    </div>
                    <div class="flex justify-between text-lg">
                        <span class="text-gray-600">Deposit</span>
                        <span class="font-medium">{{
                            formatCurrency(invoice.deposit)
                        }}</span>
                    </div>
                </div>

                <!-- Grand Total -->
                <div
                    class="bg-[#d4842a] text-white rounded-lg px-6 py-3 flex justify-between items-center"
                >
                    <span class="font-bold text-lg">GRAND TOTAL</span>
                    <span class="font-bold text-xl">{{
                        formatCurrency(invoice.grandTotal)
                    }}</span>
                </div>
            </div>
        </div>

        <!-- Bottom decorative elements -->
        <div class="relative h-[80px] mt-8">
            <svg
                class="absolute bottom-0 right-0 w-[200px] h-[80px]"
                viewBox="0 0 200 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M200 80V20C200 20 180 30 160 25C140 20 120 10 100 15C80 20 60 40 80 55C100 70 130 60 150 70C170 80 200 80 200 80Z"
                    fill="#1e4a6e"
                />
                <circle cx="170" cy="50" r="12" fill="#d4842a" />
                <circle cx="140" cy="35" r="6" fill="white" />
            </svg>
        </div>
    </div>
</template>
