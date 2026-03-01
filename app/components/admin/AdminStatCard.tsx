import { ReactNode } from "react";
import { Card, CardContent } from "../ui/cards";

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  valueColor?: string;
}

export default function AdminStatCard({
  title,
  value,
  icon,
  valueColor = "text-slate-900",
}: AdminStatCardProps) {
  return (
    <Card className="shadow-sm border-slate-200 hover:shadow-md transition">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className={`text-2xl font-semibold mt-1 ${valueColor}`}>
              {value}
            </p>
          </div>

          {icon && <div className="opacity-80">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
