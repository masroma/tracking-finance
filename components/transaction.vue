<template>
    <div class="grid grid-cols-2 py-4 border-b font-bold">
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-1">
                <UIcon :name="icon" :class="iconColor" />
                <div>{{transaction.description}}</div>
            </div>
            <div>
                <UBadge color="white" v-if="transaction.category">{{transaction.category}}</UBadge>
            </div>
        </div>
        <div class="flex items-center justify-end space-x-2">
            <div>{{ currency }}</div>
            <div>
                <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
                    <UButton color="white" variant="ghost" trailing-icon="i-heroicons-ellipsis-horizontal" :loading="isLoading"/>
                </UDropdown>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    transaction:Object
})

const icon = computed(
    () => props.transaction.type === 'Income' ? 'i-heroicons-arrow-up-right' : 'i-heroicons-arrow-down-left'
)

const iconColor = computed(
    ()=>props.transaction.type === 'Income' ? 'text-green-600' : 'text-red-500'
)
const { currency } = useCurrency(props.transaction.amount)

const isLoading = ref(false)
const toast = useToast()

const supabase = useSupabaseClient()

const emit = defineEmits(['deleted'])
const deleteTransaction = async () =>{
    isLoading.value = true

    try{
        await supabase
            .from('transaction')
            .delete()
            .eq('id', props.transaction.id)

            toast.add({
                title:'Transaction deleted',
                icon:'i-heroicons-check-circle',
                color:'green'
            })
            emit('deleted', props.transaction.id)
    } catch (error){
        toast.add({
                title:'Transaction deleted',
                icon:'i-heroicons-exlamation-circle',
                color:'red'
            })
    } finally {
        isLoading.value = false
    }
}

const items = [
    [
        {
            label: 'edit',
            icon: 'i-heroicons-pencil-square-20-solid',
            click: () => console.log('Edit')
        },
        {
            label: 'delete',
            icon: 'i-heroicons-trash-20-solid',
            click: deleteTransaction
        },
    ]
]
</script>