import { useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface AddHabitModalProps {
    onHabitAdded: () => void;
}

export default function AddHabitModal({ onHabitAdded }: AddHabitModalProps) {
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const { data: { user }, error } = await supabase.auth.getUser();

        if (!user || !user.id) {
            alert("Usuário não autenticado.");
            setLoading(false);
            return;
        }

        const { error: insertError } = await supabase
            .from("habits")
            .insert([{ title, user_id: user.id }]);

        if (insertError) {
            alert("Erro ao adicionar hábito!");
        } else {
            setTitle("");
            document.getElementById("my_modal_5").close();
            onHabitAdded();
        }

        setLoading(false);
    }

    // if (!isOpen) return null;

    return (
        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Novo Hábito</h3>
                <div className="modal-action">
                    <form onSubmit={handleSubmit} method="dialog" className="w-full">
                        <div className="flex flex-col gap-6 w-100">
                            <p className="text-muted-foreground">Digite um nome para o seu novo hábito.</p>
                            <input type="text" className="input input-bordered w-full"
                                autoFocus
                                value={title}
                                onChange={(e) => setTitle(e.target.value)} />
                            <button className="btn btn-primary" type='submit' disabled={loading}>{loading ? "Salvando..." : "Salvar"}</button>
                        </div>
                    </form>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog >
    );
}
