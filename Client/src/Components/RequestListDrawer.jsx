import { useEffect, useState, useContext } from "react";
import { Context } from "../ContextProvider";
import { joinUrl } from "../api/client";
import { PEDIDO_STATES } from "../constants";
import { t } from "../i18n";

// Painel lateral de pedidos pendentes do utente. Reescrito para o mesmo
// vocabulário visual do resto da app (tokens M3 do tailwind.config.js,
// material-symbols-outlined, mesmo tratamento de overlay do Modal partilhado)
// em vez das classes CSS próprias (.custom-drawer/...) que tinha antes.
const RequestListDrawer = ({ visible, onClose }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { pedidosUtilizador, updatePedidoBoard, apiUrl } = useContext(Context);

    useEffect(() => {
        setIsOpen(visible);
    }, [visible]);

    const handleClose = () => {
        setIsOpen(false);
        onClose();
    };

    const handleCancel = (pedido) => {
        updatePedidoBoard(pedido, PEDIDO_STATES.CANCELLED);
    };
    const handleDone = (pedido) => {
        updatePedidoBoard(pedido, PEDIDO_STATES.COMPLETED);
    };

    const resolveTodosPedidos = () => {
        pedidosUtilizador.forEach((pedido) => updatePedidoBoard(pedido, PEDIDO_STATES.COMPLETED));
    };

    return (
        <>
            <div
                className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={handleClose}
            />
            <div
                className={`fixed inset-y-0 left-0 z-[61] flex h-full w-[85%] max-w-sm flex-col bg-surface-container shadow-xl transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between border-b border-surface-variant px-4 py-3">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">list_alt</span>
                        <h3 className="m-0 text-base font-bold text-on-surface">{t.tabuleiro.requestList}</h3>
                    </div>
                    <button
                        className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high"
                        onClick={handleClose}
                        aria-label={t.common.close}
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden p-3">
                    {pedidosUtilizador.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-on-surface-variant">
                            <span className="material-symbols-outlined text-5xl">task_alt</span>
                            <p className="m-0 font-body-md text-body-md">{t.tabuleiro.emptyList}</p>
                        </div>
                    ) : (
                        <>
                            <button
                                className="mb-3 ml-auto flex items-center gap-2 rounded-full bg-status-green px-4 py-2 text-sm font-bold text-white shadow transition-transform active:scale-95"
                                onClick={resolveTodosPedidos}
                            >
                                <span className="material-symbols-outlined text-lg">done_all</span>
                                {t.tabuleiro.resolveAll}
                            </button>

                            {/* O ícone do botão é a pista principal para quem não sabe ler —
                                por isso maior que o texto, que fica secundário e limitado a
                                2 linhas (min-w-0 é o que impede o texto de forçar overflow
                                horizontal do cartão flex). */}
                            <div className="flex flex-col gap-2">
                                {pedidosUtilizador.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-3 rounded-2xl border border-outline-variant bg-surface-container-low p-2"
                                    >
                                        <img
                                            src={joinUrl(apiUrl, item.botao.imagem || "/imagesBotoes/default.png")}
                                            alt={item.botao.nome}
                                            className="h-16 w-16 shrink-0 object-contain"
                                        />
                                        <span className="line-clamp-2 min-w-0 flex-1 text-sm text-on-surface-variant">
                                            {item.botao.mensagem}
                                        </span>
                                        <div className="flex shrink-0 gap-2">
                                            <button
                                                className="flex h-10 w-10 items-center justify-center rounded-full bg-status-green/10 text-status-green transition-colors hover:bg-status-green/20 active:scale-95"
                                                onClick={() => handleDone(item)}
                                                aria-label={t.tabuleiro.markDone}
                                            >
                                                <span className="material-symbols-outlined">check</span>
                                            </button>
                                            <button
                                                className="flex h-10 w-10 items-center justify-center rounded-full bg-status-red/10 text-status-red transition-colors hover:bg-status-red/20 active:scale-95"
                                                onClick={() => handleCancel(item)}
                                                aria-label={t.tabuleiro.cancelRequest}
                                            >
                                                <span className="material-symbols-outlined">close</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default RequestListDrawer;
