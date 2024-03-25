<template>
    <div class="grid grid-cols-2 py-4 border-b">
        <div class="flex items-center justify-between">
            {{ date }}
        </div>
        <div class="flex items-center justify-end mr-10">
           {{ currency }}
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    date: String,
    transaction: Array
})

const sum = computed(()=>{
    let sum = 0

    for (const transactions of props.transaction){
        if(transactions.type === 'Income'){
            sum += transactions.amount
        }else{
            sum -= transactions.amount
        }
    }

    return sum
})

const {currency} = useCurrency(sum)

</script>