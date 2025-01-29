// pages/habits.tsx
import { createClient } from "@/utils/supabase/client";

export async function getServerSideProps() {
  const supabase = createClient();
  const { data: habits, error } = await supabase.from("habits").select("*");

  if (error) {
    console.error("Erro ao carregar hábitos:", error);
    return { props: { habits: [] } };
  }

  return {
    props: { habits },
  };
}

const HabitsPage = ({ habits }) => {
  return (
    <div>
      <h1>Meus Hábitos</h1>
      <ul>
        {habits.map((habit) => (
          <li key={habit.id}>{habit.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default HabitsPage;
