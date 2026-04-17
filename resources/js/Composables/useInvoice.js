// import { ref, computed, watch } from "vue";

// export function useInvoice() {
//     // Generate unique ID
//     const generateId = () => Math.random().toString(36).substr(2, 9);

//     // Invoice items
//     const items = ref([
//         {
//             id: generateId(),
//             description: "",
//             price: 0,
//             qty: 1,
//             unitCost: 0,
//             totalCost: 0,
//         },
//     ]);

//     // Invoice details
//     const invoiceNumber = ref("1087655");
//     const invoiceDate = ref(new Date().toISOString().split("T")[0]);
//     const clientName = ref("Mr/Mrs");
//     const clientAddress = ref("+85512 123 123, Phnom Penh");
//     const vatPercent = ref(10);
//     const deposit = ref(100);

//     // Company info
//     const companyInfo = ref({
//         name: "Mr. Pitou Seng",
//         address: "Address",
//         phone: "+855 96 905 3332/77 65 64 99",
//         location:
//             "Borey Romchek, #69, Blog C8, Romchek 4, Rathanak, Battambang",
//         email: "Sg.pitou@gmail.com",
//         paymentName: "SENG PITOU",
//         bankDetail: "001 561 704",
//     });

//     // Calculate item total cost
//     const calculateItemTotal = (item) => {
//         item.totalCost = item.qty * item.unitCost;
//         return item.totalCost;
//     };

//     // Watch items for changes and recalculate
//     watch(
//         items,
//         () => {
//             items.value.forEach((item) => {
//                 calculateItemTotal(item);
//             });
//         },
//         { deep: true },
//     );

//     // Computed values
//     const subtotal = computed(() => {
//         return items.value.reduce((sum, item) => sum + item.totalCost, 0);
//     });

//     const vatAmount = computed(() => {
//         return (subtotal.value * vatPercent.value) / 100;
//     });

//     const grandTotal = computed(() => {
//         return subtotal.value + vatAmount.value - deposit.value;
//     });

//     // Add new item
//     const addItem = () => {
//         items.value.push({
//             id: generateId(),
//             description: "",
//             price: 0,
//             qty: 1,
//             unitCost: 0,
//             totalCost: 0,
//         });
//     };

//     // Remove item
//     const removeItem = (id) => {
//         if (items.value.length > 1) {
//             items.value = items.value.filter((item) => item.id !== id);
//         }
//     };

//     // Get invoice data object
//     const getInvoiceData = computed(() => ({
//         invoiceNumber: invoiceNumber.value,
//         invoiceDate: invoiceDate.value,
//         clientName: clientName.value,
//         clientAddress: clientAddress.value,
//         items: items.value,
//         subtotal: subtotal.value,
//         vatPercent: vatPercent.value,
//         vatAmount: vatAmount.value,
//         deposit: deposit.value,
//         grandTotal: grandTotal.value,
//     }));

//     // Reset form
//     const resetForm = () => {
//         items.value = [
//             {
//                 id: generateId(),
//                 description: "",
//                 price: 0,
//                 qty: 1,
//                 unitCost: 0,
//                 totalCost: 0,
//             },
//         ];
//         invoiceNumber.value = Math.floor(
//             Math.random() * 9000000 + 1000000,
//         ).toString();
//         invoiceDate.value = new Date().toISOString().split("T")[0];
//         clientName.value = "Mr/Mrs";
//         clientAddress.value = "";
//         deposit.value = 0;
//     };

//     return {
//         items,
//         invoiceNumber,
//         invoiceDate,
//         clientName,
//         clientAddress,
//         vatPercent,
//         deposit,
//         companyInfo,
//         subtotal,
//         vatAmount,
//         grandTotal,
//         addItem,
//         removeItem,
//         getInvoiceData,
//         resetForm,
//         calculateItemTotal,
//     };
// }


import { ref, computed, watch } from 'vue'

export function useInvoice() {
  // Generate unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9)

  // Invoice items
  const items = ref([
    {
      id: generateId(),
      description: '',
      price: 0,
      qty: 1,
      unitCost: 0,
      totalCost: 0
    }
  ])

  // Invoice details
  const invoiceNumber = ref('1087655')
  const invoiceDate = ref(new Date().toISOString().split('T')[0])
  const clientName = ref('Mr/Mrs')
  const clientAddress = ref('+85512 123 123, Phnom Penh')
  const vatPercent = ref(10)
  const deposit = ref(100)

  // Company info with editable fields
  const companyInfo = ref({
    name: 'Mr. Pitou Seng',
    address: 'Address',
    phone: '+855 96 905 3332/77 65 64 99',
    location: 'Borey Romchek, #69, Blog C8, Romchek 4, Rathanak, Battambang',
    email: 'Sg.pitou@gmail.com',
    // Payment info
    paymentName: 'SENG PITOU',
    bankDetail: '001 561 704',
    selectedBank: 'aba' // 'aba' or 'acleda'
  })

  // Calculate item total cost
  const calculateItemTotal = (item) => {
    item.totalCost = item.qty * item.unitCost
    return item.totalCost
  }

  // Watch items for changes and recalculate
  watch(items, () => {
    items.value.forEach(item => {
      calculateItemTotal(item)
    })
  }, { deep: true })

  // Computed values
  const subtotal = computed(() => {
    return items.value.reduce((sum, item) => sum + item.totalCost, 0)
  })

  const vatAmount = computed(() => {
    return (subtotal.value * vatPercent.value) / 100
  })

  const grandTotal = computed(() => {
    return subtotal.value + vatAmount.value - deposit.value
  })

  // Add new item
  const addItem = () => {
    items.value.push({
      id: generateId(),
      description: '',
      price: 0,
      qty: 1,
      unitCost: 0,
      totalCost: 0
    })
  }

  // Remove item
  const removeItem = (id) => {
    if (items.value.length > 1) {
      items.value = items.value.filter(item => item.id !== id)
    }
  }

  // Update company info
  const updateCompanyInfo = (field, value) => {
    companyInfo.value[field] = value
  }

  // Get invoice data object
  const getInvoiceData = computed(() => ({
    invoiceNumber: invoiceNumber.value,
    invoiceDate: invoiceDate.value,
    clientName: clientName.value,
    clientAddress: clientAddress.value,
    items: items.value,
    subtotal: subtotal.value,
    vatPercent: vatPercent.value,
    vatAmount: vatAmount.value,
    deposit: deposit.value,
    grandTotal: grandTotal.value
  }))

  // Reset form
  const resetForm = () => {
    items.value = [{
      id: generateId(),
      description: '',
      price: 0,
      qty: 1,
      unitCost: 0,
      totalCost: 0
    }]
    invoiceNumber.value = Math.floor(Math.random() * 9000000 + 1000000).toString()
    invoiceDate.value = new Date().toISOString().split('T')[0]
    clientName.value = 'Mr/Mrs'
    clientAddress.value = ''
    deposit.value = 0
  }

  return {
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
    updateCompanyInfo,
    getInvoiceData,
    resetForm,
    calculateItemTotal
  }
}
