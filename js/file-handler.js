const FileHandler = (() => {
    const fileUploadInput = document.getElementById('fileUpload');
    const fileNameDisplay = document.getElementById('fileNameDisplay');

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) {
            fileNameDisplay.textContent = 'Nenhum arquivo selecionado';
            return;
        }

        if (file.type !== 'application/json') {
            alert('Por favor, selecione um arquivo JSON válido.');
            fileNameDisplay.textContent = 'Tipo de arquivo inválido';
            return;
        }

        fileNameDisplay.textContent = file.name;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                parseAndLoadData(data);
            } catch (error) {
                alert('Erro ao ler o arquivo JSON. Verifique a sintaxe.');
                console.error('Erro ao parsear JSON:', error);
                fileNameDisplay.textContent = 'Erro de leitura do JSON';
            }
        };
        reader.readAsText(file);
    };

    const parseAndLoadData = (data) => {
        let newFixasList = [];
        let newParcelasList = [];
        let newSettings = {
            salario: 0,
            extra: 0,
            use_extra: false,
            reserva: 0
        };

        if (data.salario !== undefined) {
            newSettings.salario = parseFloat(data.salario) || 0;
        }
        if (data.extra !== undefined) {
            newSettings.extra = parseFloat(data.extra) || 0;
            newSettings.use_extra = true; // Assume true se extra for definido no JSON
        }
        if (data.reserva !== undefined) {
            newSettings.reserva = parseFloat(data.reserva) || 0;
        }

        if (Array.isArray(data.despesasFixas)) {
            newFixasList = data.despesasFixas.map(item => ({
                nome: item.nome || '',
                valor: parseFloat(item.valor) || 0
            }));
        }

        if (Array.isArray(data.parcelasMensais)) {
            newParcelasList = data.parcelasMensais.map(item => ({
                nome: item.nome || '',
                valor: parseFloat(item.valor) || 0,
                totalParcelas: parseInt(item.totalParcelas) || 1,
                pagas: parseInt(item.pagas) || 0,
                edit: false
            }));
        }

        Storage.saveSettings(newSettings);
        Finances.setLists(newFixasList, newParcelasList);
        Finances.render(); // Renderiza com os novos dados
    };

    const init = () => {
        fileUploadInput.addEventListener('change', handleFileUpload);
    };

    return {
        init
    };
})();