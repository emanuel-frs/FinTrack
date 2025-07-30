const Storage = (() => {
    const loadItem = (key, defaultValue) => {
        const item = localStorage.getItem(key);
        try {
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error(`Erro ao carregar item do localStorage (${key}):`, e);
            return defaultValue;
        }
    };

    const saveItem = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    };

    const loadSettings = () => {
        return {
            salario: parseFloat(localStorage.getItem('salario')) || 0,
            extra: parseFloat(localStorage.getItem('extra')) || 0,
            use_extra: localStorage.getItem('use_extra') === 'true',
            reserva: parseFloat(localStorage.getItem('reserva')) || 0,
        };
    };

    const saveSettings = (settings) => {
        localStorage.setItem('salario', settings.salario.toString());
        localStorage.setItem('extra', settings.extra.toString());
        localStorage.setItem('use_extra', settings.use_extra.toString());
        localStorage.setItem('reserva', settings.reserva.toString());
    };

    return {
        loadItem,
        saveItem,
        loadSettings,
        saveSettings
    };
})();