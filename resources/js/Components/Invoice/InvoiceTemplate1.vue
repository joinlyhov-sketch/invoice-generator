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
                &quot;Segoe UI&quot;, Tahoma, Geneva, Verdana, sans-serif;
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
                <path
                    d="M0 0H300C300 0 280 20 260 40C240 60 250 80 220 90C190 100 160 80 130 85C100 90 80 110 50 115C20 120 0 100 0 100V0Z"
                    fill="#1e4a6e"
                />
                <ellipse cx="200" cy="35" rx="50" ry="25" fill="#d4842a" />
                <circle cx="100" cy="50" r="30" fill="#2d6a94" />
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
                    style="font-family: &quot;Arial Black&quot;, sans-serif"
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
                <div v-if="company.selectedBank === 'aba'" class="mb-3">
                    <svg
                        width="90"
                        height="32"
                        viewBox="0 0 90 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect
                            x="0"
                            y="0"
                            width="50"
                            height="32"
                            rx="4"
                            fill="#005b9c"
                        />
                        <text
                            x="25"
                            y="21"
                            font-family="Arial, sans-serif"
                            font-size="14"
                            font-weight="bold"
                            fill="white"
                            text-anchor="middle"
                        >
                            ABA
                        </text>
                        <rect
                            x="54"
                            y="6"
                            width="36"
                            height="20"
                            rx="3"
                            fill="#e31837"
                        />
                        <text
                            x="72"
                            y="20"
                            font-family="Arial, sans-serif"
                            font-size="11"
                            font-weight="bold"
                            fill="white"
                            text-anchor="middle"
                        >
                            PAY
                        </text>
                    </svg>
                </div>

                <!-- ACLEDA Bank Logo -->
                <div v-else-if="company.selectedBank === 'acleda'" class="mb-3">
                    <svg
                        width="120"
                        height="32"
                        viewBox="0 0 120 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect
                            x="0"
                            y="0"
                            width="80"
                            height="32"
                            rx="4"
                            fill="#00529B"
                        />
                        <text
                            x="40"
                            y="21"
                            font-family="Arial, sans-serif"
                            font-size="12"
                            font-weight="bold"
                            fill="white"
                            text-anchor="middle"
                        >
                            ACLEDA
                        </text>
                        <rect
                            x="84"
                            y="6"
                            width="36"
                            height="20"
                            rx="3"
                            fill="#F7941D"
                        />
                        <text
                            x="102"
                            y="20"
                            font-family="Arial, sans-serif"
                            font-size="10"
                            font-weight="bold"
                            fill="white"
                            text-anchor="middle"
                        >
                            BANK
                        </text>
                    </svg>
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
