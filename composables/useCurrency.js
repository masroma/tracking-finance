export const useCurrency = (amount) => {
    const currency = computed(() => {
        const formattedAmount = (isRef(amount) ? amount.value : amount).toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });

        // Menghapus dua digit nol di belakang koma
        return formattedAmount.replace(/\.00$/, '');
    });

    return {
        currency
    };
};
