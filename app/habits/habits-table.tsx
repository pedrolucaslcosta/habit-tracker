"use client"; // Permite hooks no Next.js App Router

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function HabitsTable() {
    const supabase = createClient();
    const today = new Date();

    // Calcula segunda-feira da semana atual
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Segunda-feira

    // Gera as datas de segunda a domingo (YYYY-MM-DD)
    const weekDates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return date.toISOString().split("T")[0];
    });

    // 🔹 Tipagem correta para evitar erro do TypeScript
    const [habits, setHabits] = useState<{ id: number; title: string }[]>([]);
    const [logs, setLogs] = useState<{ id: number; habit_id: number; timestamp: string; status: boolean }[]>([]);

    useEffect(() => {
        async function fetchData() {
            // Pega hábitos
            const { data: habitsData } = await supabase.from("habits").select("id, title");
            setHabits(habitsData || []);

            // Pega logs da semana
            const { data: logsData } = await supabase
                .from("log")
                .select("id, habit_id, timestamp, status")
                .gte("timestamp", weekDates[0])
                .lte("timestamp", weekDates[6]);

            setLogs(logsData || []);
        }

        fetchData();
    }, []);

    async function toggleStatus(habitId: number, date: string, logEntry?: { id: number; status: boolean }) {
        if (logEntry) {
            // Atualiza log existente
            const { data, error } = await supabase
                .from("log")
                .update({ status: !logEntry.status })
                .eq("id", logEntry.id)
                .select()
                .single();

            if (!error) {
                setLogs((prev) =>
                    prev.map((log) =>
                        log.id === logEntry.id ? { ...log, status: !logEntry.status } : log
                    )
                );
            }
        } else {
            // Cria um novo log se não existir
            const { data, error } = await supabase
                .from("log")
                .insert([{ habit_id: habitId, timestamp: date, status: true }])
                .select()
                .single();

            if (!error && data) {
                setLogs((prev) => [...prev, data]);
            }
        }
    }

    return (
        <div className="overflow-x-auto">
            <table className="table">
                <thead>
                    <tr>
                        <th className="min-w-[40vw] sticky left-0 bg-background">
                        </th>
                        {weekDates.map((date) => (
                            <th key={date}>
                                {date.split("-")[2]}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {habits.map((habit) => (
                        <tr key={habit.id}>
                            <td className="min-w-[40vw] sticky left-0 bg-background">{habit.title}</td>

                            {weekDates.map((date) => {
                                const logEntry = logs.find(
                                    (log) => log.habit_id === habit.id && log.timestamp.startsWith(date)
                                );

                                return (
                                    <td key={date}>
                                        <input
                                            type="checkbox" className="checkbox checkbox-md"
                                            checked={logEntry?.status || false}
                                            onChange={() => toggleStatus(habit.id, date, logEntry)}
                                        />
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
