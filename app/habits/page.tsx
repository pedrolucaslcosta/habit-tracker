import { createClient } from '@/utils/supabase/server';
import HabitsTable from './habits-table';

export default async function Habits() {
    const supabase = await createClient();
    const { data: habits, error } = await supabase.from("habits").select();

    if (error) {
        console.error("Erro ao buscar hábitos:", error);
        return <pre>Erro ao carregar hábitos.</pre>;
    }

    return (
        <>
            <pre>hi {JSON.stringify(habits, null, 2)}</pre>

            <HabitsTable />
        </>
    );
}