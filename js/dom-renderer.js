const DOMRenderer = (() => {
    const renderItems = (items, type, updateFn, removeFn, toggleEditFn) => {
        const container = document.getElementById(type);
        container.innerHTML = '';
        items.forEach((item, i) => {
            if (type === 'fixas') {
                container.innerHTML += `
                    <div class="item">
                        <input type="text" value="${item.nome}" onchange="Finances.updateItem('fixas', ${i}, 'nome', this.value)" placeholder="Nome da despesa">
                        <input type="number" value="${item.valor.toFixed(2)}" min="0" step="0.01" onchange="Finances.updateItem('fixas', ${i}, 'valor', parseFloat(this.value)||0)" placeholder="Valor">
                        <button onclick="Finances.removeItem('fixas',${i})" class="delete-button"><span class="icon">🗑️</span></button>
                    </div>`;
            } else if (type === 'parcelas') {
                const currentTotalParcelas = item.totalParcelas || 1;
                const currentPagas = item.pagas || 0;

                const nomeField = item.edit
                    ? `<input type='text' style='flex:1' value='${item.nome}' onchange='Finances.updateItem("parcelas", ${i}, "nome", this.value)' placeholder="Nome da parcela">`
                    : `<span style='flex:1; font-weight: 600; color: var(--text-primary);'>${item.nome}</span>`;

                const parcelasControl = item.edit
                    ? `<input type='number' min='0' style='width:70px' value='${currentPagas}' onchange='Finances.updateItem("parcelas", ${i}, "pagas", parseInt(this.value)||0)'>/<input type='number' min='0' style='width:70px' value='${currentTotalParcelas}' onchange='Finances.updateItem("parcelas", ${i}, "totalParcelas", parseInt(this.value)||0)'>`
                    : `<span>${currentPagas}/${currentTotalParcelas}</span>`;

                let parcelaProgress = (currentPagas / currentTotalParcelas) * 100;
                const progressBarWidth = parcelaProgress > 100 ? 100 : parcelaProgress;
                const progressBarClass = parcelaProgress >= 100 ? 'complete' : '';
                const progressBarOverdue = currentPagas > currentTotalParcelas ? 'overdue' : '';

                container.innerHTML += `
                    <div class="item">
                        ${nomeField}
                        <div class="parcelas-info">
                            <input type="number" value="${item.valor.toFixed(2)}" min="0" step="0.01" onchange="Finances.updateItem('parcelas', ${i}, 'valor', parseFloat(this.value)||0)" placeholder="Valor">
                            <div style="display: flex; align-items: center; gap: 5px;">
                                ${parcelasControl}
                                <div class="progress-bar-container">
                                    <div class="progress-bar ${progressBarClass} ${progressBarOverdue}" style="width: ${progressBarWidth}%;"></div>
                                </div>
                            </div>
                            <button onclick="Finances.toggleEditParcela(${i})"><span class="icon">✏️</span></button>
                            <button onclick="Finances.removeItem('parcelas',${i})" class="delete-button"><span class="icon">🗑️</span></button>
                        </div>
                    </div>`;
            }
        });
    };

    const renderTotals = (totals) => {
        const resultElement = document.getElementById('totais');
        resultElement.innerHTML = `
            <p>✔ Total de despesas fixas: <strong>R$ ${totals.fixasTotal.toFixed(2)}</strong></p>
            <p>✔ Total de parcelas mensais: <strong>R$ ${totals.parcelasTotal.toFixed(2)}</strong></p>
            <p>✔ Saldo antes de outros pagamentos: <strong>R$ ${totals.saldo_inicial.toFixed(2)}</strong></p>
            ${totals.use_extra ? `<p style="color: var(--positive-color);">+ Pagamento extra recebido: <strong>R$ ${totals.extra.toFixed(2)}</strong></p>` : ''}
            <p>✔ Saldo após considerar extras: <strong>R$ ${totals.saldo_com_extra.toFixed(2)}</strong></p>
            <p>- Reserva para uso diário/emergências: <strong>R$ ${totals.reserva.toFixed(2)}</strong></p>
            <p style="font-size: 1.4em; margin-top: 20px; font-weight: 700;">
                ✨ Saldo livre no fim do mês: <strong style="color: ${totals.saldo_final >= 0 ? 'var(--positive-color)' : 'var(--negative-color)'};">R$ ${totals.saldo_final.toFixed(2)}</strong>
            </p>`;
    };

    return {
        renderItems,
        renderTotals
    };
})();