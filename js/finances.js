const Finances = (() => {
    let fixasList = [];
    let parcelasList = [];

    const getLists = () => ({ fixasList, parcelasList });
    const setLists = (fixas, parcelas) => {
        fixasList = fixas;
        parcelasList = parcelas;
    };

    const updateItem = (type, index, field, value) => {
        if (type === 'fixas') {
            fixasList[index][field] = value;
        } else if (type === 'parcelas') {
            parcelasList[index][field] = value;
        }
        render(); // Chama a renderização após a atualização
    };

    const addItem = (type, isParcela = false) => {
        if (type === 'fixas') {
            fixasList.push({ nome: '', valor: 0 });
        } else {
            parcelasList.push({ nome: '', valor: 0, totalParcelas: 1, pagas: 0, edit: true });
        }
        render(); // Chama a renderização após adicionar
    };

    const removeItem = (type, i) => {
        if (type === 'fixas') {
            fixasList.splice(i, 1);
        } else {
            parcelasList.splice(i, 1);
        }
        render(); // Chama a renderização após remover
    };

    const toggleEditParcela = (i) => {
        parcelasList[i].edit = !parcelasList[i].edit;
        render(); // Chama a renderização após alternar edição
    };

    const calcular = () => {
        const settings = Storage.loadSettings();
        const { salario, extra, use_extra, reserva } = settings;

        const fixasTotal = fixasList.reduce((a, b) => a + b.valor, 0);
        const parcelasTotal = parcelasList.reduce((a, b) => a + b.valor, 0);

        const saldo_inicial = salario - fixasTotal - parcelasTotal;
        const saldo_com_extra = use_extra ? saldo_inicial + extra : saldo_inicial;
        const saldo_final = saldo_com_extra - reserva;

        DOMRenderer.renderTotals({
            fixasTotal,
            parcelasTotal,
            saldo_inicial,
            extra,
            use_extra,
            saldo_com_extra,
            reserva,
            saldo_final
        });
    };

    // Função de renderização principal
    const render = () => {
        DOMRenderer.renderItems(fixasList, 'fixas');
        DOMRenderer.renderItems(parcelasList, 'parcelas');
        Storage.saveItem('fixasList', fixasList);
        Storage.saveItem('parcelasList', parcelasList);
        calcular();
    };

    const init = () => {
        setLists(
            Storage.loadItem('fixasList', []),
            Storage.loadItem('parcelasList', [])
        );

        // Carrega as configurações do localStorage para os inputs
        const settings = Storage.loadSettings();
        document.getElementById('salario').value = settings.salario;
        document.getElementById('extra').value = settings.extra;
        document.getElementById('use_extra').checked = settings.use_extra;
        document.getElementById('reserva').value = settings.reserva;

        // Adiciona listeners para salvar settings e calcular ao mudar os inputs
        document.querySelectorAll('#salario, #extra, #reserva, #use_extra').forEach(input => {
            input.addEventListener('input', () => {
                const updatedSettings = {
                    salario: parseFloat(document.getElementById('salario').value) || 0,
                    extra: parseFloat(document.getElementById('extra').value) || 0,
                    use_extra: document.getElementById('use_extra').checked,
                    reserva: parseFloat(document.getElementById('reserva').value) || 0
                };
                Storage.saveSettings(updatedSettings);
                calcular();
            });
        });

        render();
    };

    return {
        init,
        updateItem,
        addItem,
        removeItem,
        toggleEditParcela,
        getLists,
        setLists,
        render // Expor render para ser chamado externamente se necessário
    };
})();