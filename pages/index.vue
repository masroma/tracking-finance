<template>
    <section class="flex items-center justify-between mb-10">
        <h1 class="text-4xl font-extrabold">Summary</h1>

        <div>
            <UInputMenu v-model="selectedView" :options="transactionViewOptions" />
        </div>
    </section>

    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
        <Trend color="green" title="Income" :amount="incomeTotal" :last-amount="3000" :loading="isLoading" />
        <Trend color="red" title="Expanse" :amount="expanseTotal" :last-amount="6000" :loading="isLoading" />
        <Trend color="green" title="Investmen" :amount="6000" :last-amount="3000" :loading="isLoading" />
        <Trend color="red" title="Saving" :amount="4000" :last-amount="7000" :loading="isLoading" />
    </section>

    <div class="flex justify-between mb-10">
        <div>
            <h2 class="text-2xl font-extrabold">Transaction</h2>
            <div class="text-gray-500">You Have {{incomeCount}} incomes and {{expanseCount}} expanse this period</div>
        </div>
        <div>
            <TransactionModal v-model="isOpen" /> 
            <UButton icon="i-heroicons-plus-circle" color="white" variant="solid" label="Add" @click="isOpen = true"/>
        </div>
    </div>

    <section v-if="!isLoading">
        <!--  -->
        <div v-for="(transactionOnDay, date) in transactionsGroupByDate" :key="date" class="mb-10">
            <dailyTransactionSummaryVue :date="date" :transaction="transactionOnDay" />
            <Transaction v-for="transaction in transactionOnDay" ::key="transaction.id" :transaction="transaction" @deleted="refreshTransaction()" />
        </div>
    </section>
    <section v-else>
        <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
    </section>
</template>

<script setup>
import dailyTransactionSummaryVue from '~/components/daily-transaction-summary.vue';
import { transactionViewOptions } from '~/constants';
const selectedView = ref(transactionViewOptions[1])

const supabase = useSupabaseClient()
const transactions = ref([])
const isLoading = ref(false)
const isOpen = ref(false)

const income = computed(
    () => transactions.value.filter(t => t.type === 'Income')
)

const expanse = computed(
    () => transactions.value.filter(t => t.type === 'Expanse')
)

const incomeCount = computed(() => income.value.length)
const expanseCount = computed(() => expanse.value.length)

const incomeTotal = computed(
    () => income.value.reduce((sum, transaction) => sum + transaction.amount, 0)
)

const expanseTotal = computed(
    () => expanse.value.reduce((sum, transaction) => sum + transaction.amount, 0)
)

const fetchTransaction = async () => {
    isLoading.value = true
    try {
        const { data } = await useAsyncData('transaction', async () => {
            const { data, error } = await supabase.from('transaction').select()

            if (error) return []

            return data
        })

        return data.value
    } finally {
        isLoading.value = false
    }
}

const refreshTransaction = async () => transactions.value = await fetchTransaction()

await refreshTransaction()
transactions.value = await fetchTransaction()
// console.log('data', data)

const transactionsGroupByDate = computed(
    () => {
        let grouped = {}
        for (const transaction of transactions.value) {
            const date = new Date(transaction.created_at).toISOString().split('T')[0]
            if (!grouped[date]) {
                grouped[date] = []
            }

            grouped[date].push(transaction)
            // console.log('date',date)
        }

        return grouped
    })

// console.log('by date', transactionsGroupByDate.value)


</script>