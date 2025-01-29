import { Calendar1Icon, CalendarIcon, ChartLine, ChartLineIcon, SquareMenuIcon } from "lucide-react";

export default async function BottomNavigation() {
    return (
        <>
            <div className="btm-nav">
                <button className="active">
                    <CalendarIcon></CalendarIcon>
                    Hoje
                </button>
                {/* <button className="">
                    <ChartLineIcon/>
                   Estatísticas
                </button> */}
                <button>
                    <SquareMenuIcon/>
                    Menu
                </button>
            </div>
        </>
    );
}