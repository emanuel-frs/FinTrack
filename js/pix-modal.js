const PixModal = (() => {
    // SUBSTITUA ESTA CHAVE PIX PELA CHAVE CORRETA DA SUA IMAGEM!
    const YOUR_PIX_KEY = '00020126580014BR.GOV.BCB.PIX0136ad1344b7-c80f-42d1-a264-9125e6bfb53f5204000053039865802BR5907EMANUEL6011TERESOPOLIS62130509FinTrack63046777';

    // Declare as variáveis aqui para que sejam acessíveis por todas as funções do módulo,
    // mas atribua-as APENAS quando for seguro (ex: dentro de init() para listeners, ou openModal() para conteúdo).
    let donateButton;
    let pixModal;
    let closeButton;
    // Removendo a declaração de pixKeyDisplay e pixQRCodeImage daqui.
    // Elas serão obtidas dentro de openModal().

    const generateQRCode = (pixKey, imgElement) => {
        imgElement.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixKey)}`;
    };

    const openModal = () => {
        // Obtenha as referências dos elementos DOM aqui, DENTRO DA FUNÇÃO OPEN
        // Isso garante que eles já foram renderizados no DOM, mesmo que o modal estivesse display:none
        const pixKeyDisplay = document.getElementById('pixKey');
        const pixQRCodeImage = document.getElementById('pixQRCodeImage');

        if (pixKeyDisplay && pixQRCodeImage) {
            pixKeyDisplay.textContent = YOUR_PIX_KEY;
            generateQRCode(YOUR_PIX_KEY, pixQRCodeImage); // Passa o elemento da imagem
            pixModal.style.display = 'flex'; // Mostra o modal
        } else {
            console.error("Elementos do modal (chave Pix ou QR Code) não encontrados ao abrir o modal!");
        }
    };

    const closeModal = () => {
        if (pixModal) {
            pixModal.style.display = 'none'; // Esconde o modal
        }
    };

    const copyPixKey = () => {
        const pixKeyText = document.getElementById('pixKey').textContent; // Obtém o elemento novamente
        navigator.clipboard.writeText(pixKeyText).then(() => {
            alert('Chave Pix copiada para a área de transferência!');
        }).catch(err => {
            console.error('Erro ao copiar a chave Pix: ', err);
            alert('Erro ao copiar a chave Pix. Por favor, copie manualmente: ' + pixKeyText);
        });
    };

    const init = () => {
        // Estas referências são para os botões que sempre estão visíveis
        donateButton = document.getElementById('donateButton');
        pixModal = document.getElementById('pixModal');
        closeButton = document.querySelector('.close-button');

        if (donateButton) {
            donateButton.addEventListener('click', openModal);
        } else {
            console.error("Botão de doação não encontrado!");
        }

        if (closeButton) {
            closeButton.addEventListener('click', closeModal);
        } else {
            console.error("Botão de fechar modal não encontrado!");
        }

        // Esconder o modal se clicar fora do conteúdo
        if (pixModal) {
            window.addEventListener('click', (event) => {
                if (event.target === pixModal) {
                    closeModal();
                }
            });
        }
    };

    return {
        init,
        copyPixKey // Expor para ser acessível pelo onclick no HTML
    };
})();